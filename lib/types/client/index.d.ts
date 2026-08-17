import type { Context } from '../context-types.ts';
/** The tab id for the browser surface (the SidebarTab.type value). */
export declare const POWERDESK_BROWSER_TAB_ID = "dsh-powerdesk:browser";
/** The tab id for the file explorer (the SidebarTab.type value). */
export declare const POWERDESK_EXPLORER_TAB_ID = "dsh-powerdesk:explorer";
/** The tab id for the Notes tab (the SidebarTab.type value). */
export declare const POWERDESK_NOTES_TAB_ID = "dsh-powerdesk:notes";
/** The tab id for the Search tab (the SidebarTab.type value). */
export declare const POWERDESK_SEARCH_TAB_ID = "dsh-powerdesk:search";
/** Services required before mounting (provided by the DSH client runtime). */
export declare const inject: string[];
/**
 * Client plugin body.
 * @param ctx - the client cordis context (slots, sessions, locale).
 */
export declare function apply(ctx: Context): void;
