/**
 * Bookmarked local folders the Explorer tab switches between, plus which one
 * is active. Persisted in localStorage (same standalone pattern as
 * {@link ./prefs.ts}'s ResttyPrefs) — independent of any conversation's cwd,
 * so a bookmark survives switching sessions and stays put across reloads.
 */

/** One bookmarked folder. */
export interface ExplorerBookmark {
  id: string
  /** Display label (defaults to the folder's basename when added). */
  label: string
  /** Absolute (or shell-resolvable) path to the folder. */
  path: string
}

export interface ExplorerPrefs {
  bookmarks: ExplorerBookmark[]
  /** The bookmark id currently browsed, or null (falls back to the session cwd). */
  activeId: string | null
}

const STORAGE_KEY = 'dsh-powerdesk:explorer-bookmarks'

const DEFAULT_PREFS: ExplorerPrefs = { bookmarks: [], activeId: null }

function isBookmark(value: unknown): value is ExplorerBookmark {
  if (typeof value !== 'object' || value === null) return false
  const record = value as Record<string, unknown>
  return typeof record.id === 'string' && typeof record.label === 'string' && typeof record.path === 'string'
}

/** Read the bookmark list + active id from localStorage (defaults when absent/malformed). */
export function readExplorerPrefs(): ExplorerPrefs {
  if (typeof localStorage === 'undefined') return { ...DEFAULT_PREFS }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw === null) return { ...DEFAULT_PREFS }
    const parsed = JSON.parse(raw) as Partial<ExplorerPrefs>
    const bookmarks = Array.isArray(parsed.bookmarks) ? parsed.bookmarks.filter(isBookmark) : []
    const activeId = typeof parsed.activeId === 'string' && bookmarks.some(b => b.id === parsed.activeId)
      ? parsed.activeId
      : null
    return { bookmarks, activeId }
  } catch {
    return { ...DEFAULT_PREFS }
  }
}

/** Persist the full bookmark list + active id. */
export function writeExplorerPrefs(prefs: ExplorerPrefs): void {
  if (typeof localStorage === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs))
  } catch {
    // Quota / private mode: bookmarks stay in-memory for this session.
  }
}

let idCounter = 0

/** Mint a fresh bookmark id (monotonic within the tab's lifetime). */
export function makeBookmarkId(): string {
  idCounter += 1
  return `bm-${Date.now().toString(36)}-${String(idCounter)}`
}
