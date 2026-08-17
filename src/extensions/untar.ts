/**
 * Minimal ustar reader for extension archives. Vendored rather than depended
 * on (same rationale as src/trust-fence.ts): the only archives this plugin
 * ever reads are its own extension bundles — a handful of small regular files
 * — so the ~5% of tar the format spec covers here is the whole requirement,
 * and an extraction path that handles arbitrary tar features is strictly more
 * attack surface than the feature needs.
 *
 * What is supported: regular files, directories, the ustar `prefix` field,
 * GNU long names (typeflag 'L'), and pax `path=` overrides (typeflag 'x'/'g')
 * — the four ways a real `npm pack` / `tar czf` archive can spell a path.
 *
 * What is REJECTED, loudly: symlinks, hardlinks, device/fifo nodes, absolute
 * paths, drive letters, and any `..` segment. Extension archives are attacker-
 * controlled input (a user can be talked into uploading one), so the classic
 * tar-slip escapes are refused at parse time rather than at write time — the
 * caller never sees an entry whose path could leave the extraction root.
 *
 * Everything is bounded: entry count, per-entry size, and total extracted
 * size are caller-supplied caps, checked BEFORE any allocation, so a crafted
 * header cannot make the reader allocate more than the caller allowed.
 *
 * @module dsh-powerdesk/extensions/untar
 */

/** One extracted regular file. Directory members produce no entry (the
 *  writer creates parents from the file paths). */
export interface TarEntry {
  /** Sanitized, forward-slashed, root-relative path (never absolute, never `..`). */
  path: string
  data: Uint8Array
}

/** Extraction bounds. Every field is a hard cap; exceeding one throws. */
export interface UntarLimits {
  /** Maximum number of members (headers) the archive may contain. */
  maxEntries: number
  /** Maximum size of any single member. */
  maxEntryBytes: number
  /** Maximum sum of all member sizes. */
  maxTotalBytes: number
}

/** Default bounds sized for extension bundles (see install.ts). */
export const DEFAULT_UNTAR_LIMITS: UntarLimits = {
  maxEntries: 64,
  maxEntryBytes: 8 * 1024 * 1024,
  maxTotalBytes: 32 * 1024 * 1024,
}

/** A malformed, oversized, or unsafe archive. */
export class TarError extends Error {}

const BLOCK = 512

/** Offset of the `ustar` magic inside a header block. */
const MAGIC_OFFSET = 257

/**
 * Whether a buffer looks like a tar archive (used to tell a `.tar.gz` from a
 * plain gzipped `.js`). Checks the ustar magic of the FIRST header block; the
 * GNU variant writes `ustar ` (space) where POSIX writes `ustar\0`.
 */
export function looksLikeTar(buf: Uint8Array): boolean {
  if (buf.length < MAGIC_OFFSET + 6) return false
  const magic = latin1(buf, MAGIC_OFFSET, 6)
  return magic === 'ustar\0' || magic === 'ustar '
}

/** Decode a byte range as latin1 (header fields are ASCII by spec). */
function latin1(buf: Uint8Array, offset: number, length: number): string {
  let out = ''
  for (let i = offset; i < offset + length && i < buf.length; i += 1) {
    out += String.fromCharCode(buf[i] as number)
  }
  return out
}

/** Decode a NUL/space-terminated header string field. */
function headerString(buf: Uint8Array, offset: number, length: number): string {
  const raw = latin1(buf, offset, length)
  const end = raw.indexOf('\0')
  return (end === -1 ? raw : raw.slice(0, end)).replace(/ +$/, '')
}

/**
 * Decode an octal header number. Rejects the GNU base-256 extension (high bit
 * set): it only appears for values above 8 GiB, which every caller's
 * `maxEntryBytes` refuses anyway, so refusing the encoding outright is
 * simpler than parsing a range we would immediately reject.
 */
function headerOctal(buf: Uint8Array, offset: number, length: number, field: string): number {
  if (((buf[offset] as number) & 0x80) !== 0) {
    throw new TarError(`tar header field "${field}" uses the unsupported base-256 encoding`)
  }
  const text = headerString(buf, offset, length).trim()
  if (text === '') return 0
  if (!/^[0-7]+$/.test(text)) {
    throw new TarError(`tar header field "${field}" is not octal`)
  }
  return Number.parseInt(text, 8)
}

/**
 * Verify the header checksum: the unsigned sum of all header bytes with the
 * checksum field itself read as spaces. A mismatch means the block is not a
 * header at all (truncation, or a non-tar payload), so it is worth failing on
 * before trusting any other field. Historic writers signed the bytes, so the
 * signed sum is accepted too.
 */
function checksumOk(block: Uint8Array): boolean {
  const stored = headerString(block, 148, 8).trim().replace(/\0.*$/, '')
  if (!/^[0-7]+$/.test(stored)) return false
  const expected = Number.parseInt(stored, 8)
  let unsigned = 0
  let signed = 0
  for (let i = 0; i < BLOCK; i += 1) {
    const byte = (i >= 148 && i < 156) ? 0x20 : (block[i] as number)
    unsigned += byte
    signed += byte > 127 ? byte - 256 : byte
  }
  return expected === unsigned || expected === signed
}

/** Whether a 512-byte block is entirely zero (the end-of-archive marker). */
function isZeroBlock(buf: Uint8Array, offset: number): boolean {
  for (let i = offset; i < offset + BLOCK; i += 1) {
    if (buf[i] !== 0) return false
  }
  return true
}

/**
 * Sanitize a member path to a root-relative, forward-slashed form, or return
 * `undefined` when it must be refused. This is the tar-slip gate: absolute
 * paths, Windows drive letters, UNC prefixes, `..` segments, backslashes, and
 * embedded NULs are all rejected rather than normalized away — normalizing a
 * hostile path silently accepts an archive that was trying to escape, and
 * there is no legitimate extension archive that needs any of them.
 */
export function safeEntryPath(raw: string): string | undefined {
  if (raw === '' || raw.includes('\0') || raw.includes('\\')) return undefined
  if (raw.startsWith('/') || /^[A-Za-z]:/.test(raw)) return undefined
  const segments: string[] = []
  for (const segment of raw.split('/')) {
    if (segment === '' || segment === '.') continue
    if (segment === '..') return undefined
    segments.push(segment)
  }
  if (segments.length === 0) return undefined
  return segments.join('/')
}

/** Typeflags that carry file content we keep. `\0` and '7' are historic
 *  spellings of "regular file". */
const REGULAR_TYPES = new Set(['0', '\0', '7'])

/** Typeflags that are legal tar but are never legitimate in an extension
 *  archive; each one is a way to write outside the extraction root or to
 *  create a node the plugin would then serve. */
const REJECTED_TYPES = new Map<string, string>([
  ['1', 'hard link'],
  ['2', 'symbolic link'],
  ['3', 'character device'],
  ['4', 'block device'],
  ['6', 'FIFO'],
])

/**
 * Parse a tar archive into its regular-file members.
 *
 * @param buf - the uncompressed archive bytes.
 * @param limits - extraction bounds (defaults sized for extension bundles).
 * @returns every regular file, in archive order, with sanitized paths.
 * @throws {TarError} on a malformed, unsafe, or over-limit archive.
 */
export function untar(buf: Uint8Array, limits: UntarLimits = DEFAULT_UNTAR_LIMITS): TarEntry[] {
  const entries: TarEntry[] = []
  let total = 0
  let headers = 0
  let offset = 0
  // Set by a preceding GNU 'L' or pax 'x' member; consumed by the next real
  // header, whose own name field is then ignored.
  let pendingName: string | undefined

  while (offset + BLOCK <= buf.length) {
    if (isZeroBlock(buf, offset)) break
    const block = buf.subarray(offset, offset + BLOCK)
    if (!checksumOk(block)) {
      throw new TarError('tar header checksum mismatch (truncated or not a tar archive)')
    }
    headers += 1
    if (headers > limits.maxEntries) {
      throw new TarError(`tar archive has more than ${limits.maxEntries} members`)
    }
    const size = headerOctal(block, 124, 12, 'size')
    if (size > limits.maxEntryBytes) {
      throw new TarError(`tar member exceeds the ${limits.maxEntryBytes}-byte per-file limit`)
    }
    const dataOffset = offset + BLOCK
    if (dataOffset + size > buf.length) {
      throw new TarError('tar archive is truncated (member data runs past the end)')
    }
    const type = String.fromCharCode(block[156] as number)

    // ── Metadata members: they name the NEXT member rather than being one ──
    if (type === 'L') {
      pendingName = headerString(buf, dataOffset, size)
      offset = dataOffset + roundUp(size)
      continue
    }
    if (type === 'x' || type === 'g') {
      pendingName = paxPath(latin1(buf, dataOffset, size)) ?? pendingName
      offset = dataOffset + roundUp(size)
      continue
    }

    const rejected = REJECTED_TYPES.get(type)
    if (rejected !== undefined) {
      throw new TarError(`tar member "${headerName(block, pendingName)}" is a ${rejected}; extension archives may only contain regular files`)
    }

    const rawName = headerName(block, pendingName)
    pendingName = undefined
    offset = dataOffset + roundUp(size)

    // Directory members carry no data; the writer materializes parents from
    // the file paths, so a directory entry is only worth validating.
    if (type === '5' || rawName.endsWith('/')) {
      if (safeEntryPath(rawName) === undefined) {
        throw new TarError(`tar member "${rawName}" has an unsafe path`)
      }
      continue
    }
    if (!REGULAR_TYPES.has(type)) {
      throw new TarError(`tar member "${rawName}" has unsupported type "${type}"`)
    }
    const path = safeEntryPath(rawName)
    if (path === undefined) {
      throw new TarError(`tar member "${rawName}" has an unsafe path`)
    }
    total += size
    if (total > limits.maxTotalBytes) {
      throw new TarError(`tar archive expands beyond the ${limits.maxTotalBytes}-byte total limit`)
    }
    entries.push({ path, data: buf.slice(dataOffset, dataOffset + size) })
  }
  return entries
}

/** Round a member size up to the next 512-byte block boundary. */
function roundUp(size: number): number {
  return Math.ceil(size / BLOCK) * BLOCK
}

/** The member's name: a pending long-name override wins, else `prefix/name`. */
function headerName(block: Uint8Array, pendingName: string | undefined): string {
  if (pendingName !== undefined && pendingName !== '') return pendingName
  const name = headerString(block, 0, 100)
  const prefix = headerString(block, 345, 155)
  return prefix === '' ? name : `${prefix}/${name}`
}

/**
 * Extract a `path=` override from a pax extended-header payload. Records are
 * `"<len> <key>=<value>\n"`; only `path` matters here (the rest — mtime,
 * uid, ownership — is discarded along with the archive's metadata).
 */
function paxPath(payload: string): string | undefined {
  const match = /(?:^|\n)\d+ path=([^\n]*)\n/.exec(payload)
  return match?.[1]
}

/**
 * Drop a single shared leading directory from every entry, the way
 * `npm pack` wraps its output in `package/`. Only applied when EVERY entry
 * shares one root and at least one entry has something below it — an archive
 * whose files are already at the top level is returned untouched.
 */
export function stripCommonRoot(entries: readonly TarEntry[]): TarEntry[] {
  if (entries.length === 0) return []
  const roots = new Set(entries.map(entry => entry.path.split('/')[0] as string))
  if (roots.size !== 1) return [...entries]
  if (!entries.some(entry => entry.path.includes('/'))) return [...entries]
  return entries.flatMap((entry) => {
    const rest = entry.path.slice(entry.path.indexOf('/') + 1)
    return rest === '' ? [] : [{ path: rest, data: entry.data }]
  })
}
