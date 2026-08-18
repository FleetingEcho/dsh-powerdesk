import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mkdir, mkdtemp, writeFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createBundleRouteHandler, CHUNK_NAMES } from '../src/bundle-route.ts'
import type { ResttyHttpRequest, ResttyHttpResponse } from '../src/context-types.ts'

/** A minimal fake request: only url + method + headers are read by the handler. */
function fakeReq(url: string, headers: Record<string, string | undefined> = {}, method = 'GET'): ResttyHttpRequest {
  return { url, method, headers } as unknown as ResttyHttpRequest
}

/** A minimal fake response capturing writeHead + end. The methods mutate the
 *  captured fields so assertions read the live values after the handler runs. */
interface FakeRes {
  statusCode: number
  status: number
  headers: Record<string, string | string[]>
  body: string
  writeHead(code: number, hdrs?: Record<string, string | string[]>): void
  end(data?: string): void
}

function fakeRes(): FakeRes {
  const res: FakeRes = {
    statusCode: 0,
    status: 0,
    headers: {},
    body: '',
    writeHead(code, hdrs = {}) { res.status = code; res.statusCode = code; res.headers = hdrs },
    end(data) { res.body = data ?? '' },
  }
  return res
}

/** Cast a FakeRes to the handler's ResttyHttpResponse (structural subset). */
function asRes(res: FakeRes): ResttyHttpResponse {
  return res as unknown as ResttyHttpResponse
}

/** An always-pass fence (the path-matching logic is the unit under test). */
const passFence = (): boolean => true

describe('bundle-route handler', () => {
  let dir: string
  beforeEach(async () => {
    dir = await mkdtemp(join(tmpdir(), 'powerdesk-bundle-'))
  })
  afterEach(async () => {
    await rm(dir, { recursive: true, force: true })
  })

  it('serves /powerdesk/bundle/terminal.js with a javascript content-type + etag', async () => {
    await writeFile(join(dir, 'client-terminal.js'), 'console.log("terminal")')
    const handler = createBundleRouteHandler(passFence, dir)
    const out = fakeRes()
    await handler(fakeReq('/powerdesk/bundle/terminal.js'), asRes(out))
    expect(out.status).toBe(200)
    expect(out.headers['content-type']).toBe('text/javascript; charset=utf-8')
    expect(out.headers['etag']).toBeTruthy()
    expect(String(out.body)).toContain('console.log')
  })

  it('serves /powerdesk/bundle/browser.js (the browser chunk is allowlisted)', async () => {
    await writeFile(join(dir, 'client-browser.js'), 'console.log("browser")')
    const handler = createBundleRouteHandler(passFence, dir)
    const out = fakeRes()
    await handler(fakeReq('/powerdesk/bundle/browser.js'), asRes(out))
    expect(out.status).toBe(200)
    expect(out.headers['content-type']).toBe('text/javascript; charset=utf-8')
    expect(String(out.body)).toContain('browser')
  })

  it('404s an unknown chunk name (only allowlisted names are servable)', async () => {
    await writeFile(join(dir, 'client-terminal.js'), 'x')
    const handler = createBundleRouteHandler(passFence, dir)
    const out = fakeRes()
    await handler(fakeReq('/powerdesk/bundle/secrets.js'), asRes(out))
    expect(out.status).toBe(404)
  })

  it('404s a non-matching path (regression guard: route prefix is /powerdesk/bundle, not /restty/bundle)', async () => {
    await writeFile(join(dir, 'client-terminal.js'), 'x')
    const handler = createBundleRouteHandler(passFence, dir)
    // The route is registered at /powerdesk/bundle; a /restty/bundle request
    // must NOT match (the handler regex must agree with the registered prefix).
    const out = fakeRes()
    await handler(fakeReq('/restty/bundle/terminal.js'), asRes(out))
    expect(out.status).toBe(404)
  })

  it('CHUNK_NAMES is exactly [terminal, browser, editor, settings, calendar]', () => {
    expect([...CHUNK_NAMES]).toEqual(['terminal', 'browser', 'editor', 'settings', 'calendar'])
  })

  it('304s a matching If-None-Match instead of resending the body', async () => {
    await writeFile(join(dir, 'client-terminal.js'), 'console.log("terminal")')
    const handler = createBundleRouteHandler(passFence, dir)
    const first = fakeRes()
    await handler(fakeReq('/powerdesk/bundle/terminal.js'), asRes(first))
    const etag = String(first.headers['etag'])
    const second = fakeRes()
    await handler(fakeReq('/powerdesk/bundle/terminal.js', { 'if-none-match': etag }), asRes(second))
    expect(second.status).toBe(304)
    expect(second.body).toBe('')
  })

  it('403s a request the fence rejects', async () => {
    await writeFile(join(dir, 'client-terminal.js'), 'x')
    const handler = createBundleRouteHandler(() => false, dir)
    const out = fakeRes()
    await handler(fakeReq('/powerdesk/bundle/terminal.js'), asRes(out))
    expect(out.status).toBe(403)
  })

  it('405s a non-GET method', async () => {
    const handler = createBundleRouteHandler(passFence, dir)
    const out = fakeRes()
    await handler(fakeReq('/powerdesk/bundle/terminal.js', {}, 'POST'), asRes(out))
    expect(out.status).toBe(405)
  })
})

describe('bundle-route: extension bundles', () => {
  let libDir: string
  let extDir: string

  /** Install a minimal extension directory by hand (install.ts is tested
   *  separately; this exercises only what the route reads). */
  async function writeExtension(id: string, entry = 'bundle.js', body = 'ext-body'): Promise<void> {
    await mkdir(join(extDir, id), { recursive: true })
    await writeFile(join(extDir, id, 'powerdesk.json'), JSON.stringify({ id, title: id, entry }))
    await writeFile(join(extDir, id, entry), body)
  }

  beforeEach(async () => {
    libDir = await mkdtemp(join(tmpdir(), 'powerdesk-lib-'))
    extDir = await mkdtemp(join(tmpdir(), 'powerdesk-extroot-'))
  })
  afterEach(async () => {
    await rm(libDir, { recursive: true, force: true })
    await rm(extDir, { recursive: true, force: true })
  })

  it('serves an installed extension bundle', async () => {
    await writeExtension('acme-notes')
    const handler = createBundleRouteHandler(passFence, libDir, { enabled: true, dir: extDir })
    const out = fakeRes()
    await handler(fakeReq('/powerdesk/bundle/ext/acme-notes.js'), asRes(out))
    expect(out.status).toBe(200)
    expect(out.headers['content-type']).toBe('text/javascript; charset=utf-8')
    expect(String(out.body)).toBe('ext-body')
  })

  it('follows the manifest entry rather than assuming bundle.js', async () => {
    await writeExtension('acme-notes', 'main.js', 'custom-entry')
    const handler = createBundleRouteHandler(passFence, libDir, { enabled: true, dir: extDir })
    const out = fakeRes()
    await handler(fakeReq('/powerdesk/bundle/ext/acme-notes.js'), asRes(out))
    expect(String(out.body)).toBe('custom-entry')
  })

  it('404s every extension while the feature is disabled', async () => {
    await writeExtension('acme-notes')
    const handler = createBundleRouteHandler(passFence, libDir, { enabled: false, dir: extDir })
    const out = fakeRes()
    await handler(fakeReq('/powerdesk/bundle/ext/acme-notes.js'), asRes(out))
    expect(out.status).toBe(404)
  })

  it('404s the extension family when no source is configured', async () => {
    const handler = createBundleRouteHandler(passFence, libDir)
    const out = fakeRes()
    await handler(fakeReq('/powerdesk/bundle/ext/acme-notes.js'), asRes(out))
    expect(out.status).toBe(404)
  })

  it('404s an unknown extension id', async () => {
    const handler = createBundleRouteHandler(passFence, libDir, { enabled: true, dir: extDir })
    const out = fakeRes()
    await handler(fakeReq('/powerdesk/bundle/ext/nope.js'), asRes(out))
    expect(out.status).toBe(404)
  })

  it('404s an extension whose manifest is broken', async () => {
    await mkdir(join(extDir, 'broken'), { recursive: true })
    await writeFile(join(extDir, 'broken', 'powerdesk.json'), '{ not json')
    await writeFile(join(extDir, 'broken', 'bundle.js'), 'x')
    const handler = createBundleRouteHandler(passFence, libDir, { enabled: true, dir: extDir })
    const out = fakeRes()
    await handler(fakeReq('/powerdesk/bundle/ext/broken.js'), asRes(out))
    expect(out.status).toBe(404)
  })

  const traversals = [
    '/powerdesk/bundle/ext/..%2f..%2fetc%2fpasswd.js',
    '/powerdesk/bundle/ext/../../../../etc/passwd.js',
    '/powerdesk/bundle/ext/...js',
    '/powerdesk/bundle/ext/Acme.js',
    '/powerdesk/bundle/ext/a_b.js',
  ]
  for (const path of traversals) {
    it(`404s the traversal/invalid id "${path}"`, async () => {
      await writeExtension('acme-notes')
      const handler = createBundleRouteHandler(passFence, libDir, { enabled: true, dir: extDir })
      const out = fakeRes()
      await handler(fakeReq(path), asRes(out))
      expect(out.status).toBe(404)
    })
  }

  it('does not let an extension id shadow a built-in chunk name', async () => {
    await writeFile(join(libDir, 'client-terminal.js'), 'builtin')
    await writeExtension('terminal', 'bundle.js', 'imposter')
    const handler = createBundleRouteHandler(passFence, libDir, { enabled: true, dir: extDir })
    const builtin = fakeRes()
    await handler(fakeReq('/powerdesk/bundle/terminal.js'), asRes(builtin))
    expect(String(builtin.body)).toBe('builtin')
    // The extension is reachable only under its own /ext/ namespace.
    const ext = fakeRes()
    await handler(fakeReq('/powerdesk/bundle/ext/terminal.js'), asRes(ext))
    expect(String(ext.body)).toBe('imposter')
  })

  it('revalidates an extension bundle with an ETag', async () => {
    await writeExtension('acme-notes')
    const handler = createBundleRouteHandler(passFence, libDir, { enabled: true, dir: extDir })
    const first = fakeRes()
    await handler(fakeReq('/powerdesk/bundle/ext/acme-notes.js'), asRes(first))
    const second = fakeRes()
    await handler(fakeReq('/powerdesk/bundle/ext/acme-notes.js', { 'if-none-match': String(first.headers['etag']) }), asRes(second))
    expect(second.status).toBe(304)
  })
})
