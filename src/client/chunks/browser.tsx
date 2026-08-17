/**
 * Lazy chunk entry: the browser surface (the BrowserView component + the URL
 * policy / embeddability logic it pulls in). Built as `lib/client-browser.js`
 * and registered under `dsh-powerdesk/browser` — fetched only when a browser
 * tab is first opened (see chunk-loader.ts and tsdown.config.ts). Never import
 * this module from the core client bundle: it pulls the browser URL-policy +
 * frame-ancestors parsing into the startup path otherwise.
 */
export { BrowserView } from '../BrowserView.tsx'
export type { BrowserViewProps } from '../BrowserView.tsx'
