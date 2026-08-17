/**
 * Type-only re-export of dsh-better-sidebar's client service contract so
 * consumers of THIS plugin can type their own restty tab descriptors without
 * reaching into dsh-better-sidebar directly, and so the `declare module
 * 'cordis'` augmentation (`ctx.betterSidebar`) reaches this plugin's own
 * client code. All re-exports are `export type` (erased at build time) — no
 * runtime value import of dsh-better-sidebar crosses the client bundle
 * purity gate (cross-plugin collaboration goes through `ctx.betterSidebar`).
 */
export type {
  BetterSidebarService,
  TabDescriptor,
  TabComponentProps,
  TabType,
  OpenTabSeed,
  SidebarTab,
  SidebarState,
  SidebarStore,
  SidebarSnapshot,
} from 'dsh-better-sidebar/client/service'
export type { SessionScope } from 'dsh-better-sidebar/client/service'
