/**
 * restty terminal preferences: the user-tunable terminal-appearance settings
 * (font family, font weight, font size, builtin theme). Powerdesk owns its
 * sidebar, so these live in a single GLOBAL localStorage key
 * ({@link PREFS_STORAGE_KEY}) — one terminal appearance for every
 * conversation, not per-session. This module owns the pure read/merge/clamp
 * functions plus a tiny pub/sub so a settings edit in the Powerdesk Side card
 * re-renders any mounted terminal without a remount.
 *
 * Reactivity: {@link writePrefsToLocalStorage} persists the patch and notifies
 * the {@link subscribeTerminalPrefs} listeners; `useSyncExternalStore`
 * (see {@link ./useTerminalPrefs.ts}) binds a component to the snapshot so it
 * re-reads on change. Font family/weight still only take effect on the next
 * terminal tab open (restty has no live setter), but theme re-applies live
 * where restty exposes one.
 */
import type { SidebarStore, SidebarPrefs } from './service.ts'

/** The tab id this plugin registers (kept for `readPrefsFromStore` callers). */
export const POWERDESK_TAB_ID = 'dsh-powerdesk:terminal'

/** Which PTY backend the terminal connects to. */
export type PtyBackend = 'own' | 'better-sidebar'

/** The plugin's persisted terminal-appearance preferences. */
export interface ResttyPrefs {
  /** Custom font family ('' → theme code font → built-in fallback). */
  fontFamily: string
  /** Font weight (400 regular … 700 bold). See {@link TERMINAL_FONT_WEIGHTS}. */
  fontWeight: number
  /** Font size in px (clamped to {@link TERMINAL_FONT_SIZE_MIN}..MAX). */
  fontSize: number
  /** PTY backend: 'own' (the Rust /powerdesk/ws/terminal) or 'better-sidebar'
   *  (reuse dsh-better-sidebar's /sidebar/ws/terminal via the adapter). */
  ptyBackend: PtyBackend
  /** Terminal theme preset ('' / 'auto' → follow the app scheme). */
  themeName: string
}

/** Font size bounds (px). Min 12 keeps text legible; max 30 caps it. */
export const TERMINAL_FONT_SIZE_MIN = 12
export const TERMINAL_FONT_SIZE_MAX = 30
export const TERMINAL_FONT_SIZE_DEFAULT = 16

/**
 * The font weights offered in the appearance panel, in selection order.
 * restty's `ResttyFontFamilyInput.weight` accepts any number; we surface a
 * small, named set so the dropdown stays readable.
 */
export const TERMINAL_FONT_WEIGHTS = [400, 500, 600, 700] as const

/** The default font weight (regular). */
export const TERMINAL_FONT_WEIGHT_DEFAULT = 400

/**
 * The built-in fallback family when neither the user nor the theme sets one.
 *
 * A SINGLE family name, not a CSS font-stack string: restty (unlike xterm)
 * rasterizes glyphs itself and resolves a `{ family }` font input through the
 * Local Font Access API (`navigator.queryLocalFonts`) by family name. A whole
 * stack (`'"SF Mono", Menlo, monospace'`) becomes one matcher no
 * `queryLocalFonts` result ever contains, so the local lookup always fails.
 * `terminal-font.ts` extracts the first family from any stack the theme/user
 * hands it, and `ResttyTerminal` pairs the family with a guaranteed URL
 * fallback so the terminal still renders when the local font (or the API
 * itself) is unavailable. `JetBrains Mono` is restty's own fallback family and
 * the family of the URL fallback, so local + remote agree.
 */
export const DEFAULT_RESTTY_FONT_FAMILY = 'JetBrains Mono'

/** localStorage key for terminal-appearance prefs (global, not per-session). */
export const PREFS_STORAGE_KEY = 'dsh-powerdesk:prefs'

/** The default preferences. */
export const DEFAULT_PREFS: ResttyPrefs = {
  fontFamily: '',
  fontWeight: TERMINAL_FONT_WEIGHT_DEFAULT,
  fontSize: TERMINAL_FONT_SIZE_DEFAULT,
  ptyBackend: 'own',
  themeName: '',
}

/** Clamp a font size into the supported range. */
export function clampResttyFontSize(size: number): number {
  if (!Number.isFinite(size)) return TERMINAL_FONT_SIZE_DEFAULT
  return Math.min(TERMINAL_FONT_SIZE_MAX, Math.max(TERMINAL_FONT_SIZE_MIN, Math.round(size)))
}

/** Clamp a font weight to the offered set (falls back to the default). */
export function clampResttyFontWeight(weight: number): number {
  if (typeof weight !== 'number' || !Number.isFinite(weight)) return TERMINAL_FONT_WEIGHT_DEFAULT
  // Snap to the nearest offered weight so a stored odd value still maps cleanly.
  let best: number = TERMINAL_FONT_WEIGHTS[0]
  let bestDist = Number.POSITIVE_INFINITY
  for (const w of TERMINAL_FONT_WEIGHTS) {
    const d = Math.abs(w - weight)
    if (d < bestDist) { bestDist = d; best = w }
  }
  return best
}

/** Merge a partial prefs blob over the defaults, clamping size + weight. */
export function mergePrefs(partial: Record<string, unknown> | null | undefined): ResttyPrefs {
  const raw = partial ?? {}
  const fontFamily = typeof raw.fontFamily === 'string' ? raw.fontFamily : DEFAULT_PREFS.fontFamily
  const fontWeight = typeof raw.fontWeight === 'number' ? clampResttyFontWeight(raw.fontWeight) : DEFAULT_PREFS.fontWeight
  const fontSize = typeof raw.fontSize === 'number' ? raw.fontSize : DEFAULT_PREFS.fontSize
  const ptyBackend: PtyBackend = raw.ptyBackend === 'better-sidebar' ? 'better-sidebar' : 'own'
  const themeName = typeof raw.themeName === 'string' ? raw.themeName : DEFAULT_PREFS.themeName
  return { fontFamily, fontWeight, fontSize: clampResttyFontSize(fontSize), ptyBackend, themeName }
}

/**
 * A stored font size below the supported minimum is almost always a stale or
 * corrupt entry — e.g. an earlier input bug that committed an empty number
 * field as `0`, which then clamped to the then-minimum. Reset it to the
 * default rather than silently bumping to the new minimum: the user never
 * chose it. Returns a copy with `fontSize` dropped so {@link mergePrefs}
 * falls back to the default. Only applied on READ (stale storage), never on
 * write — a freshly typed out-of-range value still clamps to the nearest
 * bound via {@link clampResttyFontSize}.
 */
function dropStaleFontSize(raw: Record<string, unknown>): Record<string, unknown> {
  if (typeof raw.fontSize === 'number' && raw.fontSize < TERMINAL_FONT_SIZE_MIN) {
    const { fontSize: _omit, ...rest } = raw
    return rest
  }
  return raw
}

/** Read prefs from dsh-better-sidebar's store (legacy integrated mode). */
export function readPrefsFromStore(store: SidebarStore): ResttyPrefs {
  const prefs: SidebarPrefs = store.getPrefs()
  const blob = prefs.pluginSettings?.[POWERDESK_TAB_ID]
  return mergePrefs(dropStaleFontSize(typeof blob === 'object' && blob !== null ? blob as Record<string, unknown> : {}))
}

/** Read prefs from localStorage (the global terminal-appearance source). */
export function readPrefsFromLocalStorage(): ResttyPrefs {
  if (typeof localStorage === 'undefined') return { ...DEFAULT_PREFS }
  try {
    const raw = localStorage.getItem(PREFS_STORAGE_KEY)
    return mergePrefs(dropStaleFontSize(raw !== null ? JSON.parse(raw) as Record<string, unknown> : {}))
  } catch {
    return { ...DEFAULT_PREFS }
  }
}

// --- Reactive global prefs (useSyncExternalStore) ---------------------------
// A module-level snapshot + listener set so the Powerdesk Side card's edits
// re-render any mounted terminal without a remount. The snapshot is cached so
// `useSyncExternalStore` sees a stable reference between writes (it must not
// return a fresh object every call or React loops).

let cachedSnapshot: ResttyPrefs = readPrefsFromLocalStorage()
const listeners = new Set<() => void>()

function notifyTerminalPrefs(): void {
  cachedSnapshot = readPrefsFromLocalStorage()
  for (const listener of listeners) {
    try { listener() } catch { /* a throwing subscriber must not break the rest */ }
  }
}

/**
 * Subscribe to terminal-appearance prefs changes (for `useSyncExternalStore`).
 * @returns an unsubscribe function.
 */
export function subscribeTerminalPrefs(listener: () => void): () => void {
  listeners.add(listener)
  return () => { listeners.delete(listener) }
}

/**
 * Stable snapshot for `useSyncExternalStore`. Returns the cached prefs object;
 * replaced (not mutated) on each write so React detects the change. Between
 * writes the SAME reference is returned (required by useSyncExternalStore).
 */
export function getTerminalPrefsSnapshot(): ResttyPrefs {
  return cachedSnapshot
}

/** Write a prefs patch to localStorage and notify subscribers. */
export function writePrefsToLocalStorage(patch: Partial<ResttyPrefs>): ResttyPrefs {
  const current = readPrefsFromLocalStorage()
  const next: ResttyPrefs = {
    ...current,
    ...patch,
    fontSize: clampResttyFontSize(patch.fontSize ?? current.fontSize),
    fontWeight: clampResttyFontWeight(patch.fontWeight ?? current.fontWeight),
  }
  if (typeof localStorage !== 'undefined') {
    try {
      localStorage.setItem(PREFS_STORAGE_KEY, JSON.stringify(next))
    } catch {
      // Quota / private mode: prefs stay in-memory for this session (still
      // notify so the UI reflects the change until reload).
    }
  }
  notifyTerminalPrefs()
  return next
}
