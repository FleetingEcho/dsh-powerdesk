/**
 * End-to-end packaging check: what scripts/pack-extension.mjs emits must be
 * exactly what src/extensions/install.ts accepts. These two are written
 * independently (one in the author's toolchain, one in the host), so a drift
 * between them would only ever surface as a failed upload in a user's browser.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { execFile } from 'node:child_process'
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { promisify } from 'node:util'
import { installExtension } from '../src/extensions/install.ts'
import { listExtensions } from '../src/extensions/registry.ts'

const run = promisify(execFile)
// vitest runs with the repo root as cwd; import.meta.url is an http URL under
// the jsdom environment, so it cannot be used to locate repo files here.
const REPO = process.cwd()
const SCRIPT = join(REPO, 'scripts', 'pack-extension.mjs')

let work: string
let root: string

/** Lay out a buildable extension: manifest + an already-"built" dist bundle. */
async function scaffold(manifest: Record<string, unknown>, bundleKey?: string): Promise<string> {
  const dir = join(work, 'ext')
  await mkdir(join(dir, 'dist'), { recursive: true })
  await writeFile(join(dir, 'powerdesk.json'), JSON.stringify(manifest, null, 2))
  const key = bundleKey ?? `ext:${String(manifest.id)}`
  const entry = String(manifest.entry ?? 'bundle.js')
  await writeFile(
    join(dir, 'dist', entry),
    `globalThis.__dshPowerdeskChunks__ = globalThis.__dshPowerdeskChunks__ || {};\n`
    + `globalThis.__dshPowerdeskChunks__[${JSON.stringify(key)}] = (require) => ({ default: () => null });\n`,
  )
  return dir
}

/** Run the pack script, returning its stdout (throws on a non-zero exit). */
async function pack(dir: string, out: string): Promise<string> {
  const { stdout } = await run(process.execPath, [SCRIPT, dir, '--out', out])
  return stdout
}

beforeEach(async () => {
  work = await mkdtemp(join(tmpdir(), 'powerdesk-pack-'))
  root = await mkdtemp(join(tmpdir(), 'powerdesk-packroot-'))
})

afterEach(async () => {
  await rm(work, { recursive: true, force: true })
  await rm(root, { recursive: true, force: true })
})

describe('pack-extension', () => {
  it('produces an archive the installer accepts', async () => {
    const dir = await scaffold({ apiVersion: 1, id: 'acme-notes', title: 'Acme Notes', icon: '📝', single: true })
    const out = join(work, 'acme.tgz')
    await pack(dir, out)

    const installed = await installExtension(root, {
      filename: 'acme.tgz',
      data: new Uint8Array(await readFile(out)),
    })
    expect(installed.error).toBeUndefined()
    expect(installed.manifest?.id).toBe('acme-notes')
    expect(installed.manifest?.title).toBe('Acme Notes')
    expect(installed.manifest?.icon).toBe('📝')
    expect(installed.manifest?.single).toBe(true)
    expect((await listExtensions(root)).map(e => e.id)).toEqual(['acme-notes'])
  })

  it('round-trips the bundle bytes unchanged', async () => {
    const dir = await scaffold({ apiVersion: 1, id: 'acme-notes', title: 'Acme Notes' })
    const out = join(work, 'acme.tgz')
    await pack(dir, out)
    await installExtension(root, { filename: 'acme.tgz', data: new Uint8Array(await readFile(out)) })
    expect(await readFile(join(root, 'acme-notes', 'bundle.js'), 'utf8'))
      .toBe(await readFile(join(dir, 'dist', 'bundle.js'), 'utf8'))
  })

  it('honors a custom entry file name end to end', async () => {
    const dir = await scaffold({ apiVersion: 1, id: 'acme-notes', title: 'Acme', entry: 'main.js' })
    const out = join(work, 'acme.tgz')
    await pack(dir, out)
    const installed = await installExtension(root, {
      filename: 'acme.tgz',
      data: new Uint8Array(await readFile(out)),
    })
    expect(installed.manifest?.entry).toBe('main.js')
  })

  it('reports the sha256 of the archive it wrote', async () => {
    const dir = await scaffold({ apiVersion: 1, id: 'acme-notes', title: 'Acme' })
    const out = join(work, 'acme.tgz')
    const stdout = await pack(dir, out)
    const reported = /sha256\s+([0-9a-f]{64})/.exec(stdout)?.[1]
    const installed = await installExtension(root, {
      filename: 'acme.tgz',
      data: new Uint8Array(await readFile(out)),
    })
    // The hash the author sees at pack time is the hash the user sees in the
    // settings card — that is the whole point of showing it in both places.
    expect(installed.install?.sha256).toBe(reported)
  })

  it('fails when the bundle registers a stale chunk key', async () => {
    // The classic mistake: the manifest id changed but the bundle was not
    // rebuilt, so it still registers under the previous key.
    const dir = await scaffold({ apiVersion: 1, id: 'new-id', title: 'Acme' }, 'ext:old-id')
    await expect(pack(dir, join(work, 'a.tgz'))).rejects.toThrow(/does not register/)
  })

  it('fails on an invalid manifest id before writing anything', async () => {
    const dir = await scaffold({ apiVersion: 1, id: 'Not_Valid', title: 'Acme' })
    await expect(pack(dir, join(work, 'a.tgz'))).rejects.toThrow(/"id" must match/)
  })

  it('fails on a blank title', async () => {
    const dir = await scaffold({ apiVersion: 1, id: 'acme', title: '  ' })
    await expect(pack(dir, join(work, 'a.tgz'))).rejects.toThrow(/"title"/)
  })

  it('fails when no built bundle is present', async () => {
    const dir = join(work, 'ext')
    await mkdir(dir, { recursive: true })
    await writeFile(join(dir, 'powerdesk.json'), JSON.stringify({ id: 'acme', title: 'Acme' }))
    await expect(pack(dir, join(work, 'a.tgz'))).rejects.toThrow(/no built bundle/)
  })

  it('fails when there is no manifest at all', async () => {
    const dir = join(work, 'empty')
    await mkdir(dir, { recursive: true })
    await expect(pack(dir, join(work, 'a.tgz'))).rejects.toThrow(/no powerdesk.json/)
  })

  it('accepts a bundle built to the extension root rather than dist/', async () => {
    const dir = join(work, 'ext')
    await mkdir(dir, { recursive: true })
    await writeFile(join(dir, 'powerdesk.json'), JSON.stringify({ id: 'acme', title: 'Acme' }))
    await writeFile(join(dir, 'bundle.js'), 'globalThis.__dshPowerdeskChunks__["ext:acme"] = () => ({})')
    const out = join(work, 'a.tgz')
    await pack(dir, out)
    const installed = await installExtension(root, {
      filename: 'a.tgz',
      data: new Uint8Array(await readFile(out)),
    })
    expect(installed.manifest?.id).toBe('acme')
  })
})

describe('template', () => {
  it('ships a manifest the packer considers valid', async () => {
    const template = join(REPO, 'templates', 'extension', 'powerdesk.json')
    const manifest = JSON.parse(await readFile(template, 'utf8')) as Record<string, unknown>
    const dir = await scaffold(manifest)
    const out = join(work, 'template.tgz')
    await pack(dir, out)
    const installed = await installExtension(root, {
      filename: 'template.tgz',
      data: new Uint8Array(await readFile(out)),
    })
    expect(installed.error).toBeUndefined()
    expect(installed.manifest?.id).toBe(manifest.id)
  })
})
