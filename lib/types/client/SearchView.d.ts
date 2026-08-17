/**
 * The Search tab: content search over the session's cwd via ripgrep (see
 * search-api.ts / search-deps.ts on the host half). A debounced query box
 * (mirrors BrowserView's `.browserBar`/`.browserInput`) drives `api.
 * searchGrep`, results are grouped by file (reusing `.explorerRow`/
 * `.explorerName`/`.explorerDir` from FileExplorer.tsx's row styling),
 * clicking a match opens it in the editor at that line via `onOpenFileAtLine`
 * (service.openFileAtLine → CodeEditor's `initialLine`).
 *
 * Deliberately NOT lazy-chunked: unlike Explorer/Editor/Terminal, this view
 * has no heavy dependency (no CodeMirror, no WASM renderer) — it's plain
 * React + fetch, cheap enough to ship in the main bundle.
 */
import { type ReactNode } from 'react';
export interface SearchViewProps {
    /** The session's cwd — the search root. */
    cwd?: string;
    onOpenFileAtLine: (path: string, line: number) => void;
}
export declare function SearchView(props: SearchViewProps): ReactNode;
