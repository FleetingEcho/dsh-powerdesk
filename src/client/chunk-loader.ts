/**
 * Lazy chunk loader for the client bundle. The heavy restty renderer (WASM +
 * WebGPU/WebGL2, several MB) lives in a separate build-time bundle
 * (`lib/client-terminal.js`) fetched only on first terminal-open, so startup
 * downloads/parses only the small core bundle.
 *
 * How a chunk script works (see tsdown.config.ts chunkBundle):
 *
 *   globalThis.__dshPowerdeskChunks__ = globalThis.__dshPowerdeskChunks__ || {};
 *   globalThis.__dshPowerdeskChunks__["terminal"] = (require) => { ...exports };
 *
 * The script registers its factory on a PLUGIN-PRIVATE global registry (NOT
 * the shared `globalThis.__dshChunks__` that dsh-better-sidebar uses, and NOT
 * through window.__ModuleLoader__.load). A private registry is load-bearing:
 * dsh-better-sidebar registers its own chunks (e.g. `__dshChunks__["terminal"]`,
 * `__dshChunks__["editor"]`) on the shared `__dshChunks__` table — sharing it
 * and reusing the name `"terminal"` would let the two plugins overwrite each
 * other's factory under concurrency, so a plugin reading its slot could
 * materialize the OTHER plugin's chunk (wrong exports → broken render).
 * Materialization is plugin-owned:
 *
 * 1. inject <script src="/powerdesk/bundle/<name>.js"> (classic same-origin
 *    script; the official /plugins/<id>/client.js route cannot serve
 *    arbitrary file names, so the plugin's own host route serves the chunk),
 * 2. read the factory from the global registry,
 * 3. call it with a require that resolves the platform externals through
 *    `__DSH_MODULES__.import(spec)` — the seed-word branch, the one part of
 *    the module system that is stable across versions.
 *
 * Caching contract (three layers, each with a failure path):
 * - In-memory: one in-flight promise per chunk, memoized until
 *   {@link resetChunks}; a failed load removes its entry so the next call
 *   retries from scratch.
 * - Script execution: each re-execution overwrites the global registry slot
 *   (assignment, never registration) — no "duplicate factory registration"
 *   class of errors.
 * - HTTP: the bundle route revalidates every request (`cache-control:
 *   no-cache` + ETag, 304 when unchanged).
 *
 * HMR: each plugin activation calls {@link resetChunks}, which drops the
 * in-memory cache, so a hot-reloaded core bundle re-fetches and re-executes
 * the current chunk script on the next lazy open.
 */
/** The chunks built into this plugin's own bundle. */
export type BuiltinChunkName = 'terminal' | 'browser' | 'editor' | 'settings' | 'calendar'

/**
 * A loadable chunk: a built-in name, or `ext:<id>` for a user-installed
 * extension. The `ext:` prefix is what keeps a third-party bundle from
 * claiming a built-in slot — the registry key, the URL, and the tab id all
 * carry it, so an extension called `terminal` is `ext:terminal` everywhere
 * and never collides with the real terminal chunk.
 */
export type ChunkName = BuiltinChunkName | `ext:${string}`

/** The module exports a chunk factory provides (namespace-ish record). */
export type ChunkExports = Record<string, unknown>

/** A chunk factory: (require) => exports (the chunk's CJS closure shape). */
type ChunkFactory = (require: (spec: string) => unknown) => ChunkExports

/**
 * The platform externals a chunk bundle may require (mirror of
 * CLIENT_EXTERNALS in tsdown.config.ts — the chunk keeps these external and
 * the loader resolves them here). A superset is safe: the require only answers
 * what the chunk actually asks for, so an entry the running DSH version cannot
 * seed (e.g. `cordis`, which the terminal/browser chunks never require) is
 * resolved to `undefined` and stays inert.
 */
export const CHUNK_EXTERNALS: readonly string[] = [
  'react',
  'react/jsx-runtime',
  'react-dom',
  'react-dom/client',
  'cordis',
  '@deepseek-ai/dsh-client-ui-slots',
  '@deepseek-ai/dsh-client-ui-primitives',
  '@deepseek-ai/dsh-client-web-react',
  '@deepseek-ai/dsh-client-runtime/client',
]

/**
 * Chunk script endpoint served by the plugin host half (src/bundle-route.ts).
 * Extensions live under a separate `/ext/` path segment so the host can apply
 * a different (config-gated, manifest-resolved) lookup to them without the
 * two families ever sharing a name space.
 */
const CHUNK_URL = (name: ChunkName): string => (
  name.startsWith('ext:')
    ? `/powerdesk/bundle/ext/${name.slice('ext:'.length)}.js`
    : `/powerdesk/bundle/${name}.js`
)

/** The plugin-owned global registry the chunk scripts assign to. */
interface DshChunksRegistry { [name: string]: ChunkFactory | undefined }
function chunkRegistry(): DshChunksRegistry {
  const g = globalThis as unknown as { __dshPowerdeskChunks__?: DshChunksRegistry }
  if (g.__dshPowerdeskChunks__ === undefined) g.__dshPowerdeskChunks__ = {}
  return g.__dshPowerdeskChunks__
}

/** One in-flight chunk load, memoized until success or {@link resetChunks}. */
const cache = new Map<ChunkName, Promise<ChunkExports>>()

/** A test-injectable script loader (default injects a <script src>). */
type ScriptLoader = (url: string) => Promise<void>
const testLoaders = new Map<ChunkName, ScriptLoader>()

/** Inject a classic same-origin <script src> and resolve on load. */
const defaultScriptLoader: ScriptLoader = (url) => new Promise((resolve, reject) => {
  if (typeof document === 'undefined') {
    reject(new Error(`[dsh-powerdesk] chunk script "${url}" cannot load: no document`))
    return
  }
  const script = document.createElement('script')
  script.src = url
  script.async = true
  script.onload = () => resolve()
  script.onerror = () => {
    script.remove()
    reject(new Error(`[dsh-powerdesk] chunk script "${url}" failed to load`))
  }
  document.head.appendChild(script)
})

/**
 * Resolve the platform externals through the shared module table (the
 * `__DSH_MODULES__.import(spec)` seed-word branch) and return a SYNCHRONOUS
 * require the chunk factory can use. The chunk body does `let react =
 * require("react")` synchronously, so every external must be pre-resolved
 * before the factory runs (mirrors dsh-better-sidebar's working loader).
 *
 * `await` is used even though N3.import is currently synchronous: the module
 * table contract is allowed to return a Promise for some specs, and awaiting
 * a non-thenable is a no-op — so this is robust to either shape without the
 * chunk body having to await.
 *
 * React interop: some module-system shapes hand back a pure-ESM namespace
 * `{ default: React }` without the CJS named exports (`useRef` etc.) on the
 * root. The chunk body calls `react.useRef` expecting CJS shape, so if the
 * resolved react lacks `useRef` but `default.useRef` exists, unwrap to
 * `default`. A one-time diagnostic logs which shape was seen.
 */
async function buildExternalsRequire(modules: { import: (spec: string) => unknown }): Promise<(spec: string) => unknown> {
  let diagnosed = false
  // Per-spec tolerance (mirrors dsh-better-sidebar's proven loader): a spec the
  // running DSH version cannot resolve — e.g. `cordis`, which the terminal/
  // browser chunks never actually require — stays `undefined` in the table
  // and is only a loud error if a chunk body calls `require(spec)` for it.
  // The chunks in practice only require `react` + `react/jsx-runtime`, both of
  // which DSH seeds, so the unresolved rows are inert.
  const entries = await Promise.all(CHUNK_EXTERNALS.map(async (spec): Promise<[string, unknown]> => {
    let mod: unknown
    try {
      mod = await modules.import(spec)
    } catch {
      return [spec, undefined]
    }
    if (spec === 'react' && mod != null && typeof (mod as { useRef?: unknown }).useRef !== 'function') {
      const def = (mod as { default?: { useRef?: unknown } }).default
      if (def != null && typeof def.useRef === 'function') {
        if (!diagnosed) {
          diagnosed = true
          console.warn('[dsh-powerdesk] react interop: require("react") returned an ESM-style namespace {default}; unwrapping .default so react.useRef resolves. keys=', Object.keys(mod as object).slice(0, 12))
        }
        mod = def
      } else if (!diagnosed) {
        diagnosed = true
        console.warn('[dsh-powerdesk] react interop: require("react") has no useRef on root or .default. keys=', Object.keys(mod as object).slice(0, 12), 'useRef=', typeof (mod as { useRef?: unknown }).useRef, 'default.useRef=', def == null ? 'no-default' : typeof def.useRef)
      }
    }
    return [spec, mod]
  }))
  const table = new Map<string, unknown>(entries)
  return (spec: string): unknown => {
    if (table.has(spec)) return table.get(spec)
    // A non-external require from a chunk should never happen (the chunk inlines
    // everything else); surface it loudly rather than returning undefined.
    throw new Error(`[dsh-powerdesk] chunk require of non-external "${spec}"`)
  }
}

/**
 * Install a test loader for a chunk (tests drive the factory directly instead
 * of injecting a real <script>). Cleared by {@link resetChunks}.
 */
export function setChunkLoader(name: ChunkName, loader: ScriptLoader): void {
  testLoaders.set(name, loader)
}

/**
 * Load a chunk's exports (in-flight memoized; re-fetches on failure). The
 * core client.js never statically imports this module's consumers — restty
 * only downloads/parses when a terminal tab is first opened.
 */
export function loadChunk(name: ChunkName): Promise<ChunkExports> {
  const existing = cache.get(name)
  if (existing !== undefined) return existing
  const task = (async (): Promise<ChunkExports> => {
    const modules = (globalThis as { __DSH_MODULES__?: { import: (spec: string) => unknown } }).__DSH_MODULES__
    if (modules === undefined || typeof modules.import !== 'function') {
      throw new Error(`[dsh-powerdesk] chunk "${name}": client module system unavailable`)
    }
    const loader = testLoaders.get(name) ?? defaultScriptLoader
    await loader(CHUNK_URL(name))
    const factory = chunkRegistry()[name]
    if (typeof factory !== 'function') {
      throw new Error(`[dsh-powerdesk] chunk "${name}" script did not register its factory`)
    }
    const require = await buildExternalsRequire(modules)
    return factory(require)
  })()
  cache.set(name, task)
  void task.catch(() => { cache.delete(name) })
  return task
}

/**
 * Forget one chunk so the next open re-fetches and re-executes it. Used when
 * an extension is reinstalled: the bundle route revalidates by ETag, so the
 * changed script is re-downloaded, and re-execution overwrites the registry
 * slot with the new factory. Without this the memoized promise would keep
 * serving the previous install's exports for the life of the page.
 */
export function dropChunk(name: ChunkName): void {
  cache.delete(name)
}

/**
 * Drop all chunk state for a fresh plugin activation (HMR-safe): clear the
 * in-memory cache and any test-registry entries, so the next lazy open
 * re-fetches and re-executes the current chunk script.
 */
export function resetChunks(): void {
  cache.clear()
  testLoaders.clear()
}
