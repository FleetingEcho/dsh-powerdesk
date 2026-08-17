import { describe, it, expect } from 'vitest'
import { ResttyError, readJsonBody, requireString, writeError, writeJson, writeOk } from '../src/wire.ts'

function fakeReq(chunks: (string | Uint8Array)[]): any {
  const iter = chunks[Symbol.iterator]()
  return {
    headers: {},
    [Symbol.asyncIterator]: () => ({
      next: async () => {
        const r = iter.next()
        return r.done ? { value: undefined, done: true } : { value: r.value, done: false }
      },
    }),
  }
}

function fakeRes(): { statusCode: number; body: string; headers: Record<string, string>; writeHead(s: number, h?: Record<string, string>): void; end(b?: string): void } {
  const res = { statusCode: 0, body: '', headers: {} as Record<string, string>, writeHead(s: number, h?: Record<string, string>) { this.statusCode = s; if (h) Object.assign(this.headers, h) }, end(b?: string) { this.body = b ?? '' } }
  return res
}

describe('wire', () => {
  it('readJsonBody parses a JSON body', async () => {
    expect(await readJsonBody(fakeReq(['{"a":1}']))).toEqual({ a: 1 })
  })

  it('readJsonBody returns {} for an empty body', async () => {
    expect(await readJsonBody(fakeReq(['', '  ']))).toEqual({})
  })

  it('readJsonBody rejects an oversized body', async () => {
    const big = 'x'.repeat(1 << 20 + 1)
    await expect(readJsonBody(fakeReq([big]))).rejects.toBeInstanceOf(ResttyError)
  })

  it('readJsonBody rejects malformed JSON', async () => {
    await expect(readJsonBody(fakeReq(['{not json}']))).rejects.toBeInstanceOf(ResttyError)
  })

  it('writeJson / writeOk / writeError shape the envelope', () => {
    const res = fakeRes()
    writeOk(res, { ok: 1 })
    expect(res.statusCode).toBe(200)
    expect(JSON.parse(res.body)).toEqual({ ok: true, value: { ok: 1 } })

    const res2 = fakeRes()
    writeJson(res2, 418, { x: 1 })
    expect(res2.statusCode).toBe(418)
    expect(res2.headers['content-type']).toContain('application/json')

    const res3 = fakeRes()
    writeError(res3, new ResttyError('pty-error', 'nope', 400))
    expect(res3.statusCode).toBe(400)
    expect(JSON.parse(res3.body)).toEqual({ ok: false, error: { code: 'pty-error', message: 'nope' } })

    const res4 = fakeRes()
    writeError(res4, new Error('boom'))
    expect(res4.statusCode).toBe(500)
    expect(JSON.parse(res4.body).error.code).toBe('internal')
  })

  it('requireString returns the string or throws bad-request', () => {
    expect(requireString({ sessionId: 's1' }, 'sessionId')).toBe('s1')
    expect(() => requireString({ sessionId: '' }, 'sessionId')).toThrow(ResttyError)
    expect(() => requireString({}, 'missing')).toThrow(ResttyError)
  })
})
