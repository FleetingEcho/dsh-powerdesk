/**
 * The candidate paths/specifiers for the `rg` binary, in resolution order:
 * an explicit env override, the prebuilt binary shipped next to the plugin,
 * then a plain `rg` on PATH. Exposed for tests.
 */
export declare function ripgrepCandidates(triple: string, pluginRoot: string | null, env?: NodeJS.ProcessEnv, platform?: NodeJS.Platform): readonly string[];
/** A probe function: whether `spec` resolves to a runnable `rg`. Injectable for tests. */
export type RipgrepProber = (spec: string) => boolean;
/** Default prober: an existing file for a path-like spec, a PATH lookup (via
 *  an actual spawn — cheap, `rg --version` exits in a few ms) for a bare name. */
export declare const defaultRipgrepProber: RipgrepProber;
/**
 * Resolve the `rg` binary path once (synchronously) and cache the outcome.
 * Returns null when no candidate resolves; never throws.
 */
export declare function resolveRipgrepPath(prober?: RipgrepProber): string | null;
/** The recorded resolution failure (undefined once a candidate resolves). */
export declare function ripgrepLoadCause(): unknown;
/** Forget the cached outcome (tests only). */
export declare function resetRipgrepCache(): void;
/** Structured status served by the `/powerdesk/api/search.deps` endpoint. */
export type RipgrepDepsStatus = {
    ok: true;
} | {
    ok: false;
    /** Why no `rg` candidate resolved. */
    cause: string;
    /** The pasteable repair command (terminal/cmd). */
    command: string;
    /** The detected profile name (null when undetected → the command defaults to web). */
    profile: string | null;
    /** Optional supplementary hint (fallback command only). */
    note?: string;
};
/** Current ripgrep dependency status (resolved vs missing + repair info). */
export declare function searchDepsStatus(options?: {
    fromFile?: string;
}): RipgrepDepsStatus;
