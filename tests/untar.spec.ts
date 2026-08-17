import { describe, it, expect } from 'vitest'
import { gzipSync } from 'node:zlib'
import {
  untar,
  looksLikeTar,
  safeEntryPath,
  stripCommonRoot,
  TarError,
  DEFAULT_UNTAR_LIMITS,
  type TarEntry,
} from '../src/extensions/untar.ts'

const BLOCK = 512

interface MemberSpec {
  name: string
  data?: string
  /** ustar typeflag; defaults to '0' (regular file). */
  type?: string
  /** Override the size field (to forge a truncated/oversized member). */
  sizeOverride?: number
  /** Write into the 155-byte ustar prefix field instead of prefixing `name`. */
  prefix?: string
  /** Corrupt the checksum after computing it. */
  breakChecksum?: boolean
}

/** Build one 512-byte ustar header with a correct checksum. */
function header(spec: MemberSpec, size: number): Buffer {
  const block = Buffer.alloc(BLOCK, 0)
  block.write(spec.name.slice(0, 100), 0, 'latin1')
  block.write('0000644\0', 100, 'latin1')
  block.write('0000000\0', 108, 'latin1')
  block.write('0000000\0', 116, 'latin1')
  block.write(`${(spec.sizeOverride ?? size).toString(8).padStart(11, '0')}\0`, 124, 'latin1')
  block.write('00000000000\0', 136, 'latin1')
  block.write(spec.type ?? '0', 156, 'latin1')
  block.write('ustar\0', 257, 'latin1')
  block.write('00', 263, 'latin1')
  if (spec.prefix !== undefined) block.write(spec.prefix.slice(0, 155), 345, 'latin1')
  // Checksum: unsigned sum with the checksum field read as spaces.
  block.write('        ', 148, 'latin1')
  let sum = 0
  for (const byte of block) sum += byte
  if (spec.breakChecksum === true) sum += 1
  block.write(`${sum.toString(8).padStart(6, '0')}\0 `, 148, 'latin1')
  return block
}

/** Recompute the first header block's checksum in place (after tampering). */
function resign(archive: Buffer): void {
  archive.write('        ', 148, 'latin1')
  let sum = 0
  for (let i = 0; i < BLOCK; i += 1) sum += archive[i] as number
  archive.write(`${sum.toString(8).padStart(6, '0')}\0 `, 148, 'latin1')
}

/** Assemble a tar archive from member specs (with the two-zero-block tail). */
function tar(specs: readonly MemberSpec[], { terminate = true } = {}): Uint8Array {
  const parts: Buffer[] = []
  for (const spec of specs) {
    const data = Buffer.from(spec.data ?? '', 'utf8')
    parts.push(header(spec, data.length))
    if (data.length > 0) {
      const padded = Buffer.alloc(Math.ceil(data.length / BLOCK) * BLOCK, 0)
      data.copy(padded)
      parts.push(padded)
    }
  }
  if (terminate) parts.push(Buffer.alloc(BLOCK * 2, 0))
  return new Uint8Array(Buffer.concat(parts))
}

/** Read one entry's bytes back as UTF-8. */
function text(entry: TarEntry | undefined): string {
  return entry === undefined ? '' : Buffer.from(entry.data).toString('utf8')
}

describe('untar: well-formed archives', () => {
  it('reads regular files in archive order', () => {
    const entries = untar(tar([
      { name: 'powerdesk.json', data: '{"id":"a"}' },
      { name: 'bundle.js', data: 'export default 1' },
    ]))
    expect(entries.map(e => e.path)).toEqual(['powerdesk.json', 'bundle.js'])
    expect(text(entries[0])).toBe('{"id":"a"}')
    expect(text(entries[1])).toBe('export default 1')
  })

  it('joins the ustar prefix field with the name', () => {
    const entries = untar(tar([{ name: 'bundle.js', prefix: 'package/dist', data: 'x' }]))
    expect(entries[0]?.path).toBe('package/dist/bundle.js')
  })

  it('skips directory members but keeps their files', () => {
    const entries = untar(tar([
      { name: 'package/', type: '5' },
      { name: 'package/bundle.js', data: 'x' },
    ]))
    expect(entries.map(e => e.path)).toEqual(['package/bundle.js'])
  })

  it('preserves exact bytes, including a member whose size is a block multiple', () => {
    const body = 'z'.repeat(BLOCK)
    const entries = untar(tar([{ name: 'a.js', data: body }, { name: 'b.js', data: 'tail' }]))
    expect(text(entries[0])).toBe(body)
    expect(text(entries[1])).toBe('tail')
  })

  it('handles an empty file followed by a real one', () => {
    const entries = untar(tar([{ name: 'empty', data: '' }, { name: 'b.js', data: 'ok' }]))
    expect(entries.map(e => e.path)).toEqual(['empty', 'b.js'])
    expect(text(entries[0])).toBe('')
    expect(text(entries[1])).toBe('ok')
  })

  it('stops at the end-of-archive marker and ignores trailing junk', () => {
    const archive = Buffer.concat([
      Buffer.from(tar([{ name: 'a.js', data: 'x' }])),
      Buffer.from('garbage that is not a header'.padEnd(BLOCK, ' '), 'utf8'),
    ])
    expect(untar(new Uint8Array(archive)).map(e => e.path)).toEqual(['a.js'])
  })

  it('reads an archive with no end-of-archive marker', () => {
    const entries = untar(tar([{ name: 'a.js', data: 'x' }], { terminate: false }))
    expect(entries.map(e => e.path)).toEqual(['a.js'])
  })

  it('applies a GNU long name to the following member', () => {
    const long = `package/${'d'.repeat(120)}/bundle.js`
    const entries = untar(tar([
      { name: '././@LongLink', type: 'L', data: long },
      { name: 'package/truncated-name', data: 'x' },
    ]))
    expect(entries[0]?.path).toBe(long)
  })

  it('applies a pax path override to the following member', () => {
    const long = 'package/nested/deeply/bundle.js'
    const record = `${`0 path=${long}\n`.length + 2} path=${long}\n`
    const entries = untar(tar([
      { name: 'PaxHeaders/0', type: 'x', data: record },
      { name: 'package/short', data: 'x' },
    ]))
    expect(entries[0]?.path).toBe(long)
  })

  it('ignores a pax header that carries no path record', () => {
    const entries = untar(tar([
      { name: 'PaxHeaders/0', type: 'x', data: '30 mtime=1700000000.000000000\n' },
      { name: 'package/bundle.js', data: 'x' },
    ]))
    expect(entries[0]?.path).toBe('package/bundle.js')
  })
})

describe('untar: hostile archives are refused', () => {
  const unsafe: ReadonlyArray<readonly [string, string]> = [
    ['a parent-directory escape', '../../etc/passwd'],
    ['a nested parent-directory escape', 'package/../../../etc/passwd'],
    ['an absolute path', '/etc/passwd'],
    ['a Windows drive letter', 'C:/windows/system32/evil.js'],
    ['a backslash separator', 'package\\..\\..\\evil.js'],
  ]
  for (const [label, name] of unsafe) {
    it(`rejects ${label}`, () => {
      expect(() => untar(tar([{ name, data: 'x' }]))).toThrow(TarError)
    })
  }

  const nodes: ReadonlyArray<readonly [string, string]> = [
    ['symbolic link', '2'],
    ['hard link', '1'],
    ['character device', '3'],
    ['block device', '4'],
    ['FIFO', '6'],
  ]
  for (const [label, type] of nodes) {
    it(`rejects a ${label} member`, () => {
      expect(() => untar(tar([{ name: 'evil', type }]))).toThrow(/regular files/)
    })
  }

  it('rejects an unsafe path smuggled through a GNU long name', () => {
    expect(() => untar(tar([
      { name: '././@LongLink', type: 'L', data: '../../etc/passwd' },
      { name: 'package/innocent.js', data: 'x' },
    ]))).toThrow(TarError)
  })

  it('rejects an unsafe path smuggled through a pax header', () => {
    const evil = '../../etc/passwd'
    expect(() => untar(tar([
      { name: 'PaxHeaders/0', type: 'x', data: `${`0 path=${evil}\n`.length + 2} path=${evil}\n` },
      { name: 'package/innocent.js', data: 'x' },
    ]))).toThrow(TarError)
  })

  it('rejects an unsafe path smuggled through the ustar prefix', () => {
    expect(() => untar(tar([{ name: 'bundle.js', prefix: '../..', data: 'x' }]))).toThrow(TarError)
  })
})

describe('untar: malformed archives are refused', () => {
  it('rejects a checksum mismatch', () => {
    expect(() => untar(tar([{ name: 'a.js', data: 'x', breakChecksum: true }]))).toThrow(/checksum/)
  })

  it('rejects non-tar input', () => {
    expect(() => untar(new Uint8Array(Buffer.alloc(BLOCK, 0x41)))).toThrow(TarError)
  })

  it('rejects a member whose data runs past the end of the archive', () => {
    expect(() => untar(tar([{ name: 'a.js', data: 'x', sizeOverride: 4096 }]))).toThrow(/truncated/)
  })

  it('rejects an unsupported typeflag', () => {
    expect(() => untar(tar([{ name: 'weird', type: 'V', data: 'x' }]))).toThrow(/unsupported type/)
  })
})

describe('untar: limits', () => {
  it('rejects too many members', () => {
    const specs = Array.from({ length: 5 }, (_, i) => ({ name: `f${i}.js`, data: 'x' }))
    expect(() => untar(tar(specs), { ...DEFAULT_UNTAR_LIMITS, maxEntries: 4 })).toThrow(/more than 4 members/)
  })

  it('rejects a member over the per-file limit before allocating it', () => {
    const archive = tar([{ name: 'big.js', data: 'x'.repeat(2048) }])
    expect(() => untar(archive, { ...DEFAULT_UNTAR_LIMITS, maxEntryBytes: 1024 })).toThrow(/per-file limit/)
  })

  it('rejects an archive over the total limit', () => {
    const archive = tar([{ name: 'a.js', data: 'x'.repeat(600) }, { name: 'b.js', data: 'y'.repeat(600) }])
    expect(() => untar(archive, { ...DEFAULT_UNTAR_LIMITS, maxTotalBytes: 1000 })).toThrow(/total limit/)
  })

  it('rejects the base-256 size encoding rather than parsing it', () => {
    // Set the high bit of the size field, then re-sign the header so the
    // checksum gate (which runs first) passes and the size parse is reached.
    const archive = Buffer.from(tar([{ name: 'a.js', data: 'x' }]))
    archive[124] = 0x80
    resign(archive)
    expect(() => untar(new Uint8Array(archive))).toThrow(/base-256/)
  })
})

describe('looksLikeTar', () => {
  it('recognizes a tar archive', () => {
    expect(looksLikeTar(tar([{ name: 'a.js', data: 'x' }]))).toBe(true)
  })

  it('rejects a bare JavaScript payload', () => {
    expect(looksLikeTar(new Uint8Array(Buffer.from('globalThis.x = 1\n'.repeat(80), 'utf8')))).toBe(false)
  })

  it('rejects a buffer too short to hold a header', () => {
    expect(looksLikeTar(new Uint8Array([1, 2, 3]))).toBe(false)
  })

  it('recognizes the GNU space-padded magic', () => {
    const archive = Buffer.from(tar([{ name: 'a.js', data: 'x' }]))
    archive.write('ustar ', 257, 'latin1')
    expect(looksLikeTar(new Uint8Array(archive))).toBe(true)
  })

  it('does not confuse gzipped bytes for a tar', () => {
    expect(looksLikeTar(new Uint8Array(gzipSync(Buffer.from('hello'))))).toBe(false)
  })
})

describe('safeEntryPath', () => {
  it('normalizes redundant separators and dot segments', () => {
    expect(safeEntryPath('./package//dist/./bundle.js')).toBe('package/dist/bundle.js')
  })

  it('refuses paths that resolve to nothing', () => {
    expect(safeEntryPath('.')).toBeUndefined()
    expect(safeEntryPath('')).toBeUndefined()
  })

  it('refuses an embedded NUL', () => {
    expect(safeEntryPath('bundle.js\0.png')).toBeUndefined()
  })
})

describe('stripCommonRoot', () => {
  const entry = (path: string): TarEntry => ({ path, data: new Uint8Array() })

  it('drops the shared npm-pack wrapper directory', () => {
    const out = stripCommonRoot([entry('package/powerdesk.json'), entry('package/bundle.js')])
    expect(out.map(e => e.path)).toEqual(['powerdesk.json', 'bundle.js'])
  })

  it('leaves a flat archive untouched', () => {
    const out = stripCommonRoot([entry('powerdesk.json'), entry('bundle.js')])
    expect(out.map(e => e.path)).toEqual(['powerdesk.json', 'bundle.js'])
  })

  it('leaves an archive with several roots untouched', () => {
    const out = stripCommonRoot([entry('a/x.js'), entry('b/y.js')])
    expect(out.map(e => e.path)).toEqual(['a/x.js', 'b/y.js'])
  })

  it('strips only one level', () => {
    const out = stripCommonRoot([entry('package/dist/bundle.js'), entry('package/powerdesk.json')])
    expect(out.map(e => e.path)).toEqual(['dist/bundle.js', 'powerdesk.json'])
  })

  it('returns an empty list for an empty archive', () => {
    expect(stripCommonRoot([])).toEqual([])
  })
})
