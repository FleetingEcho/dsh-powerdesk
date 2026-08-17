import { describe, it, expect, vi } from 'vitest'
import { RustPty, type RawRustPty, type RustPtyExitEvent } from '../src/rust-pty.ts'

/** A fake raw pty that records calls and lets the test fire data/exit. */
function fakeRaw(): RawRustPty & { emitData(s: string): void; emitExit(e: RustPtyExitEvent): void } {
  let dataCb: ((err: Error | null, s: string) => void) | null = null
  let exitCb: ((err: Error | null, e: RustPtyExitEvent) => void) | null = null
  return {
    onData: vi.fn((cb: (err: Error | null, s: string) => void) => { dataCb = cb }),
    onExit: vi.fn((cb: (err: Error | null, e: RustPtyExitEvent) => void) => { exitCb = cb }),
    write: vi.fn(),
    resize: vi.fn(),
    kill: vi.fn(),
    pid: 4242,
    // Mirrors napi-rs's CalleeHandled ThreadsafeFunction calling convention:
    // the callback receives `(err, value)`, err always null on the success
    // path these tests exercise.
    emitData: (s: string) => { dataCb?.(null, s) },
    emitExit: (e: RustPtyExitEvent) => { exitCb?.(null, e) },
  } as unknown as RawRustPty & { emitData(s: string): void; emitExit(e: RustPtyExitEvent): void }
}

describe('RustPty wrapper', () => {
  it('fans data out to multiple subscribers and lets a disposer remove one', () => {
    const raw = fakeRaw()
    const pty = new RustPty(raw)
    const a = vi.fn()
    const b = vi.fn()
    const offA = pty.onData(a)
    pty.onData(b)
    raw.emitData('hello')
    expect(a).toHaveBeenCalledWith('hello')
    expect(b).toHaveBeenCalledWith('hello')
    offA()
    raw.emitData('world')
    expect(a).toHaveBeenCalledTimes(1)
    expect(b).toHaveBeenCalledWith('world')
  })

  it('a throwing subscriber does not break the others', () => {
    const raw = fakeRaw()
    const pty = new RustPty(raw)
    pty.onData(() => { throw new Error('boom') })
    const ok = vi.fn()
    pty.onData(ok)
    raw.emitData('x')
    expect(ok).toHaveBeenCalledWith('x')
  })

  it('onExit fires for every subscriber', () => {
    const raw = fakeRaw()
    const pty = new RustPty(raw)
    const onExit = vi.fn()
    pty.onExit(onExit)
    raw.emitExit({ exitCode: 0 })
    expect(onExit).toHaveBeenCalledWith({ exitCode: 0 })
  })

  it('write/resize are no-ops after exit; kill/pid delegate to raw', () => {
    const raw = fakeRaw()
    const pty = new RustPty(raw)
    raw.emitExit({ exitCode: 1 })
    expect(pty.hasExited).toBe(true)
    pty.write('late')
    pty.resize(99, 99)
    expect(raw.write).not.toHaveBeenCalled()
    expect(raw.resize).not.toHaveBeenCalled()
    pty.kill()
    expect(raw.kill).toHaveBeenCalled()
    expect(pty.pid).toBe(4242)
  })
})
