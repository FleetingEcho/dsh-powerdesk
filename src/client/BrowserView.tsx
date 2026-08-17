/**
 * The built-in browser tab: an address bar plus a sandboxed iframe.
 *
 * Security model (see browser.ts + the sandbox tokens below): the iframe is
 * ALWAYS sandboxed without `allow-same-origin` (opaque origin — the visited
 * page can never sit on the GUI's origin, read its storage, or reach
 * /powerdesk/api) and without `allow-top-navigation` (a page must not hijack
 * the GUI). The address bar only accepts http(s) and refuses loopback. A
 * temporary sandbox unlock drops the sandbox attribute for fully trusted
 * sites; a persistent warning bar renders while it is off.
 *
 * The back/forward stack only tracks address-bar navigations (in-frame link
 * clicks are cross-origin and invisible — a documented limitation).
 *
 * When a site refuses to be embedded (X-Frame-Options / frame-ancestors),
 * the host's `browser.probe` route detects it and the view shows the reason
 * + open-in-browser instead of the browser's cryptic "refused to connect"
 * blank frame.
 *
 * Adapted from dsh-better-sidebar's BrowserView (BSD-3-Clause).
 */
import { useEffect, useState, type ReactNode } from 'react'
import { api } from './api.ts'
import { embeddabilityOf, normalizeBrowserUrl } from './browser.ts'
import { t } from './locales.ts'
import css from './restty.module.css'

/**
 * The browser iframe sandbox tokens. NO allow-same-origin (opaque origin —
 * no GUI storage/API access), NO allow-top-navigation (a browsed page must
 * not hijack the GUI). allow-forms/allow-popups/allow-downloads/allow-modals
 * keep login flows working; allow-popups-to-escape-sandbox lets OAuth
 * popups open as normal tabs (they are cross-origin to the GUI either way).
 */
export const BROWSER_IFRAME_SANDBOX =
  'allow-scripts allow-forms allow-popups allow-downloads allow-modals allow-popups-to-escape-sandbox'

/** Props for the browser view. */
export interface BrowserViewProps {
  /** The initial URL to load (persisted on the tab's path by the parent). */
  initialUrl?: string
  /** Whether the view is visible (pauses the probe when hidden). */
  visible?: boolean
}

export function BrowserView(props: BrowserViewProps): ReactNode {
  const { initialUrl, visible = true } = props
  // The current address (initialized from the persisted path so a reload
  // restores the visited page).
  const [url, setUrl] = useState<string | undefined>(initialUrl)
  const [input, setInput] = useState<string>(initialUrl ?? '')
  /** Blocked/invalid hint shown under the address bar (null = none). */
  const [message, setMessage] = useState<string | null>(null)
  /** Address-bar navigation history (in-frame clicks are not tracked). */
  const [history, setHistory] = useState<string[]>(initialUrl !== undefined ? [initialUrl] : [])
  const [cursor, setCursor] = useState<number>(initialUrl !== undefined ? 0 : -1)
  /** Bumped on reload to remount the iframe (also remounts on sandbox flip). */
  const [reloadKey, setReloadKey] = useState(0)
  /** TEMPORARY sandbox unlock for THIS surface only (never persists). */
  const [localUnlock, setLocalUnlock] = useState(false)
  const noSandbox = localUnlock
  /** A site that refuses to be embedded (X-Frame-Options / frame-ancestors):
   *  the probe verdict shown instead of the blank iframe. */
  const [embedBlocked, setEmbedBlocked] = useState<string | null>(null)
  /** The user asked to load the refused site anyway (keeps the plain iframe). */
  const [forceEmbed, setForceEmbed] = useState(false)

  // Probe every navigation (address bar, history, restored path): when the
  // target forbids embedding, show the reason + open-in-browser instead of
  // the browser's cryptic "refused to connect" blank frame. A failed probe
  // (unreachable) keeps the plain iframe.
  useEffect(() => {
    if (url === undefined || !visible) return
    let cancelled = false
    setEmbedBlocked(null)
    setForceEmbed(false)
    void api.browserProbe(url).then((probe) => {
      if (!cancelled && embeddabilityOf(probe) === 'blocked') setEmbedBlocked(url)
    }).catch(() => { /* unreachable: keep the plain iframe */ })
    return () => { cancelled = true }
  }, [url, visible])

  const navigateTo = (raw: string): void => {
    const result = normalizeBrowserUrl(raw, window.location.origin)
    if (result.kind === 'ok') {
      const next = result.url
      setUrl(next)
      setInput(next)
      setMessage(null)
      // Push onto the stack, dropping any stale forward entries.
      setHistory((previous) => [...previous.slice(0, cursor + 1), next])
      setCursor((previous) => previous + 1)
      setReloadKey((key) => key + 1)
      return
    }
    setMessage(
      result.kind === 'invalid'
        ? t('browserInvalid')
        : result.reason === 'scheme'
          ? t('browserBlockedScheme')
          : t('browserBlockedLoopback'),
    )
  }

  const goBack = (): void => {
    if (cursor <= 0) return
    const next = history[cursor - 1]
    if (next === undefined) return
    setCursor(cursor - 1)
    setUrl(next)
    setInput(next)
    setReloadKey((key) => key + 1)
  }

  const goForward = (): void => {
    if (cursor >= history.length - 1) return
    const next = history[cursor + 1]
    if (next === undefined) return
    setCursor(cursor + 1)
    setUrl(next)
    setInput(next)
    setReloadKey((key) => key + 1)
  }

  return (
    <div className={css.browser}>
      <div className={css.browserBar}>
        <button
          type="button"
          className={css.iconButton}
          aria-label={t('browserBack')}
          title={t('browserBack')}
          disabled={cursor <= 0}
          onClick={goBack}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button
          type="button"
          className={css.iconButton}
          aria-label={t('browserForward')}
          title={t('browserForward')}
          disabled={cursor >= history.length - 1}
          onClick={goForward}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button
          type="button"
          className={css.iconButton}
          aria-label={t('refresh')}
          title={t('refresh')}
          onClick={() => { setReloadKey((key) => key + 1) }}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M13.5 8a5.5 5.5 0 1 1-1.6-3.9M13.5 2v3h-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <input
          className={css.browserInput}
          value={input}
          placeholder={t('browserPlaceholder')}
          spellCheck={false}
          onChange={(event) => { setInput(event.target.value) }}
          onKeyDown={(event) => {
            if (event.key === 'Enter') navigateTo(input)
          }}
        />
        <button
          type="button"
          className={css.iconButton}
          aria-label={t('browserGo')}
          title={t('browserGo')}
          onClick={() => { navigateTo(input) }}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M6 8h5.5M9 5.5L11.5 8 9 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button
          type="button"
          className={css.iconButton}
          aria-label={t('browserOpenExternal')}
          title={t('browserOpenExternal')}
          disabled={url === undefined}
          onClick={() => {
            if (url !== undefined) window.open(url, '_blank', 'noopener')
          }}
        >
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M6 3H3v10h10v-3M9 3h4v4M13 3L7 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
      {message !== null && <div className={css.browserMessage}>{message}</div>}
      <SandboxStatusBar
        sandboxed={!noSandbox}
        local={localUnlock}
        dangerCopy={t('browserNoSandboxWarning')}
        onUnlock={() => { setLocalUnlock(true) }}
        onRestore={() => { setLocalUnlock(false) }}
      />
      {url === undefined ? (
        <div className={css.browserStart}>{t('browserStart')}</div>
      ) : embedBlocked !== null && !forceEmbed ? (
        <BrowserEmbedBlocked
          url={embedBlocked}
          onOpenInBrowser={() => { window.open(embedBlocked, '_blank', 'noopener') }}
          onLoadAnyway={() => { setForceEmbed(true) }}
        />
      ) : (
        <iframe
          key={`${reloadKey}:${noSandbox ? 'ns' : 'sb'}`}
          className={css.browserFrame}
          src={url}
          sandbox={noSandbox ? undefined : BROWSER_IFRAME_SANDBOX}
          referrerPolicy="no-referrer"
          allow=""
          title={url}
        />
      )}
    </div>
  )
}

/**
 * The embed-refusal panel: shown when the probed site forbids being
 * displayed inside other pages (X-Frame-Options / frame-ancestors) — the
 * iframe would only show the browser's "refused to connect" blank. Explains
 * the reason and offers the real-browser open plus a load-anyway escape.
 * Exported so the copy and the actions are testable without a DOM.
 */
export function BrowserEmbedBlocked(props: {
  url: string
  onOpenInBrowser: () => void
  onLoadAnyway: () => void
}): ReactNode {
  const { url, onOpenInBrowser, onLoadAnyway } = props
  let host = url
  try { host = new URL(url).hostname } catch { /* keep the raw URL */ }
  return (
    <div className={css.browserBlocked}>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M8 2a6 6 0 1 0 0 12 6 6 0 0 0 0-12zM8 5v3M8 10.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      <div className={css.browserBlockedTitle}>{t('browserEmbedBlocked', { host })}</div>
      <div className={css.browserBlockedDesc}>{t('browserEmbedBlockedDesc')}</div>
      <div className={css.browserBlockedActions}>
        <button type="button" className={css.browserBlockedButton} onClick={onOpenInBrowser}>
          {t('browserOpenExternal')}
        </button>
        <button type="button" className={css.browserBlockedButton} onClick={onLoadAnyway}>
          {t('browserEmbedAnyway')}
        </button>
      </div>
    </div>
  )
}

/**
 * The live sandbox status row: a green "sandbox on" state with a one-tap
 * TEMPORARY unlock, or a RED "sandbox off" state with a restore action.
 * The temporary unlock is component state only — it never persists; it
 * lasts until the surface unmounts or the user restores the sandbox.
 */
function SandboxStatusBar(props: {
  sandboxed: boolean
  local: boolean
  dangerCopy: string
  onUnlock: () => void
  onRestore: () => void
}): ReactNode {
  const { sandboxed, local, dangerCopy, onUnlock, onRestore } = props
  if (sandboxed) {
    return (
      <div className={`${css.sandboxStatus} ${css.sandboxStatusOn}`}>
        <span className={css.sandboxDot} />
        <span className={css.sandboxStatusText} title={t('sandboxStatusOn')}>{t('sandboxStatusOn')}</span>
        <button type="button" className={css.sandboxAction} onClick={onUnlock}>
          {t('sandboxUnlock')}
        </button>
      </div>
    )
  }
  return (
    <div className={`${css.sandboxStatus} ${css.sandboxStatusOff}`}>
      <span className={css.sandboxDot} />
      <span className={css.sandboxStatusText} title={dangerCopy}>{dangerCopy}</span>
      {local && (
        <button type="button" className={css.sandboxAction} onClick={onRestore}>
          {t('sandboxRestore')}
        </button>
      )}
    </div>
  )
}
