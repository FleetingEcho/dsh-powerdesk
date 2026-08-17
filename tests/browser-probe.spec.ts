import { describe, it, expect } from 'vitest'
import { extractFrameAncestors } from '../src/browser-probe.ts'

describe('extractFrameAncestors', () => {
  it('returns undefined for a null header', () => {
    expect(extractFrameAncestors(null)).toBeUndefined()
  })

  it('returns undefined when the directive is absent', () => {
    expect(extractFrameAncestors('default-src \'self\'')).toBeUndefined()
  })

  it('extracts the frame-ancestors source list', () => {
    expect(extractFrameAncestors("frame-ancestors 'self' https://example.com")).toEqual([
      "'self'",
      'https://example.com',
    ])
  })

  it('handles multiple CSP directives (only frame-ancestors is extracted)', () => {
    const csp = "default-src 'self'; frame-ancestors 'none'; script-src 'self'"
    expect(extractFrameAncestors(csp)).toEqual(["'none'"])
  })

  it('returns undefined for an empty frame-ancestors list', () => {
    expect(extractFrameAncestors('frame-ancestors')).toBeUndefined()
    expect(extractFrameAncestors('frame-ancestors   ')).toBeUndefined()
  })

  it('handles the wildcard source', () => {
    expect(extractFrameAncestors('frame-ancestors *')).toEqual(['*'])
  })

  it('handles a complex multi-directive policy', () => {
    const csp = "default-src 'self'; img-src *; frame-ancestors 'self' https://a.com https://b.com; object-src 'none'"
    expect(extractFrameAncestors(csp)).toEqual(["'self'", 'https://a.com', 'https://b.com'])
  })
})
