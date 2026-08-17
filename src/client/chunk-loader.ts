/**
 * Lazy chunk loader for the client bundle. The heavy restty renderer (WASM +
 * WebGPU/WebGL2, several MB) lives in a separate build-time bundle
 * (`lib/client-terminal.js`) fetched only on first terminal-open, so startup
 * downloads/parses only the small core bundle.
 *
 * How a chunk script works (see tsdown.config.ts chunkBundle):
 *
 *   globalThis.__dshChunks__ = globalThis.__dshChunks__ || {};
 *   globalThis.__dshChunks__["terminal"] = (require) => { ...exports };
 *
 * The script registers its factory on a plugin-owned global registry (NOT
 * through window.__ModuleLoader__.load). Materialization is plugin-owned:
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
export type ChunkName = 'terminal'

/** The module exports a chunk factory provides (namespace-ish record). */
export type ChunkExports = Record<string, unknown>

/** A chunk factory: (require) => exports (the chunk's CJS closure shape). */
type ChunkFactory = (require: (spec: string) => unknown) => ChunkExports

/**
 * The platform externals a chunk bundle may require (mirror of
 * CLIENT_EXTERNALS in tsdown.config.ts — the chunk keeps these external and
 * the loader resolves them here).
 */
export const CHUNK_EXTERNALS: readonly string[] = [
  'react',
  'react/jsx-runtime',
  'react-dom',
  'react-dom/client',
  'cordis',
  '@deepseek-ai/dsh-client-ui-slots',
  '@deepseek-ai/dsh-client-web-react',
  '@deepseek-ai/dsh-client-runtime/client',
]

/** Chunk script endpoint served by the plugin host half (src/bundle-route.ts). */
const CHUNK_URL = (name: ChunkName): string => `/powerdesk/bundle/${name}.js`

/** The plugin-owned global registry the chunk scripts assign to. */
interface DshChunksRegistry { [name: string]: ChunkFactory | undefined }
function chunkRegistry(): DshChunksRegistry {
  const g = globalThis as unknown as { __dshChunks__?: DshChunksRegistry }
  if (g.__dshChunks__ === undefined) g.__dshChunks__ = {}
  return g.__dshChunks__
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

/** Resolve a platform external through the shared module table (seed-word branch). */
function buildExternalsRequire(modules: { import: (spec: string) => unknown }): (spec: string) => unknown {
  return (spec: string): unknown => {
    if (CHUNK_EXTERNALS.includes(spec)) {
      try {
        return modules.import(spec)
      } catch (cause) {
        throw new Error(`[dsh-powerdesk] chunk external "${spec}" is not available in the module table`, { cause })
      }
    }
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
    const require = buildExternalsRequire(modules)
    return factory(require)
  })()
  cache.set(name, task)
  void task.catch(() => { cache.delete(name) })
  return task
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
