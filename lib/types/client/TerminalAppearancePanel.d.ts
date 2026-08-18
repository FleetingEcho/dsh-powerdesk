/**
 * The Appearance block of the Powerdesk Side card: terminal font family
 * (system font picker), font weight, font size, the terminal theme, and the
 * code editor's (CodeMirror) theme. Lives ONLY here — never on the terminal
 * or editor page — so those tabs stay focused on output and all appearance
 * controls share one home.
 *
 * All interactive controls are built on Radix UI Select primitives so they
 * match the shell's accessible component vocabulary and read consistently
 * (family / weight / theme are the same dropdown shape). Two native controls
 * remain: the manual font-name text entry and the font-size number input
 * (Radix ships no text-input or number primitive); both are styled to match
 * input primitive); it's a styled fallback for browsers without the Local
 * Font Access API and is kept visually consistent with the Radix controls.
 *
 * Source of truth: the global `dsh-powerdesk:prefs` localStorage key (one
 * terminal appearance for every conversation). Reads reactively through
 * {@link ./useTerminalPrefs.ts} (`useSyncExternalStore`); writes through
 * {@link ./prefs.ts}'s `writePrefsToLocalStorage`, which notifies subscribers
 * so any mounted terminal re-renders (font family/weight/size recreate the
 * restty instance; theme re-applies live).
 *
 * Font picker: `navigator.queryLocalFonts()` (the Local Font Access API,
 * Chromium-only + a permission prompt) enumerates the user's installed
 * families — including their Nerd Fonts. On Firefox/Safari (no API) or if the
 * permission is denied, the field falls back to a manual text input. An empty
 * value ("System default") lets the app theme's code font apply, then restty's
 * built-in fallback chain (see {@link ./terminal-font.ts}).
 *
 * Font size: a labeled number input (not a slider or dropdown). A slider over
 * a discrete integer range is finicky — hard to land on an exact px — and a
 * dropdown adds a click for no benefit; a number input lets the user type or
 * step to an exact px directly. min/max mirror the clamp bounds so the
 * browser's own validation matches {@link clampResttyFontSize}, which
 * re-clamps on write (an empty/NaN field reverts to the default).
 *
 * Theme pickers: two short curated lists — one for the restty terminal
 * (auto / tokyo-night / dracula / high-contrast / …) and one for the
 * CodeMirror editor (auto / dracula / github-dark / one-dark / …). The full
 * restty catalog is NOT exposed here (kept the dropdowns readable); the
 * curated presets cover the well-known themes.
 */
import { type ReactNode } from 'react';
/** The terminal appearance panel. */
export declare function TerminalAppearancePanel(): ReactNode;
