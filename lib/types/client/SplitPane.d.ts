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
import { type ReactNode } from 'react';
import type { Context } from '../context-types.ts';
import { type SidebarStore, type SplitNode } from './state.ts';
import type { PowerdeskSidebarService } from './service.ts';
import { type NewTabOption } from './TabBar.tsx';
/** The props every level of the split tree threads down unchanged. */
interface SplitTreeCommonProps {
    ctx: Context;
    store: SidebarStore;
    service: PowerdeskSidebarService;
    cwd: string | undefined;
    panelOpen: boolean;
    newTabOptions: NewTabOption[];
    onNewTab: (typeId: string) => void;
}
/** Recursive split-tree renderer: a leaf becomes a pane, a split becomes a
 *  flex row/col of children with draggable dividers between them. */
export declare function SplitTree(props: SplitTreeCommonProps & {
    node: SplitNode;
}): ReactNode;
export {};
