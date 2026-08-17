import { describe, it, expect, beforeEach } from 'vitest'
import {
  DEFAULT_PREFS,
  PREFS_STORAGE_KEY,
  TERMINAL_FONT_SIZE_MAX,
  TERMINAL_FONT_SIZE_MIN,
  clampResttyFontSize,
  mergePrefs,
  readPrefsFromLocalStorage,
  writePrefsToLocalStorage,
} from '../src/client/prefs.ts'

beforeEach(() => {
  localStorage.clear()
})

describe('prefs', () => {
  it('clampResttyFontSize clamps to the supported range and defaults NaN', () => {
    expect(clampResttyFontSize(15)).toBe(15)
    expect(clampResttyFontSize(0)).toBe(TERMINAL_FONT_SIZE_MIN)
    expect(clampResttyFontSize(999)).toBe(TERMINAL_FONT_SIZE_MAX)
    expect(clampResttyFontSize(Number.NaN)).toBe(15)
    expect(clampResttyFontSize(13.6)).toBe(14)
  })

  it('mergePrefs fills defaults and only accepts the known backend values', () => {
    expect(mergePrefs(null)).toEqual(DEFAULT_PREFS)
    const p = mergePrefs({ fontFamily: 'Fira Code', fontSize: 99, ptyBackend: 'better-sidebar', themeName: 'Aizen Dark', extra: 'ignored' })
    expect(p).toEqual({ fontFamily: 'Fira Code', fontSize: TERMINAL_FONT_SIZE_MAX, ptyBackend: 'better-sidebar', themeName: 'Aizen Dark' })
    expect(mergePrefs({ ptyBackend: 'weird' }).ptyBackend).toBe('own')
  })

  it('readPrefsFromLocalStorage returns defaults when empty', () => {
    expect(readPrefsFromLocalStorage()).toEqual(DEFAULT_PREFS)
  })

  it('writePrefsToLocalStorage persists and clamps, and reads back', () => {
    const next = writePrefsToLocalStorage({ fontSize: 99, ptyBackend: 'better-sidebar' })
    expect(next.fontSize).toBe(TERMINAL_FONT_SIZE_MAX)
    expect(next.ptyBackend).toBe('better-sidebar')
    const raw = JSON.parse(localStorage.getItem(PREFS_STORAGE_KEY)!) as Record<string, unknown>
    expect(raw.fontSize).toBe(TERMINAL_FONT_SIZE_MAX)
    expect(readPrefsFromLocalStorage().fontSize).toBe(TERMINAL_FONT_SIZE_MAX)
  })
})
