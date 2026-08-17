/**
 * dsh-powerdesk host half: the /restty JSON API (terminal.deps,
 * pty.close, session.cwd), the /powerdesk/bundle lazy-chunk route (client code
 * splits), and the /powerdesk/ws/terminal WebSocket upgrade speaking restty's
 * NATIVE wire protocol (client → server: `{type:'input',data}` /
 * `{type:'resize',cols,rows,...}` / `{type:'close'}` as JSON string frames;
 * server → client: terminal bytes as BINARY frames, `{type:'status'}` /
 * `{type:'error'}` / `{type:'exit'}` as JSON string frames). Every route
 * passes the same browser-trust fence as the /api gateway — Host-header
 * loopback or the web runtime's `trustedHosts` (LAN IP literals sampled at
 * boot plus `--trusted-host` authorities), read per request from the live
 * service value so the fence tracks the same trust source the /api gateway
 * derives its list from.
 *
 * All operations are conversation-scoped: requests carry a sessionId, the
 * session's authoritative cwd comes from the session store, and terminal
 * processes are keyed by `${sessionId}:${tabId}`.
 *
 * The PTY backend is a Rust native module (napi-rs + portable-pty), loaded
 * LAZILY so a missing/broken native binding degrades THIS plugin (the
 * terminal tab shows a repair banner) instead of crashing `dsh web`.
 */
import type { IncomingMessage } from 'node:http'
import type { Duplex } from 'node:stream'
import { WebSocket, WebSocketServer } from 'ws'
import type { Context, ResttyHttpRequest } from './context-types.ts'
import { Config, resolveResttyConfig, type ResolvedResttyConfig, type ResttyConfig } from './config.ts'
import { isTrustedApiRequest, isLoopbackHostname } from './trust-fence.ts'
import { registerBundleRoute, type ExtensionBundleSource } from './bundle-route.ts'
import { ExtensionError } from './extensions/manifest.ts'
import { listExtensions, removeExtension, resolveExtensionsDir } from './extensions/registry.ts'
import { MAX_UPLOAD_BYTES, installExtension } from './extensions/install.ts'
import { defaultShell } from './shell.ts'
import { RustPtyManager } from './rust-pty-manager.ts'
import { handleClientMessage } from './pty-wire.ts'
import { extractFrameAncestors } from './browser-probe.ts'
import { fsCreate, fsDelete, fsHome, fsList, fsListMarkdownTree, fsMkdir, fsRead, fsRename, fsWrite } from './fs-api.ts'
import { searchGrep } from './search-api.ts'
import { searchDepsStatus } from './search-deps.ts'
import {
  PTY_DEPS_MISSING,
  depsStatus,
  loadRustPty,
} from './rust-pty-deps.ts'
import { MAX_BODY_BYTES, readJsonBody, requireString, ResttyError, writeError, writeJson, writeOk } from './wire.ts'

export { Config }
export type { ResttyConfig, ResolvedResttyConfig } from './config.ts'
// Re-export the Context augmentation (declare module 'cordis') so consumers
// `import type {} from 'dsh-powerdesk'` and gain the restated service
// members; also re-export the client service descriptor types so consumers
// can type their own restty tab descriptors without reaching into /client.
export type { Context } from './context-types.ts'
export type {
  PowerdeskSidebarService,
  TabDescriptor,
  TabComponentProps,
} from './client/service.ts'

/** Plugin identity for cordis.yml rows. */
export const name = 'dsh-powerdesk'

/** Services required before mounting: the webserver routes, the session
 *  store, and the web runtime's trusted hosts. */
export const inject = ['webServer', 'sessions', 'webRuntime']

/**
 * Resolve a session's authoritative working directory. The attached session
 * header wins; while the session is still hydrating from persistence (the web
 * client attaches the current conversation a moment after page load, so the
 * very first restty requests can arrive detached) the caller's own list
 * summary cwd is used; the process cwd is the last resort. Never throws for
 * a missing cwd, so the terminal works from first paint.
 */
function sessionCwdOf(ctx: Context, sessionId: string, clientCwd?: string): string {
  const session = ctx.sessions.get(sessionId)
  const headerCwd = session?.header.cwd
  if (headerCwd !== undefined && headerCwd !== '') return headerCwd
  if (clientCwd !== undefined && clientCwd !== '') return clientCwd
  return process.cwd()
}

/**
 * Per-method request-body bound. Only the extension upload needs more than
 * the default: a 16 MiB archive is ~21 MiB once base64-encoded, plus the JSON
 * envelope. Every other method keeps the tight default.
 */
export function bodyLimitFor(method: string): number {
  return method === 'ext.install' ? Math.ceil(MAX_UPLOAD_BYTES * 4 / 3) + (1 << 16) : MAX_BODY_BYTES
}

/** Translate an extension-layer rejection into the API's error envelope. */
function asResttyError(error: unknown): unknown {
  return error instanceof ExtensionError ? new ResttyError('bad-request', error.message, 400) : error
}

/** Build the JSON API method table bound to the plugin context + pty manager. */
function buildApi(
  ctx: Context,
  ptyManager: RustPtyManager | null,
  extensions: ExtensionBundleSource,
): Record<string, (payload: unknown) => unknown> {
  /** Refuse extension mutations while the feature is off in config. */
  const requireExtensionsEnabled = (): void => {
    if (!extensions.enabled) {
      throw new ResttyError('forbidden', 'extensions are disabled; set extensionsEnabled in the dsh-powerdesk plugin config', 403)
    }
  }
  const cwdOf = (payload: unknown): { sessionId: string; cwd: string } => {
    const sessionId = requireString(payload, 'sessionId')
    const record = payload as { cwd?: unknown } | null
    const clientCwd = typeof record?.cwd === 'string' && record.cwd !== '' ? record.cwd : undefined
    return { sessionId, cwd: sessionCwdOf(ctx, sessionId, clientCwd) }
  }
  return {
    'session.cwd': (payload) => {
      const { sessionId, cwd } = cwdOf(payload)
      return { sessionId, cwd }
    },
    // Release a terminal immediately. The WebSocket close frame already does
    // this while the socket is open; this route covers the tab-close that
    // happens while the socket is down (reconnect loop), so a closed tab can
    // never hold the per-session quota until the reconnect grace expires.
    'pty.close': (payload) => {
      const sessionId = requireString(payload, 'sessionId')
      const tab = requireString(payload, 'tab')
      ptyManager?.close(`${sessionId}:${tab}`)
      return { ok: true }
    },
    // Native pty dependency status: after a WS close 1011 with reason
    // `powerdesk-pty-deps-missing` the client fetches the full repair details
    // here (the close reason itself is capped at 123 bytes).
    'terminal.deps': () => depsStatus(),
    // Browser embeddability probe: the host fetches the response headers of
    // a URL the user is browsing so the client can decide whether the target
    // forbids being embedded (X-Frame-Options / frame-ancestors are exactly
    // the signals the browser enforces when it refuses an iframe load). The
    // probe is display-only (headers back to the caller), restricted to
    // http(s) non-loopback URLs with a hard timeout, and gated by the same
    // trust fence as every other route — a cross-site page cannot reach it.
    'browser.probe': async (payload) => {
      const raw = requireString(payload, 'url')
      let parsed: URL
      try {
        parsed = new URL(raw)
      } catch {
        throw new ResttyError('bad-request', 'invalid url', 400)
      }
      if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
        throw new ResttyError('bad-request', 'only http/https urls can be probed', 400)
      }
      // Mirror the browser tab's address-bar policy: loopback stays unreachable
      // from the sidebar, so probing it would leak nothing the tab could use.
      if (isLoopbackHostname(parsed.hostname)) {
        throw new ResttyError('bad-request', 'local addresses are not probed', 400)
      }
      const controller = new AbortController()
      const timer = setTimeout(() => controller.abort(), 8000)
      try {
        let response = await fetch(parsed, { method: 'HEAD', redirect: 'follow', signal: controller.signal })
        // Some servers answer HEAD with 405/501; retry once as GET (the
        // body is discarded — only the headers matter).
        if (response.status === 405 || response.status === 501) {
          response = await fetch(parsed, { method: 'GET', redirect: 'follow', signal: controller.signal })
        }
        const csp = response.headers.get('content-security-policy')
        const frameAncestors = extractFrameAncestors(csp)
        const xFrameOptions = response.headers.get('x-frame-options')
        return {
          reachable: true,
          url: response.url,
          status: response.status,
          ...(xFrameOptions !== null ? { xFrameOptions } : {}),
          ...(frameAncestors !== undefined ? { frameAncestors } : {}),
        }
      } catch {
        // DNS / TLS / connection / timeout: nothing to judge — the client
        // keeps the plain iframe.
        return { reachable: false }
      } finally {
        clearTimeout(timer)
      }
    },
    // File explorer / editor: list a directory, read/write one file. No
    // extra path sandboxing beyond resolve() — the terminal already gives
    // the user unrestricted local shell access, so restricting this API
    // more tightly would not add any real security.
    'fs.list': (payload) => fsList(requireString(payload, 'path')),
    'fs.read': (payload) => fsRead(requireString(payload, 'path')),
    'fs.write': (payload) => {
      const path = requireString(payload, 'path')
      const content = requireString(payload, 'content')
      return fsWrite(path, content)
    },
    // Notes tab: create/rename/delete + the recursive markdown tree.
    'fs.create': (payload) => fsCreate(requireString(payload, 'path')),
    'fs.mkdir': (payload) => fsMkdir(requireString(payload, 'path')),
    'fs.rename': (payload) => {
      const from = requireString(payload, 'from')
      const to = requireString(payload, 'to')
      return fsRename(from, to)
    },
    'fs.delete': (payload) => fsDelete(requireString(payload, 'path')),
    'fs.listMarkdownTree': (payload) => fsListMarkdownTree(requireString(payload, 'path')),
    // The folder-picker modal's starting point.
    'fs.home': () => fsHome(),
    // Search tab: content search over a directory via ripgrep (see
    // search-api.ts / search-deps.ts). `search.deps` mirrors `terminal.deps`
    // — the client fetches it to show a repair banner when `rg` is missing.
    'search.grep': (payload) => searchGrep(requireString(payload, 'path'), requireString(payload, 'query')),
    'search.deps': () => searchDepsStatus(),
    // ── User-installed extensions ─────────────────────────────────────────
    // `ext.list` answers even while the feature is disabled, so the settings
    // card can explain WHY nothing loads instead of rendering an empty list.
    'ext.list': async () => ({
      enabled: extensions.enabled,
      dir: extensions.dir,
      extensions: extensions.enabled ? await listExtensions(extensions.dir) : [],
    }),
    // Install an uploaded archive. The bytes arrive base64-encoded inside the
    // JSON envelope (the API gateway is JSON-only); `filename` is provenance
    // for the settings card and never drives the decode — see install.ts.
    'ext.install': async (payload) => {
      requireExtensionsEnabled()
      const filename = requireString(payload, 'filename')
      const record = payload as { dataBase64?: unknown; id?: unknown; title?: unknown; icon?: unknown }
      if (typeof record.dataBase64 !== 'string' || record.dataBase64 === '') {
        throw new ResttyError('bad-request', 'missing or invalid "dataBase64"')
      }
      const data = new Uint8Array(Buffer.from(record.dataBase64, 'base64'))
      if (data.length === 0) {
        throw new ResttyError('bad-request', '"dataBase64" did not decode to any bytes')
      }
      // Identity supplied by the upload dialog; only consulted when the
      // payload turns out to be a bare script with no manifest of its own.
      const fallback = typeof record.id === 'string' && typeof record.title === 'string'
        ? {
            id: record.id,
            title: record.title,
            ...typeof record.icon === 'string' && record.icon !== '' ? { icon: record.icon } : {},
          }
        : undefined
      try {
        return await installExtension(extensions.dir, {
          filename,
          data,
          ...fallback !== undefined ? { fallback } : {},
        })
      } catch (error) {
        throw asResttyError(error)
      }
    },
    'ext.remove': async (payload) => {
      requireExtensionsEnabled()
      const id = requireString(payload, 'id')
      try {
        await removeExtension(extensions.dir, id)
      } catch (error) {
        throw asResttyError(error)
      }
      return { ok: true }
    },
  }
}

/**
 * Plugin body: mount the fenced routes and the pty lifecycle.
 * @param ctx - host plugin context (webServer, sessions, webRuntime).
 * @param config - deployment-provided limits; the Loader validates against
 * {@link Config} and fills defaults.
 */
export function apply(ctx: Context, config?: ResttyConfig): void {
  const resolved = resolveResttyConfig(config)
  const terminalShell = defaultShell({ explicit: resolved.shell })
  // The web runtime's bind-derived trust list — the authoritative source the
  // /api gateway fence derives its list from. Read per request from the live
  // service value; a replaced list takes effect without a plugin restart.
  const fence = (req: ResttyHttpRequest): boolean => isTrustedApiRequest(req, ctx.webRuntime.trustedHosts)
  // The Rust native module is loaded lazily, never at module top level: a
  // missing or broken binding must degrade THIS plugin — the terminal tab
  // shows a repair command — instead of failing the plugin load and taking
  // the whole `dsh web` server down.
  const nativeModule = loadRustPty()
  if (nativeModule === null) {
    const status = depsStatus()
    const detail = status.ok
      ? 'unknown cause'
      : `${status.cause}. Repair: ${status.command}`
    console.warn(`[dsh-powerdesk] native pty failed to load: ${detail}`)
  }
  const ptyManager = nativeModule !== null
    ? new RustPtyManager(terminalShell, resolved.terminalsPerSession, nativeModule)
    : null

  // User-installed extensions run in the DSH page's own origin with the same
  // privileges as this plugin, so the feature is off unless the deployment
  // opts in. Resolved once here and shared by the API and the bundle route so
  // the two can never disagree about which directory is authoritative.
  const extensions: ExtensionBundleSource = {
    enabled: resolved.extensionsEnabled,
    dir: resolveExtensionsDir(resolved.extensionsDir),
  }
  if (extensions.enabled) {
    console.warn(`[dsh-powerdesk] user extensions ENABLED; loading from ${extensions.dir}. Extensions run with full page privileges.`)
  }

  // ── JSON API ────────────────────────────────────────────────────────────
  const api = buildApi(ctx, ptyManager, extensions)
  ctx.effect(() => ctx.webServer.register({
    kind: 'prefix',
    path: '/powerdesk/api',
    handler: async (req, res) => {
      if (!fence(req)) {
        writeJson(res, 403, { ok: false, error: { code: 'forbidden', message: 'forbidden' } })
        return
      }
      if (req.method !== 'POST') {
        writeJson(res, 405, { ok: false, error: { code: 'method-error', message: 'method not allowed' } })
        return
      }
      const pathname = new URL(req.url ?? '/', 'http://dsh.internal').pathname
      const method = pathname.startsWith('/powerdesk/api/') ? pathname.slice('/powerdesk/api/'.length) : undefined
      if (method === undefined || method.includes('/')) {
        writeError(res, new ResttyError('not-found', 'unknown restty API method', 404))
        return
      }
      try {
        const payload = await readJsonBody(req, bodyLimitFor(method))
        const handler = api[method]
        if (handler === undefined) {
          throw new ResttyError('not-found', `unknown restty API method "${method}"`, 404)
        }
        writeOk(res, await handler(payload))
      } catch (error) {
        writeError(res, error)
      }
    },
  }), 'dsh-powerdesk: /powerdesk/api routes')

  // ── Lazy chunk route (client bundle splits) ─────────────────────────────
  ctx.effect(() => registerBundleRoute(ctx, fence, extensions), 'dsh-powerdesk: /powerdesk/bundle chunk route')

  // ── Terminal WebSocket (restty native wire protocol) ────────────────────
  // One upgrade endpoint serves UI-tab terminals (?tab=...&sessionId=...&cwd=...).
  // Input/resize/close arrive as JSON string frames; terminal bytes are sent
  // back as BINARY frames (restty decodes them via a streaming TextDecoder,
  // and binary output avoids any JSON-control false positives); status/error/
  // exit are JSON string frames. A bare socket drop (refresh, tab switch)
  // leaves the pty alive for the reconnect grace; a `{type:'close'}` frame
  // releases the quota immediately.
  const wss = new WebSocketServer({ noServer: true })
  ctx.effect(() => ctx.webServer.registerUpgrade({
    path: '/powerdesk/ws/terminal',
    handler: (req, socket, head) => {
      if (!fence(req)) {
        socket.destroy()
        return
      }
      // The structural request/socket/head faces satisfy the shared fence;
      // the `ws` package wants the real Node types — cast at this boundary.
      wss.handleUpgrade(req as unknown as IncomingMessage, socket as unknown as Duplex, head as Buffer, (ws) => {
        void attachTerminal(ctx, ptyManager, terminalShell, ws, req, resolved)
      })
    },
  }), 'dsh-powerdesk: terminal WebSocket')

  ctx.effect(() => () => {
    ptyManager?.disposeAll()
    wss.close()
  }, 'dsh-powerdesk: teardown')
}

/**
 * Wire one terminal socket to its pty: replay transcript, pump both ways.
 * restty sends `{type:'input',data}` / `{type:'resize',cols,rows,…}` /
 * `{type:'close'}` as JSON string frames; we send terminal bytes back as
 * BINARY frames and status/error/exit as JSON string frames.
 */
async function attachTerminal(
  ctx: Context,
  ptyManager: RustPtyManager | null,
  shell: string,
  ws: WebSocket,
  req: ResttyHttpRequest,
  resolved: ResolvedResttyConfig,
): Promise<void> {
  try {
    const url = new URL(req.url ?? '/', 'http://dsh.internal')
    const sessionId = url.searchParams.get('sessionId')
    const tabId = url.searchParams.get('tab')
    if (sessionId === null || tabId === null) {
      ws.close(1008, 'sessionId and tab are required')
      return
    }
    if (ptyManager === null) {
      // Degraded mode: the native pty module failed to load. The close reason
      // is a SHORT marker — a WS close reason is capped at 123 bytes, so the
      // client fetches the full repair command from /powerdesk/api/terminal.deps.
      ws.close(1011, PTY_DEPS_MISSING)
      return
    }
    const clientCwd = url.searchParams.get('cwd') ?? undefined
    // Resolve the session's authoritative cwd: the attached session header
    // wins; while the session is still hydrating (the very first request can
    // arrive detached) the client list summary cwd is used; the process cwd
    // is the last resort. Never throws, so the terminal works from first paint.
    const cwd = sessionCwdOf(ctx, sessionId, clientCwd)
    const handle = ptyManager.open(sessionId, tabId, cwd, 80, 24)
    // Status: tell restty the shell name (its onStatus callback).
    ws.send(JSON.stringify({ type: 'status', shell }))
    // Replay the transcript as a single binary frame (restty decodes it).
    if (handle.transcript !== '') {
      ws.send(Buffer.from(handle.transcript, 'utf8'))
    }
    const onData = (data: string): void => {
      if (ws.readyState === WebSocket.OPEN && ws.bufferedAmount < 4 * 1024 * 1024) {
        ws.send(Buffer.from(data, 'utf8'))
      }
    }
    const onExit = ({ exitCode }: { exitCode: number; signal?: number | null }): void => {
      // Visible exit notice (binary frame → restty onData → rendered), then
      // the structured exit control (string JSON frame → restty onExit).
      onData(`\r\n[process exited with code ${String(exitCode)}]\r\n`)
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'exit', code: exitCode }))
      }
    }
    const dataSub = handle.pty.onData(onData)
    const exitSub = handle.pty.onExit(onExit)
    // restty always sends JSON (input/resize/close); the pure dispatcher in
    // pty-wire.ts parses and routes each frame to the live pty.
    const sendControl = (payload: Record<string, unknown>): void => {
      if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify(payload))
    }
    const sendData = (text: string): void => { onData(text) }
    ws.on('message', (data) => {
      handleClientMessage(data.toString('utf8'), handle, ptyManager, sendControl, sendData)
    })
    ws.on('close', () => {
      dataSub()
      exitSub()
      // A bare socket drop (refresh, tab switch) leaves the process alive for
      // a grace period so a quick reconnect keeps it; the reconnect's open()
      // cancels the pending close.
      ptyManager.scheduleClose(handle.key, resolved.reconnectGraceMs)
    })
  } catch (error) {
    ws.close(1011, error instanceof Error ? error.message : String(error))
  }
}
