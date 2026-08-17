import { describe, it, expect } from 'vitest'
import { normalizeBrowserUrl, isLoopbackHostname } from '../src/client/browser.ts'

const SELF = 'http://127.0.0.1:3080'

describe('normalizeBrowserUrl', () => {
  it('adds https:// to a bare host', () => {
    const r = normalizeBrowserUrl('example.com', SELF)
    expect(r).toEqual({ kind: 'ok', url: 'https://example.com/' })
  })

  it('keeps an explicit http:// url', () => {
    const r = normalizeBrowserUrl('http://example.com', SELF)
    expect(r).toEqual({ kind: 'ok', url: 'http://example.com/' })
  })

  it('keeps an explicit https:// url', () => {
    const r = normalizeBrowserUrl('https://example.com', SELF)
    expect(r).toEqual({ kind: 'ok', url: 'https://example.com/' })
  })

  it('preserves the path and query', () => {
    const r = normalizeBrowserUrl('example.com/path?q=1', SELF)
    expect(r).toEqual({ kind: 'ok', url: 'https://example.com/path?q=1' })
  })

  it('adds a default port via URL normalization', () => {
    const r = normalizeBrowserUrl('http://example.com:8080', SELF)
    expect(r).toEqual({ kind: 'ok', url: 'http://example.com:8080/' })
  })

  it('blocks javascript: scheme', () => {
    const r = normalizeBrowserUrl('javascript:alert(1)', SELF)
    expect(r).toEqual({ kind: 'blocked', reason: 'scheme' })
  })

  it('blocks data: scheme', () => {
    const r = normalizeBrowserUrl('data:text/html,hi', SELF)
    expect(r).toEqual({ kind: 'blocked', reason: 'scheme' })
  })

  it('blocks file: scheme', () => {
    const r = normalizeBrowserUrl('file:///etc/passwd', SELF)
    expect(r).toEqual({ kind: 'blocked', reason: 'scheme' })
  })

  it('blocks loopback addresses (localhost)', () => {
    const r = normalizeBrowserUrl('http://localhost:3000', SELF)
    expect(r).toEqual({ kind: 'blocked', reason: 'loopback' })
  })

  it('blocks loopback addresses (127.0.0.1)', () => {
    const r = normalizeBrowserUrl('http://127.0.0.1:3000', SELF)
    expect(r).toEqual({ kind: 'blocked', reason: 'loopback' })
  })

  it('blocks loopback addresses (127.x.x.x)', () => {
    const r = normalizeBrowserUrl('http://127.1.2.3', SELF)
    expect(r).toEqual({ kind: 'blocked', reason: 'loopback' })
  })

  it('blocks loopback addresses (::1)', () => {
    const r = normalizeBrowserUrl('http://[::1]', SELF)
    expect(r).toEqual({ kind: 'blocked', reason: 'loopback' })
  })

  it('allows the GUI\'s own origin even though it is loopback', () => {
    const r = normalizeBrowserUrl('http://127.0.0.1:3080', SELF)
    expect(r).toEqual({ kind: 'ok', url: 'http://127.0.0.1:3080/' })
  })

  it('returns invalid for an empty string', () => {
    expect(normalizeBrowserUrl('', SELF)).toEqual({ kind: 'invalid' })
    expect(normalizeBrowserUrl('   ', SELF)).toEqual({ kind: 'invalid' })
  })

  it('returns invalid for an unparseable host', () => {
    expect(normalizeBrowserUrl('https://', SELF)).toEqual({ kind: 'invalid' })
  })

  it('treats a non-http(s) scheme prefix as a bare host (https:// added)', () => {
    // "myapp:8080" looks like a scheme but myapp is not forbidden, so it is
    // treated as a host → https://myapp:8080
    const r = normalizeBrowserUrl('myapp:8080', SELF)
    expect(r).toEqual({ kind: 'ok', url: 'https://myapp:8080/' })
  })

  it('blocks a ws:// URL (protocol backstop)', () => {
    const r = normalizeBrowserUrl('ws://example.com', SELF)
    expect(r).toEqual({ kind: 'blocked', reason: 'scheme' })
  })
})

describe('isLoopbackHostname', () => {
  it('recognizes localhost', () => {
    expect(isLoopbackHostname('localhost')).toBe(true)
  })

  it('recognizes ::1 (with and without brackets)', () => {
    expect(isLoopbackHostname('[::1]')).toBe(true)
    expect(isLoopbackHostname('::1')).toBe(true)
  })

  it('recognizes 127.0.0.0/8', () => {
    expect(isLoopbackHostname('127.0.0.1')).toBe(true)
    expect(isLoopbackHostname('127.255.255.255')).toBe(true)
  })

  it('recognizes 0.0.0.0', () => {
    expect(isLoopbackHostname('0.0.0.0')).toBe(true)
  })

  it('rejects a public IP', () => {
    expect(isLoopbackHostname('192.168.1.1')).toBe(false)
    expect(isLoopbackHostname('8.8.8.8')).toBe(false)
  })

  it('rejects a hostname', () => {
    expect(isLoopbackHostname('example.com')).toBe(false)
  })

  it('is case-insensitive', () => {
    expect(isLoopbackHostname('LOCALHOST')).toBe(true)
    expect(isLoopbackHostname('LocalHost')).toBe(true)
  })
})
