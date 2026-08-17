/**
 * PTY session table for the restty terminals. One Rust pty process per
 * `${sessionId}:${tabId}` key; processes survive WebSocket disconnects (page
 * refresh, tab switch) and reconnect to the same process by key. Output is
 * mirrored into a bounded transcript ring (capped bytes) so a new connection
 * replays history before live data. Sessions die only when the tab is
 * closed or the plugin tears down.
 *
 * This is the restty analogue of dsh-better-sidebar's PtyManager, backed by
 * the Rust native module ({@link ./rust-pty.ts}) instead of node-pty. The
 * surface is intentionally identical so the WS attach logic reads the same.
 */
import { RustPty, type RustPtyModule, type RustPtySpawnOptions } from './rust-pty.ts'
import { loadRequiredRustPty } from './rust-pty-deps.ts'
import { shellSpawnArgs } from './shell.ts'
import { ResttyError } from './wire.ts'

/** Per-terminal transcript bound (bytes kept for replay). */
const TRANSCRIPT_LIMIT = 1 << 20

/** One live terminal. */
export interface ResttyPty {
  /** `${sessionId}:${tabId}` registry key. */
  key: string
  sessionId: string
  tabId: string
  /** The working directory the process was SPAWNED with (a reconnect that
   *  resolves a different authoritative cwd respawns instead of reusing). */
  cwd: string
  pty: RustPty
  /** Output accumulated since spawn (bounded; head dropped when over the limit). */
  transcript: string
  /** Whether the top-level process exited (transcript stays replayable). */
  exited: boolean
  exitCode?: number | null
  exitSignal?: number | null
}

/**
 * The terminal registry. `maxPerSession` bounds concurrent processes per
 * conversation (the client caps tabs at the same number).
 */
export class RustPtyManager {
  private readonly sessions = new Map<string, ResttyPty>()
  private readonly pendingCloses = new Map<string, ReturnType<typeof setTimeout>>()

  constructor(
    private readonly shell: string,
    private readonly maxPerSession: number,
    /** The loaded native pty module (injected so a broken install degrades
     *  instead of crashing the plugin). */
    private readonly module: RustPtyModule = loadRequiredRustPty(),
    /** Platform override (defaults to the live process; injected for tests so
     *  the Windows login-flag branch never runs on POSIX CI). */
    private readonly platform: NodeJS.Platform = process.platform,
  ) {}

  /** All live terminal keys of one session. */
  keysOf(sessionId: string): string[] {
    const keys: string[] = []
    for (const handle of this.sessions.values()) {
      if (handle.sessionId === sessionId) keys.push(handle.key)
    }
    return keys
  }

  /**
   * Open (or reuse) the terminal for a session/tab key. A handle whose
   * process already exited is replaced with a fresh spawn (reconnecting a
   * dead terminal must yield a live shell, not an input sink), and so is a
   * live handle whose spawn cwd differs from the now-authoritative one.
   * Reopening cancels any pending scheduled close (a reconnect within the
   * grace window keeps the process alive).
   * @returns the live handle.
   * @throws {ResttyError} pty-error when the per-session cap is reached.
   */
  open(sessionId: string, tabId: string, cwd: string, cols: number, rows: number): ResttyPty {
    const key = `${sessionId}:${tabId}`
    this.cancelClose(key)
    const existing = this.sessions.get(key)
    if (existing !== undefined && !existing.exited && existing.cwd === cwd) return existing
    if (existing !== undefined) this.close(key)
    // Zombie cleanup: a session's exited handles must not eat the quota.
    for (const [candidate, handle] of [...this.sessions]) {
      if (handle.sessionId === sessionId && handle.exited) this.close(candidate)
    }
    if (this.keysOf(sessionId).length >= this.maxPerSession) {
      throw new ResttyError('pty-error', `terminal limit reached (${this.maxPerSession}) for this session`, 400)
    }
    const options: RustPtySpawnOptions = {
      cols: Math.max(2, Math.floor(cols)),
      rows: Math.max(2, Math.floor(rows)),
      cwd,
      env: { ...process.env },
    }
    const raw = this.module.spawn(this.shell, shellSpawnArgs(this.platform), options)
    const pty = new RustPty(raw)
    const handle: ResttyPty = {
      key,
      sessionId,
      tabId,
      cwd,
      pty,
      transcript: '',
      exited: false,
    }
    pty.onData((data) => {
      handle.transcript += data
      if (handle.transcript.length > TRANSCRIPT_LIMIT) {
        handle.transcript = handle.transcript.slice(handle.transcript.length - TRANSCRIPT_LIMIT)
      }
    })
    pty.onExit(({ exitCode, signal }) => {
      handle.exited = true
      handle.exitCode = exitCode
      handle.exitSignal = signal ?? null
    })
    this.sessions.set(key, handle)
    return handle
  }

  /**
   * Schedule the terminal's destruction after `delayMs`. A tab close sends
   * delay 0 (release the quota immediately); a bare socket drop (refresh,
   * crash) uses the grace period so a quick reconnect keeps the process.
   * `open()` cancels any pending close.
   */
  scheduleClose(key: string, delayMs: number): void {
    const handle = this.sessions.get(key)
    if (handle === undefined) return
    this.cancelClose(key)
    const timer = setTimeout(() => { this.close(key) }, delayMs)
    this.pendingCloses.set(key, timer)
  }

  /** Cancel a pending scheduled close (the terminal is being reopened). */
  cancelClose(key: string): void {
    const timer = this.pendingCloses.get(key)
    if (timer !== undefined) {
      clearTimeout(timer)
      this.pendingCloses.delete(key)
    }
  }

  /** Resolve a live handle by key, or undefined. */
  get(key: string): ResttyPty | undefined {
    return this.sessions.get(key)
  }

  /** Close a terminal and drop its state (the owning tab was closed). */
  close(key: string): void {
    this.cancelClose(key)
    const handle = this.sessions.get(key)
    if (handle === undefined) return
    this.sessions.delete(key)
    handle.pty.kill()
  }

  /** Close every terminal (plugin teardown). */
  disposeAll(): void {
    for (const timer of this.pendingCloses.values()) clearTimeout(timer)
    this.pendingCloses.clear()
    for (const key of [...this.sessions.keys()]) this.close(key)
  }
}
