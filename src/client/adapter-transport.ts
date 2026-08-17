/**
 * The BETTER_SIDEBAR-backend PTY transport: a restty `PtyTransport` that
 * reuses dsh-better-sidebar's EXISTING `/sidebar/ws/terminal` (so the
 * terminal shares dsh-better-sidebar's PTY lifecycle — reconnect grace,
 * per-session quota, session cwd, agent terminals) by translating between
 * restty's protocol and dsh-better-sidebar's raw-text protocol:
 *
 * - client → server: restty `{type:'input',data}` JSON becomes a RAW TEXT
 *   frame (dsh-better-sidebar writes non-control frames verbatim to the
 *   pty); restty `{type:'resize',cols,rows}` becomes dsh-better-sidebar's
 *   `{type:'resize',cols,rows}` JSON control (the two resize shapes agree).
 * - server → client: dsh-better-sidebar sends terminal bytes as TEXT frames
 *   (raw output) — the adapter forwards them to restty as `onData` (restty
 *   renders text frames as terminal output). dsh-better-sidebar does NOT send
 *   status/exit JSON, so restty never learns the shell name or exit code on
 *   this backend (the terminal still works; the visible `[process exited]`
 *   notice dsh-better-sidebar writes is forwarded as output).
 *
 * Caveat (mirrors dsh-better-sidebar's own documented ambiguity): a raw-text
 * input frame that happens to be valid JSON the server recognizes as a
 * control (`{type:'resize',...}` / `{type:'close'}`) is treated as control by
 * dsh-better-sidebar, not written to the pty. The same class of input is
 * already ambiguous in dsh-better-sidebar's own terminal; accepting it here
 * keeps the backend identical rather than inventing a third escaping.
 */
import type { PtyCallbacks, PtyTransport } from 'restty'
import { sidebarWsUrl, type SessionScope } from './api.ts'
import type { ResttyTransportListeners } from './restty-transport.ts'

type WebSocketCtor = typeof WebSocket

export interface SidebarAdapterOptions {
  /** WebSocket constructor override (tests inject a fake). */
  WebSocketCtor?: WebSocketCtor
}

type Phase = 'idle' | 'connecting' | 'connected' | 'closing'

/**
 * Build the BETTER_SIDEBAR-backend transport. The component passes this to
 * `new Restty({ services: { ptyTransport } })` and then `restty.connectPty(url)`.
 */
export function createSidebarAdapterTransport(
  scope: SessionScope,
  tabId: string,
  listeners: ResttyTransportListeners,
  options: SidebarAdapterOptions = {},
): PtyTransport {
  const WebSocketCtor = options.WebSocketCtor ?? WebSocket
  let ws: WebSocket | null = null
  let phase: Phase = 'idle'

  const sendResize = (cols: number, rows: number): void => {
    if (ws !== null && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'resize', cols, rows }))
    }
  }

  return {
    connect(options) {
      const { cols, rows, callbacks } = options
      const url = sidebarWsUrl(scope, tabId)
      phase = 'connecting'
      ws = new WebSocketCtor(url)
      ws.addEventListener('open', () => {
        phase = 'connected'
        callbacks.onConnect?.()
        listeners.onOpen?.()
        if (Number.isFinite(cols) && Number.isFinite(rows)) {
          sendResize(Math.max(0, Number(cols)), Math.max(0, Number(rows)))
        }
      })
      ws.addEventListener('message', (event: MessageEvent) => {
        const payload = event.data
        if (typeof payload === 'string') {
          // dsh-better-sidebar sends terminal bytes as text frames (raw
          // output, including the transcript replay and the [process exited]
          // notice). Forward verbatim — restty renders it.
          callbacks.onData?.(payload)
          return
        }
        if (payload instanceof ArrayBuffer) {
          callbacks.onData?.(new TextDecoder().decode(new Uint8Array(payload)))
          return
        }
        if (typeof Blob !== 'undefined' && payload instanceof Blob) {
          void payload.arrayBuffer().then((buf) => {
            callbacks.onData?.(new TextDecoder().decode(new Uint8Array(buf)))
          })
        }
      })
      ws.addEventListener('close', (event: CloseEvent) => {
        phase = 'idle'
        callbacks.onDisconnect?.()
        listeners.onClose?.(event.code, event.reason)
      })
      ws.addEventListener('error', () => {
        // The close event follows.
      })
    },
    disconnect() {
      phase = 'closing'
      try {
        ws?.close()
      } catch {
        // already closing / closed
      }
    },
    sendInput(data) {
      if (ws !== null && ws.readyState === WebSocket.OPEN) {
        // Raw text: dsh-better-sidebar writes non-control frames verbatim.
        ws.send(data)
        return true
      }
      return false
    },
    resize(cols, rows) {
      sendResize(cols, rows)
      return ws !== null && ws.readyState === WebSocket.OPEN
    },
    isConnected() {
      return phase === 'connected' && ws !== null && ws.readyState === WebSocket.OPEN
    },
    destroy() {
      this.disconnect()
    },
  }
}
