import { describe, it, expect } from 'vitest'
import { relativeTo, atReference } from '../src/client/FileExplorer.tsx'

describe('relativeTo', () => {
  it('strips the root prefix, leaving the path under root', () => {
    expect(relativeTo('/work/proj', '/work/proj/package.json')).toBe('package.json')
    expect(relativeTo('/work/proj', '/work/proj/src/index.ts')).toBe('src/index.ts')
  })

  it('handles a trailing slash on root', () => {
    expect(relativeTo('/work/proj/', '/work/proj/package.json')).toBe('package.json')
  })

  it('returns the basename when path equals root', () => {
    expect(relativeTo('/work/proj', '/work/proj')).toBe('proj')
  })

  it('falls back to the absolute path when path is not under root', () => {
    expect(relativeTo('/work/proj', '/elsewhere/x.txt')).toBe('/elsewhere/x.txt')
  })
})

describe('atReference', () => {
  it('prefixes the relative path with @', () => {
    // The user's @file mention convention: clicking the @ icon on
    // package.json copies @package.json, on src/index.ts copies @src/index.ts.
    expect(atReference('/work/proj', '/work/proj/package.json')).toBe('@package.json')
    expect(atReference('/work/proj', '/work/proj/src/index.ts')).toBe('@src/index.ts')
  })

  it('handles a trailing slash on root', () => {
    expect(atReference('/work/proj/', '/work/proj/package.json')).toBe('@package.json')
  })

  it('prefixes the basename with @ when path equals root', () => {
    expect(atReference('/work/proj', '/work/proj')).toBe('@proj')
  })

  it('always includes the @, even for a relative path that is not under root', () => {
    // atReference is the @-button handler: @ is always part of the copied
    // text regardless of how relativeTo falls back.
    expect(atReference('/work/proj', '/elsewhere/x.txt')).toBe('@/elsewhere/x.txt')
  })
})
