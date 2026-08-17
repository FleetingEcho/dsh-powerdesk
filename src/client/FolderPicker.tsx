/**
 * A folder-browser modal: click through subdirectories (fs.list), "Up" to
 * the parent, "Select this folder" to confirm the CURRENT directory.
 *
 * Browsers deliberately never hand a web page a real filesystem path from a
 * native file/folder picker (`<input type=file webkitdirectory>` and
 * `showDirectoryPicker()` both return sandboxed handles, not paths) — and
 * this plugin's fs.* routes need a real path (they run through Node on the
 * host, not the browser's File API). This modal is the workaround: it's our
 * own directory browser, built on the same fs.list the Explorer tab uses,
 * so picking a folder still feels like a native "choose folder" dialog.
 *
 * Shared by Explorer's "Add folder" and Notes' "Bind folder" flows.
 */
import { useEffect, useState, type ReactNode } from 'react'
import clsx from 'clsx'
import { Modal } from '@deepseek-ai/dsh-client-ui-primitives'
import { Folder } from 'lucide-react'
import { api } from './api.ts'
import { t } from './locales.ts'
import css from './sidebar.module.css'

export interface FolderPickerProps {
  open: boolean
  /** Starting directory; defaults to the host's home directory. */
  initialPath?: string
  onSelect: (path: string) => void
  onClose: () => void
}

function joinPath(dir: string, name: string): string {
  return dir.endsWith('/') || dir.endsWith('\\') ? `${dir}${name}` : `${dir}/${name}`
}

function dirnameOf(path: string): string {
  const trimmed = path.replace(/[/\\]+$/, '')
  const idx = Math.max(trimmed.lastIndexOf('/'), trimmed.lastIndexOf('\\'))
  if (idx < 0) return trimmed
  if (idx === 0) return trimmed[0] === '/' ? '/' : trimmed
  return trimmed.slice(0, idx)
}

export function FolderPicker({ open, initialPath, onSelect, onClose }: FolderPickerProps): ReactNode {
  const [path, setPath] = useState<string | null>(null)
  const [dirs, setDirs] = useState<string[] | null>(null)
  const [error, setError] = useState('')

  // Reset and seed the starting directory whenever the modal opens.
  useEffect(() => {
    if (!open) return
    setDirs(null)
    setError('')
    if (initialPath !== undefined && initialPath.trim() !== '') {
      setPath(initialPath)
      return
    }
    api.fsHome().then((result) => { setPath(result.path) }).catch(() => { setPath('/') })
  }, [open, initialPath])

  useEffect(() => {
    if (!open || path === null) return
    let cancelled = false
    setDirs(null)
    setError('')
    api.fsList(path).then((result) => {
      if (cancelled) return
      setDirs(result.entries.filter(entry => entry.isDir).map(entry => entry.name))
    }).catch((fetchError: unknown) => {
      if (cancelled) return
      setDirs([])
      setError(fetchError instanceof Error ? fetchError.message : String(fetchError))
    })
    return () => { cancelled = true }
  }, [open, path])

  const parent = path !== null ? dirnameOf(path) : null

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={t('folderPickerTitle')}
      closeLabel={t('close')}
      footer={(
        <div className={css.folderPickerFooter}>
          <button type="button" className={css.explorerPill} onClick={onClose}>{t('cancel')}</button>
          <button
            type="button"
            className={css.explorerPill}
            disabled={path === null}
            onClick={() => { if (path !== null) onSelect(path) }}
          >
            {t('folderPickerSelect')}
          </button>
        </div>
      )}
    >
      <div className={css.folderPickerPath}>
        <button
          type="button"
          className={css.explorerPill}
          disabled={path === null || parent === path}
          onClick={() => { if (parent !== null) setPath(parent) }}
        >
          {t('folderPickerUp')}
        </button>
        <span className={css.explorerRoot} title={path ?? ''}>{path ?? ''}</span>
      </div>
      <div className={css.folderPickerList}>
        {dirs === null && error === '' && <div className={css.explorerRow}>{t('loading')}</div>}
        {error !== '' && <div className={clsx(css.explorerRow, css.explorerError)}>{error}</div>}
        {dirs !== null && dirs.length === 0 && error === '' && <div className={css.explorerEmpty}>{t('folderPickerEmpty')}</div>}
        {dirs?.map(name => (
          <button
            key={name}
            type="button"
            className={clsx(css.explorerRow, css.explorerDir)}
            onClick={() => { if (path !== null) setPath(joinPath(path, name)) }}
          >
            <Folder size={14} aria-hidden="true" />
            <span className={css.explorerName}>{name}</span>
          </button>
        ))}
      </div>
    </Modal>
  )
}
