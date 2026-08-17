/**
 * Extension manifest: the `powerdesk.json` an extension archive must carry,
 * and its validation. Kept dependency-free and side-effect-free so both the
 * install path and the tests can call it directly.
 *
 * The manifest is the ONLY channel through which an extension describes
 * itself to the platform, and it is attacker-influenced (a user can be talked
 * into uploading an archive), so validation is whitelist-shaped: every field
 * is checked for type and range, unknown fields are dropped rather than
 * carried, and the id — which becomes a filesystem directory name, a URL
 * path segment, and a chunk-registry key — is restricted to a character set
 * that is safe in all three positions at once.
 *
 * @module dsh-powerdesk/extensions/manifest
 */
/** Manifest schema version this build understands. */
export declare const EXTENSION_API_VERSION = 1;
/**
 * The id character set: lowercase alphanumerics and dashes, leading
 * alphanumeric, at most 64 chars. Deliberately narrower than any one of its
 * three consumers requires — a single set that is simultaneously a safe path
 * segment (no `.`, no `..`, no separators, no case-collision on macOS/Windows),
 * a safe URL segment (nothing to percent-encode), and a safe object key.
 */
export declare const EXTENSION_ID_PATTERN: RegExp;
/** A rejected manifest, upload, or extension id. */
export declare class ExtensionError extends Error {
}
/** One extension's declared identity and tab behaviour. */
export interface ExtensionManifest {
    apiVersion: number;
    /** Unique id; also the directory name, URL segment, and chunk key suffix. */
    id: string;
    title: string;
    /** Emoji or short text shown on the tab (a manifest cannot carry a node). */
    icon?: string;
    /** Bundle file inside the extension directory. Defaults to `bundle.js`. */
    entry: string;
    /** Named export of the chunk factory's result to mount. Defaults to `default`. */
    export: string;
    /** + menu sort order (ascending); matches TabDescriptor.order. */
    order?: number;
    /** Single-instance sugar; matches TabDescriptor.single. */
    single?: boolean;
}
/** Whether a string is a usable extension id. */
export declare function isValidExtensionId(id: unknown): id is string;
/** Throwing form of {@link isValidExtensionId} (the API boundary's guard). */
export declare function requireExtensionId(id: unknown): string;
/**
 * Validate a parsed `powerdesk.json` into a manifest, or throw
 * {@link ExtensionError} with a message meant for the upload dialog.
 *
 * @param value - the parsed JSON document.
 * @param expectedId - when given, the manifest id must equal it (the bare-
 * bundle upload path names the extension out-of-band).
 */
export declare function parseManifest(value: unknown, expectedId?: string): ExtensionManifest;
/**
 * The chunk-registry key an extension's bundle must assign its factory to.
 * Namespaced under `ext:` so a third-party bundle can never collide with a
 * built-in chunk name (`terminal` / `browser` / `editor`), and derived from
 * the manifest id so the build tool and the loader agree without a second
 * source of truth.
 */
export declare function chunkKeyOf(id: string): string;
