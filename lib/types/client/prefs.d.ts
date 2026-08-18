/**
 * Powerdesk appearance preferences: the user-tunable terminal-appearance
 * settings (font family, font weight, font size, builtin theme) plus the
 * code editor's (CodeMirror) theme preset. Powerdesk owns its
 * sidebar, so these live in a single GLOBAL localStorage key
 * ({@link PREFS_STORAGE_KEY}) — one terminal appearance for every
 * conversation, not per-session. This module owns the pure read/merge/clamp
 * functions plus a tiny pub/sub so a settings edit in the Powerdesk Side card
 * re-renders any mounted terminal without a remount.
 *
 * Reactivity: {@link writePrefsToLocalStorage} persists the patch and notifies
 * the {@link subscribeTerminalPrefs} listeners; `useSyncExternalStore`
 * (see {@link ./useTerminalPrefs.ts}) binds a component to the snapshot so it
 * re-reads on change. restty has no live setter for font family/weight/size,
 * so `ResttyTerminal` remounts (destroy + recreate, reconnecting to the SAME
 * pty session) to pick up a change — an already-OPEN terminal updates, no
 * need to open a new tab. Theme re-applies live where restty exposes a
 * setter, no remount needed.
 *
 * Cross-chunk notification: `terminal`/`browser`/`editor`/`settings` are
 * separate lazy-loaded bundles (tsdown `codeSplitting: false`), so each one
 * that imports this file gets its OWN COPY of the module — including the
 * `listeners` Set below. A write performed in one chunk's copy (e.g. the
 * Settings card, which now lives in the `settings` chunk) would never reach
 * a `useTerminalPrefs()` subscriber living in a DIFFERENT chunk's copy if
 * notification only walked that local Set — the terminal would silently
 * stop picking up live prefs changes. `window` is the one thing every chunk
 * genuinely shares (same document), so {@link writePrefsToLocalStorage}
 * broadcasts a `window` CustomEvent instead of calling the local notifier
 * directly; every module instance (including the writer's own) listens for
 * that event and re-syncs from localStorage — one code path, chunk-count
 * agnostic.
 */
import type { SidebarStore } from './service.ts';
/** The tab id this plugin registers (kept for `readPrefsFromStore` callers). */
export declare const POWERDESK_TAB_ID = "dsh-powerdesk:terminal";
/** Which PTY backend the terminal connects to. */
export type PtyBackend = 'own' | 'better-sidebar';
/** The plugin's persisted appearance preferences (terminal + code editor). */
export interface ResttyPrefs {
    /** Custom font family ('' → theme code font → built-in fallback). */
    fontFamily: string;
    /** Font weight (400 regular … 700 bold). See {@link TERMINAL_FONT_WEIGHTS}. */
    fontWeight: number;
    /** Font size in px (clamped to {@link TERMINAL_FONT_SIZE_MIN}..MAX). */
    fontSize: number;
    /** PTY backend: 'own' (the Rust /powerdesk/ws/terminal) or 'better-sidebar'
     *  (reuse dsh-better-sidebar's /sidebar/ws/terminal via the adapter). */
    ptyBackend: PtyBackend;
    /** Terminal theme preset ('' / 'auto' → follow the app scheme). */
    themeName: string;
    /** Code editor (CodeMirror) theme preset id ('' / 'auto' → follow the app
     *  scheme; default {@link DEFAULT_EDITOR_THEME} keeps the original look). */
    editorTheme: string;
}
/** Font size bounds (px). Min 12 keeps text legible; max 30 caps it. */
export declare const TERMINAL_FONT_SIZE_MIN = 12;
export declare const TERMINAL_FONT_SIZE_MAX = 30;
export declare const TERMINAL_FONT_SIZE_DEFAULT = 16;
/**
 * The font weights offered in the appearance panel, in selection order.
 * restty's `ResttyFontFamilyInput.weight` accepts any number; we surface a
 * small, named set so the dropdown stays readable.
 */
export declare const TERMINAL_FONT_WEIGHTS: readonly [400, 500, 600, 700];
/** The default font weight (regular). */
export declare const TERMINAL_FONT_WEIGHT_DEFAULT = 400;
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
export declare const DEFAULT_RESTTY_FONT_FAMILY = "JetBrains Mono";
/** localStorage key for terminal-appearance prefs (global, not per-session). */
export declare const PREFS_STORAGE_KEY = "dsh-powerdesk:prefs";
/** The default preferences. */
export declare const DEFAULT_PREFS: ResttyPrefs;
/** Clamp a font size into the supported range. */
export declare function clampResttyFontSize(size: number): number;
/** Clamp a font weight to the offered set (falls back to the default). */
export declare function clampResttyFontWeight(weight: number): number;
/** Merge a partial prefs blob over the defaults, clamping size + weight. */
export declare function mergePrefs(partial: Record<string, unknown> | null | undefined): ResttyPrefs;
/** Read prefs from dsh-better-sidebar's store (legacy integrated mode). */
export declare function readPrefsFromStore(store: SidebarStore): ResttyPrefs;
/** Read prefs from localStorage (the global terminal-appearance source). */
export declare function readPrefsFromLocalStorage(): ResttyPrefs;
/**
 * Subscribe to terminal-appearance prefs changes (for `useSyncExternalStore`).
 * @returns an unsubscribe function.
 */
export declare function subscribeTerminalPrefs(listener: () => void): () => void;
/**
 * Stable snapshot for `useSyncExternalStore`. Returns the cached prefs object;
 * replaced (not mutated) on each write so React detects the change. Between
 * writes the SAME reference is returned (required by useSyncExternalStore).
 */
export declare function getTerminalPrefsSnapshot(): ResttyPrefs;
/** Write a prefs patch to localStorage and notify subscribers. */
export declare function writePrefsToLocalStorage(patch: Partial<ResttyPrefs>): ResttyPrefs;
