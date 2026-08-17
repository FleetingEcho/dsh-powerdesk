/**
 * The interactive terminal: restty (WebGPU/WebGL2 + WASM VT renderer) over a
 * WebSocket to the plugin's PTY backend. The host replays the session's
 * transcript on connect, then streams live output; input frames are
 * `{type:'input',data}` JSON, resize frames `{type:'resize',cols,rows}` JSON
 * (restty's native protocol). Transient disconnects (page refresh, host
 * restart) reconnect automatically; a server-side refusal (close code 1011
 * with the degraded-mode marker — the Rust PTY failed to load, or
 * dsh-better-sidebar's node-pty failed in adapter mode) stops the loop and
 * shows the repair banner fetched from the matching deps endpoint.
 *
 * Two PTY backends share one component (selected by the user pref):
 * - `own` — the plugin's Rust /powerdesk/ws/terminal (default; self-contained);
 * - `better-sidebar` — reuse dsh-better-sidebar's /sidebar/ws/terminal via
 *   {@link ./adapter-transport.ts} (shares its PTY lifecycle, quota, cwd).
 */
import { type ReactNode } from 'react';
import { type SessionScope } from './api.ts';
import type { ResttyPrefs } from './prefs.ts';
/** Props: a session scope + tab id + resolved prefs (+ visibility hint). */
export interface ResttyTerminalProps {
    scope: SessionScope;
    tabId: string;
    prefs: ResttyPrefs;
    /** When false the component still keeps the pty attached; passed through so
     *  parents can pause rendering without a remount. */
    visible?: boolean;
}
export declare function ResttyTerminal({ scope, tabId, prefs, visible }: ResttyTerminalProps): ReactNode;
