import type { Context, ResttyHttpRequest, ResttyHttpResponse } from './context-types.ts';
/** The chunk names the client may request (mirror of src/client/chunk-loader.ts). */
export declare const CHUNK_NAMES: readonly ["terminal", "browser", "editor", "settings"];
export type ChunkName = (typeof CHUNK_NAMES)[number];
/** How the route resolves user-installed extension bundles. */
export interface ExtensionBundleSource {
    /** Config gate; when false the /ext/ family 404s unconditionally. */
    enabled: boolean;
    /** Absolute extensions root (see registry.resolveExtensionsDir). */
    dir: string;
}
/**
 * Build the /powerdesk/bundle route handler. `fence` is the shared browser-trust
 * check every /restty route applies; `chunkDir` is the directory the chunk
 * scripts live in (overridable for tests); `extensions` enables the
 * /powerdesk/bundle/ext/<id>.js family (omitted = extensions off).
 */
export declare function createBundleRouteHandler(fence: (req: ResttyHttpRequest) => boolean, chunkDir?: string, extensions?: ExtensionBundleSource): (req: ResttyHttpRequest, res: ResttyHttpResponse) => Promise<void>;
/** Register the /powerdesk/bundle route (disposed with the fiber). */
export declare function registerBundleRoute(ctx: Context, fence: (req: ResttyHttpRequest) => boolean, extensions?: ExtensionBundleSource): () => void;
