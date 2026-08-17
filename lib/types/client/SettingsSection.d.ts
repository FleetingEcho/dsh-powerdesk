/**
 * The "Powerdesk" Side card in the DSH Settings shell: one card per
 * registered tab type (Terminal / Browser / Explorer / Editor), matching
 * dsh-better-sidebar's own settings page style — icon, title, the raw type
 * id as a subtitle, and a checkmark toggle to enable/disable it (an absent
 * key means enabled; toggling off hides the type from the + menu and makes
 * `openTab` a no-op for it — see service.ts's `isTabEnabled`/`setTabEnabled`).
 * Clicking the card body (not the toggle) opens that surface in the sidebar.
 *
 * The section is registered through `ctx.slots.inject('settings.section', …)`
 * in the client `apply()` (see index.tsx). The shell owns modal visibility and
 * navigation; it passes `close` (SettingsSectionOwnerProps) and our injected
 * `sidebar` face (the optional PowerdeskSidebarService, probed via
 * `ctx.get('powerdeskSidebar')`).
 */
import { type ReactNode } from 'react';
import type { PowerdeskSidebarService } from './service.ts';
/** The shell-supplied owner props (SettingsSectionOwnerProps: `close`). */
export interface SettingsSectionOwnerProps {
    close: () => void;
}
/** The injected face: the optional sidebar registry service. */
export interface SettingsSectionInjected {
    sidebar: PowerdeskSidebarService | undefined;
}
/** Full section props: the shell owner share + the injected face. */
export type SettingsSectionProps = SettingsSectionOwnerProps & SettingsSectionInjected;
/**
 * Render the Powerdesk Side card.
 * @param props - the shell owner share (`close`) + injected `sidebar` face.
 * @returns the section element tree.
 */
export declare function SettingsSection({ close, sidebar }: SettingsSectionProps): ReactNode;
