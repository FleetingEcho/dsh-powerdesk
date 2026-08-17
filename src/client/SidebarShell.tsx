/**
 * The powerdesk sidebar shell — the LAYOUT + WRAPPER, copied from
 * dsh-better-sidebar's `Sidebar` (the panel/toggle/resize chrome), stripped
 * of every feature the powerdesk plugin does not ship: the bottom panel, the
 * explorer / git / subagent / jobs / editor / diff views, the agent-terminals
 * WebSocket, subagent/job auto-activation, and the cwd / session-list wiring
 * those views need.
 *
 * What remains is the discoverable entry the user asked for: a collapsible
 * right panel (width dragged on its left edge, persisted) with a workbench
 * that keeps every open tab MOUNTED (inactive ones hidden) so switching never
 * tears down a terminal's connection/scrollback. The tab registry contract
 * (`PowerdeskSidebarService`) is unchanged, so powerdesk's existing
 * terminal/browser tab descriptors register through the same path.
 *
 * The panel DOCKS instead of floating over the app: it still renders via
 * `position: fixed` (a body-level portal — see mountSidebarShell in
 * index.tsx), but while open it reserves its width as a right margin on the
 * host SPA's `#root`, so the host's own layout reflows to make room instead
 * of the panel overlaying the host's content.
 *
 * The workbench itself (recursive split tree, drag-to-edge splitting, resize
 * dividers) lives in `SplitPane.tsx`, reusing the split-tree engine already
 * in `state.ts` (`splitPane` / `moveTabToEdge` / `resizeSplitIn`, copied
 * whole from dsh-better-sidebar) — this shell owns only the outer panel
 * chrome (toggle, width drag, docking) and renders `state.splits` through it.
 */
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { useSyncExternalStore } from 'react'
import clsx from 'clsx'
import { Tooltip } from '@deepseek-ai/dsh-client-ui-primitives'
import type { Context } from '../context-types.ts'
import type { SidebarStore } from './state.ts'
import type { PowerdeskSidebarService } from './service.ts'
import { togglePanel, setWidth, toggleBottomPanel, setBottomHeight } from './state.ts'
import type { NewTabOption } from './TabBar.tsx'
import { SplitTree } from './SplitPane.tsx'
import { IconPanelRightOutline16, IconPanelBottomOutline16 } from './icons.tsx'
import { t } from './locales.ts'
import css from './sidebar.module.css'

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

  // The width drag: pointer-capture on the left edge, translating the cursor
  // delta into a width change (drag right-to-left widens, matching the
  // reference shell's `startX - event.clientX`). Declared here (ahead of the
  // push effect below, which reads `draggingWidth`) rather than down by the
  // JSX that uses the pointer handlers.
  const widthDrag = useRef({ startX: 0, startWidth: 0 })
  const [draggingWidth, setDraggingWidth] = useState(false)

  // The bottom panel's height drag: pointer-capture on the top edge,
  // mirroring the width drag (drag up increases height, so `startY - clientY`).
  const heightDrag = useRef({ startY: 0, startHeight: 0 })
  const [draggingHeight, setDraggingHeight] = useState(false)
  const bottomOpen = state?.bottomOpen === true

  // The persistent toggle cluster's vertical position: it must always sit in
  // a real TOP TOOLBAR band, never drift into pane content. Its natural home
  // is inside the right panel's OWN tab strip (when panelOpen) — the panel's
  // opaque surface already covers the host header there, so `top: 3` (the
  // strip's own button inset) is exactly right and collision-free. When the
  // right panel is CLOSED, the cluster instead floats over the host's own
  // header, which owns "Session log" in that same corner — so it needs a
  // bigger offset to clear it. But if the BOTTOM panel is open and tall
  // enough that its own top edge intrudes above that offset, a fixed offset
  // would land the cluster INSIDE the bottom panel's pane content instead of
  // any toolbar at all (reported: the icons appearing next to "Start a new
  // page") — so clamp to sit just above the bottom panel's own tab strip in
  // that case. `titleBarStripPx` folds in the Windows caption-strip pref
  // (see the CSS's now-removed `.toggleCluster` compat rule — handled here
  // instead, since this position is computed, not static).
  const [, bumpOnResize] = useState(0)
  useEffect(() => {
    const onResize = (): void => { bumpOnResize(n => n + 1) }
    window.addEventListener('resize', onResize)
    return () => { window.removeEventListener('resize', onResize) }
  }, [])
  const titleBarStripPx = typeof document !== 'undefined' && document.body.hasAttribute('data-dsh-title-bar-compat')
    ? (parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--dsh-title-bar-strip')) || 40)
    : 0
  const clusterTop = (() => {
    const DOCKED_TOP = 3 // matches the tab strip's own button inset
    const HOST_HEADER_CLEAR = 44 // clears the host header's "Session log" control
    const CLUSTER_ROW = 34 // matches .tabBar's own height
    if (state === undefined || state.panelOpen) return DOCKED_TOP + titleBarStripPx
    if (!bottomOpen) return HOST_HEADER_CLEAR + titleBarStripPx
    const bottomTopY = (typeof window !== 'undefined' ? window.innerHeight : Infinity) - state.bottomHeight
    return Math.max(DOCKED_TOP, Math.min(HOST_HEADER_CLEAR, bottomTopY - CLUSTER_ROW)) + titleBarStripPx
  })()

  // Push the host app's own content instead of floating the panels over it,
  // so the panels read as "docked" rather than overlaid. The two axes need
  // DIFFERENT push mechanisms AND different target elements:
  //
  //  - RIGHT panel → `margin-right` on `#root`: `#root` is a block element,
  //    so a right margin shrinks its content width (blocks consume margin
  //    from their available width). The host's CSS grid center column
  //    (`minmax(0, 1fr)`) reflows narrower while the fixed-width left nav
  //    column keeps its own width; the sidebar docks on the right without
  //    touching the nav.
  //
  //  - BOTTOM panel → `height: calc(100% - H)` on the host's CENTER COLUMN
  //    itself, NOT `#root`. `#root` lays out the left nav and the center
  //    column as siblings sharing one row (both stretch to `#root`'s full
  //    height), so shrinking `#root`'s own height shrinks the nav's height
  //    right along with the chat column — the bottom panel visually
  //    "taking space from" the nav even though it never overlaps it
  //    horizontally. Applying the shrink to the center column alone leaves
  //    the nav at full height and only the chat column yields room. (Not
  //    `margin-bottom`: the DSH shell sets `html, body, #root { height: 100%
  //    }`, and a margin on a height:100% element doesn't shrink its content
  //    box — it only adds overflow space below, leaving the chat input
  //    pinned to the viewport bottom and covered by the fixed bottom panel.)
  //
  // Both panels still render via `position: fixed` (a body-level portal —
  // see mountSidebarShell); these pushes are what dock them. `#root` is the
  // SPA's bootstrap convention; the center column is found the same
  // substring-class way the left-inset effect below does (see its comment
  // for why). No transition while dragging (matches
  // `.panel[data-dragging]` / `.bottomPanel[data-dragging]`), so the push
  // tracks the cursor exactly.
  useEffect(() => {
    const hostRoot = document.getElementById('root')
    if (hostRoot === null) return
    hostRoot.style.transition = draggingWidth
      ? 'none'
      : 'margin-right var(--ds-transition-duration-slow) var(--ds-ease-in-out)'
    hostRoot.style.marginRight = collapsed ? '0px' : `${String(state?.width ?? 0)}px`
    return () => {
      hostRoot.style.marginRight = ''
      hostRoot.style.transition = ''
    }
  }, [collapsed, state?.width, draggingWidth])

  // Reserve the bottom panel's height on the center column only (see the
  // note above) — never on `#root`, which would also shrink the left nav.
  useEffect(() => {
    const centerCol = document.querySelector<HTMLElement>('[class*="centerCol"]')
    if (centerCol === null) return
    centerCol.style.transition = draggingHeight
      ? 'none'
      : 'height var(--ds-transition-duration-slow) var(--ds-ease-in-out)'
    centerCol.style.height = bottomOpen ? `calc(100% - ${String(state?.bottomHeight ?? 0)}px)` : ''
    return () => {
      centerCol.style.height = ''
      centerCol.style.transition = ''
    }
  }, [bottomOpen, state?.bottomHeight, draggingHeight])

  // The bottom panel's LEFT edge spans from the host's own CENTER COLUMN's
  // left edge (never covering the host's own left nav); its right edge is a
  // plain CSS `right: 0` now (full window width, including under the right
  // panel — see sidebar.module.css). Measured at runtime via a SUBSTRING
  // class match ("centerCol") rather than the host's full hashed class
  // name, so it survives a host rebuild changing the hash prefix; falls
  // back to the viewport's left edge (0) if the host's DOM shape ever
  // changes enough to lose the match — the panel still works, just may
  // shadow the host's left nav in that fallback case.
  //
  // "Auto-update" means more than a window resize: the host's own left nav
  // can collapse/expand (or its width can otherwise change) without ever
  // firing a `resize` event, since the WINDOW doesn't change size — only the
  // host's internal layout does. A plain resize listener misses that class
  // of change entirely. A ResizeObserver on `document.body` catches most
  // layout-affecting changes as a broad fallback, but the precise fix is to
  // observe the elements that actually DETERMINE the inset: the center
  // column itself and whatever precedes it in the host's layout (its own
  // width change is exactly what shifts the center column's left edge) —
  // so re-observed on every apply() in case the host's DOM was replaced
  // (a re-render can swap which element `[class*="centerCol"]` resolves to).
  const bottomPanelRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    const observer = new ResizeObserver(apply)
    function apply(): void {
      const panel = bottomPanelRef.current
      if (panel === null) return
      const centerCol = document.querySelector('[class*="centerCol"]')
      const left = centerCol !== null ? centerCol.getBoundingClientRect().left : 0
      panel.style.left = `${String(Math.max(0, left))}px`
      observer.disconnect()
      observer.observe(document.body)
      if (centerCol !== null) observer.observe(centerCol)
      if (centerCol?.previousElementSibling !== null && centerCol?.previousElementSibling !== undefined) {
        observer.observe(centerCol.previousElementSibling)
      }
    }
    apply()
    window.addEventListener('resize', apply)
    return () => {
      window.removeEventListener('resize', apply)
      observer.disconnect()
    }
  }, [collapsed, bottomOpen, state?.width])

  // The + menu: one option per registered (enabled) tab descriptor, in
  // `order` ascending. The descriptor's `available` gates the disabled state
  // (e.g. a terminal at capacity); `title` may be a function (i18n). Only
  // built when a session is active (the panel does not render otherwise).
  // Threaded into every leaf of the split tree (each pane's + menu and its
  // empty-state cards use the same options).
  const newTabOptions: NewTabOption[] = useMemo(() => {
    if (state === undefined) return []
    // state is defined iff a session is active (the store sets state=undefined
    // when no session is selected), so sessionId is non-undefined here.
    const scope = { sessionId: snapshot.sessionId! }
    // Per-tab one-line descriptions for the empty-state "new page" cards.
    // Keyed by the stable tab id literal each descriptor carries (terminal
    // = 'dsh-powerdesk:terminal', explorer = 'dsh-powerdesk:explorer',
    // notes = 'dsh-powerdesk:notes', browser = 'dsh-powerdesk:browser',
    // search = 'dsh-powerdesk:search').
    // Unknown tabs (e.g. an extension tab) get no description — the card
    // just shows its label.
    const descriptions: Record<string, string> = {
      'dsh-powerdesk:terminal': t('cardTerminalDesc'),
      'dsh-powerdesk:explorer': t('cardExplorerDesc'),
      'dsh-powerdesk:notes': t('cardNotesDesc'),
      'dsh-powerdesk:browser': t('cardBrowserDesc'),
      'dsh-powerdesk:search': t('cardSearchDesc'),
    }
    return service.getTabs()
      .filter(descriptor => descriptor.hidden !== true && service.isTabEnabled(descriptor.id))
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .map(descriptor => ({
        id: descriptor.id,
        label: typeof descriptor.title === 'function' ? descriptor.title() : descriptor.title,
        disabled: descriptor.available?.(ctx, scope, state) === false,
        icon: typeof descriptor.icon === 'function' ? descriptor.icon(16) : descriptor.icon,
        description: descriptions[descriptor.id],
      }))
  }, [service, state, ctx, snapshot.sessionId])

  // Opens in the active pane (state.activePane, tracked by `activateTab` —
  // see SplitPane.tsx); falls back to the tree's first leaf when nothing has
  // been activated yet.
  const onNewTab = useCallback((typeId: string): void => {
    service.openTab({ type: typeId })
  }, [service])

  return (
    <>
      {/* The persistent toggle at the top-right corner: one tap opens or
          collapses the panel. Always pinned (the CSS reserves its space in
          the tab strip's right end), so the entry stays findable even when
          the panel is closed — the user's "no sidebar entry" complaint. */}
      <div className={css.toggleCluster} style={{ top: clusterTop }}>
        <Tooltip label={bottomOpen ? t('collapseBottom') : t('expandBottom')} side="bottom" delayMs={500}>
          <button
            type="button"
            className={css.toggleButton}
            aria-label={bottomOpen ? t('collapseBottom') : t('expandBottom')}
            onClick={() => { store.reduce(toggleBottomPanel) }}
          >
            <IconPanelBottomOutline16 />
          </button>
        </Tooltip>
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
            // setWidth clamps both bounds itself (PANEL_MIN .. window.innerWidth) —
            // no separate cap here, so a multi-pane workbench can use most of
            // the window instead of being stuck at the old single-pane
            // terminal/browser sidebar's 640px ceiling.
            store.reduce(s => setWidth(s, startWidth + (startX - event.clientX)))
          }}
          onPointerUp={(event) => {
            if (!event.currentTarget.hasPointerCapture(event.pointerId)) return
            event.currentTarget.releasePointerCapture(event.pointerId)
            const { startX, startWidth } = widthDrag.current
            store.reduce(s => setWidth(s, startWidth + (startX - event.clientX)))
            setDraggingWidth(false)
          }}
        />
        <div className={css.panelBody}>
          <SplitTree
            node={state.splits}
            ctx={ctx}
            store={store}
            service={service}
            cwd={cwd}
            panelOpen={state.panelOpen}
            newTabOptions={newTabOptions}
            onNewTab={onNewTab}
            defaultSplitDir="col"
            onCloseRoot={() => { store.reduce(togglePanel) }}
          />
        </div>
      </div>
      )}

      {/* The bottom panel: an independent workbench spanning from the host's
          center column (see the left-inset effect above) to the RIGHT PANEL's
          left edge when the right panel is open — NOT the viewport's right
          edge. Earlier the bottom panel ran the full window width and slid
          UNDER the right panel (the right panel's higher z-index stacked it
          on top), so its usable width read as 100% and ignored the right
          panel taking space. The user wanted the bottom panel to SHRINK when
          the right panel is open. We set `right` inline to the right panel's
          width (0 when the right panel is collapsed) so the bottom panel's
          right edge stops at the right panel's left edge; `left` is still
          pinned to the host's center column by the ResizeObserver effect
          above. Squeezes the host's chat height, not its width. A tab
          dragged to a pane's top/bottom edge (see SplitPane.tsx's
          drag-to-edge zoning) can land here even though it's a SEPARATE split
          tree (`state.bottomSplits`) from the right panel's (`state.splits`)
          — `moveTabToEdge` already handles cross-tree drops (both trees live
          in the one `SidebarState` the same `store.reduce` operates over). */}
      {state !== undefined && (
      <div
        ref={bottomPanelRef}
        className={clsx(css.bottomPanel, !bottomOpen && css.bottomPanelHidden)}
        style={{ height: state.bottomHeight, right: collapsed ? 0 : state.width }}
        data-dragging={draggingHeight || undefined}
      >
        <div
          className={clsx(css.bottomResize, draggingHeight && css.bottomResizeActive)}
          onPointerDown={(event) => {
            event.preventDefault()
            event.currentTarget.setPointerCapture(event.pointerId)
            heightDrag.current = { startY: event.clientY, startHeight: state.bottomHeight }
            setDraggingHeight(true)
          }}
          onPointerMove={(event) => {
            if (!event.currentTarget.hasPointerCapture(event.pointerId)) return
            const { startY, startHeight } = heightDrag.current
            store.reduce(s => setBottomHeight(s, startHeight + (startY - event.clientY)))
          }}
          onPointerUp={(event) => {
            if (!event.currentTarget.hasPointerCapture(event.pointerId)) return
            event.currentTarget.releasePointerCapture(event.pointerId)
            const { startY, startHeight } = heightDrag.current
            store.reduce(s => setBottomHeight(s, startHeight + (startY - event.clientY)))
            setDraggingHeight(false)
          }}
        />
        <button
          type="button"
          className={css.bottomClose}
          aria-label={t('collapseBottom')}
          onClick={() => { store.reduce(toggleBottomPanel) }}
        >
          <IconPanelBottomOutline16 />
        </button>
        <div className={css.panelBody}>
          <SplitTree
            node={state.bottomSplits}
            ctx={ctx}
            store={store}
            service={service}
            cwd={cwd}
            panelOpen={bottomOpen}
            newTabOptions={newTabOptions}
            onNewTab={onNewTab}
            defaultSplitDir="row"
            onCloseRoot={() => { store.reduce(toggleBottomPanel) }}
          />
        </div>
      </div>
      )}
    </>
  )
}
