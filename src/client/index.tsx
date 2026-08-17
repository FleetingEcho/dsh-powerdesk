/**
 * Client half of dsh-powerdesk: attaches the DSH i18n system, resets the
 * lazy-chunk cache for a clean activation (HMR-safe), and surfaces the
 * terminal and the browser as "Terminal" and "Browser" tabs inside the
 * plugin's OWN sidebar shell.
 *
 * Powerdesk is self-contained: it owns its sidebar (the layout + wrapper
 * copied from dsh-better-sidebar — `SidebarShell`, `state.ts`, `service.ts`,
 * `TabBar`, the panel/tab CSS — stripped of the explorer / git / subagent /
 * editor / diff views and the host routes those need). It publishes a
 * `powerdeskSidebar` service (the tab registry) via `ctx.provide` and mounts
 * the shell in a portal, so the sidebar entry is always present without
 * depending on the `dsh-better-sidebar` plugin being installed. The two
 * powerdesk surfaces (a restty terminal + a sandboxed browser) register as
 * tabs through that same service.
 *
 * Requires the runtime's slots, sessions, and locale services. The bundle
 * is a module-table consumer only (react + ui-slots + ui-primitives + the
 * runtime/client shell, all provided or inlined); restty itself lives in a
 * lazy chunk fetched on first terminal-open.
 */
import { createElement, type ComponentType, type ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import type { Context } from '../context-types.ts'
import type {
  PowerdeskSidebarService,
  TabComponentProps,
  TabDescriptor,
  TabType,
} from './service.ts'
import type { SidebarTab } from './service.ts'
import { createPowerdeskSidebarService } from './service.ts'
import { createSidebarStore, type SidebarStore } from './state.ts'
import { attachLocale, t } from './locales.ts'
import { resetChunks } from './chunk-loader.ts'
import { lazyChunkComponent } from './lazy-chunk.tsx'
import {
  POWERDESK_TAB_ID,
  TERMINAL_FONT_SIZE_MAX,
  TERMINAL_FONT_SIZE_MIN,
  readPrefsFromStore,
} from './prefs.ts'
import type { ResttyTerminalProps } from './ResttyTerminal.tsx'
import type { BrowserViewProps } from './BrowserView.tsx'
import { SidebarShell } from './SidebarShell.tsx'
import { RenderBoundary } from './RenderBoundary.tsx'
import { SettingsSection } from './SettingsSection.tsx'
import css from './sidebar.module.css'

/** The tab id for the browser surface (the SidebarTab.type value). */
export const POWERDESK_BROWSER_TAB_ID = 'dsh-powerdesk:browser'

/** Services required before mounting (provided by the DSH client runtime). */
export const inject = ['slots', 'sessions', 'locale']

/** The lazy terminal component (restty loads on first open). */
const TerminalView = lazyChunkComponent<ResttyTerminalProps>(
  'terminal',
  (mod) => mod.ResttyTerminal as ComponentType<ResttyTerminalProps> | undefined,
)

/** The lazy browser component (BrowserView + URL policy load on first open). */
const BrowserViewLazy = lazyChunkComponent<BrowserViewProps>(
  'browser',
  (mod) => mod.BrowserView as ComponentType<BrowserViewProps> | undefined,
)

/** Module-level monotonic counters for tab ids (one source of truth across
 *  reactivations; ids stay unique without state plumbing). */
let nextResttyId = 1
let nextBrowserId = 1

/** A small terminal-glyph icon (no ui-primitives dependency). */
function IconTerminal({ size }: { size: number }): ReactNode {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="1.25" y="2.25" width="13.5" height="11.5" rx="1.75" stroke="currentColor" strokeWidth="1.25" />
      <path d="M4 6l2.2 1.9L4 9.8" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 10h3.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  )
}

/** A small globe-glyph icon for the browser tab. */
function IconGlobe({ size }: { size: number }): ReactNode {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="6.25" stroke="currentColor" strokeWidth="1.25" />
      <path d="M1.75 8h12.5M8 1.75c1.6 1.5 2.5 3.7 2.5 6.25s-.9 4.75-2.5 6.25M8 1.75c-1.6 1.5-2.5 3.7-2.5 6.25s.9 4.75 2.5 6.25" stroke="currentColor" strokeWidth="1.25" fill="none" />
    </svg>
  )
}

/**
 * The sidebar tab view: reads the user's restty prefs from the sidebar
 * store synchronously (no hooks — the Sidebar re-renders the descriptor on a
 * store change, so a settings edit takes effect on the next render) and
 * mounts the lazy restty terminal. `visible` is forwarded so the parent can
 * pause rendering without a remount.
 */
function ResttyTabView(props: TabComponentProps): ReactNode {
  const { store, scope, tab, visible } = props as {
    store: TabComponentProps['store']
    scope: TabComponentProps['scope']
    tab: SidebarTab
    visible?: boolean
  }
  const prefs = readPrefsFromStore(store)
  return createElement(TerminalView, {
    scope,
    tabId: tab.id,
    prefs,
    visible: visible ?? true,
  })
}

/**
 * The sidebar browser tab view: mounts the BrowserView, seeded with the tab's
 * persisted path (the visited URL) so a reload restores the page. `visible`
 * pauses the embeddability probe.
 */
function BrowserTabView(props: TabComponentProps): ReactNode {
  const { tab, visible } = props as {
    tab: SidebarTab
    visible?: boolean
  }
  return createElement(BrowserViewLazy, {
    initialUrl: tab.path,
    visible: visible ?? true,
  } satisfies BrowserViewProps)
}

/** Build the terminal tab descriptor (registered into powerdesk's own
 *  powerdeskSidebar service). */
function buildResttyTabDescriptor(): TabDescriptor {
  const descriptor = {
    id: POWERDESK_TAB_ID,
    title: () => t('tabTitle'),
    icon: (size: number) => createElement(IconTerminal, { size }),
    order: 45,
    createTab: () => {
      const n = nextResttyId
      nextResttyId += 1
      return {
        tab: {
          id: `restty:${String(n)}`,
          type: POWERDESK_TAB_ID as TabType,
          title: `${t('terminal')} ${String(n)}`,
        } as SidebarTab,
      }
    },
    settings: {
      label: () => t('tabTitle'),
      pluginToggles: [
        { key: 'fontFamily', type: 'text' as const, title: () => t('settingsFontFamilyTitle'), desc: () => t('settingsFontFamilyDesc'), placeholder: () => t('settingsFontFamilyPlaceholder') },
        { key: 'fontSize', type: 'number' as const, title: () => t('settingsFontSizeTitle'), desc: () => t('settingsFontSizeDesc'), min: TERMINAL_FONT_SIZE_MIN, max: TERMINAL_FONT_SIZE_MAX, unit: 'px' },
        { key: 'ptyBackend', type: 'text' as const, title: () => t('settingsBackendTitle'), desc: () => t('settingsBackendDesc'), placeholder: 'own' },
        { key: 'themeName', type: 'text' as const, title: () => t('settingsThemeTitle'), desc: () => t('settingsThemeDesc') },
      ],
    },
    component: (props: TabComponentProps) => createElement(ResttyTabView, props),
  }
  return descriptor as unknown as TabDescriptor
}

/** Build the browser tab descriptor (registered into powerdesk's own
 *  powerdeskSidebar service). The browser tab uses a `urlTarget` claim so
 *  external http links clicked in the chat can be intercepted into the
 *  sidebar. */
function buildBrowserTabDescriptor(): TabDescriptor {
  const descriptor = {
    id: POWERDESK_BROWSER_TAB_ID,
    title: () => t('browserTabTitle'),
    icon: (size: number) => createElement(IconGlobe, { size }),
    order: 50,
    createTab: () => {
      const n = nextBrowserId
      nextBrowserId += 1
      return {
        tab: {
          id: `restty-browser:${String(n)}`,
          type: POWERDESK_BROWSER_TAB_ID as TabType,
          title: t('browser'),
        } as SidebarTab,
      }
    },
    // Claim http (not https) external-link clicks — most HTTPS sites refuse
    // to be embedded (X-Frame-Options), so the system browser is the smoother
    // default there; HTTP sites (dev servers, docs) embed well.
    urlTarget: (url: URL) => url.protocol === 'http:',
    component: (props: TabComponentProps) => createElement(BrowserTabView, props),
  }
  return descriptor as unknown as TabDescriptor
}

/**
 * Mount the powerdesk sidebar shell to <body> in a portal; returns the
 * disposer. The shell is the layout + wrapper (panel / tab bar / content)
 * copied from dsh-better-sidebar; the terminal + browser register as tabs
 * through the provided `powerdeskSidebar` service.
 */
function mountSidebarShell(ctx: Context, store: SidebarStore, service: PowerdeskSidebarService): () => void {
  if (typeof document === 'undefined') return () => {}
  const host = document.createElement('div')
  host.dataset.dshPlugin = 'dsh-powerdesk'
  host.dataset.dshSidebar = ''
  document.body.appendChild(host)
  const root: Root = createRoot(host)
  root.render(createElement(RenderBoundary, { className: css.boundaryError }, createElement(SidebarShell, { ctx, store, service })))
  return () => {
    root.unmount()
    host.remove()
  }
}

/**
 * Client plugin body.
 * @param ctx - the client cordis context (slots, sessions, locale).
 */
export function apply(ctx: Context): void {
  // The terminal follows the DSH i18n system: attach the locale service so
  // the module-level t() resolves the Host-backed language preference (and
  // switches live), and register the plugin's dictionaries.
  const offLocale = attachLocale(ctx.locale)
  ctx.effect(() => offLocale, 'dsh-powerdesk: locale')

  // HMR-safe: drop the in-memory chunk cache so a hot-reloaded core bundle
  // re-fetches and re-executes the current chunk script on the next open.
  resetChunks()

  // Powerdesk owns its sidebar: create the per-session store + the tab
  // registry service, PUBLISH the service so the settings section (and any
  // other plugin) can read it via ctx.get('powerdeskSidebar'), and mount the
  // shell. The terminal + browser register as tabs through this same
  // service. No dependency on the dsh-better-sidebar plugin.
  const sidebarStore = createSidebarStore()
  const service = createPowerdeskSidebarService(sidebarStore)
  ctx.provide('powerdeskSidebar', service)

  ctx.effect(
    () => mountSidebarShell(ctx, sidebarStore, service),
    'dsh-powerdesk: sidebar shell mount',
  )

  ctx.effect(
    () => service.registerTab(buildResttyTabDescriptor()),
    'dsh-powerdesk: terminal tab',
  )
  ctx.effect(
    () => service.registerTab(buildBrowserTabDescriptor()),
    'dsh-powerdesk: browser tab',
  )

  // Register a "Powerdesk" Side card in the DSH Settings shell so the
  // terminal and browser have a discoverable entry. The sidebar's own
  // toggle cluster sits at the top-right corner; this section gives the
  // user a findable place to OPEN either surface. `slots.inject` waits for
  // the settings shell to declare the `settings.section` slot, then
  // registers our section component; the injected `sidebar` face is re-probed
  // via ctx.get('powerdeskSidebar') at render time (powerdesk provides it, so
  // it is always present).
  ctx.effect(
    () => ctx.slots.inject('settings.section', () => ctx.slots.register({
      name: 'settings.section',
      id: 'dsh-powerdesk',
      order: 100,
      label: () => t('settingsNav'),
      inject: () => ({ sidebar: ctx.get('powerdeskSidebar') }),
    }, SettingsSection)),
    'dsh-powerdesk: settings section',
  )
}
