/**
 * The OWN-backend PTY transport: a restty `PtyTransport` that opens a
 * WebSocket to the plugin's `/powerdesk/ws/terminal` (which speaks restty's
 * NATIVE wire protocol) and forwards the connection lifecycle to the
 * component. This is the restty-native path; it differs from restty's
 * `createWebSocketPtyTransport` only in that it surfaces the close
 * code/reason to the component (so the view can distinguish a transient
 * disconnect from the degraded `powerdesk-pty-deps-missing` close and drive its
 * own reconnect + repair banner) and is injectable for tests.
 *
 * Wire protocol (restty native):
 * - client → server: `{type:'input',data}` / `{type:'resize',cols,rows,…}`
 *   as JSON string frames;
 * - server → client: terminal bytes as BINARY frames (UTF-8, streaming
 *   decoded), `{type:'status'|'error'|'exit'}` as JSON string frames.
 */
import type { PtyTransport } from 'restty';
/** Component-facing connection events (the transport also routes restty's
 *  internal callbacks to render output). */
export interface ResttyTransportListeners {
    /** WebSocket opened (the pty is attached). */
    onOpen?: () => void;
    /** WebSocket closed; the component drives reconnect from this. */
    onClose?: (code: number, reason: string) => void;
    /** Server reported the shell name. */
    onStatus?: (shell: string) => void;
    /** Server reported an error. */
    onError?: (message: string) => void;
    /** Server reported the pty process exited. */
    onExit?: (code: number) => void;
}
type WebSocketCtor = typeof WebSocket;
/** Options for {@link createResttyTransport} (all optional / injectable). */
export interface ResttyTransportOptions {
    /** WebSocket constructor override (tests inject a fake). */
    WebSocketCtor?: WebSocketCtor;
}
/**
 * Build the OWN-backend transport. The component passes this to
 * `new Restty({ services: { ptyTransport } })` and then `restty.connectPty(url)`.
 */
export declare function createResttyTransport(listeners: ResttyTransportListeners, options?: ResttyTransportOptions): PtyTransport;
export {};
