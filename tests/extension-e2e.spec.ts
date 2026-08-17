/**
 * Full-pipeline check against a REAL bundle built by the extension template's
 * own tsdown config: pack -> install -> serve over the bundle route -> execute
 * the chunk factory -> resolve the component.
 *
 * The unit specs each stub the stage next to them; this one stubs nothing but
 * the network transport, so a mismatch anywhere along the chain (the banner's
 * registry key, the CJS export shape, the route's manifest lookup) fails here
 * even when every individual stage still passes.
 *
 * The template is built with its OWN tsdown config (not the plugin's), which
 * is the point: that config is what extension authors will actually run, so
 * a mistake in it must fail the plugin's test suite.
 */
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { installExtension } from '../src/extensions/install.ts'
import { createBundleRouteHandler } from '../src/bundle-route.ts'
import { loadChunk, resetChunks, setChunkLoader } from '../src/client/chunk-loader.ts'
import { extensionTabDescriptor } from '../src/client/extensions.ts'
import type { ResttyHttpRequest, ResttyHttpResponse } from '../src/context-types.ts'

const run = promisify(execFile)
const REPO = process.cwd()
const DEMO = join(REPO, '.demo-extension')

let root: string
let served: Buffer | undefined

/** Build + pack the template into a temp dir, then install and serve it. */
beforeAll(async () => {
  await rm(DEMO, { recursive: true, force: true })
  await run('cp', ['-r', join(REPO, 'templates', 'extension'), DEMO])
  await run('ln', ['-s', join(REPO, 'node_modules'), join(DEMO, 'node_modules')])
  // The .bin entry is a shell wrapper; run tsdown's real ESM entry directly.
  await run(process.execPath, [join(REPO, 'node_modules', 'tsdown', 'dist', 'run.mjs')], { cwd: DEMO })
  const archive = join(DEMO, 'demo.tgz')
  await run(process.execPath, [join(REPO, 'scripts', 'pack-extension.mjs'), DEMO, '--out', archive])

  root = await mkdtemp(join(tmpdir(), 'powerdesk-e2e-'))
  await installExtension(root, { filename: 'demo.tgz', data: new Uint8Array(await readFile(archive)) })

  // Serve it through the real route handler.
  const handler = createBundleRouteHandler(() => true, join(REPO, 'lib'), { enabled: true, dir: root })
  let status = 0
  const res = {
    writeHead(code: number) { status = code },
    end(data?: Buffer) { served = data },
  } as unknown as ResttyHttpResponse
  await handler(
    { url: '/powerdesk/bundle/ext/my-extension.js', method: 'GET', headers: {} } as unknown as ResttyHttpRequest,
    res,
  )
  expect(status).toBe(200)
}, 120_000)

afterAll(async () => {
  await rm(DEMO, { recursive: true, force: true })
  if (root !== undefined) await rm(root, { recursive: true, force: true })
})

describe('extension end-to-end', () => {
  it('serves the built bundle over the route', () => {
    expect(served).toBeDefined()
    expect(served?.toString('utf8')).toContain('__dshPowerdeskChunks__["ext:my-extension"]')
  })

  it('executes the served script and resolves the component', async () => {
    resetChunks()
    delete (globalThis as { __dshPowerdeskChunks__?: unknown }).__dshPowerdeskChunks__
    const react = await import('react')
    const jsxRuntime = await import('react/jsx-runtime')
    ;(globalThis as { __DSH_MODULES__?: { import: (spec: string) => unknown } }).__DSH_MODULES__ = {
      import: (spec: string) => (spec === 'react' ? react : spec === 'react/jsx-runtime' ? jsxRuntime : undefined),
    }
    // Stand in for the <script> tag: evaluate exactly the bytes the route sent.
    setChunkLoader('ext:my-extension', async () => {
      // eslint-disable-next-line no-new-func
      new Function(served?.toString('utf8') ?? '')()
    })
    const mod = await loadChunk('ext:my-extension')

    const manifest = JSON.parse(await readFile(join(DEMO, 'powerdesk.json'), 'utf8')) as Record<string, unknown>
    const descriptor = extensionTabDescriptor({
      id: String(manifest.id),
      dir: root,
      manifest: manifest as never,
    })
    expect(descriptor?.id).toBe('ext:my-extension')
    const element = (descriptor?.component as (p: unknown) => { props: { pick: (m: unknown) => unknown } })({})
    expect(typeof element.props.pick(mod)).toBe('function')
  })
})
