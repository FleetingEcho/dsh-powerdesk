import { describe, it, expect } from 'vitest'
import { isLoopbackHostname, isTrustedApiRequest } from '../src/trust-fence.ts'

function req(host: string, extra: Record<string, string> = {}): { headers: Record<string, string | undefined> } {
  return { headers: { host, ...extra } }
}

describe('trust-fence', () => {
  it('isLoopbackHostname recognizes loopback forms', () => {
    expect(isLoopbackHostname('localhost')).toBe(true)
    expect(isLoopbackHostname('127.0.0.1')).toBe(true)
    expect(isLoopbackHostname('[::1]')).toBe(true)
    expect(isLoopbackHostname('192.168.1.5')).toBe(false)
    expect(isLoopbackHostname('example.com')).toBe(false)
  })

  it('accepts a loopback host with no cross-site marker', () => {
    expect(isTrustedApiRequest(req('127.0.0.1:9000'), [])).toBe(true)
  })

  it('accepts a same-origin request from a trusted host', () => {
    expect(isTrustedApiRequest(req('192.168.1.10:9000', { origin: 'http://192.168.1.10:9000' }), ['192.168.1.10'])).toBe(true)
  })

  it('rejects a cross-site marker', () => {
    expect(isTrustedApiRequest(req('127.0.0.1:9000', { 'sec-fetch-site': 'cross-site' }), [])).toBe(false)
  })

  it('rejects an untrusted host with a mismatched origin', () => {
    expect(isTrustedApiRequest(req('example.com', { origin: 'http://evil.com' }), [])).toBe(false)
  })

  it('rejects a missing host header', () => {
    expect(isTrustedApiRequest({ headers: {} }, [])).toBe(false)
  })
})
