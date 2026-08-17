/**
 * Typed fetch wrapper over the /restty JSON API and the WebSocket URL builders.
 * Every call posts to `/powerdesk/api/<method>` with the sessionId (and the
 * session's cwd when known). Failures surface as {@link ResttyApiError} with
 * the wire code.
 */
/** One wire failure. */
export declare class ResttyApiError extends Error {
    readonly code: string;
    constructor(code: string, message: string);
}
/** Terminal dependency status (mirror of the host's RustPtyDepsStatus). */
export type TerminalDepsStatus = {
    ok: true;
} | {
    ok: false;
    /** The load-time error message (module missing, native binding broken…). */
    cause: string;
    /** The pasteable repair command (terminal/cmd). */
    command: string;
    /** The detected profile name (null when undetected). */
    profile: string | null;
    /** Optional supplementary hint. */
    note?: string;
};
/** Ripgrep dependency status (mirror of the host's RipgrepDepsStatus). */
export type SearchDepsStatus = {
    ok: true;
} | {
    ok: false;
    /** Why no `rg` candidate resolved. */
    cause: string;
    /** The pasteable repair command (terminal/cmd). */
    command: string;
    /** The detected profile name (null when undetected). */
    profile: string | null;
    /** Optional supplementary hint. */
    note?: string;
};
/** One content-search match (mirror of the host's SearchMatch). */
export interface SearchMatch {
    line: number;
    text: string;
    /** [start, end) byte offsets of each matched run within `text`. */
    ranges: [number, number][];
}
/** One file's matches (mirror of the host's SearchFileResult). */
export interface SearchFileResult {
    path: string;
    matches: SearchMatch[];
}
/** search.grep's result (mirror of the host's SearchGrepResult). */
export interface SearchGrepResult {
    files: SearchFileResult[];
    /** True when the server-side match/time cap cut the search short. */
    truncated: boolean;
}
/** One browser.probe wire result (the host's fetch of the target's headers). */
export type BrowserProbeResult = {
    reachable: boolean;
    /** The final (post-redirect) URL; present when reachable. */
    url?: string;
    status?: number;
    xFrameOptions?: string;
    /** The CSP frame-ancestors source list; present when the directive exists. */
    frameAncestors?: string[];
};
/** One fs.list directory entry (mirror of the host's FsEntry). */
export interface FsEntry {
    name: string;
    isDir: boolean;
    size: number;
}
export interface FsListResult {
    path: string;
    entries: FsEntry[];
}
export interface FsReadResult {
    path: string;
    content: string;
    truncated: boolean;
}
/** One installed extension's manifest (mirror of the host's ExtensionManifest). */
export interface ExtensionManifest {
    apiVersion: number;
    id: string;
    title: string;
    icon?: string;
    entry: string;
    export: string;
    order?: number;
    single?: boolean;
}
/** Install provenance the host records (mirror of the host's InstallRecord). */
export interface ExtensionInstallRecord {
    installedAt: string;
    sourceFilename: string;
    sha256: string;
    sourceBytes: number;
}
/** One installed extension (mirror of the host's InstalledExtension). */
export interface InstalledExtension {
    id: string;
    manifest?: ExtensionManifest;
    install?: ExtensionInstallRecord;
    dir: string;
    bundleBytes?: number;
    /** Why this extension is not loadable; when set, `manifest` is absent. */
    error?: string;
}
/** The `ext.list` reply: the config gate, the root, and what is installed. */
export interface ExtensionListResult {
    enabled: boolean;
    dir: string;
    extensions: InstalledExtension[];
}
/** One node of the Notes tab's recursive markdown tree (mirror of the host's MdTreeNode). */
export interface MdTreeNode {
    name: string;
    path: string;
    isDir: boolean;
    children?: MdTreeNode[];
}
/** One request's session scope: the conversation id plus its cwd when known. */
export interface SessionScope {
    sessionId: string;
    cwd?: string;
}
/** The restty API surface (session scope threaded through every call). */
export declare const api: {
    /** Resolve the session's authoritative cwd (used by the standalone panel
     *  when the client list summary has no cwd). */
    sessionCwd: (scope: SessionScope, signal?: AbortSignal) => Promise<{
        sessionId: string;
        cwd: string;
    }>;
    /** Release a terminal's process immediately (tab closed while the WS was
     *  down; the close frame may be unreachable, so the host also accepts this
     *  explicit route). */
    ptyClose: (scope: SessionScope, tab: string) => Promise<{
        ok: true;
    }>;
    /** Native pty dependency status: after a WS close 1011 with reason
     *  `powerdesk-pty-deps-missing` the view fetches the full repair details here. */
    terminalDeps: () => Promise<TerminalDepsStatus>;
    /** Probe a URL's response headers (the browser tab's embeddability check;
     *  see the host's browser.probe route). Returns whether the target site
     *  forbids being embedded (X-Frame-Options / frame-ancestors). */
    browserProbe: (url: string, signal?: AbortSignal) => Promise<BrowserProbeResult>;
    /** List one directory's immediate children (Explorer tab). */
    fsList: (path: string, signal?: AbortSignal) => Promise<FsListResult>;
    /** Read one file's content, capped server-side at a few MB (Editor tab). */
    fsRead: (path: string, signal?: AbortSignal) => Promise<FsReadResult>;
    /** Overwrite one file's content (Editor tab save). */
    fsWrite: (path: string, content: string) => Promise<{
        path: string;
    }>;
    /** Create a NEW empty file; fails if it already exists (Notes "new note"). */
    fsCreate: (path: string) => Promise<{
        path: string;
    }>;
    /** Create a directory, including missing parents (Notes "new folder"). */
    fsMkdir: (path: string) => Promise<{
        path: string;
    }>;
    /** Rename/move a file or folder (Notes rename). */
    fsRename: (from: string, to: string) => Promise<{
        path: string;
    }>;
    /** Delete a file or folder, recursively (Notes delete). */
    fsDelete: (path: string) => Promise<{
        path: string;
    }>;
    /** The recursive `.md` tree over a bound folder (Notes tab). */
    fsListMarkdownTree: (path: string, signal?: AbortSignal) => Promise<{
        path: string;
        children: MdTreeNode[];
    }>;
    /** The host's home directory (the folder-picker modal's starting point). */
    fsHome: (signal?: AbortSignal) => Promise<{
        path: string;
    }>;
    /** Content search over a directory via ripgrep (Search tab). */
    searchGrep: (path: string, query: string, signal?: AbortSignal) => Promise<SearchGrepResult>;
    /** Ripgrep dependency status: fetched when the Search tab needs to show a
     *  repair banner (no `/powerdesk/ws/*` upgrade to close-marker off of here
     *  — search is a plain buffered POST, so the client just checks this
     *  directly rather than reacting to a socket close). */
    searchDeps: (signal?: AbortSignal) => Promise<SearchDepsStatus>;
    /** Installed extensions plus the config gate (answers even when disabled,
     *  so the settings card can explain why nothing loads). */
    extList: (signal?: AbortSignal) => Promise<ExtensionListResult>;
    /** Install an uploaded archive. `id`/`title` are only consulted when the
     *  upload turns out to be a bare script with no manifest of its own. */
    extInstall: (upload: {
        filename: string;
        dataBase64: string;
        id?: string;
        title?: string;
        icon?: string;
    }) => Promise<InstalledExtension>;
    /** Uninstall one extension (removing an absent id is a no-op). */
    extRemove: (id: string) => Promise<{
        ok: true;
    }>;
};
/**
 * Base64-encode an uploaded file for {@link api.extInstall}. Encoding is done
 * in chunks: `String.fromCharCode(...bytes)` on a multi-MB archive blows the
 * argument limit and throws a RangeError, which would surface as a confusing
 * "too many arguments" failure on exactly the large uploads this exists for.
 */
export declare function toBase64(bytes: Uint8Array): string;
/**
 * Build the WebSocket URL for the OWN backend (/powerdesk/ws/terminal). The
 * query carries the session id, tab id, and the client list-summary cwd (the
 * host prefers the attached session header and uses this only while the
 * session is still hydrating).
 */
export declare function resttyWsUrl(scope: SessionScope, tabId: string): string;
/**
 * Build the WebSocket URL for the BETTER_SIDEBAR backend (dsh-better-sidebar's
 * /sidebar/ws/terminal). Same-origin, protocol swap; the query matches
 * dsh-better-sidebar's UI-tab attach contract (sessionId + tab + optional cwd).
 */
export declare function sidebarWsUrl(scope: SessionScope, tabId: string): string;
