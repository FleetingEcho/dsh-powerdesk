import { describe, it, expect, beforeEach } from 'vitest'
import {
  DEFAULT_PREFS,
  PREFS_STORAGE_KEY,
  TERMINAL_FONT_SIZE_DEFAULT,
  TERMINAL_FONT_SIZE_MAX,
  TERMINAL_FONT_SIZE_MIN,
  TERMINAL_FONT_WEIGHT_DEFAULT,
  clampResttyFontSize,
  clampResttyFontWeight,
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
    expect(clampResttyFontSize(Number.NaN)).toBe(TERMINAL_FONT_SIZE_DEFAULT)
    expect(clampResttyFontSize(13.6)).toBe(14)
  })

  it('mergePrefs fills defaults and only accepts the known backend values', () => {
    expect(mergePrefs(null)).toEqual(DEFAULT_PREFS)
    const p = mergePrefs({ fontFamily: 'Fira Code', fontSize: 99, ptyBackend: 'better-sidebar', themeName: 'Aizen Dark', extra: 'ignored' })
    expect(p).toEqual({ fontFamily: 'Fira Code', fontWeight: TERMINAL_FONT_WEIGHT_DEFAULT, fontSize: TERMINAL_FONT_SIZE_MAX, ptyBackend: 'better-sidebar', themeName: 'Aizen Dark' })
    expect(mergePrefs({ ptyBackend: 'weird' }).ptyBackend).toBe('own')
  })

  it('clampResttyFontWeight snaps to the nearest offered weight and defaults NaN', () => {
    expect(clampResttyFontWeight(400)).toBe(400)
    expect(clampResttyFontWeight(700)).toBe(700)
    expect(clampResttyFontWeight(430)).toBe(400)
    expect(clampResttyFontWeight(560)).toBe(600)
    expect(clampResttyFontWeight(650)).toBe(600)
    expect(clampResttyFontWeight(Number.NaN)).toBe(TERMINAL_FONT_WEIGHT_DEFAULT)
  })

  it('mergePrefs accepts and clamps the font weight', () => {
    expect(mergePrefs({ fontWeight: 700 }).fontWeight).toBe(700)
    expect(mergePrefs({ fontWeight: 430 }).fontWeight).toBe(400)
    expect(mergePrefs({ fontWeight: 'bad' }).fontWeight).toBe(TERMINAL_FONT_WEIGHT_DEFAULT)
  })

  it('readPrefsFromLocalStorage returns defaults when empty', () => {
    expect(readPrefsFromLocalStorage()).toEqual(DEFAULT_PREFS)
  })

  it('readPrefsFromLocalStorage resets a stale below-minimum font size to the default', () => {
    // A stored size below the supported minimum is almost always a stale/corrupt
    // entry (e.g. the earlier empty-field input bug that committed 0 → clamped
    // to the old min 8). It must reset to the DEFAULT (16), not silently bump to
    // the new minimum (12) — the user never chose it.
    localStorage.setItem(PREFS_STORAGE_KEY, JSON.stringify({ fontSize: 8 }))
    expect(readPrefsFromLocalStorage().fontSize).toBe(TERMINAL_FONT_SIZE_DEFAULT)
    // The boundary: a stored size AT the minimum is kept (it is a valid choice).
    localStorage.setItem(PREFS_STORAGE_KEY, JSON.stringify({ fontSize: TERMINAL_FONT_SIZE_MIN }))
    expect(readPrefsFromLocalStorage().fontSize).toBe(TERMINAL_FONT_SIZE_MIN)
    // An in-range stored size is kept.
    localStorage.setItem(PREFS_STORAGE_KEY, JSON.stringify({ fontSize: 14 }))
    expect(readPrefsFromLocalStorage().fontSize).toBe(14)
  })

  it('writePrefsToLocalStorage persists and clamps, and reads back', () => {
    const next = writePrefsToLocalStorage({ fontSize: 99, ptyBackend: 'better-sidebar' })
    expect(next.fontSize).toBe(TERMINAL_FONT_SIZE_MAX)
    expect(next.ptyBackend).toBe('better-sidebar')
    const raw = JSON.parse(localStorage.getItem(PREFS_STORAGE_KEY)!) as Record<string, unknown>
    expect(raw.fontSize).toBe(TERMINAL_FONT_SIZE_MAX)
    expect(readPrefsFromLocalStorage().fontSize).toBe(TERMINAL_FONT_SIZE_MAX)
  })

  it('writePrefsToLocalStorage clamps a low font size to the minimum (not the default)', () => {
    // The read path resets below-min STALE values to the default, but a fresh
    // out-of-range WRITE must clamp to the nearest bound (the minimum) — that
    // is standard clamp behaviour for a deliberately typed invalid number.
    const next = writePrefsToLocalStorage({ fontSize: 5 })
    expect(next.fontSize).toBe(TERMINAL_FONT_SIZE_MIN)
    expect(readPrefsFromLocalStorage().fontSize).toBe(TERMINAL_FONT_SIZE_MIN)
  })
})
