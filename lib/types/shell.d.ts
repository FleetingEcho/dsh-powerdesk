/** Inputs for {@link defaultShell} resolution (every field optional). */
export interface ShellResolutionOptions {
    /** Platform override (defaults to `process.platform`). */
    platform?: NodeJS.Platform;
    /** Environment override; the resolver reads SHELL, DSH_RESTTY_SHELL, PATH,
     *  ProgramW6432, ProgramFiles, LOCALAPPDATA. */
    env?: NodeJS.ProcessEnv;
    /** Explicitly configured shell (the `shell` config field); wins over every
     *  automatic source. Empty means unset. */
    explicit?: string;
    /** File-existence probe override (defaults to `existsSync`). */
    exists?: (path: string) => boolean;
}
/** The interactive shell for this platform (see the module doc). */
export declare function defaultShell(options?: ShellResolutionOptions): string;
/**
 * Spawn arguments that make the shell behave like a terminal-emulator tab:
 * POSIX shells start as login shells (`-l`) so they read the profile files
 * (`~/.profile`, `~/.zprofile`); Windows PowerShell takes no login flag.
 */
export declare function shellSpawnArgs(platform?: NodeJS.Platform): string[];
