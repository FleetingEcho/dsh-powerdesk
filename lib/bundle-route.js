import { createHash } from "node:crypto";
import { readFile, stat } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
//#region src/bundle-route.ts
/**
* Lazy chunk route: serves the client bundle's chunk scripts
* (/powerdesk/bundle/<name>.js). The official /plugins/<id>/client.js route
* cannot serve arbitrary file names, so the plugin serves its own split
* bundles (lib/client-<name>.js) here; the client injects the script on
* first use of the feature that needs it (see src/client/chunk-loader.ts).
*
* Caching contract: every response carries `cache-control: no-cache` plus an
* ETag (content hash, memoized per file by mtime/size) and honors
* If-None-Match — the browser revalidates each fetch, but a 304 avoids
* re-downloading the multi-MB restty chunk that did not change (page refresh,
* HMR re-activation). Same browser-trust fence as every other /restty route;
* only allowlisted chunk names are servable (no path traversal).
*/
/** The chunk names the client may request (mirror of src/client/chunk-loader.ts). */
const CHUNK_NAMES = [
	"terminal",
	"browser",
	"editor"
];
/** Directory of this host-half module (lib/ — the chunk scripts live next to it). */
const LIB_DIR = dirname(fileURLToPath(import.meta.url));
/** sha1 content hash shortened to 12 hex chars. */
function shortHash(input) {
	return createHash("sha1").update(input).digest("hex").slice(0, 12);
}
/** ETag memo: recompute the content hash only when the file's stat changed. */
const etags = /* @__PURE__ */ new Map();
/**
* The chunk file's ETag (quoted hash), or undefined when the file is missing.
*/
async function etagOf(name, chunkDir) {
	const path = join(chunkDir, `client-${name}.js`);
	const key = `${chunkDir}:${name}`;
	try {
		const info = await stat(path);
		const memo = etags.get(key);
		if (memo !== void 0 && memo.mtimeMs === info.mtimeMs && memo.size === info.size) return memo.etag;
		const etag = `"${shortHash(await readFile(path))}"`;
		etags.set(key, {
			mtimeMs: info.mtimeMs,
			size: info.size,
			etag
		});
		return etag;
	} catch {
		return;
	}
}
/**
* Build the /powerdesk/bundle route handler. `fence` is the shared browser-trust
* check every /restty route applies; `chunkDir` is the directory the chunk
* scripts live in (overridable for tests).
*/
function createBundleRouteHandler(fence, chunkDir = LIB_DIR) {
	return async (req, res) => {
		if (!fence(req)) {
			res.writeHead(403);
			res.end("forbidden");
			return;
		}
		if (req.method !== "GET" && req.method !== "HEAD") {
			res.writeHead(405);
			res.end();
			return;
		}
		const pathname = new URL(req.url ?? "/", "http://dsh.internal").pathname;
		const name = /^\/powerdesk\/bundle\/([a-z0-9-]+)\.js$/.exec(pathname)?.[1];
		if (name === void 0 || !CHUNK_NAMES.includes(name)) {
			res.writeHead(404);
			res.end("not found");
			return;
		}
		const etag = await etagOf(name, chunkDir);
		if (etag === void 0) {
			res.writeHead(404);
			res.end("not found");
			return;
		}
		if (req.headers["if-none-match"] === etag) {
			res.writeHead(304, {
				"cache-control": "no-cache",
				etag
			});
			res.end();
			return;
		}
		try {
			const body = await readFile(join(chunkDir, `client-${name}.js`));
			res.writeHead(200, {
				"content-type": "text/javascript; charset=utf-8",
				"cache-control": "no-cache",
				etag
			});
			res.end(body);
		} catch {
			res.writeHead(404);
			res.end("not found");
		}
	};
}
/** Register the /powerdesk/bundle route (disposed with the fiber). */
function registerBundleRoute(ctx, fence) {
	return ctx.webServer.register({
		kind: "prefix",
		path: "/powerdesk/bundle",
		handler: createBundleRouteHandler(fence)
	});
}
//#endregion
export { CHUNK_NAMES, createBundleRouteHandler, registerBundleRoute };
