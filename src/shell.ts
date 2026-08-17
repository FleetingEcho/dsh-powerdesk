/**
 * Interactive shell resolution for the restty terminal — the same logic a
 * terminal emulator uses, with explicit injection points so the Windows
 * chain is testable from POSIX runners. An explicitly configured shell (the
 * `shell` config field) wins, then `$SHELL` on POSIX (deployment override),
 * then the account's login shell from passwd, then `/bin/bash`. The passwd
 * step matters because service managers and container inits often start dsh
 * without `SHELL`, and the tab should still open the user's login shell
 * (e.g. zsh) instead of silently degrading to bash.
 *
 * Windows chain: explicit shell → `DSH_POWERDESK_SHELL` env override → first
 * `pwsh.exe` found on PATH or in a known install directory → the 5.1
 * fallback (`powershell.exe`).
 */
import { existsSync } from 'node:fs'
import { win32 as win32Path } from 'node:path'
import { userInfo } from 'node:os'

/** Inputs for {@link defaultShell} resolution (every field optional). */
export interface ShellResolutionOptions {
  /** Platform override (defaults to `process.platform`). */
  platform?: NodeJS.Platform
  /** Environment override; the resolver reads SHELL, DSH_POWERDESK_SHELL, PATH,
   *  ProgramW6432, ProgramFiles, LOCALAPPDATA. */
  env?: NodeJS.ProcessEnv
  /** Explicitly configured shell (the `shell` config field); wins over every
   *  automatic source. Empty means unset. */
  explicit?: string
  /** File-existence probe override (defaults to `existsSync`). */
  exists?: (path: string) => boolean
}

/**
 * Candidate directories that may contain a `pwsh.exe` on Windows: PATH
 * entries first, then the well-known machine/user install locations
 * (including preview channels and per-user MSI/portable layouts). De-duped
 * while preserving priority order.
 */
function windowsPwshCandidateDirs(env: NodeJS.ProcessEnv): string[] {
  const dirs: string[] = []
  const pathEntries = env.PATH
  if (pathEntries !== undefined) {
    for (const entry of pathEntries.split(';')) {
      const trimmed = entry.trim()
      if (trimmed !== '') dirs.push(trimmed)
    }
  }
  for (const programFiles of [env.ProgramW6432, env.ProgramFiles]) {
    if (programFiles === undefined || programFiles.trim() === '') continue
    dirs.push(win32Path.join(programFiles, 'PowerShell', '7'))
    dirs.push(win32Path.join(programFiles, 'PowerShell', '7-preview'))
  }
  const localAppData = env.LOCALAPPDATA
  if (localAppData !== undefined && localAppData.trim() !== '') {
    dirs.push(win32Path.join(localAppData, 'Microsoft', 'PowerShell', '7'))
    dirs.push(win32Path.join(localAppData, 'Microsoft', 'PowerShell', '7-preview'))
    dirs.push(win32Path.join(localAppData, 'Programs', 'PowerShell', '7'))
    dirs.push(win32Path.join(localAppData, 'Programs', 'PowerShell', '7-preview'))
  }
  return [...new Set(dirs)]
}

/** The interactive shell for this platform (see the module doc). */
export function defaultShell(options: ShellResolutionOptions = {}): string {
  const platform = options.platform ?? process.platform
  const env = options.env ?? process.env
  const exists = options.exists ?? existsSync
  const explicit = options.explicit
  if (explicit !== undefined && explicit.trim() !== '') return explicit.trim()
  if (platform === 'win32') {
    const envShell = env.DSH_POWERDESK_SHELL
    if (envShell !== undefined && envShell.trim() !== '') return envShell.trim()
    for (const dir of windowsPwshCandidateDirs(env)) {
      const candidate = win32Path.join(dir, 'pwsh.exe')
      if (exists(candidate)) return candidate
    }
    return 'powershell.exe'
  }
  const envShell = env.SHELL
  if (envShell !== undefined && envShell.trim() !== '') return envShell.trim()
  // userInfo() throws when the uid has no passwd entry (rare chroots);
  // without a login shell there is nothing better than the bash default.
  try {
    const loginShell = userInfo().shell
    if (typeof loginShell === 'string' && loginShell.trim() !== '') return loginShell
  } catch {
    // no passwd entry: fall through to /bin/bash
  }
  return '/bin/bash'
}

/**
 * Spawn arguments that make the shell behave like a terminal-emulator tab:
 * POSIX shells start as login shells (`-l`) so they read the profile files
 * (`~/.profile`, `~/.zprofile`); Windows PowerShell takes no login flag.
 */
export function shellSpawnArgs(platform: NodeJS.Platform = process.platform): string[] {
  return platform === 'win32' ? [] : ['-l']
}
