import { type ExtensionManifest } from './manifest.ts';
/** Manifest file name inside an extension directory. */
export declare const MANIFEST_FILE = "powerdesk.json";
/** Host-written provenance file name inside an extension directory. */
export declare const INSTALL_RECORD_FILE = ".install.json";
/** Provenance the host records at install time (never read from the archive). */
export interface InstallRecord {
    /** ISO timestamp of the install that produced the current contents. */
    installedAt: string;
    /** The uploaded file's name, as reported by the browser. */
    sourceFilename: string;
    /** sha256 of the uploaded bytes, for the settings UI to display. */
    sha256: string;
    /** Size of the uploaded archive in bytes. */
    sourceBytes: number;
}
/** One installed extension as the API reports it. */
export interface InstalledExtension {
    id: string;
    /** Present when the extension parsed; absent when `error` is set. */
    manifest?: ExtensionManifest;
    install?: InstallRecord;
    /** Absolute directory, shown in settings so the user can audit what ran. */
    dir: string;
    /** Size of the bundle file in bytes. */
    bundleBytes?: number;
    /** Why this directory is not loadable (parse/read failure). */
    error?: string;
}
/**
 * The default extensions root: `~/.dsh/powerdesk/extensions`, alongside the
 * profile directories the DSH CLI already owns.
 */
export declare function defaultExtensionsDir(): string;
/** Resolve the configured root to an absolute path (empty = the default). */
export declare function resolveExtensionsDir(configured?: string): string;
/**
 * The directory of one extension. The id is re-validated here rather than
 * trusted from the caller: this function's result is passed straight to file
 * reads and to `rm`, so it is the last place a bad id can be stopped.
 */
export declare function extensionDir(root: string, id: string): string;
/**
 * The absolute path of an extension's bundle script. `entry` comes from the
 * manifest, which validated it as a bare file name; the containment check
 * below is the independent second gate — if the resolved path is not inside
 * the extension directory, something upstream is wrong and no read happens.
 */
export declare function bundlePathOf(root: string, id: string, entry: string): string;
/** Read and validate one extension directory. Never throws for bad content. */
export declare function readExtension(root: string, id: string): Promise<InstalledExtension>;
/**
 * Every installed extension, sorted by id. A missing root is not an error —
 * it just means nothing has been installed yet. Directory names that are not
 * valid ids (including the installer's `.tmp-*` staging dirs) are skipped
 * entirely rather than reported as broken extensions.
 */
export declare function listExtensions(root: string): Promise<InstalledExtension[]>;
/** Remove one extension's directory. Removing an absent id is a no-op. */
export declare function removeExtension(root: string, id: string): Promise<void>;
