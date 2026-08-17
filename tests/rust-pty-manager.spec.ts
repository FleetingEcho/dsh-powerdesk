import { describe, it, expect, beforeEach, vi } from 'vitest'
import { RustPtyManager, type ResttyPty } from '../src/rust-pty-manager.ts'
import { ResttyError } from '../src/wire.ts'
import type { RawRustPty, RustPtyExitEvent, RustPtyModule, RustPtySpawnOptions } from '../src/rust-pty.ts'

interface FakeRaw extends RawRustPty {
  emitData(s: string): void
  emitExit(e: RustPtyExitEvent): void
}

function fakeRaw(): FakeRaw {
  let dataCb: ((s: string) => void) | null = null
  let exitCb: ((e: RustPtyExitEvent) => void) | null = null
  return {
    on_data: (cb: (s: string) => void) => { dataCb = cb },
    on_exit: (cb: (e: RustPtyExitEvent) => void) => { exitCb = cb },
    write: vi.fn(),
    resize: vi.fn(),
    kill: vi.fn(),
    pid: 1,
    emitData: (s: string) => { dataCb?.(s) },
    emitExit: (e: RustPtyExitEvent) => { exitCb?.(e) },
  } as unknown as FakeRaw
}

function fakeModule(): { mod: RustPtyModule; raws: FakeRaw[] } {
  const raws: FakeRaw[] = []
  const mod: RustPtyModule = {
    spawn: vi.fn((_shell: string, _args: string[], _opts: RustPtySpawnOptions) => {
      const raw = fakeRaw()
      raws.push(raw)
      return raw
    }),
  }
  return { mod, raws }
}

describe('RustPtyManager', () => {
  beforeEach(() => { vi.useFakeTimers() })

  it('open spawns a pty and mirrors output into the transcript', () => {
    const { mod, raws } = fakeModule()
    const mgr = new RustPtyManager('/bin/bash', 3, mod, 'linux')
    const h = mgr.open('s1', 't1', '/cwd', 80, 24)
    expect(raws.length).toBe(1)
    expect(mod.spawn).toHaveBeenCalledWith('/bin/bash', ['-l'], expect.objectContaining({ cwd: '/cwd', cols: 80, rows: 24 }))
    raws[0]!.emitData('hello')
    expect(h.transcript).toBe('hello')
    expect(h.exited).toBe(false)
  })

  it('reuses the same pty on reconnect (same key + cwd)', () => {
    const { mod } = fakeModule()
    const mgr = new RustPtyManager('/bin/bash', 3, mod, 'linux')
    const h1 = mgr.open('s1', 't1', '/cwd', 80, 24)
    const h2 = mgr.open('s1', 't1', '/cwd', 80, 24)
    expect(h2).toBe(h1)
  })

  it('respawns when the cwd changed (a shell in the wrong directory must not linger)', () => {
    const { mod, raws } = fakeModule()
    const mgr = new RustPtyManager('/bin/bash', 3, mod, 'linux')
    mgr.open('s1', 't1', '/a', 80, 24)
    const h2 = mgr.open('s1', 't1', '/b', 80, 24)
    expect(raws.length).toBe(2)
    expect(h2.cwd).toBe('/b')
  })

  it('respawns an exited handle on reopen', () => {
    const { mod, raws } = fakeModule()
    const mgr = new RustPtyManager('/bin/bash', 3, mod, 'linux')
    const h = mgr.open('s1', 't1', '/cwd', 80, 24)
    raws[0]!.emitExit({ exitCode: 0 })
    expect(h.exited).toBe(true)
    mgr.open('s1', 't1', '/cwd', 80, 24)
    expect(raws.length).toBe(2)
  })

  it('enforces the per-session quota', () => {
    const { mod } = fakeModule()
    const mgr = new RustPtyManager('/bin/bash', 2, mod, 'linux')
    mgr.open('s1', 't1', '/c', 80, 24)
    mgr.open('s1', 't2', '/c', 80, 24)
    expect(() => mgr.open('s1', 't3', '/c', 80, 24)).toThrow(ResttyError)
  })

  it('quota counts only live terminals of the same session', () => {
    const { mod, raws } = fakeModule()
    const mgr = new RustPtyManager('/bin/bash', 1, mod, 'linux')
    mgr.open('s1', 't1', '/c', 80, 24)
    raws[0]!.emitExit({ exitCode: 0 })
    // An exited handle is reaped on the next open, freeing the quota.
    expect(() => mgr.open('s1', 't2', '/c', 80, 24)).not.toThrow()
  })

  it('scheduleClose kills after the grace; cancelClose and open keep it alive', () => {
    const { mod, raws } = fakeModule()
    const mgr = new RustPtyManager('/bin/bash', 3, mod, 'linux')
    const h = mgr.open('s1', 't1', '/c', 80, 24)
    const kill = vi.spyOn(h.pty, 'kill')
    mgr.scheduleClose(h.key, 1000)
    // Reopen cancels the pending close.
    mgr.open('s1', 't1', '/c', 80, 24)
    vi.advanceTimersByTime(2000)
    expect(kill).not.toHaveBeenCalled()
    expect(mgr.get(h.key)).toBeDefined()

    // A bare drop schedules a close that fires after the grace.
    mgr.scheduleClose(h.key, 1000)
    vi.advanceTimersByTime(2000)
    expect(kill).toHaveBeenCalled()
    expect(mgr.get(h.key)).toBeUndefined()
    void raws
  })

  it('disposeAll closes every terminal', () => {
    const { mod, raws } = fakeModule()
    const mgr = new RustPtyManager('/bin/bash', 3, mod, 'linux')
    mgr.open('s1', 't1', '/c', 80, 24)
    mgr.open('s1', 't2', '/c', 80, 24)
    mgr.disposeAll()
    expect(raws[0]!.kill).toHaveBeenCalled()
    expect(raws[1]!.kill).toHaveBeenCalled()
  })

  it('keysOf lists only the session\u2019s terminals', () => {
    const { mod } = fakeModule()
    const mgr = new RustPtyManager('/bin/bash', 3, mod, 'linux')
    mgr.open('s1', 't1', '/c', 80, 24)
    mgr.open('s2', 't1', '/c', 80, 24)
    expect(mgr.keysOf('s1')).toEqual(['s1:t1'])
    expect(mgr.keysOf('s2')).toEqual(['s2:t1'])
  })

  it('close releases the quota immediately', () => {
    const { mod } = fakeModule()
    const mgr = new RustPtyManager('/bin/bash', 1, mod, 'linux')
    const h: ResttyPty = mgr.open('s1', 't1', '/c', 80, 24)
    mgr.close(h.key)
    expect(() => mgr.open('s1', 't2', '/c', 80, 24)).not.toThrow()
  })
})
