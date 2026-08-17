/**
 * Extension manifest: the `powerdesk.json` an extension archive must carry,
 * and its validation. Kept dependency-free and side-effect-free so both the
 * install path and the tests can call it directly.
 *
 * The manifest is the ONLY channel through which an extension describes
 * itself to the platform, and it is attacker-influenced (a user can be talked
 * into uploading an archive), so validation is whitelist-shaped: every field
 * is checked for type and range, unknown fields are dropped rather than
 * carried, and the id — which becomes a filesystem directory name, a URL
 * path segment, and a chunk-registry key — is restricted to a character set
 * that is safe in all three positions at once.
 *
 * @module dsh-powerdesk/extensions/manifest
 */

/** Manifest schema version this build understands. */
export const EXTENSION_API_VERSION = 1

/**
 * The id character set: lowercase alphanumerics and dashes, leading
 * alphanumeric, at most 64 chars. Deliberately narrower than any one of its
 * three consumers requires — a single set that is simultaneously a safe path
 * segment (no `.`, no `..`, no separators, no case-collision on macOS/Windows),
 * a safe URL segment (nothing to percent-encode), and a safe object key.
 */
export const EXTENSION_ID_PATTERN = /^[a-z0-9][a-z0-9-]{0,63}$/

/** A rejected manifest, upload, or extension id. */
export class ExtensionError extends Error {}

/** One extension's declared identity and tab behaviour. */
export interface ExtensionManifest {
  apiVersion: number
  /** Unique id; also the directory name, URL segment, and chunk key suffix. */
  id: string
  title: string
  /** Emoji or short text shown on the tab (a manifest cannot carry a node). */
  icon?: string
  /** Bundle file inside the extension directory. Defaults to `bundle.js`. */
  entry: string
  /** Named export of the chunk factory's result to mount. Defaults to `default`. */
  export: string
  /** + menu sort order (ascending); matches TabDescriptor.order. */
  order?: number
  /** Single-instance sugar; matches TabDescriptor.single. */
  single?: boolean
}

/** Whether a string is a usable extension id. */
export function isValidExtensionId(id: unknown): id is string {
  return typeof id === 'string' && EXTENSION_ID_PATTERN.test(id)
}

/** Throwing form of {@link isValidExtensionId} (the API boundary's guard). */
export function requireExtensionId(id: unknown): string {
  if (!isValidExtensionId(id)) {
    throw new ExtensionError('extension id must be 1-64 chars of a-z, 0-9 and dashes, starting with a letter or digit')
  }
  return id
}

/**
 * The entry filename must name a plain file directly inside the extension
 * directory — no subdirectory, no traversal. Extraction already refuses
 * unsafe archive paths; this is the second, independent check on the value
 * that actually becomes a filesystem read.
 */
function requireEntry(value: unknown): string {
  if (value === undefined) return 'bundle.js'
  if (typeof value !== 'string' || value === '') {
    throw new ExtensionError('manifest "entry" must be a non-empty string')
  }
  if (!/^[A-Za-z0-9._-]+$/.test(value) || value === '.' || value === '..') {
    throw new ExtensionError('manifest "entry" must be a plain file name inside the extension directory')
  }
  if (!value.endsWith('.js')) {
    throw new ExtensionError('manifest "entry" must be a .js file')
  }
  return value
}

function requireTitle(value: unknown): string {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new ExtensionError('manifest "title" must be a non-empty string')
  }
  if (value.length > 64) {
    throw new ExtensionError('manifest "title" must be at most 64 characters')
  }
  return value.trim()
}

function optionalIcon(value: unknown): string | undefined {
  if (value === undefined || value === null) return undefined
  if (typeof value !== 'string') {
    throw new ExtensionError('manifest "icon" must be a string (emoji or short text)')
  }
  const icon = value.trim()
  if (icon === '') return undefined
  // Rendered as text, never as markup — but a long "icon" would break the tab
  // strip layout, so the cap is a UI invariant rather than a safety one.
  if ([...icon].length > 4) {
    throw new ExtensionError('manifest "icon" must be at most 4 characters (an emoji or short label)')
  }
  return icon
}

function optionalOrder(value: unknown): number | undefined {
  if (value === undefined || value === null) return undefined
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new ExtensionError('manifest "order" must be a finite number')
  }
  return value
}

function optionalBoolean(value: unknown, field: string): boolean | undefined {
  if (value === undefined || value === null) return undefined
  if (typeof value !== 'boolean') {
    throw new ExtensionError(`manifest "${field}" must be a boolean`)
  }
  return value
}

/**
 * Validate a parsed `powerdesk.json` into a manifest, or throw
 * {@link ExtensionError} with a message meant for the upload dialog.
 *
 * @param value - the parsed JSON document.
 * @param expectedId - when given, the manifest id must equal it (the bare-
 * bundle upload path names the extension out-of-band).
 */
export function parseManifest(value: unknown, expectedId?: string): ExtensionManifest {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new ExtensionError('powerdesk.json must contain a JSON object')
  }
  const raw = value as Record<string, unknown>
  const apiVersion = raw.apiVersion ?? EXTENSION_API_VERSION
  if (typeof apiVersion !== 'number' || !Number.isInteger(apiVersion)) {
    throw new ExtensionError('manifest "apiVersion" must be an integer')
  }
  if (apiVersion > EXTENSION_API_VERSION) {
    throw new ExtensionError(`extension requires manifest apiVersion ${apiVersion}; this build supports up to ${EXTENSION_API_VERSION}`)
  }
  const id = requireExtensionId(raw.id)
  if (expectedId !== undefined && id !== expectedId) {
    throw new ExtensionError(`manifest id "${id}" does not match the extension directory "${expectedId}"`)
  }
  const icon = optionalIcon(raw.icon)
  const order = optionalOrder(raw.order)
  const single = optionalBoolean(raw.single, 'single')
  return {
    apiVersion,
    id,
    title: requireTitle(raw.title),
    ...icon !== undefined ? { icon } : {},
    entry: requireEntry(raw.entry),
    export: typeof raw.export === 'string' && raw.export !== '' ? raw.export : 'default',
    ...order !== undefined ? { order } : {},
    ...single !== undefined ? { single } : {},
  }
}

/**
 * The chunk-registry key an extension's bundle must assign its factory to.
 * Namespaced under `ext:` so a third-party bundle can never collide with a
 * built-in chunk name (`terminal` / `browser` / `editor`), and derived from
 * the manifest id so the build tool and the loader agree without a second
 * source of truth.
 */
export function chunkKeyOf(id: string): string {
  return `ext:${id}`
}
