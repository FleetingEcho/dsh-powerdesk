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
import type { ResttyPty } from './rust-pty-manager.ts'
import type { RustPtyManager } from './rust-pty-manager.ts'

/** One client→server control frame (parsed). */
export interface ClientFrame {
  type: string
  data?: string
  cols?: number
  rows?: number
  widthPx?: number
  heightPx?: number
}

/** Send a server→client JSON control frame (the host stringifies + sends). */
export type SendControl = (payload: Record<string, unknown>) => void
/** Send terminal bytes (the host encodes to a BINARY frame). */
export type SendData = (text: string) => void

/** Parse one client JSON control frame; null when the text is not JSON. */
export function parseClientFrame(text: string): ClientFrame | null {
  try {
    const value: unknown = JSON.parse(text)
    if (value === null || typeof value !== 'object') return null
    return value as ClientFrame
  } catch {
    return null
  }
}

/** Clamp a dimension into the supported pty range (2..1024, flooring decimals). */
export function clampDim(value: number, fallback: number): number {
  if (!Number.isFinite(value)) return fallback
  return Math.min(1024, Math.max(2, Math.floor(value)))
}

/**
 * Dispatch one client control frame to the live pty. The host passes the
 * bound `sendControl` (stringify + ws.send) and `sendData` (encode + binary
 * ws.send) so this stays pure of the `ws` transport.
 */
export function handleClientMessage(
  text: string,
  handle: ResttyPty,
  ptyManager: RustPtyManager,
  sendControl: SendControl,
  sendData: SendData,
): void {
  void sendData // present for symmetry; the input path writes the pty, not the socket
  const frame = parseClientFrame(text)
  if (frame === null) {
    sendControl({ type: 'error', message: 'expected a JSON control frame' })
    return
  }
  if (frame.type === 'input' && typeof frame.data === 'string') {
    handle.pty.write(frame.data)
    return
  }
  if (frame.type === 'resize' && typeof frame.cols === 'number' && typeof frame.rows === 'number') {
    const cols = clampDim(frame.cols, 80)
    const rows = clampDim(frame.rows, 24)
    const pixelW = typeof frame.widthPx === 'number' ? frame.widthPx : undefined
    const pixelH = typeof frame.heightPx === 'number' ? frame.heightPx : undefined
    handle.pty.resize(cols, rows, pixelW, pixelH)
    return
  }
  if (frame.type === 'close') {
    // The owning tab was closed: release the quota immediately.
    ptyManager.scheduleClose(handle.key, 0)
    return
  }
  sendControl({ type: 'error', message: `unknown message type: ${String(frame.type)}` })
}
