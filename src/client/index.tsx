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
import { createSidebarStore, EXPLORER_TAB_ID, type SidebarStore } from './state.ts'
import { attachLocale, t } from './locales.ts'
import { resetChunks } from './chunk-loader.ts'
import { ExtensionHost } from './extensions.ts'
import { lazyChunkComponent } from './lazy-chunk.tsx'
import { POWERDESK_TAB_ID } from './prefs.ts'
import { useTerminalPrefs } from './useTerminalPrefs.ts'
import type { ResttyTerminalProps } from './ResttyTerminal.tsx'
import type { BrowserViewProps } from './BrowserView.tsx'
import type { CodeEditorProps } from './CodeEditor.tsx'
import type { NotesViewProps } from './NotesView.tsx'
import { SidebarShell } from './SidebarShell.tsx'
import { RenderBoundary } from './RenderBoundary.tsx'
import { SettingsSection } from './SettingsSection.tsx'
import { FileExplorer } from './FileExplorer.tsx'
import css from './sidebar.module.css'

/** The tab id for the browser surface (the SidebarTab.type value). */
export const POWERDESK_BROWSER_TAB_ID = 'dsh-powerdesk:browser'
/** The tab id for the file explorer (the SidebarTab.type value). */
export const POWERDESK_EXPLORER_TAB_ID = EXPLORER_TAB_ID
/** The tab id for the Notes tab (the SidebarTab.type value). */
export const POWERDESK_NOTES_TAB_ID = 'dsh-powerdesk:notes'
/** The tab id for the editor. MUST stay literally 'editor' — service.ts's
 *  `openFile()` hardcodes `type: 'editor'` when it mints a file-open tab. */
const EDITOR_TAB_ID = 'editor'

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

/** The lazy editor component (CodeMirror + language packages load on first file-open). */
const CodeEditorLazy = lazyChunkComponent<CodeEditorProps>(
  'editor',
  (mod) => mod.CodeEditor as ComponentType<CodeEditorProps> | undefined,
)

/** The lazy Notes view (shares the 'editor' chunk — it embeds CodeEditor inline). */
const NotesViewLazy = lazyChunkComponent<NotesViewProps>(
  'editor',
  (mod) => mod.NotesView as ComponentType<NotesViewProps> | undefined,
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

/** A small folder-glyph icon for the explorer tab. */
function IconFolder({ size }: { size: number }): ReactNode {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M1.75 4.25c0-.69.56-1.25 1.25-1.25h3l1.25 1.5h5.75c.69 0 1.25.56 1.25 1.25v6.25c0 .69-.56 1.25-1.25 1.25H3c-.69 0-1.25-.56-1.25-1.25z" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round" />
    </svg>
  )
}

/** A small file-glyph icon for the editor tab. */
function IconFile({ size }: { size: number }): ReactNode {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3.75 1.75h5l3.5 3.5v8.25a.75.75 0 0 1-.75.75h-7.75a.75.75 0 0 1-.75-.75V2.5a.75.75 0 0 1 .75-.75z" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round" />
      <path d="M8.75 1.75V5.5h3.5" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round" />
    </svg>
  )
}

/** A small notebook-glyph icon for the Notes tab. */
function IconNotes({ size }: { size: number }): ReactNode {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="2.25" y="1.75" width="11.5" height="12.5" rx="1.5" stroke="currentColor" strokeWidth="1.25" />
      <path d="M5 5h6M5 8h6M5 11h3.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
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
  const { scope, tab, visible } = props as {
    scope: TabComponentProps['scope']
    tab: SidebarTab
    visible?: boolean
  }
  // Global terminal-appearance prefs (font/weight/size/theme), read reactively
  // from the single `dsh-powerdesk:prefs` localStorage key via useSyncExternalStore
  // — a settings edit in the Powerdesk Side card re-renders this view (and
  // recreates restty for font changes) without a remount.
  const prefs = useTerminalPrefs()
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
 *  powerdeskSidebar service). Terminal appearance (font family/weight/size,
 *  theme) and the PTY backend are owned by the Powerdesk Side card's
 *  TerminalAppearancePanel, not by a per-tab settings popup — powerdesk's own
 *  sidebar shell never rendered the `pluginToggles` rows this descriptor used
 *  to declare, so they were dead. */
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
 * The sidebar explorer tab view: a directory tree over one bookmarked local
 * folder. Not chunked (no heavy dependency, unlike restty/CodeMirror) — it
 * ships in the core client bundle. `expanded`/`onToggleDir`/`onOpenFile` are
 * threaded down from SplitPane.tsx's TabContent.
 */
function ExplorerTabView(props: TabComponentProps): ReactNode {
  const { scope, expanded, onToggleDir, onOpenFile, onOpenFileAtLine } = props as {
    scope: TabComponentProps['scope']
    expanded?: string[]
    onToggleDir?: (path: string) => void
    onOpenFile?: (path: string) => void
    onOpenFileAtLine?: (path: string, line: number) => void
  }
  return createElement(FileExplorer, {
    cwd: scope.cwd,
    expanded: expanded ?? [],
    onToggleDir: onToggleDir ?? ((): void => {}),
    onOpenFile: onOpenFile ?? ((): void => {}),
    onOpenFileAtLine: onOpenFileAtLine ?? ((): void => {}),
  })
}

/**
 * The sidebar editor tab view: mounts the lazy CodeMirror editor over the
 * tab's persisted path. A tab with no path (should not happen — every
 * editor tab is minted by `service.openFile` with a path) renders nothing
 * rather than crashing the pane.
 */
function EditorTabView(props: TabComponentProps): ReactNode {
  const { tab, visible } = props as { tab: SidebarTab; visible?: boolean }
  if (tab.path === undefined) return null
  // Set by `service.openFileAtLine` (Search tab result clicks) — a plain
  // `meta` field, not a new SidebarTab field, so it rides the existing
  // `updateTab({meta})` patch path with no state-tree changes.
  const initialLine = (tab.meta as { line?: number } | undefined)?.line
  return createElement(CodeEditorLazy, { path: tab.path, visible: visible ?? true, initialLine })
}

/** Build the explorer tab descriptor. `single: true` — one explorer tab per
 *  session; opening it again focuses the existing one instead of duplicating. */
function buildExplorerTabDescriptor(): TabDescriptor {
  const descriptor = {
    id: POWERDESK_EXPLORER_TAB_ID,
    title: () => t('explorerTabTitle'),
    icon: (size: number) => createElement(IconFolder, { size }),
    order: 40,
    single: true,
    createTab: () => ({
      tab: {
        id: POWERDESK_EXPLORER_TAB_ID,
        type: POWERDESK_EXPLORER_TAB_ID as TabType,
        title: t('explorerTabTitle'),
      } as SidebarTab,
    }),
    component: (props: TabComponentProps) => createElement(ExplorerTabView, props),
  }
  return descriptor as unknown as TabDescriptor
}

/**
 * Build the editor tab descriptor. `id` MUST stay 'editor' (service.ts's
 * `openFile()` hardcodes `type: 'editor'`); `hidden` keeps it out of the +
 * menu (only file-open mints one); `dedupeKey` on the path means opening
 * the same file twice focuses the existing tab instead of duplicating.
 */
function buildEditorTabDescriptor(): TabDescriptor {
  const descriptor = {
    id: EDITOR_TAB_ID,
    title: () => t('editorTabTitle'),
    icon: (size: number) => createElement(IconFile, { size }),
    hidden: true,
    dedupeKey: (tab: SidebarTab) => tab.path,
    component: (props: TabComponentProps) => createElement(EditorTabView, props),
  }
  return descriptor as unknown as TabDescriptor
}

/** The sidebar Notes tab view: mounts the lazy Notes surface (tree + inline
 *  editor over one bound markdown folder — see NotesView.tsx). */
function NotesTabView(props: TabComponentProps): ReactNode {
  const { visible } = props as { visible?: boolean }
  return createElement(NotesViewLazy, { visible: visible ?? true })
}

/** Build the Notes tab descriptor. `single: true` — one Notes tab per
 *  session; opening it again focuses the existing one instead of duplicating. */
function buildNotesTabDescriptor(): TabDescriptor {
  const descriptor = {
    id: POWERDESK_NOTES_TAB_ID,
    title: () => t('notesTabTitle'),
    icon: (size: number) => createElement(IconNotes, { size }),
    order: 42,
    single: true,
    createTab: () => ({
      tab: {
        id: POWERDESK_NOTES_TAB_ID,
        type: POWERDESK_NOTES_TAB_ID as TabType,
        title: t('notesTabTitle'),
      } as SidebarTab,
    }),
    component: (props: TabComponentProps) => createElement(NotesTabView, props),
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
  ctx.effect(
    () => service.registerTab(buildExplorerTabDescriptor()),
    'dsh-powerdesk: explorer tab',
  )
  ctx.effect(
    () => service.registerTab(buildEditorTabDescriptor()),
    'dsh-powerdesk: editor tab',
  )
  ctx.effect(
    () => service.registerTab(buildNotesTabDescriptor()),
    'dsh-powerdesk: notes tab',
  )

  // User-installed extensions register through the same service as the
  // builtins, but asynchronously: the installed list comes from the host, so
  // the first refresh is kicked off here and its registrations land a moment
  // after mount. A failed fetch is not fatal — the sidebar mounts either way
  // (see ExtensionHost.refresh). The settings card refreshes this same host
  // after an install or a removal.
  const extensionHost = new ExtensionHost(service)
  ctx.effect(() => {
    void extensionHost.refresh()
    return () => { extensionHost.dispose() }
  }, 'dsh-powerdesk: extension tabs')

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
      inject: () => ({ sidebar: ctx.get('powerdeskSidebar'), extensions: extensionHost }),
    }, SettingsSection)),
    'dsh-powerdesk: settings section',
  )
}
