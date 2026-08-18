/**
 * The file explorer tab: a directory tree over one bookmarked local folder
 * ("+" adds a typed path and makes it the new root, "-" removes it and falls
 * back to the previous one — see explorer-prefs.ts; there is no separate
 * folder-switcher UI), clicking a file opens it in the editor tab via
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
    /** Open a file and scroll/select `line` (search-mode result clicks). */
    onOpenFileAtLine?: (path: string, line: number) => void;
}
/** `path` relative to `root` (falls back to the absolute path when `path`
 *  isn't actually under `root` — should not happen, the tree only ever
 *  descends from `root`). Exported for testing. */
export declare function relativeTo(root: string, path: string): string;
/**
 * The relative-path reference copied by the `@` button. Always prefixed with
 * `@` (the user's `@file` mention convention) — clicking the `@` icon on
 * `package.json` copies `@package.json`, on `src/index.ts` copies
 * `@src/index.ts`. The `@` is part of the copied text, not just the icon.
 * Exported for testing.
 */
export declare function atReference(root: string, path: string): string;
export declare function FileExplorer(props: FileExplorerProps): ReactNode;
