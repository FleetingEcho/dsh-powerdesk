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
 * Plugin body: mount the fenced routes and the pty lifecycle.
 * @param ctx - host plugin context (webServer, sessions, webRuntime).
 * @param config - deployment-provided limits; the Loader validates against
 * {@link Config} and fills defaults.
 */
export declare function apply(ctx: Context, config?: ResttyConfig): void;
