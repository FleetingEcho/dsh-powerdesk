import { describe, it, expect, beforeEach } from 'vitest'
import { loadChunk, resetChunks, setChunkLoader } from '../src/client/chunk-loader.ts'

beforeEach(() => {
  resetChunks()
  delete (globalThis as { __dshChunks__?: unknown }).__dshChunks__
  ;(globalThis as { __DSH_MODULES__?: { import: (spec: string) => unknown } }).__DSH_MODULES__ = {
    import: (spec: string) => ({ __spec: spec }),
  }
})

describe('chunk-loader', () => {
  it('loads via an injected loader that registers the factory, resolving externals through __DSH_MODULES__', async () => {
    let seenUrl = ''
    setChunkLoader('terminal', async (url) => {
      seenUrl = url
      const reg = (globalThis as { __dshChunks__?: Record<string, unknown> }).__dshChunks__ ?? (
        (globalThis as { __dshChunks__?: Record<string, unknown> }).__dshChunks__ = {}
      )
      reg['terminal'] = (require: (s: string) => unknown) => ({ Terminal: 'comp', react: require('react') })
    })
    const mod = (await loadChunk('terminal')) as { Terminal: unknown; react: { __spec: string } }
    expect(seenUrl).toBe('/powerdesk/bundle/terminal.js')
    expect(mod.Terminal).toBe('comp')
    expect(mod.react).toEqual({ __spec: 'react' })
  })

  it('memoizes the in-flight load (one factory execution)', async () => {
    let calls = 0
    setChunkLoader('terminal', async () => {
      calls += 1
      ;(globalThis as { __dshChunks__?: Record<string, unknown> }).__dshChunks__ = { terminal: () => ({}) }
    })
    const a = loadChunk('terminal')
    const b = loadChunk('terminal')
    expect(a).toBe(b)
    await a
    expect(calls).toBe(1)
  })

  it('retries after a failed load (the cache entry is cleared on failure)', async () => {
    let fail = true
    setChunkLoader('terminal', async () => {
      if (fail) throw new Error('boom')
      ;(globalThis as { __dshChunks__?: Record<string, unknown> }).__dshChunks__ = { terminal: () => ({ ok: 1 }) }
    })
    await expect(loadChunk('terminal')).rejects.toThrow('boom')
    fail = false
    const mod = (await loadChunk('terminal')) as { ok: number }
    expect(mod.ok).toBe(1)
  })

  it('throws when the client module system is unavailable', async () => {
    delete (globalThis as { __DSH_MODULES__?: unknown }).__DSH_MODULES__
    setChunkLoader('terminal', async () => {})
    await expect(loadChunk('terminal')).rejects.toThrow('module system unavailable')
  })
})
