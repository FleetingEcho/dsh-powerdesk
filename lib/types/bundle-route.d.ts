import type { Context, ResttyHttpRequest, ResttyHttpResponse } from './context-types.ts';
/** The chunk names the client may request (mirror of src/client/chunk-loader.ts). */
export declare const CHUNK_NAMES: readonly ["terminal", "browser", "editor"];
export type ChunkName = (typeof CHUNK_NAMES)[number];
/**
 * Build the /powerdesk/bundle route handler. `fence` is the shared browser-trust
 * check every /restty route applies; `chunkDir` is the directory the chunk
 * scripts live in (overridable for tests).
 */
export declare function createBundleRouteHandler(fence: (req: ResttyHttpRequest) => boolean, chunkDir?: string): (req: ResttyHttpRequest, res: ResttyHttpResponse) => Promise<void>;
/** Register the /powerdesk/bundle route (disposed with the fiber). */
export declare function registerBundleRoute(ctx: Context, fence: (req: ResttyHttpRequest) => boolean): () => void;
