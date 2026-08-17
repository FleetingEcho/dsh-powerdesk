/**
 * One curated theme preset. `builtin` is the restty builtin theme name; when
 * omitted the preset follows the app scheme (the `auto` default).
 */
export interface TerminalThemePreset {
    /** The stable id stored in `prefs.themeName` (also the i18n key suffix). */
    id: string;
    /** The restty builtin theme name, or undefined to follow the app scheme. */
    builtin: string | undefined;
}
/**
 * The curated theme list shown by default in the appearance panel. Order is
 * the display order. `auto` (follow scheme) is first; the user-named presets
 * (`tokyo-night`, `dracula`, `high-contrast`) come early.
 */
export declare const TERMINAL_THEME_PRESETS: readonly TerminalThemePreset[];
/** The default scheme-following builtin when the app is in dark mode. */
export declare const DEFAULT_DARK_THEME = "Aizen Dark";
/** The default scheme-following builtin when the app is in light mode. */
export declare const DEFAULT_LIGHT_THEME = "Aizen Light";
/**
 * Resolve a stored `prefs.themeName` value to a restty builtin theme name.
 *
 * - `''` or `'auto'` → the scheme default (dark/light).
 * - a known curated preset id → that preset's restty builtin name.
 * - any other non-empty string → returned as-is (the "More…" path: a raw
 *   restty builtin name chosen from the full catalog). `ResttyTerminal`'s
 *   `getBuiltinTheme(name)` returns null for an unknown name and falls back
 *   to the scheme default, so a stale/renamed builtin degrades safely.
 *
 * @param themePref - the raw `prefs.themeName` value.
 * @param dark - whether the app is currently in a dark color scheme.
 * @returns the restty builtin theme name to load.
 */
export declare function resolveResttyThemeName(themePref: string, dark: boolean): string;
/** The builtin used when no font family is chosen — re-exported so the panel
 *  and the font module share one source of truth for the fallback family. */
export declare const FALLBACK_FONT_FAMILY = "JetBrains Mono";
/**
 * The locale key for a curated theme preset's display label.
 *
 * Converts a preset id (`auto`, `tokyo-night`, `tokyo-night-storm`,
 * `dracula-plus`, `high-contrast`, …) to the matching `theme*` locale key
 * (`themeAuto`, `themeTokyoNight`, `themeTokyoNightStorm`, `themeDraculaPlus`,
 * `themeHighContrast`, …) by title-casing each hyphen-separated part. The
 * matching keys are defined in {@link ./locales.ts}; an unknown id falls back
 * to the raw id so the dropdown still shows something.
 */
export declare function themePresetLabelKey(id: string): string;
