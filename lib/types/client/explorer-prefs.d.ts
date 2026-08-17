/**
 * Bookmarked local folders the Explorer tab switches between, plus which one
 * is active. Persisted in localStorage (same standalone pattern as
 * {@link ./prefs.ts}'s ResttyPrefs) — independent of any conversation's cwd,
 * so a bookmark survives switching sessions and stays put across reloads.
 */
/** One bookmarked folder. */
export interface ExplorerBookmark {
    id: string;
    /** Display label (defaults to the folder's basename when added). */
    label: string;
    /** Absolute (or shell-resolvable) path to the folder. */
    path: string;
}
export interface ExplorerPrefs {
    bookmarks: ExplorerBookmark[];
    /** The bookmark id currently browsed, or null (falls back to the session cwd). */
    activeId: string | null;
}
/** Read the bookmark list + active id from localStorage (defaults when absent/malformed). */
export declare function readExplorerPrefs(): ExplorerPrefs;
/** Persist the full bookmark list + active id. */
export declare function writeExplorerPrefs(prefs: ExplorerPrefs): void;
/** Mint a fresh bookmark id (monotonic within the tab's lifetime). */
export declare function makeBookmarkId(): string;
