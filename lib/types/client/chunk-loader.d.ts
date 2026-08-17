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
export type BuiltinChunkName = 'terminal' | 'browser' | 'editor' | 'settings';
/**
 * A loadable chunk: a built-in name, or `ext:<id>` for a user-installed
 * extension. The `ext:` prefix is what keeps a third-party bundle from
 * claiming a built-in slot — the registry key, the URL, and the tab id all
 * carry it, so an extension called `terminal` is `ext:terminal` everywhere
 * and never collides with the real terminal chunk.
 */
export type ChunkName = BuiltinChunkName | `ext:${string}`;
/** The module exports a chunk factory provides (namespace-ish record). */
export type ChunkExports = Record<string, unknown>;
/**
 * The platform externals a chunk bundle may require (mirror of
 * CLIENT_EXTERNALS in tsdown.config.ts — the chunk keeps these external and
 * the loader resolves them here). A superset is safe: the require only answers
 * what the chunk actually asks for, so an entry the running DSH version cannot
 * seed (e.g. `cordis`, which the terminal/browser chunks never require) is
 * resolved to `undefined` and stays inert.
 */
export declare const CHUNK_EXTERNALS: readonly string[];
/** A test-injectable script loader (default injects a <script src>). */
type ScriptLoader = (url: string) => Promise<void>;
/**
 * Install a test loader for a chunk (tests drive the factory directly instead
 * of injecting a real <script>). Cleared by {@link resetChunks}.
 */
export declare function setChunkLoader(name: ChunkName, loader: ScriptLoader): void;
/**
 * Load a chunk's exports (in-flight memoized; re-fetches on failure). The
 * core client.js never statically imports this module's consumers — restty
 * only downloads/parses when a terminal tab is first opened.
 */
export declare function loadChunk(name: ChunkName): Promise<ChunkExports>;
/**
 * Forget one chunk so the next open re-fetches and re-executes it. Used when
 * an extension is reinstalled: the bundle route revalidates by ETag, so the
 * changed script is re-downloaded, and re-execution overwrites the registry
 * slot with the new factory. Without this the memoized promise would keep
 * serving the previous install's exports for the life of the page.
 */
export declare function dropChunk(name: ChunkName): void;
/**
 * Drop all chunk state for a fresh plugin activation (HMR-safe): clear the
 * in-memory cache and any test-registry entries, so the next lazy open
 * re-fetches and re-executes the current chunk script.
 */
export declare function resetChunks(): void;
export {};
