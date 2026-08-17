/**
 * The standalone floating panel — the surface when dsh-better-sidebar is
 * NOT installed. A small toggle button (bottom-right) opens a fixed panel
 * that mounts EITHER the restty terminal OR the browser (a surface switch in
 * the panel header picks which). The terminal is scoped to the active
 * conversation session (its cwd drives the PTY). Prefs come from localStorage
 * (no better-sidebar store to hold them); the panel reads them on each open.
 *
 * When dsh-better-sidebar IS installed the client half registers sidebar
 * tabs instead (see index.tsx) and does NOT mount this panel, so the two
 * surfaces never coexist.
 */
import { createElement, useEffect, useState, type ComponentType, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import type { Context } from '../context-types.ts'
import { lazyChunkComponent } from './lazy-chunk.tsx'
import type { ResttyTerminalProps } from './ResttyTerminal.tsx'
import { BrowserView } from './BrowserView.tsx'
import { readPrefsFromLocalStorage, type ResttyPrefs } from './prefs.ts'
import { t } from './locales.ts'
import css from './restty.module.css'

/** The lazy terminal component (restty loads on first open). */
const TerminalView = lazyChunkComponent<ResttyTerminalProps>(
  'terminal',
  (mod) => mod.ResttyTerminal as ComponentType<ResttyTerminalProps> | undefined,
)

/** The fixed tab id the standalone panel uses (one terminal per session). */
const STANDALONE_TAB_ID = 'standalone'

/** Which surface the standalone panel is showing. */
type Surface = 'terminal' | 'browser'

interface StandaloneTerminalPanelProps {
  ctx: Context
}

export function StandaloneTerminalPanel({ ctx }: StandaloneTerminalPanelProps): ReactNode {
  const [open, setOpen] = useState(false)
  const [surface, setSurface] = useState<Surface>('terminal')
  const [scope, setScope] = useState<{ sessionId: string; cwd?: string } | null>(() => {
    const list = ctx.sessions.list.getSnapshot()
    const id = list.current
    return id !== undefined ? { sessionId: id, cwd: list.byId[id]?.cwd } : null
  })
  const [prefs, setPrefs] = useState<ResttyPrefs>(() => readPrefsFromLocalStorage())

  // Track the active session (id + cwd) so the terminal opens in the right
  // working directory; the list feed is the client runtime's ISessions.
  useEffect(() => {
    const sync = (): void => {
      const list = ctx.sessions.list.getSnapshot()
      const id = list.current
      setScope(id !== undefined ? { sessionId: id, cwd: list.byId[id]?.cwd } : null)
    }
    sync()
    return ctx.sessions.list.subscribe(sync)
  }, [ctx])

  // Re-read prefs on each open (localStorage edits take effect next open).
  useEffect(() => {
    if (open) setPrefs(readPrefsFromLocalStorage())
  }, [open])

  return createPortal(
    <>{open && (
      <div className={css.standaloneHost}>
        <div className={css.standaloneHeader}>
          <div className={css.standaloneSurfaceSwitch}>
            <button
              type="button"
              className={surface === 'terminal' ? css.standaloneSurfaceActive : css.standaloneSurfaceBtn}
              onClick={() => { setSurface('terminal') }}
            >
              {t('standaloneSurfaceTerminal')}
            </button>
            <button
              type="button"
              className={surface === 'browser' ? css.standaloneSurfaceActive : css.standaloneSurfaceBtn}
              onClick={() => { setSurface('browser') }}
            >
              {t('standaloneSurfaceBrowser')}
            </button>
          </div>
          <button
            type="button"
            className={css.terminalRetry}
            onClick={() => { setOpen(false) }}
            aria-label="close"
          >
            ✕
          </button>
        </div>
        {surface === 'browser'
          ? createElement(BrowserView, { visible: true })
          : scope === null
            ? <div className={css.standaloneNoSession}>{t('standaloneNoSession')}</div>
            : createElement(TerminalView, {
                scope,
                tabId: STANDALONE_TAB_ID,
                prefs,
                visible: true,
              })}
      </div>
    )}
      <button
        type="button"
        className={css.standaloneToggle}
        onClick={() => { setOpen((value) => !value) }}
        aria-label={t('standaloneToggle')}
        title={t('standaloneToggle')}
      >
        ▸ {t('tabTitle')}
      </button>
    </>,
    document.body,
  )
}
