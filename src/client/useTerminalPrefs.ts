/**
 * Reactive binding to the global terminal-appearance prefs for the
 * `useSyncExternalStore` API. The Powerdesk Side card writes via
 * {@link ./prefs.ts}'s `writePrefsToLocalStorage`, which notifies the
 * {@link subscribeTerminalPrefs} listeners; any mounted terminal subscribed
 * through this hook re-renders with the new prefs without a remount.
 *
 * The snapshot is cached in `prefs.ts` and replaced (not mutated) on each
 * write, so `useSyncExternalStore` sees a stable reference between writes.
 */
import { useSyncExternalStore } from 'react'
import { getTerminalPrefsSnapshot, subscribeTerminalPrefs, type ResttyPrefs } from './prefs.ts'

/** Subscribe to the global terminal-appearance prefs and re-render on change. */
export function useTerminalPrefs(): ResttyPrefs {
  return useSyncExternalStore(subscribeTerminalPrefs, getTerminalPrefsSnapshot, getTerminalPrefsSnapshot)
}
