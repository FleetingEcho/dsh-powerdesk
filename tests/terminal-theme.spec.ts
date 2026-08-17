import { describe, it, expect } from 'vitest'
import {
  TERMINAL_THEME_PRESETS,
  DEFAULT_DARK_THEME,
  DEFAULT_LIGHT_THEME,
  resolveResttyThemeName,
  themePresetLabelKey,
} from '../src/client/terminal-theme.ts'

describe('resolveResttyThemeName', () => {
  it("'' and 'auto' follow the scheme", () => {
    expect(resolveResttyThemeName('', true)).toBe(DEFAULT_DARK_THEME)
    expect(resolveResttyThemeName('', false)).toBe(DEFAULT_LIGHT_THEME)
    expect(resolveResttyThemeName('auto', true)).toBe(DEFAULT_DARK_THEME)
    expect(resolveResttyThemeName('auto', false)).toBe(DEFAULT_LIGHT_THEME)
  })

  it('maps curated preset ids to restty builtin names', () => {
    expect(resolveResttyThemeName('tokyo-night', true)).toBe('TokyoNight')
    expect(resolveResttyThemeName('tokyo-night', false)).toBe('TokyoNight')
    expect(resolveResttyThemeName('dracula', true)).toBe('Dracula')
    expect(resolveResttyThemeName('high-contrast', true)).toBe('Xcode Dark hc')
    expect(resolveResttyThemeName('nord', true)).toBe('Nord')
  })

  it('ignores scheme for an explicit preset (a dark theme stays dark in light mode)', () => {
    expect(resolveResttyThemeName('dracula', false)).toBe('Dracula')
    expect(resolveResttyThemeName('tokyo-night-storm', false)).toBe('TokyoNight Storm')
  })

  it('passes a raw restty builtin name through unchanged (the "More…" path)', () => {
    expect(resolveResttyThemeName('Gruvbox Dark Hard', true)).toBe('Gruvbox Dark Hard')
    expect(resolveResttyThemeName('Catppuccin Frappe', false)).toBe('Catppuccin Frappe')
  })

  it('trims whitespace before resolving', () => {
    expect(resolveResttyThemeName('  auto  ', true)).toBe(DEFAULT_DARK_THEME)
    expect(resolveResttyThemeName('  dracula  ', true)).toBe('Dracula')
  })

  it('degrades an unknown name by returning it as-is (ResttyTerminal falls back)', () => {
    // The resolver does not validate against restty's catalog (kept pure, no
    // restty import); an unknown name is passed through so ResttyTerminal's
    // getBuiltinTheme(name) returns null and falls back to the scheme default.
    expect(resolveResttyThemeName('This Theme Does Not Exist', true)).toBe('This Theme Does Not Exist')
  })
})

describe('TERMINAL_THEME_PRESETS', () => {
  it('starts with the auto (scheme-following) preset', () => {
    const first = TERMINAL_THEME_PRESETS[0]
    expect(first).toBeDefined()
    expect(first?.id).toBe('auto')
    expect(first?.builtin).toBeUndefined()
  })

  it('includes the user-named presets', () => {
    const ids = TERMINAL_THEME_PRESETS.map(p => p.id)
    expect(ids).toContain('tokyo-night')
    expect(ids).toContain('dracula')
    expect(ids).toContain('high-contrast')
  })

  it('every non-auto preset maps to a restty builtin name', () => {
    for (const p of TERMINAL_THEME_PRESETS) {
      if (p.id === 'auto') continue
      const builtin = p.builtin
      expect(typeof builtin).toBe('string')
      expect(builtin).not.toBe('')
    }
  })

  it('has stable, unique ids', () => {
    const ids = TERMINAL_THEME_PRESETS.map(p => p.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})

describe('themePresetLabelKey', () => {
  it('maps preset ids to theme* locale keys', () => {
    expect(themePresetLabelKey('auto')).toBe('themeAuto')
    expect(themePresetLabelKey('tokyo-night')).toBe('themeTokyoNight')
    expect(themePresetLabelKey('tokyo-night-storm')).toBe('themeTokyoNightStorm')
    expect(themePresetLabelKey('dracula-plus')).toBe('themeDraculaPlus')
    expect(themePresetLabelKey('high-contrast')).toBe('themeHighContrast')
    expect(themePresetLabelKey('catppuccin-mocha')).toBe('themeCatppuccinMocha')
    expect(themePresetLabelKey('github-dark')).toBe('themeGithubDark')
  })

  it('maps empty to the auto key', () => {
    expect(themePresetLabelKey('')).toBe('themeAuto')
  })
})
