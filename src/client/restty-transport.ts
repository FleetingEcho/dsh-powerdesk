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
import type { PtyCallbacks, PtyTransport } from 'restty'

/** Component-facing connection events (the transport also routes restty's
 *  internal callbacks to render output). */
export interface ResttyTransportListeners {
  /** WebSocket opened (the pty is attached). */
  onOpen?: () => void
  /** WebSocket closed; the component drives reconnect from this. */
  onClose?: (code: number, reason: string) => void
  /** Server reported the shell name. */
  onStatus?: (shell: string) => void
  /** Server reported an error. */
  onError?: (message: string) => void
  /** Server reported the pty process exited. */
  onExit?: (code: number) => void
}

type WebSocketCtor = typeof WebSocket

/** Options for {@link createResttyTransport} (all optional / injectable). */
export interface ResttyTransportOptions {
  /** WebSocket constructor override (tests inject a fake). */
  WebSocketCtor?: WebSocketCtor
}

type Phase = 'idle' | 'connecting' | 'connected' | 'closing'

/** One server JSON control frame (the subset this transport handles). */
interface ControlFrame {
  type?: unknown
  shell?: unknown
  message?: unknown
  code?: unknown
}

/** Parse one server JSON control frame; return true when handled. */
function handleControl(
  text: string,
  callbacks: PtyCallbacks,
  listeners: ResttyTransportListeners,
): boolean {
  let parsed: ControlFrame | null = null
  try {
    const value: unknown = JSON.parse(text)
    if (value !== null && typeof value === 'object') parsed = value as ControlFrame
  } catch {
    return false
  }
  if (parsed === null) return false
  if (parsed.type === 'status') {
    const shell = typeof parsed.shell === 'string' ? parsed.shell : ''
    callbacks.onStatus?.(shell)
    listeners.onStatus?.(shell)
    return true
  }
  if (parsed.type === 'error') {
    const message = typeof parsed.message === 'string' ? parsed.message : 'pty error'
    callbacks.onError?.(message)
    listeners.onError?.(message)
    return true
  }
  if (parsed.type === 'exit') {
    const code = typeof parsed.code === 'number' ? parsed.code : 0
    callbacks.onExit?.(code)
    listeners.onExit?.(code)
    return true
  }
  return false
}

/**
 * Build the OWN-backend transport. The component passes this to
 * `new Restty({ services: { ptyTransport } })` and then `restty.connectPty(url)`.
 */
export function createResttyTransport(
  listeners: ResttyTransportListeners,
  options: ResttyTransportOptions = {},
): PtyTransport {
  const WebSocketCtor = options.WebSocketCtor ?? WebSocket
  let ws: WebSocket | null = null
  let decoder = new TextDecoder()
  let phase: Phase = 'idle'

  const flush = (): void => {
    const tail = decoder.decode()
    if (tail !== '') {
      // No restty callbacks available at flush time; the tail is dropped
      // (a partial multibyte sequence at socket close is negligible).
    }
    decoder = new TextDecoder()
  }

  const sendResize = (cols: number, rows: number): void => {
    if (ws !== null && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'resize', cols, rows }))
    }
  }

  return {
    connect(options) {
      const { url, cols, rows, callbacks } = options
      phase = 'connecting'
      ws = new WebSocketCtor(url)
      ws.binaryType = 'arraybuffer'
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
        if (payload instanceof ArrayBuffer) {
          const text = decoder.decode(new Uint8Array(payload), { stream: true })
          if (text !== '') callbacks.onData?.(text)
          return
        }
        if (typeof Blob !== 'undefined' && payload instanceof Blob) {
          void payload.arrayBuffer().then((buf) => {
            const text = decoder.decode(new Uint8Array(buf), { stream: true })
            if (text !== '') callbacks.onData?.(text)
          })
          return
        }
        if (typeof payload === 'string') {
          if (handleControl(payload, callbacks, listeners)) return
          callbacks.onData?.(payload)
        }
      })
      ws.addEventListener('close', (event: CloseEvent) => {
        flush()
        phase = 'idle'
        callbacks.onDisconnect?.()
        listeners.onClose?.(event.code, event.reason)
      })
      ws.addEventListener('error', () => {
        // The close event follows with the code/reason; nothing to do here.
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
        ws.send(JSON.stringify({ type: 'input', data }))
        return true
      }
      return false
    },
    resize(cols, rows) {
      if (ws !== null && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'resize', cols, rows }))
        return true
      }
      return false
    },
    isConnected() {
      return phase === 'connected' && ws !== null && ws.readyState === WebSocket.OPEN
    },
    destroy() {
      this.disconnect()
    },
  }
}
