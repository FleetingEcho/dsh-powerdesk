/**
 * The file explorer tab: a directory tree over one bookmarked local folder
 * ("+" adds a typed path and makes it the new root, "-" removes it and falls
 * back to the previous one — see explorer-prefs.ts; there is no separate
 * folder-switcher UI), clicking a file opens it in the editor tab via
 * `onOpenFile` (wired to `service.openFile` in SplitPane.tsx). Also doubles
 * as a "notes" browser: point a bookmark at wherever you keep notes and
 * browse/open .md files the same way as any other folder.
 *
 * Each file row reveals two copy actions on hover: "@" copies the path
 * relative to the current root (for @-mentioning in chat), a copy-glyph
 * button copies the absolute path.
 *
 * Directory expand state lives in the shared `SidebarState.expanded` set
 * (via `expanded`/`onToggleDir`, threaded through `TabComponentProps`) so it
 * survives tab switches within a session; bookmarks live in localStorage
 * (see explorer-prefs.ts) — independent of any session, so they persist
 * across reloads and are shared by every conversation.
 */
import { useCallback, useEffect, useState, type ReactNode } from 'react'
import clsx from 'clsx'
import { ChevronDown, ChevronRight, Copy, File, Folder, FolderMinus, FolderPlus, Search as SearchGlyph } from 'lucide-react'
import { api, type FsEntry } from './api.ts'
import {
  makeBookmarkId,
  readExplorerPrefs,
  writeExplorerPrefs,
  type ExplorerBookmark,
} from './explorer-prefs.ts'
import { FolderPicker } from './FolderPicker.tsx'
import { SearchView } from './SearchView.tsx'
import { t } from './locales.ts'
import css from './sidebar.module.css'

export interface FileExplorerProps {
  /** The session's cwd, used as the root when no bookmark is active. */
  cwd?: string
  expanded: string[]
  onToggleDir: (path: string) => void
  onOpenFile: (path: string) => void
  /** Open a file and scroll/select `line` (search-mode result clicks). */
  onOpenFileAtLine?: (path: string, line: number) => void
}

/** One loaded (or loading/errored) directory's children, keyed by abs path. */
type DirState = { status: 'loading' } | { status: 'ready'; entries: FsEntry[] } | { status: 'error'; message: string }

function basenameOf(path: string): string {
  const trimmed = path.replace(/[/\\]+$/, '')
  const idx = Math.max(trimmed.lastIndexOf('/'), trimmed.lastIndexOf('\\'))
  return idx >= 0 ? trimmed.slice(idx + 1) : trimmed
}

function joinPath(dir: string, name: string): string {
  return dir.endsWith('/') || dir.endsWith('\\') ? `${dir}${name}` : `${dir}/${name}`
}

/** `path` relative to `root` (falls back to the absolute path when `path`
 *  isn't actually under `root` — should not happen, the tree only ever
 *  descends from `root`). Exported for testing. */
export function relativeTo(root: string, path: string): string {
  const normalizedRoot = root.replace(/[/\\]+$/, '')
  if (path === normalizedRoot) return basenameOf(normalizedRoot)
  if (path.startsWith(`${normalizedRoot}/`) || path.startsWith(`${normalizedRoot}\\`)) {
    return path.slice(normalizedRoot.length + 1)
  }
  return path
}

/** Write `text` to the clipboard; `onDone` fires only on success (silently
 *  drops the "copied" feedback on failure — permissions, insecure context). */
function copyToClipboard(text: string, onDone: () => void): void {
  navigator.clipboard?.writeText(text).then(onDone).catch(() => {})
}

/**
 * The relative-path reference copied by the `@` button. Always prefixed with
 * `@` (the user's `@file` mention convention) — clicking the `@` icon on
 * `package.json` copies `@package.json`, on `src/index.ts` copies
 * `@src/index.ts`. The `@` is part of the copied text, not just the icon.
 * Exported for testing.
 */
export function atReference(root: string, path: string): string {
  return `@${relativeTo(root, path)}`
}

interface TreeProps {
  root: string
  expanded: string[]
  dirs: Map<string, DirState>
  onToggleDir: (path: string) => void
  onOpenFile: (path: string) => void
  load: (path: string) => void
}

/** One file row: opens on click; hover reveals @ (copy relative path) and a
 *  copy-glyph button (copy absolute path), each with transient "Copied" feedback. */
function FileRow(props: { path: string; name: string; root: string; depth: number; onOpenFile: (path: string) => void }): ReactNode {
  const { path, name, root, depth, onOpenFile } = props
  const [copied, setCopied] = useState<'relative' | 'absolute' | null>(null)
  useEffect(() => {
    if (copied === null) return
    const timer = window.setTimeout(() => { setCopied(null) }, 1200)
    return () => { window.clearTimeout(timer) }
  }, [copied])

  return (
    <div
      className={css.explorerRow}
      style={{ paddingLeft: `${String(8 + depth * 22)}px` }}
      role="button"
      tabIndex={0}
      onClick={() => { onOpenFile(path) }}
      onKeyDown={(event) => { if (event.key === 'Enter') onOpenFile(path) }}
      title={name}
    >
      <File size={14} aria-hidden="true" />
      <span className={css.explorerName}>{name}</span>
      {copied === 'relative' ? (
        <span className={css.explorerCopied}>{t('explorerCopied')}</span>
      ) : (
        <button
          type="button"
          className={css.explorerRef}
          title={t('explorerCopyRelative')}
          aria-label={t('explorerCopyRelative')}
          onClick={(event) => {
            event.stopPropagation()
            copyToClipboard(atReference(root, path), () => { setCopied('relative') })
          }}
        >
          @
        </button>
      )}
      {copied === 'absolute' ? (
        <span className={css.explorerCopied}>{t('explorerCopied')}</span>
      ) : (
        <button
          type="button"
          className={css.explorerRef}
          title={t('explorerCopyAbsolute')}
          aria-label={t('explorerCopyAbsolute')}
          onClick={(event) => {
            event.stopPropagation()
            copyToClipboard(path, () => { setCopied('absolute') })
          }}
        >
          <Copy size={12} aria-hidden="true" />
        </button>
      )}
    </div>
  )
}

/** One directory's children: fetches lazily on first render, re-fetches never
 *  (the tree is a browse view, not a live filesystem watcher). */
function DirChildren(props: TreeProps & { path: string; depth: number }): ReactNode {
  const { path, depth, root, expanded, dirs, onToggleDir, onOpenFile, load } = props
  useEffect(() => { if (!dirs.has(path)) load(path) }, [path, dirs, load])
  const state = dirs.get(path)
  const indent = `${String(8 + depth * 22)}px`
  if (state === undefined || state.status === 'loading') {
    return <div className={css.explorerRow} style={{ paddingLeft: indent }}>{t('loading')}</div>
  }
  if (state.status === 'error') {
    return <div className={clsx(css.explorerRow, css.explorerError)} style={{ paddingLeft: indent }}>{state.message}</div>
  }
  if (state.entries.length === 0) {
    return <div className={css.explorerEmpty}>{t('explorerEmptyDir')}</div>
  }
  return (
    <>
      {state.entries.map(entry => (
        entry.isDir
          ? (
            <DirRow
              key={entry.name}
              path={joinPath(path, entry.name)}
              name={entry.name}
              depth={depth}
              root={root}
              expanded={expanded}
              dirs={dirs}
              onToggleDir={onToggleDir}
              onOpenFile={onOpenFile}
              load={load}
            />
            )
          : (
            <FileRow
              key={entry.name}
              path={joinPath(path, entry.name)}
              name={entry.name}
              root={root}
              depth={depth}
              onOpenFile={onOpenFile}
            />
            )
      ))}
    </>
  )
}

/** One directory's own row (toggles expand) plus its children when open. */
function DirRow(props: TreeProps & { path: string; name: string; depth: number }): ReactNode {
  const { path, name, depth, root, expanded, dirs, onToggleDir, onOpenFile, load } = props
  const isOpen = expanded.includes(path)
  return (
    <>
      <button
        type="button"
        className={clsx(css.explorerRow, css.explorerDir)}
        style={{ paddingLeft: `${String(8 + depth * 22)}px` }}
        onClick={() => { onToggleDir(path) }}
        title={path}
      >
        {isOpen ? <ChevronDown size={14} aria-hidden="true" /> : <ChevronRight size={14} aria-hidden="true" />}
        <Folder size={14} aria-hidden="true" />
        <span className={css.explorerName}>{name}</span>
      </button>
      {isOpen && (
        <DirChildren
          path={path}
          depth={depth + 1}
          root={root}
          expanded={expanded}
          dirs={dirs}
          onToggleDir={onToggleDir}
          onOpenFile={onOpenFile}
          load={load}
        />
      )}
    </>
  )
}

export function FileExplorer(props: FileExplorerProps): ReactNode {
  const { cwd, expanded, onToggleDir, onOpenFile, onOpenFileAtLine } = props
  const [prefs, setPrefs] = useState(() => readExplorerPrefs())
  const [picking, setPicking] = useState(false)
  const [dirs, setDirs] = useState<Map<string, DirState>>(new Map())
  // Files/Search are two modes of this ONE tab (mirrors VSCode's Explorer /
  // Search sidebar views) rather than a separate tab you'd have to split a
  // pane open to reach — see SearchView.tsx for the search UI itself, reused
  // here unwrapped from its own tab chrome.
  const [mode, setMode] = useState<'files' | 'search'>('files')
  const [rootCopied, setRootCopied] = useState(false)
  useEffect(() => {
    if (!rootCopied) return
    const timer = window.setTimeout(() => { setRootCopied(false) }, 1200)
    return () => { window.clearTimeout(timer) }
  }, [rootCopied])

  const active = prefs.bookmarks.find(b => b.id === prefs.activeId)
  const root = active?.path ?? cwd ?? '.'

  const persist = useCallback((next: typeof prefs) => {
    setPrefs(next)
    writeExplorerPrefs(next)
  }, [])

  const load = useCallback((path: string) => {
    setDirs(prev => new Map(prev).set(path, { status: 'loading' }))
    api.fsList(path).then((result) => {
      setDirs(prev => new Map(prev).set(path, { status: 'ready', entries: result.entries }))
    }).catch((error: unknown) => {
      setDirs(prev => new Map(prev).set(path, {
        status: 'error',
        message: error instanceof Error ? error.message : String(error),
      }))
    })
  }, [])

  // Reload the root whenever it changes (bookmark switch, cwd change).
  useEffect(() => { load(root) }, [root, load])

  const addBookmark = (path: string): void => {
    const trimmed = path.trim()
    if (trimmed === '') return
    const bookmark: ExplorerBookmark = { id: makeBookmarkId(), label: basenameOf(trimmed) || trimmed, path: trimmed }
    persist({ bookmarks: [...prefs.bookmarks, bookmark], activeId: bookmark.id })
    setPicking(false)
  }

  const removeActive = (): void => {
    if (active === undefined) return
    const bookmarks = prefs.bookmarks.filter(b => b.id !== active.id)
    persist({ bookmarks, activeId: bookmarks[0]?.id ?? null })
  }

  return (
    <div className={css.explorer}>
      <div className={css.explorerHeader}>
        <div className={css.explorerHeaderPath}>
          {/* No bookmark-switcher trigger here: this pane's root is fixed
              (session cwd, or whatever "+"/"-" below set it to) — Explorer
              doesn't support changing folders in place, so a dropdown for
              that never belonged here. Clicking the path just copies it. */}
          <button
            type="button"
            className={css.explorerRoot}
            onClick={() => { copyToClipboard(root, () => { setRootCopied(true) }) }}
            title={root}
          >
            {rootCopied ? t('explorerCopied') : (active?.label ?? root)}
          </button>
        </div>
        <div className={css.explorerHeaderActions}>
          <button
            type="button"
            className={clsx(css.explorerPill, mode === 'search' && css.explorerPillActive)}
            title={t('searchTabTitle')}
            aria-label={t('searchTabTitle')}
            aria-pressed={mode === 'search'}
            onClick={() => { setMode(m => m === 'search' ? 'files' : 'search') }}
          >
            <SearchGlyph size={13} aria-hidden="true" />
          </button>
          <button
            type="button"
            className={css.explorerPill}
            title={t('explorerAddFolder')}
            aria-label={t('explorerAddFolder')}
            onClick={() => { setPicking(true) }}
          >
            <FolderPlus size={13} aria-hidden="true" />
          </button>
          {active !== undefined && (
            <button
              type="button"
              className={css.explorerPill}
              title={t('explorerRemoveFolder')}
              aria-label={t('explorerRemoveFolder')}
              onClick={removeActive}
            >
              <FolderMinus size={13} aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
      <FolderPicker
        open={picking}
        initialPath={root}
        onSelect={addBookmark}
        onClose={() => { setPicking(false) }}
      />
      {mode === 'search' ? (
        <SearchView cwd={root} onOpenFileAtLine={onOpenFileAtLine ?? ((): void => {})} />
      ) : (
        <div className={css.explorerBody}>
          <DirChildren
            path={root}
            depth={0}
            root={root}
            expanded={expanded}
            dirs={dirs}
            onToggleDir={onToggleDir}
            onOpenFile={onOpenFile}
            load={load}
          />
        </div>
      )}
    </div>
  )
}
