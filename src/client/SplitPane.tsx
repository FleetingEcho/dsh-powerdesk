/**
 * The workbench split-tree renderer + the VSCode-style drag-to-edge gesture.
 * Renders {@link SidebarState.splits} recursively: a `SidebarLeaf` becomes a
 * pane (its own tab strip + content), a `SidebarSplit` becomes a flex row/col
 * of children separated by draggable dividers (`resizeSplitIn`).
 *
 * Dropping a tab dragged from `TabBar` (see `TAB_DRAG_TYPE`) follows VSCode's
 * convention: a drop on a pane's TAB STRIP merges/reorders it into that pane
 * (`moveTab`); a drop on a pane's CONTENT area is zoned into 25% edge bands
 * plus a 50% center — an edge splits that pane and inserts a fresh leaf
 * (`moveTabToEdge`), the center merges like a strip drop.
 *
 * Every open tab across the WHOLE tree stays mounted (inactive-within-its-
 * leaf tabs hidden via CSS), so switching tabs or resizing panes never tears
 * down a terminal's connection/scrollback — same contract the single-pane
 * shell used, just applied per leaf instead of assuming there is only one.
 */
import { createElement, useCallback, useState, type ReactNode } from 'react'
import { Fragment } from 'react'
import clsx from 'clsx'
import type { Context } from '../context-types.ts'
import {
  activateTab,
  allLeaves,
  closeTab,
  EXPLORER_TAB_ID,
  moveTab,
  moveTabToEdge,
  resizeSplitIn,
  splitLeafAt,
  toggleExpanded,
  type DropZone,
  type SidebarLeaf,
  type SidebarState,
  type SidebarStore,
  type SidebarTab,
  type SplitNode,
} from './state.ts'
import type { PowerdeskSidebarService, TabComponentProps, TabDescriptor } from './service.ts'
import { TAB_DRAG_TYPE, TabBar, parseDrag, type NewTabOption } from './TabBar.tsx'
import { RenderBoundary } from './RenderBoundary.tsx'
import css from './sidebar.module.css'

/** The props every level of the split tree threads down unchanged. */
interface SplitTreeCommonProps {
  ctx: Context
  store: SidebarStore
  service: PowerdeskSidebarService
  cwd: string | undefined
  panelOpen: boolean
  newTabOptions: NewTabOption[]
  onNewTab: (typeId: string) => void
}

/**
 * Make sure the pane about to receive a file-open tab is NOT the Explorer's
 * own pane — the user's complaint: files were opening as siblings in the
 * explorer's own tab strip instead of beside it, VSCode-style. If a non-
 * explorer pane already exists, just activate it (the file opens there); if
 * the explorer is the only pane, split it (row) and activate the fresh
 * empty pane. `service.openFile` (called right after) then opens/focuses
 * the editor tab in whatever `state.activePane` now is.
 */
function makeRoomBesideExplorer(state: SidebarState): SidebarState {
  const leaves = allLeaves(state.splits)
  const explorerLeaf = leaves.find(leaf => leaf.tabs.some(tab => tab.id === EXPLORER_TAB_ID))
  if (explorerLeaf === undefined) return state
  const sibling = leaves.find(leaf => leaf.id !== explorerLeaf.id)
  if (sibling !== undefined) return { ...state, activePane: sibling.id }
  const beforeIds = new Set(leaves.map(leaf => leaf.id))
  const splits = splitLeafAt(state.splits, explorerLeaf.id, 'row')
  const freshLeaf = allLeaves(splits).find(leaf => !beforeIds.has(leaf.id))
  return { ...state, splits, activePane: freshLeaf?.id ?? state.activePane }
}

/** Render one tab's content via its registered descriptor. `expanded` /
 *  `onToggleDir` thread the shared directory-expansion set (ExplorerView);
 *  `onOpenFile` opens a file in the editor tab (service.openFile hardcodes
 *  the 'editor' type id — see service.ts). */
function TabContent(props: {
  tab: SidebarTab
  descriptor: TabDescriptor
  ctx: Context
  store: SidebarStore
  service: PowerdeskSidebarService
  cwd: string | undefined
  visible: boolean
}): ReactNode {
  const { tab, descriptor, ctx, store, service, cwd, visible } = props
  const scope = { sessionId: store.getSnapshot().sessionId, ...(cwd !== undefined ? { cwd } : {}) }
  return (
    <RenderBoundary className={css.tabBoundaryError}>
      {createElement(descriptor.component, {
        ctx,
        store,
        scope,
        tab,
        visible,
        expanded: store.getSnapshot().state?.expanded ?? [],
        onToggleDir: (path: string) => { store.reduce(s => toggleExpanded(s, path)) },
        onOpenFile: (path: string) => {
          store.reduce(makeRoomBesideExplorer)
          service.openFile(scope as TabComponentProps['scope'], path)
        },
      } as TabComponentProps)}
    </RenderBoundary>
  )
}

/** 25% edge bands + 50% center, the VSCode drag-to-edge convention. */
function zoneFromPointer(rect: DOMRect, x: number, y: number): DropZone {
  const relX = (x - rect.left) / rect.width
  const relY = (y - rect.top) / rect.height
  if (relX < 0.25) return 'left'
  if (relX > 0.75) return 'right'
  if (relY < 0.25) return 'up'
  if (relY > 0.75) return 'down'
  return 'center'
}

function dropZoneClass(zone: DropZone): string | undefined {
  switch (zone) {
    case 'left': return css.dropLeft
    case 'right': return css.dropRight
    case 'up': return css.dropUp
    case 'down': return css.dropDown
    case 'center': return css.dropCenter
  }
}

/** One split divider: pointer-capture drag, delta expressed as a fraction of
 *  the split container's size (matches {@link resizeSplitIn}'s contract). */
function Divider(props: { dir: 'row' | 'col'; splitId: string; index: number; store: SidebarStore }): ReactNode {
  const { dir, splitId, index, store } = props
  const [active, setActive] = useState(false)
  return (
    <div
      className={clsx(css.divider, dir === 'row' ? css.dividerRow : css.dividerCol, active && css.dividerActive)}
      onPointerDown={(event) => {
        event.preventDefault()
        event.currentTarget.setPointerCapture(event.pointerId)
        setActive(true)
      }}
      onPointerMove={(event) => {
        if (!event.currentTarget.hasPointerCapture(event.pointerId)) return
        const container = event.currentTarget.parentElement
        if (container === null) return
        const rect = container.getBoundingClientRect()
        const size = dir === 'row' ? rect.width : rect.height
        if (size <= 0) return
        const movement = dir === 'row' ? event.movementX : event.movementY
        store.reduce(s => resizeSplitIn(s, splitId, index, movement / size))
      }}
      onPointerUp={(event) => {
        if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
        setActive(false)
      }}
    />
  )
}

/** One leaf pane: its own tab strip, mounted tab contents, and the
 *  drag-to-edge drop overlay over its content area. */
function PaneLeaf(props: SplitTreeCommonProps & { leaf: SidebarLeaf }): ReactNode {
  const { leaf, ctx, store, service, cwd, panelOpen, newTabOptions, onNewTab } = props
  const [dropZone, setDropZone] = useState<DropZone | null>(null)

  const descriptorOf = useCallback((tab: SidebarTab): TabDescriptor | undefined => service.getTab(tab.type), [service])
  const tabIconOf = useCallback((tab: SidebarTab): ReactNode => {
    const icon = descriptorOf(tab)?.icon
    return typeof icon === 'function' ? icon(16) : (icon ?? null)
  }, [descriptorOf])

  const activeTab = leaf.tabs.find(tab => tab.id === leaf.active) ?? leaf.tabs[leaf.tabs.length - 1] ?? null

  // Opening a tab from THIS pane's + menu / empty-state card must land it
  // HERE, not wherever `state.activePane` last pointed — `openTabInActivePane`
  // (see service.openTab / state.ts) falls back to the RIGHT panel's first
  // leaf whenever activePane is stale, which it always is for an EMPTY pane
  // (nothing to activateTab on yet): without this, "+ Terminal" clicked in
  // an empty bottom panel would silently open the terminal in the right
  // panel instead. Setting activePane directly (not via activateTab, which
  // requires an existing tab id this leaf may not have) fixes it for both
  // panels — right and bottom are just two different trees in one state.
  const onNewTabHere = useCallback((typeId: string): void => {
    store.reduce(s => ({ ...s, activePane: leaf.id }))
    onNewTab(typeId)
  }, [store, leaf.id, onNewTab])

  // A pane holding ONLY file-open tabs ('editor' — the literal id
  // service.openFile hardcodes) is a file-viewing pane, not a place to add
  // arbitrary new terminal/browser/explorer tabs: those only ever land there
  // via clicking a file in Explorer (see makeRoomBesideExplorer), never a
  // "new tab" menu. Hide the strip's + for it (TabBar hides it on an empty
  // array); the empty-state cards below still use the full `newTabOptions`
  // once the pane has NO tabs left (no longer file-only).
  const isFileOnlyPane = leaf.tabs.length > 0 && leaf.tabs.every(tab => tab.type === 'editor')

  return (
    <div className={clsx(css.pane, dropZone !== null && css.paneDrop)}>
      <TabBar
        paneId={leaf.id}
        tabs={leaf.tabs}
        active={leaf.active}
        onActivate={(tabId) => { store.reduce(s => activateTab(s, leaf.id, tabId)) }}
        onClose={(tabId) => { store.reduce(s => closeTab(s, leaf.id, tabId)) }}
        onNewTab={onNewTabHere}
        newTabOptions={isFileOnlyPane ? [] : newTabOptions}
        getTabIcon={tabIconOf}
        onDropTab={(payload, before) => {
          const index = before === null ? -1 : leaf.tabs.findIndex(tab => tab.id === before)
          store.reduce(s => moveTab(s, payload.paneId, payload.tabId, leaf.id, index))
        }}
      />
      {leaf.tabs.length > 0 ? (
        <div
          className={css.paneContent}
          onDragOver={(event) => {
            if (!event.dataTransfer.types.includes(TAB_DRAG_TYPE)) return
            event.preventDefault()
            const rect = event.currentTarget.getBoundingClientRect()
            setDropZone(zoneFromPointer(rect, event.clientX, event.clientY))
          }}
          onDragLeave={() => { setDropZone(null) }}
          onDrop={(event) => {
            event.preventDefault()
            const raw = event.dataTransfer.getData(TAB_DRAG_TYPE)
            const payload = parseDrag(raw)
            const zone = dropZone ?? 'center'
            setDropZone(null)
            if (payload === null) return
            store.reduce(s => moveTabToEdge(s, payload.paneId, payload.tabId, leaf.id, zone))
          }}
        >
          {leaf.tabs.map(tab => (
            <div key={tab.id} className={clsx(css.paneTab, tab.id !== activeTab?.id && css.paneTabHidden)}>
              {descriptorOf(tab) !== undefined && (
                <TabContent
                  tab={tab}
                  descriptor={descriptorOf(tab)!}
                  ctx={ctx}
                  store={store}
                  service={service}
                  cwd={cwd}
                  visible={panelOpen && tab.id === activeTab?.id}
                />
              )}
            </div>
          ))}
          {dropZone !== null && <div className={clsx(css.dropOverlay, dropZoneClass(dropZone))} />}
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
              onClick={() => { onNewTabHere(option.id) }}
            >
              {option.icon ?? null}
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

/** Recursive split-tree renderer: a leaf becomes a pane, a split becomes a
 *  flex row/col of children with draggable dividers between them. */
export function SplitTree(props: SplitTreeCommonProps & { node: SplitNode }): ReactNode {
  const { node, ...rest } = props
  if (node.kind === 'leaf') return <PaneLeaf leaf={node} {...rest} />
  return (
    <div className={clsx(css.split, node.dir === 'row' ? css.splitRow : css.splitCol)}>
      {node.children.map((child, i) => (
        <Fragment key={child.id}>
          {i > 0 && <Divider dir={node.dir} splitId={node.id} index={i - 1} store={rest.store} />}
          <div className={css.splitChild} style={{ flex: `${String(node.sizes[i])} ${String(node.sizes[i])} 0%` }}>
            <SplitTree node={child} {...rest} />
          </div>
        </Fragment>
      ))}
    </div>
  )
}
