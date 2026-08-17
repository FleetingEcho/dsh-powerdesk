/**
 * JS wrapper around the raw napi-rs PTY module. The native crate
 * (rust/src/lib.rs, `dsh-powerdesk-pty`) exposes a SINGLE callback slot for
 * `on_data` / `on_exit` (a ThreadsafeFunction the Rust reader thread fires);
 * this wrapper multiplexes that one slot into the familiar multi-subscriber
 * `onData(cb) => dispose` / `onExit(cb) => dispose` surface node-pty provides,
 * so {@link ./rust-pty-manager.ts} can register a transcript mirror AND a WS
 * forwarder on the same live pty (and re-subscribe on reconnect without the
 * Rust side knowing about subscribers).
 *
 * The wrapper is pure TS (no node imports) so it is unit-testable with a
 * fake {@link RawRustPty} and never pulls Node into the declaration graph.
 */

/** Spawn options passed to the native module (mirrors Rust `SpawnOptions`). */
export interface RustPtySpawnOptions {
  cols: number
  rows: number
  cwd: string
  env: Record<string, string | undefined>
}

/** The exit event the native module reports (mirrors Rust `ExitEvent`). */
export interface RustPtyExitEvent {
  exitCode: number
  /** POSIX signal number when the process was killed by a signal (undefined on Windows). */
  signal?: number | null
}

/**
 * The raw napi-rs PTY surface the native crate exposes. `on_data` / `on_exit`
 * each register ONE callback (last call wins for the slot; the wrapper sets
 * them exactly once at construction and fans out itself).
 */
export interface RawRustPty {
  /** Register the single data callback (called from the Rust reader thread). */
  on_data(callback: (data: string) => void): void
  /** Register the single exit callback. */
  on_exit(callback: (event: RustPtyExitEvent) => void): void
  /** Write text to the pty's stdin. */
  write(data: string): void
  /** Resize the pty; pixel dimensions are best-effort (TIOCSWINSZ pixel hints). */
  resize(cols: number, rows: number, pixelW?: number | null, pixelH?: number | null): void
  /** Kill the process (platform termination path). */
  kill(): void
  /** The spawned process id. */
  readonly pid: number
}

/** The native module surface the loader resolves (one function: spawn). */
export interface RustPtyModule {
  spawn(shell: string, args: string[], options: RustPtySpawnOptions): RawRustPty
}

/** One data subscriber. */
type DataListener = (data: string) => void
/** One exit subscriber. */
type ExitListener = (event: RustPtyExitEvent) => void

/**
 * A live Rust PTY with a multi-subscriber JS surface. The dispatcher is
 * installed once (the native side keeps a single callback slot); subscribers
 * add/remove through {@link onData} / {@link onExit}.
 */
export class RustPty {
  private readonly dataListeners = new Set<DataListener>()
  private readonly exitListeners = new Set<ExitListener>()
  private exited = false

  constructor(private readonly raw: RawRustPty) {
    // Install the single dispatchers once. The native reader thread fires
    // on_data from a worker; napi marshalls the call onto the JS thread, so
    // the fan-out (synchronous forEach) is safe.
    raw.on_data((data: string) => {
      for (const listener of [...this.dataListeners]) {
        try {
          listener(data)
        } catch {
          // A throwing subscriber must not break the others or the pty.
        }
      }
    })
    raw.on_exit((event: RustPtyExitEvent) => {
      this.exited = true
      for (const listener of [...this.exitListeners]) {
        try {
          listener(event)
        } catch {
          // A throwing subscriber must not break the others.
        }
      }
    })
  }

  /** Subscribe to pty output; returns the disposer. */
  onData(listener: DataListener): () => void {
    this.dataListeners.add(listener)
    return () => { this.dataListeners.delete(listener) }
  }

  /** Subscribe to the pty exit; returns the disposer. */
  onExit(listener: ExitListener): () => void {
    this.exitListeners.add(listener)
    return () => { this.exitListeners.delete(listener) }
  }

  /** Write text to the pty's stdin. */
  write(data: string): void {
    if (this.exited) return
    this.raw.write(data)
  }

  /** Resize the pty (pixel dimensions best-effort). */
  resize(cols: number, rows: number, pixelW?: number | null, pixelH?: number | null): void {
    if (this.exited) return
    this.raw.resize(cols, rows, pixelW ?? null, pixelH ?? null)
  }

  /** Kill the underlying process. */
  kill(): void {
    try {
      this.raw.kill()
    } catch {
      // Already exited or gone; nothing left to kill.
    }
  }

  /** The spawned process id. */
  get pid(): number {
    return this.raw.pid
  }

  /** Whether the top-level process has exited. */
  get hasExited(): boolean {
    return this.exited
  }
}
