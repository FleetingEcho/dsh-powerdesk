import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createResttyTransport, type ResttyTransportListeners } from '../src/client/restty-transport.ts'
import { FakeWS } from './fake-ws.ts'

beforeEach(() => { FakeWS.reset() })

describe('createResttyTransport (own backend)', () => {
  it('connects, fires onOpen + a resize, and routes input as JSON', async () => {
    const listeners: ResttyTransportListeners = { onOpen: vi.fn(), onClose: vi.fn() }
    const callbacks = { onConnect: vi.fn(), onData: vi.fn(), onStatus: vi.fn(), onError: vi.fn(), onExit: vi.fn(), onDisconnect: vi.fn() }
    const transport = createResttyTransport(listeners, { WebSocketCtor: FakeWS as unknown as typeof WebSocket })
    transport.connect({ url: 'ws://x/pty', cols: 80, rows: 24, callbacks })
    await Promise.resolve()
    expect(callbacks.onConnect).toHaveBeenCalled()
    expect(listeners.onOpen).toHaveBeenCalled()
    // The open handler sends an initial resize.
    expect(FakeWS.last!.sent).toContain(JSON.stringify({ type: 'resize', cols: 80, rows: 24 }))
    // An input frame is JSON-encoded.
    transport.sendInput('ls\n')
    expect(FakeWS.last!.sent).toContain(JSON.stringify({ type: 'input', data: 'ls\n' }))
    expect(transport.isConnected()).toBe(true)
  })

  it('decodes binary output frames to onData (streaming UTF-8)', async () => {
    const listeners: ResttyTransportListeners = {}
    const callbacks = { onConnect: vi.fn(), onData: vi.fn(), onStatus: vi.fn(), onError: vi.fn(), onExit: vi.fn(), onDisconnect: vi.fn() }
    const transport = createResttyTransport(listeners, { WebSocketCtor: FakeWS as unknown as typeof WebSocket })
    transport.connect({ url: 'ws://x/pty', cols: 80, rows: 24, callbacks })
    await Promise.resolve()
    FakeWS.last!.fire('message', { data: new Uint8Array([104, 105]).buffer })
    expect(callbacks.onData).toHaveBeenCalledWith('hi')
  })

  it('routes status/error/exit JSON control frames to both callbacks and listeners', async () => {
    const listeners: ResttyTransportListeners = { onStatus: vi.fn(), onError: vi.fn(), onExit: vi.fn() }
    const callbacks = { onConnect: vi.fn(), onData: vi.fn(), onStatus: vi.fn(), onError: vi.fn(), onExit: vi.fn(), onDisconnect: vi.fn() }
    const transport = createResttyTransport(listeners, { WebSocketCtor: FakeWS as unknown as typeof WebSocket })
    transport.connect({ url: 'ws://x/pty', cols: 80, rows: 24, callbacks })
    await Promise.resolve()
    FakeWS.last!.fire('message', { data: JSON.stringify({ type: 'status', shell: 'bash' }) })
    FakeWS.last!.fire('message', { data: JSON.stringify({ type: 'error', message: 'boom' }) })
    FakeWS.last!.fire('message', { data: JSON.stringify({ type: 'exit', code: 7 }) })
    expect(callbacks.onStatus).toHaveBeenCalledWith('bash')
    expect(listeners.onStatus).toHaveBeenCalledWith('bash')
    expect(callbacks.onError).toHaveBeenCalledWith('boom')
    expect(callbacks.onExit).toHaveBeenCalledWith(7)
    expect(listeners.onExit).toHaveBeenCalledWith(7)
  })

  it('a non-JSON string frame is treated as terminal output (onData)', async () => {
    const callbacks = { onConnect: vi.fn(), onData: vi.fn(), onStatus: vi.fn(), onError: vi.fn(), onExit: vi.fn(), onDisconnect: vi.fn() }
    const transport = createResttyTransport({}, { WebSocketCtor: FakeWS as unknown as typeof WebSocket })
    transport.connect({ url: 'ws://x/pty', cols: 80, rows: 24, callbacks })
    await Promise.resolve()
    FakeWS.last!.fire('message', { data: 'plain output' })
    expect(callbacks.onData).toHaveBeenCalledWith('plain output')
  })

  it('close fires onDisconnect + onClose with code/reason', async () => {
    const listeners: ResttyTransportListeners = { onClose: vi.fn() }
    const callbacks = { onConnect: vi.fn(), onData: vi.fn(), onStatus: vi.fn(), onError: vi.fn(), onExit: vi.fn(), onDisconnect: vi.fn() }
    const transport = createResttyTransport(listeners, { WebSocketCtor: FakeWS as unknown as typeof WebSocket })
    transport.connect({ url: 'ws://x/pty', cols: 80, rows: 24, callbacks })
    await Promise.resolve()
    FakeWS.last!.close(1011, 'powerdesk-pty-deps-missing')
    expect(callbacks.onDisconnect).toHaveBeenCalled()
    expect(listeners.onClose).toHaveBeenCalledWith(1011, 'powerdesk-pty-deps-missing')
    expect(transport.isConnected()).toBe(false)
  })

  it('sendInput/resize return false when not connected', () => {
    const transport = createResttyTransport({}, { WebSocketCtor: FakeWS as unknown as typeof WebSocket })
    expect(transport.sendInput('x')).toBe(false)
    expect(transport.resize(10, 10)).toBe(false)
  })
})
