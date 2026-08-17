import type { RustPtyModule } from './rust-pty.ts';
/** The crate version this plugin ships (keep in sync with rust/Cargo.toml). */
export declare const DSH_POWERDESK_PTY_VERSION = "0.1.0";
/**
 * The WebSocket close-code-1011 reason the host sends when the native pty
 * module is unavailable. The client recognizes this exact marker and fetches
 * the full repair details from `/powerdesk/api/terminal.deps` (a WS close reason
 * is capped at 123 bytes, so the command itself cannot ride the close frame).
 */
export declare const PTY_DEPS_MISSING = "powerdesk-pty-deps-missing";
/** A require-compatible loader, injectable for tests. */
export type NativeRequire = (id: string) => unknown;
/**
 * Resolve the platform triple for the running process. Linux defaults to the
 * gnu ABI (the common case); override with `DSH_POWERDESK_PTY_TRIPLE` for musl
 * (e.g. Alpine: `linux-x64-musl`).
 */
export declare function detectPlatformTriple(platform?: NodeJS.Platform, arch?: string, env?: NodeJS.ProcessEnv): string;
/** The plugin package root (walk-up from the module; works for lib/ and src/ layouts). */
export declare function findPluginRoot(fromFile?: string): string | null;
/** The DSH profile directory this plugin is installed into (null when undetected). */
export declare function findProfileDir(fromFile?: string): string | null;
/**
 * The candidate require specifiers / file paths for the native module, in
 * resolution order (env path → companion package → prebuilt next to plugin).
 * Exposed for tests.
 */
export declare function nativeCandidates(triple: string, pluginRoot: string | null, env?: NodeJS.ProcessEnv): readonly string[];
/**
 * Load the native pty module once (synchronously) and cache the outcome.
 * Returns null when the module or its native binding cannot be loaded; the
 * cause stays queryable through {@link rustPtyLoadCause}. Never throws.
 */
export declare function loadRustPty(requireImpl?: NativeRequire): RustPtyModule | null;
/** The recorded load failure (undefined when the load succeeded or never ran). */
export declare function rustPtyLoadCause(): unknown;
/** Forget the cached outcome (tests only — a real reload is otherwise one-shot). */
export declare function resetRustPtyCache(): void;
/** Load the native pty module or throw the canonical degraded-mode error. */
export declare function loadRequiredRustPty(): RustPtyModule;
/** Options for {@link buildRepairCommand}. */
export interface RepairCommandOptions {
    pluginRoot: string | null;
    profileDir: string | null;
    platform?: NodeJS.Platform;
}
/**
 * The pasteable repair command for a broken native pty install: rerun the
 * plugin's installer in `--repair` mode (idempotent: it re-downloads the
 * platform prebuilt, or rebuilds from source when a Rust toolchain is
 * present). Falls back to the from-source build script when the installer is
 * not shipped (exotic layouts).
 */
export declare function buildRepairCommand(options: RepairCommandOptions): {
    command: string;
    note?: string;
};
/** Structured status served by the `/powerdesk/api/terminal.deps` endpoint. */
export type RustPtyDepsStatus = {
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
/** Current native pty dependency status (loaded vs degraded + repair info). */
export declare function depsStatus(options?: {
    fromFile?: string;
}): RustPtyDepsStatus;
