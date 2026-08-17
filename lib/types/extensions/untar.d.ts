/**
 * Minimal ustar reader for extension archives. Vendored rather than depended
 * on (same rationale as src/trust-fence.ts): the only archives this plugin
 * ever reads are its own extension bundles — a handful of small regular files
 * — so the ~5% of tar the format spec covers here is the whole requirement,
 * and an extraction path that handles arbitrary tar features is strictly more
 * attack surface than the feature needs.
 *
 * What is supported: regular files, directories, the ustar `prefix` field,
 * GNU long names (typeflag 'L'), and pax `path=` overrides (typeflag 'x'/'g')
 * — the four ways a real `npm pack` / `tar czf` archive can spell a path.
 *
 * What is REJECTED, loudly: symlinks, hardlinks, device/fifo nodes, absolute
 * paths, drive letters, and any `..` segment. Extension archives are attacker-
 * controlled input (a user can be talked into uploading one), so the classic
 * tar-slip escapes are refused at parse time rather than at write time — the
 * caller never sees an entry whose path could leave the extraction root.
 *
 * Everything is bounded: entry count, per-entry size, and total extracted
 * size are caller-supplied caps, checked BEFORE any allocation, so a crafted
 * header cannot make the reader allocate more than the caller allowed.
 *
 * @module dsh-powerdesk/extensions/untar
 */
/** One extracted regular file. Directory members produce no entry (the
 *  writer creates parents from the file paths). */
export interface TarEntry {
    /** Sanitized, forward-slashed, root-relative path (never absolute, never `..`). */
    path: string;
    data: Uint8Array;
}
/** Extraction bounds. Every field is a hard cap; exceeding one throws. */
export interface UntarLimits {
    /** Maximum number of members (headers) the archive may contain. */
    maxEntries: number;
    /** Maximum size of any single member. */
    maxEntryBytes: number;
    /** Maximum sum of all member sizes. */
    maxTotalBytes: number;
}
/** Default bounds sized for extension bundles (see install.ts). */
export declare const DEFAULT_UNTAR_LIMITS: UntarLimits;
/** A malformed, oversized, or unsafe archive. */
export declare class TarError extends Error {
}
/**
 * Whether a buffer looks like a tar archive (used to tell a `.tar.gz` from a
 * plain gzipped `.js`). Checks the ustar magic of the FIRST header block; the
 * GNU variant writes `ustar ` (space) where POSIX writes `ustar\0`.
 */
export declare function looksLikeTar(buf: Uint8Array): boolean;
/**
 * Sanitize a member path to a root-relative, forward-slashed form, or return
 * `undefined` when it must be refused. This is the tar-slip gate: absolute
 * paths, Windows drive letters, UNC prefixes, `..` segments, backslashes, and
 * embedded NULs are all rejected rather than normalized away — normalizing a
 * hostile path silently accepts an archive that was trying to escape, and
 * there is no legitimate extension archive that needs any of them.
 */
export declare function safeEntryPath(raw: string): string | undefined;
/**
 * Parse a tar archive into its regular-file members.
 *
 * @param buf - the uncompressed archive bytes.
 * @param limits - extraction bounds (defaults sized for extension bundles).
 * @returns every regular file, in archive order, with sanitized paths.
 * @throws {TarError} on a malformed, unsafe, or over-limit archive.
 */
export declare function untar(buf: Uint8Array, limits?: UntarLimits): TarEntry[];
/**
 * Drop a single shared leading directory from every entry, the way
 * `npm pack` wraps its output in `package/`. Only applied when EVERY entry
 * shares one root and at least one entry has something below it — an archive
 * whose files are already at the top level is returned untouched.
 */
export declare function stripCommonRoot(entries: readonly TarEntry[]): TarEntry[];
