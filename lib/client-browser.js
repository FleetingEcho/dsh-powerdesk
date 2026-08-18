globalThis.__dshPowerdeskChunks__ = globalThis.__dshPowerdeskChunks__ || {};
globalThis.__dshPowerdeskChunks__["browser"] = (require) => {
	var module = { exports: {} };
	var exports = module.exports;
	Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
	let react = require("react");
	let react_jsx_runtime = require("react/jsx-runtime");
	//#region src/client/api.ts
	/**
	* Typed fetch wrapper over the /restty JSON API and the WebSocket URL builders.
	* Every call posts to `/powerdesk/api/<method>` with the sessionId (and the
	* session's cwd when known). Failures surface as {@link ResttyApiError} with
	* the wire code.
	*/
	/** One wire failure. */
	var ResttyApiError = class extends Error {
		code;
		constructor(code, message) {
			super(message);
			this.code = code;
		}
	};
	async function call(method, payload, signal) {
		let response;
		try {
			response = await fetch(`/powerdesk/api/${method}`, {
				method: "POST",
				headers: { "content-type": "application/json" },
				body: JSON.stringify(payload),
				signal
			});
		} catch (error) {
			throw new ResttyApiError("network", error instanceof Error ? error.message : String(error));
		}
		const parsed = await response.json().catch(() => null);
		if (!response.ok || parsed === null || parsed.ok !== true || parsed.value === void 0) throw new ResttyApiError(parsed?.error?.code ?? "http", parsed?.error?.message ?? `HTTP ${response.status}`);
		return parsed.value;
	}
	/** Fold a scope into a JSON payload ({cwd} only when present). */
	function scopePayload(scope, extra) {
		return {
			sessionId: scope.sessionId,
			...scope.cwd !== void 0 && scope.cwd !== "" ? { cwd: scope.cwd } : {},
			...extra
		};
	}
	/** The restty API surface (session scope threaded through every call). */
	const api = {
		/** Resolve the session's authoritative cwd (used by the standalone panel
		*  when the client list summary has no cwd). */
		sessionCwd: (scope, signal) => call("session.cwd", scopePayload(scope, {}), signal),
		/** Release a terminal's process immediately (tab closed while the WS was
		*  down; the close frame may be unreachable, so the host also accepts this
		*  explicit route). */
		ptyClose: (scope, tab) => call("pty.close", scopePayload(scope, { tab })),
		/** Native pty dependency status: after a WS close 1011 with reason
		*  `powerdesk-pty-deps-missing` the view fetches the full repair details here. */
		terminalDeps: () => call("terminal.deps", {}),
		/** Probe a URL's response headers (the browser tab's embeddability check;
		*  see the host's browser.probe route). Returns whether the target site
		*  forbids being embedded (X-Frame-Options / frame-ancestors). */
		browserProbe: (url, signal) => call("browser.probe", { url }, signal),
		/** List one directory's immediate children (Explorer tab). */
		fsList: (path, signal) => call("fs.list", { path }, signal),
		/** Read one file's content, capped server-side at a few MB (Editor tab). */
		fsRead: (path, signal) => call("fs.read", { path }, signal),
		/** Overwrite one file's content (Editor tab save). */
		fsWrite: (path, content) => call("fs.write", {
			path,
			content
		}),
		/** Create a NEW empty file; fails if it already exists (Notes "new note"). */
		fsCreate: (path) => call("fs.create", { path }),
		/** Create a directory, including missing parents (Notes "new folder"). */
		fsMkdir: (path) => call("fs.mkdir", { path }),
		/** Rename/move a file or folder (Notes rename). */
		fsRename: (from, to) => call("fs.rename", {
			from,
			to
		}),
		/** Delete a file or folder, recursively (Notes delete). */
		fsDelete: (path) => call("fs.delete", { path }),
		/** The recursive `.md` tree over a bound folder (Notes tab). */
		fsListMarkdownTree: (path, signal) => call("fs.listMarkdownTree", { path }, signal),
		/** The host's home directory (the folder-picker modal's starting point). */
		fsHome: (signal) => call("fs.home", {}, signal),
		/** Content search over a directory via ripgrep (Search tab). `options` are
		*  the search box's modifier toggles ("Aa" / "ab" / ".*"). */
		searchGrep: (path, query, options, signal) => call("search.grep", {
			path,
			query,
			...options
		}, signal),
		/** Ripgrep dependency status: fetched when the Search tab needs to show a
		*  repair banner (no `/powerdesk/ws/*` upgrade to close-marker off of here
		*  — search is a plain buffered POST, so the client just checks this
		*  directly rather than reacting to a socket close). */
		searchDeps: (signal) => call("search.deps", {}, signal),
		/** List all calendar events, earliest first (Calendar tab). */
		calendarList: (signal) => call("calendar.list", {}, signal),
		/** Create a calendar event (Calendar tab). Returns the created event. */
		calendarCreate: (event, signal) => call("calendar.create", { ...event }, signal),
		/** Update a calendar event by id (Calendar tab). Returns the changed-row count. */
		calendarUpdate: (event, signal) => call("calendar.update", { ...event }, signal),
		/** Delete a calendar event by id (Calendar tab). Returns the changed-row count. */
		calendarDelete: (id, signal) => call("calendar.delete", { id }, signal),
		/** SQLite native-binary dependency status: fetched when the Calendar tab
		*  needs to show a repair banner (same pattern as searchDeps). */
		calendarDeps: (signal) => call("calendar.deps", {}, signal),
		/** Installed extensions plus the config gate (answers even when disabled,
		*  so the settings card can explain why nothing loads). */
		extList: (signal) => call("ext.list", {}, signal),
		/** Install an uploaded archive. `id`/`title` are only consulted when the
		*  upload turns out to be a bare script with no manifest of its own. */
		extInstall: (upload) => call("ext.install", { ...upload }),
		/** Uninstall one extension (removing an absent id is a no-op). */
		extRemove: (id) => call("ext.remove", { id })
	};
	//#endregion
	//#region src/client/browser.ts
	/**
	* Decide whether a site can render inside the sidebar iframe. The signals
	* are exactly the ones the BROWSER enforces when it refuses an iframe load:
	* X-Frame-Options DENY/SAMEORIGIN, or a frame-ancestors directive that does
	* not allow `*` ('self' here means the SITE's own origin — never ours, so
	* it also blocks the sidebar). A site we could not reach yields 'unknown'
	* and the plain iframe stays.
	*/
	function embeddabilityOf(probe) {
		if (probe.reachable !== true) return "unknown";
		const xfo = probe.xFrameOptions?.trim().toUpperCase();
		if (xfo === "DENY" || xfo === "SAMEORIGIN") return "blocked";
		if (probe.frameAncestors !== void 0 && !probe.frameAncestors.some((source) => source === "*")) return "blocked";
		return "embeddable";
	}
	/** A loopback hostname (localhost, IPv6 ::1, 127.0.0.0/8, 0.0.0.0). */
	function isLoopbackHostname(hostname) {
		const host = hostname.replace(/^\[|\]$/g, "").toLowerCase();
		if (host === "localhost" || host === "::1" || host === "0.0.0.0") return true;
		const parts = host.split(".");
		return parts.length === 4 && parts[0] === "127" && parts.every((part) => /^\d{1,3}$/.test(part) && Number(part) <= 255);
	}
	/**
	* Schemes that must never reach the iframe, even without `//` (javascript:,
	* data:, file:, ...). Host:port lookalikes (example.com:8080) are NOT here —
	* they parse as hosts below.
	*/
	const FORBIDDEN_SCHEMES = /* @__PURE__ */ new Set([
		"javascript",
		"data",
		"file",
		"about",
		"vbscript",
		"blob",
		"mailto",
		"tel",
		"ftp",
		"ftps",
		"ws",
		"wss",
		"sftp",
		"ssh",
		"chrome",
		"chrome-extension",
		"moz-extension",
		"edge",
		"opera",
		"resource",
		"view-source"
	]);
	/**
	* Normalize one address-bar input against the navigation policy.
	* @param input - raw user text.
	* @param selfOrigin - the GUI's own origin (window.location.origin). The GUI
	* itself may be browsed in the sidebar (the sandbox keeps it opaque), so it
	* is let through BEFORE the loopback check — its host is normally loopback.
	*/
	function normalizeBrowserUrl(input, selfOrigin) {
		const trimmed = input.trim();
		if (trimmed === "") return { kind: "invalid" };
		const schemeMatch = /^([a-zA-Z][a-zA-Z0-9+.-]*):/.exec(trimmed);
		let withScheme;
		if (schemeMatch === null) withScheme = `https://${trimmed}`;
		else {
			const scheme = schemeMatch[1].toLowerCase();
			if (scheme === "http" || scheme === "https") withScheme = trimmed;
			else if (FORBIDDEN_SCHEMES.has(scheme)) return {
				kind: "blocked",
				reason: "scheme"
			};
			else withScheme = `https://${trimmed}`;
		}
		let url;
		try {
			url = new URL(withScheme);
		} catch {
			return { kind: "invalid" };
		}
		if (url.protocol !== "http:" && url.protocol !== "https:") return {
			kind: "blocked",
			reason: "scheme"
		};
		try {
			if (url.origin === new URL(selfOrigin).origin) return {
				kind: "ok",
				url: url.href
			};
		} catch {}
		if (isLoopbackHostname(url.hostname)) return {
			kind: "blocked",
			reason: "loopback"
		};
		return {
			kind: "ok",
			url: url.href
		};
	}
	//#endregion
	//#region src/client/locales.ts
	const en = {
		tabTitle: "Terminal",
		terminal: "Terminal",
		loading: "Loading…",
		disconnected: "Disconnected. Reconnecting…",
		terminalError: "Terminal error",
		terminalRetry: "Retry",
		terminalConnectFailed: "Could not connect to the terminal",
		terminalDepsFailed: "Native PTY unavailable",
		terminalDepsHint: "The Rust PTY native module failed to load. Run the repair command where your DSH profile lives, then retry:",
		terminalDepsProfile: " (profile: {profile})",
		copy: "Copy",
		copied: "Copied",
		standaloneToggle: "Toggle terminal",
		close: "Close",
		newTab: "New tab",
		newPane: "New page",
		newPaneHeading: "Start a new page",
		newPaneSubheading: "Pick a tool to open in this pane",
		cardTerminalDesc: "Run commands in an embedded terminal",
		cardExplorerDesc: "Browse and open files in the workspace",
		cardNotesDesc: "Write and keep scratch notes",
		cardBrowserDesc: "Open a web page in a preview browser",
		cardLayoutLabel: "Layout",
		layoutHorizontal: "Side by side (horizontal split)",
		layoutVertical: "Stacked (vertical split)",
		closePane: "Close pane",
		searchTabTitle: "Search",
		searchPlaceholder: "Search",
		searchNoResults: "No results",
		searchNoQuery: "Type to search file contents",
		searchResultsSummary: "{matches} results in {files} files",
		searchTruncated: " (showing the first {matches})",
		searchDepsFailed: "ripgrep unavailable",
		searchDepsHint: "ripgrep could not be located. Run the repair command where your DSH profile lives, then retry:",
		calendarTabTitle: "Calendar",
		calendarDepsFailed: "SQLite unavailable",
		calendarDepsHint: "The Rust SQLite native module failed to load. Run the repair command where your DSH profile lives, then retry:",
		calendarNewEvent: "New event",
		calendarNewEventPrompt: "Event title:",
		calendarUntitledEvent: "Untitled event",
		calendarDeleteConfirm: "Delete \"{title}\"?",
		searchMatchCase: "Match Case",
		searchWholeWord: "Match Whole Word",
		searchUseRegex: "Use Regular Expression",
		collapse: "Collapse sidebar",
		expand: "Expand sidebar",
		collapseBottom: "Collapse bottom panel",
		expandBottom: "Expand bottom panel",
		standaloneNoSession: "No active session. Open a conversation to use the terminal.",
		settingsFontFamilyTitle: "Font family",
		settingsFontFamilyDesc: "Custom font for the terminal (empty = theme code font)",
		settingsFontFamilyPlaceholder: "e.g. \"JetBrains Mono\", monospace",
		settingsFontSizeTitle: "Font size",
		settingsFontSizeDesc: "Terminal font size in pixels",
		settingsBackendTitle: "PTY backend",
		settingsBackendDesc: "own = the Rust /powerdesk/ws/terminal; better-sidebar = reuse dsh-better-sidebar's terminal backend",
		settingsThemeTitle: "Theme",
		settingsThemeDesc: "Builtin restty theme name (empty = follow the app scheme)",
		browser: "Browser",
		browserTabTitle: "Browser",
		browserPlaceholder: "Enter a URL, e.g. example.com",
		browserGo: "Go",
		browserBack: "Back",
		browserForward: "Forward",
		refresh: "Refresh",
		browserStart: "Enter a URL to start browsing (sandbox mode)",
		browserChecking: "Checking if this site can be embedded…",
		browserBlockedScheme: "Blocked: only http/https URLs are allowed",
		browserBlockedLoopback: "Blocked: local and internal addresses cannot be browsed here",
		browserInvalid: "Invalid URL",
		browserOpenExternal: "Open in browser",
		browserNoSandboxWarning: "Sandbox off: the current page runs with full GUI privileges (re-enable in settings)",
		browserEmbedBlocked: "{host} refused to be embedded",
		browserEmbedBlockedDesc: "This site forbids being displayed inside other pages (X-Frame-Options / frame-ancestors), so it cannot load in the sidebar. Open it in your browser instead.",
		browserEmbedAnyway: "Load anyway",
		sandboxStatusOn: "Sandbox on: pages cannot access the GUI's data or local files; logins and third-party cookies may not work",
		sandboxUnlock: "Unlock (unsafe)",
		sandboxRestore: "Restore sandbox",
		standaloneToggleBrowser: "Toggle browser",
		standaloneSurfaceTerminal: "Terminal",
		standaloneSurfaceBrowser: "Browser",
		settingsNav: "Powerdesk",
		settingsIntro: "A GPU-accelerated terminal and a sandboxed browser for DSH, surfaced as tabs in the Powerdesk sidebar.",
		settingsOpenTerminal: "Open Terminal",
		settingsOpenBrowser: "Open Browser",
		settingsSidebarMissing: "The Powerdesk sidebar is available via the toggle at the top-right corner of the window.",
		settingsOpenedHint: "Opened in the sidebar.",
		settingsEnableTab: "Enable this tab",
		settingsDisableTab: "Disable this tab",
		extHeading: "Extensions",
		extIntro: "Install your own React components as sidebar tabs. Upload a .tgz containing powerdesk.json and bundle.js, or a single bundle script.",
		extDisabled: "Extensions are turned off. Set \"extensionsEnabled\": true in the dsh-powerdesk plugin config to enable them.",
		extStaleHost: "The running DSH server does not have the extensions API. Its host half predates this feature — restart DSH (the client half updates on refresh, but the server keeps the old code in memory until it restarts).",
		extUnreachable: "Could not reach the extensions API: {error}",
		extWarning: "An extension runs with the same privileges as this page — full access to the DOM, your session, and the network. Only install extensions you trust.",
		extEmpty: "No extensions installed yet.",
		extUpload: "Upload extension…",
		extInstalling: "Installing…",
		extRemove: "Remove",
		extRemoveConfirm: "Remove this extension? Its files are deleted from disk.",
		extReload: "Reload",
		extBroken: "Failed to load",
		extInstalled: "Installed {when}",
		extSource: "from {file}",
		extDir: "Location",
		extIdLabel: "Extension id",
		extIdPlaceholder: "my-extension",
		extTitleLabel: "Display name",
		extTitlePlaceholder: "My Extension",
		extBareHint: "This file is a single script with no powerdesk.json. Give it an id and a name.",
		extConfirmInstall: "Install",
		extCancel: "Cancel",
		extInstalledOk: "Installed \"{title}\". Open it from the sidebar + menu.",
		appearanceHeading: "Appearance",
		appearanceIntro: "Pick a font, weight, size, and themes for the terminal and the code editor. Terminal changes apply immediately to any open terminal (a brief reconnect, same session); the editor theme applies to any open editor.",
		appearanceFontFamily: "Font",
		appearanceFontFamilyAuto: "System default",
		appearanceFontFamilyManual: "Type a font name…",
		appearanceFontsLoading: "Loading fonts…",
		appearanceFontWeight: "Weight",
		appearanceFontSize: "Size",
		appearanceTheme: "Terminal theme",
		appearanceEditorTheme: "Codemirror theme",
		appearanceFontHint: "Lists your installed system fonts (incl. Nerd Fonts). On browsers without the Local Font Access API (Firefox/Safari), type the family name instead.",
		appearanceThemeHint: "“System default” follows light/dark.",
		themeAuto: "System default",
		themeTokyoNight: "Tokyo Night",
		themeTokyoNightStorm: "Tokyo Night Storm",
		themeTokyoNightMoon: "Tokyo Night Moon",
		themeDracula: "Dracula",
		themeDraculaPlus: "Dracula+",
		themeHighContrast: "High contrast",
		themeNord: "Nord",
		themeGruvbox: "Gruvbox",
		themeCatppuccinMocha: "Catppuccin Mocha",
		themeGithubDark: "GitHub Dark",
		themeGithubLight: "GitHub Light",
		themeOneDark: "One Dark",
		themeSolarizedDark: "Solarized Dark",
		themeSolarizedLight: "Solarized Light",
		themeRosePine: "Rosé Pine",
		explorerTabTitle: "Explorer",
		explorerAddFolder: "Add folder",
		explorerRemoveFolder: "Remove",
		explorerEmptyDir: "Empty folder",
		explorerCopyRelative: "Copy relative path",
		explorerCopyAbsolute: "Copy absolute path",
		explorerCopied: "Copied",
		editorTabTitle: "Editor",
		editorUnsaved: "Unsaved",
		notesTabTitle: "Notes",
		notesBindPrompt: "Bind a local folder to browse and edit its markdown notes.",
		notesBindButton: "Bind folder",
		notesRebindHint: "{folder} — click to choose a different folder",
		notesNewNote: "New note",
		notesNewFolder: "New folder",
		notesNewNotePrompt: "Note name (.md added automatically)",
		notesNewFolderPrompt: "Folder name",
		notesRenamePrompt: "New name",
		notesRename: "Rename",
		notesDelete: "Delete",
		notesDeleteConfirm: "Delete \"{name}\"? This cannot be undone.",
		notesEmptyFolder: "No markdown files in this folder yet — create one with \"New note\".",
		notesSelectFile: "Select a note to view or edit it.",
		cancel: "Cancel",
		folderPickerTitle: "Choose a folder",
		folderPickerSelect: "Select this folder",
		folderPickerUp: "Up",
		folderPickerEmpty: "No subfolders here"
	};
	const dicts = {
		en,
		zh: {
			tabTitle: "终端",
			terminal: "终端",
			loading: "加载中…",
			disconnected: "已断开，正在重连…",
			terminalError: "终端错误",
			terminalRetry: "重试",
			terminalConnectFailed: "无法连接到终端",
			terminalDepsFailed: "原生 PTY 不可用",
			terminalDepsHint: "Rust PTY 原生模块加载失败。请在 DSH profile 所在环境运行修复命令，然后重试：",
			terminalDepsProfile: "（profile：{profile}）",
			copy: "复制",
			copied: "已复制",
			standaloneToggle: "切换终端",
			close: "关闭",
			newTab: "新建标签页",
			newPane: "新建页面",
			newPaneHeading: "开启新页面",
			newPaneSubheading: "选择要在该面板打开的工具",
			cardTerminalDesc: "在嵌入式终端中运行命令",
			cardExplorerDesc: "浏览并打开工作区文件",
			cardNotesDesc: "撰写和保存随手笔记",
			cardBrowserDesc: "在预览浏览器中打开网页",
			cardLayoutLabel: "布局",
			layoutHorizontal: "并排显示（水平分割）",
			layoutVertical: "上下堆叠（垂直分割）",
			closePane: "关闭面板",
			searchTabTitle: "搜索",
			searchPlaceholder: "搜索",
			searchNoResults: "无结果",
			searchNoQuery: "输入以搜索文件内容",
			searchResultsSummary: "在 {files} 个文件中找到 {matches} 处结果",
			searchTruncated: "（仅显示前 {matches} 处）",
			searchDepsFailed: "ripgrep 不可用",
			searchDepsHint: "未能找到 ripgrep。请在 DSH profile 所在环境运行修复命令，然后重试：",
			calendarTabTitle: "日历",
			calendarDepsFailed: "SQLite 不可用",
			calendarDepsHint: "Rust SQLite 原生模块加载失败。请在 DSH profile 所在环境运行修复命令，然后重试：",
			calendarNewEvent: "新建事件",
			calendarNewEventPrompt: "事件标题：",
			calendarUntitledEvent: "未命名事件",
			calendarDeleteConfirm: "删除「{title}」？",
			searchMatchCase: "区分大小写",
			searchWholeWord: "全字匹配",
			searchUseRegex: "使用正则表达式",
			collapse: "收起侧边栏",
			expand: "展开侧边栏",
			collapseBottom: "收起底部面板",
			expandBottom: "展开底部面板",
			standaloneNoSession: "没有活动会话。请先打开一个对话再使用终端。",
			settingsFontFamilyTitle: "字体",
			settingsFontFamilyDesc: "终端自定义字体（留空 = 主题代码字体）",
			settingsFontFamilyPlaceholder: "例如 \"JetBrains Mono\", monospace",
			settingsFontSizeTitle: "字号",
			settingsFontSizeDesc: "终端字号（像素）",
			settingsBackendTitle: "PTY 后端",
			settingsBackendDesc: "own = Rust /powerdesk/ws/terminal；better-sidebar = 复用 dsh-better-sidebar 终端后端",
			settingsThemeTitle: "主题",
			settingsThemeDesc: "内置 restty 主题名（留空 = 跟随应用明暗）",
			browser: "浏览器",
			browserTabTitle: "浏览器",
			browserPlaceholder: "输入网址，例如 example.com",
			browserGo: "前往",
			browserBack: "后退",
			browserForward: "前进",
			refresh: "刷新",
			browserStart: "输入网址开始浏览（沙箱模式）",
			browserChecking: "正在检查该站点是否可嵌入…",
			browserBlockedScheme: "已阻止：仅支持 http/https 链接",
			browserBlockedLoopback: "已阻止：不允许在浏览器中访问本机或内部地址",
			browserInvalid: "无效的网址",
			browserOpenExternal: "在浏览器中打开",
			browserNoSandboxWarning: "沙箱已关闭：当前页面与界面同源，拥有完整会话权限（可在设置中恢复）",
			browserEmbedBlocked: "{host} 拒绝了嵌入请求",
			browserEmbedBlockedDesc: "该站点通过 X-Frame-Options / frame-ancestors 禁止在其它页面中显示，无法在侧边栏内加载。可在浏览器中直接打开",
			browserEmbedAnyway: "仍然加载",
			sandboxStatusOn: "沙箱模式：已启用 · 页面无法访问界面数据与本地文件，登录态与第三方 Cookie 可能不可用",
			sandboxUnlock: "临时解锁（不安全）",
			sandboxRestore: "恢复沙箱",
			standaloneToggleBrowser: "切换浏览器",
			standaloneSurfaceTerminal: "终端",
			standaloneSurfaceBrowser: "浏览器",
			settingsNav: "Powerdesk",
			settingsIntro: "面向 DSH 的 GPU 加速终端与沙箱浏览器，以标签页形式在 Powerdesk 侧边栏中打开。",
			settingsOpenTerminal: "打开终端",
			settingsOpenBrowser: "打开浏览器",
			settingsSidebarMissing: "Powerdesk 侧边栏可通过窗口右上角的切换按钮打开。",
			settingsOpenedHint: "已在侧边栏打开。",
			settingsEnableTab: "启用此标签页",
			settingsDisableTab: "禁用此标签页",
			extHeading: "扩展",
			extIntro: "将你自己的 React 组件安装为侧边栏标签页。上传包含 powerdesk.json 与 bundle.js 的 .tgz，或单个打包脚本。",
			extDisabled: "扩展功能已关闭。在 dsh-powerdesk 插件配置中设置 \"extensionsEnabled\": true 以启用。",
			extStaleHost: "当前运行的 DSH 服务没有扩展 API，其宿主端代码早于此功能——请重启 DSH（客户端会在刷新时更新，但服务端在重启前仍保留旧代码）。",
			extUnreachable: "无法访问扩展 API：{error}",
			extWarning: "扩展与本页面拥有相同权限——可完全访问 DOM、你的会话与网络。请只安装你信任的扩展。",
			extEmpty: "尚未安装任何扩展。",
			extUpload: "上传扩展…",
			extInstalling: "正在安装…",
			extRemove: "移除",
			extRemoveConfirm: "确定移除此扩展？其文件将从磁盘删除。",
			extReload: "重新加载",
			extBroken: "加载失败",
			extInstalled: "安装于 {when}",
			extSource: "来源 {file}",
			extDir: "位置",
			extIdLabel: "扩展 ID",
			extIdPlaceholder: "my-extension",
			extTitleLabel: "显示名称",
			extTitlePlaceholder: "我的扩展",
			extBareHint: "此文件是单个脚本，不含 powerdesk.json。请为其指定 ID 与名称。",
			extConfirmInstall: "安装",
			extCancel: "取消",
			extInstalledOk: "已安装“{title}”。可从侧边栏 + 菜单打开。",
			appearanceHeading: "外观",
			appearanceIntro: "选择终端与代码编辑器的字体、字重、字号与主题。终端更改会立即应用到已打开的终端（短暂重连，同一会话）；编辑器主题更改会立即应用到已打开的编辑器。",
			appearanceFontFamily: "字体",
			appearanceFontFamilyAuto: "系统默认",
			appearanceFontFamilyManual: "输入字体名…",
			appearanceFontsLoading: "正在加载字体…",
			appearanceFontWeight: "字重",
			appearanceFontSize: "字号",
			appearanceTheme: "终端主题",
			appearanceEditorTheme: "Codemirror 主题",
			appearanceFontHint: "列出你系统中已安装的字体（含 Nerd Fonts）。在不支持本地字体访问 API 的浏览器（Firefox/Safari）上，请改为手动输入字体名。",
			appearanceThemeHint: "“系统默认”跟随明暗模式。",
			themeAuto: "系统默认",
			themeTokyoNight: "Tokyo Night",
			themeTokyoNightStorm: "Tokyo Night Storm",
			themeTokyoNightMoon: "Tokyo Night Moon",
			themeDracula: "Dracula",
			themeDraculaPlus: "Dracula+",
			themeHighContrast: "高对比度",
			themeNord: "Nord",
			themeGruvbox: "Gruvbox",
			themeCatppuccinMocha: "Catppuccin Mocha",
			themeGithubDark: "GitHub Dark",
			themeGithubLight: "GitHub Light",
			themeOneDark: "One Dark",
			themeSolarizedDark: "Solarized Dark",
			themeSolarizedLight: "Solarized Light",
			themeRosePine: "Rosé Pine",
			explorerTabTitle: "文件",
			explorerAddFolder: "添加文件夹",
			explorerRemoveFolder: "移除",
			explorerEmptyDir: "空文件夹",
			explorerCopyRelative: "复制相对路径",
			explorerCopyAbsolute: "复制绝对路径",
			explorerCopied: "已复制",
			editorTabTitle: "编辑器",
			editorUnsaved: "未保存",
			notesTabTitle: "笔记",
			notesBindPrompt: "绑定一个本地文件夹，浏览和编辑其中的 markdown 笔记。",
			notesBindButton: "绑定文件夹",
			notesRebindHint: "{folder} — 点击选择其他文件夹",
			notesNewNote: "新建笔记",
			notesNewFolder: "新建文件夹",
			notesNewNotePrompt: "笔记名称（自动加 .md 后缀）",
			notesNewFolderPrompt: "文件夹名称",
			notesRenamePrompt: "新名称",
			notesRename: "重命名",
			notesDelete: "删除",
			notesDeleteConfirm: "删除 \"{name}\"？此操作不可撤销。",
			notesEmptyFolder: "此文件夹里还没有 markdown 文件——点\"新建笔记\"创建一个。",
			notesSelectFile: "选择一篇笔记查看或编辑。",
			cancel: "取消",
			folderPickerTitle: "选择文件夹",
			folderPickerSelect: "选择这个文件夹",
			folderPickerUp: "上一级",
			folderPickerEmpty: "没有子文件夹"
		}
	};
	/** The active locale ('en' by default; updated by {@link attachLocale}). */
	let activeLocale = "en";
	/** Resolve the active dictionary (falls back to English). */
	function activeDict() {
		return dicts[activeLocale] ?? en;
	}
	/** Translate one key, substituting `{param}` placeholders. */
	function t(key, params) {
		const raw = activeDict()[key] ?? en[key] ?? key;
		if (params === void 0) return raw;
		return raw.replace(/\{(\w+)\}/g, (_m, name) => params[name] ?? `{${name}}`);
	}
	//#endregion
	//#region \0dsh-css:/home/zteng/work/Tools/dsh-powerdesk/src/client/restty.module.css.mjs
	const css = ".i00wLG_terminalWrap{background:var(--dsw-alias-bg-base,#111114);flex-direction:column;width:100%;height:100%;min-height:0;display:flex;position:relative;overflow:hidden}.i00wLG_terminal{flex:auto;width:100%;height:100%;min-height:0}.i00wLG_terminalBanner,.i00wLG_terminalDepsBanner{z-index:5;text-align:center;color:var(--dsw-alias-label-primary,#e6e6e6);background:color-mix(in srgb, var(--dsw-alias-bg-base,#111114) 92%, transparent);backdrop-filter:blur(2px);flex-direction:column;justify-content:center;align-items:center;gap:10px;padding:18px 22px;font:13px/1.5 ui-monospace,SFMono-Regular,Menlo,monospace;display:flex;position:absolute;inset:0}.i00wLG_terminalBannerUrl{opacity:.7;word-break:break-all;font-size:11px}.i00wLG_terminalRetry{border:1px solid var(--dsw-alias-stroke-default,#444);background:var(--dsw-alias-bg-elevated,#1b1b22);color:var(--dsw-alias-label-primary,#e6e6e6);cursor:pointer;font:inherit;border-radius:8px;align-self:center;padding:6px 14px}.i00wLG_terminalRetry:hover{filter:brightness(1.1)}.i00wLG_terminalDepsTitle{font-size:14px;font-weight:600}.i00wLG_terminalDepsHint{opacity:.85;max-width:520px}.i00wLG_terminalDepsCommandRow{align-items:stretch;gap:8px;width:100%;max-width:640px;display:flex}.i00wLG_terminalRepairCommand{text-align:left;white-space:pre-wrap;word-break:break-all;border:1px solid var(--dsw-alias-stroke-default,#444);background:var(--dsw-alias-bg-elevated,#1b1b22);border-radius:8px;flex:auto;margin:0;padding:8px 10px;font-size:12px}.i00wLG_terminalDepsNote{opacity:.7;max-width:560px;font-size:12px}.i00wLG_terminalDepsActions{gap:8px;display:flex}.i00wLG_editorPlaceholder,.i00wLG_editorError{text-align:center;height:100%;color:var(--dsw-alias-label-secondary,#abb2bf);justify-content:center;align-items:center;gap:10px;padding:16px;font:13px/1.5 ui-monospace,SFMono-Regular,Menlo,monospace;display:flex}.i00wLG_editorError{color:var(--dsw-alias-label-primary,#e6e6e6);flex-direction:column}.i00wLG_standaloneToggle{z-index:2147483000;border:1px solid var(--dsw-alias-stroke-default,#444);background:var(--dsw-alias-bg-elevated,#1b1b22);color:var(--dsw-alias-label-primary,#e6e6e6);cursor:pointer;border-radius:999px;align-items:center;gap:6px;padding:8px 12px;font:12px/1 ui-monospace,SFMono-Regular,Menlo,monospace;display:inline-flex;position:fixed;bottom:14px;right:14px;box-shadow:0 4px 14px #00000059}.i00wLG_standaloneToggle:hover{filter:brightness(1.1)}.i00wLG_standaloneHost{z-index:2147483000;border:1px solid var(--dsw-alias-stroke-default,#444);background:var(--dsw-alias-bg-base,#111114);border-radius:12px;flex-direction:column;width:min(720px,92vw);height:min(440px,70vh);display:flex;position:fixed;bottom:56px;right:14px;overflow:hidden;box-shadow:0 10px 40px #00000073}.i00wLG_standaloneHeader{border-bottom:1px solid var(--dsw-alias-stroke-faint,#2a2a33);color:var(--dsw-alias-label-secondary,#abb2bf);justify-content:space-between;align-items:center;padding:6px 10px;font:11px/1 ui-monospace,SFMono-Regular,Menlo,monospace;display:flex}.i00wLG_standaloneNoSession{text-align:center;color:var(--dsw-alias-label-secondary,#abb2bf);padding:18px;font:13px/1.5 ui-monospace,SFMono-Regular,Menlo,monospace}.i00wLG_standaloneSurfaceSwitch{background:var(--dsw-alias-bg-elevated,#1b1b22);border-radius:6px;gap:2px;padding:2px;display:inline-flex}.i00wLG_standaloneSurfaceBtn,.i00wLG_standaloneSurfaceActive{cursor:pointer;color:var(--dsw-alias-label-secondary,#abb2bf);background:0 0;border:none;border-radius:4px;padding:2px 10px;font:11px/1 ui-monospace,SFMono-Regular,Menlo,monospace}.i00wLG_standaloneSurfaceActive{background:var(--dsw-alias-interactive-bg-hover,#ffffff1f);color:var(--dsw-alias-label-primary,#e6e6e6)}.i00wLG_browser{flex-direction:column;flex:1;min-height:0;display:flex}.i00wLG_browserBar{border-bottom:1px solid var(--dsw-alias-border-l1,#2a2a33);flex:none;align-items:center;gap:4px;padding:6px 8px;display:flex}.i00wLG_iconButton{width:28px;height:28px;color:var(--dsw-alias-label-secondary,#abb2bf);cursor:pointer;background:0 0;border:none;border-radius:6px;flex:none;justify-content:center;align-items:center;display:inline-flex}.i00wLG_iconButton:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover,#ffffff14);color:var(--dsw-alias-label-primary,#e6e6e6)}.i00wLG_iconButton:disabled{opacity:.4;cursor:default}.i00wLG_browserInput{border:1px solid var(--dsw-alias-border-l1,#2a2a33);background:var(--dsw-alias-bg-layer-1,#1b1b22);min-width:0;height:28px;color:var(--dsw-alias-label-primary,#e6e6e6);border-radius:6px;flex:1;padding:0 10px;font:12px/1 ui-monospace,SFMono-Regular,Menlo,monospace}.i00wLG_browserInput:focus{border-color:var(--dsw-alias-border-l2,#444);outline:none}.i00wLG_browserMessage{color:var(--dsw-alias-state-warn-label,#c8a951);background:var(--dsw-alias-state-warn-tertiary,#c8a9511a);flex:none;padding:4px 12px;font-size:11px}.i00wLG_browserFrame{background:var(--dsw-alias-bg-base,#111114);border:none;flex:1;width:100%;min-height:0}.i00wLG_browserStart{text-align:center;min-height:0;color:var(--dsw-alias-label-tertiary,#848891);flex:1;justify-content:center;align-items:center;padding:20px;font:13px/1.5 ui-monospace,SFMono-Regular,Menlo,monospace;display:flex}.i00wLG_browserBlocked{text-align:center;min-height:0;color:var(--dsw-alias-state-warn-primary,#c8a951);flex-direction:column;flex:1;justify-content:center;align-items:center;gap:6px;padding:24px;display:flex}.i00wLG_browserBlockedTitle{color:var(--dsw-alias-label-primary,#e6e6e6);font-size:12px;font-weight:600}.i00wLG_browserBlockedDesc{max-width:280px;color:var(--dsw-alias-label-secondary,#abb2bf);font-size:11px}.i00wLG_browserBlockedActions{gap:8px;margin-top:6px;display:flex}.i00wLG_browserBlockedButton{border:1px solid var(--dsw-alias-border-l2,#444);background:var(--dsw-alias-bg-layer-1,#1b1b22);color:var(--dsw-alias-label-primary,#e6e6e6);cursor:pointer;border-radius:6px;padding:4px 12px;font-size:11px}.i00wLG_browserBlockedButton:hover{background:var(--dsw-alias-interactive-bg-hover,#ffffff14)}.i00wLG_sandboxStatus{border-bottom:1px solid var(--dsw-alias-border-l1,#2a2a33);flex:none;align-items:center;gap:6px;padding:4px 10px;font-size:11px;display:flex}.i00wLG_sandboxStatusOn{color:var(--dsw-alias-state-success-label,#4eaa6e)}.i00wLG_sandboxStatusOff{color:var(--dsw-alias-state-warn-label,#c8a951);background:var(--dsw-alias-state-warn-tertiary,#c8a95114)}.i00wLG_sandboxDot{background:currentColor;border-radius:50%;flex:none;width:8px;height:8px}.i00wLG_sandboxStatusText{text-overflow:ellipsis;white-space:nowrap;flex:1;min-width:0;overflow:hidden}.i00wLG_sandboxAction{color:inherit;cursor:pointer;background:0 0;border:1px solid;border-radius:4px;flex:none;padding:2px 8px;font-size:11px}.i00wLG_sandboxAction:hover{opacity:.8}";
	const tagId = "dsh-powerdesk/restty.module.css";
	if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") === null) {
		const tag = document.createElement("style");
		tag.dataset.plugin = "dsh-powerdesk";
		tag.dataset.pluginCss = tagId;
		tag.textContent = css;
		document.head.appendChild(tag);
	}
	var restty_module_css_default = {
		"terminalDepsBanner": "i00wLG_terminalDepsBanner",
		"standaloneSurfaceBtn": "i00wLG_standaloneSurfaceBtn",
		"editorPlaceholder": "i00wLG_editorPlaceholder",
		"standaloneHost": "i00wLG_standaloneHost",
		"browserMessage": "i00wLG_browserMessage",
		"sandboxStatusOn": "i00wLG_sandboxStatusOn",
		"browserBlockedDesc": "i00wLG_browserBlockedDesc",
		"browserStart": "i00wLG_browserStart",
		"sandboxStatus": "i00wLG_sandboxStatus",
		"terminalRepairCommand": "i00wLG_terminalRepairCommand",
		"browserBar": "i00wLG_browserBar",
		"browser": "i00wLG_browser",
		"browserBlockedTitle": "i00wLG_browserBlockedTitle",
		"terminalDepsHint": "i00wLG_terminalDepsHint",
		"terminalDepsCommandRow": "i00wLG_terminalDepsCommandRow",
		"terminalBanner": "i00wLG_terminalBanner",
		"terminalDepsActions": "i00wLG_terminalDepsActions",
		"standaloneSurfaceActive": "i00wLG_standaloneSurfaceActive",
		"browserInput": "i00wLG_browserInput",
		"standaloneNoSession": "i00wLG_standaloneNoSession",
		"standaloneSurfaceSwitch": "i00wLG_standaloneSurfaceSwitch",
		"standaloneToggle": "i00wLG_standaloneToggle",
		"terminalDepsNote": "i00wLG_terminalDepsNote",
		"browserBlocked": "i00wLG_browserBlocked",
		"terminal": "i00wLG_terminal",
		"terminalRetry": "i00wLG_terminalRetry",
		"editorError": "i00wLG_editorError",
		"standaloneHeader": "i00wLG_standaloneHeader",
		"browserBlockedActions": "i00wLG_browserBlockedActions",
		"terminalBannerUrl": "i00wLG_terminalBannerUrl",
		"sandboxAction": "i00wLG_sandboxAction",
		"browserFrame": "i00wLG_browserFrame",
		"iconButton": "i00wLG_iconButton",
		"sandboxStatusText": "i00wLG_sandboxStatusText",
		"terminalDepsTitle": "i00wLG_terminalDepsTitle",
		"sandboxStatusOff": "i00wLG_sandboxStatusOff",
		"terminalWrap": "i00wLG_terminalWrap",
		"browserBlockedButton": "i00wLG_browserBlockedButton",
		"sandboxDot": "i00wLG_sandboxDot"
	};
	//#endregion
	//#region src/client/BrowserView.tsx
	/**
	* The built-in browser tab: an address bar plus a sandboxed iframe.
	*
	* Security model (see browser.ts + the sandbox tokens below): the iframe is
	* ALWAYS sandboxed without `allow-same-origin` (opaque origin — the visited
	* page can never sit on the GUI's origin, read its storage, or reach
	* /powerdesk/api) and without `allow-top-navigation` (a page must not hijack
	* the GUI). The address bar only accepts http(s) and refuses loopback. A
	* temporary sandbox unlock drops the sandbox attribute for fully trusted
	* sites; a persistent warning bar renders while it is off.
	*
	* The back/forward stack only tracks address-bar navigations (in-frame link
	* clicks are cross-origin and invisible — a documented limitation).
	*
	* When a site refuses to be embedded (X-Frame-Options / frame-ancestors),
	* the host's `browser.probe` route detects it and the view shows the reason
	* + open-in-browser instead of the browser's cryptic "refused to connect"
	* blank frame.
	*
	* Adapted from dsh-better-sidebar's BrowserView (BSD-3-Clause).
	*/
	/**
	* The browser iframe sandbox tokens. NO allow-same-origin (opaque origin —
	* no GUI storage/API access), NO allow-top-navigation (a browsed page must
	* not hijack the GUI). allow-forms/allow-popups/allow-downloads/allow-modals
	* keep login flows working; allow-popups-to-escape-sandbox lets OAuth
	* popups open as normal tabs (they are cross-origin to the GUI either way).
	*/
	const BROWSER_IFRAME_SANDBOX = "allow-scripts allow-forms allow-popups allow-downloads allow-modals allow-popups-to-escape-sandbox";
	function BrowserView(props) {
		const { initialUrl, visible = true } = props;
		const [url, setUrl] = (0, react.useState)(initialUrl);
		const [input, setInput] = (0, react.useState)(initialUrl ?? "");
		/** Blocked/invalid hint shown under the address bar (null = none). */
		const [message, setMessage] = (0, react.useState)(null);
		/** Address-bar navigation history (in-frame clicks are not tracked). */
		const [history, setHistory] = (0, react.useState)(initialUrl !== void 0 ? [initialUrl] : []);
		const [cursor, setCursor] = (0, react.useState)(initialUrl !== void 0 ? 0 : -1);
		/** Bumped on reload to remount the iframe (also remounts on sandbox flip). */
		const [reloadKey, setReloadKey] = (0, react.useState)(0);
		/** Whether the embeddability probe is in-flight for the current url. While
		*  true the iframe is NOT mounted (its src is withheld) so a frame-refusing
		*  site never triggers the browser's native "refused to connect" before the
		*  probe verdict swaps in the reason panel. */
		const [probing, setProbing] = (0, react.useState)(false);
		/** TEMPORARY sandbox unlock for THIS surface only (never persists). */
		const [localUnlock, setLocalUnlock] = (0, react.useState)(false);
		const noSandbox = localUnlock;
		/** A site that refuses to be embedded (X-Frame-Options / frame-ancestors):
		*  the probe verdict shown instead of the blank iframe. */
		const [embedBlocked, setEmbedBlocked] = (0, react.useState)(null);
		/** The user asked to load the refused site anyway (keeps the plain iframe). */
		const [forceEmbed, setForceEmbed] = (0, react.useState)(false);
		(0, react.useEffect)(() => {
			if (url === void 0 || !visible) return;
			let cancelled = false;
			setEmbedBlocked(null);
			setForceEmbed(false);
			setProbing(true);
			api.browserProbe(url).then((probe) => {
				if (cancelled) return;
				setProbing(false);
				if (embeddabilityOf(probe) === "blocked") setEmbedBlocked(url);
			}).catch(() => {
				if (!cancelled) setProbing(false);
			});
			return () => {
				cancelled = true;
			};
		}, [url, visible]);
		const navigateTo = (raw) => {
			const result = normalizeBrowserUrl(raw, window.location.origin);
			if (result.kind === "ok") {
				const next = result.url;
				setUrl(next);
				setInput(next);
				setMessage(null);
				setHistory((previous) => [...previous.slice(0, cursor + 1), next]);
				setCursor((previous) => previous + 1);
				setReloadKey((key) => key + 1);
				return;
			}
			setMessage(result.kind === "invalid" ? t("browserInvalid") : result.reason === "scheme" ? t("browserBlockedScheme") : t("browserBlockedLoopback"));
		};
		const goBack = () => {
			if (cursor <= 0) return;
			const next = history[cursor - 1];
			if (next === void 0) return;
			setCursor(cursor - 1);
			setUrl(next);
			setInput(next);
			setReloadKey((key) => key + 1);
		};
		const goForward = () => {
			if (cursor >= history.length - 1) return;
			const next = history[cursor + 1];
			if (next === void 0) return;
			setCursor(cursor + 1);
			setUrl(next);
			setInput(next);
			setReloadKey((key) => key + 1);
		};
		return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
			className: restty_module_css_default.browser,
			children: [
				/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: restty_module_css_default.browserBar,
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							className: restty_module_css_default.iconButton,
							"aria-label": t("browserBack"),
							title: t("browserBack"),
							disabled: cursor <= 0,
							onClick: goBack,
							children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("svg", {
								width: "14",
								height: "14",
								viewBox: "0 0 16 16",
								fill: "none",
								"aria-hidden": "true",
								children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
									d: "M10 12L6 8l4-4",
									stroke: "currentColor",
									strokeWidth: "1.5",
									strokeLinecap: "round",
									strokeLinejoin: "round"
								})
							})
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							className: restty_module_css_default.iconButton,
							"aria-label": t("browserForward"),
							title: t("browserForward"),
							disabled: cursor >= history.length - 1,
							onClick: goForward,
							children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("svg", {
								width: "14",
								height: "14",
								viewBox: "0 0 16 16",
								fill: "none",
								"aria-hidden": "true",
								children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
									d: "M6 4l4 4-4 4",
									stroke: "currentColor",
									strokeWidth: "1.5",
									strokeLinecap: "round",
									strokeLinejoin: "round"
								})
							})
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							className: restty_module_css_default.iconButton,
							"aria-label": t("refresh"),
							title: t("refresh"),
							onClick: () => {
								setReloadKey((key) => key + 1);
							},
							children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("svg", {
								width: "14",
								height: "14",
								viewBox: "0 0 16 16",
								fill: "none",
								"aria-hidden": "true",
								children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
									d: "M13.5 8a5.5 5.5 0 1 1-1.6-3.9M13.5 2v3h-3",
									stroke: "currentColor",
									strokeWidth: "1.5",
									strokeLinecap: "round",
									strokeLinejoin: "round"
								})
							})
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
							className: restty_module_css_default.browserInput,
							value: input,
							placeholder: t("browserPlaceholder"),
							spellCheck: false,
							onChange: (event) => {
								setInput(event.target.value);
							},
							onKeyDown: (event) => {
								if (event.key === "Enter") navigateTo(input);
							}
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							className: restty_module_css_default.iconButton,
							"aria-label": t("browserGo"),
							title: t("browserGo"),
							onClick: () => {
								navigateTo(input);
							},
							children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("svg", {
								width: "14",
								height: "14",
								viewBox: "0 0 16 16",
								fill: "none",
								"aria-hidden": "true",
								children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
									d: "M6 8h5.5M9 5.5L11.5 8 9 10.5",
									stroke: "currentColor",
									strokeWidth: "1.5",
									strokeLinecap: "round",
									strokeLinejoin: "round"
								})
							})
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							className: restty_module_css_default.iconButton,
							"aria-label": t("browserOpenExternal"),
							title: t("browserOpenExternal"),
							disabled: url === void 0,
							onClick: () => {
								if (url !== void 0) window.open(url, "_blank", "noopener");
							},
							children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("svg", {
								width: "15",
								height: "15",
								viewBox: "0 0 16 16",
								fill: "none",
								"aria-hidden": "true",
								children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
									d: "M6 3H3v10h10v-3M9 3h4v4M13 3L7 9",
									stroke: "currentColor",
									strokeWidth: "1.5",
									strokeLinecap: "round",
									strokeLinejoin: "round"
								})
							})
						})
					]
				}),
				message !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: restty_module_css_default.browserMessage,
					children: message
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)(SandboxStatusBar, {
					sandboxed: !noSandbox,
					local: localUnlock,
					dangerCopy: t("browserNoSandboxWarning"),
					onUnlock: () => {
						setLocalUnlock(true);
					},
					onRestore: () => {
						setLocalUnlock(false);
					}
				}),
				url === void 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: restty_module_css_default.browserStart,
					children: t("browserStart")
				}) : embedBlocked !== null && !forceEmbed ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(BrowserEmbedBlocked, {
					url: embedBlocked,
					onOpenInBrowser: () => {
						window.open(embedBlocked, "_blank", "noopener");
					},
					onLoadAnyway: () => {
						setForceEmbed(true);
					}
				}) : probing ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: restty_module_css_default.browserStart,
					children: t("browserChecking")
				}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("iframe", {
					className: restty_module_css_default.browserFrame,
					src: url,
					sandbox: noSandbox ? void 0 : BROWSER_IFRAME_SANDBOX,
					referrerPolicy: "no-referrer",
					allow: "",
					title: url
				}, `${reloadKey}:${noSandbox ? "ns" : "sb"}`)
			]
		});
	}
	/**
	* The embed-refusal panel: shown when the probed site forbids being
	* displayed inside other pages (X-Frame-Options / frame-ancestors) — the
	* iframe would only show the browser's "refused to connect" blank. Explains
	* the reason and offers the real-browser open plus a load-anyway escape.
	* Exported so the copy and the actions are testable without a DOM.
	*/
	function BrowserEmbedBlocked(props) {
		const { url, onOpenInBrowser, onLoadAnyway } = props;
		let host = url;
		try {
			host = new URL(url).hostname;
		} catch {}
		return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
			className: restty_module_css_default.browserBlocked,
			children: [
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("svg", {
					width: "16",
					height: "16",
					viewBox: "0 0 16 16",
					fill: "none",
					"aria-hidden": "true",
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
						d: "M8 2a6 6 0 1 0 0 12 6 6 0 0 0 0-12zM8 5v3M8 10.5v.5",
						stroke: "currentColor",
						strokeWidth: "1.5",
						strokeLinecap: "round"
					})
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: restty_module_css_default.browserBlockedTitle,
					children: t("browserEmbedBlocked", { host })
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: restty_module_css_default.browserBlockedDesc,
					children: t("browserEmbedBlockedDesc")
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: restty_module_css_default.browserBlockedActions,
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
						type: "button",
						className: restty_module_css_default.browserBlockedButton,
						onClick: onOpenInBrowser,
						children: t("browserOpenExternal")
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
						type: "button",
						className: restty_module_css_default.browserBlockedButton,
						onClick: onLoadAnyway,
						children: t("browserEmbedAnyway")
					})]
				})
			]
		});
	}
	/**
	* The live sandbox status row: a green "sandbox on" state with a one-tap
	* TEMPORARY unlock, or a RED "sandbox off" state with a restore action.
	* The temporary unlock is component state only — it never persists; it
	* lasts until the surface unmounts or the user restores the sandbox.
	*/
	function SandboxStatusBar(props) {
		const { sandboxed, local, dangerCopy, onUnlock, onRestore } = props;
		if (sandboxed) return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
			className: `${restty_module_css_default.sandboxStatus} ${restty_module_css_default.sandboxStatusOn}`,
			children: [
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { className: restty_module_css_default.sandboxDot }),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					className: restty_module_css_default.sandboxStatusText,
					title: t("sandboxStatusOn"),
					children: t("sandboxStatusOn")
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
					type: "button",
					className: restty_module_css_default.sandboxAction,
					onClick: onUnlock,
					children: t("sandboxUnlock")
				})
			]
		});
		return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
			className: `${restty_module_css_default.sandboxStatus} ${restty_module_css_default.sandboxStatusOff}`,
			children: [
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { className: restty_module_css_default.sandboxDot }),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					className: restty_module_css_default.sandboxStatusText,
					title: dangerCopy,
					children: dangerCopy
				}),
				local && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
					type: "button",
					className: restty_module_css_default.sandboxAction,
					onClick: onRestore,
					children: t("sandboxRestore")
				})
			]
		});
	}
	//#endregion
	exports.BrowserView = BrowserView;
	return module.exports;
};

//# sourceMappingURL=client-browser.js.map