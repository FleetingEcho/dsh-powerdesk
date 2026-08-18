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
export declare const DEFAULT_EDITOR_THEME = "dracula";
/** What `auto` resolves to while the app is in the dark scheme. */
export declare const DARK_AUTO_EDITOR_THEME = "github-dark";
/** What `auto` resolves to while the app is in the light scheme. */
export declare const LIGHT_AUTO_EDITOR_THEME = "github-light";
/** The base surface colors of one editor theme. */
export interface EditorThemeBase {
    background: string;
    foreground: string;
    caret: string;
    selection: string;
    /** Semi-transparent — the active-line band must not paint opaque. */
    activeLine: string;
    gutterBackground: string;
    gutterForeground: string;
    /** Semi-transparent. */
    activeLineGutter: string;
}
/** Syntax token colors. Omitted groups render in the theme foreground. */
export interface EditorThemeTokens {
    keyword?: string;
    function?: string;
    /** Constants, standard names, colors. */
    constant?: string;
    /** Type/class/number/namespace family. */
    type?: string;
    operator?: string;
    comment?: string;
    string?: string;
    heading?: string;
    /** Atoms, booleans. */
    atom?: string;
    link?: string;
    invalid?: string;
}
/** One fully-resolved editor theme (base surface + token palette). */
export interface EditorThemeSpec {
    /** The stable id (also the i18n key suffix). */
    id: string;
    /** Whether the theme is dark (the `EditorView.theme` `dark` flag). */
    dark: boolean;
    base: EditorThemeBase;
    tokens: EditorThemeTokens;
}
/**
 * The curated theme list shown in the appearance panel (display order).
 * `auto` (follow the app scheme) is first, mirroring the terminal preset
 * list; every other id is a concrete palette.
 */
export declare const EDITOR_THEME_PRESETS: readonly string[];
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
export declare function resolveEditorThemeId(themePref: string, dark: boolean): string;
/**
 * The fully-resolved spec for a concrete theme id. An unknown id degrades to
 * the default (dracula) palette so a stale value never yields an empty
 * theme (mirrors the terminal resolver's safe-degrade contract).
 *
 * @param id - a concrete theme id (the output of {@link resolveEditorThemeId}).
 * @returns the theme spec to build the CodeMirror extensions from.
 */
export declare function editorThemeSpec(id: string): EditorThemeSpec;
