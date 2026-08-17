/**
 * Extension install: turn an uploaded `.tgz` / `.gz` / `.tar` / `.js` into a
 * validated extension directory.
 *
 * Format sniffing, not filename trust. The upload's name is provenance only;
 * what drives the decode is the bytes:
 *
 *   1f 8b …          → gzip member, inflate it (bounded), then re-sniff
 *   … "ustar" @257   → tar archive: extract, read powerdesk.json
 *   anything else    → a bare bundle script; the id/title come from the
 *                      upload dialog, since there is no manifest to read
 *
 * That covers `.tgz`, `.tar.gz`, a gzipped bare `.js`, a plain `.tar`, and a
 * plain `.js` with one code path and no filename parsing.
 *
 * Atomicity: everything lands in a sibling `.tmp-*` staging directory and is
 * renamed into place only after the manifest and entry file both validate.
 * A rejected or half-written upload can therefore never leave a working
 * extension in a broken state — the previous install stays live until the
 * replacement is known-good.
 *
 * @module dsh-powerdesk/extensions/install
 */
import { createHash, randomUUID } from 'node:crypto'
import { mkdir, rename, rm, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { gunzipSync } from 'node:zlib'
import { ExtensionError, parseManifest, type ExtensionManifest } from './manifest.ts'
import { INSTALL_RECORD_FILE, MANIFEST_FILE, extensionDir, readExtension, removeExtension, type InstallRecord, type InstalledExtension } from './registry.ts'
import { DEFAULT_UNTAR_LIMITS, looksLikeTar, stripCommonRoot, untar, type TarEntry } from './untar.ts'

/** Upload bound, before decompression (the API also caps the request body). */
export const MAX_UPLOAD_BYTES = 16 * 1024 * 1024

/**
 * Inflated-size bound. Enforced by zlib itself via `maxOutputLength`, so a
 * gzip bomb fails inside the inflate rather than after materializing — the
 * cap is on what is ALLOCATED, not on what is inspected afterwards.
 */
export const MAX_INFLATED_BYTES = DEFAULT_UNTAR_LIMITS.maxTotalBytes

/** gzip member magic. */
const GZIP_MAGIC = [0x1f, 0x8b] as const

/** What the caller knows about the upload that the bytes cannot tell us. */
export interface UploadInput {
  /** The browser-reported file name; recorded as provenance, never trusted. */
  filename: string
  data: Uint8Array
  /**
   * Identity for a bare-bundle upload (no manifest in the payload). Ignored
   * when the archive carries its own `powerdesk.json`.
   */
  fallback?: { id: string; title: string; icon?: string }
}

/** Whether a buffer starts with the gzip magic. */
function isGzip(buf: Uint8Array): boolean {
  return buf.length > 2 && buf[0] === GZIP_MAGIC[0] && buf[1] === GZIP_MAGIC[1]
}

/**
 * Inflate a gzip member with a hard output cap. Node throws
 * ERR_BUFFER_TOO_LARGE once the limit is crossed; it is rewritten here into
 * the user-facing error vocabulary so the settings dialog can show it.
 */
function inflate(buf: Uint8Array): Uint8Array {
  try {
    return new Uint8Array(gunzipSync(buf, { maxOutputLength: MAX_INFLATED_BYTES }))
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    if (/buffer|length|too large/i.test(message)) {
      throw new ExtensionError(`archive expands beyond the ${MAX_INFLATED_BYTES}-byte limit`)
    }
    throw new ExtensionError(`archive is not a readable gzip file: ${message}`)
  }
}

/** The decoded payload: either archive members or one bare script. */
type Payload =
  | { kind: 'tar'; entries: TarEntry[] }
  | { kind: 'bare'; data: Uint8Array }

/** Decompress if needed, then classify the bytes. */
function decode(data: Uint8Array): Payload {
  const raw = isGzip(data) ? inflate(data) : data
  if (looksLikeTar(raw)) {
    return { kind: 'tar', entries: stripCommonRoot(untar(raw)) }
  }
  return { kind: 'bare', data: raw }
}

/** The files to write, plus the manifest describing them. */
interface StagedExtension {
  manifest: ExtensionManifest
  files: TarEntry[]
}

/** Build the staged file set from a tar payload. */
function stageTar(entries: readonly TarEntry[]): StagedExtension {
  const manifestEntry = entries.find(entry => entry.path === MANIFEST_FILE)
  if (manifestEntry === undefined) {
    throw new ExtensionError(`archive has no ${MANIFEST_FILE} at its root`)
  }
  let parsed: unknown
  try {
    parsed = JSON.parse(Buffer.from(manifestEntry.data).toString('utf8')) as unknown
  } catch (error) {
    throw new ExtensionError(`${MANIFEST_FILE} is not valid JSON: ${error instanceof Error ? error.message : String(error)}`)
  }
  const manifest = parseManifest(parsed)
  if (!entries.some(entry => entry.path === manifest.entry)) {
    throw new ExtensionError(`archive has no "${manifest.entry}" (the manifest's entry file)`)
  }
  // The host writes its own provenance file; an archive must not supply one.
  return { manifest, files: entries.filter(entry => entry.path !== INSTALL_RECORD_FILE) }
}

/** Build the staged file set from a bare bundle upload. */
function stageBare(data: Uint8Array, fallback: UploadInput['fallback']): StagedExtension {
  if (fallback === undefined) {
    throw new ExtensionError(`upload is a single script, not an archive — give it an id and a title, or upload a .tgz containing ${MANIFEST_FILE}`)
  }
  const manifest = parseManifest({
    apiVersion: 1,
    id: fallback.id,
    title: fallback.title,
    ...fallback.icon !== undefined ? { icon: fallback.icon } : {},
    entry: 'bundle.js',
  })
  return {
    manifest,
    files: [
      { path: 'bundle.js', data },
      { path: MANIFEST_FILE, data: new Uint8Array(Buffer.from(`${JSON.stringify(manifest, null, 2)}\n`, 'utf8')) },
    ],
  }
}

/**
 * Install one uploaded extension, replacing any existing install of the same
 * id.
 *
 * @param root - the extensions directory (see resolveExtensionsDir).
 * @param upload - the uploaded bytes plus dialog-supplied identity.
 * @returns the freshly installed extension, read back from disk.
 * @throws {ExtensionError} for any rejected upload, with a message written
 * for the settings dialog.
 */
export async function installExtension(root: string, upload: UploadInput): Promise<InstalledExtension> {
  if (upload.data.length === 0) {
    throw new ExtensionError('upload is empty')
  }
  if (upload.data.length > MAX_UPLOAD_BYTES) {
    throw new ExtensionError(`upload exceeds the ${MAX_UPLOAD_BYTES}-byte limit`)
  }
  const payload = decode(upload.data)
  const staged = payload.kind === 'tar'
    ? stageTar(payload.entries)
    : stageBare(payload.data, upload.fallback)

  const record: InstallRecord = {
    installedAt: new Date().toISOString(),
    sourceFilename: upload.filename,
    sha256: createHash('sha256').update(upload.data).digest('hex'),
    sourceBytes: upload.data.length,
  }

  const target = extensionDir(root, staged.manifest.id)
  const staging = join(root, `.tmp-${staged.manifest.id}-${randomUUID().slice(0, 8)}`)
  try {
    await mkdir(staging, { recursive: true })
    for (const file of staged.files) {
      const path = join(staging, file.path)
      await mkdir(dirname(path), { recursive: true })
      await writeFile(path, file.data)
    }
    await writeFile(join(staging, INSTALL_RECORD_FILE), `${JSON.stringify(record, null, 2)}\n`)
    // rename() cannot replace a non-empty directory, so the old install is
    // removed first. The window between the two is the only moment the
    // extension is absent; a crash there leaves nothing installed rather
    // than something half-installed, which the settings UI can recover from.
    await removeExtension(root, staged.manifest.id)
    await rename(staging, target)
  } catch (error) {
    await rm(staging, { recursive: true, force: true })
    if (error instanceof ExtensionError) throw error
    throw new ExtensionError(`failed to install extension: ${error instanceof Error ? error.message : String(error)}`)
  }

  const installed = await readExtension(root, staged.manifest.id)
  if (installed.error !== undefined) {
    throw new ExtensionError(`installed extension is not readable: ${installed.error}`)
  }
  return installed
}
