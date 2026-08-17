/**
 * User-installed extensions, client half: turn the host's list of installed
 * manifests into registered sidebar tabs, and keep that registration in sync
 * when extensions are installed or removed.
 *
 * An extension gets nothing bespoke — it is registered through the same
 * `service.registerTab` contract the built-in tabs use, with the same
 * `lazyChunkComponent` wrapper, so it inherits the loading placeholder, the
 * retry affordance, the RenderBoundary, and the Settings enable/disable
 * switch without any of them knowing extensions exist. The only extension-
 * specific parts are the `ext:` chunk key and the id namespacing.
 *
 * Reconciliation is whole-set: on every refresh the previous registrations
 * are disposed and the current list is registered from scratch. The
 * registries are small (a handful of Maps) and refreshes are user-initiated,
 * so a diffing scheme would add ordering bugs to save nothing measurable.
 *
 * @module dsh-powerdesk/client/extensions
 */
import { createElement, type ReactNode } from 'react'
import { api, type InstalledExtension } from './api.ts'
import { dropChunk, type ChunkExports, type ChunkName } from './chunk-loader.ts'
import { lazyChunkComponent } from './lazy-chunk.tsx'
import type { PowerdeskSidebarService, TabComponentProps, TabDescriptor } from './service.ts'

/** Tab id / chunk key prefix. Mirrors the host's manifest.chunkKeyOf. */
const EXT_PREFIX = 'ext:'

/** The chunk name (and tab type id) of one extension. */
export function extensionChunkName(id: string): ChunkName {
  return `${EXT_PREFIX}${id}`
}

/**
 * Select the component from a loaded extension chunk's exports. The manifest
 * names the export (default `default`); a chunk that exports nothing usable
 * produces `undefined`, which LazyChunkView renders as an error with a retry
 * button rather than crashing the sidebar.
 *
 * CJS interop for `default`: a bundler compiling `export default Component`
 * to CJS emits `module.exports = Component`, so the chunk's exports ARE the
 * component and there is no `.default` property to read. Both shapes are
 * accepted — `.default` first (a chunk with several named exports), then the
 * exports object itself when it is callable. Without this, the natural way to
 * write an extension would silently resolve to nothing.
 */
function pickExport(exportName: string): (mod: ChunkExports) => ((props: TabComponentProps) => ReactNode) | undefined {
  return (mod) => {
    const named = mod[exportName]
    if (typeof named === 'function') return named as (props: TabComponentProps) => ReactNode
    if (exportName === 'default' && typeof mod === 'function') {
      return mod as unknown as (props: TabComponentProps) => ReactNode
    }
    return undefined
  }
}

/**
 * Build the tab descriptor for one installed extension. `icon` is rendered as
 * TEXT, never as markup: the manifest is author-controlled data and an icon
 * is at most a few characters, so there is no reason to give it an HTML
 * injection surface into the tab strip.
 */
export function extensionTabDescriptor(extension: InstalledExtension): TabDescriptor | undefined {
  const manifest = extension.manifest
  if (manifest === undefined) return undefined
  const chunk = extensionChunkName(manifest.id)
  return {
    id: chunk,
    title: manifest.title,
    ...manifest.icon !== undefined
      ? { icon: () => createElement('span', { 'aria-hidden': true }, manifest.icon) }
      : {},
    ...manifest.order !== undefined ? { order: manifest.order } : {},
    ...manifest.single === true ? { single: true } : {},
    // `pickExport` is built once per descriptor (not per render), so the
    // selector identity stays stable — LazyChunkView's load effect depends
    // on it and an inline lambda would re-trigger the fetch every render.
    component: lazyChunkComponent<TabComponentProps>(chunk, pickExport(manifest.export)),
  }
}

/** What a refresh reports back to the settings UI. */
export interface ExtensionSyncResult {
  enabled: boolean
  dir: string
  extensions: InstalledExtension[]
  /** Ids that registered successfully this pass. */
  registered: string[]
  /**
   * Why the installed list could not be read, when it could not be.
   *
   * Load-bearing for the settings UI: a failed fetch also reports
   * `enabled: false`, so without this field "the host could not be reached"
   * and "the operator turned the feature off" are the same value, and the
   * card tells the user to edit config when the real problem is a stale host
   * half answering 404 for `ext.list`.
   */
  error?: string
}

/**
 * Owns the extension tab registrations for one client activation. Created in
 * the client entry, refreshed by the settings card after an install/remove,
 * and disposed with the plugin fiber.
 */
export class ExtensionHost {
  /** Disposers returned by `registerTab`, keyed by extension id. */
  private readonly registered = new Map<string, () => void>()
  /** Bumped per refresh so a slow in-flight fetch cannot apply out of order. */
  private generation = 0
  private disposed = false

  constructor(private readonly service: PowerdeskSidebarService) {}

  /**
   * Fetch the installed list and reconcile the registrations to it.
   *
   * Never throws: the sidebar must mount whether or not the extensions API
   * answered, so a failed fetch reports an empty, disabled result and leaves
   * the previous registrations alone rather than tearing down working tabs
   * because one poll failed.
   */
  async refresh(): Promise<ExtensionSyncResult> {
    const generation = ++this.generation
    let listed
    try {
      listed = await api.extList()
    } catch (error) {
      console.warn('[dsh-powerdesk] could not list extensions:', error)
      const message = error instanceof Error ? error.message : String(error)
      return {
        enabled: false,
        dir: '',
        extensions: [],
        registered: [...this.registered.keys()],
        error: message,
      }
    }
    // A newer refresh (or a disposal) overtook this one while it was in
    // flight; its result is stale, so it must not touch the registry.
    if (this.disposed || generation !== this.generation) {
      return { ...listed, registered: [...this.registered.keys()] }
    }
    this.unregisterAll()
    const registered: string[] = []
    for (const extension of listed.extensions) {
      const descriptor = extensionTabDescriptor(extension)
      if (descriptor === undefined) continue
      try {
        // Re-executing the chunk is what picks up a reinstalled bundle; the
        // memoized promise would otherwise pin the previous install's code.
        dropChunk(extensionChunkName(extension.id))
        this.registered.set(extension.id, this.service.registerTab(descriptor))
        registered.push(extension.id)
      } catch (error) {
        // A duplicate id or a throwing descriptor must not stop the rest.
        console.error(`[dsh-powerdesk] extension "${extension.id}" failed to register:`, error)
      }
    }
    return { ...listed, registered }
  }

  /** Dispose every registration (idempotent; safe after {@link dispose}). */
  private unregisterAll(): void {
    for (const dispose of this.registered.values()) {
      try {
        dispose()
      } catch (error) {
        console.error('[dsh-powerdesk] extension unregister failed:', error)
      }
    }
    this.registered.clear()
  }

  /** Tear down all extension tabs (plugin deactivation / HMR). */
  dispose(): void {
    this.disposed = true
    this.generation += 1
    this.unregisterAll()
  }
}
