/**
 * Lazy chunk route: serves the client bundle's chunk scripts
 * (/powerdesk/bundle/<name>.js). The official /plugins/<id>/client.js route
 * cannot serve arbitrary file names, so the plugin serves its own split
 * bundles (lib/client-<name>.js) here; the client injects the script on
 * first use of the feature that needs it (see src/client/chunk-loader.ts).
 *
 * Two families share the route:
 *
 *   /powerdesk/bundle/<name>.js      built-in chunks, from an ALLOWLIST of
 *                                    names, read from lib/client-<name>.js
 *   /powerdesk/bundle/ext/<id>.js    a user-installed extension's bundle,
 *                                    read from <extensionsDir>/<id>/<entry>
 *
 * The extension family is a different trust story and is treated as one: it
 * is served only when extensions are enabled in config, the id must satisfy
 * the extension id pattern, and the file actually read is resolved through
 * the manifest and re-checked for containment (registry.bundlePathOf) rather
 * than concatenated from the URL. A disabled or unknown extension 404s
 * exactly like an unknown built-in chunk name — the route never reveals
 * whether a directory exists.
 *
 * Caching contract: every response carries `cache-control: no-cache` plus an
 * ETag (content hash, memoized per file by mtime/size) and honors
 * If-None-Match — the browser revalidates each fetch, but a 304 avoids
 * re-downloading the multi-MB restty chunk that did not change (page refresh,
 * HMR re-activation). Same browser-trust fence as every other /restty route;
 * only allowlisted chunk names are servable (no path traversal).
 */
import { createHash } from 'node:crypto'
import { stat, readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { Context, ResttyHttpRequest, ResttyHttpResponse } from './context-types.ts'
import { isValidExtensionId } from './extensions/manifest.ts'
import { bundlePathOf, readExtension } from './extensions/registry.ts'

/** The chunk names the client may request (mirror of src/client/chunk-loader.ts). */
export const CHUNK_NAMES = ['terminal', 'browser', 'editor', 'settings'] as const
export type ChunkName = (typeof CHUNK_NAMES)[number]

/** Directory of this host-half module (lib/ — the chunk scripts live next to it). */
const LIB_DIR = dirname(fileURLToPath(import.meta.url))

/** How the route resolves user-installed extension bundles. */
export interface ExtensionBundleSource {
  /** Config gate; when false the /ext/ family 404s unconditionally. */
  enabled: boolean
  /** Absolute extensions root (see registry.resolveExtensionsDir). */
  dir: string
}

/** sha1 content hash shortened to 12 hex chars. */
function shortHash(input: string | Buffer): string {
  return createHash('sha1').update(input).digest('hex').slice(0, 12)
}

interface ChunkEtag {
  mtimeMs: number
  size: number
  etag: string
}

/** ETag memo: recompute the content hash only when the file's stat changed. */
const etags = new Map<string, ChunkEtag>()

/**
 * The file's ETag (quoted hash), or undefined when the file is missing.
 * Keyed by absolute path so built-in chunks and extension bundles share one
 * memo without colliding.
 */
async function etagOf(path: string): Promise<string | undefined> {
  try {
    const info = await stat(path)
    const memo = etags.get(path)
    if (memo !== undefined && memo.mtimeMs === info.mtimeMs && memo.size === info.size) {
      return memo.etag
    }
    const etag = `"${shortHash(await readFile(path))}"`
    etags.set(path, { mtimeMs: info.mtimeMs, size: info.size, etag })
    return etag
  } catch {
    return undefined
  }
}

/**
 * Resolve a request path to the absolute file to serve, or undefined when the
 * path names nothing servable. This is the whole authorization decision for
 * the route: everything after it is byte pushing.
 */
async function resolveTarget(
  pathname: string,
  chunkDir: string,
  extensions: ExtensionBundleSource | undefined,
): Promise<string | undefined> {
  const ext = /^\/powerdesk\/bundle\/ext\/([^/]+)\.js$/.exec(pathname)
  if (ext !== null) {
    const id = ext[1] as string
    if (extensions === undefined || !extensions.enabled || !isValidExtensionId(id)) return undefined
    // Go through the manifest rather than assuming `bundle.js`: the entry name
    // is the extension's to choose, and readExtension re-validates both the
    // manifest and the id-matches-directory invariant before anything is read.
    const installed = await readExtension(extensions.dir, id)
    if (installed.manifest === undefined) return undefined
    try {
      return bundlePathOf(extensions.dir, id, installed.manifest.entry)
    } catch {
      return undefined
    }
  }
  const builtin = /^\/powerdesk\/bundle\/([a-z0-9-]+)\.js$/.exec(pathname)
  const name = builtin?.[1]
  if (name === undefined || !(CHUNK_NAMES as readonly string[]).includes(name)) return undefined
  return join(chunkDir, `client-${name}.js`)
}

/**
 * Build the /powerdesk/bundle route handler. `fence` is the shared browser-trust
 * check every /restty route applies; `chunkDir` is the directory the chunk
 * scripts live in (overridable for tests); `extensions` enables the
 * /powerdesk/bundle/ext/<id>.js family (omitted = extensions off).
 */
export function createBundleRouteHandler(
  fence: (req: ResttyHttpRequest) => boolean,
  chunkDir: string = LIB_DIR,
  extensions?: ExtensionBundleSource,
): (req: ResttyHttpRequest, res: ResttyHttpResponse) => Promise<void> {
  return async (req, res): Promise<void> => {
    if (!fence(req)) {
      res.writeHead(403)
      res.end('forbidden')
      return
    }
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      res.writeHead(405)
      res.end()
      return
    }
    const pathname = new URL(req.url ?? '/', 'http://dsh.internal').pathname
    const target = await resolveTarget(pathname, chunkDir, extensions)
    if (target === undefined) {
      res.writeHead(404)
      res.end('not found')
      return
    }
    const etag = await etagOf(target)
    if (etag === undefined) {
      // Resolvable name but unreadable (bundle not built yet): loud 404.
      res.writeHead(404)
      res.end('not found')
      return
    }
    if (req.headers['if-none-match'] === etag) {
      res.writeHead(304, { 'cache-control': 'no-cache', etag })
      res.end()
      return
    }
    try {
      const body = await readFile(target)
      res.writeHead(200, {
        'content-type': 'text/javascript; charset=utf-8',
        'cache-control': 'no-cache',
        etag,
      })
      res.end(body)
    } catch {
      // Read raced a delete/rebuild between the stat and the read.
      res.writeHead(404)
      res.end('not found')
    }
  }
}

/** Register the /powerdesk/bundle route (disposed with the fiber). */
export function registerBundleRoute(
  ctx: Context,
  fence: (req: ResttyHttpRequest) => boolean,
  extensions?: ExtensionBundleSource,
): () => void {
  return ctx.webServer.register({
    kind: 'prefix',
    path: '/powerdesk/bundle',
    handler: createBundleRouteHandler(fence, LIB_DIR, extensions),
  })
}
