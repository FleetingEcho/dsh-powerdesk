/**
 * The file explorer tab: a directory tree over one bookmarked local folder
 * (switchable — the header's folder button lists every bookmark, "+" adds
 * a typed path), clicking a file opens it in the editor tab via
 * `onOpenFile` (wired to `service.openFile` in SplitPane.tsx). Also doubles
 * as a "notes" browser: point a bookmark at wherever you keep notes and
 * browse/open .md files the same way as any other folder.
 *
 * Each file row reveals two copy actions on hover: "@" copies the path
 * relative to the current root (for @-mentioning in chat), a copy-glyph
 * button copies the absolute path.
 *
 * Directory expand state lives in the shared `SidebarState.expanded` set
 * (via `expanded`/`onToggleDir`, threaded through `TabComponentProps`) so it
 * survives tab switches within a session; bookmarks live in localStorage
 * (see explorer-prefs.ts) — independent of any session, so they persist
 * across reloads and are shared by every conversation.
 */
import { type ReactNode } from 'react';
export interface FileExplorerProps {
    /** The session's cwd, used as the root when no bookmark is active. */
    cwd?: string;
    expanded: string[];
    onToggleDir: (path: string) => void;
    onOpenFile: (path: string) => void;
}
export declare function FileExplorer(props: FileExplorerProps): ReactNode;
