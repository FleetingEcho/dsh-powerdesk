import { describe, it, expect } from 'vitest'
import { Config, resolveResttyConfig } from '../src/config.ts'

describe('config', () => {
  it('resolveResttyConfig fills defaults', () => {
    const r = resolveResttyConfig(undefined)
    expect(r).toEqual({
      terminalsPerSession: 3,
      reconnectGraceMs: 30_000,
      shell: '',
      extensionsEnabled: false,
      extensionsDir: '',
    })
  })

  it('resolveResttyConfig honors provided values and trims shell', () => {
    const r = resolveResttyConfig({ terminalsPerSession: 5, reconnectGraceMs: 1000, shell: '  /bin/zsh  ' })
    expect(r).toEqual({
      terminalsPerSession: 5,
      reconnectGraceMs: 1000,
      shell: '/bin/zsh',
      extensionsEnabled: false,
      extensionsDir: '',
    })
  })

  it('extensions stay OFF unless the deployment opts in', () => {
    // The default is load-bearing: an extension runs with the page's full
    // privileges, so an operator who never configured anything must not end
    // up serving third-party code.
    expect(resolveResttyConfig({}).extensionsEnabled).toBe(false)
    expect((Config({}) as ResolvedLike).extensionsEnabled).toBe(false)
  })

  it('resolveResttyConfig honors the extension settings and trims the dir', () => {
    const r = resolveResttyConfig({ extensionsEnabled: true, extensionsDir: '  /opt/ext  ' })
    expect(r.extensionsEnabled).toBe(true)
    expect(r.extensionsDir).toBe('/opt/ext')
  })

  it('Config schema validates and defaults (schemastery)', () => {
    const parsed = Config({}) as ResolvedLike
    expect(parsed.terminalsPerSession).toBe(3)
    expect(parsed.reconnectGraceMs).toBe(30_000)
    expect(parsed.shell).toBe('')
    expect(parsed.extensionsDir).toBe('')
  })
})

interface ResolvedLike {
  terminalsPerSession: number
  reconnectGraceMs: number
  shell: string
  extensionsEnabled: boolean
  extensionsDir: string
}
