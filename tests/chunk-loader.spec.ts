import { describe, it, expect, beforeEach } from 'vitest'
import { loadChunk, resetChunks, setChunkLoader } from '../src/client/chunk-loader.ts'

beforeEach(() => {
  resetChunks()
  delete (globalThis as { __dshPowerdeskChunks__?: unknown }).__dshPowerdeskChunks__
  ;(globalThis as { __DSH_MODULES__?: { import: (spec: string) => unknown } }).__DSH_MODULES__ = {
    import: (spec: string) => ({ __spec: spec }),
  }
})

describe('chunk-loader', () => {
  it('loads via an injected loader that registers the factory, resolving externals through __DSH_MODULES__', async () => {
    let seenUrl = ''
    setChunkLoader('terminal', async (url) => {
      seenUrl = url
      const reg = (globalThis as { __dshPowerdeskChunks__?: Record<string, unknown> }).__dshPowerdeskChunks__ ?? (
        (globalThis as { __dshPowerdeskChunks__?: Record<string, unknown> }).__dshPowerdeskChunks__ = {}
      )
      reg['terminal'] = (require: (s: string) => unknown) => ({ Terminal: 'comp', react: require('react') })
    })
    const mod = (await loadChunk('terminal')) as { Terminal: unknown; react: { __spec: string } }
    expect(seenUrl).toBe('/powerdesk/bundle/terminal.js')
    expect(mod.Terminal).toBe('comp')
    expect(mod.react).toEqual({ __spec: 'react' })
  })

  it('uses a plugin-private registry (does NOT touch the shared __dshChunks__ that dsh-better-sidebar owns)', async () => {
    // dsh-better-sidebar registers its own chunks on globalThis.__dshChunks__.
    // Pre-seed that shared table to prove powerdesk neither reads nor writes it.
    const shared = { terminal: () => ({ from: 'dsh-better-sidebar' }), editor: () => ({}) }
    ;(globalThis as { __dshChunks__?: Record<string, unknown> }).__dshChunks__ = shared
    setChunkLoader('terminal', async () => {
      const reg = (globalThis as { __dshPowerdeskChunks__?: Record<string, unknown> }).__dshPowerdeskChunks__ ?? (
        (globalThis as { __dshPowerdeskChunks__?: Record<string, unknown> }).__dshPowerdeskChunks__ = {}
      )
      reg['terminal'] = () => ({ from: 'dsh-powerdesk' })
    })
    const mod = (await loadChunk('terminal')) as { from: string }
    // powerdesk got its OWN factory's exports, not dsh-better-sidebar's.
    expect(mod.from).toBe('dsh-powerdesk')
    // The shared __dshChunks__ table is untouched (no overwrite, no collision).
    expect((globalThis as { __dshChunks__?: Record<string, unknown> }).__dshChunks__).toBe(shared)
    // powerdesk's factory lives on its private registry, NOT the shared one.
    const sharedTerminal = (globalThis as { __dshChunks__?: Record<string, unknown> }).__dshChunks__?.terminal
    expect(typeof sharedTerminal).toBe('function')
    expect((sharedTerminal as () => { from: string })().from).toBe('dsh-better-sidebar')
  })

  it('memoizes the in-flight load (one factory execution)', async () => {
    let calls = 0
    setChunkLoader('terminal', async () => {
      calls += 1
      ;(globalThis as { __dshPowerdeskChunks__?: Record<string, unknown> }).__dshPowerdeskChunks__ = { terminal: () => ({}) }
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
      ;(globalThis as { __dshPowerdeskChunks__?: Record<string, unknown> }).__dshPowerdeskChunks__ = { terminal: () => ({ ok: 1 }) }
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

  it('tolerates an unresolvable external the chunk does not require (per-spec soft-fail)', async () => {
    // The running DSH version may not seed every CLIENT_EXTERNAL (e.g. `cordis`
    // under its bare name). The terminal/browser chunks only require
    // `react` + `react/jsx-runtime`, so an external whose import() throws must
    // be stored as `undefined` and left inert — NOT abort the whole chunk load.
    // (Regression: an earlier hard-fail here broke every chunk load with
    // "chunk external \"cordis\" is not available in the module table".)
    ;(globalThis as { __DSH_MODULES__?: { import: (spec: string) => unknown } }).__DSH_MODULES__ = {
      import: (spec: string) => {
        if (spec === 'cordis') throw new Error('not seeded')
        if (spec === '@deepseek-ai/dsh-client-runtime/client') throw new Error('not seeded')
        return { __spec: spec }
      },
    }
    setChunkLoader('terminal', async () => {
      const reg = (globalThis as { __dshPowerdeskChunks__?: Record<string, unknown> }).__dshPowerdeskChunks__ ?? (
        (globalThis as { __dshPowerdeskChunks__?: Record<string, unknown> }).__dshPowerdeskChunks__ = {}
      )
      reg['terminal'] = (require: (s: string) => unknown) => ({ react: require('react') })
    })
    const mod = (await loadChunk('terminal')) as { react: { __spec: string } }
    expect(mod.react).toEqual({ __spec: 'react' })
  })
})
