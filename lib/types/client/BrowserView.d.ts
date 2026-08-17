/**
 * The built-in browser tab: an address bar plus a sandboxed iframe.
 *
 * Security model (see browser.ts + the sandbox tokens below): the iframe is
 * ALWAYS sandboxed without `allow-same-origin` (opaque origin — the visited
 * page can never sit on the GUI's origin, read its storage, or reach
 * /powerdesk/api) and without `allow-top-navigation` (a page must not hijack
 * the GUI). The address bar only accepts http(s) and refuses loopback. A
 * temporary sandbox unlock drops the sandbox attribute for fully trusted
 * sites; a persistent warning bar renders while it is off.
 *
 * The back/forward stack only tracks address-bar navigations (in-frame link
 * clicks are cross-origin and invisible — a documented limitation).
 *
 * When a site refuses to be embedded (X-Frame-Options / frame-ancestors),
 * the host's `browser.probe` route detects it and the view shows the reason
 * + open-in-browser instead of the browser's cryptic "refused to connect"
 * blank frame.
 *
 * Adapted from dsh-better-sidebar's BrowserView (BSD-3-Clause).
 */
import { type ReactNode } from 'react';
/**
 * The browser iframe sandbox tokens. NO allow-same-origin (opaque origin —
 * no GUI storage/API access), NO allow-top-navigation (a browsed page must
 * not hijack the GUI). allow-forms/allow-popups/allow-downloads/allow-modals
 * keep login flows working; allow-popups-to-escape-sandbox lets OAuth
 * popups open as normal tabs (they are cross-origin to the GUI either way).
 */
export declare const BROWSER_IFRAME_SANDBOX = "allow-scripts allow-forms allow-popups allow-downloads allow-modals allow-popups-to-escape-sandbox";
/** Props for the browser view. */
export interface BrowserViewProps {
    /** The initial URL to load (persisted on the tab's path by the parent). */
    initialUrl?: string;
    /** Whether the view is visible (pauses the probe when hidden). */
    visible?: boolean;
}
export declare function BrowserView(props: BrowserViewProps): ReactNode;
/**
 * The embed-refusal panel: shown when the probed site forbids being
 * displayed inside other pages (X-Frame-Options / frame-ancestors) — the
 * iframe would only show the browser's "refused to connect" blank. Explains
 * the reason and offers the real-browser open plus a load-anyway escape.
 * Exported so the copy and the actions are testable without a DOM.
 */
export declare function BrowserEmbedBlocked(props: {
    url: string;
    onOpenInBrowser: () => void;
    onLoadAnyway: () => void;
}): ReactNode;
