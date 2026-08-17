import { registerBundleRoute } from "./bundle-route.js";
import { createRequire } from "node:module";
import { WebSocket, WebSocketServer } from "ws";
import z from "schemastery";
import { mkdir, readFile, readdir, rename, rm, stat, writeFile } from "node:fs/promises";
import { basename, dirname, join, resolve, win32 } from "node:path";
import { fileURLToPath } from "node:url";
import { existsSync, readFileSync, realpathSync } from "node:fs";
import { homedir, userInfo } from "node:os";
//#region src/config.ts
/**
* Serializable configuration and defaults for the restty host half. Loader
* schema validation normally fills defaults; {@link resolveResttyConfig}
* applies the same defaults for direct callers that bypass the Loader.
* @module dsh-powerdesk/config
*/
/** Schemastery schema for the plugin configuration. */
const Config = z.object({
	terminalsPerSession: z.number().step(1).min(1).default(3),
	reconnectGraceMs: z.number().step(1).min(0).default(3e4),
	shell: z.string().default("")
});
/**
* Apply direct-call defaults after Loader schema validation has normally run.
*
* @param config - Deployment-provided restty host settings.
* @returns Complete settings consumed by the host half.
*/
function resolveResttyConfig(config) {
	return {
		terminalsPerSession: config?.terminalsPerSession ?? 3,
		reconnectGraceMs: config?.reconnectGraceMs ?? 3e4,
		shell: config?.shell?.trim() ?? ""
	};
}
//#endregion
//#region src/trust-fence.ts
function header(headers, name) {
	const value = headers[name];
	return typeof value === "string" ? value : void 0;
}
/** Normalized URL of a Host-header authority, or undefined when unparsable. */
function parseAuthority(authority) {
	try {
		return new URL(`http://${authority}`);
	} catch {
		return;
	}
}
/** Whether a normalized URL hostname names the local loopback authority. */
function isLoopbackHostname(hostname) {
	if (hostname === "localhost" || hostname === "[::1]") return true;
	const parts = hostname.split(".");
	return parts.length === 4 && parts[0] === "127" && parts.every((part) => /^\d{1,3}$/.test(part) && Number(part) <= 255);
}
/** Canonical authority form: hostname, or hostname:port when a port was written. */
function canonicalAuthority(entry, entryUrl) {
	const port = entryUrl.port !== "" ? entryUrl.port : new URL(`https://${entry}`).port;
	return port === "" ? entryUrl.hostname : `${entryUrl.hostname}:${port}`;
}
/** Whether the request authority matches a trustedHosts entry (exact or port-less). */
function isTrustedAuthority(hostUrl, trustedHosts) {
	return trustedHosts.some((entry) => {
		const entryUrl = parseAuthority(entry);
		if (entryUrl === void 0) return false;
		return canonicalAuthority(entry, entryUrl) === entryUrl.hostname ? entryUrl.hostname === hostUrl.hostname : entryUrl.host === hostUrl.host;
	});
}
/**
* Decide whether one restty request may reach the plugin routes.
* @param request - node HTTP request facts (headers).
* @param trustedHosts - non-loopback authorities this deployment serves.
* @returns true when the Host is ours (loopback or trusted) and browser markers are same-origin.
*/
function isTrustedApiRequest(request, trustedHosts) {
	const host = header(request.headers, "host");
	if (host === void 0) return false;
	const hostUrl = parseAuthority(host);
	if (hostUrl === void 0) return false;
	if (!isLoopbackHostname(hostUrl.hostname) && !isTrustedAuthority(hostUrl, trustedHosts)) return false;
	if (header(request.headers, "sec-fetch-site") === "cross-site") return false;
	const origin = header(request.headers, "origin");
	if (origin === void 0) return true;
	try {
		return new URL(origin).host === hostUrl.host;
	} catch {
		return false;
	}
}
//#endregion
//#region src/shell.ts
/**
* Interactive shell resolution for the restty terminal — the same logic a
* terminal emulator uses, with explicit injection points so the Windows
* chain is testable from POSIX runners. An explicitly configured shell (the
* `shell` config field) wins, then `$SHELL` on POSIX (deployment override),
* then the account's login shell from passwd, then `/bin/bash`. The passwd
* step matters because service managers and container inits often start dsh
* without `SHELL`, and the tab should still open the user's login shell
* (e.g. zsh) instead of silently degrading to bash.
*
* Windows chain: explicit shell → `DSH_RESTTY_SHELL` env override → first
* `pwsh.exe` found on PATH or in a known install directory → the 5.1
* fallback (`powershell.exe`).
*/
/**
* Candidate directories that may contain a `pwsh.exe` on Windows: PATH
* entries first, then the well-known machine/user install locations
* (including preview channels and per-user MSI/portable layouts). De-duped
* while preserving priority order.
*/
function windowsPwshCandidateDirs(env) {
	const dirs = [];
	const pathEntries = env.PATH;
	if (pathEntries !== void 0) for (const entry of pathEntries.split(";")) {
		const trimmed = entry.trim();
		if (trimmed !== "") dirs.push(trimmed);
	}
	for (const programFiles of [env.ProgramW6432, env.ProgramFiles]) {
		if (programFiles === void 0 || programFiles.trim() === "") continue;
		dirs.push(win32.join(programFiles, "PowerShell", "7"));
		dirs.push(win32.join(programFiles, "PowerShell", "7-preview"));
	}
	const localAppData = env.LOCALAPPDATA;
	if (localAppData !== void 0 && localAppData.trim() !== "") {
		dirs.push(win32.join(localAppData, "Microsoft", "PowerShell", "7"));
		dirs.push(win32.join(localAppData, "Microsoft", "PowerShell", "7-preview"));
		dirs.push(win32.join(localAppData, "Programs", "PowerShell", "7"));
		dirs.push(win32.join(localAppData, "Programs", "PowerShell", "7-preview"));
	}
	return [...new Set(dirs)];
}
/** The interactive shell for this platform (see the module doc). */
function defaultShell(options = {}) {
	const platform = options.platform ?? process.platform;
	const env = options.env ?? process.env;
	const exists = options.exists ?? existsSync;
	const explicit = options.explicit;
	if (explicit !== void 0 && explicit.trim() !== "") return explicit.trim();
	if (platform === "win32") {
		const envShell = env.DSH_RESTTY_SHELL;
		if (envShell !== void 0 && envShell.trim() !== "") return envShell.trim();
		for (const dir of windowsPwshCandidateDirs(env)) {
			const candidate = win32.join(dir, "pwsh.exe");
			if (exists(candidate)) return candidate;
		}
		return "powershell.exe";
	}
	const envShell = env.SHELL;
	if (envShell !== void 0 && envShell.trim() !== "") return envShell.trim();
	try {
		const loginShell = userInfo().shell;
		if (typeof loginShell === "string" && loginShell.trim() !== "") return loginShell;
	} catch {}
	return "/bin/bash";
}
/**
* Spawn arguments that make the shell behave like a terminal-emulator tab:
* POSIX shells start as login shells (`-l`) so they read the profile files
* (`~/.profile`, `~/.zprofile`); Windows PowerShell takes no login flag.
*/
function shellSpawnArgs(platform = process.platform) {
	return platform === "win32" ? [] : ["-l"];
}
//#endregion
//#region src/rust-pty.ts
/**
* A live Rust PTY with a multi-subscriber JS surface. The dispatcher is
* installed once (the native side keeps a single callback slot); subscribers
* add/remove through {@link onData} / {@link onExit}.
*/
var RustPty = class {
	raw;
	dataListeners = /* @__PURE__ */ new Set();
	exitListeners = /* @__PURE__ */ new Set();
	exited = false;
	constructor(raw) {
		this.raw = raw;
		raw.onData((_err, data) => {
			for (const listener of [...this.dataListeners]) try {
				listener(data);
			} catch {}
		});
		raw.onExit((_err, event) => {
			this.exited = true;
			for (const listener of [...this.exitListeners]) try {
				listener(event);
			} catch {}
		});
	}
	/** Subscribe to pty output; returns the disposer. */
	onData(listener) {
		this.dataListeners.add(listener);
		return () => {
			this.dataListeners.delete(listener);
		};
	}
	/** Subscribe to the pty exit; returns the disposer. */
	onExit(listener) {
		this.exitListeners.add(listener);
		return () => {
			this.exitListeners.delete(listener);
		};
	}
	/** Write text to the pty's stdin. */
	write(data) {
		if (this.exited) return;
		this.raw.write(data);
	}
	/** Resize the pty (pixel dimensions best-effort). */
	resize(cols, rows, pixelW, pixelH) {
		if (this.exited) return;
		this.raw.resize(cols, rows, pixelW ?? null, pixelH ?? null);
	}
	/** Kill the underlying process. */
	kill() {
		try {
			this.raw.kill();
		} catch {}
	}
	/** The spawned process id. */
	get pid() {
		return this.raw.pid;
	}
	/** Whether the top-level process has exited. */
	get hasExited() {
		return this.exited;
	}
};
//#endregion
//#region src/wire.ts
/** One API failure with its wire code and HTTP status. */
var ResttyError = class extends Error {
	code;
	status;
	constructor(code, message, status = 400) {
		super(message);
		this.code = code;
		this.status = status;
	}
};
/** Body size bound of one JSON request (defense against unbounded reads). */
const MAX_BODY_BYTES = 1 << 20;
/** Read and parse the JSON request body (bounded; malformed → bad-request). */
async function readJsonBody(req) {
	const chunks = [];
	let total = 0;
	for await (const chunk of req) {
		const buffer = Buffer.from(chunk);
		total += buffer.length;
		if (total > MAX_BODY_BYTES) throw new ResttyError("bad-request", "request body too large");
		chunks.push(buffer);
	}
	const text = Buffer.concat(chunks).toString("utf8");
	if (text.trim() === "") return {};
	try {
		return JSON.parse(text);
	} catch {
		throw new ResttyError("bad-request", "request body is not valid JSON");
	}
}
/** Write a JSON response with the given status. */
function writeJson(res, status, body) {
	const payload = JSON.stringify(body);
	res.writeHead(status, { "content-type": "application/json; charset=utf-8" });
	res.end(payload);
}
/** Write the success envelope. */
function writeOk(res, value) {
	writeJson(res, 200, {
		ok: true,
		value
	});
}
/** Write the failure envelope for any thrown value (unknown → internal 500). */
function writeError(res, error) {
	if (error instanceof ResttyError) {
		writeJson(res, error.status, {
			ok: false,
			error: {
				code: error.code,
				message: error.message
			}
		});
		return;
	}
	writeJson(res, 500, {
		ok: false,
		error: {
			code: "internal",
			message: error instanceof Error ? error.message : String(error)
		}
	});
}
/** Narrow an unknown payload value to a string, else throw bad-request. */
function requireString(payload, key) {
	const value = payload?.[key];
	if (typeof value !== "string" || value === "") throw new ResttyError("bad-request", `missing or invalid "${key}"`);
	return value;
}
//#endregion
//#region src/rust-pty-deps.ts
/**
* Rust PTY (napi-rs + portable-pty) dependency loading for the host half.
*
* The terminal surfaces need the native `dsh-powerdesk-pty` module, but the
* package must NEVER be imported statically at module top level: a missing
* or broken native binding (a pruned prebuilt, a wrong-platform binary, a
* failed `cargo build`, an AppArmor denial…) would then fail the plugin
* module load and — because a loader entry apply failure aborts the boot —
* take the whole `dsh web` server down with it.
*
* Instead the host half loads the native module lazily (synchronously, via
* createRequire). When the load fails the plugin stays mounted in a
* degraded state: the terminal shows a friendly error carrying a pasteable
* repair command (see scripts/install.sh `--repair` / scripts/build-rust.sh),
* and the /powerdesk/ws/terminal upgrade closes with the short marker so the
* client fetches the full details from /powerdesk/api/terminal.deps.
*
* Binary distribution: the crate builds per-platform napi binaries. The
* loader resolves one of, in order:
*  1. `DSH_POWERDESK_PTY_PATH` — an explicit absolute path to the `.node` file;
*  2. the companion package `@dsh-powerdesk-pty/<triple>` (optionalDependencies
*     when the plugin is published with per-platform companion packages);
*  3. `prebuilt/<triple>/dsh_powerdesk_pty.node` next to the plugin (fetched by
*     scripts/install.sh, or built by scripts/build-rust.sh).
* The triple is derived from `process.platform` / `process.arch` / libc and
* can be overridden with `DSH_POWERDESK_PTY_TRIPLE` (e.g. for musl `linux-x64-musl`).
*/
/** The crate version this plugin ships (keep in sync with rust/Cargo.toml). */
const DSH_POWERDESK_PTY_VERSION = "0.1.0";
/**
* The WebSocket close-code-1011 reason the host sends when the native pty
* module is unavailable. The client recognizes this exact marker and fetches
* the full repair details from `/powerdesk/api/terminal.deps` (a WS close reason
* is capped at 123 bytes, so the command itself cannot ride the close frame).
*/
const PTY_DEPS_MISSING = "powerdesk-pty-deps-missing";
const defaultRequire = createRequire(import.meta.url);
let cached;
/** The napi binary file name the build produces (napi-rs default naming). */
const NATIVE_BASENAME = "dsh_powerdesk_pty.node";
/**
* Resolve the platform triple for the running process. Linux defaults to the
* gnu ABI (the common case); override with `DSH_POWERDESK_PTY_TRIPLE` for musl
* (e.g. Alpine: `linux-x64-musl`).
*/
function detectPlatformTriple(platform = process.platform, arch = process.arch, env = process.env) {
	const override = env.DSH_POWERDESK_PTY_TRIPLE;
	if (typeof override === "string" && override.trim() !== "") return override.trim();
	if (platform === "win32") return arch === "arm64" ? "win32-arm64-msvc" : "win32-x64-msvc";
	if (platform === "darwin") return arch === "arm64" ? "darwin-arm64" : "darwin-x64";
	if (platform === "linux") return `linux-${arch === "arm64" ? "arm64-gnu" : "x64-gnu"}`;
	return `${platform}-${arch}`;
}
/** Resolve a directory to its physical location (symlinked/link: installs). */
function realDir(file) {
	try {
		return dirname(realpathSync(file));
	} catch {
		return dirname(file);
	}
}
/** Walk up from `dir` looking for a DSH profile root (package.json + pnpm-workspace.yaml). */
function walkUp(dir, isRoot) {
	let current = dir;
	for (let depth = 0; depth < 16; depth += 1) {
		if (isRoot(current)) return current;
		const parent = dirname(current);
		if (parent === current) break;
		current = parent;
	}
	return null;
}
/** Whether `dir` looks like a DSH profile root. */
function isProfileRoot(dir) {
	return existsSync(join(dir, "package.json")) && existsSync(join(dir, "pnpm-workspace.yaml"));
}
/** Whether `dir`'s package.json declares this plugin's name. */
function isPluginRoot(dir) {
	const file = join(dir, "package.json");
	if (!existsSync(file)) return false;
	try {
		return JSON.parse(readFileSync(file, "utf8")).name === "dsh-powerdesk";
	} catch {
		return false;
	}
}
/** The plugin package root (walk-up from the module; works for lib/ and src/ layouts). */
function findPluginRoot(fromFile = fileURLToPath(import.meta.url)) {
	return walkUp(realDir(fromFile), isPluginRoot);
}
/** The DSH profile directory this plugin is installed into (null when undetected). */
function findProfileDir(fromFile = fileURLToPath(import.meta.url)) {
	const detected = walkUp(realDir(fromFile), isProfileRoot);
	if (detected !== null) return detected;
	const home = process.env.DSH_HOME !== void 0 && process.env.DSH_HOME.trim() !== "" ? process.env.DSH_HOME : join(homedir(), ".dsh");
	const web = join(home, "profiles", "web");
	return isProfileRoot(web) ? realpathSync(web) : null;
}
/**
* The candidate require specifiers / file paths for the native module, in
* resolution order (env path → companion package → prebuilt next to plugin).
* Exposed for tests.
*/
function nativeCandidates(triple, pluginRoot, env = process.env) {
	const candidates = [];
	const envPath = env.DSH_POWERDESK_PTY_PATH;
	if (typeof envPath === "string" && envPath.trim() !== "") candidates.push(envPath.trim());
	candidates.push(`@dsh-powerdesk-pty/${triple}`);
	if (pluginRoot !== null) candidates.push(join(pluginRoot, "prebuilt", triple, NATIVE_BASENAME));
	return candidates;
}
/**
* Load the native pty module once (synchronously) and cache the outcome.
* Returns null when the module or its native binding cannot be loaded; the
* cause stays queryable through {@link rustPtyLoadCause}. Never throws.
*/
function loadRustPty(requireImpl = defaultRequire) {
	if (cached === void 0) {
		const triple = detectPlatformTriple();
		const candidates = nativeCandidates(triple, findPluginRoot());
		let result = {
			ok: false,
			cause: /* @__PURE__ */ new Error(`no native pty candidate for triple "${triple}"`)
		};
		for (const spec of candidates) try {
			const mod = requireImpl(spec);
			const surface = (typeof mod.spawn === "function" ? mod : mod.default) ?? mod;
			if (surface !== void 0 && typeof surface.spawn === "function") {
				result = {
					ok: true,
					module: surface
				};
				break;
			}
			result = {
				ok: false,
				cause: /* @__PURE__ */ new Error(`native module "${spec}" has no spawn() export`)
			};
		} catch (cause) {
			result = {
				ok: false,
				cause
			};
		}
		cached = result;
	}
	return cached.ok ? cached.module : null;
}
/** The recorded load failure (undefined when the load succeeded or never ran). */
function rustPtyLoadCause() {
	return cached !== void 0 && !cached.ok ? cached.cause : void 0;
}
/** Load the native pty module or throw the canonical degraded-mode error. */
function loadRequiredRustPty() {
	const module = loadRustPty();
	if (module === null) {
		const cause = describeCause(rustPtyLoadCause());
		throw new ResttyError("pty-deps-missing", `dsh-powerdesk-pty (${DSH_POWERDESK_PTY_VERSION}) failed to load: ${cause} — run the repair command shown in the terminal tab`, 503);
	}
	return module;
}
/**
* The pasteable repair command for a broken native pty install: rerun the
* plugin's installer in `--repair` mode (idempotent: it re-downloads the
* platform prebuilt, or rebuilds from source when a Rust toolchain is
* present). Falls back to the from-source build script when the installer is
* not shipped (exotic layouts).
*/
function buildRepairCommand(options) {
	const { pluginRoot, profileDir } = options;
	const platform = options.platform ?? process.platform;
	const profileName = profileDir !== null ? basename(profileDir) : null;
	const profileArg = profileName !== null ? platform === "win32" ? ` -Profile "${profileName}"` : ` --profile "${profileName}"` : "";
	if (pluginRoot !== null) {
		if (platform === "win32") {
			const script = join(pluginRoot, "scripts", "install.ps1");
			if (existsSync(script)) return { command: `powershell -ExecutionPolicy Bypass -File "${script}" -Repair${profileArg}` };
		} else {
			const script = join(pluginRoot, "scripts", "install.sh");
			if (existsSync(script)) return { command: `bash "${script}" --repair${profileArg}` };
		}
	}
	return {
		command: `dsh plugin --profile "${profileName ?? "web"}" install`,
		note: "The native pty binary could not be located. Run scripts/install.sh --repair (re-downloads the platform prebuilt) or scripts/build-rust.sh (builds from source with a Rust toolchain), then restart DSH."
	};
}
/** One-line human description of the recorded load cause. */
function describeCause(cause) {
	if (cause instanceof Error) return cause.message;
	return String(cause);
}
/** Current native pty dependency status (loaded vs degraded + repair info). */
function depsStatus(options = {}) {
	if (loadRustPty() !== null) return { ok: true };
	const pluginRoot = findPluginRoot(options.fromFile);
	const profileDir = findProfileDir(options.fromFile);
	const { command, note } = buildRepairCommand({
		pluginRoot,
		profileDir
	});
	return {
		ok: false,
		cause: describeCause(rustPtyLoadCause()),
		command,
		profile: profileDir !== null ? basename(profileDir) : null,
		...note !== void 0 ? { note } : {}
	};
}
//#endregion
//#region src/rust-pty-manager.ts
/**
* PTY session table for the restty terminals. One Rust pty process per
* `${sessionId}:${tabId}` key; processes survive WebSocket disconnects (page
* refresh, tab switch) and reconnect to the same process by key. Output is
* mirrored into a bounded transcript ring (capped bytes) so a new connection
* replays history before live data. Sessions die only when the tab is
* closed or the plugin tears down.
*
* This is the restty analogue of dsh-better-sidebar's PtyManager, backed by
* the Rust native module ({@link ./rust-pty.ts}) instead of node-pty. The
* surface is intentionally identical so the WS attach logic reads the same.
*/
/** Per-terminal transcript bound (bytes kept for replay). */
const TRANSCRIPT_LIMIT = 1 << 20;
/**
* The terminal registry. `maxPerSession` bounds concurrent processes per
* conversation (the client caps tabs at the same number).
*/
var RustPtyManager = class {
	shell;
	maxPerSession;
	module;
	platform;
	sessions = /* @__PURE__ */ new Map();
	pendingCloses = /* @__PURE__ */ new Map();
	constructor(shell, maxPerSession, module = loadRequiredRustPty(), platform = process.platform) {
		this.shell = shell;
		this.maxPerSession = maxPerSession;
		this.module = module;
		this.platform = platform;
	}
	/** All live terminal keys of one session. */
	keysOf(sessionId) {
		const keys = [];
		for (const handle of this.sessions.values()) if (handle.sessionId === sessionId) keys.push(handle.key);
		return keys;
	}
	/**
	* Open (or reuse) the terminal for a session/tab key. A handle whose
	* process already exited is replaced with a fresh spawn (reconnecting a
	* dead terminal must yield a live shell, not an input sink), and so is a
	* live handle whose spawn cwd differs from the now-authoritative one.
	* Reopening cancels any pending scheduled close (a reconnect within the
	* grace window keeps the process alive).
	* @returns the live handle.
	* @throws {ResttyError} pty-error when the per-session cap is reached.
	*/
	open(sessionId, tabId, cwd, cols, rows) {
		const key = `${sessionId}:${tabId}`;
		this.cancelClose(key);
		const existing = this.sessions.get(key);
		if (existing !== void 0 && !existing.exited && existing.cwd === cwd) return existing;
		if (existing !== void 0) this.close(key);
		for (const [candidate, handle] of [...this.sessions]) if (handle.sessionId === sessionId && handle.exited) this.close(candidate);
		if (this.keysOf(sessionId).length >= this.maxPerSession) throw new ResttyError("pty-error", `terminal limit reached (${this.maxPerSession}) for this session`, 400);
		const options = {
			cols: Math.max(2, Math.floor(cols)),
			rows: Math.max(2, Math.floor(rows)),
			cwd,
			env: { ...process.env }
		};
		const pty = new RustPty(this.module.spawn(this.shell, shellSpawnArgs(this.platform), options));
		const handle = {
			key,
			sessionId,
			tabId,
			cwd,
			pty,
			transcript: "",
			exited: false
		};
		pty.onData((data) => {
			handle.transcript += data;
			if (handle.transcript.length > TRANSCRIPT_LIMIT) handle.transcript = handle.transcript.slice(handle.transcript.length - TRANSCRIPT_LIMIT);
		});
		pty.onExit(({ exitCode, signal }) => {
			handle.exited = true;
			handle.exitCode = exitCode;
			handle.exitSignal = signal ?? null;
		});
		this.sessions.set(key, handle);
		return handle;
	}
	/**
	* Schedule the terminal's destruction after `delayMs`. A tab close sends
	* delay 0 (release the quota immediately); a bare socket drop (refresh,
	* crash) uses the grace period so a quick reconnect keeps the process.
	* `open()` cancels any pending close.
	*/
	scheduleClose(key, delayMs) {
		if (this.sessions.get(key) === void 0) return;
		this.cancelClose(key);
		const timer = setTimeout(() => {
			this.close(key);
		}, delayMs);
		this.pendingCloses.set(key, timer);
	}
	/** Cancel a pending scheduled close (the terminal is being reopened). */
	cancelClose(key) {
		const timer = this.pendingCloses.get(key);
		if (timer !== void 0) {
			clearTimeout(timer);
			this.pendingCloses.delete(key);
		}
	}
	/** Resolve a live handle by key, or undefined. */
	get(key) {
		return this.sessions.get(key);
	}
	/** Close a terminal and drop its state (the owning tab was closed). */
	close(key) {
		this.cancelClose(key);
		const handle = this.sessions.get(key);
		if (handle === void 0) return;
		this.sessions.delete(key);
		handle.pty.kill();
	}
	/** Close every terminal (plugin teardown). */
	disposeAll() {
		for (const timer of this.pendingCloses.values()) clearTimeout(timer);
		this.pendingCloses.clear();
		for (const key of [...this.sessions.keys()]) this.close(key);
	}
};
//#endregion
//#region src/pty-wire.ts
/** Parse one client JSON control frame; null when the text is not JSON. */
function parseClientFrame(text) {
	try {
		const value = JSON.parse(text);
		if (value === null || typeof value !== "object") return null;
		return value;
	} catch {
		return null;
	}
}
/** Clamp a dimension into the supported pty range (2..1024, flooring decimals). */
function clampDim(value, fallback) {
	if (!Number.isFinite(value)) return fallback;
	return Math.min(1024, Math.max(2, Math.floor(value)));
}
/**
* Dispatch one client control frame to the live pty. The host passes the
* bound `sendControl` (stringify + ws.send) and `sendData` (encode + binary
* ws.send) so this stays pure of the `ws` transport.
*/
function handleClientMessage(text, handle, ptyManager, sendControl, sendData) {
	const frame = parseClientFrame(text);
	if (frame === null) {
		sendControl({
			type: "error",
			message: "expected a JSON control frame"
		});
		return;
	}
	if (frame.type === "input" && typeof frame.data === "string") {
		handle.pty.write(frame.data);
		return;
	}
	if (frame.type === "resize" && typeof frame.cols === "number" && typeof frame.rows === "number") {
		const cols = clampDim(frame.cols, 80);
		const rows = clampDim(frame.rows, 24);
		const pixelW = typeof frame.widthPx === "number" ? frame.widthPx : void 0;
		const pixelH = typeof frame.heightPx === "number" ? frame.heightPx : void 0;
		handle.pty.resize(cols, rows, pixelW, pixelH);
		return;
	}
	if (frame.type === "close") {
		ptyManager.scheduleClose(handle.key, 0);
		return;
	}
	sendControl({
		type: "error",
		message: `unknown message type: ${String(frame.type)}`
	});
}
//#endregion
//#region src/browser-probe.ts
/**
* Pure helpers for the `browser.probe` route (the sidebar browser): the host
* fetches the response HEADERS of a URL the user is browsing and the client
* decides whether the target site forbids being embedded (X-Frame-Options /
* CSP frame-ancestors are exactly the signals the browser enforces when it
* refuses an iframe load). Kept dependency-free so the parser is
* unit-testable.
*
* Adapted from dsh-better-sidebar (BSD-3-Clause).
*/
/**
* Extract the `frame-ancestors` source list of a Content-Security-Policy
* header, or undefined when the directive is absent (or empty). The
* directive is the only one with a source list; sources are space-separated
* tokens (`'none'`, `'self'`, `*`, or origins).
*/
function extractFrameAncestors(csp) {
	if (csp === null) return void 0;
	for (const directive of csp.split(";")) {
		const parts = directive.trim().split(/\s+/);
		if (parts[0] === "frame-ancestors") {
			const sources = parts.slice(1).filter((source) => source !== "");
			return sources.length === 0 ? void 0 : sources;
		}
	}
}
//#endregion
//#region src/fs-api.ts
/**
* Host-side file API for the Explorer/Editor tabs: list a directory, read a
* file, write a file. Mounted under `/powerdesk/api/fs.*` in src/index.ts
* behind the same browser-trust fence every route uses.
*
* No extra path sandboxing beyond `resolve()`: the plugin already ships a
* full interactive shell (the terminal), so a user with access to this
* plugin already has unrestricted local filesystem access — restricting the
* file API more tightly than the terminal would be theater, not security.
*/
/** The host's home directory (the folder-picker's starting point). */
function fsHome() {
	return { path: homedir() };
}
/** Cap file reads so a giant log/binary does not get pulled into the editor. */
const FS_READ_LIMIT = 5242880;
/** List one directory's immediate children: directories first, then A-Z. */
async function fsList(path) {
	const abs = resolve(path);
	let dirents;
	try {
		dirents = await readdir(abs, { withFileTypes: true });
	} catch (error) {
		throw new ResttyError("bad-request", `cannot list "${abs}": ${error instanceof Error ? error.message : String(error)}`, 400);
	}
	const entries = [];
	for (const dirent of dirents) {
		const isDir = dirent.isDirectory();
		let size = 0;
		if (!isDir) try {
			size = (await stat(join(abs, dirent.name))).size;
		} catch {}
		entries.push({
			name: dirent.name,
			isDir,
			size
		});
	}
	entries.sort((a, b) => a.isDir !== b.isDir ? a.isDir ? -1 : 1 : a.name.localeCompare(b.name));
	return {
		path: abs,
		entries
	};
}
/** Read one file as UTF-8 text, capped at {@link FS_READ_LIMIT} bytes. */
async function fsRead(path) {
	const abs = resolve(path);
	let info;
	try {
		info = await stat(abs);
	} catch (error) {
		throw new ResttyError("not-found", `cannot read "${abs}": ${error instanceof Error ? error.message : String(error)}`, 404);
	}
	if (info.isDirectory()) throw new ResttyError("bad-request", `"${abs}" is a directory`, 400);
	const truncated = info.size > FS_READ_LIMIT;
	const buffer = await readFile(abs);
	return {
		path: abs,
		content: (truncated ? buffer.subarray(0, FS_READ_LIMIT) : buffer).toString("utf8"),
		truncated
	};
}
/** Overwrite one file's content (UTF-8; the parent directory must exist). */
async function fsWrite(path, content) {
	const abs = resolve(path);
	try {
		await writeFile(abs, content, "utf8");
	} catch (error) {
		throw new ResttyError("bad-request", `cannot write "${abs}": ${error instanceof Error ? error.message : String(error)}`, 400);
	}
	return { path: abs };
}
/** Create a NEW empty file (exclusive: fails if it already exists, so
*  "new note" never silently clobbers one). Parent directory must exist. */
async function fsCreate(path) {
	const abs = resolve(path);
	try {
		await writeFile(abs, "", {
			encoding: "utf8",
			flag: "wx"
		});
	} catch (error) {
		if (error.code === "EEXIST") throw new ResttyError("bad-request", `"${abs}" already exists`, 400);
		throw new ResttyError("bad-request", `cannot create "${abs}": ${error instanceof Error ? error.message : String(error)}`, 400);
	}
	return { path: abs };
}
/** Create a directory (and any missing parents). */
async function fsMkdir(path) {
	const abs = resolve(path);
	try {
		await mkdir(abs, { recursive: true });
	} catch (error) {
		throw new ResttyError("bad-request", `cannot create folder "${abs}": ${error instanceof Error ? error.message : String(error)}`, 400);
	}
	return { path: abs };
}
/** Rename/move a file or folder. */
async function fsRename(from, to) {
	const absFrom = resolve(from);
	const absTo = resolve(to);
	try {
		await rename(absFrom, absTo);
	} catch (error) {
		throw new ResttyError("bad-request", `cannot rename "${absFrom}" to "${absTo}": ${error instanceof Error ? error.message : String(error)}`, 400);
	}
	return { path: absTo };
}
/** Delete a file or a folder (recursively). */
async function fsDelete(path) {
	const abs = resolve(path);
	try {
		await rm(abs, {
			recursive: true,
			force: true
		});
	} catch (error) {
		throw new ResttyError("bad-request", `cannot delete "${abs}": ${error instanceof Error ? error.message : String(error)}`, 400);
	}
	return { path: abs };
}
/** Hard caps so a wrong/huge bound folder (or a symlink loop) can't hang the
*  route or blow up the response — the notes tree is meant for a personal
*  notes folder, not an arbitrary large repo. */
const MD_TREE_MAX_DEPTH = 12;
const MD_TREE_MAX_NODES = 5e3;
function isMarkdownFile(name) {
	const lower = name.toLowerCase();
	return lower.endsWith(".md") || lower.endsWith(".markdown");
}
/** Recursively walk `path`, keeping only markdown files and the directories
*  that lead to them. Returns undefined for a directory with no markdown
*  descendants (pruned by the caller). `budget` is a shared mutable counter
*  capping total visited nodes across the whole walk. */
async function walkMarkdownTree(abs, depth, budget) {
	if (depth > MD_TREE_MAX_DEPTH || budget.left <= 0) return [];
	let dirents;
	try {
		dirents = await readdir(abs, { withFileTypes: true });
	} catch {
		return [];
	}
	dirents.sort((a, b) => a.name.localeCompare(b.name));
	const nodes = [];
	for (const dirent of dirents) {
		if (budget.left <= 0) break;
		const childAbs = join(abs, dirent.name);
		if (dirent.isDirectory()) {
			const children = await walkMarkdownTree(childAbs, depth + 1, budget);
			if (children.length > 0) nodes.push({
				name: dirent.name,
				path: childAbs,
				isDir: true,
				children
			});
		} else if (isMarkdownFile(dirent.name)) {
			budget.left -= 1;
			nodes.push({
				name: dirent.name,
				path: childAbs,
				isDir: false
			});
		}
	}
	return nodes;
}
/** The Notes tab's recursive `.md` tree over a bound folder. */
async function fsListMarkdownTree(path) {
	const abs = resolve(path);
	try {
		if (!(await stat(abs)).isDirectory()) throw new ResttyError("bad-request", `"${abs}" is not a directory`, 400);
	} catch (error) {
		if (error instanceof ResttyError) throw error;
		throw new ResttyError("not-found", `cannot read "${abs}": ${error instanceof Error ? error.message : String(error)}`, 404);
	}
	return {
		path: abs,
		children: await walkMarkdownTree(abs, 0, { left: MD_TREE_MAX_NODES })
	};
}
//#endregion
//#region src/index.ts
/** Plugin identity for cordis.yml rows. */
const name = "dsh-powerdesk";
/** Services required before mounting: the webserver routes, the session
*  store, and the web runtime's trusted hosts. */
const inject = [
	"webServer",
	"sessions",
	"webRuntime"
];
/**
* Resolve a session's authoritative working directory. The attached session
* header wins; while the session is still hydrating from persistence (the web
* client attaches the current conversation a moment after page load, so the
* very first restty requests can arrive detached) the caller's own list
* summary cwd is used; the process cwd is the last resort. Never throws for
* a missing cwd, so the terminal works from first paint.
*/
function sessionCwdOf(ctx, sessionId, clientCwd) {
	const headerCwd = ctx.sessions.get(sessionId)?.header.cwd;
	if (headerCwd !== void 0 && headerCwd !== "") return headerCwd;
	if (clientCwd !== void 0 && clientCwd !== "") return clientCwd;
	return process.cwd();
}
/** Build the JSON API method table bound to the plugin context + pty manager. */
function buildApi(ctx, ptyManager) {
	const cwdOf = (payload) => {
		const sessionId = requireString(payload, "sessionId");
		const record = payload;
		return {
			sessionId,
			cwd: sessionCwdOf(ctx, sessionId, typeof record?.cwd === "string" && record.cwd !== "" ? record.cwd : void 0)
		};
	};
	return {
		"session.cwd": (payload) => {
			const { sessionId, cwd } = cwdOf(payload);
			return {
				sessionId,
				cwd
			};
		},
		"pty.close": (payload) => {
			const sessionId = requireString(payload, "sessionId");
			const tab = requireString(payload, "tab");
			ptyManager?.close(`${sessionId}:${tab}`);
			return { ok: true };
		},
		"terminal.deps": () => depsStatus(),
		"browser.probe": async (payload) => {
			const raw = requireString(payload, "url");
			let parsed;
			try {
				parsed = new URL(raw);
			} catch {
				throw new ResttyError("bad-request", "invalid url", 400);
			}
			if (parsed.protocol !== "http:" && parsed.protocol !== "https:") throw new ResttyError("bad-request", "only http/https urls can be probed", 400);
			if (isLoopbackHostname(parsed.hostname)) throw new ResttyError("bad-request", "local addresses are not probed", 400);
			const controller = new AbortController();
			const timer = setTimeout(() => controller.abort(), 8e3);
			try {
				let response = await fetch(parsed, {
					method: "HEAD",
					redirect: "follow",
					signal: controller.signal
				});
				if (response.status === 405 || response.status === 501) response = await fetch(parsed, {
					method: "GET",
					redirect: "follow",
					signal: controller.signal
				});
				const frameAncestors = extractFrameAncestors(response.headers.get("content-security-policy"));
				const xFrameOptions = response.headers.get("x-frame-options");
				return {
					reachable: true,
					url: response.url,
					status: response.status,
					...xFrameOptions !== null ? { xFrameOptions } : {},
					...frameAncestors !== void 0 ? { frameAncestors } : {}
				};
			} catch {
				return { reachable: false };
			} finally {
				clearTimeout(timer);
			}
		},
		"fs.list": (payload) => fsList(requireString(payload, "path")),
		"fs.read": (payload) => fsRead(requireString(payload, "path")),
		"fs.write": (payload) => {
			return fsWrite(requireString(payload, "path"), requireString(payload, "content"));
		},
		"fs.create": (payload) => fsCreate(requireString(payload, "path")),
		"fs.mkdir": (payload) => fsMkdir(requireString(payload, "path")),
		"fs.rename": (payload) => {
			return fsRename(requireString(payload, "from"), requireString(payload, "to"));
		},
		"fs.delete": (payload) => fsDelete(requireString(payload, "path")),
		"fs.listMarkdownTree": (payload) => fsListMarkdownTree(requireString(payload, "path")),
		"fs.home": () => fsHome()
	};
}
/**
* Plugin body: mount the fenced routes and the pty lifecycle.
* @param ctx - host plugin context (webServer, sessions, webRuntime).
* @param config - deployment-provided limits; the Loader validates against
* {@link Config} and fills defaults.
*/
function apply(ctx, config) {
	const resolved = resolveResttyConfig(config);
	const terminalShell = defaultShell({ explicit: resolved.shell });
	const fence = (req) => isTrustedApiRequest(req, ctx.webRuntime.trustedHosts);
	const nativeModule = loadRustPty();
	if (nativeModule === null) {
		const status = depsStatus();
		const detail = status.ok ? "unknown cause" : `${status.cause}. Repair: ${status.command}`;
		console.warn(`[dsh-powerdesk] native pty failed to load: ${detail}`);
	}
	const ptyManager = nativeModule !== null ? new RustPtyManager(terminalShell, resolved.terminalsPerSession, nativeModule) : null;
	const api = buildApi(ctx, ptyManager);
	ctx.effect(() => ctx.webServer.register({
		kind: "prefix",
		path: "/powerdesk/api",
		handler: async (req, res) => {
			if (!fence(req)) {
				writeJson(res, 403, {
					ok: false,
					error: {
						code: "forbidden",
						message: "forbidden"
					}
				});
				return;
			}
			if (req.method !== "POST") {
				writeJson(res, 405, {
					ok: false,
					error: {
						code: "method-error",
						message: "method not allowed"
					}
				});
				return;
			}
			const pathname = new URL(req.url ?? "/", "http://dsh.internal").pathname;
			const method = pathname.startsWith("/powerdesk/api/") ? pathname.slice(15) : void 0;
			if (method === void 0 || method.includes("/")) {
				writeError(res, new ResttyError("not-found", "unknown restty API method", 404));
				return;
			}
			try {
				const payload = await readJsonBody(req);
				const handler = api[method];
				if (handler === void 0) throw new ResttyError("not-found", `unknown restty API method "${method}"`, 404);
				writeOk(res, await handler(payload));
			} catch (error) {
				writeError(res, error);
			}
		}
	}), "dsh-powerdesk: /powerdesk/api routes");
	ctx.effect(() => registerBundleRoute(ctx, fence), "dsh-powerdesk: /powerdesk/bundle chunk route");
	const wss = new WebSocketServer({ noServer: true });
	ctx.effect(() => ctx.webServer.registerUpgrade({
		path: "/powerdesk/ws/terminal",
		handler: (req, socket, head) => {
			if (!fence(req)) {
				socket.destroy();
				return;
			}
			wss.handleUpgrade(req, socket, head, (ws) => {
				attachTerminal(ctx, ptyManager, terminalShell, ws, req, resolved);
			});
		}
	}), "dsh-powerdesk: terminal WebSocket");
	ctx.effect(() => () => {
		ptyManager?.disposeAll();
		wss.close();
	}, "dsh-powerdesk: teardown");
}
/**
* Wire one terminal socket to its pty: replay transcript, pump both ways.
* restty sends `{type:'input',data}` / `{type:'resize',cols,rows,…}` /
* `{type:'close'}` as JSON string frames; we send terminal bytes back as
* BINARY frames and status/error/exit as JSON string frames.
*/
async function attachTerminal(ctx, ptyManager, shell, ws, req, resolved) {
	try {
		const url = new URL(req.url ?? "/", "http://dsh.internal");
		const sessionId = url.searchParams.get("sessionId");
		const tabId = url.searchParams.get("tab");
		if (sessionId === null || tabId === null) {
			ws.close(1008, "sessionId and tab are required");
			return;
		}
		if (ptyManager === null) {
			ws.close(1011, PTY_DEPS_MISSING);
			return;
		}
		const cwd = sessionCwdOf(ctx, sessionId, url.searchParams.get("cwd") ?? void 0);
		const handle = ptyManager.open(sessionId, tabId, cwd, 80, 24);
		ws.send(JSON.stringify({
			type: "status",
			shell
		}));
		if (handle.transcript !== "") ws.send(Buffer.from(handle.transcript, "utf8"));
		const onData = (data) => {
			if (ws.readyState === WebSocket.OPEN && ws.bufferedAmount < 4194304) ws.send(Buffer.from(data, "utf8"));
		};
		const onExit = ({ exitCode }) => {
			onData(`\r\n[process exited with code ${String(exitCode)}]\r\n`);
			if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify({
				type: "exit",
				code: exitCode
			}));
		};
		const dataSub = handle.pty.onData(onData);
		const exitSub = handle.pty.onExit(onExit);
		const sendControl = (payload) => {
			if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify(payload));
		};
		const sendData = (text) => {
			onData(text);
		};
		ws.on("message", (data) => {
			handleClientMessage(data.toString("utf8"), handle, ptyManager, sendControl, sendData);
		});
		ws.on("close", () => {
			dataSub();
			exitSub();
			ptyManager.scheduleClose(handle.key, resolved.reconnectGraceMs);
		});
	} catch (error) {
		ws.close(1011, error instanceof Error ? error.message : String(error));
	}
}
//#endregion
export { Config, apply, inject, name };
