/**
 * The Extensions block of the Powerdesk settings card: install, list, inspect,
 * and remove user-installed extensions.
 *
 * Two upload shapes are handled, decided by the HOST from the uploaded bytes
 * (see src/extensions/install.ts), not here:
 *
 * - an archive carrying `powerdesk.json` installs directly;
 * - a bare bundle script has no manifest, so the host rejects it with a
 *   message and this panel then asks for an id + display name and retries.
 *
 * Doing it that way — attempt, then prompt on the specific rejection — keeps
 * a single source of truth for what an archive is. The alternative (sniffing
 * gzip/tar magic in the browser to decide which dialog to show) would put a
 * second, drifting copy of the format rules on the client.
 *
 * Trust: an extension runs with this page's full privileges, so the warning
 * is always visible rather than shown once. The on-disk location and the
 * upload's sha256 are surfaced per extension so a user can audit what is
 * actually being executed.
 */
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { api, toBase64, type ExtensionListResult, type InstalledExtension } from './api.ts'
import type { ExtensionHost } from './extensions.ts'
import { t } from './locales.ts'
import css from './sidebar.module.css'

/** Props: the host-side registration owner the panel refreshes after writes. */
export interface ExtensionsPanelProps {
  extensions: ExtensionHost | undefined
}

/** A pending bare-script upload awaiting an id + display name. */
interface PendingBare {
  filename: string
  dataBase64: string
}

/** Human-readable byte size for the per-extension detail line. */
function formatBytes(bytes: number | undefined): string {
  if (bytes === undefined) return ''
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

/** Local-time install date, or '' when the record is missing. */
function formatWhen(iso: string | undefined): string {
  if (iso === undefined) return ''
  const parsed = Date.parse(iso)
  return Number.isNaN(parsed) ? '' : new Date(parsed).toLocaleString()
}

/** The host's rejection message for a manifest-less upload (install.ts). */
function isBareScriptRejection(message: string): boolean {
  return message.includes('id and a title')
}

/**
 * Whether a failed `ext.list` means the running host half predates the
 * extensions feature — it answers 404 `unknown restty API method` for a
 * route it does not have. This is the single most likely failure right after
 * an upgrade: the client half is re-fetched from disk on a page refresh
 * while Node still holds the previous host half in memory, so the two halves
 * disagree until DSH is restarted. Worth naming explicitly, because the
 * generic advice ("check the API") sends the user looking in the wrong place.
 */
function isStaleHostHalf(message: string): boolean {
  return message.includes('unknown restty API method')
}

/** One installed extension's row: identity, provenance, and Remove. */
function ExtensionRow(props: {
  extension: InstalledExtension
  busy: boolean
  onRemove: (id: string) => void
}): ReactNode {
  const { extension, busy, onRemove } = props
  const manifest = extension.manifest
  const broken = manifest === undefined
  return (
    <div className={css.extRow}>
      <span className={css.extRowIcon} aria-hidden="true">{manifest?.icon ?? '🧩'}</span>
      <div className={css.extRowBody}>
        <span className={css.extRowTitle}>{manifest?.title ?? extension.id}</span>
        <span className={css.extRowMeta}>
          {broken
            ? `${t('extBroken')}: ${extension.error ?? ''}`
            : [
                extension.id,
                formatBytes(extension.bundleBytes),
                extension.install !== undefined ? t('extInstalled', { when: formatWhen(extension.install.installedAt) }) : '',
                extension.install !== undefined && extension.install.sourceFilename !== ''
                  ? t('extSource', { file: extension.install.sourceFilename })
                  : '',
              ].filter(part => part !== '').join(' · ')}
        </span>
        {/* The exact path and content hash of what will execute — the only
            way a user can audit an extension after installing it. */}
        <span className={css.extRowPath} title={extension.install?.sha256 ?? ''}>
          {extension.dir}
          {extension.install?.sha256 !== undefined && extension.install.sha256 !== ''
            ? ` · sha256 ${extension.install.sha256.slice(0, 12)}…`
            : ''}
        </span>
      </div>
      <button
        type="button"
        className={css.extRowRemove}
        disabled={busy}
        onClick={() => { onRemove(extension.id) }}
      >
        {t('extRemove')}
      </button>
    </div>
  )
}

/** The id + name prompt shown when a bare script has no manifest. */
function BarePrompt(props: {
  pending: PendingBare
  busy: boolean
  onCancel: () => void
  onConfirm: (id: string, title: string) => void
}): ReactNode {
  const { pending, busy, onCancel, onConfirm } = props
  const [id, setId] = useState('')
  const [title, setTitle] = useState('')
  const valid = /^[a-z0-9][a-z0-9-]{0,63}$/.test(id) && title.trim() !== ''
  return (
    <div className={css.extPrompt}>
      <p className={css.extPromptHint}>{t('extBareHint')}</p>
      <p className={css.extPromptFile}>{pending.filename}</p>
      <label className={css.extPromptField}>
        <span>{t('extIdLabel')}</span>
        <input
          type="text"
          value={id}
          placeholder={t('extIdPlaceholder')}
          onChange={(event) => { setId(event.target.value) }}
        />
      </label>
      <label className={css.extPromptField}>
        <span>{t('extTitleLabel')}</span>
        <input
          type="text"
          value={title}
          placeholder={t('extTitlePlaceholder')}
          onChange={(event) => { setTitle(event.target.value) }}
        />
      </label>
      <div className={css.extPromptActions}>
        <button type="button" onClick={onCancel} disabled={busy}>{t('extCancel')}</button>
        <button
          type="button"
          className={css.extPromptPrimary}
          disabled={!valid || busy}
          onClick={() => { onConfirm(id, title.trim()) }}
        >
          {busy ? t('extInstalling') : t('extConfirmInstall')}
        </button>
      </div>
    </div>
  )
}

/**
 * Render the Extensions block.
 * @param props - the ExtensionHost whose registrations follow this UI.
 */
export function ExtensionsPanel({ extensions }: ExtensionsPanelProps): ReactNode {
  // `error` widens the host's reply: a failed list also reports
  // `enabled: false`, and the two must render differently (see the render).
  const [listing, setListing] = useState<(ExtensionListResult & { error?: string }) | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [pending, setPending] = useState<PendingBare | null>(null)
  const fileInput = useRef<HTMLInputElement | null>(null)
  // Guards a setState after the settings modal closes mid-request.
  const alive = useRef(true)
  useEffect(() => () => { alive.current = false }, [])

  /** Re-read the installed list AND re-register the tabs from it. */
  const refresh = useCallback(async (): Promise<void> => {
    // Going through the ExtensionHost (rather than calling api.extList here)
    // keeps the visible list and the registered tabs derived from the same
    // fetch — they cannot disagree about what is installed.
    if (extensions !== undefined) {
      const result = await extensions.refresh()
      if (alive.current) setListing(result)
      return
    }
    try {
      const result = await api.extList()
      if (alive.current) setListing(result)
    } catch (fetchError) {
      if (alive.current) setError(fetchError instanceof Error ? fetchError.message : String(fetchError))
    }
  }, [extensions])

  useEffect(() => { void refresh() }, [refresh])

  /** POST one upload, handling the "needs an id/title" rejection specially. */
  const install = useCallback(async (
    upload: { filename: string; dataBase64: string; id?: string; title?: string },
  ): Promise<void> => {
    setBusy(true)
    setError(null)
    setNotice(null)
    try {
      const installed = await api.extInstall(upload)
      if (!alive.current) return
      setPending(null)
      setNotice(t('extInstalledOk', { title: installed.manifest?.title ?? installed.id }))
      await refresh()
    } catch (installError) {
      if (!alive.current) return
      const message = installError instanceof Error ? installError.message : String(installError)
      // A manifest-less upload is not a failure yet — collect the identity
      // the archive could not supply and retry with it.
      if (upload.id === undefined && isBareScriptRejection(message)) {
        setPending({ filename: upload.filename, dataBase64: upload.dataBase64 })
      } else {
        setError(message)
      }
    } finally {
      if (alive.current) setBusy(false)
    }
  }, [refresh])

  const onFile = useCallback(async (file: File): Promise<void> => {
    const dataBase64 = toBase64(new Uint8Array(await file.arrayBuffer()))
    await install({ filename: file.name, dataBase64 })
  }, [install])

  const onRemove = useCallback(async (id: string): Promise<void> => {
    if (!window.confirm(t('extRemoveConfirm'))) return
    setBusy(true)
    setError(null)
    setNotice(null)
    try {
      await api.extRemove(id)
      await refresh()
    } catch (removeError) {
      if (alive.current) setError(removeError instanceof Error ? removeError.message : String(removeError))
    } finally {
      if (alive.current) setBusy(false)
    }
  }, [refresh])

  const enabled = listing?.enabled === true
  return (
    <div className={css.extSection}>
      <h4 className={css.extHeading}>{t('extHeading')}</h4>
      <p className={css.settingsIntro}>{t('extIntro')}</p>

      {/* A failed list also reports enabled:false, so the unreachable case is
          checked FIRST — otherwise a stale host half reads as "you turned it
          off" and sends the user to edit config that is already correct. */}
      {listing?.error !== undefined && (
        <p className={css.extError}>
          {isStaleHostHalf(listing.error) ? t('extStaleHost') : t('extUnreachable', { error: listing.error })}
        </p>
      )}
      {!enabled && listing !== null && listing.error === undefined && (
        <p className={css.settingsMissing}>{t('extDisabled')}</p>
      )}

      {enabled && (
        <>
          <p className={css.extWarning}>⚠️ {t('extWarning')}</p>

          {pending !== null ? (
            <BarePrompt
              pending={pending}
              busy={busy}
              onCancel={() => { setPending(null) }}
              onConfirm={(id, title) => { void install({ ...pending, id, title }) }}
            />
          ) : (
            <div className={css.extActions}>
              <input
                ref={fileInput}
                type="file"
                accept=".tgz,.gz,.tar,.js,application/gzip,application/x-gzip,application/x-tar,text/javascript"
                style={{ display: 'none' }}
                onChange={(event) => {
                  const file = event.target.files?.[0]
                  // Reset first: picking the same file twice must re-fire
                  // change, which it will not if the value is still set.
                  event.target.value = ''
                  if (file !== undefined) void onFile(file)
                }}
              />
              <button
                type="button"
                className={css.extPromptPrimary}
                disabled={busy}
                onClick={() => { fileInput.current?.click() }}
              >
                {busy ? t('extInstalling') : t('extUpload')}
              </button>
              <button type="button" disabled={busy} onClick={() => { void refresh() }}>
                {t('extReload')}
              </button>
            </div>
          )}

          {listing.extensions.length === 0
            ? <p className={css.extEmpty}>{t('extEmpty')}</p>
            : (
              <div className={css.extList}>
                {listing.extensions.map(extension => (
                  <ExtensionRow
                    key={extension.id}
                    extension={extension}
                    busy={busy}
                    onRemove={(id) => { void onRemove(id) }}
                  />
                ))}
              </div>
            )}
        </>
      )}

      {error !== null && <p className={css.extError}>{error}</p>}
      {notice !== null && <p className={css.settingsHint}>{notice}</p>}
    </div>
  )
}
