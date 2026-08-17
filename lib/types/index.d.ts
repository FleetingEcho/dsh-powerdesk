import type { Context } from './context-types.ts';
import { Config, type ResttyConfig } from './config.ts';
export { Config };
export type { ResttyConfig, ResolvedResttyConfig } from './config.ts';
export type { Context } from './context-types.ts';
export type { PowerdeskSidebarService, TabDescriptor, TabComponentProps, } from './client/service.ts';
/** Plugin identity for cordis.yml rows. */
export declare const name = "dsh-powerdesk";
/** Services required before mounting: the webserver routes, the session
 *  store, and the web runtime's trusted hosts. */
export declare const inject: string[];
/**
 * Per-method request-body bound. Only the extension upload needs more than
 * the default: a 16 MiB archive is ~21 MiB once base64-encoded, plus the JSON
 * envelope. Every other method keeps the tight default.
 */
export declare function bodyLimitFor(method: string): number;
/**
 * Plugin body: mount the fenced routes and the pty lifecycle.
 * @param ctx - host plugin context (webServer, sessions, webRuntime).
 * @param config - deployment-provided limits; the Loader validates against
 * {@link Config} and fills defaults.
 */
export declare function apply(ctx: Context, config?: ResttyConfig): void;
