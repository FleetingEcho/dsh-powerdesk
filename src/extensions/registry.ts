/**
 * On-disk extension registry: where extensions live, what is installed, and
 * removal. One directory per extension:
 *
 *   <root>/<id>/powerdesk.json   the manifest (from the archive)
 *   <root>/<id>/bundle.js        the chunk factory script (manifest `entry`)
 *   <root>/<id>/.install.json    host-written provenance (see InstallRecord)
 *
 * Listing is deliberately fault-tolerant: one unreadable or invalid extension
 * directory must not hide the others, because the settings UI is the only
 * place a user can see WHY an extension is broken and remove it. A directory
 * that fails to parse is reported as an entry carrying `error` rather than
 * being silently skipped.
 *
 * @module dsh-powerdesk/extensions/registry
 */
import { readFile, readdir, rm, stat } from 'node:fs/promises'
import { homedir } from 'node:os'
import { isAbsolute, join, relative, resolve, sep } from 'node:path'
import { ExtensionError, isValidExtensionId, parseManifest, requireExtensionId, type ExtensionManifest } from './manifest.ts'

/** Manifest file name inside an extension directory. */
export const MANIFEST_FILE = 'powerdesk.json'

/** Host-written provenance file name inside an extension directory. */
export const INSTALL_RECORD_FILE = '.install.json'

/** Provenance the host records at install time (never read from the archive). */
export interface InstallRecord {
  /** ISO timestamp of the install that produced the current contents. */
  installedAt: string
  /** The uploaded file's name, as reported by the browser. */
  sourceFilename: string
  /** sha256 of the uploaded bytes, for the settings UI to display. */
  sha256: string
  /** Size of the uploaded archive in bytes. */
  sourceBytes: number
}

/** One installed extension as the API reports it. */
export interface InstalledExtension {
  id: string
  /** Present when the extension parsed; absent when `error` is set. */
  manifest?: ExtensionManifest
  install?: InstallRecord
  /** Absolute directory, shown in settings so the user can audit what ran. */
  dir: string
  /** Size of the bundle file in bytes. */
  bundleBytes?: number
  /** Why this directory is not loadable (parse/read failure). */
  error?: string
}

/**
 * The default extensions root: `~/.dsh/powerdesk/extensions`, alongside the
 * profile directories the DSH CLI already owns.
 */
export function defaultExtensionsDir(): string {
  return join(homedir(), '.dsh', 'powerdesk', 'extensions')
}

/** Resolve the configured root to an absolute path (empty = the default). */
export function resolveExtensionsDir(configured?: string): string {
  const trimmed = configured?.trim() ?? ''
  return trimmed === '' ? defaultExtensionsDir() : resolve(trimmed)
}

/**
 * The directory of one extension. The id is re-validated here rather than
 * trusted from the caller: this function's result is passed straight to file
 * reads and to `rm`, so it is the last place a bad id can be stopped.
 */
export function extensionDir(root: string, id: string): string {
  return join(root, requireExtensionId(id))
}

/**
 * The absolute path of an extension's bundle script. `entry` comes from the
 * manifest, which validated it as a bare file name; the containment check
 * below is the independent second gate — if the resolved path is not inside
 * the extension directory, something upstream is wrong and no read happens.
 */
export function bundlePathOf(root: string, id: string, entry: string): string {
  const dir = extensionDir(root, id)
  const path = resolve(dir, entry)
  // Containment is asserted on the RESOLVED path relative to the directory:
  // it must be exactly one non-traversing segment below it. Comparing against
  // `join(dir, entry)` would not do — join() normalizes `../` the same way
  // resolve() does, so an escaping entry compares equal to itself.
  const rel = relative(dir, path)
  if (rel === '' || rel.startsWith('..') || isAbsolute(rel) || rel.includes(sep)) {
    throw new ExtensionError(`extension "${id}" entry "${entry}" escapes its directory`)
  }
  return path
}

/** Read and validate one extension directory. Never throws for bad content. */
export async function readExtension(root: string, id: string): Promise<InstalledExtension> {
  const dir = extensionDir(root, id)
  try {
    const manifest = parseManifest(JSON.parse(await readFile(join(dir, MANIFEST_FILE), 'utf8')) as unknown, id)
    const bundle = await stat(bundlePathOf(root, id, manifest.entry))
    if (!bundle.isFile()) throw new ExtensionError(`entry "${manifest.entry}" is not a file`)
    const install = await readInstallRecord(dir)
    return {
      id,
      manifest,
      dir,
      bundleBytes: bundle.size,
      ...install !== undefined ? { install } : {},
    }
  } catch (error) {
    return { id, dir, error: error instanceof Error ? error.message : String(error) }
  }
}

/** Read the provenance file, or undefined when absent/unreadable. */
async function readInstallRecord(dir: string): Promise<InstallRecord | undefined> {
  try {
    const parsed = JSON.parse(await readFile(join(dir, INSTALL_RECORD_FILE), 'utf8')) as Partial<InstallRecord>
    if (typeof parsed.installedAt !== 'string') return undefined
    return {
      installedAt: parsed.installedAt,
      sourceFilename: typeof parsed.sourceFilename === 'string' ? parsed.sourceFilename : '',
      sha256: typeof parsed.sha256 === 'string' ? parsed.sha256 : '',
      sourceBytes: typeof parsed.sourceBytes === 'number' ? parsed.sourceBytes : 0,
    }
  } catch {
    return undefined
  }
}

/**
 * Every installed extension, sorted by id. A missing root is not an error —
 * it just means nothing has been installed yet. Directory names that are not
 * valid ids (including the installer's `.tmp-*` staging dirs) are skipped
 * entirely rather than reported as broken extensions.
 */
export async function listExtensions(root: string): Promise<InstalledExtension[]> {
  let names: string[]
  try {
    names = (await readdir(root, { withFileTypes: true }))
      .filter(entry => entry.isDirectory() && isValidExtensionId(entry.name))
      .map(entry => entry.name)
  } catch {
    return []
  }
  const found = await Promise.all(names.sort().map(async id => readExtension(root, id)))
  return found
}

/** Remove one extension's directory. Removing an absent id is a no-op. */
export async function removeExtension(root: string, id: string): Promise<void> {
  await rm(extensionDir(root, id), { recursive: true, force: true })
}
