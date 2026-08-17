/**
 * Rust PTY (napi-rs + portable-pty) dependency loading for the host half.
 *
 * The terminal surfaces need the native `dsh-powerdesk-pty` module, but the
 * package must NEVER be imported statically at module top level: a missing
 * or broken native binding (a pruned prebuilt, a wrong-platform binary, a
 * failed `cargo build`, an AppArmor denial…) would then fail the plugin
 * module load and — because a loader entry apply failure aborts the boot —
 * take the whole `dsh web` server down with it.
 *
 * Instead the host half loads the native module lazily (synchronously, via
 * createRequire). When the load fails the plugin stays mounted in a
 * degraded state: the terminal shows a friendly error carrying a pasteable
 * repair command (see scripts/install.sh `--repair` / scripts/build-rust.sh),
 * and the /powerdesk/ws/terminal upgrade closes with the short marker so the
 * client fetches the full details from /powerdesk/api/terminal.deps.
 *
 * Binary distribution: the crate builds per-platform napi binaries. The
 * loader resolves one of, in order:
 *  1. `DSH_POWERDESK_PTY_PATH` — an explicit absolute path to the `.node` file;
 *  2. the companion package `@dsh-powerdesk-pty/<triple>` (optionalDependencies
 *     when the plugin is published with per-platform companion packages);
 *  3. `prebuilt/<triple>/dsh_powerdesk_pty.node` next to the plugin (fetched by
 *     scripts/install.sh, or built by scripts/build-rust.sh).
 * The triple is derived from `process.platform` / `process.arch` / libc and
 * can be overridden with `DSH_POWERDESK_PTY_TRIPLE` (e.g. for musl `linux-x64-musl`).
 */
import { existsSync, readFileSync, realpathSync } from 'node:fs'
import { createRequire } from 'node:module'
import { homedir } from 'node:os'
import { basename, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { RustPtyModule } from './rust-pty.ts'
import { ResttyError } from './wire.ts'

/** The crate version this plugin ships (keep in sync with rust/Cargo.toml). */
export const DSH_POWERDESK_PTY_VERSION = '0.1.0'

/**
 * The WebSocket close-code-1011 reason the host sends when the native pty
 * module is unavailable. The client recognizes this exact marker and fetches
 * the full repair details from `/powerdesk/api/terminal.deps` (a WS close reason
 * is capped at 123 bytes, so the command itself cannot ride the close frame).
 */
export const PTY_DEPS_MISSING = 'powerdesk-pty-deps-missing'

/** A require-compatible loader, injectable for tests. */
export type NativeRequire = (id: string) => unknown

const defaultRequire: NativeRequire = createRequire(import.meta.url)

type LoadResult = { ok: true; module: RustPtyModule } | { ok: false; cause: unknown }

let cached: LoadResult | undefined

/** The napi binary file name the build produces (napi-rs default naming). */
const NATIVE_BASENAME = 'dsh_powerdesk_pty.node'

/**
 * Resolve the platform triple for the running process. Linux defaults to the
 * gnu ABI (the common case); override with `DSH_POWERDESK_PTY_TRIPLE` for musl
 * (e.g. Alpine: `linux-x64-musl`).
 */
export function detectPlatformTriple(
  platform: NodeJS.Platform = process.platform,
  arch: string = process.arch,
  env: NodeJS.ProcessEnv = process.env,
): string {
  const override = env.DSH_POWERDESK_PTY_TRIPLE
  if (typeof override === 'string' && override.trim() !== '') return override.trim()
  if (platform === 'win32') {
    return arch === 'arm64' ? 'win32-arm64-msvc' : 'win32-x64-msvc'
  }
  if (platform === 'darwin') {
    return arch === 'arm64' ? 'darwin-arm64' : 'darwin-x64'
  }
  if (platform === 'linux') {
    const abi = arch === 'arm64' ? 'arm64-gnu' : 'x64-gnu'
    return `linux-${abi}`
  }
  // Unknown platform: let the caller override via DSH_POWERDESK_PTY_TRIPLE.
  return `${platform}-${arch}`
}

/** Resolve a directory to its physical location (symlinked/link: installs). */
function realDir(file: string): string {
  try {
    return dirname(realpathSync(file))
  } catch {
    return dirname(file)
  }
}

/** Walk up from `dir` looking for a DSH profile root (package.json + pnpm-workspace.yaml). */
function walkUp(dir: string, isRoot: (dir: string) => boolean): string | null {
  let current = dir
  for (let depth = 0; depth < 16; depth += 1) {
    if (isRoot(current)) return current
    const parent = dirname(current)
    if (parent === current) break
    current = parent
  }
  return null
}

/** Whether `dir` looks like a DSH profile root. */
function isProfileRoot(dir: string): boolean {
  return existsSync(join(dir, 'package.json')) && existsSync(join(dir, 'pnpm-workspace.yaml'))
}

/** Whether `dir`'s package.json declares this plugin's name. */
function isPluginRoot(dir: string): boolean {
  const file = join(dir, 'package.json')
  if (!existsSync(file)) return false
  try {
    const parsed = JSON.parse(readFileSync(file, 'utf8')) as { name?: unknown }
    return parsed.name === 'dsh-powerdesk'
  } catch {
    return false
  }
}

/** The plugin package root (walk-up from the module; works for lib/ and src/ layouts). */
export function findPluginRoot(fromFile: string = fileURLToPath(import.meta.url)): string | null {
  return walkUp(realDir(fromFile), isPluginRoot)
}

/** The DSH profile directory this plugin is installed into (null when undetected). */
export function findProfileDir(fromFile: string = fileURLToPath(import.meta.url)): string | null {
  const detected = walkUp(realDir(fromFile), isProfileRoot)
  if (detected !== null) return detected
  const home = process.env.DSH_HOME !== undefined && process.env.DSH_HOME.trim() !== ''
    ? process.env.DSH_HOME
    : join(homedir(), '.dsh')
  const web = join(home, 'profiles', 'web')
  return isProfileRoot(web) ? realpathSync(web) : null
}

/**
 * The candidate require specifiers / file paths for the native module, in
 * resolution order (env path → companion package → prebuilt next to plugin).
 * Exposed for tests.
 */
export function nativeCandidates(
  triple: string,
  pluginRoot: string | null,
  env: NodeJS.ProcessEnv = process.env,
): readonly string[] {
  const candidates: string[] = []
  const envPath = env.DSH_POWERDESK_PTY_PATH
  if (typeof envPath === 'string' && envPath.trim() !== '') candidates.push(envPath.trim())
  candidates.push(`@dsh-powerdesk-pty/${triple}`)
  if (pluginRoot !== null) candidates.push(join(pluginRoot, 'prebuilt', triple, NATIVE_BASENAME))
  return candidates
}

/**
 * Load the native pty module once (synchronously) and cache the outcome.
 * Returns null when the module or its native binding cannot be loaded; the
 * cause stays queryable through {@link rustPtyLoadCause}. Never throws.
 */
export function loadRustPty(requireImpl: NativeRequire = defaultRequire): RustPtyModule | null {
  if (cached === undefined) {
    const triple = detectPlatformTriple()
    const pluginRoot = findPluginRoot()
    const candidates = nativeCandidates(triple, pluginRoot)
    let result: LoadResult = { ok: false, cause: new Error(`no native pty candidate for triple "${triple}"`) }
    for (const spec of candidates) {
      try {
        // The companion package re-exports the native module; the prebuilt
        // path loads the .node file directly. Both surface as a module with
        // a `spawn` function (the crate's #[napi] export).
        const mod = requireImpl(spec) as Partial<RustPtyModule> & { default?: Partial<RustPtyModule> }
        const surface = (typeof mod.spawn === 'function' ? mod : mod.default) ?? mod
        if (surface !== undefined && typeof surface.spawn === 'function') {
          result = { ok: true, module: surface as RustPtyModule }
          break
        }
        // A loaded-but-wrong-shape module: keep the cause informative.
        result = { ok: false, cause: new Error(`native module "${spec}" has no spawn() export`) }
      } catch (cause) {
        result = { ok: false, cause }
        // try the next candidate
      }
    }
    cached = result
  }
  return cached.ok ? cached.module : null
}

/** The recorded load failure (undefined when the load succeeded or never ran). */
export function rustPtyLoadCause(): unknown {
  return cached !== undefined && !cached.ok ? cached.cause : undefined
}

/** Forget the cached outcome (tests only — a real reload is otherwise one-shot). */
export function resetRustPtyCache(): void {
  cached = undefined
}

/** Load the native pty module or throw the canonical degraded-mode error. */
export function loadRequiredRustPty(): RustPtyModule {
  const module = loadRustPty()
  if (module === null) {
    const cause = describeCause(rustPtyLoadCause())
    throw new ResttyError(
      'pty-deps-missing',
      `dsh-powerdesk-pty (${DSH_POWERDESK_PTY_VERSION}) failed to load: ${cause} — run the repair command shown in the terminal tab`,
      503,
    )
  }
  return module
}

/** Options for {@link buildRepairCommand}. */
export interface RepairCommandOptions {
  pluginRoot: string | null
  profileDir: string | null
  platform?: NodeJS.Platform
}

/**
 * The pasteable repair command for a broken native pty install: rerun the
 * plugin's installer in `--repair` mode (idempotent: it re-downloads the
 * platform prebuilt, or rebuilds from source when a Rust toolchain is
 * present). Falls back to the from-source build script when the installer is
 * not shipped (exotic layouts).
 */
export function buildRepairCommand(options: RepairCommandOptions): { command: string; note?: string } {
  const { pluginRoot, profileDir } = options
  const platform = options.platform ?? process.platform
  const profileName = profileDir !== null ? basename(profileDir) : null
  const profileArg = profileName !== null
    ? (platform === 'win32' ? ` -Profile "${profileName}"` : ` --profile "${profileName}"`)
    : ''
  if (pluginRoot !== null) {
    if (platform === 'win32') {
      const script = join(pluginRoot, 'scripts', 'install.ps1')
      if (existsSync(script)) {
        return { command: `powershell -ExecutionPolicy Bypass -File "${script}" -Repair${profileArg}` }
      }
    } else {
      const script = join(pluginRoot, 'scripts', 'install.sh')
      if (existsSync(script)) {
        return { command: `bash "${script}" --repair${profileArg}` }
      }
    }
  }
  const name = profileName ?? 'web'
  return {
    command: `dsh plugin --profile "${name}" install`,
    note: 'The native pty binary could not be located. Run scripts/install.sh --repair (re-downloads the platform prebuilt) or scripts/build-rust.sh (builds from source with a Rust toolchain), then restart DSH.',
  }
}

/** One-line human description of the recorded load cause. */
function describeCause(cause: unknown): string {
  if (cause instanceof Error) return cause.message
  return String(cause)
}

/** Structured status served by the `/powerdesk/api/terminal.deps` endpoint. */
export type RustPtyDepsStatus =
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

/** Current native pty dependency status (loaded vs degraded + repair info). */
export function depsStatus(options: { fromFile?: string } = {}): RustPtyDepsStatus {
  const module = loadRustPty()
  if (module !== null) return { ok: true }
  const pluginRoot = findPluginRoot(options.fromFile)
  const profileDir = findProfileDir(options.fromFile)
  const { command, note } = buildRepairCommand({ pluginRoot, profileDir })
  return {
    ok: false,
    cause: describeCause(rustPtyLoadCause()),
    command,
    profile: profileDir !== null ? basename(profileDir) : null,
    ...(note !== undefined ? { note } : {}),
  }
}
