/**
 * Host-side content search for the Search tab: shells out to the resolved
 * `rg` binary (see search-deps.ts) and parses its `--json` (NDJSON) output.
 * Mounted under `/powerdesk/api/search.*` in src/index.ts, same trust fence
 * and buffered-JSON-request/response convention as fs-api.ts's routes.
 *
 * No path sandboxing beyond `resolve()` — same rationale as fs-api.ts: a
 * user with access to this plugin already has unrestricted local filesystem
 * access via the terminal, so restricting search more tightly would be
 * theater, not security.
 *
 * A hard result cap (MAX_MATCHES) and wall-clock timeout (TIMEOUT_MS) stand
 * in for real streaming/cancellation infra, matching this codebase's
 * established "just cap it" convention (see fs-api.ts's FS_READ_LIMIT /
 * MD_TREE_MAX_NODES) rather than building a WebSocket route for this.
 */
import { spawn } from 'node:child_process'
import { resolve as resolvePath } from 'node:path'
import { ResttyError } from './wire.ts'
import { resolveRipgrepPath } from './search-deps.ts'

export interface SearchMatch {
  line: number
  text: string
  /** [start, end) byte offsets of each matched run within `text`. */
  ranges: [number, number][]
}

export interface SearchFileResult {
  path: string
  matches: SearchMatch[]
}

export interface SearchGrepResult {
  files: SearchFileResult[]
  /** True when MAX_MATCHES or TIMEOUT_MS cut the search short. */
  truncated: boolean
}

/** The search box's modifier toggles (VSCode's "Aa" / "ab" / ".*"). */
export interface SearchOptions {
  /** "Aa" — case-sensitive. Off (default) is case-INsensitive (`rg -i`); rg
   *  is case-sensitive by default, so "on" needs no extra flag. */
  matchCase?: boolean
  /** "ab" (underlined) — whole-word only (`rg -w`). */
  wholeWord?: boolean
  /** ".*" — treat `query` as a regex (rg's own default). Off (default)
   *  treats it as a literal string (`rg -F`) — matches VSCode's default
   *  (plain-text search unless you opt into regex). */
  useRegex?: boolean
}

/** Cap total matches across all files (bounds worst-case latency/memory). */
const MAX_MATCHES = 500
/** Cap matches per file (one huge generated file shouldn't eat the whole budget). */
const MAX_MATCHES_PER_FILE = 50
/** Hard wall-clock cap so a pathological query/tree can't hang the request. */
const TIMEOUT_MS = 15_000

interface RgJsonMatch {
  type: 'match'
  data: {
    path: { text: string }
    lines: { text: string }
    line_number: number
    submatches: { start: number; end: number }[]
  }
}

/** Search `path` recursively for `query`, honoring the search box's modifier toggles. */
export async function searchGrep(path: string, query: string, options: SearchOptions = {}): Promise<SearchGrepResult> {
  if (query.trim() === '') return { files: [], truncated: false }
  const rg = resolveRipgrepPath()
  if (rg === null) {
    throw new ResttyError('search-deps-missing', 'ripgrep is not available — run the repair command shown in the Search tab', 503)
  }
  return runRipgrep(rg, resolvePath(path), query, options)
}

function runRipgrep(rg: string, cwd: string, query: string, options: SearchOptions): Promise<SearchGrepResult> {
  return new Promise((resolvePromise, reject) => {
    const files = new Map<string, SearchMatch[]>()
    let totalMatches = 0
    let truncated = false
    let buffer = ''
    let settled = false
    const stderrChunks: Buffer[] = []

    const args = ['--json', '-m', String(MAX_MATCHES_PER_FILE), '--max-filesize', '2M']
    if (options.matchCase !== true) args.push('-i')
    if (options.wholeWord === true) args.push('-w')
    if (options.useRegex !== true) args.push('-F')
    args.push('--', query, '.')

    const child = spawn(rg, args, {
      cwd,
      stdio: ['ignore', 'pipe', 'pipe'],
    })

    const buildResult = (): SearchGrepResult => ({
      files: [...files.entries()].map(([filePath, matches]) => ({ path: filePath, matches })),
      truncated,
    })

    const settle = (outcome: { ok: true } | { ok: false; error: ResttyError }): void => {
      if (settled) return
      settled = true
      clearTimeout(timer)
      child.stdout.removeAllListeners()
      child.stderr.removeAllListeners()
      child.removeAllListeners()
      if (child.exitCode === null) child.kill()
      if (outcome.ok) resolvePromise(buildResult())
      else reject(outcome.error)
    }

    const timer = setTimeout(() => {
      truncated = true
      settle({ ok: true })
    }, TIMEOUT_MS)

    child.stdout.on('data', (chunk: Buffer) => {
      if (settled) return
      buffer += chunk.toString('utf8')
      let newlineIdx: number
      while ((newlineIdx = buffer.indexOf('\n')) >= 0) {
        const line = buffer.slice(0, newlineIdx)
        buffer = buffer.slice(newlineIdx + 1)
        if (line.trim() === '') continue
        let parsed: unknown
        try {
          parsed = JSON.parse(line)
        } catch {
          continue
        }
        if ((parsed as { type?: string }).type !== 'match') continue
        const match = parsed as RgJsonMatch
        const list = files.get(match.data.path.text) ?? []
        list.push({
          line: match.data.line_number,
          text: match.data.lines.text.replace(/\n$/, ''),
          ranges: match.data.submatches.map((s): [number, number] => [s.start, s.end]),
        })
        files.set(match.data.path.text, list)
        totalMatches += 1
        if (totalMatches >= MAX_MATCHES) {
          truncated = true
          settle({ ok: true })
          return
        }
      }
    })

    child.stderr.on('data', (chunk: Buffer) => { stderrChunks.push(chunk) })

    child.on('error', (error) => {
      settle({ ok: false, error: new ResttyError('bad-request', `ripgrep failed to start: ${error.message}`, 400) })
    })

    // Exit code 1 = "no matches" (ripgrep's normal empty-result code, not an
    // error); exit code 2 = a real error (bad regex, unreadable path, ...).
    child.on('close', (code) => {
      if (code === 2) {
        const message = Buffer.concat(stderrChunks).toString('utf8').trim() || 'ripgrep exited with an error'
        settle({ ok: false, error: new ResttyError('bad-request', message, 400) })
        return
      }
      settle({ ok: true })
    })
  })
}
