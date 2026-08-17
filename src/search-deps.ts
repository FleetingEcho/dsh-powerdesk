/**
 * Ripgrep dependency resolution for the Search tab's host half. Mirrors
 * `src/rust-pty-deps.ts`'s shape closely (candidate resolution order, a
 * one-shot cache, a structured deps-status + repair-command surface), but
 * `rg` is a plain spawnable executable rather than a napi `.node` addon, so
 * resolution is simpler and gets one extra fallback the PTY loader cannot
 * have: a `rg` already on PATH (Homebrew/Cargo/VSCode users often have one).
 *
 * Binary distribution mirrors the PTY binary's "commit it, no install-time
 * scripts" convention: prebuilt/<triple>/rg is fetched from ripgrep's own
 * GitHub releases and committed to git (see scripts/install.sh), never
 * downloaded via an npm postinstall — pnpm-based installs (including this
 * plugin's own `dsh plugin add` flow) often skip dependency postinstall
 * scripts by default, which is exactly why the PTY binary avoids that path.
 */
import { existsSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { join } from 'node:path'
import { detectPlatformTriple, findPluginRoot, findProfileDir, buildRepairCommand } from './rust-pty-deps.ts'

/** The ripgrep binary's basename per platform (napi-rs-style `.exe` suffix on Windows). */
const RIPGREP_BASENAME = (platform: NodeJS.Platform = process.platform): string => (
  platform === 'win32' ? 'rg.exe' : 'rg'
)

type LoadResult = { ok: true; path: string } | { ok: false; cause: unknown }

let cached: LoadResult | undefined

/**
 * The candidate paths/specifiers for the `rg` binary, in resolution order:
 * an explicit env override, the prebuilt binary shipped next to the plugin,
 * then a plain `rg` on PATH. Exposed for tests.
 */
export function ripgrepCandidates(
  triple: string,
  pluginRoot: string | null,
  env: NodeJS.ProcessEnv = process.env,
  platform: NodeJS.Platform = process.platform,
): readonly string[] {
  const candidates: string[] = []
  const envPath = env.DSH_POWERDESK_RG_PATH
  if (typeof envPath === 'string' && envPath.trim() !== '') candidates.push(envPath.trim())
  if (pluginRoot !== null) candidates.push(join(pluginRoot, 'prebuilt', triple, RIPGREP_BASENAME(platform)))
  candidates.push(RIPGREP_BASENAME(platform))
  return candidates
}

/** A probe function: whether `spec` resolves to a runnable `rg`. Injectable for tests. */
export type RipgrepProber = (spec: string) => boolean

/** Default prober: an existing file for a path-like spec, a PATH lookup (via
 *  an actual spawn — cheap, `rg --version` exits in a few ms) for a bare name. */
export const defaultRipgrepProber: RipgrepProber = (spec) => {
  try {
    if (spec.includes('/') || spec.includes('\\')) return existsSync(spec)
    execFileSync(spec, ['--version'], { stdio: 'ignore' })
    return true
  } catch {
    return false
  }
}

/**
 * Resolve the `rg` binary path once (synchronously) and cache the outcome.
 * Returns null when no candidate resolves; never throws.
 */
export function resolveRipgrepPath(prober: RipgrepProber = defaultRipgrepProber): string | null {
  if (cached === undefined) {
    const triple = detectPlatformTriple()
    const pluginRoot = findPluginRoot()
    const candidates = ripgrepCandidates(triple, pluginRoot)
    let result: LoadResult = { ok: false, cause: new Error(`no ripgrep candidate for triple "${triple}"`) }
    for (const spec of candidates) {
      if (prober(spec)) {
        result = { ok: true, path: spec }
        break
      }
    }
    cached = result
  }
  return cached.ok ? cached.path : null
}

/** The recorded resolution failure (undefined once a candidate resolves). */
export function ripgrepLoadCause(): unknown {
  return cached !== undefined && !cached.ok ? cached.cause : undefined
}

/** Forget the cached outcome (tests only). */
export function resetRipgrepCache(): void {
  cached = undefined
}

/** Structured status served by the `/powerdesk/api/search.deps` endpoint. */
export type RipgrepDepsStatus =
  | { ok: true }
  | {
    ok: false
    /** Why no `rg` candidate resolved. */
    cause: string
    /** The pasteable repair command (terminal/cmd). */
    command: string
    /** The detected profile name (null when undetected → the command defaults to web). */
    profile: string | null
    /** Optional supplementary hint (fallback command only). */
    note?: string
  }

/** Current ripgrep dependency status (resolved vs missing + repair info). */
export function searchDepsStatus(options: { fromFile?: string } = {}): RipgrepDepsStatus {
  if (resolveRipgrepPath() !== null) return { ok: true }
  const pluginRoot = findPluginRoot(options.fromFile)
  const profileDir = findProfileDir(options.fromFile)
  const { command, note } = buildRepairCommand({ pluginRoot, profileDir })
  const cause = ripgrepLoadCause()
  return {
    ok: false,
    cause: cause instanceof Error ? cause.message : String(cause),
    command,
    profile: profileDir !== null ? profileDir.split(/[/\\]/).pop() ?? null : null,
    // buildRepairCommand's own note (when set) is PTY-flavored; the command
    // it builds is generic (points at install.sh --repair either way, which
    // now also fetches rg), so only the copy needs a ripgrep-specific swap.
    ...(note !== undefined
      ? { note: 'ripgrep could not be located. Run scripts/install.sh --repair (re-downloads the platform prebuilt), then restart DSH.' }
      : {}),
  }
}
