import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createSidebarAdapterTransport } from '../src/client/adapter-transport.ts'
import type { ResttyTransportListeners } from '../src/client/restty-transport.ts'
import { FakeWS } from './fake-ws.ts'

beforeEach(() => { FakeWS.reset() })

describe('createSidebarAdapterTransport (better-sidebar backend)', () => {
  it('sends input as RAW TEXT (not JSON) and resize as JSON control', async () => {
    const listeners: ResttyTransportListeners = {}
    const callbacks = { onConnect: vi.fn(), onData: vi.fn(), onStatus: vi.fn(), onError: vi.fn(), onExit: vi.fn(), onDisconnect: vi.fn() }
    const transport = createSidebarAdapterTransport({ sessionId: 's1', cwd: '/c' }, 't1', listeners, { WebSocketCtor: FakeWS as unknown as typeof WebSocket })
    transport.connect({ url: 'ws://x/sidebar', cols: 80, rows: 24, callbacks })
    await Promise.resolve()
    expect(callbacks.onConnect).toHaveBeenCalled()
    expect(FakeWS.last!.sent).toContain(JSON.stringify({ type: 'resize', cols: 80, rows: 24 }))
    transport.sendInput('ls -la\n')
    // Raw text frame — NOT {type:'input',data}.
    expect(FakeWS.last!.sent).toContain('ls -la\n')
    expect(FakeWS.last!.sent).not.toContain(JSON.stringify({ type: 'input', data: 'ls -la\n' }))
  })

  it('forwards better-sidebar output (text frames) as onData', async () => {
    const callbacks = { onConnect: vi.fn(), onData: vi.fn(), onStatus: vi.fn(), onError: vi.fn(), onExit: vi.fn(), onDisconnect: vi.fn() }
    const transport = createSidebarAdapterTransport({ sessionId: 's1' }, 't1', {}, { WebSocketCtor: FakeWS as unknown as typeof WebSocket })
    transport.connect({ url: 'ws://x/sidebar', cols: 80, rows: 24, callbacks })
    await Promise.resolve()
    FakeWS.last!.fire('message', { data: 'shell output line\r\n' })
    expect(callbacks.onData).toHaveBeenCalledWith('shell output line\r\n')
  })

  it('forwards binary output too', async () => {
    const callbacks = { onConnect: vi.fn(), onData: vi.fn(), onStatus: vi.fn(), onError: vi.fn(), onExit: vi.fn(), onDisconnect: vi.fn() }
    const transport = createSidebarAdapterTransport({ sessionId: 's1' }, 't1', {}, { WebSocketCtor: FakeWS as unknown as typeof WebSocket })
    transport.connect({ url: 'ws://x/sidebar', cols: 80, rows: 24, callbacks })
    await Promise.resolve()
    FakeWS.last!.fire('message', { data: new Uint8Array([65, 66]).buffer })
    expect(callbacks.onData).toHaveBeenCalledWith('AB')
  })

  it('close surfaces code/reason (better-sidebar deps marker recognized by the view)', async () => {
    const listeners: ResttyTransportListeners = { onClose: vi.fn() }
    const callbacks = { onConnect: vi.fn(), onData: vi.fn(), onStatus: vi.fn(), onError: vi.fn(), onExit: vi.fn(), onDisconnect: vi.fn() }
    const transport = createSidebarAdapterTransport({ sessionId: 's1' }, 't1', listeners, { WebSocketCtor: FakeWS as unknown as typeof WebSocket })
    transport.connect({ url: 'ws://x/sidebar', cols: 80, rows: 24, callbacks })
    await Promise.resolve()
    FakeWS.last!.close(1011, 'pty-deps-missing')
    expect(listeners.onClose).toHaveBeenCalledWith(1011, 'pty-deps-missing')
  })
})
