/**
 * Structural types for the cordis services this plugin consumes, plus a
 * standalone {@link Context} interface both halves share. A third-party
 * plugin resolves outside the DSH monorepo's single cordis instance, so the
 * upstream `declare module 'cordis'` augmentations do not reliably reach
 * this Context (they reach it only when dsh-better-sidebar is installed).
 *
 * Rather than emit a competing `declare module 'cordis'` augmentation that
 * would conflict with dsh-better-sidebar's (interface declaration merging
 * requires identical property types), this file defines a **standalone**
 * `Context` interface — a structural subset of the real cordis Context —
 * that both halves type their `apply(ctx)` parameter against. The real
 * cordis Context (augmented by dsh-better-sidebar when present) is
 * structurally assignable to this interface, so DSH can call `apply(ctx)`
 * with the live context.
 *
 * The members below mirror the actual runtime shapes this plugin touches:
 * - webServer: @deepseek-ai/dsh-host-webserver (register / registerUpgrade)
 * - sessions:  host side @deepseek-ai/dsh-session (SessionStore) — only the
 *   authoritative cwd is read; client side the runtime ISessions list feed
 *   (current id + per-session cwd) drives the standalone panel's scope.
 * - webRuntime: @deepseek-ai/dsh-web-app (bind-derived trusted hosts)
 * - slots: the client runtime SlotRegistry
 * - locale: @deepseek-ai/dsh-client-locale (active locale + namespace registry)
 * - effect: the DSH-vendored cordis lifecycle helper
 * - powerdeskSidebar: powerdesk's OWN client registry service (published by
 *   the client half itself, not sourced from dsh-better-sidebar — the two
 *   plugins must not share a service name, or whichever loads second fails
 *   to register).
 *
 * Drift from upstream is contained to this file.
 *
 * This file must stay FREE of Node.js types (`node:http`, `node:stream`,
 * `Buffer`): it is part of the CLIENT-reachable declaration graph (the
 * `Context` in `TabComponentProps`), so a Node import here would leak into
 * browser-only consumer builds. The webServer faces below are therefore
 * structural mirrors with plain interfaces (the host casts to real Node
 * types at the few boundaries that need them — e.g. the `ws` upgrade hook
 * in src/index.ts).
 */
import type { PowerdeskSidebarService } from './client/service.ts';
/** The request face route handlers see (structural subset of node's
 *  IncomingMessage: the URL/method/header reads and the async body
 *  iteration `readJsonBody` uses). */
export interface ResttyHttpRequest {
    url?: string;
    method?: string;
    headers: Record<string, string | string[] | undefined>;
    [Symbol.asyncIterator](): AsyncIterator<string | Uint8Array>;
}
/** The response face route handlers write to (structural subset of node's
 *  ServerResponse: the status/header/body writes the routes use). */
export interface ResttyHttpResponse {
    statusCode: number;
    writeHead(status: number, headers?: Record<string, string>): void;
    end(body?: string | Uint8Array): void;
}
/** The upgrade socket face (structural subset: the destroy the fences use). */
export interface ResttyUpgradeSocket {
    destroy(): void;
}
/** The upgrade head bytes (Buffer at runtime; typed as bytes so no Node
 *  global leaks into the declaration graph). */
export type ResttyUpgradeHead = Uint8Array;
/** One named webserver route (mirror of the host-webserver WebRoute). */
export interface ResttyWebRoute {
    kind: 'exact' | 'prefix';
    path: string;
    handler: (req: ResttyHttpRequest, res: ResttyHttpResponse) => void | Promise<void>;
}
/** One exact-path HTTP upgrade registration (mirror of WebUpgradeRoute). */
export interface ResttyWebUpgradeRoute {
    path: string;
    handler: (req: ResttyHttpRequest, socket: ResttyUpgradeSocket, head: ResttyUpgradeHead) => void | Promise<void>;
}
/** The webServer service face this plugin uses. */
export interface ResttyWebServer {
    register(route: ResttyWebRoute): () => void;
    registerUpgrade(route: ResttyWebUpgradeRoute): () => void;
}
/** A published session's header slice the host reads (authoritative cwd). */
export interface ResttySessionHeader {
    cwd?: string;
}
/** The host session store face (`ctx.sessions.get(id)` returns the live session). */
export interface ResttySessionStore {
    get(id: string): {
        header: ResttySessionHeader;
    } | undefined;
}
/**
 * The web runtime service face (mirror of @deepseek-ai/dsh-web-app's
 * WebRuntimeValues): the bind-derived trust list the /api gateway's fence
 * accepts — LAN IP literals sampled when the server binds all interfaces,
 * plus explicit `--trusted-host` authorities.
 */
export interface ResttyWebRuntime {
    trustedHosts: readonly string[];
}
/** Registration options the client passes to `ctx.slots.register` (subset). */
export interface ResttySlotRegisterOptions {
    name: string;
    key?: string;
    id?: string;
    order?: number;
    label?: string | (() => string);
    select?: (owner: unknown) => unknown;
    priority?: number;
    locale?: string;
    registrant?: string;
    inject?: (...args: any[]) => Record<string, unknown>;
    children?: Record<string, unknown>;
}
/** The client slots service face (register returns the disposer). */
export interface ResttySlotsService {
    register(options: ResttySlotRegisterOptions, component: unknown): () => void;
    inject(key: string, callback: () => () => void): () => void;
}
/** One client session list row the standalone panel reads (cwd for the PTY). */
export interface ResttySessionSummary {
    id: string;
    cwd?: string;
    displayTitle: string;
    origin?: 'subagent';
    parentId?: string;
    running?: boolean;
}
/** The client sessions list snapshot the standalone panel subscribes to. */
export interface ResttySessionList {
    current: string | undefined;
    byId: Record<string, ResttySessionSummary>;
}
/** The client sessions service face (only the list feed is needed). */
export interface ResttySessionsService {
    list: {
        getSnapshot(): ResttySessionList;
        subscribe(fn: () => void): () => void;
    };
}
/**
 * The client locale service face (mirror of @deepseek-ai/dsh-client-locale's
 * LocaleRuntime — only the slices this plugin touches). The plugin follows
 * the DSH i18n system: the active locale is the Host-backed preference and
 * the plugin registers its dictionaries under the `powerdesk` namespace.
 */
export interface ResttyLocaleService {
    getSnapshot(): {
        active: string;
    };
    subscribe(fn: () => void): () => void;
    register(ns: string, locale: string, dict: Record<string, string>): () => void;
}
/**
 * Standalone Context interface: a structural subset of the real cordis
 * Context. Both halves type their `apply(ctx: Context)` parameter against
 * this. The real cordis Context is structurally assignable to this
 * interface, so DSH can call `apply(ctx)` with the live context.
 * `powerdeskSidebar` is optional here only because the field is unused on
 * the host side (the client half always provides it — see {@link provide}).
 */
export interface Context {
    /** The host webserver route registry. */
    webServer: ResttyWebServer;
    /** The session store (host: authoritative cwd; client: the list feed). */
    sessions: ResttySessionStore & ResttySessionsService;
    /** The web runtime's bind-derived trust list. */
    webRuntime: ResttyWebRuntime;
    /** The client slots registry. */
    slots: ResttySlotsService;
    /** The client locale service. */
    locale: ResttyLocaleService;
    /**
     * The client-side sidebar registry powerdesk itself publishes (its own
     * tab registry, unrelated to dsh-better-sidebar's service of the same
     * shape). OPTIONAL: undefined on the host side; always present on the
     * client side once the plugin has activated.
     *
     * NOTE: read this via `ctx.get('powerdeskSidebar')`, NOT `ctx.powerdeskSidebar`.
     * Direct property access throws "cannot get property without inject" unless
     * the service is declared in `inject`, but powerdeskSidebar is optional (the
     * plugin falls back to the standalone panel). `ctx.get(name)` reads the
     * cordis store without the inject requirement and returns undefined when
     * the service isn't (yet) provided. The field below exists only so the
     * structural type stays a superset of the real cordis Context.
     */
    powerdeskSidebar?: PowerdeskSidebarService;
    /**
     * Read an optional service from the cordis store WITHOUT the inject
     * requirement (the cordis `ReflectService.get` built-in). Returns the
     * service value, or undefined when not (yet) provided. Use this for
     * optional services like `powerdeskSidebar` instead of direct `ctx.x`
     * access (which the inject Guard rejects).
     */
    get<T = any>(name: string): T | undefined;
    /**
     * Publish a service into the cordis store so other plugins (and this
     * plugin's own `ctx.get(name)`) can read it. DSH-vendored cordis: the
     * service becomes available immediately at activation. Powerdesk uses
     * this to publish its OWN `powerdeskSidebar` service (the sidebar shell +
     * tab registry), so the plugin is self-contained — it no longer depends
     * on the `dsh-better-sidebar` plugin being installed to surface its
     * terminal/browser tabs.
     */
    provide<T = any>(name: string, value: T): void;
    /**
     * Register a lifecycle callback (DSH-vendored cordis): runs at plugin
     * activation; its returned cleanup runs at disposal.
     */
    effect(fn: () => void | (() => void), label?: string): void;
}
