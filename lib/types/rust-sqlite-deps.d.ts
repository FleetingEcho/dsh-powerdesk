/** The crate version this plugin ships (keep in sync with rust-sqlite/Cargo.toml). */
export declare const DSH_POWERDESK_SQLITE_VERSION = "0.1.0";
/**
 * The error marker the host sends when the native sqlite module is
 * unavailable. The calendar tab recognizes this and fetches the full repair
 * details from `/powerdesk/api/calendar.deps`.
 */
export declare const SQLITE_DEPS_MISSING = "powerdesk-sqlite-deps-missing";
/** A require-compatible loader, injectable for tests. */
export type NativeRequire = (id: string) => unknown;
/** The native Database instance surface the crate exposes (see rust-sqlite/src/lib.rs). */
export interface RustSqliteDatabase {
    /** Run one or more semicolon-separated SQL statements (DDL/migrations). */
    exec(sql: string): void;
    /** Run a parameterised statement; returns the number of rows changed. */
    run(sql: string, params?: unknown[]): number;
    /** Run a parameterised SELECT; returns rows as objects keyed by column name. */
    query<T = Record<string, unknown>>(sql: string, params?: unknown[]): T[];
    /** Close the connection; further calls error. */
    close(): void;
}
/** The native module surface (a single class with a static `open` factory). */
export interface RustSqliteModule {
    Database: {
        open(path: string): RustSqliteDatabase;
    };
}
/**
 * Resolve the platform triple for the running process, honoring the
 * sqlite-specific `DSH_POWERDESK_SQLITE_TRIPLE` override (mapped onto the
 * shared helper's expected env key so the detection logic isn't duplicated).
 */
export declare function detectSqliteTriple(platform?: NodeJS.Platform, arch?: string, env?: NodeJS.ProcessEnv): string;
/**
 * The candidate require specifiers / file paths for the native module, in
 * resolution order (env path → companion package → prebuilt next to plugin).
 * Exposed for tests.
 */
export declare function sqliteCandidates(triple: string, pluginRoot: string | null, env?: NodeJS.ProcessEnv): readonly string[];
/**
 * Load the native sqlite module once (synchronously) and cache the outcome.
 * Returns null when the module or its native binding cannot be loaded; the
 * cause stays queryable through {@link rustSqliteLoadCause}. Never throws.
 */
export declare function loadRustSqlite(requireImpl?: NativeRequire): RustSqliteModule | null;
/** The recorded load failure (undefined when the load succeeded or never ran). */
export declare function rustSqliteLoadCause(): unknown;
/** Forget the cached outcome (tests only — a real reload is otherwise one-shot). */
export declare function resetRustSqliteCache(): void;
/** Load the native sqlite module or throw the canonical degraded-mode error. */
export declare function loadRequiredRustSqlite(): RustSqliteModule;
/** Structured status served by the `/powerdesk/api/calendar.deps` endpoint. */
export type RustSqliteDepsStatus = {
    ok: true;
} | {
    ok: false;
    /** The load-time error message (module missing, native binding broken…). */
    cause: string;
    /** The pasteable repair command (terminal/cmd). */
    command: string;
    /** The detected profile name (null when undetected → the command defaults to web). */
    profile: string | null;
    /** Optional supplementary hint (fallback command only). */
    note?: string;
};
/** Current native sqlite dependency status (loaded vs degraded + repair info). */
export declare function sqliteDepsStatus(options?: {
    fromFile?: string;
}): RustSqliteDepsStatus;
export { findProfileDir, findPluginRoot } from './rust-pty-deps.ts';
