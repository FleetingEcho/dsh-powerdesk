import { describe, it, expect } from 'vitest'
import { embeddabilityOf, type BrowserProbeResult } from '../src/client/browser.ts'

describe('embeddabilityOf', () => {
  it('returns unknown when the site is unreachable', () => {
    const probe: BrowserProbeResult = { reachable: false }
    expect(embeddabilityOf(probe)).toBe('unknown')
  })

  it('returns embeddable when no blocking headers are present', () => {
    const probe: BrowserProbeResult = { reachable: true, status: 200 }
    expect(embeddabilityOf(probe)).toBe('embeddable')
  })

  it('returns blocked for X-Frame-Options DENY', () => {
    const probe: BrowserProbeResult = { reachable: true, xFrameOptions: 'DENY' }
    expect(embeddabilityOf(probe)).toBe('blocked')
  })

  it('returns blocked for X-Frame-Options SAMEORIGIN', () => {
    const probe: BrowserProbeResult = { reachable: true, xFrameOptions: 'SAMEORIGIN' }
    expect(embeddabilityOf(probe)).toBe('blocked')
  })

  it('returns blocked for X-Frame-Options sameorigin (case-insensitive)', () => {
    const probe: BrowserProbeResult = { reachable: true, xFrameOptions: 'sameorigin' }
    expect(embeddabilityOf(probe)).toBe('blocked')
  })

  it('is NOT blocked by ALLOW-FROM (deprecated, treated as embeddable)', () => {
    const probe: BrowserProbeResult = { reachable: true, xFrameOptions: 'ALLOW-FROM https://example.com' }
    expect(embeddabilityOf(probe)).toBe('embeddable')
  })

  it('returns blocked when frame-ancestors is none', () => {
    const probe: BrowserProbeResult = { reachable: true, frameAncestors: ["'none'"] }
    expect(embeddabilityOf(probe)).toBe('blocked')
  })

  it('returns blocked when frame-ancestors is self only (never ours)', () => {
    const probe: BrowserProbeResult = { reachable: true, frameAncestors: ["'self'"] }
    expect(embeddabilityOf(probe)).toBe('blocked')
  })

  it('returns embeddable when frame-ancestors allows *', () => {
    const probe: BrowserProbeResult = { reachable: true, frameAncestors: ['*'] }
    expect(embeddabilityOf(probe)).toBe('embeddable')
  })

  it('returns embeddable when frame-ancestors includes * among others', () => {
    const probe: BrowserProbeResult = { reachable: true, frameAncestors: ["'self'", '*'] }
    expect(embeddabilityOf(probe)).toBe('embeddable')
  })

  it('returns blocked when frame-ancestors lists specific origins (no *)', () => {
    const probe: BrowserProbeResult = { reachable: true, frameAncestors: ['https://a.com', 'https://b.com'] }
    expect(embeddabilityOf(probe)).toBe('blocked')
  })

  it('X-Frame-Options + frame-ancestors both blocking → blocked', () => {
    const probe: BrowserProbeResult = { reachable: true, xFrameOptions: 'DENY', frameAncestors: ["'none'"] }
    expect(embeddabilityOf(probe)).toBe('blocked')
  })

  it('handles a real-world Google probe (X-Frame-Options SAMEORIGIN)', () => {
    // The exact error the user reported: Google sets X-Frame-Options: sameorigin
    const probe: BrowserProbeResult = {
      reachable: true,
      url: 'https://www.google.com/',
      status: 200,
      xFrameOptions: 'SAMEORIGIN',
    }
    expect(embeddabilityOf(probe)).toBe('blocked')
  })
})
