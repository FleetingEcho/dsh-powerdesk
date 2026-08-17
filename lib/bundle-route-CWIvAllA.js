import { createHash } from "node:crypto";
import { readFile, readdir, rm, stat } from "node:fs/promises";
import { dirname, isAbsolute, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { homedir } from "node:os";
/**
* The id character set: lowercase alphanumerics and dashes, leading
* alphanumeric, at most 64 chars. Deliberately narrower than any one of its
* three consumers requires — a single set that is simultaneously a safe path
* segment (no `.`, no `..`, no separators, no case-collision on macOS/Windows),
* a safe URL segment (nothing to percent-encode), and a safe object key.
*/
const EXTENSION_ID_PATTERN = /^[a-z0-9][a-z0-9-]{0,63}$/;
/** A rejected manifest, upload, or extension id. */
var ExtensionError = class extends Error {};
/** Whether a string is a usable extension id. */
function isValidExtensionId(id) {
	return typeof id === "string" && EXTENSION_ID_PATTERN.test(id);
}
/** Throwing form of {@link isValidExtensionId} (the API boundary's guard). */
function requireExtensionId(id) {
	if (!isValidExtensionId(id)) throw new ExtensionError("extension id must be 1-64 chars of a-z, 0-9 and dashes, starting with a letter or digit");
	return id;
}
/**
* The entry filename must name a plain file directly inside the extension
* directory — no subdirectory, no traversal. Extraction already refuses
* unsafe archive paths; this is the second, independent check on the value
* that actually becomes a filesystem read.
*/
function requireEntry(value) {
	if (value === void 0) return "bundle.js";
	if (typeof value !== "string" || value === "") throw new ExtensionError("manifest \"entry\" must be a non-empty string");
	if (!/^[A-Za-z0-9._-]+$/.test(value) || value === "." || value === "..") throw new ExtensionError("manifest \"entry\" must be a plain file name inside the extension directory");
	if (!value.endsWith(".js")) throw new ExtensionError("manifest \"entry\" must be a .js file");
	return value;
}
function requireTitle(value) {
	if (typeof value !== "string" || value.trim() === "") throw new ExtensionError("manifest \"title\" must be a non-empty string");
	if (value.length > 64) throw new ExtensionError("manifest \"title\" must be at most 64 characters");
	return value.trim();
}
function optionalIcon(value) {
	if (value === void 0 || value === null) return void 0;
	if (typeof value !== "string") throw new ExtensionError("manifest \"icon\" must be a string (emoji or short text)");
	const icon = value.trim();
	if (icon === "") return void 0;
	if ([...icon].length > 4) throw new ExtensionError("manifest \"icon\" must be at most 4 characters (an emoji or short label)");
	return icon;
}
function optionalOrder(value) {
	if (value === void 0 || value === null) return void 0;
	if (typeof value !== "number" || !Number.isFinite(value)) throw new ExtensionError("manifest \"order\" must be a finite number");
	return value;
}
function optionalBoolean(value, field) {
	if (value === void 0 || value === null) return void 0;
	if (typeof value !== "boolean") throw new ExtensionError(`manifest "${field}" must be a boolean`);
	return value;
}
/**
* Validate a parsed `powerdesk.json` into a manifest, or throw
* {@link ExtensionError} with a message meant for the upload dialog.
*
* @param value - the parsed JSON document.
* @param expectedId - when given, the manifest id must equal it (the bare-
* bundle upload path names the extension out-of-band).
*/
function parseManifest(value, expectedId) {
	if (typeof value !== "object" || value === null || Array.isArray(value)) throw new ExtensionError("powerdesk.json must contain a JSON object");
	const raw = value;
	const apiVersion = raw.apiVersion ?? 1;
	if (typeof apiVersion !== "number" || !Number.isInteger(apiVersion)) throw new ExtensionError("manifest \"apiVersion\" must be an integer");
	if (apiVersion > 1) throw new ExtensionError(`extension requires manifest apiVersion ${apiVersion}; this build supports up to 1`);
	const id = requireExtensionId(raw.id);
	if (expectedId !== void 0 && id !== expectedId) throw new ExtensionError(`manifest id "${id}" does not match the extension directory "${expectedId}"`);
	const icon = optionalIcon(raw.icon);
	const order = optionalOrder(raw.order);
	const single = optionalBoolean(raw.single, "single");
	return {
		apiVersion,
		id,
		title: requireTitle(raw.title),
		...icon !== void 0 ? { icon } : {},
		entry: requireEntry(raw.entry),
		export: typeof raw.export === "string" && raw.export !== "" ? raw.export : "default",
		...order !== void 0 ? { order } : {},
		...single !== void 0 ? { single } : {}
	};
}
//#endregion
//#region src/extensions/registry.ts
/**
* On-disk extension registry: where extensions live, what is installed, and
* removal. One directory per extension:
*
*   <root>/<id>/powerdesk.json   the manifest (from the archive)
*   <root>/<id>/bundle.js        the chunk factory script (manifest `entry`)
*   <root>/<id>/.install.json    host-written provenance (see InstallRecord)
*
* Listing is deliberately fault-tolerant: one unreadable or invalid extension
* directory must not hide the others, because the settings UI is the only
* place a user can see WHY an extension is broken and remove it. A directory
* that fails to parse is reported as an entry carrying `error` rather than
* being silently skipped.
*
* @module dsh-powerdesk/extensions/registry
*/
/** Manifest file name inside an extension directory. */
const MANIFEST_FILE = "powerdesk.json";
/** Host-written provenance file name inside an extension directory. */
const INSTALL_RECORD_FILE = ".install.json";
/**
* The default extensions root: `~/.dsh/powerdesk/extensions`, alongside the
* profile directories the DSH CLI already owns.
*/
function defaultExtensionsDir() {
	return join(homedir(), ".dsh", "powerdesk", "extensions");
}
/** Resolve the configured root to an absolute path (empty = the default). */
function resolveExtensionsDir(configured) {
	const trimmed = configured?.trim() ?? "";
	return trimmed === "" ? defaultExtensionsDir() : resolve(trimmed);
}
/**
* The directory of one extension. The id is re-validated here rather than
* trusted from the caller: this function's result is passed straight to file
* reads and to `rm`, so it is the last place a bad id can be stopped.
*/
function extensionDir(root, id) {
	return join(root, requireExtensionId(id));
}
/**
* The absolute path of an extension's bundle script. `entry` comes from the
* manifest, which validated it as a bare file name; the containment check
* below is the independent second gate — if the resolved path is not inside
* the extension directory, something upstream is wrong and no read happens.
*/
function bundlePathOf(root, id, entry) {
	const dir = extensionDir(root, id);
	const path = resolve(dir, entry);
	const rel = relative(dir, path);
	if (rel === "" || rel.startsWith("..") || isAbsolute(rel) || rel.includes(sep)) throw new ExtensionError(`extension "${id}" entry "${entry}" escapes its directory`);
	return path;
}
/** Read and validate one extension directory. Never throws for bad content. */
async function readExtension(root, id) {
	const dir = extensionDir(root, id);
	try {
		const manifest = parseManifest(JSON.parse(await readFile(join(dir, MANIFEST_FILE), "utf8")), id);
		const bundle = await stat(bundlePathOf(root, id, manifest.entry));
		if (!bundle.isFile()) throw new ExtensionError(`entry "${manifest.entry}" is not a file`);
		const install = await readInstallRecord(dir);
		return {
			id,
			manifest,
			dir,
			bundleBytes: bundle.size,
			...install !== void 0 ? { install } : {}
		};
	} catch (error) {
		return {
			id,
			dir,
			error: error instanceof Error ? error.message : String(error)
		};
	}
}
/** Read the provenance file, or undefined when absent/unreadable. */
async function readInstallRecord(dir) {
	try {
		const parsed = JSON.parse(await readFile(join(dir, INSTALL_RECORD_FILE), "utf8"));
		if (typeof parsed.installedAt !== "string") return void 0;
		return {
			installedAt: parsed.installedAt,
			sourceFilename: typeof parsed.sourceFilename === "string" ? parsed.sourceFilename : "",
			sha256: typeof parsed.sha256 === "string" ? parsed.sha256 : "",
			sourceBytes: typeof parsed.sourceBytes === "number" ? parsed.sourceBytes : 0
		};
	} catch {
		return;
	}
}
/**
* Every installed extension, sorted by id. A missing root is not an error —
* it just means nothing has been installed yet. Directory names that are not
* valid ids (including the installer's `.tmp-*` staging dirs) are skipped
* entirely rather than reported as broken extensions.
*/
async function listExtensions(root) {
	let names;
	try {
		names = (await readdir(root, { withFileTypes: true })).filter((entry) => entry.isDirectory() && isValidExtensionId(entry.name)).map((entry) => entry.name);
	} catch {
		return [];
	}
	return await Promise.all(names.sort().map(async (id) => readExtension(root, id)));
}
/** Remove one extension's directory. Removing an absent id is a no-op. */
async function removeExtension(root, id) {
	await rm(extensionDir(root, id), {
		recursive: true,
		force: true
	});
}
//#endregion
//#region src/bundle-route.ts
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
/** The chunk names the client may request (mirror of src/client/chunk-loader.ts). */
const CHUNK_NAMES = [
	"terminal",
	"browser",
	"editor",
	"settings"
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
* The file's ETag (quoted hash), or undefined when the file is missing.
* Keyed by absolute path so built-in chunks and extension bundles share one
* memo without colliding.
*/
async function etagOf(path) {
	try {
		const info = await stat(path);
		const memo = etags.get(path);
		if (memo !== void 0 && memo.mtimeMs === info.mtimeMs && memo.size === info.size) return memo.etag;
		const etag = `"${shortHash(await readFile(path))}"`;
		etags.set(path, {
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
* Resolve a request path to the absolute file to serve, or undefined when the
* path names nothing servable. This is the whole authorization decision for
* the route: everything after it is byte pushing.
*/
async function resolveTarget(pathname, chunkDir, extensions) {
	const ext = /^\/powerdesk\/bundle\/ext\/([^/]+)\.js$/.exec(pathname);
	if (ext !== null) {
		const id = ext[1];
		if (extensions === void 0 || !extensions.enabled || !isValidExtensionId(id)) return void 0;
		const installed = await readExtension(extensions.dir, id);
		if (installed.manifest === void 0) return void 0;
		try {
			return bundlePathOf(extensions.dir, id, installed.manifest.entry);
		} catch {
			return;
		}
	}
	const name = /^\/powerdesk\/bundle\/([a-z0-9-]+)\.js$/.exec(pathname)?.[1];
	if (name === void 0 || !CHUNK_NAMES.includes(name)) return void 0;
	return join(chunkDir, `client-${name}.js`);
}
/**
* Build the /powerdesk/bundle route handler. `fence` is the shared browser-trust
* check every /restty route applies; `chunkDir` is the directory the chunk
* scripts live in (overridable for tests); `extensions` enables the
* /powerdesk/bundle/ext/<id>.js family (omitted = extensions off).
*/
function createBundleRouteHandler(fence, chunkDir = LIB_DIR, extensions) {
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
		const target = await resolveTarget(pathname, chunkDir, extensions);
		if (target === void 0) {
			res.writeHead(404);
			res.end("not found");
			return;
		}
		const etag = await etagOf(target);
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
			const body = await readFile(target);
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
function registerBundleRoute(ctx, fence, extensions) {
	return ctx.webServer.register({
		kind: "prefix",
		path: "/powerdesk/bundle",
		handler: createBundleRouteHandler(fence, LIB_DIR, extensions)
	});
}
//#endregion
export { MANIFEST_FILE as a, readExtension as c, ExtensionError as d, parseManifest as f, INSTALL_RECORD_FILE as i, removeExtension as l, createBundleRouteHandler as n, extensionDir as o, registerBundleRoute as r, listExtensions as s, CHUNK_NAMES as t, resolveExtensionsDir as u };
