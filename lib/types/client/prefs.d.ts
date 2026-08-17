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
import type { SidebarStore } from './service.ts';
/** The tab id this plugin registers with dsh-better-sidebar. */
export declare const POWERDESK_TAB_ID = "dsh-powerdesk:terminal";
/** Which PTY backend the terminal connects to. */
export type PtyBackend = 'own' | 'better-sidebar';
/** The plugin's persisted preferences. */
export interface ResttyPrefs {
    /** Custom font family ('' → theme code font → built-in fallback). */
    fontFamily: string;
    /** Font size in px (clamped to {@link TERMINAL_FONT_SIZE_MIN}..MAX). */
    fontSize: number;
    /** PTY backend: 'own' (the Rust /powerdesk/ws/terminal) or 'better-sidebar'
     *  (reuse dsh-better-sidebar's /sidebar/ws/terminal via the adapter). */
    ptyBackend: PtyBackend;
    /** Builtin restty theme name ('' → pick by scheme: dark/light). */
    themeName: string;
}
/** Font size bounds (mirror dsh-better-sidebar's terminal font range). */
export declare const TERMINAL_FONT_SIZE_MIN = 8;
export declare const TERMINAL_FONT_SIZE_MAX = 32;
export declare const TERMINAL_FONT_SIZE_DEFAULT = 15;
/** The built-in fallback stack when neither the user nor the theme sets one. */
export declare const DEFAULT_RESTTY_FONT_FAMILY = "\"SF Mono\", Menlo, Consolas, \"Liberation Mono\", monospace";
/** localStorage key for standalone-mode prefs. */
export declare const PREFS_STORAGE_KEY = "dsh-powerdesk:prefs";
/** The default preferences. */
export declare const DEFAULT_PREFS: ResttyPrefs;
/** Clamp a font size into the supported range. */
export declare function clampResttyFontSize(size: number): number;
/** Merge a partial prefs blob over the defaults, clamping the font size. */
export declare function mergePrefs(partial: Record<string, unknown> | null | undefined): ResttyPrefs;
/** Read prefs from dsh-better-sidebar's store (integrated mode). */
export declare function readPrefsFromStore(store: SidebarStore): ResttyPrefs;
/** Read prefs from localStorage (standalone mode). */
export declare function readPrefsFromLocalStorage(): ResttyPrefs;
/** Write a prefs patch to localStorage (standalone mode). */
export declare function writePrefsToLocalStorage(patch: Partial<ResttyPrefs>): ResttyPrefs;
