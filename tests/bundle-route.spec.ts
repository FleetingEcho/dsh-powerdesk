import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mkdtemp, writeFile, rm } from 'node:fs/promises'
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

  it('CHUNK_NAMES is exactly [terminal, browser, editor]', () => {
    expect([...CHUNK_NAMES]).toEqual(['terminal', 'browser', 'editor'])
  })
})
