# dsh-powerdesk

A [DSH](https://github.com/deepseek-ai/dsh) web plugin that adds a **terminal**
and a **sandboxed browser** to the DSH web UI.

- **Terminal** — rendered with [restty](https://github.com/restty-dev/restty)
  (WebGPU/WebGL2 + WASM VT, Ghostty-lineage) and backed by a **Rust PTY**
  ([napi-rs](https://napi.rs) + [portable-pty](https://github.com/wez/portable-pty))
  instead of the C++ `node-pty` the stock terminal uses.
- **Browser** — a sandboxed iframe behind an address bar, with an
  embeddability probe that explains `X-Frame-Options` / `frame-ancestors`
  refusals instead of showing a blank "refused to connect" frame.

Both features surface as **dsh-better-sidebar tabs** when
[dsh-better-sidebar](https://github.com/omdsh-dev/dsh-better-sidebar) is
installed, or as a **standalone floating panel** (with a surface switch) when
it is not. The terminal's Rust backend is the default; a `better-sidebar`
adapter backend can instead reuse dsh-better-sidebar's PTY lifecycle.

See [DESIGN.md](./DESIGN.md) for the architecture and the wire protocol.

---

## Requirements

- **DSH** `>=0.0.1` installed and the `dsh` CLI on your `PATH`
  (`dsh --version`). The plugin loads into a DSH profile (default `web`).
- **Node.js 20+** and **pnpm 9+** if you install from source.
- **A Rust toolchain** (`rustup`) **only** if you build the PTY addon from
  source — the official releases ship prebuilt per-platform binaries, so most
  users never need Rust.
- **dsh-better-sidebar** is *optional*. With it, the plugin registers
  Terminal + Browser sidebar tabs; without it, the plugin falls back to a
  standalone floating panel.

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
once (they would double-mount the host half and render two sidebars).

### Option A — official CLI + prebuilt binary (recommended)

One command installs the npm package, auto-mounts it (the
`cordis.patch.yml` bundle-patch is added to the profile on next DSH start),
and downloads the platform's prebuilt Rust PTY binary:

```bash
# POSIX (Linux / macOS)
bash scripts/install.sh
# or pin a version + restart DSH afterward:
bash scripts/install.sh 0.1.0 --profile web --restart

# Windows (PowerShell)
powershell -ExecutionPolicy Bypass -File scripts\install.ps1
```

Under the hood this runs
`dsh plugin --profile <name> add dsh-powerdesk@<version>` and then fetches the
prebuilt `dsh_powerdesk_pty.node` into `prebuilt/<triple>/`.

### Option B — from source (for development / private deployments)

Clone the repo, build, then point DSH at the local checkout:

```bash
git clone git@github.com:FleetingEcho/dsh-powerdesk.git
cd dsh-powerdesk

pnpm install
pnpm build            # tsc (lib/types) + tsdown (lib/*.js + the terminal chunk)
pnpm build:rust       # cargo build --release → prebuilt/<triple>/dsh_powerdesk_pty.node
pnpm test             # vitest (optional sanity check)

# Register the local checkout with your DSH profile.
# NOTE: `dsh plugin` forwards to pnpm *inside the profile directory*
# (~/.dsh/profiles/web), so `link:.` resolves to that directory and yields a
# broken self-referential symlink (the plugin then mounts as a plain
# dependency with no bundle row and will NOT load). Use an ABSOLUTE path to
# your checkout — e.g. from the cloned dir:
dsh plugin --profile web add "dsh-powerdesk@link:$PWD"
#   or add a `link:<absolute path>` dependency in the profile and `pnpm install`.
```

`pnpm build:rust` needs the Rust toolchain (`rustup`). If you'd rather not
build the native addon locally, run `bash scripts/install.sh --repair` after
the clone — it downloads the matching prebuilt binary for your platform.

After either option: **hard-refresh the browser** (Cmd/Ctrl+Shift+R). Client
half changes hot-reload without a DSH restart; host half changes need a DSH
restart (`pm2 restart dsh-web`, or `dsh web`).

---

## Use

### Terminal

Open the **Terminal** tab in the sidebar (when dsh-better-sidebar is present)
or click the floating toggle button (when it is not). The terminal opens in
the active conversation's working directory. You can open multiple terminals
per session up to the configured quota; the tab title shows the index
(`Terminal 1`, `Terminal 2`, …).

The terminal toolbar has a **copy** action. Settings (font family, font size,
PTY backend, theme) live in the Side card settings popup — click the tab's
gear icon. Changes apply on the next tab open.

If the native PTY binary is missing or fails to load, the terminal shows a
repair banner with the exact command to run instead of crashing the plugin.
See **Repair** below.

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
  of the browser's cryptic blank "refused to connect" frame.
- **External links** — the browser tab claims `http://` external-link clicks
  so clicking an http link in the chat opens it in the sidebar. `https://`
  is left to the system browser (most HTTPS sites refuse embedding).

### Standalone mode (no dsh-better-sidebar)

Without dsh-better-sidebar, the plugin mounts a small floating panel with a
**Terminal / Browser** surface switch in its header. The terminal is scoped
to the active conversation; the browser is the same address-bar + iframe
surface. Prefs are read from `localStorage` in this mode.

---

## Update

### Option A (npm channel)

Re-run the install command with the new version, then hard-refresh:

```bash
bash scripts/install.sh 0.2.0 --profile web --restart
```

This re-runs `dsh plugin --profile web add dsh-powerdesk@0.2.0` (the CLI
updates the dependency) and re-downloads the matching prebuilt binary.

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

### Option A (npm channel)

Remove the package from the profile, then optionally delete the prebuilt
binary:

```bash
dsh plugin --profile web remove dsh-powerdesk
# Optional: delete the downloaded native binary
rm -rf ~/.dsh/profiles/web/node_modules/dsh-powerdesk/prebuilt
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
platform, the terminal shows a repair banner. Re-fetch or rebuild the
binary without reinstalling the whole plugin:

```bash
bash scripts/install.sh --repair            # re-downloads the matching binary
# If no prebuilt exists for your platform, build from source:
pnpm build:rust                              # needs the Rust toolchain
```

Then hard-refresh the browser (and restart DSH if you rebuilt, since the
host half re-reads the binary on startup).

---

## Configuration

### Plugin config (in `dsh.profile.bundles`)

```yaml
dsh-powerdesk:
  terminalsPerSession: 3      # max live terminals per conversation session
  reconnectGraceMs: 30000     # keep a dropped pty alive this long for reconnect
  shell: ''                    # override the interactive shell (auto-detected if '')
```

### User prefs (Side card settings popup or `localStorage`)

| Pref | Default | Notes |
| --- | --- | --- |
| `fontFamily` | (theme code font) | Monospace family; falls back to the theme code font, then the built-in stack. |
| `fontSize` | `15` | Clamped to 8..32 px. Takes effect on the next tab open (restty has no live font setter). |
| `ptyBackend` | `own` | `own` (this plugin's Rust PTY) or `better-sidebar` (reuse dsh-better-sidebar's PTY). |
| `themeName` | (restty default) | A restty builtin theme name (`Aizen Dark`, …). |

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
| `/powerdesk/ws/terminal` | WS upgrade | The restty-native terminal WebSocket (own backend). |
| `/powerdesk/api/session.cwd` | POST | Resolve the authoritative cwd for a session. |
| `/powerdesk/api/pty.close` | POST | Release a terminal's quota immediately. |
| `/powerdesk/api/terminal.deps` | POST | Degraded-mode repair info (the native binary is missing). |
| `/powerdesk/api/browser.probe` | POST | Fetch a URL's headers to detect X-Frame-Options / frame-ancestors embed refusals. |
| `/powerdesk/bundle/terminal.js` | GET | The lazy restty chunk (ETag + 304). |

All routes pass the same browser-trust fence as the DSH `/api` gateway
(loopback Host or `ctx.webRuntime.trustedHosts`; `sec-fetch-site: cross-site`
refused; same-origin `Origin`).

---

## Two backends

The same `ResttyTerminal` component connects to one of two backends:

- **`own`** (default) — `/powerdesk/ws/terminal`, the plugin's own Rust PTY.
  Self-contained; the only backend that works without dsh-better-sidebar.
- **`better-sidebar`** — `/sidebar/ws/terminal`, via `adapter-transport.ts`,
  translating restty's JSON-control protocol to dsh-better-sidebar's raw-text
  protocol and forwarding its output. Shares dsh-better-sidebar's reconnect
  grace, per-session quota, and session cwd.

See [DESIGN.md §4](./DESIGN.md) for the protocol translation and the known
ambiguity (raw-text input that is valid JSON control is treated as control —
identical to dsh-better-sidebar's own terminal).

---

## Development

```bash
pnpm install
pnpm build            # tsc (lib/types) + tsdown (lib/*.js + the terminal chunk)
pnpm build:rust       # cargo build --release → prebuilt/<triple>/dsh_powerdesk_pty.node
pnpm typecheck        # tsc --noEmit
pnpm test             # vitest run
pnpm test:watch       # vitest watch
pnpm watch            # tsdown --watch (rebuild bundles on save)
```

The Rust crate (`rust/`) uses `napi-rs` + `portable-pty`. Build with
`pnpm build:rust`; the output lands in `prebuilt/<triple>/dsh_powerdesk_pty.node`.
The client bundle never imports restty directly — it lives in a lazy chunk
(`lib/client-terminal.js`) fetched on first terminal-open through
`/powerdesk/bundle/terminal.js`, keeping the initial bundle small.

---

## Project layout

```
dsh.plugin.json          # id dsh-external/dsh-powerdesk, main + client.main
cordis.patch.yml         # bundle-patch mount row
package.json             # peerDeps (dsh-*, cordis, react, dsh-better-sidebar*), restty, ws, vitest, tsdown
tsdown.config.ts         # host ESM + 2 client CJS bundles + the terminal chunk + purity gate + CSS-modules
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
  rust-pty.ts            # multi-subscriber wrapper around the native single-callback surface
  rust-pty-deps.ts       # lazy loader + degraded-mode status + triple resolution
  rust-pty-manager.ts    # ${sessionId}:${tabId} pty table, quota, reconnect grace, transcript
  bundle-route.ts        # /powerdesk/bundle/<name>.js (fenced, ETag, 304)
  browser-probe.ts       # pure frame-ancestors CSP extractor (browser.probe route)

rust/                    # native PTY crate (napi-rs + portable-pty)
  src/lib.rs             # spawn + Pty (on_data/on_exit/write/resize/kill/pid)
  Cargo.toml, build.rs, package.json

src/client/              # client half (browser)
  index.tsx              # apply(): locale, chunk reset, sidebar tabs OR standalone panel
  ResttyTerminal.tsx     # the renderer lifecycle (transport, reconnect, repair, theme)
  BrowserView.tsx        # the browser tab (address bar + sandboxed iframe + embed-blocked panel)
  browser.ts             # pure URL policy + embeddability (unit-tested)
  restty-transport.ts    # own-backend PtyTransport (surfaces close code/reason)
  adapter-transport.ts   # better-sidebar-backend PtyTransport (protocol translation)
  chunk-loader.ts        # lazy chunk fetch + memo + retry
  lazy-chunk.tsx         # lazyChunkComponent()
  standalone-panel.tsx   # the floating-panel fallback (terminal + browser surface switch)
  chunks/terminal.tsx    # the chunk entry (re-exports ResttyTerminal)
  theme.ts, terminal-font.ts, open-when-sized.ts, prefs.ts, api.ts, locales.ts, service.ts
  restty.module.css      # CSS Modules (hashed class maps)

scripts/                 # install.sh, install.ps1, build-rust.sh
tests/                  # vitest specs (pure units + fake WebSocket)
```

---

## License

MIT.
