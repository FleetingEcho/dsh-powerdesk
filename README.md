# dsh-powerdesk

A [DSH](https://github.com/deepseek-ai/dsh) web plugin that adds a **terminal**
and a **sandboxed browser** to the DSH web UI. The terminal is rendered with
[restty](https://github.com/restty-dev/restty) (WebGPU/WebGL2 + WASM VT,
Ghostty-lineage) and backed by a **Rust PTY** ([napi-rs](https://napi.rs) +
[portable-pty](https://github.com/wez/portable-pty)) instead of the C++
`node-pty` the stock terminal uses. The browser is a sandboxed iframe behind
an address bar, with an embeddability probe that explains
`X-Frame-Options` / `frame-ancestors` refusals instead of showing a blank
frame.

It surfaces both features as **dsh-better-sidebar tabs** when
[dsh-better-sidebar](https://github.com/omdsh-dev/dsh-better-sidebar) is
installed, and as a **standalone floating panel** (with a surface switch)
when it is not. The Rust backend is the default for the terminal; a
`better-sidebar` adapter backend reuses dsh-better-sidebar's PTY lifecycle
when you prefer to share it.

See [DESIGN.md](./DESIGN.md) for the architecture and the wire protocol.

---

## Why

- restty's renderer is cross-platform (WebGPU/WebGL2 + WASM VT) and matches
  the Ghostty lineage, giving the DSH web terminal a modern look on every
  platform the browser supports.
- The Rust PTY keeps the host-side PTY in the same ecosystem as restty's
  Rust/Zig core, and ships prebuilt per-platform binaries — no C++ toolchain,
  no pnpm `strict-dep-builds` hurdle.
- Two surfacings (sidebar tab / floating panel) let the plugin work whether or
  not dsh-better-sidebar is installed, and a clean fallback when the native
  binary is missing (a repair banner, not a plugin-load failure).

---

## Quick start

### Install (recommended)

From the plugin checkout:

```bash
# POSIX (Linux / macOS)
bash scripts/install.sh                # installs latest into the `web` profile
bash scripts/install.sh 0.1.0 --profile web --restart

# Windows (PowerShell)
powershell -ExecutionPolicy Bypass -File scripts\install.ps1
```

The script runs `dsh plugin --profile <name> add dsh-powerdesk@<version>`
(the `cordis.patch.yml` bundle-patch auto-mounts it on next DSH start) and
downloads the platform's prebuilt Rust PTY binary into
`prebuilt/<triple>/dsh_powerdesk_pty.node`.

### Repair (terminal shows "Rust PTY 加载失败 / loading failed")

```bash
bash scripts/install.sh --repair            # re-downloads / rebuilds the binary only
```

### Build from source

```bash
pnpm install
pnpm build            # tsc (lib/types) + tsdown (lib/*.js + the terminal chunk)
pnpm build:rust       # cargo build --release → prebuilt/<triple>/dsh_powerdesk_pty.node
pnpm test             # vitest
```

---

## Configuration

The plugin exposes a Schema config (in `dsh.profile.bundles`):

```yaml
dsh-powerdesk:
  terminalsPerSession: 3      # max live terminals per conversation session
  reconnectGraceMs: 30000     # keep a dropped pty alive this long for reconnect
  shell: ''                    # override the interactive shell (auto-detected if '')
```

User-facing prefs live in the Side card settings popup (when the sidebar tab
is registered) or in `localStorage` (standalone panel):

| Pref | Default | Notes |
| --- | --- | --- |
| `fontFamily` | (theme code font) | Monospace family; falls back to the theme code font, then the built-in stack. |
| `fontSize` | `15` | Clamped to 8..32 px. Takes effect on the next tab open (restty has no live font setter). |
| `ptyBackend` | `own` | `own` (this plugin's Rust PTY) or `better-sidebar` (reuse dsh-better-sidebar's PTY). |
| `themeName` | (restty default) | A restty builtin theme name (`Aizen Dark`, …). |

### Environment

| Var | Purpose |
| --- | --- |
| `DSH_POWERDESK_PTY_PATH` | Absolute path to a `.node` addon; beats every other resolution. |
| `DSH_POWERDESK_PTY_TRIPLE` | Override the detected platform triple (e.g. `linux-x64-musl`). |
| `DSH_POWERDESK_SHELL` (Windows) | Override the Windows shell probe. |
| `PREBUILT_BASE` | Override the prebuilt-binary download base URL. |
| `DSH_HOME` | Override the DSH home (default `~/.dsh`). |
| `DSH_CMD` | Override the `dsh` CLI used by `install.sh`. |

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
- **`better-sidebar`** — `/sidebar/ws/terminal`, via
  `adapter-transport.ts`, translating restty's JSON-control protocol to
  dsh-better-sidebar's raw-text protocol and forwarding its output. Shares
  dsh-better-sidebar's reconnect grace, per-session quota, and session cwd.

See [DESIGN.md §4](./DESIGN.md#4-the-dual-backend) for the protocol
translation and the known ambiguity (raw-text input that is valid JSON
control is treated as control — identical to dsh-better-sidebar's own
terminal).

---

## Browser tab

The plugin also registers a **Browser** tab (a sandboxed iframe behind an
address bar), adapted from dsh-better-sidebar's browser.

- **Sandbox**: the iframe runs without `allow-same-origin` (opaque origin —
  no GUI storage/API access) and without `allow-top-navigation`. A temporary
  unlock drops the sandbox for trusted sites.
- **Address bar**: only http/https; `javascript:`/`data:`/`file:` refused;
  loopback addresses (localhost, 127.0.0.0/8) refused. The GUI's own origin
  is allowed (the sandbox keeps it opaque).
- **Embed refusals**: when a site sets `X-Frame-Options: DENY/SAMEORIGIN` or a
  `frame-ancestors` CSP directive that doesn't allow `*` (e.g. Google), the
  host's `browser.probe` route detects it and the view shows a reason panel
  with **"Open in browser"** + **"Load anyway"** — instead of the browser's
  cryptic "refused to connect" blank frame.
- **External links**: the browser tab claims HTTP external-link clicks
  (`urlTarget`) so clicking an http:// link in the chat opens it in the
  sidebar; HTTPS is left to the system browser (most HTTPS sites refuse
  embedding).

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
  config.ts              # Schema config + resolveResttyConfig
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
