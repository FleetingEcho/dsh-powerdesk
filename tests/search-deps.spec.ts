import { describe, it, expect, beforeEach } from 'vitest'
import {
  resetRipgrepCache,
  resolveRipgrepPath,
  ripgrepCandidates,
  ripgrepLoadCause,
  searchDepsStatus,
  type RipgrepProber,
} from '../src/search-deps.ts'

beforeEach(() => { resetRipgrepCache() })

describe('search-deps', () => {
  it('ripgrepCandidates lists env path, prebuilt, then bare PATH lookup', () => {
    const c = ripgrepCandidates('darwin-arm64', '/plugin', { DSH_POWERDESK_RG_PATH: '/abs/rg' }, 'darwin')
    expect(c[0]).toBe('/abs/rg')
    expect(c[1]).toBe('/plugin/prebuilt/darwin-arm64/rg')
    expect(c[2]).toBe('rg')
  })

  it('ripgrepCandidates uses rg.exe on win32', () => {
    const c = ripgrepCandidates('win32-x64-msvc', '/plugin', {}, 'win32')
    expect(c).toContain('/plugin/prebuilt/win32-x64-msvc/rg.exe')
    expect(c).toContain('rg.exe')
  })

  it('resolveRipgrepPath caches the first resolving candidate', () => {
    const prober: RipgrepProber = (spec) => spec === 'rg'
    const first = resolveRipgrepPath(prober)
    expect(first).toBe('rg')
    // A different prober is ignored once cached (same one-shot-cache
    // contract as loadRustPty).
    expect(resolveRipgrepPath(() => false)).toBe('rg')
  })

  it('resolveRipgrepPath returns null and records the cause when every candidate fails', () => {
    expect(resolveRipgrepPath(() => false)).toBeNull()
    expect(ripgrepLoadCause()).toBeInstanceOf(Error)
  })

  it('searchDepsStatus returns ok:true when a candidate resolves', () => {
    resolveRipgrepPath(() => true)
    expect(searchDepsStatus()).toEqual({ ok: true })
  })

  it('searchDepsStatus returns a degraded shape with a repair command when rg is missing', () => {
    resolveRipgrepPath(() => false)
    const status = searchDepsStatus()
    expect(status.ok).toBe(false)
    if (!status.ok) {
      expect(typeof status.command).toBe('string')
      expect(status.command.length).toBeGreaterThan(0)
      expect(typeof status.profile === 'string' || status.profile === null).toBe(true)
    }
  })
})
