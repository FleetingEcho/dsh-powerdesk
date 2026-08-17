import { describe, it, expect, beforeEach } from 'vitest'
import { attachLocale, getLocale, isZh, t } from '../src/client/locales.ts'
import type { ResttyLocaleService } from '../src/context-types.ts'

function fakeLocale(active: string): ResttyLocaleService {
  return {
    getSnapshot: () => ({ active }),
    subscribe: () => () => {},
    register: () => () => {},
  }
}

describe('locales', () => {
  beforeEach(() => { attachLocale(fakeLocale('en')) })

  it('translates the default English dictionary', () => {
    attachLocale(fakeLocale('en'))
    expect(t('tabTitle')).toBe('Terminal')
    expect(isZh()).toBe(false)
    expect(getLocale()).toBe('en')
  })

  it('switches to Chinese when the active locale is zh', () => {
    attachLocale(fakeLocale('zh'))
    expect(t('tabTitle')).toBe('终端')
    expect(isZh()).toBe(true)
  })

  it('substitutes {param} placeholders', () => {
    attachLocale(fakeLocale('zh'))
    expect(t('terminalDepsProfile', { profile: 'web' })).toBe('（profile：web）')
  })

  it('falls back to the key for unknown strings', () => {
    expect(t('nope.nope')).toBe('nope.nope')
  })
})
