import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { dropChunk, loadChunk, resetChunks, setChunkLoader } from '../src/client/chunk-loader.ts'
import { ExtensionHost, extensionChunkName, extensionTabDescriptor } from '../src/client/extensions.ts'
import { toBase64, type InstalledExtension } from '../src/client/api.ts'
import * as apiModule from '../src/client/api.ts'
import type { PowerdeskSidebarService, TabDescriptor } from '../src/client/service.ts'

/** Register a factory on the plugin-private chunk registry. */
function seedRegistry(key: string, factory: (require: (s: string) => unknown) => Record<string, unknown>): void {
  const g = globalThis as { __dshPowerdeskChunks__?: Record<string, unknown> }
  g.__dshPowerdeskChunks__ ??= {}
  g.__dshPowerdeskChunks__[key] = factory
}

/** A minimal sidebar service recording registrations and disposals. */
function fakeService(): PowerdeskSidebarService & { tabs: Map<string, TabDescriptor>; disposals: string[] } {
  const tabs = new Map<string, TabDescriptor>()
  const disposals: string[] = []
  const service = {
    tabs,
    disposals,
    registerTab(descriptor: TabDescriptor) {
      if (tabs.has(descriptor.id)) throw new Error(`duplicate ${descriptor.id}`)
      tabs.set(descriptor.id, descriptor)
      return () => { tabs.delete(descriptor.id); disposals.push(descriptor.id) }
    },
  }
  return service as unknown as PowerdeskSidebarService & { tabs: Map<string, TabDescriptor>; disposals: string[] }
}

/** An InstalledExtension the host would return for a healthy install. */
function installed(id: string, overrides: Partial<InstalledExtension['manifest']> = {}): InstalledExtension {
  return {
    id,
    dir: `/root/${id}`,
    manifest: { apiVersion: 1, id, title: id, entry: 'bundle.js', export: 'default', ...overrides },
  }
}

beforeEach(() => {
  resetChunks()
  delete (globalThis as { __dshPowerdeskChunks__?: unknown }).__dshPowerdeskChunks__
  ;(globalThis as { __DSH_MODULES__?: { import: (spec: string) => unknown } }).__DSH_MODULES__ = {
    import: (spec: string) => ({ __spec: spec }),
  }
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('extension chunk loading', () => {
  it('fetches an extension bundle from the /ext/ URL family', async () => {
    let seenUrl = ''
    setChunkLoader('ext:acme-notes', async (url) => {
      seenUrl = url
      seedRegistry('ext:acme-notes', () => ({ default: 'component' }))
    })
    const mod = await loadChunk('ext:acme-notes')
    expect(seenUrl).toBe('/powerdesk/bundle/ext/acme-notes.js')
    expect(mod.default).toBe('component')
  })

  it('keeps built-in chunk URLs unprefixed', async () => {
    let seenUrl = ''
    setChunkLoader('terminal', async (url) => {
      seenUrl = url
      seedRegistry('terminal', () => ({ Terminal: 'x' }))
    })
    await loadChunk('terminal')
    expect(seenUrl).toBe('/powerdesk/bundle/terminal.js')
  })

  it('an extension named "terminal" cannot shadow the built-in chunk', async () => {
    setChunkLoader('terminal', async () => { seedRegistry('terminal', () => ({ from: 'builtin' })) })
    setChunkLoader('ext:terminal', async () => { seedRegistry('ext:terminal', () => ({ from: 'extension' })) })
    expect((await loadChunk('terminal')).from).toBe('builtin')
    expect((await loadChunk('ext:terminal')).from).toBe('extension')
  })

  it('resolves platform externals for an extension, so it shares React', async () => {
    setChunkLoader('ext:acme-notes', async () => {
      seedRegistry('ext:acme-notes', (require) => ({ default: 'c', react: require('react') }))
    })
    const mod = await loadChunk('ext:acme-notes') as { react: { __spec: string } }
    expect(mod.react).toEqual({ __spec: 'react' })
  })

  it('dropChunk forces the next load to re-execute the factory', async () => {
    let runs = 0
    let body = 'v1'
    setChunkLoader('ext:acme-notes', async () => {
      runs += 1
      const current = body
      seedRegistry('ext:acme-notes', () => ({ default: current }))
    })
    expect((await loadChunk('ext:acme-notes')).default).toBe('v1')
    expect((await loadChunk('ext:acme-notes')).default).toBe('v1')
    expect(runs).toBe(1)
    body = 'v2'
    dropChunk('ext:acme-notes')
    expect((await loadChunk('ext:acme-notes')).default).toBe('v2')
    expect(runs).toBe(2)
  })
})

describe('extensionTabDescriptor', () => {
  it('namespaces the tab id under ext:', () => {
    expect(extensionTabDescriptor(installed('acme-notes'))?.id).toBe('ext:acme-notes')
    expect(extensionChunkName('acme-notes')).toBe('ext:acme-notes')
  })

  it('carries title, order and single through from the manifest', () => {
    const descriptor = extensionTabDescriptor(installed('a', { title: 'Acme', order: 42, single: true }))
    expect(descriptor?.title).toBe('Acme')
    expect(descriptor?.order).toBe(42)
    expect(descriptor?.single).toBe(true)
  })

  it('omits order and single when the manifest does not set them', () => {
    const descriptor = extensionTabDescriptor(installed('a'))
    expect('order' in (descriptor ?? {})).toBe(false)
    expect('single' in (descriptor ?? {})).toBe(false)
  })

  it('produces no descriptor for a broken extension', () => {
    expect(extensionTabDescriptor({ id: 'broken', dir: '/root/broken', error: 'bad json' })).toBeUndefined()
  })

  it('renders the icon as text, never as markup', () => {
    const descriptor = extensionTabDescriptor(installed('a', { icon: '<img onerror=alert(1)>' }))
    const icon = typeof descriptor?.icon === 'function' ? descriptor.icon(20) : descriptor?.icon
    // The icon is a React child (escaped on render), not dangerouslySetInnerHTML.
    expect((icon as { props: { children: string } }).props.children).toBe('<img onerror=alert(1)>')
    expect((icon as { props: Record<string, unknown> }).props.dangerouslySetInnerHTML).toBeUndefined()
  })

  it('resolves a CJS default export (module.exports = Component)', async () => {
    // What a bundler emits for `export default Component`: the chunk's
    // exports ARE the component, with no `.default` property. This is the
    // shape the extension template produces, so it must resolve.
    const Component = (): null => null
    setChunkLoader('ext:acme-notes', async () => {
      seedRegistry('ext:acme-notes', () => Component as unknown as Record<string, unknown>)
    })
    const descriptor = extensionTabDescriptor(installed('acme-notes'))
    const rendered = (descriptor?.component as (props: unknown) => { props: { pick: (m: unknown) => unknown } })({})
    const mod = await loadChunk('ext:acme-notes')
    expect(rendered.props.pick(mod)).toBe(Component)
  })

  it('resolves a namespace default export ({ default: Component })', async () => {
    const Component = (): null => null
    setChunkLoader('ext:acme-notes', async () => {
      seedRegistry('ext:acme-notes', () => ({ default: Component }))
    })
    const descriptor = extensionTabDescriptor(installed('acme-notes'))
    const rendered = (descriptor?.component as (props: unknown) => { props: { pick: (m: unknown) => unknown } })({})
    expect(rendered.props.pick(await loadChunk('ext:acme-notes'))).toBe(Component)
  })

  it('resolves nothing when the named export is missing or not a function', async () => {
    setChunkLoader('ext:acme-notes', async () => {
      seedRegistry('ext:acme-notes', () => ({ default: 'not a component' }))
    })
    const descriptor = extensionTabDescriptor(installed('acme-notes'))
    const rendered = (descriptor?.component as (props: unknown) => { props: { pick: (m: unknown) => unknown } })({})
    expect(rendered.props.pick(await loadChunk('ext:acme-notes'))).toBeUndefined()
  })

  it('mounts the export the manifest names', async () => {
    setChunkLoader('ext:acme-notes', async () => {
      seedRegistry('ext:acme-notes', () => ({ default: 'wrong', Panel: 'right' }))
    })
    const descriptor = extensionTabDescriptor(installed('acme-notes', { export: 'Panel' }))
    expect(descriptor).toBeDefined()
    const mod = await loadChunk('ext:acme-notes')
    expect(mod.Panel).toBe('right')
  })
})

describe('ExtensionHost', () => {
  it('registers a tab per installed extension', async () => {
    const service = fakeService()
    vi.spyOn(apiModule.api, 'extList').mockResolvedValue({
      enabled: true, dir: '/root', extensions: [installed('a'), installed('b')],
    })
    const result = await new ExtensionHost(service).refresh()
    expect(result.registered).toEqual(['a', 'b'])
    expect([...service.tabs.keys()]).toEqual(['ext:a', 'ext:b'])
  })

  it('skips broken extensions but still registers the healthy ones', async () => {
    const service = fakeService()
    vi.spyOn(apiModule.api, 'extList').mockResolvedValue({
      enabled: true,
      dir: '/root',
      extensions: [{ id: 'broken', dir: '/root/broken', error: 'bad' }, installed('good')],
    })
    const result = await new ExtensionHost(service).refresh()
    expect(result.registered).toEqual(['good'])
    expect([...service.tabs.keys()]).toEqual(['ext:good'])
  })

  it('reconciles: a removed extension loses its tab', async () => {
    const service = fakeService()
    const spy = vi.spyOn(apiModule.api, 'extList')
    spy.mockResolvedValue({ enabled: true, dir: '/root', extensions: [installed('a'), installed('b')] })
    const host = new ExtensionHost(service)
    await host.refresh()
    spy.mockResolvedValue({ enabled: true, dir: '/root', extensions: [installed('a')] })
    await host.refresh()
    expect([...service.tabs.keys()]).toEqual(['ext:a'])
  })

  it('re-registering the same id does not throw a duplicate-registration error', async () => {
    const service = fakeService()
    vi.spyOn(apiModule.api, 'extList').mockResolvedValue({
      enabled: true, dir: '/root', extensions: [installed('a')],
    })
    const host = new ExtensionHost(service)
    await host.refresh()
    // The second pass must dispose before re-registering, or the service's
    // duplicate-id guard would reject it.
    const second = await host.refresh()
    expect(second.registered).toEqual(['a'])
    expect([...service.tabs.keys()]).toEqual(['ext:a'])
  })

  it('leaves existing tabs alone when the list fetch fails', async () => {
    const service = fakeService()
    const spy = vi.spyOn(apiModule.api, 'extList')
    spy.mockResolvedValue({ enabled: true, dir: '/root', extensions: [installed('a')] })
    const host = new ExtensionHost(service)
    await host.refresh()
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    spy.mockRejectedValue(new Error('network down'))
    const result = await host.refresh()
    expect(result.enabled).toBe(false)
    // A failed poll must not tear down a working tab.
    expect([...service.tabs.keys()]).toEqual(['ext:a'])
  })

  it('registers nothing while the feature is disabled', async () => {
    const service = fakeService()
    vi.spyOn(apiModule.api, 'extList').mockResolvedValue({ enabled: false, dir: '/root', extensions: [] })
    const result = await new ExtensionHost(service).refresh()
    expect(result.registered).toEqual([])
    expect(service.tabs.size).toBe(0)
    // A genuinely disabled feature carries NO error — that is what lets the
    // settings card tell "turned off" apart from "could not be reached".
    expect(result.error).toBeUndefined()
  })

  it('reports an unreachable API distinctly from a disabled feature', async () => {
    const service = fakeService()
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    vi.spyOn(apiModule.api, 'extList').mockRejectedValue(
      new Error('unknown restty API method "ext.list"'),
    )
    const result = await new ExtensionHost(service).refresh()
    // Both report enabled:false, so without `error` the settings card would
    // tell the user to edit config that is already correct — the exact
    // confusion a stale host half causes right after an upgrade.
    expect(result.enabled).toBe(false)
    expect(result.error).toBe('unknown restty API method "ext.list"')
  })

  it('carries the message through for any other transport failure', async () => {
    const service = fakeService()
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    vi.spyOn(apiModule.api, 'extList').mockRejectedValue(new Error('network down'))
    const result = await new ExtensionHost(service).refresh()
    expect(result.error).toBe('network down')
  })

  it('dispose removes every registration', async () => {
    const service = fakeService()
    vi.spyOn(apiModule.api, 'extList').mockResolvedValue({
      enabled: true, dir: '/root', extensions: [installed('a'), installed('b')],
    })
    const host = new ExtensionHost(service)
    await host.refresh()
    host.dispose()
    expect(service.tabs.size).toBe(0)
    expect(service.disposals).toEqual(['a', 'b'].map(id => `ext:${id}`))
  })

  it('a refresh that lands after dispose does not resurrect tabs', async () => {
    const service = fakeService()
    let release: (value: { enabled: boolean; dir: string; extensions: InstalledExtension[] }) => void = () => {}
    vi.spyOn(apiModule.api, 'extList').mockReturnValue(new Promise((resolve) => { release = resolve }))
    const host = new ExtensionHost(service)
    const pending = host.refresh()
    host.dispose()
    release({ enabled: true, dir: '/root', extensions: [installed('a')] })
    await pending
    expect(service.tabs.size).toBe(0)
  })

  it('a superseded in-flight refresh does not clobber the newer one', async () => {
    const service = fakeService()
    const spy = vi.spyOn(apiModule.api, 'extList')
    let releaseFirst: (value: { enabled: boolean; dir: string; extensions: InstalledExtension[] }) => void = () => {}
    spy.mockReturnValueOnce(new Promise((resolve) => { releaseFirst = resolve }))
    const host = new ExtensionHost(service)
    const first = host.refresh()
    spy.mockResolvedValue({ enabled: true, dir: '/root', extensions: [installed('new')] })
    await host.refresh()
    // The stale first fetch resolves last, with the OLD contents.
    releaseFirst({ enabled: true, dir: '/root', extensions: [installed('stale')] })
    await first
    expect([...service.tabs.keys()]).toEqual(['ext:new'])
  })
})

describe('toBase64', () => {
  it('round-trips bytes', () => {
    const bytes = new Uint8Array([0, 1, 2, 250, 255, 128])
    expect(Uint8Array.from(atob(toBase64(bytes)), c => c.charCodeAt(0))).toEqual(bytes)
  })

  it('encodes a payload larger than the argument-spread limit', () => {
    // A naive String.fromCharCode(...bytes) throws RangeError well below this.
    const bytes = new Uint8Array(300_000).fill(65)
    const encoded = toBase64(bytes)
    expect(atob(encoded).length).toBe(bytes.length)
  })

  it('encodes an empty payload', () => {
    expect(toBase64(new Uint8Array())).toBe('')
  })
})
