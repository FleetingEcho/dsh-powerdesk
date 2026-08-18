/**
 * Rust SQLite (napi-rs + rusqlite bundled) dependency loading for the host
 * half. Mirrors {@link src/rust-pty-deps.ts} in shape (candidate resolution
 * order, a one-shot cache, a structured deps-status + repair-command surface)
 * and reuses its shared helpers (detectPlatformTriple / findPluginRoot /
 * findProfileDir / buildRepairCommand) so the two loaders stay in lockstep.
 *
 * The calendar surfaces need the native `dsh-powerdesk-sqlite` module, but the
 * package must NEVER import it statically at module top level: a missing or
 * broken native binding would then fail the plugin module load and — because
 * a loader entry apply failure aborts the boot — take the whole `dsh web`
 * server down with it. Instead the host half loads it lazily (synchronously,
 * via createRequire) on first calendar use; on failure the calendar tab shows
 * a friendly error carrying a pasteable repair command.
 *
 * Binary distribution mirrors the PTY crate's "commit it, no install-time
 * scripts" convention: prebuilt/<triple>/dsh_powerdesk_sqlite.node is fetched
 * by scripts/install.sh (or built by scripts/build-rust-sqlite.sh). The loader
 * resolves one of, in order:
 *  1. `DSH_POWERDESK_SQLITE_PATH` — an explicit absolute path to the `.node`;
 *  2. the companion package `@dsh-powerdesk-sqlite/<triple>` (optionalDependencies
 *     when the plugin is published with per-platform companion packages);
 *  3. `prebuilt/<triple>/dsh_powerdesk_sqlite.node` next to the plugin.
 * The triple is derived from `process.platform` / `process.arch` / libc and
 * can be overridden with `DSH_POWERDESK_SQLITE_TRIPLE` (e.g. for musl
 * `linux-x64-musl`).
 */
import { createRequire } from 'node:module'
import { join } from 'node:path'
import {
  buildRepairCommand,
  detectPlatformTriple,
  findPluginRoot,
  findProfileDir,
} from './rust-pty-deps.ts'
import { ResttyError } from './wire.ts'

/** The crate version this plugin ships (keep in sync with rust-sqlite/Cargo.toml). */
export const DSH_POWERDESK_SQLITE_VERSION = '0.1.0'

/**
 * The error marker the host sends when the native sqlite module is
 * unavailable. The calendar tab recognizes this and fetches the full repair
 * details from `/powerdesk/api/calendar.deps`.
 */
export const SQLITE_DEPS_MISSING = 'powerdesk-sqlite-deps-missing'

/** A require-compatible loader, injectable for tests. */
export type NativeRequire = (id: string) => unknown

const defaultRequire: NativeRequire = createRequire(import.meta.url)

/** The native Database instance surface the crate exposes (see rust-sqlite/src/lib.rs). */
export interface RustSqliteDatabase {
  /** Run one or more semicolon-separated SQL statements (DDL/migrations). */
  exec(sql: string): void
  /** Run a parameterised statement; returns the number of rows changed. */
  run(sql: string, params?: unknown[]): number
  /** Run a parameterised SELECT; returns rows as objects keyed by column name. */
  query<T = Record<string, unknown>>(sql: string, params?: unknown[]): T[]
  /** Close the connection; further calls error. */
  close(): void
}

/** The native module surface (a single class with a static `open` factory). */
export interface RustSqliteModule {
  Database: { open(path: string): RustSqliteDatabase }
}

type LoadResult = { ok: true; module: RustSqliteModule } | { ok: false; cause: unknown }

let cached: LoadResult | undefined

/** The napi binary file name the build produces (napi-rs default naming). */
const NATIVE_BASENAME = 'dsh_powerdesk_sqlite.node'

/**
 * Resolve the platform triple for the running process, honoring the
 * sqlite-specific `DSH_POWERDESK_SQLITE_TRIPLE` override (mapped onto the
 * shared helper's expected env key so the detection logic isn't duplicated).
 */
export function detectSqliteTriple(
  platform: NodeJS.Platform = process.platform,
  arch: string = process.arch,
  env: NodeJS.ProcessEnv = process.env,
): string {
  const override = env.DSH_POWERDESK_SQLITE_TRIPLE
  const mappedEnv: NodeJS.ProcessEnv = {
    ...env,
    DSH_POWERDESK_PTY_TRIPLE: typeof override === 'string' && override.trim() !== '' ? override.trim() : env.DSH_POWERDESK_PTY_TRIPLE,
  }
  return detectPlatformTriple(platform, arch, mappedEnv)
}

/**
 * The candidate require specifiers / file paths for the native module, in
 * resolution order (env path → companion package → prebuilt next to plugin).
 * Exposed for tests.
 */
export function sqliteCandidates(
  triple: string,
  pluginRoot: string | null,
  env: NodeJS.ProcessEnv = process.env,
): readonly string[] {
  const candidates: string[] = []
  const envPath = env.DSH_POWERDESK_SQLITE_PATH
  if (typeof envPath === 'string' && envPath.trim() !== '') candidates.push(envPath.trim())
  candidates.push(`@dsh-powerdesk-sqlite/${triple}`)
  if (pluginRoot !== null) candidates.push(join(pluginRoot, 'prebuilt', triple, NATIVE_BASENAME))
  return candidates
}

/**
 * Load the native sqlite module once (synchronously) and cache the outcome.
 * Returns null when the module or its native binding cannot be loaded; the
 * cause stays queryable through {@link rustSqliteLoadCause}. Never throws.
 */
export function loadRustSqlite(requireImpl: NativeRequire = defaultRequire): RustSqliteModule | null {
  if (cached === undefined) {
    const triple = detectSqliteTriple()
    const pluginRoot = findPluginRoot()
    const candidates = sqliteCandidates(triple, pluginRoot)
    let result: LoadResult = { ok: false, cause: new Error(`no native sqlite candidate for triple "${triple}"`) }
    for (const spec of candidates) {
      try {
        const mod = requireImpl(spec) as Partial<RustSqliteModule> & { default?: Partial<RustSqliteModule> }
        const surface = (mod?.Database !== undefined ? mod : mod.default) ?? mod
        if (surface !== undefined && typeof surface.Database?.open === 'function') {
          result = { ok: true, module: surface as RustSqliteModule }
          break
        }
        result = { ok: false, cause: new Error(`native module "${spec}" has no Database.open export`) }
      } catch (cause) {
        result = { ok: false, cause }
      }
    }
    cached = result
  }
  return cached.ok ? cached.module : null
}

/** The recorded load failure (undefined when the load succeeded or never ran). */
export function rustSqliteLoadCause(): unknown {
  return cached !== undefined && !cached.ok ? cached.cause : undefined
}

/** Forget the cached outcome (tests only — a real reload is otherwise one-shot). */
export function resetRustSqliteCache(): void {
  cached = undefined
}

/** Load the native sqlite module or throw the canonical degraded-mode error. */
export function loadRequiredRustSqlite(): RustSqliteModule {
  const module = loadRustSqlite()
  if (module === null) {
    const cause = describeCause(rustSqliteLoadCause())
    throw new ResttyError(
      'sqlite-deps-missing',
      `dsh-powerdesk-sqlite (${DSH_POWERDESK_SQLITE_VERSION}) failed to load: ${cause} — run the repair command shown in the calendar tab`,
      503,
    )
  }
  return module
}

/** One-line human description of the recorded load cause. */
function describeCause(cause: unknown): string {
  if (cause instanceof Error) return cause.message
  if (cause === undefined) return 'native module not found'
  return String(cause)
}

/** Structured status served by the `/powerdesk/api/calendar.deps` endpoint. */
export type RustSqliteDepsStatus =
  | { ok: true }
  | {
    ok: false
    /** The load-time error message (module missing, native binding broken…). */
    cause: string
    /** The pasteable repair command (terminal/cmd). */
    command: string
    /** The detected profile name (null when undetected → the command defaults to web). */
    profile: string | null
    /** Optional supplementary hint (fallback command only). */
    note?: string
  }

/** Current native sqlite dependency status (loaded vs degraded + repair info). */
export function sqliteDepsStatus(options: { fromFile?: string } = {}): RustSqliteDepsStatus {
  const module = loadRustSqlite()
  if (module !== null) return { ok: true }
  const pluginRoot = findPluginRoot(options.fromFile)
  const profileDir = findProfileDir(options.fromFile)
  const { command, note } = buildRepairCommand({ pluginRoot, profileDir })
  return {
    ok: false,
    cause: describeCause(rustSqliteLoadCause()),
    command,
    profile: profileDir !== null ? profileDir.split(/[/\\]/).pop() ?? null : null,
    ...(note !== undefined
      ? { note: 'the SQLite native binary could not be located. Run scripts/install.sh --repair (re-downloads the platform prebuilt) or bash scripts/build-rust-sqlite.sh (builds from source with a Rust toolchain), then restart DSH.' }
      : {}),
  }
}

// Re-export the shared helpers calendar-api.ts also needs (single import site).
export { findProfileDir, findPluginRoot } from './rust-pty-deps.ts'
