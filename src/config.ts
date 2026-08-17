/**
 * Serializable configuration and defaults for the restty host half. Loader
 * schema validation normally fills defaults; {@link resolveResttyConfig}
 * applies the same defaults for direct callers that bypass the Loader.
 * @module dsh-powerdesk/config
 */
import z from 'schemastery'

/** Tunable restty host limits (every field optional; defaults fill in). */
export interface ResttyConfig {
  /** Terminals per session (the UI tab quota; the host enforces it). */
  terminalsPerSession?: number
  /** How long a disconnected terminal process survives awaiting a reconnect. */
  reconnectGraceMs?: number
  /**
   * Terminal shell (absolute path or bare executable name). Empty = auto:
   * POSIX follows `$SHELL` then the account login shell; Windows follows
   * `DSH_POWERDESK_SHELL`, then probes for `pwsh.exe`, then falls back to the
   * inbox `powershell.exe` (5.1).
   */
  shell?: string
}

/** Schemastery schema for the plugin configuration. */
export const Config: z<ResttyConfig> = z.object({
  terminalsPerSession: z.number().step(1).min(1).default(3),
  reconnectGraceMs: z.number().step(1).min(0).default(30_000),
  shell: z.string().default(''),
})

/** Fully defaulted restty host settings. */
export interface ResolvedResttyConfig {
  terminalsPerSession: number
  reconnectGraceMs: number
  shell: string
}

/**
 * Apply direct-call defaults after Loader schema validation has normally run.
 *
 * @param config - Deployment-provided restty host settings.
 * @returns Complete settings consumed by the host half.
 */
export function resolveResttyConfig(config: ResttyConfig | undefined): ResolvedResttyConfig {
  return {
    terminalsPerSession: config?.terminalsPerSession ?? 3,
    reconnectGraceMs: config?.reconnectGraceMs ?? 30_000,
    shell: config?.shell?.trim() ?? '',
  }
}
