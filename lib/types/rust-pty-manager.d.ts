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
import { RustPty, type RustPtyModule } from './rust-pty.ts';
/** One live terminal. */
export interface ResttyPty {
    /** `${sessionId}:${tabId}` registry key. */
    key: string;
    sessionId: string;
    tabId: string;
    /** The working directory the process was SPAWNED with (a reconnect that
     *  resolves a different authoritative cwd respawns instead of reusing). */
    cwd: string;
    pty: RustPty;
    /** Output accumulated since spawn (bounded; head dropped when over the limit). */
    transcript: string;
    /** Whether the top-level process exited (transcript stays replayable). */
    exited: boolean;
    exitCode?: number | null;
    exitSignal?: number | null;
}
/**
 * The terminal registry. `maxPerSession` bounds concurrent processes per
 * conversation (the client caps tabs at the same number).
 */
export declare class RustPtyManager {
    private readonly shell;
    private readonly maxPerSession;
    /** The loaded native pty module (injected so a broken install degrades
     *  instead of crashing the plugin). */
    private readonly module;
    /** Platform override (defaults to the live process; injected for tests so
     *  the Windows login-flag branch never runs on POSIX CI). */
    private readonly platform;
    private readonly sessions;
    private readonly pendingCloses;
    constructor(shell: string, maxPerSession: number, 
    /** The loaded native pty module (injected so a broken install degrades
     *  instead of crashing the plugin). */
    module?: RustPtyModule, 
    /** Platform override (defaults to the live process; injected for tests so
     *  the Windows login-flag branch never runs on POSIX CI). */
    platform?: NodeJS.Platform);
    /** All live terminal keys of one session. */
    keysOf(sessionId: string): string[];
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
    open(sessionId: string, tabId: string, cwd: string, cols: number, rows: number): ResttyPty;
    /**
     * Schedule the terminal's destruction after `delayMs`. A tab close sends
     * delay 0 (release the quota immediately); a bare socket drop (refresh,
     * crash) uses the grace period so a quick reconnect keeps the process.
     * `open()` cancels any pending close.
     */
    scheduleClose(key: string, delayMs: number): void;
    /** Cancel a pending scheduled close (the terminal is being reopened). */
    cancelClose(key: string): void;
    /** Resolve a live handle by key, or undefined. */
    get(key: string): ResttyPty | undefined;
    /** Close a terminal and drop its state (the owning tab was closed). */
    close(key: string): void;
    /** Close every terminal (plugin teardown). */
    disposeAll(): void;
}
