import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { CHUNK_NAMES } from '../src/bundle-route.ts'

const root = resolve(__dirname, '..')
const manifest = JSON.parse(readFileSync(resolve(root, 'dsh.plugin.json'), 'utf8')) as {
  id: string; version: string; main: string; client: { main: string }
}
const pkg = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8')) as {
  name: string; version: string; dsh: { bundle: { patch: string }; client: { inject: string[]; platform: string } }
}
const patch = readFileSync(resolve(root, 'cordis.patch.yml'), 'utf8')

describe('manifest consistency', () => {
  it('plugin id ends with the package name and the versions match', () => {
    expect(manifest.id.endsWith(`/${pkg.name}`)).toBe(true)
    expect(manifest.version).toBe(pkg.version)
  })

  it('manifest main + client.main point at the shipped lib files', () => {
    expect(manifest.main).toBe('./lib/index.js')
    expect(manifest.client.main).toBe('./lib/client-registry.js')
  })

  it('package declares the bundle patch + web client inject', () => {
    expect(pkg.dsh.bundle.patch).toBe('./cordis.patch.yml')
    expect(pkg.dsh.client.platform).toBe('web')
    expect(pkg.dsh.client.inject.length).toBeGreaterThan(0)
  })

  it('cordis.patch mounts the package name', () => {
    expect(patch).toContain(`name: '${pkg.name}'`)
  })

  it('bundle-route CHUNK_NAMES is exactly [terminal, browser] (matches tsdown + chunk-loader)', () => {
    expect([...CHUNK_NAMES]).toEqual(['terminal', 'browser'])
  })
})
