/**
 * The "Powerdesk" Side card in the DSH Settings shell: one card per
 * registered tab type (Terminal / Browser / Explorer / Editor), matching
 * dsh-better-sidebar's own settings page style — icon, title, the raw type
 * id as a subtitle, and a checkmark toggle to enable/disable it (an absent
 * key means enabled; toggling off hides the type from the + menu and makes
 * `openTab` a no-op for it — see service.ts's `isTabEnabled`/`setTabEnabled`).
 * Clicking the card body (not the toggle) opens that surface in the sidebar.
 *
 * The section is registered through `ctx.slots.inject('settings.section', …)`
 * in the client `apply()` (see index.tsx). The shell owns modal visibility and
 * navigation; it passes `close` (SettingsSectionOwnerProps) and our injected
 * `sidebar` face (the optional PowerdeskSidebarService, probed via
 * `ctx.get('powerdeskSidebar')`).
 */
import { useEffect, useState, type ComponentType, type ReactNode } from 'react'
import clsx from 'clsx'
import type { PowerdeskSidebarService, TabDescriptor } from './service.ts'
import type { ExtensionHost } from './extensions.ts'
import { ExtensionsPanel } from './ExtensionsPanel.tsx'
import { lazyChunkComponent } from './lazy-chunk.tsx'
import { t } from './locales.ts'
import css from './sidebar.module.css'

/** The lazy terminal-appearance panel: `@radix-ui/react-select` (and the
 *  popper/floating-ui/dismissable-layer/focus-scope/portal stack it drags
 *  in) loads only when the user actually opens Settings, not at plugin
 *  startup — see chunks/settings.tsx. */
const TerminalAppearancePanelLazy = lazyChunkComponent<object>(
  'settings',
  (mod) => mod.TerminalAppearancePanel as ComponentType<object> | undefined,
)

/** The shell-supplied owner props (SettingsSectionOwnerProps: `close`). */
export interface SettingsSectionOwnerProps {
  close: () => void
}

/** The injected face: the optional sidebar registry service, plus the
 *  extension host whose tab registrations the Extensions block drives. */
export interface SettingsSectionInjected {
  sidebar: PowerdeskSidebarService | undefined
  extensions?: ExtensionHost | undefined
}

/** Full section props: the shell owner share + the injected face. */
export type SettingsSectionProps = SettingsSectionOwnerProps & SettingsSectionInjected

/** A small checkmark glyph for the enabled-toggle badge. */
function IconCheck({ size }: { size: number }): ReactNode {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M2.5 6.25 5 8.75 9.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/** Strip the `dsh-powerdesk:` namespace prefix for a short subtitle
 *  (`dsh-powerdesk:explorer` -> `explorer`; `editor` stays `editor`). */
function shortId(id: string): string {
  const idx = id.indexOf(':')
  return idx >= 0 ? id.slice(idx + 1) : id
}

/**
 * Open one powerdesk surface in the sidebar, then close the settings panel.
 * Sets a one-line "opened" hint instead of closing instantly so the user
 * sees confirmation (the sidebar opens behind the settings modal).
 */
function openSurface(sidebar: PowerdeskSidebarService, type: string, close: () => void, setHint: (s: string) => void): void {
  try {
    sidebar.openTab({ type } as { type: string })
    setHint(t('settingsOpenedHint'))
    // Close the settings panel shortly after so the sidebar is revealed.
    window.setTimeout(close, 350)
  } catch (error) {
    setHint(error instanceof Error ? error.message : String(error))
  }
}

/** One tab-type card: icon, title, subtitle id, and the enable toggle. */
function TabCard(props: {
  descriptor: TabDescriptor
  sidebar: PowerdeskSidebarService
  close: () => void
  setHint: (s: string) => void
}): ReactNode {
  const { descriptor, sidebar, close, setHint } = props
  const enabled = sidebar.isTabEnabled(descriptor.id)
  const icon = typeof descriptor.icon === 'function' ? descriptor.icon(20) : descriptor.icon
  const title = typeof descriptor.title === 'function' ? descriptor.title() : descriptor.title
  return (
    <div
      className={css.settingsCard}
      onClick={() => { openSurface(sidebar, descriptor.id, close, setHint) }}
    >
      <span className={css.settingsCardIcon}>{icon}</span>
      <span className={css.settingsCardTitle}>{title}</span>
      <span className={css.settingsCardSubtitle}>{shortId(descriptor.id)}</span>
      <button
        type="button"
        className={clsx(css.settingsCardToggle, enabled && css.settingsCardToggleOn)}
        aria-label={enabled ? t('settingsDisableTab') : t('settingsEnableTab')}
        onClick={(event) => {
          event.stopPropagation()
          sidebar.setTabEnabled(descriptor.id, !enabled)
        }}
      >
        <IconCheck size={12} />
      </button>
    </div>
  )
}

/**
 * Render the Powerdesk Side card.
 * @param props - the shell owner share (`close`) + injected `sidebar` face.
 * @returns the section element tree.
 */
export function SettingsSection({ close, sidebar, extensions }: SettingsSectionProps): ReactNode {
  const [hint, setHint] = useState<string | null>(null)
  // Re-render on tab (de)registration or an enable-toggle (both call
  // service.subscribe's notify()) so the grid and the toggle states stay live.
  const [, forceUpdate] = useState(0)
  useEffect(() => sidebar?.subscribe(() => { forceUpdate(n => n + 1) }), [sidebar])

  const available = sidebar !== undefined && typeof sidebar.openTab === 'function'
  return (
    <div>
      <p className={css.settingsIntro}>{t('settingsIntro')}</p>
      {available ? (
        <div className={css.settingsGrid}>
          {sidebar.getTabs().map(descriptor => (
            <TabCard key={descriptor.id} descriptor={descriptor} sidebar={sidebar} close={close} setHint={setHint} />
          ))}
        </div>
      ) : (
        <p className={css.settingsMissing}>{t('settingsSidebarMissing')}</p>
      )}
      {hint !== null && <p className={css.settingsHint}>{hint}</p>}
      {/* Terminal appearance (font family/weight/size/theme + PTY backend).
          Lives here, not on the terminal page, so every terminal shares one
          appearance and the tab surface stays focused on output. */}
      <TerminalAppearancePanelLazy />
      {/* Extension tabs appear in the grid above like any other tab type
          (with the same enable/disable switch); this block is only about
          getting them onto disk and back off again. */}
      <ExtensionsPanel extensions={extensions} />
    </div>
  )
}
