/**
 * Minimal i18n for the restty terminal surface. The plugin follows the DSH
 * i18n system: {@link attachLocale} subscribes to the locale service so the
 * module-level {@link t} resolves the Host-backed language preference, and
 * the dictionaries register into the service's namespace registry under
 * `powerdesk`. The lazy chunk (src/client/chunks/terminal.tsx) imports
 * `t` only — it reads the module-level locale, never the cordis service, so
 * the chunk stays cordis-coupling-free.
 */
import type { ResttyLocaleService } from '../context-types.ts'

/** The locale namespace this plugin registers its dictionaries under. */
export const LOCALE_NS = 'powerdesk'

type Dict = Record<string, string>

const en: Dict = {
  tabTitle: 'Terminal',
  terminal: 'Terminal',
  loading: 'Loading…',
  disconnected: 'Disconnected. Reconnecting…',
  terminalError: 'Terminal error',
  terminalRetry: 'Retry',
  terminalConnectFailed: 'Could not connect to the terminal',
  terminalDepsFailed: 'Native PTY unavailable',
  terminalDepsHint: 'The Rust PTY native module failed to load. Run the repair command where your DSH profile lives, then retry:',
  terminalDepsProfile: ' (profile: {profile})',
  copy: 'Copy',
  copied: 'Copied',
  standaloneToggle: 'Toggle terminal',
  // Sidebar shell (layout + wrapper)
  close: 'Close',
  newTab: 'New tab',
  newPane: 'New page',
  newPaneHeading: 'Start a new page',
  newPaneSubheading: 'Pick a tool to open in this pane',
  cardTerminalDesc: 'Run commands in an embedded terminal',
  cardExplorerDesc: 'Browse and open files in the workspace',
  cardNotesDesc: 'Write and keep scratch notes',
  cardBrowserDesc: 'Open a web page in a preview browser',
  cardSearchDesc: 'Search file contents across the workspace',
  cardLayoutLabel: 'Layout',
  layoutHorizontal: 'Side by side (horizontal split)',
  layoutVertical: 'Stacked (vertical split)',
  closePane: 'Close pane',
  searchTabTitle: 'Search',
  searchPlaceholder: 'Search',
  searchNoResults: 'No results',
  searchNoQuery: 'Type to search file contents',
  searchResultsSummary: '{matches} results in {files} files',
  searchTruncated: ' (showing the first {matches})',
  searchDepsFailed: 'ripgrep unavailable',
  searchDepsHint: 'ripgrep could not be located. Run the repair command where your DSH profile lives, then retry:',
  collapse: 'Collapse sidebar',
  expand: 'Expand sidebar',
  collapseBottom: 'Collapse bottom panel',
  expandBottom: 'Expand bottom panel',
  standaloneNoSession: 'No active session. Open a conversation to use the terminal.',
  settingsFontFamilyTitle: 'Font family',
  settingsFontFamilyDesc: 'Custom font for the terminal (empty = theme code font)',
  settingsFontFamilyPlaceholder: 'e.g. "JetBrains Mono", monospace',
  settingsFontSizeTitle: 'Font size',
  settingsFontSizeDesc: 'Terminal font size in pixels',
  settingsBackendTitle: 'PTY backend',
  settingsBackendDesc: 'own = the Rust /powerdesk/ws/terminal; better-sidebar = reuse dsh-better-sidebar\'s terminal backend',
  settingsThemeTitle: 'Theme',
  settingsThemeDesc: 'Builtin restty theme name (empty = follow the app scheme)',
  // Browser
  browser: 'Browser',
  browserTabTitle: 'Browser',
  browserPlaceholder: 'Enter a URL, e.g. example.com',
  browserGo: 'Go',
  browserBack: 'Back',
  browserForward: 'Forward',
  refresh: 'Refresh',
  browserStart: 'Enter a URL to start browsing (sandbox mode)',
  browserChecking: 'Checking if this site can be embedded…',
  browserBlockedScheme: 'Blocked: only http/https URLs are allowed',
  browserBlockedLoopback: 'Blocked: local and internal addresses cannot be browsed here',
  browserInvalid: 'Invalid URL',
  browserOpenExternal: 'Open in browser',
  browserNoSandboxWarning: 'Sandbox off: the current page runs with full GUI privileges (re-enable in settings)',
  browserEmbedBlocked: '{host} refused to be embedded',
  browserEmbedBlockedDesc: 'This site forbids being displayed inside other pages (X-Frame-Options / frame-ancestors), so it cannot load in the sidebar. Open it in your browser instead.',
  browserEmbedAnyway: 'Load anyway',
  sandboxStatusOn: 'Sandbox on: pages cannot access the GUI\'s data or local files; logins and third-party cookies may not work',
  sandboxUnlock: 'Unlock (unsafe)',
  sandboxRestore: 'Restore sandbox',
  standaloneToggleBrowser: 'Toggle browser',
  standaloneSurfaceTerminal: 'Terminal',
  standaloneSurfaceBrowser: 'Browser',
  // Settings page Side card (a discoverable entry to open the surfaces)
  settingsNav: 'Powerdesk',
  settingsIntro: 'A GPU-accelerated terminal and a sandboxed browser for DSH, surfaced as tabs in the Powerdesk sidebar.',
  settingsOpenTerminal: 'Open Terminal',
  settingsOpenBrowser: 'Open Browser',
  settingsSidebarMissing: 'The Powerdesk sidebar is available via the toggle at the top-right corner of the window.',
  settingsOpenedHint: 'Opened in the sidebar.',
  settingsEnableTab: 'Enable this tab',
  settingsDisableTab: 'Disable this tab',
  // Extensions
  extHeading: 'Extensions',
  extIntro: 'Install your own React components as sidebar tabs. Upload a .tgz containing powerdesk.json and bundle.js, or a single bundle script.',
  extDisabled: 'Extensions are turned off. Set "extensionsEnabled": true in the dsh-powerdesk plugin config to enable them.',
  extStaleHost: 'The running DSH server does not have the extensions API. Its host half predates this feature — restart DSH (the client half updates on refresh, but the server keeps the old code in memory until it restarts).',
  extUnreachable: 'Could not reach the extensions API: {error}',
  extWarning: 'An extension runs with the same privileges as this page — full access to the DOM, your session, and the network. Only install extensions you trust.',
  extEmpty: 'No extensions installed yet.',
  extUpload: 'Upload extension…',
  extInstalling: 'Installing…',
  extRemove: 'Remove',
  extRemoveConfirm: 'Remove this extension? Its files are deleted from disk.',
  extReload: 'Reload',
  extBroken: 'Failed to load',
  extInstalled: 'Installed {when}',
  extSource: 'from {file}',
  extDir: 'Location',
  extIdLabel: 'Extension id',
  extIdPlaceholder: 'my-extension',
  extTitleLabel: 'Display name',
  extTitlePlaceholder: 'My Extension',
  extBareHint: 'This file is a single script with no powerdesk.json. Give it an id and a name.',
  extConfirmInstall: 'Install',
  extCancel: 'Cancel',
  extInstalledOk: 'Installed "{title}". Open it from the sidebar + menu.',
  // Terminal appearance (Powerdesk Side card)
  appearanceHeading: 'Terminal appearance',
  appearanceIntro: 'Pick a font, weight, size, and theme for the terminal. Font and size changes apply to the next terminal tab you open.',
  appearanceFontFamily: 'Font',
  appearanceFontFamilyAuto: 'System default',
  appearanceFontFamilyManual: 'Type a font name…',
  appearanceFontsLoading: 'Loading fonts…',
  appearanceFontWeight: 'Weight',
  appearanceFontSize: 'Size',
  appearanceTheme: 'Theme',
  appearanceFontHint: 'Lists your installed system fonts (incl. Nerd Fonts). On browsers without the Local Font Access API (Firefox/Safari), type the family name instead.',
  appearanceThemeHint: '“System default” follows light/dark.',
  appearanceReopenHint: 'Font changes take effect on the next terminal tab you open.',
  themeAuto: 'System default',
  themeTokyoNight: 'Tokyo Night',
  themeTokyoNightStorm: 'Tokyo Night Storm',
  themeTokyoNightMoon: 'Tokyo Night Moon',
  themeDracula: 'Dracula',
  themeDraculaPlus: 'Dracula+',
  themeHighContrast: 'High contrast',
  themeNord: 'Nord',
  themeGruvbox: 'Gruvbox',
  themeCatppuccinMocha: 'Catppuccin Mocha',
  themeGithubDark: 'GitHub Dark',
  themeOneDark: 'One Dark',
  themeSolarizedDark: 'Solarized Dark',
  themeRosePine: 'Rosé Pine',
  // Explorer / Editor
  explorerTabTitle: 'Explorer',
  explorerAddFolder: 'Add folder',
  explorerRemoveFolder: 'Remove',
  explorerEmptyDir: 'Empty folder',
  explorerCopyRelative: 'Copy relative path',
  explorerCopyAbsolute: 'Copy absolute path',
  explorerCopied: 'Copied',
  editorTabTitle: 'Editor',
  editorSave: 'Save',
  editorSaving: 'Saving…',
  editorUnsaved: 'Unsaved',
  editorSaved: 'Saved',
  // Notes
  notesTabTitle: 'Notes',
  notesBindPrompt: 'Bind a local folder to browse and edit its markdown notes.',
  notesBindButton: 'Bind folder',
  notesRebindHint: '{folder} — click to choose a different folder',
  notesNewNote: 'New note',
  notesNewFolder: 'New folder',
  notesNewNotePrompt: 'Note name (.md added automatically)',
  notesNewFolderPrompt: 'Folder name',
  notesRenamePrompt: 'New name',
  notesRename: 'Rename',
  notesDelete: 'Delete',
  notesDeleteConfirm: 'Delete "{name}"? This cannot be undone.',
  notesEmptyFolder: 'No markdown files in this folder yet — create one with "New note".',
  notesSelectFile: 'Select a note to view or edit it.',
  // Folder picker modal
  cancel: 'Cancel',
  folderPickerTitle: 'Choose a folder',
  folderPickerSelect: 'Select this folder',
  folderPickerUp: 'Up',
  folderPickerEmpty: 'No subfolders here',
}

const zh: Dict = {
  tabTitle: '终端',
  terminal: '终端',
  loading: '加载中…',
  disconnected: '已断开，正在重连…',
  terminalError: '终端错误',
  terminalRetry: '重试',
  terminalConnectFailed: '无法连接到终端',
  terminalDepsFailed: '原生 PTY 不可用',
  terminalDepsHint: 'Rust PTY 原生模块加载失败。请在 DSH profile 所在环境运行修复命令，然后重试：',
  terminalDepsProfile: '（profile：{profile}）',
  copy: '复制',
  copied: '已复制',
  standaloneToggle: '切换终端',
  // 侧边栏外壳（布局 + 包装器）
  close: '关闭',
  newTab: '新建标签页',
  newPane: '新建页面',
  newPaneHeading: '开启新页面',
  newPaneSubheading: '选择要在该面板打开的工具',
  cardTerminalDesc: '在嵌入式终端中运行命令',
  cardExplorerDesc: '浏览并打开工作区文件',
  cardNotesDesc: '撰写和保存随手笔记',
  cardBrowserDesc: '在预览浏览器中打开网页',
  cardSearchDesc: '在工作区中搜索文件内容',
  cardLayoutLabel: '布局',
  layoutHorizontal: '并排显示（水平分割）',
  layoutVertical: '上下堆叠（垂直分割）',
  closePane: '关闭面板',
  searchTabTitle: '搜索',
  searchPlaceholder: '搜索',
  searchNoResults: '无结果',
  searchNoQuery: '输入以搜索文件内容',
  searchResultsSummary: '在 {files} 个文件中找到 {matches} 处结果',
  searchTruncated: '（仅显示前 {matches} 处）',
  searchDepsFailed: 'ripgrep 不可用',
  searchDepsHint: '未能找到 ripgrep。请在 DSH profile 所在环境运行修复命令，然后重试：',
  collapse: '收起侧边栏',
  expand: '展开侧边栏',
  collapseBottom: '收起底部面板',
  expandBottom: '展开底部面板',
  standaloneNoSession: '没有活动会话。请先打开一个对话再使用终端。',
  settingsFontFamilyTitle: '字体',
  settingsFontFamilyDesc: '终端自定义字体（留空 = 主题代码字体）',
  settingsFontFamilyPlaceholder: '例如 "JetBrains Mono", monospace',
  settingsFontSizeTitle: '字号',
  settingsFontSizeDesc: '终端字号（像素）',
  settingsBackendTitle: 'PTY 后端',
  settingsBackendDesc: 'own = Rust /powerdesk/ws/terminal；better-sidebar = 复用 dsh-better-sidebar 终端后端',
  settingsThemeTitle: '主题',
  settingsThemeDesc: '内置 restty 主题名（留空 = 跟随应用明暗）',
  // 浏览器
  browser: '浏览器',
  browserTabTitle: '浏览器',
  browserPlaceholder: '输入网址，例如 example.com',
  browserGo: '前往',
  browserBack: '后退',
  browserForward: '前进',
  refresh: '刷新',
  browserStart: '输入网址开始浏览（沙箱模式）',
  browserChecking: '正在检查该站点是否可嵌入…',
  browserBlockedScheme: '已阻止：仅支持 http/https 链接',
  browserBlockedLoopback: '已阻止：不允许在浏览器中访问本机或内部地址',
  browserInvalid: '无效的网址',
  browserOpenExternal: '在浏览器中打开',
  browserNoSandboxWarning: '沙箱已关闭：当前页面与界面同源，拥有完整会话权限（可在设置中恢复）',
  browserEmbedBlocked: '{host} 拒绝了嵌入请求',
  browserEmbedBlockedDesc: '该站点通过 X-Frame-Options / frame-ancestors 禁止在其它页面中显示，无法在侧边栏内加载。可在浏览器中直接打开',
  browserEmbedAnyway: '仍然加载',
  sandboxStatusOn: '沙箱模式：已启用 · 页面无法访问界面数据与本地文件，登录态与第三方 Cookie 可能不可用',
  sandboxUnlock: '临时解锁（不安全）',
  sandboxRestore: '恢复沙箱',
  standaloneToggleBrowser: '切换浏览器',
  standaloneSurfaceTerminal: '终端',
  standaloneSurfaceBrowser: '浏览器',
  // 设置页 Side card（一个可发现的入口，用于打开两个面板）
  settingsNav: 'Powerdesk',
  settingsIntro: '面向 DSH 的 GPU 加速终端与沙箱浏览器，以标签页形式在 Powerdesk 侧边栏中打开。',
  settingsOpenTerminal: '打开终端',
  settingsOpenBrowser: '打开浏览器',
  settingsSidebarMissing: 'Powerdesk 侧边栏可通过窗口右上角的切换按钮打开。',
  settingsOpenedHint: '已在侧边栏打开。',
  settingsEnableTab: '启用此标签页',
  settingsDisableTab: '禁用此标签页',
  // Extensions
  extHeading: '扩展',
  extIntro: '将你自己的 React 组件安装为侧边栏标签页。上传包含 powerdesk.json 与 bundle.js 的 .tgz，或单个打包脚本。',
  extDisabled: '扩展功能已关闭。在 dsh-powerdesk 插件配置中设置 "extensionsEnabled": true 以启用。',
  extStaleHost: '当前运行的 DSH 服务没有扩展 API，其宿主端代码早于此功能——请重启 DSH（客户端会在刷新时更新，但服务端在重启前仍保留旧代码）。',
  extUnreachable: '无法访问扩展 API：{error}',
  extWarning: '扩展与本页面拥有相同权限——可完全访问 DOM、你的会话与网络。请只安装你信任的扩展。',
  extEmpty: '尚未安装任何扩展。',
  extUpload: '上传扩展…',
  extInstalling: '正在安装…',
  extRemove: '移除',
  extRemoveConfirm: '确定移除此扩展？其文件将从磁盘删除。',
  extReload: '重新加载',
  extBroken: '加载失败',
  extInstalled: '安装于 {when}',
  extSource: '来源 {file}',
  extDir: '位置',
  extIdLabel: '扩展 ID',
  extIdPlaceholder: 'my-extension',
  extTitleLabel: '显示名称',
  extTitlePlaceholder: '我的扩展',
  extBareHint: '此文件是单个脚本，不含 powerdesk.json。请为其指定 ID 与名称。',
  extConfirmInstall: '安装',
  extCancel: '取消',
  extInstalledOk: '已安装“{title}”。可从侧边栏 + 菜单打开。',
  // 终端外观（Powerdesk 设置卡片）
  appearanceHeading: '终端外观',
  appearanceIntro: '选择终端的字体、字重、字号与主题。字体与字号更改将在下次打开终端标签页时生效。',
  appearanceFontFamily: '字体',
  appearanceFontFamilyAuto: '系统默认',
  appearanceFontFamilyManual: '输入字体名…',
  appearanceFontsLoading: '正在加载字体…',
  appearanceFontWeight: '字重',
  appearanceFontSize: '字号',
  appearanceTheme: '主题',
  appearanceFontHint: '列出你系统中已安装的字体（含 Nerd Fonts）。在不支持本地字体访问 API 的浏览器（Firefox/Safari）上，请改为手动输入字体名。',
  appearanceThemeHint: '“系统默认”跟随明暗模式。',
  appearanceReopenHint: '字体更改将在下次打开终端标签页时生效。',
  themeAuto: '系统默认',
  themeTokyoNight: 'Tokyo Night',
  themeTokyoNightStorm: 'Tokyo Night Storm',
  themeTokyoNightMoon: 'Tokyo Night Moon',
  themeDracula: 'Dracula',
  themeDraculaPlus: 'Dracula+',
  themeHighContrast: '高对比度',
  themeNord: 'Nord',
  themeGruvbox: 'Gruvbox',
  themeCatppuccinMocha: 'Catppuccin Mocha',
  themeGithubDark: 'GitHub Dark',
  themeOneDark: 'One Dark',
  themeSolarizedDark: 'Solarized Dark',
  themeRosePine: 'Rosé Pine',
  // 文件浏览器 / 编辑器
  explorerTabTitle: '文件',
  explorerAddFolder: '添加文件夹',
  explorerRemoveFolder: '移除',
  explorerEmptyDir: '空文件夹',
  explorerCopyRelative: '复制相对路径',
  explorerCopyAbsolute: '复制绝对路径',
  explorerCopied: '已复制',
  editorTabTitle: '编辑器',
  editorSave: '保存',
  editorSaving: '保存中…',
  editorUnsaved: '未保存',
  editorSaved: '已保存',
  // 笔记
  notesTabTitle: '笔记',
  notesBindPrompt: '绑定一个本地文件夹，浏览和编辑其中的 markdown 笔记。',
  notesBindButton: '绑定文件夹',
  notesRebindHint: '{folder} — 点击选择其他文件夹',
  notesNewNote: '新建笔记',
  notesNewFolder: '新建文件夹',
  notesNewNotePrompt: '笔记名称（自动加 .md 后缀）',
  notesNewFolderPrompt: '文件夹名称',
  notesRenamePrompt: '新名称',
  notesRename: '重命名',
  notesDelete: '删除',
  notesDeleteConfirm: '删除 "{name}"？此操作不可撤销。',
  notesEmptyFolder: '此文件夹里还没有 markdown 文件——点"新建笔记"创建一个。',
  notesSelectFile: '选择一篇笔记查看或编辑。',
  // 文件夹选择弹窗
  cancel: '取消',
  folderPickerTitle: '选择文件夹',
  folderPickerSelect: '选择这个文件夹',
  folderPickerUp: '上一级',
  folderPickerEmpty: '没有子文件夹',
}

const dicts: Record<string, Dict> = { en, zh }

/** The active locale ('en' by default; updated by {@link attachLocale}). */
let activeLocale = 'en'

/** Resolve the active dictionary (falls back to English). */
function activeDict(): Dict {
  return dicts[activeLocale] ?? en
}

/** Whether the active locale is Chinese. */
export function isZh(): boolean {
  return activeLocale === 'zh'
}

/** Translate one key, substituting `{param}` placeholders. */
export function t(key: string, params?: Record<string, string>): string {
  const raw = activeDict()[key] ?? en[key] ?? key
  if (params === undefined) return raw
  return raw.replace(/\{(\w+)\}/g, (_m, name: string) => params[name] ?? `{${name}}`)
}

/** The current active locale. */
export function getLocale(): string {
  return activeLocale
}

/**
 * Attach the module's locale to the DSH locale service: register the
 * dictionaries under {@link LOCALE_NS} and keep the module-level locale in
 * sync with the Host-backed preference. Returns the disposer.
 */
export function attachLocale(locale: ResttyLocaleService): () => void {
  const apply = (): void => {
    activeLocale = locale.getSnapshot().active === 'zh' ? 'zh' : 'en'
  }
  apply()
  const offZh = locale.register(LOCALE_NS, 'zh', zh)
  const offEn = locale.register(LOCALE_NS, 'en', en)
  const offSub = locale.subscribe(apply)
  return () => { offSub(); offZh(); offEn() }
}
