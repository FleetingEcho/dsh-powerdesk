import { describe, it, expect } from 'vitest'
import {
  DEFAULT_EDITOR_THEME,
  DARK_AUTO_EDITOR_THEME,
  LIGHT_AUTO_EDITOR_THEME,
  EDITOR_THEME_PRESETS,
  resolveEditorThemeId,
  editorThemeSpec,
} from '../src/client/editor-theme.ts'

describe('resolveEditorThemeId', () => {
  it("'' and 'auto' follow the scheme", () => {
    expect(resolveEditorThemeId('', true)).toBe(DARK_AUTO_EDITOR_THEME)
    expect(resolveEditorThemeId('', false)).toBe(LIGHT_AUTO_EDITOR_THEME)
    expect(resolveEditorThemeId('auto', true)).toBe(DARK_AUTO_EDITOR_THEME)
    expect(resolveEditorThemeId('  auto  ', false)).toBe(LIGHT_AUTO_EDITOR_THEME)
  })

  it('returns an explicit curated preset id unchanged, regardless of scheme', () => {
    // A dark palette stays dark in light mode — the user picked a palette,
    // not "this palette when dark".
    expect(resolveEditorThemeId('dracula', true)).toBe('dracula')
    expect(resolveEditorThemeId('dracula', false)).toBe('dracula')
    expect(resolveEditorThemeId('github-light', true)).toBe('github-light')
    expect(resolveEditorThemeId('github-dark', false)).toBe('github-dark')
    expect(resolveEditorThemeId('tokyo-night', false)).toBe('tokyo-night')
  })

  it('degrades an unknown value to the default theme', () => {
    expect(resolveEditorThemeId('This Theme Does Not Exist', true)).toBe(DEFAULT_EDITOR_THEME)
  })

  it("treats a whitespace-only value as '' (scheme-following)", () => {
    expect(resolveEditorThemeId('   ', true)).toBe(DARK_AUTO_EDITOR_THEME)
  })
})

describe('EDITOR_THEME_PRESETS', () => {
  it('starts with the auto (scheme-following) preset', () => {
    expect(EDITOR_THEME_PRESETS[0]).toBe('auto')
  })

  it('contains the default theme', () => {
    expect(EDITOR_THEME_PRESETS).toContain(DEFAULT_EDITOR_THEME)
  })

  it('has no duplicate ids', () => {
    expect(new Set(EDITOR_THEME_PRESETS).size).toBe(EDITOR_THEME_PRESETS.length)
  })

  it('every concrete preset resolves to a fully-populated spec', () => {
    for (const id of EDITOR_THEME_PRESETS) {
      if (id === 'auto') continue
      const spec = editorThemeSpec(id)
      expect(spec.id).toBe(id)
      expect(spec.base.background).toBeTruthy()
      expect(spec.base.foreground).toBeTruthy()
      expect(spec.base.selection).toBeTruthy()
      expect(typeof spec.dark).toBe('boolean')
      // A usable palette needs at least the keyword + string groups.
      expect(spec.tokens.keyword ?? spec.tokens.function).toBeTruthy()
      expect(spec.tokens.string).toBeTruthy()
    }
  })
})

describe('editorThemeSpec', () => {
  it('dracula keeps the original published palette (the pre-existing look)', () => {
    const spec = editorThemeSpec('dracula')
    expect(spec.dark).toBe(true)
    expect(spec.base.background).toBe('#282a36')
    expect(spec.base.foreground).toBe('#f8f8f2')
    expect(spec.base.caret).toBe('#f8f8f2')
    expect(spec.base.selection).toBe('#44475a')
    expect(spec.tokens.keyword).toBe('#ff79c6')
    expect(spec.tokens.function).toBe('#50fa7b')
    expect(spec.tokens.string).toBe('#f1fa8c')
    expect(spec.tokens.comment).toBe('#6272a4')
    expect(spec.tokens.link).toBe('#8be9fd')
  })

  it('a light theme is flagged light (the EditorView.theme dark flag)', () => {
    expect(editorThemeSpec('github-light').dark).toBe(false)
    expect(editorThemeSpec('solarized-light').dark).toBe(false)
    expect(editorThemeSpec('github-dark').dark).toBe(true)
  })

  it('an unknown id degrades to the default (dracula) spec', () => {
    expect(editorThemeSpec('nope')).toEqual(editorThemeSpec(DEFAULT_EDITOR_THEME))
  })
})
