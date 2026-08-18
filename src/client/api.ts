/**
 * Typed fetch wrapper over the /restty JSON API and the WebSocket URL builders.
 * Every call posts to `/powerdesk/api/<method>` with the sessionId (and the
 * session's cwd when known). Failures surface as {@link ResttyApiError} with
 * the wire code.
 */
/** One wire failure. */
export class ResttyApiError extends Error {
  constructor(
    readonly code: string,
    message: string,
  ) {
    super(message)
  }
}

/** Terminal dependency status (mirror of the host's RustPtyDepsStatus). */
export type TerminalDepsStatus =
  | { ok: true }
  | {
    ok: false
    /** The load-time error message (module missing, native binding broken…). */
    cause: string
    /** The pasteable repair command (terminal/cmd). */
    command: string
    /** The detected profile name (null when undetected). */
    profile: string | null
    /** Optional supplementary hint. */
    note?: string
  }

/** Ripgrep dependency status (mirror of the host's RipgrepDepsStatus). */
export type SearchDepsStatus =
  | { ok: true }
  | {
    ok: false
    /** Why no `rg` candidate resolved. */
    cause: string
    /** The pasteable repair command (terminal/cmd). */
    command: string
    /** The detected profile name (null when undetected). */
    profile: string | null
    /** Optional supplementary hint. */
    note?: string
  }

/** One calendar event (mirror of the host's CalendarEvent; mirrors schedule-x). */
export interface CalendarEvent {
  id: string
  title?: string
  /** ISO datetime string, e.g. '2026-08-18 10:00' or '2026-08-18T10:00:00'. */
  start: string
  end: string
  location?: string
  description?: string
  calendarId?: string
}

/** SQLite native-binary dependency status (mirror of the host's RustSqliteDepsStatus). */
export type CalendarDepsStatus =
  | { ok: true }
  | {
    ok: false
    /** The load-time error message (module missing, native binding broken…). */
    cause: string
    /** The pasteable repair command (terminal/cmd). */
    command: string
    /** The detected profile name (null when undetected). */
    profile: string | null
    /** Optional supplementary hint. */
    note?: string
  }

/** One content-search match (mirror of the host's SearchMatch). */
export interface SearchMatch {
  line: number
  text: string
  /** [start, end) byte offsets of each matched run within `text`. */
  ranges: [number, number][]
}

/** One file's matches (mirror of the host's SearchFileResult). */
export interface SearchFileResult {
  path: string
  matches: SearchMatch[]
}

/** search.grep's result (mirror of the host's SearchGrepResult). */
export interface SearchGrepResult {
  files: SearchFileResult[]
  /** True when the server-side match/time cap cut the search short. */
  truncated: boolean
}

/** The search box's modifier toggles (mirror of the host's SearchOptions). */
export interface SearchOptions {
  /** "Aa" — case-sensitive (default: case-insensitive). */
  matchCase?: boolean
  /** "ab" (underlined) — whole-word only. */
  wholeWord?: boolean
  /** ".*" — treat the query as a regex (default: literal string). */
  useRegex?: boolean
}

/** One browser.probe wire result (the host's fetch of the target's headers). */
export type BrowserProbeResult = {
  reachable: boolean
  /** The final (post-redirect) URL; present when reachable. */
  url?: string
  status?: number
  xFrameOptions?: string
  /** The CSP frame-ancestors source list; present when the directive exists. */
  frameAncestors?: string[]
}

/** One fs.list directory entry (mirror of the host's FsEntry). */
export interface FsEntry {
  name: string
  isDir: boolean
  size: number
}

export interface FsListResult {
  path: string
  entries: FsEntry[]
}

export interface FsReadResult {
  path: string
  content: string
  truncated: boolean
}

/** One installed extension's manifest (mirror of the host's ExtensionManifest). */
export interface ExtensionManifest {
  apiVersion: number
  id: string
  title: string
  icon?: string
  entry: string
  export: string
  order?: number
  single?: boolean
}

/** Install provenance the host records (mirror of the host's InstallRecord). */
export interface ExtensionInstallRecord {
  installedAt: string
  sourceFilename: string
  sha256: string
  sourceBytes: number
}

/** One installed extension (mirror of the host's InstalledExtension). */
export interface InstalledExtension {
  id: string
  manifest?: ExtensionManifest
  install?: ExtensionInstallRecord
  dir: string
  bundleBytes?: number
  /** Why this extension is not loadable; when set, `manifest` is absent. */
  error?: string
}

/** The `ext.list` reply: the config gate, the root, and what is installed. */
export interface ExtensionListResult {
  enabled: boolean
  dir: string
  extensions: InstalledExtension[]
}

/** One node of the Notes tab's recursive markdown tree (mirror of the host's MdTreeNode). */
export interface MdTreeNode {
  name: string
  path: string
  isDir: boolean
  children?: MdTreeNode[]
}

async function call<T>(method: string, payload: Record<string, unknown>, signal?: AbortSignal): Promise<T> {
  let response: Response
  try {
    response = await fetch(`/powerdesk/api/${method}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
      signal,
    })
  } catch (error) {
    throw new ResttyApiError('network', error instanceof Error ? error.message : String(error))
  }
  const parsed: { ok?: boolean; value?: unknown; error?: { code?: string; message?: string } } | null
    = await response.json().catch(() => null)
  if (!response.ok || parsed === null || parsed.ok !== true || parsed.value === undefined) {
    throw new ResttyApiError(
      parsed?.error?.code ?? 'http',
      parsed?.error?.message ?? `HTTP ${response.status}`,
    )
  }
  return parsed.value as T
}

/** One request's session scope: the conversation id plus its cwd when known. */
export interface SessionScope {
  sessionId: string
  cwd?: string
}

/** Fold a scope into a JSON payload ({cwd} only when present). */
function scopePayload(scope: SessionScope, extra: Record<string, unknown>): Record<string, unknown> {
  return { sessionId: scope.sessionId, ...(scope.cwd !== undefined && scope.cwd !== '' ? { cwd: scope.cwd } : {}), ...extra }
}

/** The restty API surface (session scope threaded through every call). */
export const api = {
  /** Resolve the session's authoritative cwd (used by the standalone panel
   *  when the client list summary has no cwd). */
  sessionCwd: (scope: SessionScope, signal?: AbortSignal) =>
    call<{ sessionId: string; cwd: string }>('session.cwd', scopePayload(scope, {}), signal),
  /** Release a terminal's process immediately (tab closed while the WS was
   *  down; the close frame may be unreachable, so the host also accepts this
   *  explicit route). */
  ptyClose: (scope: SessionScope, tab: string) =>
    call<{ ok: true }>('pty.close', scopePayload(scope, { tab })),
  /** Native pty dependency status: after a WS close 1011 with reason
   *  `powerdesk-pty-deps-missing` the view fetches the full repair details here. */
  terminalDeps: () =>
    call<TerminalDepsStatus>('terminal.deps', {}),
  /** Probe a URL's response headers (the browser tab's embeddability check;
   *  see the host's browser.probe route). Returns whether the target site
   *  forbids being embedded (X-Frame-Options / frame-ancestors). */
  browserProbe: (url: string, signal?: AbortSignal) =>
    call<BrowserProbeResult>('browser.probe', { url }, signal),
  /** List one directory's immediate children (Explorer tab). */
  fsList: (path: string, signal?: AbortSignal) =>
    call<FsListResult>('fs.list', { path }, signal),
  /** Read one file's content, capped server-side at a few MB (Editor tab). */
  fsRead: (path: string, signal?: AbortSignal) =>
    call<FsReadResult>('fs.read', { path }, signal),
  /** Overwrite one file's content (Editor tab save). */
  fsWrite: (path: string, content: string) =>
    call<{ path: string }>('fs.write', { path, content }),
  /** Create a NEW empty file; fails if it already exists (Notes "new note"). */
  fsCreate: (path: string) =>
    call<{ path: string }>('fs.create', { path }),
  /** Create a directory, including missing parents (Notes "new folder"). */
  fsMkdir: (path: string) =>
    call<{ path: string }>('fs.mkdir', { path }),
  /** Rename/move a file or folder (Notes rename). */
  fsRename: (from: string, to: string) =>
    call<{ path: string }>('fs.rename', { from, to }),
  /** Delete a file or folder, recursively (Notes delete). */
  fsDelete: (path: string) =>
    call<{ path: string }>('fs.delete', { path }),
  /** The recursive `.md` tree over a bound folder (Notes tab). */
  fsListMarkdownTree: (path: string, signal?: AbortSignal) =>
    call<{ path: string; children: MdTreeNode[] }>('fs.listMarkdownTree', { path }, signal),
  /** The host's home directory (the folder-picker modal's starting point). */
  fsHome: (signal?: AbortSignal) =>
    call<{ path: string }>('fs.home', {}, signal),
  /** Content search over a directory via ripgrep (Search tab). `options` are
   *  the search box's modifier toggles ("Aa" / "ab" / ".*"). */
  searchGrep: (path: string, query: string, options?: SearchOptions, signal?: AbortSignal) =>
    call<SearchGrepResult>('search.grep', { path, query, ...options }, signal),
  /** Ripgrep dependency status: fetched when the Search tab needs to show a
   *  repair banner (no `/powerdesk/ws/*` upgrade to close-marker off of here
   *  — search is a plain buffered POST, so the client just checks this
   *  directly rather than reacting to a socket close). */
  searchDeps: (signal?: AbortSignal) =>
    call<SearchDepsStatus>('search.deps', {}, signal),
  /** List all calendar events, earliest first (Calendar tab). */
  calendarList: (signal?: AbortSignal) =>
    call<{ events: CalendarEvent[] }>('calendar.list', {}, signal),
  /** Create a calendar event (Calendar tab). Returns the created event. */
  calendarCreate: (event: CalendarEvent, signal?: AbortSignal) =>
    call<{ event: CalendarEvent }>('calendar.create', { ...event }, signal),
  /** Update a calendar event by id (Calendar tab). Returns the changed-row count. */
  calendarUpdate: (event: CalendarEvent, signal?: AbortSignal) =>
    call<{ changes: number }>('calendar.update', { ...event }, signal),
  /** Delete a calendar event by id (Calendar tab). Returns the changed-row count. */
  calendarDelete: (id: string, signal?: AbortSignal) =>
    call<{ changes: number }>('calendar.delete', { id }, signal),
  /** SQLite native-binary dependency status: fetched when the Calendar tab
   *  needs to show a repair banner (same pattern as searchDeps). */
  calendarDeps: (signal?: AbortSignal) =>
    call<CalendarDepsStatus>('calendar.deps', {}, signal),
  /** Installed extensions plus the config gate (answers even when disabled,
   *  so the settings card can explain why nothing loads). */
  extList: (signal?: AbortSignal) =>
    call<ExtensionListResult>('ext.list', {}, signal),
  /** Install an uploaded archive. `id`/`title` are only consulted when the
   *  upload turns out to be a bare script with no manifest of its own. */
  extInstall: (upload: { filename: string; dataBase64: string; id?: string; title?: string; icon?: string }) =>
    call<InstalledExtension>('ext.install', { ...upload }),
  /** Uninstall one extension (removing an absent id is a no-op). */
  extRemove: (id: string) =>
    call<{ ok: true }>('ext.remove', { id }),
}

/**
 * Base64-encode an uploaded file for {@link api.extInstall}. Encoding is done
 * in chunks: `String.fromCharCode(...bytes)` on a multi-MB archive blows the
 * argument limit and throws a RangeError, which would surface as a confusing
 * "too many arguments" failure on exactly the large uploads this exists for.
 */
export function toBase64(bytes: Uint8Array): string {
  const CHUNK = 0x8000
  let binary = ''
  for (let i = 0; i < bytes.length; i += CHUNK) {
    binary += String.fromCharCode(...bytes.subarray(i, i + CHUNK))
  }
  return btoa(binary)
}

/**
 * Build the WebSocket URL for the OWN backend (/powerdesk/ws/terminal). The
 * query carries the session id, tab id, and the client list-summary cwd (the
 * host prefers the attached session header and uses this only while the
 * session is still hydrating).
 */
export function resttyWsUrl(scope: SessionScope, tabId: string): string {
  const url = new URL('/powerdesk/ws/terminal', location.origin)
  url.protocol = url.protocol === 'https:' ? 'wss:' : 'ws:'
  const params = new URLSearchParams({ sessionId: scope.sessionId, tab: tabId })
  if (scope.cwd !== undefined && scope.cwd !== '') params.set('cwd', scope.cwd)
  url.search = params.toString()
  return url.toString()
}

/**
 * Build the WebSocket URL for the BETTER_SIDEBAR backend (dsh-better-sidebar's
 * /sidebar/ws/terminal). Same-origin, protocol swap; the query matches
 * dsh-better-sidebar's UI-tab attach contract (sessionId + tab + optional cwd).
 */
export function sidebarWsUrl(scope: SessionScope, tabId: string): string {
  const url = new URL('/sidebar/ws/terminal', location.origin)
  url.protocol = url.protocol === 'https:' ? 'wss:' : 'ws:'
  const params = new URLSearchParams({ sessionId: scope.sessionId, tab: tabId })
  if (scope.cwd !== undefined && scope.cwd !== '') params.set('cwd', scope.cwd)
  url.search = params.toString()
  return url.toString()
}
