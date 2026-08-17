/**
 * The powerdesk sidebar shell — the LAYOUT + WRAPPER only, copied from
 * dsh-better-sidebar's `Sidebar` (the panel/toggle/resize chrome) and
 * `split-pane` (a single-pane leaf), stripped of every feature the powerdesk
 * plugin does not ship: the bottom panel, multi-pane splits, drag-to-edge,
 * the explorer / git / subagent / jobs / editor / diff views, the
 * agent-terminals WebSocket, subagent/job auto-activation, and the cwd /
 * session-list wiring those views need.
 *
 * What remains is the discoverable entry the user asked for: a collapsible
 * right panel (width dragged on its left edge, persisted) with a tab strip
 * (the + menu offers the registered tab types) and a content area that
 * keeps every open tab MOUNTED (inactive ones hidden) so switching never
 * tears down a terminal's connection/scrollback. The tab registry contract
 * (`PowerdeskSidebarService`) is unchanged, so powerdesk's existing
 * terminal/browser tab descriptors register through the same path.
 *
 * Single pane by design: powerdesk ships exactly two surfaces (terminal +
 * browser). The split-tree engine from `state.ts` is still linked (the
 * service's `openTab` reads `bottomSplits`/`bottomOpen` as inert fields),
 * but this shell renders only the root leaf of `state.splits` — splits are
 * never created because the drag-to-edge gesture that mints them lives in
 * `split-pane.tsx`, which this shell does not use.
 */
import { createElement, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { useSyncExternalStore } from 'react'
import clsx from 'clsx'
import { IconCloseFill14, Tooltip } from '@deepseek-ai/dsh-client-ui-primitives'
import type { Context } from '../context-types.ts'
import {
  PANEL_MAX,
  PANEL_MIN,
  allLeaves,
  type SidebarState,
  type SidebarStore,
  type SidebarTab,
} from './state.ts'
import type { PowerdeskSidebarService, TabComponentProps, TabDescriptor } from './service.ts'
import { togglePanel, setWidth, closeTab, activateTab } from './state.ts'
import { TabBar, type NewTabOption, type TabDragPayload } from './TabBar.tsx'
import { IconPanelRightOutline16 } from './icons.tsx'
import { RenderBoundary } from './RenderBoundary.tsx'
import { t } from './locales.ts'
import css from './sidebar.module.css'

/** Clamp a dragged width to the panel's min/max (mirrors the reference shell). */
function clampWidth(width: number): number {
  return Math.max(PANEL_MIN, Math.min(PANEL_MAX, width))
}

/** The single root pane id — read from the root leaf at render time (the
 *  store mints a unique `uid('pane')` id, so a hardcoded constant would miss
 *  and closeTab/activateTab would no-op). */
function rootPaneIdOf(state: SidebarState): string {
  const root = state.splits.kind === 'leaf' ? state.splits : state.splits.children[0]
  return root?.id ?? 'root'
}

/**
 * Render one tab's content via its registered descriptor. Every open tab
 * stays mounted (inactive ones hidden by the parent) so a terminal keeps its
 * pty connection and scrollback across tab switches; the unmount happens
 * only when a tab is truly closed. `visible` forwards the panel's open +
 * active state so a live view can pause work it cannot show.
 */
function TabContent(props: {
  tab: SidebarTab
  descriptor: TabDescriptor
  ctx: Context
  store: SidebarStore
  cwd: string | undefined
  visible: boolean
}): ReactNode {
  const { tab, descriptor, ctx, store, cwd, visible } = props
  return (
    <RenderBoundary className={css.tabBoundaryError}>
      {createElement(descriptor.component, {
        ctx,
        store,
        // Forward the session's cwd so the terminal's reconnect effect
        // (restty) re-runs when the conversation's working dir changes; the
        // reference shell threads the same `summaryCwd` here.
        scope: { sessionId: store.getSnapshot().sessionId, ...(cwd !== undefined ? { cwd } : {}) },
        tab,
        visible,
      } as TabComponentProps)}
    </RenderBoundary>
  )
}

/** The powerdesk sidebar shell. */
export function SidebarShell(props: { ctx: Context; store: SidebarStore; service: PowerdeskSidebarService }): ReactNode {
  const { ctx, store, service } = props

  // The active session: subscribe to the runtime's session list feed so the
  // store's per-session sidebar state tracks the conversation on screen
  // (each session keeps its own open tabs / width / panel state). Mirrors
  // the reference shell's session wiring, minus the cwd/subagent list uses.
  const sessionList = useSyncExternalStore(
    useCallback((cb: () => void) => ctx.sessions.list.subscribe(cb), [ctx]),
    useCallback(() => ctx.sessions.list.getSnapshot(), [ctx]),
  )
  const current = sessionList.current
  useEffect(() => { store.setSession(current) }, [current, store])
  // The active session's cwd (from the runtime list feed) — threaded to the
  // terminal tab so its reconnect effect re-runs when the conversation's
  // working dir changes. Undefined when no session is active or the feed
  // hasn't reported a cwd yet.
  const cwd = current === undefined ? undefined : sessionList.byId[current]?.cwd

  // Subscribe to the store so the shell re-renders on every state change
  // (open/close, width drag, tab open/close/activate, descriptor registry
  // churn via the service's listener bridge). The snapshot carries the
  // per-session SidebarState (undefined before a session is selected).
  const snapshot = useSyncExternalStore(
    useCallback((cb: () => void) => store.subscribe(cb), [store]),
    useCallback(() => store.getSnapshot(), [store]),
  )
  const state = snapshot.state

  // The descriptor registry is read through the service; re-render when it
  // changes (a tab type registered/unregistered after mount).
  const [, forceUpdate] = useState(0)
  useEffect(() => service.subscribe(() => forceUpdate(n => n + 1)), [service])

  // Persist the panel open/closed + width to the body attribute the CSS pairs
  // with (the toggle cluster's pinned position and the panel's slide rely on
  // it), and clear it on unmount. Treats "no session" as collapsed.
  const collapsed = state === undefined || !state.panelOpen
  useEffect(() => {
    if (collapsed) document.body.setAttribute('data-dsh-sidebar-collapsed', '')
    else document.body.removeAttribute('data-dsh-sidebar-collapsed')
    return () => { document.body.removeAttribute('data-dsh-sidebar-collapsed') }
  }, [collapsed])

  // The single pane: the first leaf of state.splits. The shell never splits,
  // so the root is always a leaf; `allLeaves` drills to the first leaf if the
  // tree were somehow a split (defensive — should not happen without the
  // drag gesture). Guarded: state is undefined before a session is active.
  const rootLeaf = state === undefined ? undefined : allLeaves(state.splits)[0]
  const paneTabs: SidebarTab[] = rootLeaf?.tabs ?? []
  const activeTabId = rootLeaf?.active ?? paneTabs[paneTabs.length - 1]?.id ?? null
  const activeTab = paneTabs.find(tab => tab.id === activeTabId) ?? null
  const rootPaneId = state === undefined ? 'root' : rootPaneIdOf(state)

  // The + menu: one option per registered (enabled) tab descriptor, in
  // `order` ascending. The descriptor's `available` gates the disabled state
  // (e.g. a terminal at capacity); `title` may be a function (i18n). Only
  // built when a session is active (the panel does not render otherwise).
  const newTabOptions: NewTabOption[] = useMemo(() => {
    if (state === undefined) return []
    // state is defined iff a session is active (the store sets state=undefined
    // when no session is selected), so sessionId is non-undefined here.
    const scope = { sessionId: snapshot.sessionId! }
    return service.getTabs()
      .filter(descriptor => service.isTabEnabled(descriptor.id))
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .map(descriptor => ({
        id: descriptor.id,
        label: typeof descriptor.title === 'function' ? descriptor.title() : descriptor.title,
        disabled: descriptor.available?.(ctx, scope, state) === false,
        icon: typeof descriptor.icon === 'function' ? descriptor.icon(16) : descriptor.icon,
      }))
  }, [service, state, ctx, snapshot.sessionId])

  const onNewTab = useCallback((typeId: string): void => {
    service.openTab({ type: typeId })
  }, [service])

  // The width drag: pointer-capture on the left edge, translating the cursor
  // delta into a width change (drag right-to-left widens, matching the
  // reference shell's `startX - event.clientX`).
  const widthDrag = useRef({ startX: 0, startWidth: 0 })
  const [draggingWidth, setDraggingWidth] = useState(false)

  // The descriptor lookup for rendering a tab's content + its + menu icon.
  const descriptorOf = useCallback((tab: SidebarTab): TabDescriptor | undefined => {
    return service.getTab(tab.type)
  }, [service])
  const tabIconOf = useCallback((tab: SidebarTab): ReactNode => {
    const icon = descriptorOf(tab)?.icon
    return typeof icon === 'function' ? icon(16) : (icon ?? null)
  }, [descriptorOf])

  return (
    <>
      {/* The persistent toggle at the top-right corner: one tap opens or
          collapses the panel. Always pinned (the CSS reserves its space in
          the tab strip's right end), so the entry stays findable even when
          the panel is closed — the user's "no sidebar entry" complaint. */}
      <div className={css.toggleCluster}>
        <Tooltip label={state === undefined || state.panelOpen ? t('collapse') : t('expand')} side="bottom" delayMs={500}>
          <button
            type="button"
            className={css.toggleButton}
            aria-label={state === undefined || state.panelOpen ? t('collapse') : t('expand')}
            onClick={() => { store.reduce(togglePanel) }}
          >
            <IconPanelRightOutline16 />
          </button>
        </Tooltip>
      </div>

      {/* The right panel: stays mounted while collapsed (hidden off-screen)
          so the slide in/out animates; visibility hides it after the slide.
          Not rendered until a session is active (the store has no state to
          show before then); the toggle above stays clickable regardless. */}
      {state !== undefined && (
      <div
        className={clsx(css.panel, !state.panelOpen && css.panelHidden)}
        style={{ width: Math.min(state.width, typeof window !== 'undefined' ? window.innerWidth : state.width) }}
        data-dragging={draggingWidth || undefined}
      >
        <div
          className={clsx(css.panelResize, draggingWidth && css.panelResizeActive)}
          onPointerDown={(event) => {
            event.preventDefault()
            event.currentTarget.setPointerCapture(event.pointerId)
            widthDrag.current = { startX: event.clientX, startWidth: state.width }
            setDraggingWidth(true)
          }}
          onPointerMove={(event) => {
            if (!event.currentTarget.hasPointerCapture(event.pointerId)) return
            const { startX, startWidth } = widthDrag.current
            const width = clampWidth(startWidth + (startX - event.clientX))
            store.reduce(s => setWidth(s, width))
          }}
          onPointerUp={(event) => {
            if (!event.currentTarget.hasPointerCapture(event.pointerId)) return
            event.currentTarget.releasePointerCapture(event.pointerId)
            const { startX, startWidth } = widthDrag.current
            store.reduce(s => setWidth(s, clampWidth(startWidth + (startX - event.clientX))))
            setDraggingWidth(false)
          }}
        />
        <div className={css.panelBody}>
          <TabBar
            paneId={rootPaneId}
            tabs={paneTabs}
            active={activeTabId}
            onActivate={(tabId) => { store.reduce(s => activateTab(s, rootPaneIdOf(s), tabId)) }}
            onClose={(tabId) => { store.reduce(s => closeTab(s, rootPaneIdOf(s), tabId)) }}
            onNewTab={onNewTab}
            newTabOptions={newTabOptions}
            getTabIcon={tabIconOf}
            /* No drag-to-split in this shell: a drop onto the strip just
               re-activates the dragged tab (a no-op merge into the only pane). */
            onDropTab={(payload: TabDragPayload) => {
              store.reduce(s => activateTab(s, rootPaneIdOf(s), payload.tabId))
            }}
          />
          {paneTabs.length > 0 ? (
            /* Every tab stays MOUNTED (inactive ones hidden), so switching
               never tears down the content: a terminal keeps its pty
               connection and scrollback. The unmount happens only when a
               tab is truly closed. */
            <div className={css.paneContent}>
              {paneTabs.map(tab => (
                <div
                  key={tab.id}
                  className={clsx(css.paneTab, tab.id !== activeTab?.id && css.paneTabHidden)}
                >
                  {descriptorOf(tab) !== undefined && (
                    <TabContent
                      tab={tab}
                      descriptor={descriptorOf(tab)!}
                      ctx={ctx}
                      store={store}
                      cwd={cwd}
                      visible={state.panelOpen && tab.id === activeTab?.id}
                    />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className={css.paneEmptyCards}>
              {newTabOptions.map(option => (
                <button
                  key={option.id}
                  type="button"
                  className={css.paneCard}
                  disabled={option.disabled === true}
                  title={option.label}
                  onClick={() => { onNewTab(option.id) }}
                >
                  {option.icon ?? null}
                  <span>{option.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      )}
    </>
  )
}
