# dsh-powerdesk

<strong>English</strong> | <a href="README_ZH.md">简体中文</a>

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
  highlighting for TS/JS/Python/JSON/CSS/HTML/Markdown/Rust/YAML, a
  selectable CodeMirror theme (Dracula by default), soft line-wrapping, and
  Cmd/Ctrl+S save. Opens automatically when you
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

## Acknowledgements

This plugin is inspired by
[DSH-better-sidebar](https://github.com/omdsh-dev/DSH-better-sidebar) —
sincere thanks to its authors for the panel / dock layout and the sidebar
shell foundation Powerdesk built on.

Building on that platform, Powerdesk grew into its own plugin architecture
and redesigned the workbench around a performance-first terminal: the
renderer is [restty](https://github.com/restty-dev/restty)
(WebGPU/WebGL2 + WASM VT, Ghostty lineage) and the PTY backend is a **Rust**
native addon ([napi-rs](https://napi.rs) +
[portable-pty](https://github.com/wez/portable-pty)) instead of the stock
C++ `node-pty`, which makes terminal I/O substantially faster and lighter.
The split-tree state machine, the file / notes / editor / browser surfaces,
and the extension system were redesigned from scratch on top of that base.

---

## Requirements

- **DSH** `>=0.0.1` installed and the `dsh` CLI on your `PATH`
  (`dsh --version`). The plugin loads into a DSH profile (default `web`).
- **Node.js 20+** and **pnpm 9+** if you install from source.
- **A Rust toolchain** (`rustup`) — only needed if your platform doesn't have
  a committed prebuilt binary yet (see below); macOS users never need Rust.

The PTY addon is looked up by platform triple (`src/rust-pty-deps.ts`); three
triples currently have a binary committed to the repo (`prebuilt/<triple>/`)
and shipped with every install:

| OS | Arch | Triple | Prebuilt? |
| --- | --- | --- | --- |
| macOS | Apple Silicon | `darwin-arm64` | ✅ committed |
| macOS | Intel | `darwin-x64` | ✅ committed |
| Linux | x86_64 (glibc) | `linux-x64-gnu` | ✅ committed |
| Linux | aarch64 (glibc) | `linux-arm64-gnu` | build from source |
| Windows | x86_64 | `win32-x64-msvc` | build from source |
| Windows | ARM64 | `win32-arm64-msvc` | build from source |

Other platforms show the terminal's repair banner after install until
someone runs `pnpm build:rust` on that platform and commits the resulting
`prebuilt/<triple>/dsh_powerdesk_pty.node` (see Install below).

---

## Install

There are two ways to install. Pick **one** — do not enable both channels at
once (they would double-mount the host half and render two sidebars). No
npm package is published yet, so both channels install straight from the
GitHub repo.

### Option A — from GitHub (recommended)

`dsh plugin` forwards to pnpm *inside the profile directory*, so this fetches
the repo as a git-hosted package (no local clone, no build step, no extra
config). The repo is public, so the plain HTTPS URL works anonymously:

```bash
dsh plugin --profile web add https://github.com/FleetingEcho/dsh-powerdesk.git
```

pnpm reads the package name out of the repo, so no `dsh-powerdesk@` prefix is
needed — though `dsh-powerdesk@<url>` works too and is what you want when
pinning a branch or tag (`...git#my-branch`).

Prefer SSH? `git+ssh://git@github.com/FleetingEcho/dsh-powerdesk.git` works
too — it needs an SSH key registered on GitHub (`ssh -T git@github.com` to
verify).

That's it. `lib/` (the built client/host JS) is committed to the repo, so
there's no `prepare`/lifecycle script for pnpm to run — no `allowBuilds`
entry needed either.

The Rust PTY binaries for macOS (both) and Linux x86_64 are likewise
committed under `prebuilt/<triple>/`, so the terminal works immediately on
those — no Rust toolchain needed.

<details>
<summary>Windows or Linux ARM64: no committed binary yet, build it once</summary>

The terminal shows the repair banner after install on these platforms until
you build the addon once inside the installed package:

```bash
cd ~/.dsh/profiles/web/node_modules/dsh-powerdesk
pnpm build:rust       # needs the Rust toolchain (rustup); cargo build --release
```

</details>

### Option B — from source (for development)

Clone the repo, build, then point DSH at the local checkout:

```bash
git clone https://github.com/FleetingEcho/dsh-powerdesk.git
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

The terminal toolbar has a **copy** action. Font family / weight / size / theme
are stored prefs (`dsh-powerdesk:prefs` in `localStorage`) with sane defaults
(font size defaults to 16px) — edit them from the **Settings → Powerdesk**
card, which exposes Radix-UI controls for the family, weight, size, and
theme, plus a separate selector for the code editor's (CodeMirror's) theme.

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
selectable CodeMirror theme — Dracula by default (the published
`@uiw/codemirror-theme-*` packages pull in `@babel/runtime` helpers that
don't resolve in this bundler's browser build, so the palettes are
hand-rolled and applied directly as a `HighlightStyle` +
`EditorView.theme`). The theme is picked in the **Settings → Powerdesk**
card and re-applies live to any open editor (a `StateEffect.reconfigure`
swap — the doc and undo history survive); `auto` follows the app's
light/dark scheme. Soft line-wrapping (no horizontal scrollbar needed for
long lines); Cmd/Ctrl+S to write back. The tab shows a dirty dot while there
are unsaved edits.

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

pnpm pins git dependencies to the exact commit it first resolved, so
re-running `add` with the same spec is a no-op ("Already up to date") even
after new commits land. Remove then re-add to force re-resolution to the
latest commit, then hard-refresh:

```bash
dsh plugin --profile web remove dsh-powerdesk
dsh plugin --profile web add https://github.com/FleetingEcho/dsh-powerdesk.git
```

Confirm the new commit actually landed — the resolved sha is recorded in the
profile lockfile:

```bash
grep 'dsh-powerdesk.git#' ~/.dsh/profiles/web/pnpm-lock.yaml
```

Host-half changes need a DSH restart; the client half only needs a
hard-refresh.

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

## Install troubleshooting

### The plugin installs but does not load

Check that the bundle row was added — `dsh.profile.bundles` must list
`dsh-powerdesk` alongside the dependency:

```bash
cat ~/.dsh/profiles/web/package.json
```

If the dependency is present but the bundle row is not, the plugin mounts as
a plain dependency and never loads. That is the symptom of a broken `link:`
install (see Option B's note) — re-add with an absolute path or the git URL
from Install → Option A.

Host-half changes only take effect after a DSH restart; a running server
keeps the previous code in memory even after `node_modules` is replaced.

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
  extensionsEnabled: false    # allow user-installed extensions (see Extensions)
  extensionsDir: ''            # where they live ('' = ~/.dsh/powerdesk/extensions)
```

### User prefs (`localStorage`, no host round-trip)

| Pref | Storage key | Notes |
| --- | --- | --- |
| Terminal font family / weight / size / theme; CodeMirror (editor) theme | `dsh-powerdesk:prefs` | Editable from the **Settings → Powerdesk** card (Appearance). |
| Explorer folder bookmarks | `dsh-powerdesk:explorer-bookmarks` | Multiple bookmarks + which one is active. |
| Notes bound folder | `dsh-powerdesk:notes-folder` | One folder, rebindable. |
| Notes tree column width | `dsh-powerdesk:notes-tree-width` | Dragged via the divider. |
| Per-tab-type enable switches | `dsh-powerdesk:tabs-enabled` | Set from the Settings Side card. |

### Environment variables

| Var | Purpose |
| --- | --- |
| `DSH_POWERDESK_PTY_PATH` | Absolute path to a `.node` addon; beats every other resolution. |
| `DSH_POWERDESK_PTY_TRIPLE` | Override the detected platform triple (e.g. `linux-x64-musl`). |
| `DSH_RESTTY_SHELL` | Override the Windows shell probe (default: first `pwsh.exe` on PATH or in a known install dir, else `powershell.exe`). |
| `PREBUILT_BASE` | Override the prebuilt-binary download base URL (default: GitHub releases). |
| `DSH_HOME` | Override the DSH home (default `~/.dsh`). |
| `DSH_CMD` | Override the `dsh` CLI used by `install.sh` (default: `dsh`, then `npx`). |

---

## Extensions

Powerdesk can mount **your own React components** as sidebar tabs. An
extension is a single bundled script plus a `powerdesk.json` manifest,
uploaded as a `.tgz` from the Settings card.

### Security — read this first

An extension runs **in the DSH page's own origin**, with full access to the
DOM, your session, and the network. It has the same privileges as Powerdesk
itself. There is no sandbox, and there cannot be one while extensions render
into the tab bar and share the host's React instance.

This is a **trusted local extensions** feature, not a marketplace. Install
only code you have read or whose author you trust.

Because of that, the feature is **off by default**. Turn it on deliberately:

```yaml
dsh-powerdesk:
  extensionsEnabled: true
```

While it is off, `ext.install` / `ext.remove` return 403 and
`/powerdesk/bundle/ext/*` 404s for every id — an extension left on disk from
an earlier session cannot load.

### Installing

**Settings → Powerdesk → Extensions → Upload extension…**

Accepted uploads, decided by the bytes rather than the file name:

| Upload | Handling |
| --- | --- |
| `.tgz` / `.tar.gz` | Extracted; must contain `powerdesk.json` at the root (an `npm pack`-style `package/` wrapper is stripped). |
| `.tar` | Same, uncompressed. |
| `.js.gz` / `.js` | A bare bundle with no manifest — the card asks for an id and a display name. |

Each extension is installed to `<extensionsDir>/<id>/`, replacing any previous
install of the same id. Installs are atomic: the upload is staged in a
temporary directory and moved into place only after its manifest and entry
file both validate, so a rejected upload leaves the working install untouched.

The settings card shows each extension's on-disk path and the sha256 of the
archive it came from, so you can audit what is actually executing.

### Removing

**Settings → Powerdesk → Extensions → Remove** deletes the directory. To
disable an extension without uninstalling it, use the enable/disable switch on
its card in the tab grid above — extension tabs get the same switch as the
built-in ones.

### Authoring

Start from the template:

```bash
cp -r templates/extension ~/my-extension
cd ~/my-extension && pnpm install
$EDITOR powerdesk.json          # pick an id and a title
pnpm build && pnpm pack         # -> my-extension-0.0.0.tgz
```

See `templates/extension/README.md` for the component contract and the
manifest reference. The one rule worth repeating: **do not bundle React** —
it is external, and the host passes you its own instance. A second copy of
React has its own hook dispatcher and every hook you call will throw.

### How it works

An extension reuses Powerdesk's existing lazy-chunk mechanism unchanged:

1. The build wraps your code in a factory registered on the plugin-private
   registry under `ext:<id>`:
   `globalThis.__dshPowerdeskChunks__["ext:<id>"] = (require) => {…}`.
2. On first open, the client injects
   `<script src="/powerdesk/bundle/ext/<id>.js">`. The host resolves that id
   through the manifest — never by concatenating the URL onto a path — and
   serves the entry file with the same trust fence and ETag/304 handling as
   the built-in chunks.
3. The factory is called with a `require` that resolves `react`,
   `react/jsx-runtime`, and the DSH client packages from the host's module
   table, so your component shares the host's React.
4. The resolved component is registered through the ordinary
   `service.registerTab` contract, which is what gives it the loading
   placeholder, the retry affordance, the error boundary, and the settings
   switch for free.

### Limits

| Bound | Value |
| --- | --- |
| Upload size | 16 MiB |
| Inflated archive | 32 MiB (enforced by zlib's `maxOutputLength`) |
| Files per archive | 64 |
| Per-file size | 8 MiB |

Archives containing symlinks, hardlinks, device nodes, absolute paths, or any
`..` segment are rejected at parse time.

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

**`lib/` and `prebuilt/` are committed**, not gitignored — the GitHub-install
channel (see Install → Option A) is a plain file copy with no build step, so
whatever is in git *is* what installs. After any source change, run
`pnpm build` (and `pnpm build:rust` if the Rust layer changed) and commit the
result before pushing, or GitHub installs will silently ship stale code.
That includes any code-split chunk `tsdown` emits into `lib/` — `package.json`
`files` uses `lib/*.js` so hashed shared chunks ship too; narrowing it back to
a hand-listed set will drop them and publish a package with dangling imports.
Sourcemaps (`lib/**/*.map`) stay gitignored — dev-only, not needed at
install time.

---

## License

MIT.
