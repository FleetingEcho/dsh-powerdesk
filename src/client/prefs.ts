/**
 * restty terminal preferences: the user-tunable settings (font family/size,
 * PTY backend, builtin theme name). In dsh-better-sidebar-integrated mode the
 * values live in better-sidebar's `pluginSettings[<tab id>]` (edited through
 * the Side card settings popup's pluginToggles rows); in standalone mode
 * they live in localStorage under {@link PREFS_STORAGE_KEY}. This module
 * holds the pure read/merge/clamp functions; the parents (the tab wrapper in
 * index.tsx and the standalone panel) own the subscription and pass the
 * resolved prefs to {@link ./ResttyTerminal.tsx} as props.
 */
import type { SidebarStore, SidebarPrefs } from 'dsh-better-sidebar/client/service'

/** The tab id this plugin registers with dsh-better-sidebar. */
export const POWERDESK_TAB_ID = 'dsh-powerdesk:terminal'

/** Which PTY backend the terminal connects to. */
export type PtyBackend = 'own' | 'better-sidebar'

/** The plugin's persisted preferences. */
export interface ResttyPrefs {
  /** Custom font family ('' → theme code font → built-in fallback). */
  fontFamily: string
  /** Font size in px (clamped to {@link TERMINAL_FONT_SIZE_MIN}..MAX). */
  fontSize: number
  /** PTY backend: 'own' (the Rust /powerdesk/ws/terminal) or 'better-sidebar'
   *  (reuse dsh-better-sidebar's /sidebar/ws/terminal via the adapter). */
  ptyBackend: PtyBackend
  /** Builtin restty theme name ('' → pick by scheme: dark/light). */
  themeName: string
}

/** Font size bounds (mirror dsh-better-sidebar's terminal font range). */
export const TERMINAL_FONT_SIZE_MIN = 8
export const TERMINAL_FONT_SIZE_MAX = 32
export const TERMINAL_FONT_SIZE_DEFAULT = 15

/** The built-in fallback stack when neither the user nor the theme sets one. */
export const DEFAULT_RESTTY_FONT_FAMILY = '"SF Mono", Menlo, Consolas, "Liberation Mono", monospace'

/** localStorage key for standalone-mode prefs. */
export const PREFS_STORAGE_KEY = 'dsh-powerdesk:prefs'

/** The default preferences. */
export const DEFAULT_PREFS: ResttyPrefs = {
  fontFamily: '',
  fontSize: TERMINAL_FONT_SIZE_DEFAULT,
  ptyBackend: 'own',
  themeName: '',
}

/** Clamp a font size into the supported range. */
export function clampResttyFontSize(size: number): number {
  if (!Number.isFinite(size)) return TERMINAL_FONT_SIZE_DEFAULT
  return Math.min(TERMINAL_FONT_SIZE_MAX, Math.max(TERMINAL_FONT_SIZE_MIN, Math.round(size)))
}

/** Merge a partial prefs blob over the defaults, clamping the font size. */
export function mergePrefs(partial: Record<string, unknown> | null | undefined): ResttyPrefs {
  const raw = partial ?? {}
  const fontFamily = typeof raw.fontFamily === 'string' ? raw.fontFamily : DEFAULT_PREFS.fontFamily
  const fontSize = typeof raw.fontSize === 'number' ? raw.fontSize : DEFAULT_PREFS.fontSize
  const ptyBackend: PtyBackend = raw.ptyBackend === 'better-sidebar' ? 'better-sidebar' : 'own'
  const themeName = typeof raw.themeName === 'string' ? raw.themeName : DEFAULT_PREFS.themeName
  return { fontFamily, fontSize: clampResttyFontSize(fontSize), ptyBackend, themeName }
}

/** Read prefs from dsh-better-sidebar's store (integrated mode). */
export function readPrefsFromStore(store: SidebarStore): ResttyPrefs {
  const prefs: SidebarPrefs = store.getPrefs()
  const blob = prefs.pluginSettings?.[POWERDESK_TAB_ID]
  return mergePrefs(typeof blob === 'object' && blob !== null ? blob as Record<string, unknown> : {})
}

/** Read prefs from localStorage (standalone mode). */
export function readPrefsFromLocalStorage(): ResttyPrefs {
  if (typeof localStorage === 'undefined') return { ...DEFAULT_PREFS }
  try {
    const raw = localStorage.getItem(PREFS_STORAGE_KEY)
    return mergePrefs(raw !== null ? JSON.parse(raw) as Record<string, unknown> : {})
  } catch {
    return { ...DEFAULT_PREFS }
  }
}

/** Write a prefs patch to localStorage (standalone mode). */
export function writePrefsToLocalStorage(patch: Partial<ResttyPrefs>): ResttyPrefs {
  const next = { ...readPrefsFromLocalStorage(), ...patch, ...{ fontSize: clampResttyFontSize(patch.fontSize ?? readPrefsFromLocalStorage().fontSize) } }
  if (typeof localStorage !== 'undefined') {
    try {
      localStorage.setItem(PREFS_STORAGE_KEY, JSON.stringify(next))
    } catch {
      // Quota / private mode: prefs stay in-memory for this session.
    }
  }
  return next
}
