# dsh-powerdesk

A [DSH](https://github.com/deepseek-ai/dsh) web plugin that adds a small IDE
workbench to the DSH web UI: a GPU-accelerated **terminal**, a **file
explorer**, a **notes** app, a **code editor**, and a sandboxed **browser** —
all self-contained, in a dockable right panel *and* a dockable bottom panel
(VSCode-style dual workbench, with drag-to-split and drag-between-panels).

- **Terminal** — rendered with [restty](https://github.com/restty-dev/restty)
  (WebGPU/WebGL2 + WASM VT, Ghostty-lineage) and backed by a **Rust PTY**
  ([napi-rs](https://napi.rs) + [portable-pty](https://github.com/wez/portable-pty))
  instead of the C++ `node-pty` the stock terminal uses.
- **Explorer** — a directory tree over any local folder you bookmark (picked
  via a built-in folder-browser modal, not a text field). Click a file to
  open it in the editor; each file row has quick "copy relative path" (for
  @-mentioning in chat) and "copy absolute path" actions.
- **Notes** — bind one local folder and browse/edit only its `.md` files as a
  recursive tree, with inline create / rename / delete for both notes and
  folders. The editor is embedded in the same tab (tree left, editor right).
- **Editor** — [CodeMirror 6](https://codemirror.net/) with syntax
  highlighting for TS/JS/Python/JSON/CSS/HTML/Markdown/Rust/YAML, a Dracula
  theme, soft line-wrapping, and Cmd/Ctrl+S save. Opens automatically when you
  click a file in Explorer or Notes.
- **Browser** — a sandboxed iframe behind an address bar, with an
  embeddability probe that explains `X-Frame-Options` / `frame-ancestors`
  refusals instead of showing a blank "refused to connect" frame.

All five surface as tabs in the plugin's own sidebar — a **right panel**
(width freely draggable, no cap) and a **bottom panel** (height draggable,
spans the full window width including under the right panel). Drag any tab
to a pane's edge to split it, or drag it between the right and bottom panels
entirely — they're just two different split trees sharing one drag-and-drop
system.

---

## Requirements

- **DSH** `>=0.0.1` installed and the `dsh` CLI on your `PATH`
  (`dsh --version`). The plugin loads into a DSH profile (default `web`).
- **Node.js 20+** and **pnpm 9+** if you install from source.
- **A Rust toolchain** (`rustup`) **only** if you build the PTY addon from
  source — the official releases ship prebuilt per-platform binaries, so most
  users never need Rust.

Supported platforms for the prebuilt PTY binary:

| OS | Arch | Triple |
| --- | --- | --- |
| macOS | Apple Silicon | `darwin-arm64` |
| macOS | Intel | `darwin-x64` |
| Linux | x86_64 (glibc) | `linux-x64-gnu` |
| Linux | aarch64 (glibc) | `linux-arm64-gnu` |
| Windows | x86_64 | `win32-x64-msvc` |
| Windows | ARM64 | `win32-arm64-msvc` |

---

## Install

There are two ways to install. Pick **one** — do not enable both channels at
once (they would double-mount the host half and render two sidebars). No
npm package is published yet, so both channels install straight from the
GitHub repo.

### Option A — from GitHub (recommended)

`dsh plugin` forwards to pnpm *inside the profile directory*, so this fetches
the repo as a git-hosted package (no local clone needed):

```bash
dsh plugin --profile web add "dsh-powerdesk@github:FleetingEcho/dsh-powerdesk"
```

The package's `prepare` script (`tsdown`) builds the client/host JS on
install. **First install on a profile also needs an `allowBuilds` entry** —
pnpm 11 blocks lifecycle scripts (including `prepare`) for git-hosted
packages by default:

```yaml
# ~/.dsh/profiles/web/pnpm-workspace.yaml
allowBuilds:
  dsh-powerdesk: true
```

without it, install fails with `ERR_PNPM_GIT_DEP_PREPARE_NOT_ALLOWED` and
`lib/` is never produced. This only needs to be added once per profile.

There's no prebuilt Rust PTY binary distribution yet (no GitHub releases),
so the terminal will show the repair banner until you build the native addon
once inside the installed package:

```bash
cd ~/.dsh/profiles/web/node_modules/dsh-powerdesk
pnpm build:rust       # needs the Rust toolchain (rustup); cargo build --release
```

### Option B — from source (for development)

Clone the repo, build, then point DSH at the local checkout:

```bash
git clone git@github.com:FleetingEcho/dsh-powerdesk.git
cd dsh-powerdesk

pnpm install
pnpm build            # tsc (lib/types) + tsdown (lib/*.js + the lazy chunks)
pnpm build:rust       # cargo build --release → prebuilt/<triple>/dsh_powerdesk_pty.node
pnpm test             # vitest (optional sanity check)

# Register the local checkout with your DSH profile.
# NOTE: `link:.` resolves relative to the profile directory
# (~/.dsh/profiles/web), so it yields a broken self-referential symlink (the
# plugin then mounts as a plain dependency with no bundle row and will NOT
# load). Use an ABSOLUTE path to your checkout — e.g. from the cloned dir:
dsh plugin --profile web add "dsh-powerdesk@link:$PWD"
#   or add a `link:<absolute path>` dependency in the profile and `pnpm install`.
```

After either option: **hard-refresh the browser** (Cmd/Ctrl+Shift+R). Client
half changes hot-reload without a DSH restart; host half changes (`src/*.ts`,
including `fs-api.ts` and the Rust PTY layer) need a DSH restart
(`pm2 restart dsh-web`, or `dsh web`).

---

## Use

### The workbench: right panel + bottom panel

Click the toggle cluster at the top-right corner of the window — one button
opens/collapses the **right panel**, the other the **bottom panel**. Both are
independent split trees: drag a tab to a pane's edge (25% band) to split that
pane, or to its center to merge/reorder; drag a tab from one panel to the
other to move it there entirely. Every open tab stays mounted while inactive
(hidden, not torn down), so switching tabs never drops a terminal's
connection or an editor's undo history.

- **Right panel** — width is freely draggable (its left edge), no upper cap
  beyond the window width.
- **Bottom panel** — height is freely draggable (its top edge); its
  horizontal span is the full window width, including under the right panel
  (the right panel's higher stacking order draws over it there) — not
  boxed into the space left over after the right panel, unlike a plain
  "squeeze the center column" layout.

Both panels dock by reserving their size as a margin on the host app's own
root element, so the host's own layout reflows to make room — the panels
never just float over the host's content.

### Terminal

Open the **Terminal** tab. It opens in the active conversation's working
directory; you can open multiple terminals per session up to the configured
quota (the tab title shows the index: `Terminal 1`, `Terminal 2`, …).

The terminal toolbar has a **copy** action. Font family / size / theme are
stored prefs (`dsh-powerdesk:prefs` in `localStorage`) with sane defaults —
there's currently no in-app settings UI to edit them; set them by writing to
that key directly if you need to change the defaults.

If the native PTY binary is missing or fails to load, the terminal shows a
repair banner with the exact command to run instead of crashing the plugin.
See **Repair** below.

### Explorer

Open the **Explorer** tab. Click the folder-name button in the header to open
a folder-browser modal (click through subdirectories, "Select this folder")
— browsers don't hand a web page a real filesystem path from a native
picker, so this is a self-built one on top of the same `fs.list` route,
rather than a manual path field. Add multiple folder bookmarks and switch
between them from the same header button; remove the active one from the
header too.

Click a directory row to expand it, a file row to open it in the editor
(opening a file from Explorer automatically splits Explorer into its own
pane so the editor doesn't stack on top of it — the split only happens once;
subsequent files reuse the same editor pane). Hovering a file row reveals two
actions: **@** copies the path relative to the current bookmark's root (for
@-mentioning in chat), and a copy icon copies the absolute path.

### Notes

Open the **Notes** tab. First use prompts you to bind a folder (same
folder-browser modal as Explorer, but Notes binds a single folder, rebindable
any time by clicking the folder name). Notes recursively lists every `.md` /
`.markdown` file under that folder — directories with no markdown anywhere
under them are pruned from the tree entirely — and renders the tree (left)
next to an inline editor (right, freely resizable via the divider between
them), both in the one tab.

Header actions: new note, new folder. Per-file actions (hover to reveal):
rename, delete (with a confirmation prompt — deleting a folder is
recursive). New files are created exclusively (never silently overwrite an
existing file of the same name).

### Editor

Not opened directly — it's what Explorer and Notes open files into
(`service.openFile`). CodeMirror 6 with syntax highlighting for
TypeScript/JavaScript, Python, JSON, CSS, HTML, Markdown, Rust, and YAML; a
hand-rolled Dracula theme (the published `@uiw/codemirror-theme-dracula`
package pulls in `@babel/runtime` helpers that don't resolve in this
bundler's browser build, so the palette is applied directly as a
`HighlightStyle` + `EditorView.theme`); soft line-wrapping (no horizontal
scrollbar needed for long lines); Cmd/Ctrl+S or the save button to write
back. The header shows a dirty dot while there are unsaved edits.

Lives in its own lazy chunk (shared with Notes, since Notes embeds the same
editor) — CodeMirror is only downloaded once a file is actually opened.

### Browser

Open the **Browser** tab. Type a URL in the address bar and press Enter.
Back / forward / refresh / open-in-browser buttons line the bar.

- **Sandbox** — the iframe runs without `allow-same-origin` (opaque origin:
  the visited page cannot read the GUI's storage or reach its API) and
  without `allow-top-navigation`. A temporary, non-persistent **unlock**
  button drops the sandbox for trusted sites; a red status bar warns while
  it is off.
- **Address bar** — only `http`/`https` are accepted. `javascript:`,
  `data:`, `file:` and other dangerous schemes are refused. Loopback
  addresses (`localhost`, `127.0.0.0/8`, `::1`, `0.0.0.0`) are refused so a
  browsed page cannot probe your local services. The GUI's own origin is
  allowed (the sandbox keeps it opaque).
- **Embed refusals** — when a site sets `X-Frame-Options: DENY/SAMEORIGIN`
  or a `frame-ancestors` CSP directive that doesn't allow `*` (e.g.
  `www.google.com`), the plugin probes the target's headers first and shows
  a reason panel with **"Open in browser"** and **"Load anyway"** — instead
  of the browser's cryptic blank "refused to connect" frame. This is a
  browser-enforced, per-site restriction (anti-clickjacking) — no client
  technique bypasses it; "Open in browser" is the only way to view such a
  site from here.
- **External links** — the browser tab claims `http://` external-link clicks
  so clicking an http link in the chat opens it in the sidebar. `https://`
  is left to the system browser (most HTTPS sites refuse embedding).

### Settings

The "Powerdesk" Side card (Settings → Powerdesk) shows a card per tab type
(icon, title, the raw type id as a subtitle) with a checkmark toggle:
switching a tab type off hides it from every pane's + menu and makes
`openTab` a no-op for it (persisted in `localStorage`, independent of any
session). Clicking a card's body opens that surface in the workbench.

---

## Update

### Option A (GitHub channel)

Re-add the dependency to pick up the latest commit, then hard-refresh:

```bash
dsh plugin --profile web add "dsh-powerdesk@github:FleetingEcho/dsh-powerdesk"
```

This re-runs `prepare` (`tsdown`) against the new commit. If the Rust PTY
layer changed, rebuild it too (see Install → Option A).

### Option B (source / git channel)

Pull, rebuild, restart only if you changed the host half:

```bash
git pull
pnpm install            # only if dependencies changed
pnpm build
# Native addon changed? Rebuild it too:
pnpm build:rust
# Hard-refresh the browser. Restart DSH only if you touched the host half.
```

---

## Uninstall

### Option A (GitHub channel)

Remove the package from the profile:

```bash
dsh plugin --profile web remove dsh-powerdesk
# Hard-refresh the browser (or restart DSH) for the mount row to drop.
```

### Option B (source / git channel)

Remove the `link:` dependency and restore the profile's original state:

```bash
dsh plugin --profile web remove dsh-powerdesk
# Then revert any link: dependency entry you added to the profile, and
# `pnpm install` in the profile to restore the previous state.
```

Either way, the `cordis.patch.yml` bundle-patch mount row is removed by the
`dsh plugin remove` step on the next DSH start; a hard-refresh (or DSH
restart) clears the in-memory copy.

---

## Repair (terminal shows "Rust PTY loading failed")

If the native PTY binary is missing, corrupt, or built for the wrong
platform, the terminal shows a repair banner. Rebuild it in place without
reinstalling the whole plugin:

```bash
# GitHub channel:
cd ~/.dsh/profiles/web/node_modules/dsh-powerdesk
# Source channel:
cd /path/to/your/dsh-powerdesk/checkout

pnpm build:rust                              # needs the Rust toolchain (rustup)
```

Then hard-refresh the browser and restart DSH, since the host half re-reads
the binary on startup.

---

## Configuration

### Plugin config (in `dsh.profile.bundles`)

```yaml
dsh-powerdesk:
  terminalsPerSession: 3      # max live terminals per conversation session
  reconnectGraceMs: 30000     # keep a dropped pty alive this long for reconnect
  shell: ''                    # override the interactive shell (auto-detected if '')
```

### User prefs (`localStorage`, no host round-trip)

| Pref | Storage key | Notes |
| --- | --- | --- |
| Terminal font family / size / theme | `dsh-powerdesk:prefs` | No settings UI yet — defaults only; edit the key directly to override. |
| Explorer folder bookmarks | `dsh-powerdesk:explorer-bookmarks` | Multiple bookmarks + which one is active. |
| Notes bound folder | `dsh-powerdesk:notes-folder` | One folder, rebindable. |
| Notes tree column width | `dsh-powerdesk:notes-tree-width` | Dragged via the divider. |
| Per-tab-type enable switches | `dsh-powerdesk:tabs-enabled` | Set from the Settings Side card. |

### Environment variables

| Var | Purpose |
| --- | --- |
| `DSH_POWERDESK_PTY_PATH` | Absolute path to a `.node` addon; beats every other resolution. |
| `DSH_POWERDESK_PTY_TRIPLE` | Override the detected platform triple (e.g. `linux-x64-musl`). |
| `DSH_POWERDESK_SHELL` | Override the Windows shell probe (default: `pwsh.exe` → `powershell.exe` → `cmd.exe`). |
| `PREBUILT_BASE` | Override the prebuilt-binary download base URL (default: GitHub releases). |
| `DSH_HOME` | Override the DSH home (default `~/.dsh`). |
| `DSH_CMD` | Override the `dsh` CLI used by `install.sh` (default: `dsh`, then `npx`). |

---

## Endpoints

| Route | Method | Purpose |
| --- | --- | --- |
| `/powerdesk/ws/terminal` | WS upgrade | The restty-native terminal WebSocket. |
| `/powerdesk/api/session.cwd` | POST | Resolve the authoritative cwd for a session. |
| `/powerdesk/api/pty.close` | POST | Release a terminal's quota immediately. |
| `/powerdesk/api/terminal.deps` | POST | Degraded-mode repair info (the native binary is missing). |
| `/powerdesk/api/browser.probe` | POST | Fetch a URL's headers to detect X-Frame-Options / frame-ancestors embed refusals. |
| `/powerdesk/api/fs.list` | POST | List one directory's immediate children (Explorer, the folder picker). |
| `/powerdesk/api/fs.read` | POST | Read one file's content, capped server-side (the editor). |
| `/powerdesk/api/fs.write` | POST | Overwrite one file's content (editor save). |
| `/powerdesk/api/fs.create` | POST | Create a new file exclusively — fails if it already exists (Notes "new note"). |
| `/powerdesk/api/fs.mkdir` | POST | Create a directory, including missing parents. |
| `/powerdesk/api/fs.rename` | POST | Rename/move a file or folder. |
| `/powerdesk/api/fs.delete` | POST | Delete a file or folder, recursively. |
| `/powerdesk/api/fs.listMarkdownTree` | POST | The recursive `.md` tree over a bound folder (Notes). |
| `/powerdesk/api/fs.home` | POST | The host's home directory (the folder picker's starting point). |
| `/powerdesk/bundle/<name>.js` | GET | Lazy chunks — `terminal`, `browser`, `editor` (ETag + 304). |

All routes pass the same browser-trust fence as the DSH `/api` gateway
(loopback Host or `ctx.webRuntime.trustedHosts`; `sec-fetch-site: cross-site`
refused; same-origin `Origin`). The `fs.*` routes have no extra path
sandboxing beyond `resolve()`: the terminal already gives a user with access
to this plugin unrestricted local shell access, so restricting the file API
more tightly would not add any real security.

---

## Development

```bash
pnpm install
pnpm build            # tsc (lib/types) + tsdown (lib/*.js + the lazy chunks)
pnpm build:rust       # cargo build --release → prebuilt/<triple>/dsh_powerdesk_pty.node
pnpm typecheck        # tsc --noEmit
pnpm test             # vitest run
pnpm test:watch       # vitest watch
pnpm watch            # tsdown --watch (rebuild bundles on save)
```

The Rust crate (`rust/`) uses `napi-rs` + `portable-pty`. Build with
`pnpm build:rust`; the output lands in `prebuilt/<triple>/dsh_powerdesk_pty.node`.
The client bundle never imports restty or CodeMirror directly — they live in
lazy chunks (`lib/client-terminal.js`, `lib/client-editor.js`) fetched on
first use through `/powerdesk/bundle/<name>.js`, keeping the initial bundle
small (~196 KB).

---

## Project layout

```
dsh.plugin.json          # id dsh-external/dsh-powerdesk, main + client.main
cordis.patch.yml         # bundle-patch mount row
package.json             # peerDeps (dsh-*, cordis, react), restty, CodeMirror, lucide-react, ws, vitest, tsdown
tsdown.config.ts         # host ESM + 2 client CJS bundles + 3 lazy chunks + purity gate + CSS-modules
tsconfig.json            # ES2023, strict, noUncheckedIndexedAccess, verbatimModuleSyntax
vitest.config.ts         # jsdom, tests/**/*.spec.ts(x)

src/                     # host half (Node)
  index.ts               # apply(): routes, ws upgrade, teardown
  context-types.ts       # shared cordis service types (client-reachable, Node-free)
  trust-fence.ts         # browser-trust fence (loopback / trustedHosts / sec-fetch-site)
  wire.ts                # JSON envelope helpers + error codes
  config.ts              # Schema config + resolvePowerdeskConfig
  shell.ts               # interactive-shell resolution (POSIX / Windows)
  pty-wire.ts            # PURE client→server frame dispatcher
  rust-pty.ts             # multi-subscriber wrapper around the native single-callback surface
  rust-pty-deps.ts        # lazy loader + degraded-mode status + triple resolution
  rust-pty-manager.ts    # ${sessionId}:${tabId} pty table, quota, reconnect grace, transcript
  bundle-route.ts        # /powerdesk/bundle/<name>.js (fenced, ETag, 304)
  browser-probe.ts       # pure frame-ancestors CSP extractor (browser.probe route)
  fs-api.ts              # Explorer/Notes/Editor file API (list/read/write/create/mkdir/rename/delete/markdown tree)

rust/                    # native PTY crate (napi-rs + portable-pty)
  src/lib.rs             # spawn + Pty (onData/onExit/write/resize/kill/pid)
  Cargo.toml, build.rs, package.json

src/client/              # client half (browser)
  index.tsx              # apply(): locale, chunk reset, tab descriptor registration
  SidebarShell.tsx        # the panel chrome: toggle cluster, right/bottom panel docking + resize
  SplitPane.tsx           # the split-tree renderer + drag-to-edge/drag-between-panels
  TabBar.tsx              # one pane's tab strip (drag source, + menu)
  state.ts                # the split-tree state machine (splits/bottomSplits, persisted per session)
  service.ts              # the tab/file-viewer registry service (ctx.powerdeskSidebar)
  ResttyTerminal.tsx      # the terminal renderer lifecycle (transport, reconnect, repair, theme)
  BrowserView.tsx         # the browser tab (address bar + sandboxed iframe + embed-blocked panel)
  browser.ts              # pure URL policy + embeddability (unit-tested)
  FileExplorer.tsx        # the Explorer tab (lazy per-directory fetch, bookmarks)
  NotesView.tsx           # the Notes tab (recursive markdown tree + inline editor)
  CodeEditor.tsx          # the CodeMirror wrapper (syntax highlighting, Dracula, save)
  FolderPicker.tsx        # the folder-browser modal (shared by Explorer + Notes)
  explorer-prefs.ts, notes-prefs.ts  # localStorage-backed bookmark/binding prefs
  restty-transport.ts    # own-backend PtyTransport (surfaces close code/reason)
  adapter-transport.ts   # better-sidebar-protocol-compatible PtyTransport (unused by default)
  chunk-loader.ts        # lazy chunk fetch + memo + retry
  lazy-chunk.tsx         # lazyChunkComponent()
  chunks/terminal.tsx, chunks/browser.tsx, chunks/editor.tsx  # the 3 lazy chunk entries
  SettingsSection.tsx    # the "Powerdesk" Settings Side card (tab-type toggle cards)
  theme.ts, terminal-font.ts, open-when-sized.ts, prefs.ts, api.ts, locales.ts, icons.tsx
  sidebar.module.css     # CSS Modules (hashed class maps)

scripts/                 # install.sh, install.ps1, build-rust.sh
tests/                  # vitest specs (pure units + fake WebSocket)
```

---

## License

MIT.
