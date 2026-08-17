/**
 * The interactive terminal: restty (WebGPU/WebGL2 + WASM VT renderer) over a
 * WebSocket to the plugin's PTY backend. The host replays the session's
 * transcript on connect, then streams live output; input frames are
 * `{type:'input',data}` JSON, resize frames `{type:'resize',cols,rows}` JSON
 * (restty's native protocol). Transient disconnects (page refresh, host
 * restart) reconnect automatically; a server-side refusal (close code 1011
 * with the degraded-mode marker — the Rust PTY failed to load, or
 * dsh-better-sidebar's node-pty failed in adapter mode) stops the loop and
 * shows the repair banner fetched from the matching deps endpoint.
 *
 * Two PTY backends share one component (selected by the user pref):
 * - `own` — the plugin's Rust /powerdesk/ws/terminal (default; self-contained);
 * - `better-sidebar` — reuse dsh-better-sidebar's /sidebar/ws/terminal via
 *   {@link ./adapter-transport.ts} (shares its PTY lifecycle, quota, cwd).
 */
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Restty, getBuiltinTheme, type GhosttyTheme } from 'restty'
import { parseGhosttyColor } from 'restty/internal'
import { api, resttyWsUrl, sidebarWsUrl, type SessionScope, type TerminalDepsStatus } from './api.ts'
import { createResttyTransport, type ResttyTransportListeners } from './restty-transport.ts'
import { createSidebarAdapterTransport } from './adapter-transport.ts'
import { resolveTerminalFont } from './terminal-font.ts'
import { effectiveTokenValue, isDarkScheme, subscribeColorScheme, tokenValue } from './theme.ts'
import { openWhenSized } from './open-when-sized.ts'
import { t } from './locales.ts'
import type { ResttyPrefs } from './prefs.ts'
import css from './restty.module.css'

/** How many consecutive unreasoned failures before showing the error banner. */
const FAILURE_LIMIT = 3
/** Reconnect delay between transient failures. */
const RECONNECT_DELAY_MS = 2000

/** The WS close-code-1011 markers the two backends send when degraded. */
const OWN_DEPS_MARKER = 'powerdesk-pty-deps-missing'
const SIDEBAR_DEPS_MARKER = 'pty-deps-missing'

/** Props: a session scope + tab id + resolved prefs (+ visibility hint). */
export interface ResttyTerminalProps {
  scope: SessionScope
  tabId: string
  prefs: ResttyPrefs
  /** When false the component still keeps the pty attached; passed through so
   *  parents can pause rendering without a remount. */
  visible?: boolean
}

type Phase = 'loading' | 'connecting' | 'connected' | 'reconnecting' | 'fatal' | 'deps-fatal'

/**
 * Pick a builtin restty theme and, when the app exposes paint tokens,
 * override its surface colors so the terminal blends with the panel. Kept
 * defensive: a missing builtin name or unknown field names degrade to the
 * builtin as-is (the CSS .terminalWrap background is the last-resort paint).
 */
function buildResttyTheme(prefs: ResttyPrefs): GhosttyTheme | undefined {
  const dark = isDarkScheme()
  const preferred = prefs.themeName.trim() !== '' ? prefs.themeName.trim() : (dark ? 'Aizen Dark' : 'Aizen Light')
  let theme: GhosttyTheme | undefined
  try {
    theme = getBuiltinTheme(preferred) ?? getBuiltinTheme('Aizen Dark') ?? undefined
  } catch {
    theme = undefined
  }
  if (theme === undefined) return undefined
  // effectiveTokenValue returns a computed CSS color STRING (e.g.
  // "rgb(21, 21, 23)"), but GhosttyTheme.colors.background/foreground are
  // typed as ThemeColor OBJECTS ({r,g,b,a}, 0-255) — restty's WebGPU
  // renderer reads `.b` etc. off them directly for the clear-color float
  // conversion. Assigning the raw string here left `.b` undefined, which
  // WebGPU's `beginRenderPass` rejects as "non-finite". `parseGhosttyColor`
  // does the CSS-string → ThemeColor conversion restty itself uses.
  const bg = effectiveTokenValue('--dsw-alias-bg-base')
  const fg = effectiveTokenValue('--dsw-alias-label-primary')
  const colors = { ...theme.colors }
  if (Object.prototype.hasOwnProperty.call(colors, 'background') && bg !== '') {
    const parsed = parseGhosttyColor(bg)
    if (parsed !== null) colors.background = parsed
  }
  if (Object.prototype.hasOwnProperty.call(colors, 'foreground') && fg !== '') {
    const parsed = parseGhosttyColor(fg)
    if (parsed !== null) colors.foreground = parsed
  }
  return { ...theme, colors }
}

/** Try a live restty theme update; returns whether a live API existed. */
function applyResttyTheme(restty: Restty, theme: GhosttyTheme | undefined): boolean {
  const anyRestty = restty as unknown as {
    setTheme?: (t: unknown) => void
    applyTheme?: (t: unknown) => void
    terminal?: { setTheme?: (t: unknown) => void }
  }
  try {
    if (typeof anyRestty.setTheme === 'function') { anyRestty.setTheme(theme); return true }
    if (typeof anyRestty.applyTheme === 'function') { anyRestty.applyTheme(theme); return true }
    if (typeof anyRestty.terminal?.setTheme === 'function') { anyRestty.terminal.setTheme(theme); return true }
  } catch {
    // A live setter that threw: ignore; the construction-time theme stands.
  }
  return false
}

export function ResttyTerminal({ scope, tabId, prefs, visible = true }: ResttyTerminalProps): ReactNode {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const resttyRef = useRef<Restty | null>(null)
  const urlRef = useRef<string>('')
  const failures = useRef(0)
  const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const cancelledRef = useRef(false)
  const backendRef = useRef<ResttyPrefs['ptyBackend']>(prefs.ptyBackend)
  const offSchemeRef = useRef<(() => void) | null>(null)

  const [phase, setPhase] = useState<Phase>('loading')
  const [depsInfo, setDepsInfo] = useState<TerminalDepsStatus | null>(null)
  const [fatalMessage, setFatalMessage] = useState<string>('')

  const clearReconnect = (): void => {
    if (reconnectTimer.current !== null) {
      clearTimeout(reconnectTimer.current)
      reconnectTimer.current = null
    }
  }

  /** Fetch the repair details from the backend that refused the connection. */
  const fetchDeps = async (backend: ResttyPrefs['ptyBackend']): Promise<void> => {
    if (cancelledRef.current) return
    try {
      if (backend === 'better-sidebar') {
        // dsh-better-sidebar exposes the same shape at /sidebar/api/terminal.deps.
        const res = await fetch('/sidebar/api/terminal.deps', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ sessionId: scope.sessionId }),
        })
        const parsed = await res.json().catch(() => null) as { ok?: boolean; value?: TerminalDepsStatus } | null
        if (parsed?.ok === true && parsed.value !== undefined) {
          setDepsInfo(parsed.value)
          return
        }
      }
      const status = await api.terminalDeps()
      if (!cancelledRef.current) setDepsInfo(status)
    } catch {
      if (!cancelledRef.current) {
        setDepsInfo({
          ok: false,
          cause: 'Could not reach the repair endpoint',
          command: backend === 'better-sidebar'
            ? 'Run dsh-better-sidebar\u2019s repair (scripts/install.sh --repair) and restart DSH'
            : 'bash scripts/install.sh --repair && restart DSH',
          profile: null,
        })
      }
    }
  }

  /** Schedule a transient-disconnect reconnect (bounded by FAILURE_LIMIT). */
  const scheduleReconnect = (): void => {
    failures.current += 1
    if (failures.current >= FAILURE_LIMIT) {
      setPhase('fatal')
      return
    }
    setPhase('reconnecting')
    clearReconnect()
    reconnectTimer.current = setTimeout(() => {
      if (cancelledRef.current) return
      const restty = resttyRef.current
      if (restty === null) return
      setPhase('connecting')
      try {
        restty.connectPty(urlRef.current)
      } catch {
        // connectPty throws only on a busy connection; schedule another retry.
        scheduleReconnect()
      }
    }, RECONNECT_DELAY_MS)
  }

  useEffect(() => {
    cancelledRef.current = false
    const backend = prefs.ptyBackend
    backendRef.current = backend
    const url = backend === 'better-sidebar' ? sidebarWsUrl(scope, tabId) : resttyWsUrl(scope, tabId)
    urlRef.current = url
    failures.current = 0

    const listeners: ResttyTransportListeners = {
      onOpen: () => { if (!cancelledRef.current) { failures.current = 0; setPhase('connected') } },
      onClose: (code, reason) => {
        if (cancelledRef.current) return
        if (reason === OWN_DEPS_MARKER || reason === SIDEBAR_DEPS_MARKER) {
          setPhase('deps-fatal')
          void fetchDeps(backend)
          return
        }
        // A 1011 close WITH a reason is a server refusal (per-session quota
        // reached, a spawn failure, …): surface the reason, do not retry.
        if (code === 1011 && reason !== '') {
          clearReconnect()
          setFatalMessage(reason)
          setPhase('fatal')
          return
        }
        // Transient disconnect (refresh, host restart, network blip):
        // reconnect (the host keeps the pty for the grace window, so a quick
        // reconnect reattaches the same shell).
        scheduleReconnect()
      },
    }

    const mount = (): void => {
      const root = rootRef.current
      if (root === null || cancelledRef.current) return
      const transport = backend === 'better-sidebar'
        ? createSidebarAdapterTransport(scope, tabId, listeners)
        : createResttyTransport(listeners)
      const theme = buildResttyTheme(prefs)
      const font = resolveTerminalFont(prefs, tokenValue('--ds-font-family-code'))
      let restty: Restty
      try {
        restty = new Restty({
          root,
          surface: { shortcuts: true, paneStyles: true, searchUi: true },
          terminal: { renderer: 'auto', fontSize: font.fontSize, fonts: [{ family: font.fontFamily }], theme },
          services: { ptyTransport: transport },
        })
      } catch (error) {
        setPhase('fatal')
        // eslint-disable-next-line no-console
        console.error('[dsh-powerdesk] failed to create restty', error)
        return
      }
      resttyRef.current = restty
      setPhase('connecting')
      try {
        restty.connectPty(url)
      } catch {
        scheduleReconnect()
      }
      // Re-theme on a scheme flip if restty exposes a live setter; otherwise
      // the construction-time theme stands until the tab is reopened.
      const offScheme = subscribeColorScheme(() => {
        const r = resttyRef.current
        if (r === null) return
        applyResttyTheme(r, buildResttyTheme(prefs))
      })
      offSchemeRef.current = offScheme
    }

    // restty's renderer setup must not run in a zero-size container.
    const cancelOpen = openWhenSized(rootRef.current ?? { isConnected: false, clientWidth: 0, clientHeight: 0 } as HTMLElement, mount)

    return () => {
      cancelledRef.current = true
      clearReconnect()
      offSchemeRef.current?.()
      offSchemeRef.current = null
      try {
        resttyRef.current?.destroy()
      } catch {
        // destroy is best-effort on teardown.
      }
      resttyRef.current = null
      cancelOpen()
    }
    // Re-mount when the session, tab, or backend changes (font/theme changes
    // are applied live without a remount where possible).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scope.sessionId, scope.cwd, tabId, prefs.ptyBackend])

  // Live font/theme re-application when prefs change (no remount).
  useEffect(() => {
    const restty = resttyRef.current
    if (restty === null) return
    applyResttyTheme(restty, buildResttyTheme(prefs))
    // restty has no documented live fontFamily/fontSize setter in the public
    // API; a font change takes effect on the next tab open. (Mirrors many
    // terminal renderers.)
  }, [prefs.fontFamily, prefs.fontSize, prefs.themeName])

  const retry = (): void => {
    if (phase === 'deps-fatal') {
      void fetchDeps(backendRef.current).then(() => {
        // The deps fetch updates depsInfo; the user retries again to connect
        // once the repair has run.
      })
      return
    }
    failures.current = 0
    clearReconnect()
    const restty = resttyRef.current
    if (restty === null) return
    setPhase('connecting')
    try {
      restty.connectPty(urlRef.current)
    } catch {
      scheduleReconnect()
    }
  }

  return (
    <div className={css.terminalWrap}>
      <div ref={rootRef} className={css.terminal} aria-label={t('tabTitle')} />
      {phase === 'fatal' && (
        <div className={css.terminalBanner}>
          <div>{fatalMessage !== '' ? fatalMessage : t('terminalConnectFailed')}</div>
          <div className={css.terminalBannerUrl}>{urlRef.current}</div>
          <button type="button" className={css.terminalRetry} onClick={retry}>{t('terminalRetry')}</button>
        </div>
      )}
      {phase === 'deps-fatal' && depsInfo !== null && depsInfo.ok === false && (
        <div className={css.terminalDepsBanner}>
          <div className={css.terminalDepsTitle}>{t('terminalDepsFailed')}</div>
          <div className={css.terminalDepsHint}>
            {t('terminalDepsHint')}
            {depsInfo.profile !== null ? t('terminalDepsProfile', { profile: depsInfo.profile }) : ''}
          </div>
          <div className={css.terminalDepsCommandRow}>
            <pre className={css.terminalRepairCommand}>{depsInfo.command}</pre>
          </div>
          {depsInfo.note !== undefined && <div className={css.terminalDepsNote}>{depsInfo.note}</div>}
          <div className={css.terminalDepsActions}>
            <button type="button" className={css.terminalRetry} onClick={retry}>{t('terminalRetry')}</button>
          </div>
        </div>
      )}
    </div>
  )
}
