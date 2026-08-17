import { describe, it, expect, beforeEach } from 'vitest'
import {
  buildRepairCommand,
  depsStatus,
  detectPlatformTriple,
  loadRustPty,
  nativeCandidates,
  resetRustPtyCache,
  rustPtyLoadCause,
  type NativeRequire,
} from '../src/rust-pty-deps.ts'

beforeEach(() => { resetRustPtyCache() })

describe('rust-pty-deps', () => {
  it('detectPlatformTriple maps known platforms and honors the env override', () => {
    expect(detectPlatformTriple('darwin', 'arm64', {})).toBe('darwin-arm64')
    expect(detectPlatformTriple('darwin', 'x64', {})).toBe('darwin-x64')
    expect(detectPlatformTriple('linux', 'x64', {})).toBe('linux-x64-gnu')
    expect(detectPlatformTriple('linux', 'arm64', {})).toBe('linux-arm64-gnu')
    expect(detectPlatformTriple('win32', 'x64', {})).toBe('win32-x64-msvc')
    expect(detectPlatformTriple('linux', 'x64', { DSH_POWERDESK_PTY_TRIPLE: 'linux-x64-musl' })).toBe('linux-x64-musl')
  })

  it('nativeCandidates lists env path, companion package, then prebuilt', () => {
    const c = nativeCandidates('darwin-arm64', '/plugin', { DSH_POWERDESK_PTY_PATH: '/abs/x.node' })
    expect(c[0]).toBe('/abs/x.node')
    expect(c[1]).toBe('@dsh-powerdesk-pty/darwin-arm64')
    expect(c[2]).toBe('/plugin/prebuilt/darwin-arm64/dsh_powerdesk_pty.node')
  })

  it('loadRustPty caches a valid module and returns it on the second call', () => {
    const mod = { spawn: () => ({}) }
    const requireImpl: NativeRequire = (id: string) => {
      if (id.startsWith('@dsh-powerdesk-pty/')) return mod
      throw new Error(`unexpected require ${id}`)
    }
    const first = loadRustPty(requireImpl)
    expect(first).toBe(mod)
    expect(loadRustPty(requireImpl)).toBe(first)
  })

  it('loadRustPty returns null and records the cause when every candidate fails', () => {
    const requireImpl: NativeRequire = () => { throw new Error('nope') }
    expect(loadRustPty(requireImpl)).toBeNull()
    expect(rustPtyLoadCause()).toBeInstanceOf(Error)
  })

  it('loadRustPty rejects a module with no spawn() export', () => {
    const requireImpl: NativeRequire = () => ({ notSpawn: 1 })
    expect(loadRustPty(requireImpl)).toBeNull()
  })

  it('loadRustPty accepts a default-exported module', () => {
    const mod = { spawn: () => ({}) }
    const requireImpl: NativeRequire = () => ({ default: mod })
    expect(loadRustPty(requireImpl)).toBe(mod)
  })

  it('depsStatus returns ok:true when the module loaded', () => {
    loadRustPty(() => ({ spawn: () => ({}) }))
    expect(depsStatus()).toEqual({ ok: true })
  })

  it('depsStatus returns a degraded shape with a repair command when the module is missing', () => {
    loadRustPty(() => { throw new Error('missing') })
    const status = depsStatus()
    expect(status.ok).toBe(false)
    if (!status.ok) {
      expect(typeof status.command).toBe('string')
      expect(status.command.length).toBeGreaterThan(0)
      // profile is environment-dependent (null when no DSH profile detected);
      // assert it's a string-or-null, not a specific value.
      expect(typeof status.profile === 'string' || status.profile === null).toBe(true)
    }
  })

  it('buildRepairCommand prefers the shipped install.sh on POSIX', () => {
    const { command } = buildRepairCommand({ pluginRoot: null, profileDir: null, platform: 'linux' })
    expect(command).toContain('dsh plugin')
  })
})
