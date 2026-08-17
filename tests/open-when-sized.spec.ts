import { describe, it, expect } from 'vitest'
import { openWhenSized } from '../src/client/open-when-sized.ts'

interface FakeHost { isConnected: boolean; clientWidth: number; clientHeight: number }

function makeSchedulers() {
  const pending: { id: number; cb: (t: number) => void }[] = []
  let seq = 0
  const raf = (cb: (t: number) => void): number => { const id = seq++; pending.push({ id, cb }); return id }
  const caf = (id: number): void => {
    const i = pending.findIndex((p) => p.id === id)
    if (i >= 0) pending.splice(i, 1)
  }
  const tick = (): void => { const p = pending.shift(); if (p !== undefined) p.cb(0) }
  return { raf, caf, tick }
}

describe('openWhenSized', () => {
  it('opens on the first frame the host reports a real size', () => {
    const s = makeSchedulers()
    const host: FakeHost = { isConnected: true, clientWidth: 0, clientHeight: 0 }
    let calls = 0
    const cancel = openWhenSized(host as unknown as HTMLElement, () => { calls += 1 }, s.raf, s.caf)
    // First tick: zero-size → reschedules.
    s.tick()
    expect(calls).toBe(0)
    // Host gets a size; next tick opens.
    host.clientWidth = 800
    host.clientHeight = 600
    s.tick()
    expect(calls).toBe(1)
    // No further scheduling after open.
    s.tick()
    expect(calls).toBe(1)
    cancel()
  })

  it('cancel drops a pending open', () => {
    const s = makeSchedulers()
    const host: FakeHost = { isConnected: true, clientWidth: 0, clientHeight: 0 }
    let calls = 0
    const cancel = openWhenSized(host as unknown as HTMLElement, () => { calls += 1 }, s.raf, s.caf)
    s.tick()
    cancel()
    host.clientWidth = 10
    host.clientHeight = 10
    s.tick()
    expect(calls).toBe(0)
  })

  it('stops polling when the host leaves the document', () => {
    const s = makeSchedulers()
    const host: FakeHost = { isConnected: true, clientWidth: 0, clientHeight: 0 }
    let calls = 0
    openWhenSized(host as unknown as HTMLElement, () => { calls += 1 }, s.raf, s.caf)
    s.tick()
    host.isConnected = false
    host.clientWidth = 800
    s.tick()
    expect(calls).toBe(0)
  })
})
