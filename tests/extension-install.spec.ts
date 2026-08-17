import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { gzipSync } from 'node:zlib'
import { createHash } from 'node:crypto'
import { installExtension, MAX_UPLOAD_BYTES } from '../src/extensions/install.ts'
import {
  bundlePathOf,
  extensionDir,
  listExtensions,
  readExtension,
  removeExtension,
  resolveExtensionsDir,
  defaultExtensionsDir,
} from '../src/extensions/registry.ts'
import { ExtensionError, chunkKeyOf, isValidExtensionId, parseManifest } from '../src/extensions/manifest.ts'

const BLOCK = 512

/** Build a one-member ustar header with a valid checksum. */
function header(name: string, size: number): Buffer {
  const block = Buffer.alloc(BLOCK, 0)
  block.write(name.slice(0, 100), 0, 'latin1')
  block.write('0000644\0', 100, 'latin1')
  block.write(`${size.toString(8).padStart(11, '0')}\0`, 124, 'latin1')
  block.write('0', 156, 'latin1')
  block.write('ustar\0', 257, 'latin1')
  block.write('00', 263, 'latin1')
  block.write('        ', 148, 'latin1')
  let sum = 0
  for (const byte of block) sum += byte
  block.write(`${sum.toString(8).padStart(6, '0')}\0 `, 148, 'latin1')
  return block
}

/** Build a tar archive from a {path: content} map. */
function tar(files: Record<string, string>): Buffer {
  const parts: Buffer[] = []
  for (const [name, content] of Object.entries(files)) {
    const data = Buffer.from(content, 'utf8')
    parts.push(header(name, data.length))
    const padded = Buffer.alloc(Math.ceil(data.length / BLOCK) * BLOCK, 0)
    data.copy(padded)
    parts.push(padded)
  }
  parts.push(Buffer.alloc(BLOCK * 2, 0))
  return Buffer.concat(parts)
}

const GOOD_MANIFEST = {
  apiVersion: 1,
  id: 'acme-notes',
  title: 'Acme Notes',
  icon: '📝',
  entry: 'bundle.js',
  export: 'default',
  order: 200,
  single: true,
}

const BUNDLE = 'globalThis.__dshPowerdeskChunks__["ext:acme-notes"] = (require) => ({ default: () => null })\n'

/** A well-formed .tgz for `acme-notes`. */
function goodTgz(overrides: Record<string, unknown> = {}, files: Record<string, string> = {}): Uint8Array {
  return new Uint8Array(gzipSync(tar({
    'powerdesk.json': JSON.stringify({ ...GOOD_MANIFEST, ...overrides }),
    'bundle.js': BUNDLE,
    ...files,
  })))
}

let root: string

beforeEach(async () => {
  root = await mkdtemp(join(tmpdir(), 'powerdesk-ext-'))
})

afterEach(async () => {
  await rm(root, { recursive: true, force: true })
})

describe('installExtension: accepted formats', () => {
  it('installs a .tgz and reads it back', async () => {
    const installed = await installExtension(root, { filename: 'acme-notes.tgz', data: goodTgz() })
    expect(installed.id).toBe('acme-notes')
    expect(installed.error).toBeUndefined()
    expect(installed.manifest?.title).toBe('Acme Notes')
    expect(installed.manifest?.single).toBe(true)
    expect(await readFile(join(root, 'acme-notes', 'bundle.js'), 'utf8')).toBe(BUNDLE)
  })

  it('installs an uncompressed .tar', async () => {
    const data = new Uint8Array(tar({ 'powerdesk.json': JSON.stringify(GOOD_MANIFEST), 'bundle.js': BUNDLE }))
    const installed = await installExtension(root, { filename: 'acme.tar', data })
    expect(installed.manifest?.id).toBe('acme-notes')
  })

  it('strips the npm-pack "package/" wrapper directory', async () => {
    const data = new Uint8Array(gzipSync(tar({
      'package/powerdesk.json': JSON.stringify(GOOD_MANIFEST),
      'package/bundle.js': BUNDLE,
    })))
    const installed = await installExtension(root, { filename: 'acme-notes-1.0.0.tgz', data })
    expect(installed.manifest?.id).toBe('acme-notes')
    expect(await readFile(join(root, 'acme-notes', 'bundle.js'), 'utf8')).toBe(BUNDLE)
  })

  it('installs a gzipped bare script using the dialog-supplied identity', async () => {
    const data = new Uint8Array(gzipSync(Buffer.from(BUNDLE, 'utf8')))
    const installed = await installExtension(root, {
      filename: 'bundle.js.gz',
      data,
      fallback: { id: 'bare-one', title: 'Bare One', icon: '🧩' },
    })
    expect(installed.id).toBe('bare-one')
    expect(installed.manifest?.title).toBe('Bare One')
    expect(installed.manifest?.entry).toBe('bundle.js')
    expect(await readFile(join(root, 'bare-one', 'bundle.js'), 'utf8')).toBe(BUNDLE)
    // The host synthesizes a manifest so the directory is self-describing.
    expect(JSON.parse(await readFile(join(root, 'bare-one', 'powerdesk.json'), 'utf8')).id).toBe('bare-one')
  })

  it('installs an uncompressed bare script', async () => {
    const installed = await installExtension(root, {
      filename: 'bundle.js',
      data: new Uint8Array(Buffer.from(BUNDLE, 'utf8')),
      fallback: { id: 'plain-js', title: 'Plain JS' },
    })
    expect(installed.id).toBe('plain-js')
  })

  it('ignores the filename and trusts the bytes', async () => {
    // A .tgz payload uploaded under a .js name still installs as an archive.
    const installed = await installExtension(root, { filename: 'totally-a-script.js', data: goodTgz() })
    expect(installed.manifest?.id).toBe('acme-notes')
  })

  it('keeps extra files shipped alongside the bundle', async () => {
    const data = goodTgz({}, { 'README.md': '# hi' })
    await installExtension(root, { filename: 'a.tgz', data })
    expect(await readFile(join(root, 'acme-notes', 'README.md'), 'utf8')).toBe('# hi')
  })

  it('honors a custom entry file name', async () => {
    const data = new Uint8Array(gzipSync(tar({
      'powerdesk.json': JSON.stringify({ ...GOOD_MANIFEST, entry: 'main.js' }),
      'main.js': BUNDLE,
    })))
    const installed = await installExtension(root, { filename: 'a.tgz', data })
    expect(installed.manifest?.entry).toBe('main.js')
    expect(installed.bundleBytes).toBe(Buffer.byteLength(BUNDLE))
  })
})

describe('installExtension: provenance', () => {
  it('records the upload filename, size, and sha256', async () => {
    const data = goodTgz()
    const installed = await installExtension(root, { filename: 'acme-notes.tgz', data })
    expect(installed.install?.sourceFilename).toBe('acme-notes.tgz')
    expect(installed.install?.sourceBytes).toBe(data.length)
    expect(installed.install?.sha256).toBe(createHash('sha256').update(data).digest('hex'))
    expect(Date.parse(installed.install?.installedAt ?? '')).not.toBeNaN()
  })

  it('overwrites an archive-supplied .install.json with the host record', async () => {
    const data = goodTgz({}, { '.install.json': JSON.stringify({ installedAt: 'forged', sha256: 'forged' }) })
    const installed = await installExtension(root, { filename: 'a.tgz', data })
    expect(installed.install?.sha256).not.toBe('forged')
    expect(installed.install?.installedAt).not.toBe('forged')
  })
})

describe('installExtension: replacement is atomic', () => {
  it('replaces an existing install of the same id', async () => {
    await installExtension(root, { filename: 'v1.tgz', data: goodTgz({ title: 'Version One' }) })
    const second = await installExtension(root, { filename: 'v2.tgz', data: goodTgz({ title: 'Version Two' }) })
    expect(second.manifest?.title).toBe('Version Two')
    expect((await listExtensions(root)).length).toBe(1)
  })

  it('drops files the replacement no longer ships', async () => {
    await installExtension(root, { filename: 'v1.tgz', data: goodTgz({}, { 'stale.txt': 'old' }) })
    await installExtension(root, { filename: 'v2.tgz', data: goodTgz() })
    await expect(readFile(join(root, 'acme-notes', 'stale.txt'), 'utf8')).rejects.toThrow()
  })

  it('leaves the previous install intact when the new upload is rejected', async () => {
    await installExtension(root, { filename: 'v1.tgz', data: goodTgz({ title: 'Version One' }) })
    const broken = new Uint8Array(gzipSync(tar({ 'powerdesk.json': '{ not json' })))
    await expect(installExtension(root, { filename: 'v2.tgz', data: broken })).rejects.toThrow(ExtensionError)
    expect((await readExtension(root, 'acme-notes')).manifest?.title).toBe('Version One')
  })

  it('leaves no staging directory behind after a rejected upload', async () => {
    const noEntry = new Uint8Array(gzipSync(tar({ 'powerdesk.json': JSON.stringify(GOOD_MANIFEST) })))
    await expect(installExtension(root, { filename: 'a.tgz', data: noEntry })).rejects.toThrow()
    const { readdir } = await import('node:fs/promises')
    expect((await readdir(root)).filter(name => name.startsWith('.tmp-'))).toEqual([])
  })
})

describe('installExtension: rejected uploads', () => {
  it('rejects an empty upload', async () => {
    await expect(installExtension(root, { filename: 'x.tgz', data: new Uint8Array() }))
      .rejects.toThrow(/empty/)
  })

  it('rejects an oversized upload', async () => {
    const data = new Uint8Array(MAX_UPLOAD_BYTES + 1)
    data[0] = 0x1f
    data[1] = 0x8b
    await expect(installExtension(root, { filename: 'x.tgz', data })).rejects.toThrow(/exceeds/)
  })

  it('rejects an archive with no powerdesk.json', async () => {
    const data = new Uint8Array(gzipSync(tar({ 'bundle.js': BUNDLE })))
    await expect(installExtension(root, { filename: 'x.tgz', data })).rejects.toThrow(/no powerdesk.json/)
  })

  it('rejects an archive whose entry file is missing', async () => {
    const data = new Uint8Array(gzipSync(tar({ 'powerdesk.json': JSON.stringify(GOOD_MANIFEST) })))
    await expect(installExtension(root, { filename: 'x.tgz', data })).rejects.toThrow(/no "bundle.js"/)
  })

  it('rejects a bare script with no dialog-supplied identity', async () => {
    await expect(installExtension(root, {
      filename: 'bundle.js',
      data: new Uint8Array(Buffer.from(BUNDLE, 'utf8')),
    })).rejects.toThrow(/id and a title/)
  })

  it('rejects a manifest with an unsafe id', async () => {
    const data = goodTgz({ id: '../escape' })
    await expect(installExtension(root, { filename: 'x.tgz', data })).rejects.toThrow(ExtensionError)
  })

  it('rejects a tar-slip archive without writing anything', async () => {
    const data = new Uint8Array(gzipSync(tar({
      'powerdesk.json': JSON.stringify(GOOD_MANIFEST),
      '../../evil.js': 'pwned',
    })))
    await expect(installExtension(root, { filename: 'x.tgz', data })).rejects.toThrow()
    expect(await listExtensions(root)).toEqual([])
  })

  it('rejects a manifest from a future apiVersion', async () => {
    await expect(installExtension(root, { filename: 'x.tgz', data: goodTgz({ apiVersion: 99 }) }))
      .rejects.toThrow(/apiVersion 99/)
  })

  it('rejects corrupt gzip', async () => {
    const data = new Uint8Array([0x1f, 0x8b, 0x08, 0x00, 0xff, 0xff, 0xff, 0xff])
    await expect(installExtension(root, { filename: 'x.tgz', data })).rejects.toThrow(ExtensionError)
  })

  it('rejects a gzip bomb via the inflate output cap', async () => {
    // ~64 MiB of zeros compresses to a few KiB and exceeds MAX_INFLATED_BYTES.
    const data = new Uint8Array(gzipSync(Buffer.alloc(64 * 1024 * 1024, 0)))
    await expect(installExtension(root, { filename: 'bomb.gz', data })).rejects.toThrow(ExtensionError)
  })
})

describe('registry', () => {
  it('lists installed extensions sorted by id', async () => {
    await installExtension(root, { filename: 'b.tgz', data: goodTgz({ id: 'bbb', title: 'B' }) })
    await installExtension(root, { filename: 'a.tgz', data: goodTgz({ id: 'aaa', title: 'A' }) })
    expect((await listExtensions(root)).map(e => e.id)).toEqual(['aaa', 'bbb'])
  })

  it('returns an empty list for a missing root', async () => {
    expect(await listExtensions(join(root, 'nope'))).toEqual([])
  })

  it('reports a broken extension instead of hiding it', async () => {
    await installExtension(root, { filename: 'ok.tgz', data: goodTgz({ id: 'good', title: 'Good' }) })
    await mkdir(join(root, 'broken'), { recursive: true })
    await writeFile(join(root, 'broken', 'powerdesk.json'), '{ not json')
    const listed = await listExtensions(root)
    expect(listed.map(e => e.id)).toEqual(['broken', 'good'])
    expect(listed.find(e => e.id === 'broken')?.error).toBeTruthy()
    expect(listed.find(e => e.id === 'good')?.error).toBeUndefined()
  })

  it('reports an extension whose bundle file vanished', async () => {
    await installExtension(root, { filename: 'a.tgz', data: goodTgz() })
    await rm(join(root, 'acme-notes', 'bundle.js'))
    expect((await readExtension(root, 'acme-notes')).error).toBeTruthy()
  })

  it('rejects a manifest id that disagrees with its directory', async () => {
    await installExtension(root, { filename: 'a.tgz', data: goodTgz() })
    const dir = join(root, 'acme-notes')
    await writeFile(join(dir, 'powerdesk.json'), JSON.stringify({ ...GOOD_MANIFEST, id: 'somethingelse' }))
    expect((await readExtension(root, 'acme-notes')).error).toMatch(/does not match/)
  })

  it('skips staging directories and non-id directory names', async () => {
    await mkdir(join(root, '.tmp-acme-notes-1234abcd'), { recursive: true })
    await mkdir(join(root, 'Not_An_Id'), { recursive: true })
    expect(await listExtensions(root)).toEqual([])
  })

  it('removes an extension, and removing an absent one is a no-op', async () => {
    await installExtension(root, { filename: 'a.tgz', data: goodTgz() })
    await removeExtension(root, 'acme-notes')
    expect(await listExtensions(root)).toEqual([])
    await expect(removeExtension(root, 'acme-notes')).resolves.toBeUndefined()
  })

  it('refuses a traversal id at the path boundary', async () => {
    expect(() => extensionDir(root, '../../etc')).toThrow(ExtensionError)
    await expect(removeExtension(root, '..')).rejects.toThrow(ExtensionError)
  })

  it('refuses an entry that escapes the extension directory', () => {
    expect(() => bundlePathOf(root, 'acme-notes', '../../evil.js')).toThrow(ExtensionError)
    expect(() => bundlePathOf(root, 'acme-notes', '../sibling.js')).toThrow(ExtensionError)
    expect(() => bundlePathOf(root, 'acme-notes', 'nested/bundle.js')).toThrow(ExtensionError)
    expect(() => bundlePathOf(root, 'acme-notes', '/etc/passwd')).toThrow(ExtensionError)
    expect(bundlePathOf(root, 'acme-notes', 'bundle.js')).toBe(join(root, 'acme-notes', 'bundle.js'))
  })

  it('resolves the configured directory, falling back to the default', () => {
    expect(resolveExtensionsDir('/opt/ext')).toBe('/opt/ext')
    expect(resolveExtensionsDir('  ')).toBe(defaultExtensionsDir())
    expect(resolveExtensionsDir(undefined)).toBe(defaultExtensionsDir())
  })
})

describe('manifest validation', () => {
  it('fills defaults for entry and export', () => {
    const manifest = parseManifest({ id: 'a', title: 'A' })
    expect(manifest.entry).toBe('bundle.js')
    expect(manifest.export).toBe('default')
    expect(manifest.apiVersion).toBe(1)
  })

  const bad: ReadonlyArray<readonly [string, unknown]> = [
    ['a non-object document', 'nope'],
    ['an array document', []],
    ['a missing id', { title: 'A' }],
    ['an uppercase id', { id: 'Acme', title: 'A' }],
    ['an id with a slash', { id: 'a/b', title: 'A' }],
    ['an id with a dot', { id: 'a.b', title: 'A' }],
    ['a leading-dash id', { id: '-a', title: 'A' }],
    ['an over-long id', { id: 'a'.repeat(65), title: 'A' }],
    ['a blank title', { id: 'a', title: '   ' }],
    ['an over-long title', { id: 'a', title: 'x'.repeat(65) }],
    ['a non-string icon', { id: 'a', title: 'A', icon: 5 }],
    ['an over-long icon', { id: 'a', title: 'A', icon: 'toolong' }],
    ['an entry with a directory', { id: 'a', title: 'A', entry: 'dist/bundle.js' }],
    ['an entry that traverses', { id: 'a', title: 'A', entry: '../evil.js' }],
    ['a non-js entry', { id: 'a', title: 'A', entry: 'bundle.wasm' }],
    ['a non-number order', { id: 'a', title: 'A', order: 'first' }],
    ['a non-boolean single', { id: 'a', title: 'A', single: 'yes' }],
  ]
  for (const [label, value] of bad) {
    it(`rejects ${label}`, () => {
      expect(() => parseManifest(value)).toThrow(ExtensionError)
    })
  }

  it('accepts a multi-codepoint emoji icon', () => {
    expect(parseManifest({ id: 'a', title: 'A', icon: '👩‍💻' }).icon).toBe('👩‍💻')
  })

  it('drops unknown fields rather than carrying them', () => {
    const manifest = parseManifest({ id: 'a', title: 'A', component: 'evil', __proto__: 'x' })
    expect(Object.keys(manifest).sort()).toEqual(['apiVersion', 'entry', 'export', 'id', 'title'])
  })

  it('validates ids consistently with the id pattern', () => {
    expect(isValidExtensionId('acme-notes')).toBe(true)
    expect(isValidExtensionId('9lives')).toBe(true)
    expect(isValidExtensionId('')).toBe(false)
    expect(isValidExtensionId('..')).toBe(false)
  })

  it('namespaces the chunk key so a builtin name cannot be claimed', () => {
    expect(chunkKeyOf('terminal')).toBe('ext:terminal')
    expect(chunkKeyOf('acme-notes')).toBe('ext:acme-notes')
  })
})
