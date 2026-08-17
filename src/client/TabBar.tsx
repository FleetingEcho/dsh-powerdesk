/**
 * The tab strip of one pane: tabs capped at TAB_MAX_WIDTH (ellipsized),
 * overflow scrolls horizontally, a close button per tab, a four-way split
 * button cluster, and the + button. Clicking + opens a NEW pane (a fresh
 * split of this pane) showing the empty-state card grid (explorer / notes /
 * terminal / browser); the user picks a card to open that tab type there.
 * There is NO dropdown menu — the user asked to remove it: "+" should
 * ALWAYS open a new page showing the cards, never a pick-list. Tabs are
 * draggable; dropping onto another tab inserts before it, dropping on the
 * strip background appends to this pane.
 */
import { useEffect, useRef, useState, type ReactNode } from 'react'
import clsx from 'clsx'
import {
  IconCloseFill14, IconPlusOutline16,
} from '@deepseek-ai/dsh-client-ui-primitives'
import type { SidebarTab } from './state.ts'
import { t } from './locales.ts'
import css from './sidebar.module.css'

/** One + menu option. */
export interface NewTabOption {
  id: string
  label: string
  disabled?: boolean
  /** Leading icon (Menu row). */
  icon?: ReactNode
  /** One-line description shown under the label on the empty-state card.
   *  Optional — cards without it just show the label. */
  description?: string
}

/** Drag payload for tab moves (HTML5 DnD dataTransfer). */
export const TAB_DRAG_TYPE = 'application/x-dsh-tab'

export interface TabDragPayload {
  tabId: string
  paneId: string
}

export function serializeDrag(payload: TabDragPayload): string {
  return JSON.stringify(payload)
}

export function parseDrag(raw: string): TabDragPayload | null {
  try {
    const parsed = JSON.parse(raw) as TabDragPayload
    if (typeof parsed.tabId === 'string' && typeof parsed.paneId === 'string') return parsed
    return null
  } catch {
    return null
  }
}

/** Global tab-drag flag: PDF iframes become non-interactive synchronously. */
function setTabDragging(active: boolean): void {
  if (active) document.body.setAttribute('data-dsh-tab-dragging', '')
  else document.body.removeAttribute('data-dsh-tab-dragging')
}

export function TabBar(props: {
  paneId: string
  tabs: SidebarTab[]
  active: string | null
  onActivate: (tabId: string) => void
  onClose: (tabId: string) => void
  /** The "+" button's action: split this pane and open a fresh empty pane
   *  showing the empty-state card grid. Replaces the old dropdown menu —
   *  the "+" always opens a new page, never a pick-list. */
  onNewPane: () => void
  /** Drop of a tab from any pane: (payload, insertBeforeTabId | null). */
  onDropTab: (payload: TabDragPayload, before: string | null) => void
  /** Icon resolver for tab labels (reads from the tab descriptor registry). */
  getTabIcon?: (tab: SidebarTab) => ReactNode
  /** Badge resolver for tab labels (reads the descriptor's `badge`; the
   *  resolver returns the rendered pill or null). */
  getTabBadge?: (tab: SidebarTab) => ReactNode
  /** When this pane is empty (showing the "start a new page" card grid) but
   *  closeable (it has a parent split), render ONE pseudo-tab standing in for
   *  the card page itself — same look as a real tab, including its own close
   *  button — instead of a bespoke close control buried in the card grid's
   *  header (which read as "in the wrong place": a stray icon floating over
   *  page content instead of living where every other tab's close lives).
   *  Closing it removes the PANE (there is no real tab to close). Omitted
   *  entirely for the root pane (nothing to close). */
  emptyTab?: { label: string; onClose: () => void }
}) {
  const {
    paneId, tabs, active, onActivate, onClose, onNewPane, onDropTab, getTabIcon, getTabBadge, emptyTab,
  } = props
  const [dragOver, setDragOver] = useState(false)
  const listRef = useRef<HTMLDivElement>(null)

  // Wheel over the strip scrolls the tab row horizontally (a plain mouse
  // wheel emits deltaY, which overflow-x alone never consumes). Bound as a
  // native NON-passive listener: React registers onWheel passively at the
  // root, where preventDefault() is a no-op. Modifier keys keep their native
  // meaning (shift = horizontal scroll, ctrl/cmd = zoom), and a strip that
  // does not overflow leaves the event alone so the page scrolls normally.
  useEffect(() => {
    const el = listRef.current
    if (el === null) return
    const onWheel = (event: WheelEvent): void => {
      if (event.shiftKey || event.ctrlKey || event.metaKey || event.altKey) return
      if (el.scrollWidth <= el.clientWidth) return
      event.preventDefault()
      const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? el.clientWidth : 1
      el.scrollLeft += (event.deltaX + event.deltaY) * unit
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => { el.removeEventListener('wheel', onWheel) }
  }, [])

  useEffect(() => {
    const clear = (): void => { setTabDragging(false); setDragOver(false) }
    window.addEventListener('dragend', clear, true)
    window.addEventListener('drop', clear, true)
    window.addEventListener('blur', clear)
    return () => {
      window.removeEventListener('dragend', clear, true)
      window.removeEventListener('drop', clear, true)
      window.removeEventListener('blur', clear)
    }
  }, [])

  return (
    <div
      className={clsx(css.tabBar, dragOver && css.tabBarDrop)}
      onDragOver={(event) => {
        // The strip owns drops on itself (merge into this pane); stopping
        // propagation keeps the pane root from also running its edge-zone
        // handler on the same drop.
        event.preventDefault()
        event.stopPropagation()
        setDragOver(true)
      }}
      onDragLeave={() => { setDragOver(false) }}
      onDrop={(event) => {
        event.preventDefault()
        event.stopPropagation()
        setDragOver(false)
        setTabDragging(false)
        const raw = event.dataTransfer.getData(TAB_DRAG_TYPE)
        const payload = parseDrag(raw)
        if (payload !== null) onDropTab(payload, null)
      }}
    >
      <div ref={listRef} className={css.tabList}>
        {tabs.map(tab => (
          <div
            key={tab.id}
            className={clsx(css.tab, active === tab.id && css.tabActive)}
            title={tab.title}
            draggable
            onDragStart={(event) => {
              setTabDragging(true)
              event.dataTransfer.setData(TAB_DRAG_TYPE, serializeDrag({ tabId: tab.id, paneId }))
              event.dataTransfer.effectAllowed = 'move'
            }}
            onDragEnd={() => { setTabDragging(false); setDragOver(false) }}
            onDragOver={(event) => { event.preventDefault(); event.stopPropagation() }}
            onDrop={(event) => {
              event.preventDefault()
              event.stopPropagation()
              setTabDragging(false)
              const raw = event.dataTransfer.getData(TAB_DRAG_TYPE)
              const payload = parseDrag(raw)
              if (payload !== null) onDropTab(payload, tab.id)
            }}
            onClick={() => { onActivate(tab.id) }}
            onAuxClick={(event) => {
              // Middle-click closes the tab (and suppresses autoscroll).
              if (event.button === 1) {
                event.preventDefault()
                onClose(tab.id)
              }
            }}
          >
            {getTabIcon?.(tab) ?? null}
            {getTabBadge?.(tab) ?? null}
            <span className={css.tabTitle}>{tab.title}</span>
            <button
              type="button"
              className={css.tabClose}
              aria-label={t('close')}
              onClick={(event) => {
                event.stopPropagation()
                onClose(tab.id)
              }}
            >
              <IconCloseFill14 />
            </button>
          </div>
        ))}
        {tabs.length === 0 && emptyTab !== undefined && (
          <div className={clsx(css.tab, css.tabActive)} title={emptyTab.label}>
            <span className={css.tabTitle}>{emptyTab.label}</span>
            <button
              type="button"
              className={css.tabClose}
              aria-label={t('closePane')}
              onClick={(event) => {
                event.stopPropagation()
                emptyTab.onClose()
              }}
            >
              <IconCloseFill14 />
            </button>
          </div>
        )}
        {/*
          The + sits immediately after the rightmost tab (sticky at the
          right edge of the scrollport when the tabs overflow, so it stays
          reachable no matter how many tabs are open). It ALWAYS opens a
          NEW pane — a fresh split of this pane showing the empty-state card
          grid (explorer / notes / terminal / browser); the user then picks
          a card to open that tab type in the new pane. There is NO dropdown:
          the user asked "+" to always open a new page, never a pick-list.
          The empty-state cards themselves live in SplitPane.tsx (not the
          tab strip), so this button is intentionally simple: one action.
        */}
        <button
          type="button"
          className={css.tabBarPlus}
          aria-label={t('newPane')}
          title={t('newPane')}
          onClick={() => { onNewPane() }}
        >
          <IconPlusOutline16 />
        </button>
      </div>
    </div>
  )
}
