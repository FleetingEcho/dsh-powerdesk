/**
 * Terminal theme presets: friendly, stable ids the user picks in the
 * Powerdesk Side card, mapped to restty builtin theme names. Kept pure (no
 * restty, no DOM) so the map + resolver are unit-testable without mounting a
 * terminal.
 *
 * The Side card offers a short curated list (`auto`, `tokyo-night`, `dracula`,
 * `high-contrast`, …) plus a "More…" choice that switches the dropdown to the
 * full restty builtin catalog (fetched via `listBuiltinThemeNames()` in the
 * panel). A raw builtin name chosen from "More…" passes through unchanged —
 * {@link ./ResttyTerminal.tsx}'s `getBuiltinTheme` returns null for an unknown
 * name and falls back to the scheme default, so a bad name degrades safely.
 */
import { DEFAULT_RESTTY_FONT_FAMILY } from './prefs.ts'

/**
 * One curated theme preset. `builtin` is the restty builtin theme name; when
 * omitted the preset follows the app scheme (the `auto` default).
 */
export interface TerminalThemePreset {
  /** The stable id stored in `prefs.themeName` (also the i18n key suffix). */
  id: string
  /** The restty builtin theme name, or undefined to follow the app scheme. */
  builtin: string | undefined
}

/**
 * The curated theme list shown by default in the appearance panel. Order is
 * the display order. `auto` (follow scheme) is first; the user-named presets
 * (`tokyo-night`, `dracula`, `high-contrast`) come early.
 */
export const TERMINAL_THEME_PRESETS: readonly TerminalThemePreset[] = [
  { id: 'auto', builtin: undefined },
  { id: 'tokyo-night', builtin: 'TokyoNight' },
  { id: 'tokyo-night-storm', builtin: 'TokyoNight Storm' },
  { id: 'tokyo-night-moon', builtin: 'TokyoNight Moon' },
  { id: 'dracula', builtin: 'Dracula' },
  { id: 'dracula-plus', builtin: 'Dracula+' },
  { id: 'high-contrast', builtin: 'Xcode Dark hc' },
  { id: 'nord', builtin: 'Nord' },
  { id: 'gruvbox', builtin: 'Gruvbox Dark' },
  { id: 'catppuccin-mocha', builtin: 'Catppuccin Mocha' },
  { id: 'github-dark', builtin: 'GitHub Dark' },
  { id: 'one-dark', builtin: 'One Half Dark' },
  { id: 'solarized-dark', builtin: 'Solarized Dark Patched' },
  { id: 'rose-pine', builtin: 'Rose Pine' },
]

/** The default scheme-following builtin when the app is in dark mode. */
export const DEFAULT_DARK_THEME = 'Aizen Dark'
/** The default scheme-following builtin when the app is in light mode. */
export const DEFAULT_LIGHT_THEME = 'Aizen Light'

/** A quick id → preset lookup for the resolver. */
const PRESET_BY_ID: ReadonlyMap<string, TerminalThemePreset> = new Map(
  TERMINAL_THEME_PRESETS.map(p => [p.id, p]),
)

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
export function resolveResttyThemeName(themePref: string, dark: boolean): string {
  const trimmed = themePref.trim()
  if (trimmed === '' || trimmed === 'auto') return dark ? DEFAULT_DARK_THEME : DEFAULT_LIGHT_THEME
  const preset = PRESET_BY_ID.get(trimmed)
  if (preset !== undefined && preset.builtin !== undefined) return preset.builtin
  return trimmed
}

/** The builtin used when no font family is chosen — re-exported so the panel
 *  and the font module share one source of truth for the fallback family. */
export const FALLBACK_FONT_FAMILY = DEFAULT_RESTTY_FONT_FAMILY

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
export function themePresetLabelKey(id: string): string {
  if (id === '') return 'themeAuto'
  const parts = id.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1))
  return `theme${parts.join('')}`
}
