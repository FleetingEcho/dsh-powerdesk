/**
 * The Notes tab: bind one local folder, browse only its `.md`/`.markdown`
 * files as a recursive tree (left, width freely draggable via the divider),
 * edit the selected one in the same CodeMirror editor the file-open flow
 * uses (right — syntax-highlighted markdown, Dracula theme, Cmd/Ctrl+S
 * save). New note / new folder / rename / delete round-trip through the
 * fs.* API; the binding is rebindable any time from the header (click the
 * folder name to reopen the folder-picker modal and choose a different one).
 *
 * Row/header actions are icon-only (lucide-react) with a `title` tooltip
 * rather than text labels, to stay compact in a narrow tree column.
 *
 * Unlike the Explorer tab (lazy per-directory fetch, any folder, opens
 * files as separate sidebar tabs), Notes fetches the WHOLE markdown tree up
 * front (folders with no markdown anywhere under them are pruned server-
 * side — see fs-api.ts's `fsListMarkdownTree`) and renders the editor
 * INLINE in the same tab, since a notes folder is small and the point is a
 * single self-contained "notes app" surface, not a general file browser.
 *
 * Lives in the 'editor' lazy chunk (shares the CodeMirror bundle with the
 * plain file editor) — never import this from the core client bundle.
 */
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import clsx from 'clsx'
import { ChevronDown, ChevronRight, File, FilePlus, Folder, FolderPlus, Pencil, Trash2 } from 'lucide-react'
import { api, type MdTreeNode } from './api.ts'
import { readNotesFolder, readNotesTreeWidth, writeNotesFolder, writeNotesTreeWidth, NOTES_TREE_WIDTH_MIN } from './notes-prefs.ts'
import { CodeEditor } from './CodeEditor.tsx'
import { FolderPicker } from './FolderPicker.tsx'
import { t } from './locales.ts'
import css from './sidebar.module.css'

export interface NotesViewProps {
  visible: boolean
}

function basenameOf(path: string): string {
  const trimmed = path.replace(/[/\\]+$/, '')
  const idx = Math.max(trimmed.lastIndexOf('/'), trimmed.lastIndexOf('\\'))
  return idx >= 0 ? trimmed.slice(idx + 1) : trimmed
}

function dirnameOf(path: string): string {
  const trimmed = path.replace(/[/\\]+$/, '')
  const idx = Math.max(trimmed.lastIndexOf('/'), trimmed.lastIndexOf('\\'))
  return idx >= 0 ? trimmed.slice(0, idx) : trimmed
}

function joinPath(dir: string, name: string): string {
  return dir.endsWith('/') || dir.endsWith('\\') ? `${dir}${name}` : `${dir}/${name}`
}

function alertError(error: unknown): void {
  window.alert(error instanceof Error ? error.message : String(error))
}

interface TreeNodeProps {
  node: MdTreeNode
  depth: number
  expanded: Set<string>
  toggle: (path: string) => void
  selected: string | null
  onSelect: (path: string) => void
  onRename: (node: MdTreeNode) => void
  onDelete: (node: MdTreeNode) => void
}

function TreeNode(props: TreeNodeProps): ReactNode {
  const { node, depth, expanded, toggle, selected, onSelect, onRename, onDelete } = props
  const indent = `${String(8 + depth * 22)}px`
  if (node.isDir) {
    const isOpen = expanded.has(node.path)
    return (
      <>
        <div
          className={clsx(css.explorerRow, css.explorerDir)}
          style={{ paddingLeft: indent }}
          role="button"
          tabIndex={0}
          onClick={() => { toggle(node.path) }}
          onKeyDown={(event) => { if (event.key === 'Enter') toggle(node.path) }}
          title={node.path}
        >
          {isOpen ? <ChevronDown size={14} aria-hidden="true" /> : <ChevronRight size={14} aria-hidden="true" />}
          <Folder size={14} aria-hidden="true" />
          <span className={css.explorerName}>{node.name}</span>
        </div>
        {isOpen && node.children?.map(child => (
          <TreeNode key={child.path} node={child} depth={depth + 1} expanded={expanded} toggle={toggle} selected={selected} onSelect={onSelect} onRename={onRename} onDelete={onDelete} />
        ))}
      </>
    )
  }
  return (
    <div
      className={clsx(css.explorerRow, node.path === selected && css.explorerRowActive)}
      style={{ paddingLeft: indent }}
      role="button"
      tabIndex={0}
      onClick={() => { onSelect(node.path) }}
      onKeyDown={(event) => { if (event.key === 'Enter') onSelect(node.path) }}
      title={node.path}
    >
      <File size={14} aria-hidden="true" />
      <span className={css.explorerName}>{node.name}</span>
      <button
        type="button"
        className={css.explorerRef}
        title={t('notesRename')}
        aria-label={t('notesRename')}
        onClick={(event) => { event.stopPropagation(); onRename(node) }}
      >
        <Pencil size={12} aria-hidden="true" />
      </button>
      <button
        type="button"
        className={css.explorerRef}
        title={t('notesDelete')}
        aria-label={t('notesDelete')}
        onClick={(event) => { event.stopPropagation(); onDelete(node) }}
      >
        <Trash2 size={12} aria-hidden="true" />
      </button>
    </div>
  )
}

export function NotesView({ visible }: NotesViewProps): ReactNode {
  const [folder, setFolder] = useState(() => readNotesFolder())
  const [picking, setPicking] = useState(false)
  const [tree, setTree] = useState<MdTreeNode[] | null>(null)
  const [treeError, setTreeError] = useState('')
  const [expanded, setExpanded] = useState<Set<string>>(new Set())
  const [selected, setSelected] = useState<string | null>(null)
  const [treeWidth, setTreeWidth] = useState(() => readNotesTreeWidth())
  const [draggingWidth, setDraggingWidth] = useState(false)
  const widthDrag = useRef({ startX: 0, startWidth: 0 })

  const reload = useCallback(() => {
    if (folder === null) return
    api.fsListMarkdownTree(folder).then((result) => {
      setTree(result.children)
      setTreeError('')
    }).catch((error: unknown) => {
      setTree([])
      setTreeError(error instanceof Error ? error.message : String(error))
    })
  }, [folder])

  useEffect(() => { reload() }, [reload])

  const bind = (path: string): void => {
    const trimmed = path.trim()
    if (trimmed === '') return
    writeNotesFolder(trimmed)
    setFolder(trimmed)
    setSelected(null)
    setTree(null)
    setPicking(false)
  }

  const toggle = (path: string): void => {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(path)) next.delete(path)
      else next.add(path)
      return next
    })
  }

  const newNote = (): void => {
    if (folder === null) return
    const name = window.prompt(t('notesNewNotePrompt'))
    if (name === null || name.trim() === '') return
    const fileName = name.trim().toLowerCase().endsWith('.md') ? name.trim() : `${name.trim()}.md`
    const path = joinPath(folder, fileName)
    api.fsCreate(path).then(() => {
      reload()
      setSelected(path)
    }).catch(alertError)
  }

  const newFolder = (): void => {
    if (folder === null) return
    const name = window.prompt(t('notesNewFolderPrompt'))
    if (name === null || name.trim() === '') return
    api.fsMkdir(joinPath(folder, name.trim())).then(reload).catch(alertError)
  }

  const rename = (node: MdTreeNode): void => {
    const name = window.prompt(t('notesRenamePrompt'), node.name)
    if (name === null || name.trim() === '' || name.trim() === node.name) return
    const to = joinPath(dirnameOf(node.path), name.trim())
    api.fsRename(node.path, to).then(() => {
      reload()
      if (selected === node.path) setSelected(to)
    }).catch(alertError)
  }

  const remove = (node: MdTreeNode): void => {
    if (!window.confirm(t('notesDeleteConfirm', { name: node.name }))) return
    api.fsDelete(node.path).then(() => {
      reload()
      if (selected === node.path) setSelected(null)
    }).catch(alertError)
  }

  if (folder === null) {
    return (
      <div className={css.explorer}>
        <div className={css.explorerHeader}>
          <span className={css.explorerRoot}>{t('notesTabTitle')}</span>
        </div>
        <div className={css.notesBindPrompt}>
          <p className={css.explorerEmpty}>{t('notesBindPrompt')}</p>
          <button type="button" className={css.explorerPill} onClick={() => { setPicking(true) }}>
            {t('notesBindButton')}
          </button>
        </div>
        <FolderPicker open={picking} onSelect={bind} onClose={() => { setPicking(false) }} />
      </div>
    )
  }

  return (
    <div className={css.notesRoot}>
      <div className={css.notesTree} style={{ width: treeWidth }}>
        <div className={css.explorerHeader}>
          <button type="button" className={css.explorerRoot} onClick={() => { setPicking(true) }} title={t('notesRebindHint', { folder })}>
            {basenameOf(folder)}
          </button>
          <button type="button" className={css.explorerPill} title={t('notesNewNote')} aria-label={t('notesNewNote')} onClick={newNote}>
            <FilePlus size={13} aria-hidden="true" />
          </button>
          <button type="button" className={css.explorerPill} title={t('notesNewFolder')} aria-label={t('notesNewFolder')} onClick={newFolder}>
            <FolderPlus size={13} aria-hidden="true" />
          </button>
        </div>
        <FolderPicker open={picking} initialPath={folder} onSelect={bind} onClose={() => { setPicking(false) }} />
        <div className={css.explorerBody}>
          {treeError !== '' && <div className={css.explorerError}>{treeError}</div>}
          {tree !== null && tree.length === 0 && treeError === '' && <div className={css.explorerEmpty}>{t('notesEmptyFolder')}</div>}
          {tree?.map(node => (
            <TreeNode key={node.path} node={node} depth={0} expanded={expanded} toggle={toggle} selected={selected} onSelect={setSelected} onRename={rename} onDelete={remove} />
          ))}
        </div>
      </div>
      <div
        className={clsx(css.divider, css.dividerRow, draggingWidth && css.dividerActive)}
        onPointerDown={(event) => {
          event.preventDefault()
          event.currentTarget.setPointerCapture(event.pointerId)
          widthDrag.current = { startX: event.clientX, startWidth: treeWidth }
          setDraggingWidth(true)
        }}
        onPointerMove={(event) => {
          if (!event.currentTarget.hasPointerCapture(event.pointerId)) return
          const { startX, startWidth } = widthDrag.current
          setTreeWidth(Math.max(NOTES_TREE_WIDTH_MIN, startWidth + (event.clientX - startX)))
        }}
        onPointerUp={(event) => {
          if (!event.currentTarget.hasPointerCapture(event.pointerId)) return
          event.currentTarget.releasePointerCapture(event.pointerId)
          const { startX, startWidth } = widthDrag.current
          const next = Math.max(NOTES_TREE_WIDTH_MIN, startWidth + (event.clientX - startX))
          setTreeWidth(next)
          writeNotesTreeWidth(next)
          setDraggingWidth(false)
        }}
      />
      <div className={css.notesEditor}>
        {selected !== null ? (
          <CodeEditor path={selected} visible={visible} />
        ) : (
          <div className={css.editorPlaceholder}>{t('notesSelectFile')}</div>
        )}
      </div>
    </div>
  )
}
