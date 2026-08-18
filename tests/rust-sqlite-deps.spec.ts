import { describe, it, expect, beforeEach } from 'vitest'
import {
  detectSqliteTriple,
  loadRustSqlite,
  resetRustSqliteCache,
  rustSqliteLoadCause,
  sqliteCandidates,
  sqliteDepsStatus,
  type NativeRequire,
} from '../src/rust-sqlite-deps.ts'

beforeEach(() => { resetRustSqliteCache() })

describe('rust-sqlite-deps', () => {
  it('detectSqliteTriple maps known platforms and honors the sqlite env override', () => {
    expect(detectSqliteTriple('darwin', 'arm64', {})).toBe('darwin-arm64')
    expect(detectSqliteTriple('darwin', 'x64', {})).toBe('darwin-x64')
    expect(detectSqliteTriple('linux', 'x64', {})).toBe('linux-x64-gnu')
    expect(detectSqliteTriple('linux', 'arm64', {})).toBe('linux-arm64-gnu')
    expect(detectSqliteTriple('win32', 'x64', {})).toBe('win32-x64-msvc')
    expect(detectSqliteTriple('linux', 'x64', { DSH_POWERDESK_SQLITE_TRIPLE: 'linux-x64-musl' })).toBe('linux-x64-musl')
  })

  it('sqliteCandidates lists env path, companion package, then prebuilt', () => {
    const c = sqliteCandidates('darwin-arm64', '/plugin', { DSH_POWERDESK_SQLITE_PATH: '/abs/x.node' })
    expect(c[0]).toBe('/abs/x.node')
    expect(c[1]).toBe('@dsh-powerdesk-sqlite/darwin-arm64')
    expect(c[2]).toBe('/plugin/prebuilt/darwin-arm64/dsh_powerdesk_sqlite.node')
  })

  it('loadRustSqlite caches a valid module and returns it on the second call', () => {
    const mod = { Database: { open: () => ({}) } }
    const requireImpl: NativeRequire = (id: string) => {
      if (id.startsWith('@dsh-powerdesk-sqlite/')) return mod
      throw new Error(`unexpected require ${id}`)
    }
    const first = loadRustSqlite(requireImpl)
    expect(first).toBe(mod)
    expect(loadRustSqlite(requireImpl)).toBe(first)
  })

  it('loadRustSqlite returns null and records the cause when every candidate fails', () => {
    const requireImpl: NativeRequire = () => { throw new Error('nope') }
    expect(loadRustSqlite(requireImpl)).toBeNull()
    expect(rustSqliteLoadCause()).toBeInstanceOf(Error)
  })

  it('loadRustSqlite rejects a module with no Database.open export', () => {
    const requireImpl: NativeRequire = () => ({ notDatabase: 1 })
    expect(loadRustSqlite(requireImpl)).toBeNull()
  })

  it('loadRustSqlite accepts a default-exported module', () => {
    const mod = { Database: { open: () => ({}) } }
    const requireImpl: NativeRequire = () => ({ default: mod })
    expect(loadRustSqlite(requireImpl)).toBe(mod)
  })

  it('sqliteDepsStatus returns ok:true when the module loaded', () => {
    loadRustSqlite(() => ({ Database: { open: () => ({}) } }))
    expect(sqliteDepsStatus()).toEqual({ ok: true })
  })

  it('sqliteDepsStatus returns a degraded shape with a repair command when the module is missing', () => {
    loadRustSqlite(() => { throw new Error('missing') })
    const status = sqliteDepsStatus()
    expect(status.ok).toBe(false)
    if (!status.ok) {
      expect(typeof status.command).toBe('string')
      expect(status.command.length).toBeGreaterThan(0)
      expect(typeof status.cause).toBe('string')
    }
  })
})
