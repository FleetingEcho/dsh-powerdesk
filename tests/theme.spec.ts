import { describe, it, expect } from 'vitest'
import { colorAlpha, effectiveTokenValue, isDarkScheme, tokenValue } from '../src/client/theme.ts'

describe('theme helpers', () => {
  it('colorAlpha parses hex and functional forms', () => {
    expect(colorAlpha('#fff')).toBe(1)
    expect(colorAlpha('#fffa')).toBeCloseTo(0.667, 1)
    expect(colorAlpha('#112233')).toBe(1)
    expect(colorAlpha('#11223388')).toBeCloseTo(0.53, 1)
    expect(colorAlpha('rgba(1,2,3,0.5)')).toBe(0.5)
    expect(colorAlpha('rgb(1 2 3 / 0.2)')).toBe(0.2)
    expect(colorAlpha('transparent')).toBeNull()
    expect(colorAlpha('red')).toBeNull()
  })

  it('effectiveTokenValue filters unset/transparent/initial', () => {
    // jsdom leaves custom properties unset → '' → filtered to ''.
    expect(effectiveTokenValue('--dsh-does-not-exist')).toBe('')
  })

  it('tokenValue returns "" for an unset token in jsdom', () => {
    expect(tokenValue('--dsh-does-not-exist')).toBe('')
  })

  it('isDarkScheme returns a boolean (no throw in jsdom)', () => {
    expect(typeof isDarkScheme()).toBe('boolean')
  })
})
