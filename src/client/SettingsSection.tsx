/**
 * The "Powerdesk" Side card in the DSH Settings shell — a discoverable entry
 * for the terminal and the browser surfaces.
 *
 * dsh-powerdesk surfaces as tabs inside dsh-better-sidebar's sidebar panel
 * (or a standalone floating panel when dsh-better-sidebar is absent). The
 * sidebar's own open/toggle cluster lives at the top-right corner and is not
 * obvious, so this settings section gives users a single, findable place to
 * OPEN either surface: the buttons call `sidebar.openTab({ type, ... })`,
 * which opens the sidebar panel (if collapsed) and focuses the matching tab,
 * then the section closes the settings panel.
 *
 * When dsh-better-sidebar is not installed, the section explains the
 * standalone floating-panel fallback (its toggle sits at the bottom-right
 * corner) and recommends dsh-better-sidebar for the integrated tabbed path.
 *
 * The section is registered through `ctx.slots.inject('settings.section', …)`
 * in the client `apply()` (see index.tsx). The shell owns modal visibility and
 * navigation; it passes `close` (SettingsSectionOwnerProps) and our injected
 * `sidebar` face (the optional BetterSidebarService, probed via
 * `ctx.get('betterSidebar')`).
 */
import { useState, type ReactNode } from 'react'
import type { BetterSidebarService } from './service.ts'
import { POWERDESK_TAB_ID } from './prefs.ts'
import { POWERDESK_BROWSER_TAB_ID } from './index.tsx'
import { t } from './locales.ts'

/** The shell-supplied owner props (SettingsSectionOwnerProps: `close`). */
export interface SettingsSectionOwnerProps {
  close: () => void
}

/** The injected face: the optional sidebar registry service. */
export interface SettingsSectionInjected {
  sidebar: BetterSidebarService | undefined
}

/** Full section props: the shell owner share + the injected face. */
export type SettingsSectionProps = SettingsSectionOwnerProps & SettingsSectionInjected

/**
 * Open one powerdesk surface in the sidebar, then close the settings panel.
 * Sets a one-line "opened" hint instead of closing instantly so the user
 * sees confirmation (the sidebar opens behind the settings modal).
 */
function openSurface(sidebar: BetterSidebarService, type: string, close: () => void, setHint: (s: string) => void): void {
  try {
    sidebar.openTab({ type } as { type: string })
    setHint(t('settingsOpenedHint'))
    // Close the settings panel shortly after so the sidebar is revealed.
    window.setTimeout(close, 350)
  } catch (error) {
    setHint(error instanceof Error ? error.message : String(error))
  }
}

/**
 * Render the Powerdesk Side card.
 * @param props - the shell owner share (`close`) + injected `sidebar` face.
 * @returns the section element tree.
 */
export function SettingsSection({ close, sidebar }: SettingsSectionProps): ReactNode {
  const [hint, setHint] = useState<string | null>(null)
  const available = sidebar !== undefined && typeof sidebar.openTab === 'function'
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 14, lineHeight: 1.5 }}>
      <p style={{ margin: 0, color: 'var(--dsh-text-2, inherit)' }}>{t('settingsIntro')}</p>
      {available ? (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => { openSurface(sidebar!, POWERDESK_TAB_ID, close, setHint) }}
            style={buttonStyle}
          >
            {t('settingsOpenTerminal')}
          </button>
          <button
            type="button"
            onClick={() => { openSurface(sidebar!, POWERDESK_BROWSER_TAB_ID, close, setHint) }}
            style={buttonStyle}
          >
            {t('settingsOpenBrowser')}
          </button>
        </div>
      ) : (
        <p style={{ margin: 0, padding: 10, borderRadius: 8, color: 'var(--dsh-text-2, inherit)', background: 'var(--dsh-layer-3, rgba(127,127,127,0.08))' }}>
          {t('settingsSidebarMissing')}
        </p>
      )}
      {hint !== null && (
        <p style={{ margin: 0, color: 'var(--dsh-text-2, inherit)' }}>{hint}</p>
      )}
    </div>
  )
}

/** Shared primary-button style (inline so the section needs no CSS module). */
const buttonStyle: React.CSSProperties = {
  padding: '6px 14px',
  borderRadius: 8,
  border: '1px solid var(--dsh-border, rgba(127,127,127,0.3))',
  background: 'var(--dsh-brand, #2563eb)',
  color: 'var(--dsh-on-brand, #fff)',
  cursor: 'pointer',
  fontSize: 14,
}
