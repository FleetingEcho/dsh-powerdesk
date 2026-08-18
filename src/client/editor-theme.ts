/**
 * Code editor (CodeMirror) theme presets: friendly, stable ids the user picks
 * in the Powerdesk Side card, mapped to hand-rolled CodeMirror 6 palettes.
 * Kept pure (no CodeMirror imports, no DOM) so the palettes + resolver are
 * unit-testable without loading the editor chunk — the actual
 * `EditorView.theme` + `HighlightStyle` construction happens in
 * {@link ./CodeEditor.tsx} from the {@link EditorThemeSpec} data here.
 *
 * Hand-rolled rather than pulling in `@uiw/codemirror-theme-*`: those
 * packages' CJS builds require `@babel/runtime` helpers that don't resolve in
 * this browser bundle (no Node module resolution at runtime), and their ESM
 * builds weren't picked up by the bundler's export-conditions resolution
 * either (see the note that started this with Dracula in CodeEditor.tsx).
 *
 * The palettes are the standard published color sets (draculatheme.com,
 * GitHub's github-dark / github-light, Atom's One Dark, tokyonight.dev,
 * nordtheme.net, Ethan Schoonover's Solarized, catppuccin).
 */

/** The default editor theme — the look from before themes were selectable. */
export const DEFAULT_EDITOR_THEME = 'dracula'

/** What `auto` resolves to while the app is in the dark scheme. */
export const DARK_AUTO_EDITOR_THEME = 'github-dark'
/** What `auto` resolves to while the app is in the light scheme. */
export const LIGHT_AUTO_EDITOR_THEME = 'github-light'

/** The base surface colors of one editor theme. */
export interface EditorThemeBase {
  background: string
  foreground: string
  caret: string
  selection: string
  /** Semi-transparent — the active-line band must not paint opaque. */
  activeLine: string
  gutterBackground: string
  gutterForeground: string
  /** Semi-transparent. */
  activeLineGutter: string
}

/** Syntax token colors. Omitted groups render in the theme foreground. */
export interface EditorThemeTokens {
  keyword?: string
  function?: string
  /** Constants, standard names, colors. */
  constant?: string
  /** Type/class/number/namespace family. */
  type?: string
  operator?: string
  comment?: string
  string?: string
  heading?: string
  /** Atoms, booleans. */
  atom?: string
  link?: string
  invalid?: string
}

/** One fully-resolved editor theme (base surface + token palette). */
export interface EditorThemeSpec {
  /** The stable id (also the i18n key suffix). */
  id: string
  /** Whether the theme is dark (the `EditorView.theme` `dark` flag). */
  dark: boolean
  base: EditorThemeBase
  tokens: EditorThemeTokens
}

/**
 * The curated theme list shown in the appearance panel (display order).
 * `auto` (follow the app scheme) is first, mirroring the terminal preset
 * list; every other id is a concrete palette.
 */
export const EDITOR_THEME_PRESETS: readonly string[] = [
  'auto',
  'dracula',
  'github-dark',
  'github-light',
  'one-dark',
  'tokyo-night',
  'nord',
  'solarized-dark',
  'solarized-light',
  'catppuccin-mocha',
]

/** The concrete (non-auto) theme palettes, by id. */
const SPECS: Record<string, EditorThemeSpec> = {
  dracula: {
    id: 'dracula',
    dark: true,
    base: {
      background: '#282a36',
      foreground: '#f8f8f2',
      caret: '#f8f8f2',
      selection: '#44475a',
      activeLine: '#44475a55',
      gutterBackground: '#282a36',
      gutterForeground: '#6272a4',
      activeLineGutter: '#44475a55',
    },
    tokens: {
      keyword: '#ff79c6',
      function: '#50fa7b',
      constant: '#bd93f9',
      type: '#bd93f9',
      operator: '#ff79c6',
      comment: '#6272a4',
      string: '#f1fa8c',
      heading: '#bd93f9',
      atom: '#bd93f9',
      link: '#8be9fd',
      invalid: '#ff5555',
    },
  },
  'github-dark': {
    id: 'github-dark',
    dark: true,
    base: {
      background: '#0d1117',
      foreground: '#c9d1d9',
      caret: '#c9d1d9',
      selection: 'rgba(56, 139, 253, 0.4)',
      activeLine: 'rgba(110, 118, 129, 0.34)',
      gutterBackground: '#0d1117',
      gutterForeground: '#8b949e',
      activeLineGutter: 'rgba(110, 118, 129, 0.34)',
    },
    tokens: {
      keyword: '#ff7b72',
      function: '#d2a8ff',
      constant: '#79c0ff',
      type: '#ffa657',
      operator: '#c9d1d9',
      comment: '#8b949e',
      string: '#a5d6ff',
      heading: '#1f6feb',
      atom: '#79c0ff',
      link: '#58a6ff',
      invalid: '#f85149',
    },
  },
  'github-light': {
    id: 'github-light',
    dark: false,
    base: {
      background: '#ffffff',
      foreground: '#24292f',
      caret: '#24292f',
      selection: 'rgba(199, 224, 255, 0.9)',
      activeLine: 'rgba(208, 215, 222, 0.4)',
      gutterBackground: '#ffffff',
      gutterForeground: '#57606a',
      activeLineGutter: 'rgba(208, 215, 222, 0.4)',
    },
    tokens: {
      keyword: '#cf222e',
      function: '#8250df',
      constant: '#0550ae',
      type: '#953800',
      operator: '#24292f',
      comment: '#57606a',
      string: '#0a3069',
      heading: '#0969da',
      atom: '#0550ae',
      link: '#0969da',
      invalid: '#cf222e',
    },
  },
  'one-dark': {
    id: 'one-dark',
    dark: true,
    base: {
      background: '#282c34',
      foreground: '#abb2bf',
      caret: '#528bff',
      selection: 'rgba(183, 186, 189, 0.25)',
      activeLine: 'rgba(90, 93, 93, 0.33)',
      gutterBackground: '#282c34',
      gutterForeground: '#5c6370',
      activeLineGutter: 'rgba(90, 93, 93, 0.33)',
    },
    tokens: {
      keyword: '#c678dd',
      function: '#61afef',
      constant: '#d19a66',
      type: '#e5c07b',
      operator: '#56b6c2',
      comment: '#5c6370',
      string: '#98c379',
      heading: '#61afef',
      atom: '#d19a66',
      link: '#56b6c2',
      invalid: '#e06c75',
    },
  },
  'tokyo-night': {
    id: 'tokyo-night',
    dark: true,
    base: {
      background: '#1a1b26',
      foreground: '#c0caf5',
      caret: '#c0caf5',
      selection: 'rgba(97, 108, 150, 0.4)',
      activeLine: 'rgba(192, 202, 245, 0.08)',
      gutterBackground: '#1a1b26',
      gutterForeground: '#565f89',
      activeLineGutter: 'rgba(192, 202, 245, 0.08)',
    },
    tokens: {
      keyword: '#bb9af7',
      function: '#7aa2f7',
      constant: '#ff9e64',
      type: '#7dcfff',
      operator: '#89ddff',
      comment: '#565f89',
      string: '#9ece6a',
      heading: '#7aa2f7',
      atom: '#ff9e64',
      link: '#7dcfff',
      invalid: '#f7768e',
    },
  },
  nord: {
    id: 'nord',
    dark: true,
    base: {
      background: '#2e3440',
      foreground: '#d8dee9',
      caret: '#d8dee9',
      selection: '#434c5e',
      activeLine: 'rgba(59, 66, 82, 0.5)',
      gutterBackground: '#2e3440',
      gutterForeground: '#4c566a',
      activeLineGutter: 'rgba(59, 66, 82, 0.5)',
    },
    tokens: {
      keyword: '#81a1c1',
      function: '#88c0d0',
      constant: '#d08770',
      type: '#8ec07c',
      operator: '#81a1c1',
      comment: '#616e87',
      string: '#a3be8c',
      heading: '#88c0d0',
      atom: '#d08770',
      link: '#8fbcbb',
      invalid: '#bf616a',
    },
  },
  'solarized-dark': {
    id: 'solarized-dark',
    dark: true,
    base: {
      background: '#002b36',
      foreground: '#839496',
      caret: '#d30107',
      selection: '#073642',
      activeLine: 'rgba(238, 232, 213, 0.08)',
      gutterBackground: '#002b36',
      gutterForeground: '#586e75',
      activeLineGutter: 'rgba(238, 232, 213, 0.08)',
    },
    tokens: {
      keyword: '#708090',
      function: '#268bd2',
      constant: '#d33682',
      type: '#b58900',
      operator: '#93a1a1',
      comment: '#586e75',
      string: '#2aa198',
      heading: '#268bd2',
      atom: '#d33682',
      link: '#268bd2',
      invalid: '#dc322f',
    },
  },
  'solarized-light': {
    id: 'solarized-light',
    dark: false,
    base: {
      background: '#eee8d5',
      foreground: '#586e75',
      caret: '#d30107',
      selection: 'rgba(7, 54, 67, 0.2)',
      activeLine: 'rgba(101, 123, 131, 0.15)',
      gutterBackground: '#fdf6e3',
      gutterForeground: '#93a1a1',
      activeLineGutter: 'rgba(101, 123, 131, 0.15)',
    },
    tokens: {
      keyword: '#708090',
      function: '#268bd2',
      constant: '#d33682',
      type: '#b58900',
      operator: '#586e75',
      comment: '#93a1a1',
      string: '#2aa198',
      heading: '#268bd2',
      atom: '#d33682',
      link: '#268bd2',
      invalid: '#dc322f',
    },
  },
  'catppuccin-mocha': {
    id: 'catppuccin-mocha',
    dark: true,
    base: {
      background: '#1e1e2e',
      foreground: '#cdd6f4',
      caret: '#f5e0dc',
      selection: '#585b70',
      activeLine: 'rgba(238, 242, 255, 0.06)',
      gutterBackground: '#1e1e2e',
      gutterForeground: '#6c7086',
      activeLineGutter: 'rgba(238, 242, 255, 0.06)',
    },
    tokens: {
      keyword: '#cba6f7',
      function: '#89b4fa',
      constant: '#fab387',
      type: '#f9e2af',
      operator: '#89dceb',
      comment: '#6c7086',
      string: '#a6e3a1',
      heading: '#89b4fa',
      atom: '#fab387',
      link: '#89dceb',
      invalid: '#f38ba8',
    },
  },
}

/** The curated preset ids as a set (for "is the stored value a preset?"). */
const PRESET_IDS: ReadonlySet<string> = new Set(EDITOR_THEME_PRESETS)

/**
 * Resolve a stored `prefs.editorTheme` value to a CONCRETE theme id.
 *
 * - `''` or `'auto'` → the scheme default (GitHub Dark / GitHub Light).
 * - a known preset id → itself (a curated theme never follows the scheme —
 *   a dark palette stays dark in light mode).
 * - any other non-empty string → {@link DEFAULT_EDITOR_THEME} (a stale or
 *   hand-edited value degrades to the default palette instead of an
 *   undefined one).
 *
 * @param themePref - the raw `prefs.editorTheme` value.
 * @param dark - whether the app is currently in a dark color scheme.
 * @returns the concrete theme id to render.
 */
export function resolveEditorThemeId(themePref: string, dark: boolean): string {
  const trimmed = themePref.trim()
  if (trimmed === '' || trimmed === 'auto') return dark ? DARK_AUTO_EDITOR_THEME : LIGHT_AUTO_EDITOR_THEME
  if (PRESET_IDS.has(trimmed)) return trimmed
  return DEFAULT_EDITOR_THEME
}

/** The default (dracula) palette — also the safe-degradation target. */
const DEFAULT_SPEC = SPECS[DEFAULT_EDITOR_THEME]!

/**
 * The fully-resolved spec for a concrete theme id. An unknown id degrades to
 * the default (dracula) palette so a stale value never yields an empty
 * theme (mirrors the terminal resolver's safe-degrade contract).
 *
 * @param id - a concrete theme id (the output of {@link resolveEditorThemeId}).
 * @returns the theme spec to build the CodeMirror extensions from.
 */
export function editorThemeSpec(id: string): EditorThemeSpec {
  return SPECS[id] ?? DEFAULT_SPEC
}
