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
import { type ReactNode } from 'react';
import type { SidebarTab } from './state.ts';
/** One + menu option. */
export interface NewTabOption {
    id: string;
    label: string;
    disabled?: boolean;
    /** Leading icon (Menu row). */
    icon?: ReactNode;
    /** One-line description shown under the label on the empty-state card.
     *  Optional — cards without it just show the label. */
    description?: string;
}
/** Drag payload for tab moves (HTML5 DnD dataTransfer). */
export declare const TAB_DRAG_TYPE = "application/x-dsh-tab";
export interface TabDragPayload {
    tabId: string;
    paneId: string;
}
export declare function serializeDrag(payload: TabDragPayload): string;
export declare function parseDrag(raw: string): TabDragPayload | null;
export declare function TabBar(props: {
    paneId: string;
    tabs: SidebarTab[];
    active: string | null;
    onActivate: (tabId: string) => void;
    onClose: (tabId: string) => void;
    /** The "+" button's action: split this pane and open a fresh empty pane
     *  showing the empty-state card grid. Replaces the old dropdown menu —
     *  the "+" always opens a new page, never a pick-list. */
    onNewPane: () => void;
    /** Drop of a tab from any pane: (payload, insertBeforeTabId | null). */
    onDropTab: (payload: TabDragPayload, before: string | null) => void;
    /** Icon resolver for tab labels (reads from the tab descriptor registry). */
    getTabIcon?: (tab: SidebarTab) => ReactNode;
    /** Badge resolver for tab labels (reads the descriptor's `badge`; the
     *  resolver returns the rendered pill or null). */
    getTabBadge?: (tab: SidebarTab) => ReactNode;
    /** When this pane is empty (showing the "start a new page" card grid) but
     *  closeable (it has a parent split), render ONE pseudo-tab standing in for
     *  the card page itself — same look as a real tab, including its own close
     *  button — instead of a bespoke close control buried in the card grid's
     *  header (which read as "in the wrong place": a stray icon floating over
     *  page content instead of living where every other tab's close lives).
     *  Closing it removes the PANE (there is no real tab to close). Omitted
     *  entirely for the root pane (nothing to close). */
    emptyTab?: {
        label: string;
        onClose: () => void;
    };
}): import("react").JSX.Element;
