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
import { type ReactNode } from 'react';
import type { Context } from '../context-types.ts';
import type { SidebarStore } from './state.ts';
import type { PowerdeskSidebarService } from './service.ts';
/** The powerdesk sidebar shell. */
export declare function SidebarShell(props: {
    ctx: Context;
    store: SidebarStore;
    service: PowerdeskSidebarService;
}): ReactNode;
