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
