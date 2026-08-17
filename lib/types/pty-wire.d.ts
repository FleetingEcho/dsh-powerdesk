/**
 * The restty native wire-protocol frame helpers, kept PURE (no `ws`, no Node
 * globals) so the client→server message dispatch is unit-testable without a
 * live WebSocket. The host {@link ./index.ts} upgrade handler delegates here.
 *
 * Wire protocol (restty native):
 * - client → server: `{type:'input',data}` / `{type:'resize',cols,rows,…}` /
 *   `{type:'close'}` as JSON string frames;
 * - server → client: terminal bytes as BINARY frames, `{type:'status'|
 *   'error'|'exit'}` as JSON string frames.
 */
import type { ResttyPty } from './rust-pty-manager.ts';
import type { RustPtyManager } from './rust-pty-manager.ts';
/** One client→server control frame (parsed). */
export interface ClientFrame {
    type: string;
    data?: string;
    cols?: number;
    rows?: number;
    widthPx?: number;
    heightPx?: number;
}
/** Send a server→client JSON control frame (the host stringifies + sends). */
export type SendControl = (payload: Record<string, unknown>) => void;
/** Send terminal bytes (the host encodes to a BINARY frame). */
export type SendData = (text: string) => void;
/** Parse one client JSON control frame; null when the text is not JSON. */
export declare function parseClientFrame(text: string): ClientFrame | null;
/** Clamp a dimension into the supported pty range (2..1024, flooring decimals). */
export declare function clampDim(value: number, fallback: number): number;
/**
 * Dispatch one client control frame to the live pty. The host passes the
 * bound `sendControl` (stringify + ws.send) and `sendData` (encode + binary
 * ws.send) so this stays pure of the `ws` transport.
 */
export declare function handleClientMessage(text: string, handle: ResttyPty, ptyManager: RustPtyManager, sendControl: SendControl, sendData: SendData): void;
