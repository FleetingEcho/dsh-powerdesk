import { describe, it, expect } from 'vitest'
import * as host from '../src/index.ts'
import * as client from '../src/client/index.tsx'
import { BrowserView, BROWSER_IFRAME_SANDBOX, BrowserEmbedBlocked } from '../src/client/BrowserView.tsx'

describe('plugin shape', () => {
  it('host half exports name / inject / apply / Config', () => {
    expect(host.name).toBe('dsh-powerdesk')
    expect(host.inject).toEqual(expect.arrayContaining(['webServer', 'sessions', 'webRuntime']))
    expect(typeof host.apply).toBe('function')
    expect(host.Config).toBeDefined()
  })

  it('client half exports inject / apply with the runtime services', () => {
    expect(client.inject).toEqual(expect.arrayContaining(['slots', 'sessions', 'locale']))
    expect(typeof client.apply).toBe('function')
  })

  it('client half exports the browser tab id', () => {
    expect(client.POWERDESK_BROWSER_TAB_ID).toBe('dsh-powerdesk:browser')
  })
})

describe('browser view exports', () => {
  it('BrowserView is a function and the sandbox tokens are set', () => {
    expect(typeof BrowserView).toBe('function')
    expect(BROWSER_IFRAME_SANDBOX).toContain('allow-scripts')
    // The sandbox MUST NOT grant same-origin or top-navigation.
    expect(BROWSER_IFRAME_SANDBOX).not.toContain('allow-same-origin')
    expect(BROWSER_IFRAME_SANDBOX).not.toContain('allow-top-navigation')
  })

  it('BrowserEmbedBlocked is a function', () => {
    expect(typeof BrowserEmbedBlocked).toBe('function')
  })
})
