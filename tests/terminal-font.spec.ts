import { describe, it, expect } from 'vitest'
import {
  resolveTerminalFont,
  resolveTerminalFontInputs,
  pickFirstFontFamily,
  RESTTY_FONT_FALLBACK_URL,
  RESTTY_FALLBACK_FONT_URLS,
} from '../src/client/terminal-font.ts'
import { DEFAULT_PREFS, DEFAULT_RESTTY_FONT_FAMILY, TERMINAL_FONT_SIZE_MAX, TERMINAL_FONT_WEIGHT_DEFAULT } from '../src/client/prefs.ts'

describe('resolveTerminalFont', () => {
  it('uses the custom family when set', () => {
    expect(resolveTerminalFont({ ...DEFAULT_PREFS, fontFamily: 'JetBrains Mono' }, 'theme-font'))
      .toEqual({ fontFamily: 'JetBrains Mono', fontWeight: TERMINAL_FONT_WEIGHT_DEFAULT, fontSize: 16 })
  })

  it('falls back to the theme code font (first family of a stack), then the built-in default', () => {
    expect(resolveTerminalFont(DEFAULT_PREFS, 'CodeFont').fontFamily).toBe('CodeFont')
    expect(resolveTerminalFont(DEFAULT_PREFS, '"SF Mono", Menlo, monospace').fontFamily).toBe('SF Mono')
    expect(resolveTerminalFont(DEFAULT_PREFS, undefined).fontFamily).toBe(DEFAULT_RESTTY_FONT_FAMILY)
  })

  it('clamps the font size into the supported range', () => {
    expect(resolveTerminalFont({ ...DEFAULT_PREFS, fontSize: 999 }, undefined).fontSize).toBe(TERMINAL_FONT_SIZE_MAX)
  })

  it('passes the font weight through and clamps to the offered set', () => {
    expect(resolveTerminalFont({ ...DEFAULT_PREFS, fontWeight: 700 }, undefined).fontWeight).toBe(700)
    // An odd weight snaps to the nearest offered weight (400/500/600/700).
    expect(resolveTerminalFont({ ...DEFAULT_PREFS, fontWeight: 430 }, undefined).fontWeight).toBe(400)
    expect(resolveTerminalFont({ ...DEFAULT_PREFS, fontWeight: 620 }, undefined).fontWeight).toBe(600)
    // A non-finite weight falls back to the default.
    expect(resolveTerminalFont({ ...DEFAULT_PREFS, fontWeight: Number.NaN }, undefined).fontWeight).toBe(TERMINAL_FONT_WEIGHT_DEFAULT)
  })

  it('defaults the weight to regular when the pref is missing/odd', () => {
    expect(resolveTerminalFont(DEFAULT_PREFS, undefined).fontWeight).toBe(TERMINAL_FONT_WEIGHT_DEFAULT)
  })
})

describe('pickFirstFontFamily', () => {
  it('returns a single family unchanged', () => {
    expect(pickFirstFontFamily('JetBrains Mono')).toBe('JetBrains Mono')
  })

  it('strips surrounding quotes from a named family', () => {
    expect(pickFirstFontFamily('"SF Mono"')).toBe('SF Mono')
    expect(pickFirstFontFamily("'Fira Code'")).toBe('Fira Code')
  })

  it('keeps only the first family of a stack', () => {
    expect(pickFirstFontFamily('"SF Mono", Menlo, Consolas, monospace')).toBe('SF Mono')
    expect(pickFirstFontFamily('JetBrains Mono, ui-monospace, monospace')).toBe('JetBrains Mono')
  })

  it('passes generic families through', () => {
    expect(pickFirstFontFamily('monospace')).toBe('monospace')
  })

  it('returns empty for empty input', () => {
    expect(pickFirstFontFamily('')).toBe('')
    expect(pickFirstFontFamily('   ')).toBe('')
  })
})

describe('RESTTY_FONT_FALLBACK_URL', () => {
  it('is an https URL to a .ttf font', () => {
    expect(RESTTY_FONT_FALLBACK_URL).toMatch(/^https:\/\//)
    expect(RESTTY_FONT_FALLBACK_URL).toMatch(/\.ttf$/)
  })
})

describe('resolveTerminalFontInputs', () => {
  it('puts the primary family first with its JetBrains Mono URL fallback', () => {
    const inputs = resolveTerminalFontInputs('Fira Code', 500)
    expect(inputs[0]).toEqual({ family: 'Fira Code', weight: 500, fallback: RESTTY_FONT_FALLBACK_URL })
  })

  it('includes the emoji/symbol/CJK fallback chain so emoji (🍣) render', () => {
    // Passing a `fonts` array REPLACES restty's DEFAULT_FONT_INPUTS, which
    // include emoji/symbol/CJK sources. Without re-listing them here, emoji
    // (🍣), Nerd Font symbols, and CJK stop rendering. The chain must be
    // present — this test guards the emoji fix against regressions.
    const inputs = resolveTerminalFontInputs('JetBrains Mono', 400)
    const urls = inputs.map(i => (typeof i === 'object' && 'url' in i ? i.url : null)).filter(Boolean) as string[]
    expect(urls).toContain(RESTTY_FALLBACK_FONT_URLS.notoColorEmoji)
    expect(urls).toContain(RESTTY_FALLBACK_FONT_URLS.openMoji)
    expect(urls).toContain(RESTTY_FALLBACK_FONT_URLS.nerdSymbols)
    expect(urls).toContain(RESTTY_FALLBACK_FONT_URLS.notoCjkSc)
  })

  it('every entry is a restty font input (family+fallback OR url), not a mix', () => {
    const inputs = resolveTerminalFontInputs('Fira Code', 400)
    for (const input of inputs) {
      const obj = input as { family?: string; url?: string; fallback?: string }
      // A family input has `family` (and a `fallback`); a url input has `url`.
      // No entry should carry both `family` and `url` (restty's font input is
      // a discriminated union, not a combined object).
      expect(obj.family === undefined || obj.url === undefined).toBe(true)
    }
  })
})
