/**
 * The Notes tab: bind one local folder, browse only its `.md`/`.markdown`
 * files as a recursive tree (left, width freely draggable via the divider),
 * edit the selected one in the same CodeMirror editor the file-open flow
 * uses (right — syntax-highlighted markdown, Dracula theme, Cmd/Ctrl+S
 * save). New note / new folder / rename / delete round-trip through the
 * fs.* API; the binding is rebindable any time from the header (click the
 * folder name to reopen the folder-picker modal and choose a different one).
 *
 * Row/header actions are icon-only (lucide-react) with a `title` tooltip
 * rather than text labels, to stay compact in a narrow tree column.
 *
 * Unlike the Explorer tab (lazy per-directory fetch, any folder, opens
 * files as separate sidebar tabs), Notes fetches the WHOLE markdown tree up
 * front (folders with no markdown anywhere under them are pruned server-
 * side — see fs-api.ts's `fsListMarkdownTree`) and renders the editor
 * INLINE in the same tab, since a notes folder is small and the point is a
 * single self-contained "notes app" surface, not a general file browser.
 *
 * Lives in the 'editor' lazy chunk (shares the CodeMirror bundle with the
 * plain file editor) — never import this from the core client bundle.
 */
import { type ReactNode } from 'react';
export interface NotesViewProps {
    visible: boolean;
}
export declare function NotesView({ visible }: NotesViewProps): ReactNode;
