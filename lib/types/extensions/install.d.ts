import { type InstalledExtension } from './registry.ts';
/** Upload bound, before decompression (the API also caps the request body). */
export declare const MAX_UPLOAD_BYTES: number;
/**
 * Inflated-size bound. Enforced by zlib itself via `maxOutputLength`, so a
 * gzip bomb fails inside the inflate rather than after materializing — the
 * cap is on what is ALLOCATED, not on what is inspected afterwards.
 */
export declare const MAX_INFLATED_BYTES: number;
/** What the caller knows about the upload that the bytes cannot tell us. */
export interface UploadInput {
    /** The browser-reported file name; recorded as provenance, never trusted. */
    filename: string;
    data: Uint8Array;
    /**
     * Identity for a bare-bundle upload (no manifest in the payload). Ignored
     * when the archive carries its own `powerdesk.json`.
     */
    fallback?: {
        id: string;
        title: string;
        icon?: string;
    };
}
/**
 * Install one uploaded extension, replacing any existing install of the same
 * id.
 *
 * @param root - the extensions directory (see resolveExtensionsDir).
 * @param upload - the uploaded bytes plus dialog-supplied identity.
 * @returns the freshly installed extension, read back from disk.
 * @throws {ExtensionError} for any rejected upload, with a message written
 * for the settings dialog.
 */
export declare function installExtension(root: string, upload: UploadInput): Promise<InstalledExtension>;
