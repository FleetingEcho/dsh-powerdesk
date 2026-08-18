/**
 * The editor tab: a CodeMirror 6 text editor over one file (`tab.path`).
 * Registered as the 'editor' tab type — `service.openFile(scope, path)` (see
 * service.ts) hardcodes that type id, so the descriptor registering this
 * component MUST keep `id: 'editor'`. Loads via fs.read, saves via fs.write
 * (Cmd/Ctrl+S); the tab header shows a dirty dot while unsaved edits exist.
 *
 * The theme comes from the global prefs (`editorTheme`, edited in the
 * Settings → Powerdesk appearance panel; palettes live in
 * {@link ./editor-theme.ts}). A pref change — or an app-scheme flip while
 * the pref follows the scheme — re-themes the MOUNTED view live through
 * `StateEffect.reconfigure`, which preserves the doc, the selection, and the
 * undo history (it is a pure appearance swap, not a reload).
 *
 * Lives in the 'editor' lazy chunk (CodeMirror + its language packages are
 * a few hundred KB) — never import this from the core client bundle.
 */
import { type ReactNode } from 'react';
export interface CodeEditorProps {
    path: string;
    visible: boolean;
    /** Scroll to and select this 1-based line on mount, and again whenever it
     *  changes while the SAME file stays open (Search tab result clicks —
     *  see EditorTabView / service.openFileAtLine). */
    initialLine?: number;
    /** Reports unsaved-changes state so the TAB ITSELF shows the indicator
     *  (see TabBar.tsx's `tab.meta.dirty` dot) — there is no in-pane header
     *  bar for this anymore. */
    onDirtyChange?: (dirty: boolean) => void;
}
export declare function CodeEditor({ path, initialLine, onDirtyChange }: CodeEditorProps): ReactNode;
