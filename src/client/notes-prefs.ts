/**
 * The Notes tab's bound folder: a SINGLE path (unlike Explorer's multi-
 * bookmark list — Notes is meant to point at one notes folder, rebindable
 * any time). Persisted in localStorage, independent of any session.
 */
const STORAGE_KEY = 'dsh-powerdesk:notes-folder'

/** The bound notes folder, or null when never bound. */
export function readNotesFolder(): string | null {
  if (typeof localStorage === 'undefined') return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw !== null && raw.trim() !== '' ? raw : null
  } catch {
    return null
  }
}

/** Bind (or rebind) the notes folder; pass null to unbind. */
export function writeNotesFolder(path: string | null): void {
  if (typeof localStorage === 'undefined') return
  try {
    if (path === null) localStorage.removeItem(STORAGE_KEY)
    else localStorage.setItem(STORAGE_KEY, path)
  } catch {
    // Quota / private mode: the binding stays in-memory for this session.
  }
}

/** The Notes tree column's dragged width (px). */
const TREE_WIDTH_KEY = 'dsh-powerdesk:notes-tree-width'
export const NOTES_TREE_WIDTH_DEFAULT = 240
export const NOTES_TREE_WIDTH_MIN = 160

/** The persisted tree column width, or the default when never dragged. */
export function readNotesTreeWidth(): number {
  if (typeof localStorage === 'undefined') return NOTES_TREE_WIDTH_DEFAULT
  try {
    const raw = localStorage.getItem(TREE_WIDTH_KEY)
    const parsed = raw === null ? NaN : Number.parseInt(raw, 10)
    return Number.isFinite(parsed) ? Math.max(NOTES_TREE_WIDTH_MIN, parsed) : NOTES_TREE_WIDTH_DEFAULT
  } catch {
    return NOTES_TREE_WIDTH_DEFAULT
  }
}

/** Persist the tree column width. */
export function writeNotesTreeWidth(width: number): void {
  if (typeof localStorage === 'undefined') return
  try {
    localStorage.setItem(TREE_WIDTH_KEY, String(Math.round(width)))
  } catch {
    // Quota / private mode: the width stays in-memory for this session.
  }
}
