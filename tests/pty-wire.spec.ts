import { describe, it, expect, vi } from 'vitest'
import { clampDim, handleClientMessage, parseClientFrame } from '../src/pty-wire.ts'
import type { ResttyPty } from '../src/rust-pty-manager.ts'
import type { RustPtyManager } from '../src/rust-pty-manager.ts'

function fakeHandle(): ResttyPty {
  return {
    key: 's1:t1',
    sessionId: 's1',
    tabId: 't1',
    cwd: '/c',
    pty: { write: vi.fn(), resize: vi.fn(), kill: vi.fn(), onData: vi.fn(), onExit: vi.fn(), pid: 1, hasExited: false },
    transcript: '',
    exited: false,
  } as unknown as ResttyPty
}

function fakeMgr(): RustPtyManager {
  return { scheduleClose: vi.fn() } as unknown as RustPtyManager
}

describe('pty-wire', () => {
  it('parseClientFrame parses JSON objects and rejects the rest', () => {
    expect(parseClientFrame('{"type":"input","data":"ls"}')).toEqual({ type: 'input', data: 'ls' })
    expect(parseClientFrame('not json')).toBeNull()
    expect(parseClientFrame('null')).toBeNull()
    expect(parseClientFrame('123')).toBeNull()
  })

  it('clampDim floors, clamps to 2..1024, and falls back on non-finite', () => {
    expect(clampDim(50.9, 80)).toBe(50)
    expect(clampDim(1, 80)).toBe(2)
    expect(clampDim(9999, 80)).toBe(1024)
    expect(clampDim(Number.NaN, 80)).toBe(80)
  })

  it('input frame writes the data to the pty', () => {
    const h = fakeHandle()
    const ctrl = vi.fn()
    handleClientMessage('{"type":"input","data":"ls -la\\n"}', h, fakeMgr(), ctrl, vi.fn())
    expect(h.pty.write).toHaveBeenCalledWith('ls -la\n')
    expect(ctrl).not.toHaveBeenCalled()
  })

  it('resize frame clamps and forwards pixel hints', () => {
    const h = fakeHandle()
    handleClientMessage('{"type":"resize","cols":120.7,"rows":30,"widthPx":720,"heightPx":480}', h, fakeMgr(), vi.fn(), vi.fn())
    expect(h.pty.resize).toHaveBeenCalledWith(120, 30, 720, 480)
  })

  it('close frame schedules an immediate close', () => {
    const h = fakeHandle()
    const mgr = fakeMgr()
    handleClientMessage('{"type":"close"}', h, mgr, vi.fn(), vi.fn())
    expect(mgr.scheduleClose).toHaveBeenCalledWith('s1:t1', 0)
  })

  it('non-JSON text sends an error control frame', () => {
    const h = fakeHandle()
    const ctrl = vi.fn()
    handleClientMessage('garbage', h, fakeMgr(), ctrl, vi.fn())
    expect(ctrl).toHaveBeenCalledWith({ type: 'error', message: 'expected a JSON control frame' })
  })

  it('unknown type sends an error control frame', () => {
    const h = fakeHandle()
    const ctrl = vi.fn()
    handleClientMessage('{"type":"frob"}', h, fakeMgr(), ctrl, vi.fn())
    expect(ctrl).toHaveBeenCalledWith({ type: 'error', message: 'unknown message type: frob' })
  })
})
