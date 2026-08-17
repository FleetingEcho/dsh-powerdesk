/**
 * The editor tab: a CodeMirror 6 text editor over one file (`tab.path`).
 * Registered as the 'editor' tab type — `service.openFile(scope, path)` (see
 * service.ts) hardcodes that type id, so the descriptor registering this
 * component MUST keep `id: 'editor'`. Loads via fs.read, saves via fs.write
 * (Cmd/Ctrl+S or the save button); the header shows a dirty dot while
 * unsaved edits exist.
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
}
export declare function CodeEditor({ path, initialLine }: CodeEditorProps): ReactNode;
