import { describe, it, expect } from 'vitest'
import { resolveTerminalFont } from '../src/client/terminal-font.ts'
import { DEFAULT_PREFS, TERMINAL_FONT_SIZE_MAX } from '../src/client/prefs.ts'

describe('resolveTerminalFont', () => {
  it('uses the custom family when set', () => {
    expect(resolveTerminalFont({ ...DEFAULT_PREFS, fontFamily: 'JetBrains Mono' }, 'theme-font'))
      .toEqual({ fontFamily: 'JetBrains Mono', fontSize: 15 })
  })

  it('falls back to the theme code font, then the built-in stack', () => {
    expect(resolveTerminalFont(DEFAULT_PREFS, 'CodeFont').fontFamily).toBe('CodeFont')
    expect(resolveTerminalFont(DEFAULT_PREFS, undefined).fontFamily).toMatch(/monospace/)
  })

  it('clamps the font size into the supported range', () => {
    expect(resolveTerminalFont({ ...DEFAULT_PREFS, fontSize: 999 }, undefined).fontSize).toBe(TERMINAL_FONT_SIZE_MAX)
  })
})
