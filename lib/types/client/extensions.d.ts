import { type InstalledExtension } from './api.ts';
import { type ChunkName } from './chunk-loader.ts';
import type { PowerdeskSidebarService, TabDescriptor } from './service.ts';
/** The chunk name (and tab type id) of one extension. */
export declare function extensionChunkName(id: string): ChunkName;
/**
 * Build the tab descriptor for one installed extension. `icon` is rendered as
 * TEXT, never as markup: the manifest is author-controlled data and an icon
 * is at most a few characters, so there is no reason to give it an HTML
 * injection surface into the tab strip.
 */
export declare function extensionTabDescriptor(extension: InstalledExtension): TabDescriptor | undefined;
/** What a refresh reports back to the settings UI. */
export interface ExtensionSyncResult {
    enabled: boolean;
    dir: string;
    extensions: InstalledExtension[];
    /** Ids that registered successfully this pass. */
    registered: string[];
    /**
     * Why the installed list could not be read, when it could not be.
     *
     * Load-bearing for the settings UI: a failed fetch also reports
     * `enabled: false`, so without this field "the host could not be reached"
     * and "the operator turned the feature off" are the same value, and the
     * card tells the user to edit config when the real problem is a stale host
     * half answering 404 for `ext.list`.
     */
    error?: string;
}
/**
 * Owns the extension tab registrations for one client activation. Created in
 * the client entry, refreshed by the settings card after an install/remove,
 * and disposed with the plugin fiber.
 */
export declare class ExtensionHost {
    private readonly service;
    /** Disposers returned by `registerTab`, keyed by extension id. */
    private readonly registered;
    /** Bumped per refresh so a slow in-flight fetch cannot apply out of order. */
    private generation;
    private disposed;
    constructor(service: PowerdeskSidebarService);
    /**
     * Fetch the installed list and reconcile the registrations to it.
     *
     * Never throws: the sidebar must mount whether or not the extensions API
     * answered, so a failed fetch reports an empty, disabled result and leaves
     * the previous registrations alone rather than tearing down working tabs
     * because one poll failed.
     */
    refresh(): Promise<ExtensionSyncResult>;
    /** Dispose every registration (idempotent; safe after {@link dispose}). */
    private unregisterAll;
    /** Tear down all extension tabs (plugin deactivation / HMR). */
    dispose(): void;
}
