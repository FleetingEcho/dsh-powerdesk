/**
 * Terminal font resolution: the user's restty font prefs turned into the
 * restty options. Kept pure (no DOM, no restty) so the clamp chain and the
 * CSS-stack → single-family extraction are unit-testable without mounting a
 * terminal.
 *
 * restty (unlike xterm) rasterizes glyphs itself and resolves a `{ family }`
 * font input through the Local Font Access API (`navigator.queryLocalFonts`),
 * matching installed system fonts by family name. Two consequences shape this
 * module:
 *  - restty needs a SINGLE family name, not a CSS font-stack string
 *    (`'"SF Mono", Menlo, monospace'`). A whole stack becomes one matcher no
 *    `queryLocalFonts` result ever contains, so the local lookup always fails.
 *    {@link pickFirstFontFamily} extracts the first family from any stack the
 *    theme or the user hands us.
 *  - a local-only `{ family }` input has no network fallback, so on a browser
 *    without `queryLocalFonts` (Firefox/Safari) or with the permission/font
 *    unavailable, restty throws "Unable to load any configured font source."
 *    `ResttyTerminal` therefore passes a guaranteed URL fallback alongside the
 *    family (restty's public `ResttyFontFamilyInput.fallback`), pointing at the
 *    same JetBrains Mono Nerd Font restty lists in its own default URL sources.
 */
import { clampResttyFontSize, clampResttyFontWeight, DEFAULT_RESTTY_FONT_FAMILY, type ResttyPrefs } from './prefs.ts'
// Type-only import: erased by tsc/tsdown, so restty's renderer is NOT pulled
// into the core client bundle by this module (terminal-font.ts is only ever
// imported by the lazy terminal chunk anyway). Using restty's own font-input
// type keeps our `fonts` array assignable to restty's `terminal.fonts` option
// without a structural cast.
import type { ResttyFontInput } from 'restty'

/**
 * Guaranteed font source fetched when the local family is unavailable. This is
 * the same asset restty lists in its own `DEFAULT_FONT_INPUTS` URL sources, so
 * the terminal gets a working font even on browsers without the Local Font
 * Access API or without the chosen family installed locally.
 */
export const RESTTY_FONT_FALLBACK_URL =
  'https://cdn.jsdelivr.net/gh/ryanoasis/nerd-fonts@v3.4.0/patched-fonts/JetBrainsMono/NoLigatures/Regular/JetBrainsMonoNLNerdFontMono-Regular.ttf'

/**
 * The emoji / symbol / CJK fallback font chain that restty lists in its own
 * `DEFAULT_FONT_INPUTS` (restty 0.2.6). **`ResttyTerminal` passes a `fonts`
 * array, which REPLACES restty's defaults entirely** — so without these
 * entries, emoji (🍣), Nerd Font symbols, and CJK glyphs stop rendering, even
 * though the user's primary family has no glyphs for them. We mirror restty's
 * own default URLs (same jsdelivr assets) so the fallback chain stays in sync
 * with restty's curated list.
 *
 * Order matters: the primary family is first (added by {@link resolveTerminalFontInputs}),
 * then Nerd symbols, generic symbols, emoji, and CJK — matching restty's own
 * default order so the primary font's glyphs win and the rest fill the holes.
 */
export const RESTTY_FALLBACK_FONT_URLS = {
  nerdSymbols: 'https://cdn.jsdelivr.net/gh/ryanoasis/nerd-fonts@v3.4.0/patched-fonts/NerdFontsSymbolsOnly/SymbolsNerdFont-Regular.ttf',
  notoSymbols: 'https://cdn.jsdelivr.net/gh/notofonts/noto-fonts@main/unhinted/ttf/NotoSansSymbols2/NotoSansSymbols2-Regular.ttf',
  symbola: 'https://cdn.jsdelivr.net/gh/ChiefMikeK/ttf-symbola@master/Symbola.ttf',
  notoColorEmoji: 'https://cdn.jsdelivr.net/gh/googlefonts/noto-emoji@main/fonts/NotoColorEmoji.ttf',
  openMoji: 'https://cdn.jsdelivr.net/gh/hfg-gmuend/openmoji@master/font/OpenMoji-black-glyf/OpenMoji-black-glyf.ttf',
  notoCjkSc: 'https://cdn.jsdelivr.net/gh/notofonts/noto-cjk@main/Sans/OTF/SimplifiedChinese/NotoSansCJKsc-Regular.otf',
} as const

/**
 * Build the full `terminal.fonts` array for restty: the user's primary family
 * (with its guaranteed JetBrains Mono URL fallback) FIRST, then restty's
 * emoji/symbol/CJK fallback chain so emoji (🍣), Nerd Font symbols, and CJK
 * glyphs render even when the primary family has no glyphs for them. restty
 * replaces its `DEFAULT_FONT_INPUTS` with whatever we pass here, so this list
 * must include the fallback chain — otherwise only the primary family's
 * glyphs are available.
 *
 * The entries mirror restty 0.2.6's own `DEFAULT_FONT_INPUTS` exactly: a
 * `family` input (resolved locally via `navigator.queryLocalFonts`) and its
 * `url` twin are SEPARATE entries (restty's font input is a discriminated
 * union — `family`+`fallback` OR `url`, not both on one object).
 *
 * @param fontFamily - the resolved primary family name (may be '' for default).
 * @param fontWeight - the resolved font weight (400–700).
 */
export function resolveTerminalFontInputs(
  fontFamily: string,
  fontWeight: number,
): ResttyFontInput[] {
  return [
    // Primary family: resolve locally first, fall back to the JetBrains Mono
    // URL (the same asset restty uses) when the family/API is unavailable.
    { family: fontFamily, weight: fontWeight, fallback: RESTTY_FONT_FALLBACK_URL },
    // Emoji / symbol / CJK fallback chain (mirrors restty 0.2.6's defaults).
    { url: RESTTY_FALLBACK_FONT_URLS.nerdSymbols, name: 'Symbols Nerd Font' },
    { family: 'Apple Symbols', name: 'Apple Symbols' },
    { url: RESTTY_FALLBACK_FONT_URLS.notoSymbols, name: 'Noto Sans Symbols 2' },
    { url: RESTTY_FALLBACK_FONT_URLS.symbola, name: 'Symbola' },
    { family: 'Apple Color Emoji', name: 'Apple Color Emoji' },
    { url: RESTTY_FALLBACK_FONT_URLS.notoColorEmoji, name: 'Noto Color Emoji' },
    { url: RESTTY_FALLBACK_FONT_URLS.openMoji, name: 'OpenMoji' },
    { url: RESTTY_FALLBACK_FONT_URLS.notoCjkSc, name: 'Noto Sans CJK SC' },
  ]
}

/**
 * Extract the first family name from a CSS `font-family` stack.
 *
 * restty's `{ family }` input is matched against `navigator.queryLocalFonts()`
 * by family name; a whole stack (`'"SF Mono", Menlo, monospace'`) never
 * matches, so we hand restty only the first (preferred) family and rely on the
 * URL fallback for everything else. Surrounding quotes around a named family
 * are stripped; a generic family (`monospace`, `serif`) is passed through
 * as-is.
 *
 * @param input - a CSS `font-family` value (single name or comma-separated stack).
 * @returns the first family name, unquoted; or the trimmed input as a fallback.
 */
export function pickFirstFontFamily(input: string): string {
  const trimmed = input.trim()
  if (trimmed === '') return trimmed
  // CSS stacks never nest commas inside a single family name once quotes are
  // balanced, so the first comma is always a family separator.
  const first = trimmed.split(',', 1)[0]?.trim() ?? trimmed
  if (first.length >= 2) {
    const head = first[0] ?? ''
    const tail = first[first.length - 1] ?? ''
    if (head === tail && (head === '"' || head === "'")) return first.slice(1, -1)
  }
  return first
}

/**
 * Resolve the restty font options for the given prefs.
 * @param prefs - the current restty preferences.
 * @param themeFontFamily - the app's theme code font (`--ds-font-family-code`
 *   token value, read live by the caller); undefined when the token is absent.
 *   May be a CSS font-stack string; only the first family is kept (see
 *   {@link pickFirstFontFamily}).
 */
export function resolveTerminalFont(
  prefs: ResttyPrefs,
  themeFontFamily: string | undefined,
): { fontFamily: string; fontWeight: number; fontSize: number } {
  const custom = prefs.fontFamily.trim()
  const stack = custom !== '' ? custom : (themeFontFamily || DEFAULT_RESTTY_FONT_FAMILY)
  return {
    fontFamily: pickFirstFontFamily(stack),
    fontWeight: clampResttyFontWeight(prefs.fontWeight),
    fontSize: clampResttyFontSize(prefs.fontSize),
  }
}
