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
    /** The split direction the "+" button uses when it opens a new pane:
     *  'col' (stack) for the narrow right sidebar, 'row' (side-by-side) for
     *  the wide bottom panel — so the new pane gets usable space. */
    defaultSplitDir: 'row' | 'col';
    /** The `dir` of the leaf's IMMEDIATE parent split, or undefined when the
     *  leaf is the tree root (no parent). Set by {@link SplitTree} as it
     *  recurses (each split node overrides this for its children with its own
     *  `dir`), so a leaf always sees the direction of the split that owns it.
     *  The empty-state card page's horizontal/vertical radio reads this to
     *  show which option is selected and reorients it via `reorientSplit`. */
    parentSplitDir?: 'row' | 'col';
    /** Close the WHOLE panel this tree belongs to (right panel or bottom
     *  panel — see SidebarShell, which passes a different callback per tree).
     *  Every empty pane shows a closeable "New page" tab now, including the
     *  ROOT pane (no parent split, so `closePane` has no sibling to promote
     *  to); closing the root's pseudo-tab collapses the panel instead. */
    onCloseRoot: () => void;
}
/** Recursive split-tree renderer: a leaf becomes a pane, a split becomes a
 *  flex row/col of children with draggable dividers between them. As it
 *  recurses, each split node OVERRIDES `parentSplitDir` (from the common
 *  props) with its own `dir` for its children, so a leaf always receives the
 *  direction of its IMMEDIATE parent split — the empty-state card page's
 *  horizontal/vertical radio reads it to show the selected option. */
export declare function SplitTree(props: SplitTreeCommonProps & {
    node: SplitNode;
}): ReactNode;
export {};
