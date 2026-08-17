# dsh-powerdesk — Design

A DSH web plugin that brings the **restty** terminal renderer (WebGPU/WebGL2 +
WASM VT, Ghostty-lineage) and a **sandboxed browser** into the DSH web UI,
backed by a **Rust PTY** (napi-rs + `portable-pty`) instead of the C++
`node-pty` the stock terminal uses. It surfaces a terminal AND a browser as
**dsh-better-sidebar tabs** when that plugin is installed, and as a
**standalone floating panel** (with a surface switch) when it is not.

This document records the architecture decisions, the wire protocol, the
file layout, and the known trade-offs / open questions. The reference repos
that informed it:

- `DSH-better-sidebar` — how a DSH web plugin is structured (host half +
  client half, manifest, bundle patch, trust fence, lazy chunks, the
  `ctx.betterSidebar` service, the browser tab + `browser.probe` route).
- `restty` + `restty/examples/local-pty-server` — the restty renderer and
  the WebSocket PTY wire protocol its `createWebSocketPtyTransport` /
  `connectPty` expects.

---

## 1. The central design decision: Rust PTY via napi-rs

restty's own VT core is Zig/WASM (Ghostty lineage) with a Rust sibling
(`text-shaper`); it ships **no host-side PTY**. The DSH host runs in Node, so
a Rust PTY must reach Node. Three options were considered:

| Option | Description | Verdict |
| --- | --- | --- |
| **R1 — napi-rs native addon** | A small Rust crate (`portable-pty`) compiled to a Node native addon, loaded **lazily** by the host half with a degraded-mode repair banner. | **Chosen.** In-process (no subprocess/port allocation), reuses `ctx.webServer` trust fencing, ships prebuilt per-platform binaries, degrades gracefully if the binding is missing. Mirrors dsh-better-sidebar's `pty-deps.ts` 1:1 but in Rust. |
| R2 — standalone Rust binary server | A Rust `portable-pty` + `tungstenite` WS server the Node host spawns as a child; the browser connects directly. | Heavier: subprocess lifecycle, a second network hop / port allocation, trust-fence alignment harder. Less aligned with how DSH host plugins route through `ctx.webServer`. |
| R3 — pure Rust host (no Node) | Not viable — DSH host plugins run in the Node/cordis runtime and must register `ctx.webServer` upgrade routes from Node. | Rejected. |

R1's JS surface mirrors `node-pty`'s `IPty` (`spawn` → `onData`/`onExit` →
`write`/`resize`/`kill`/`pid`). The native crate exposes a **single** callback
slot for `on_data`/`on_exit` (a `ThreadsafeFunction` the Rust reader thread
fires); a thin JS wrapper (`src/rust-pty.ts`) multiplexes that one slot into
the multi-subscriber `onData(cb) => dispose` surface node-pty provides, so the
manager can attach a transcript mirror and a WS forwarder to the same live pty.

**Why not reuse dsh-better-sidebar's `node-pty`?** Two reasons: (1) the user
asked for a Rust PTY (restty's stack is Rust/Zig, so this keeps the PTY in the
same ecosystem); (2) restty's wire protocol is **not** dsh-better-sidebar's
(see §3), so the host endpoint is ours anyway. The Rust backend is the
default; a **better-sidebar adapter backend** (§4) reuses dsh-better-sidebar's
existing `/sidebar/ws/terminal` when the user prefers to share its PTY
lifecycle — selected by a pref, never forced.

---

## 2. Architecture

```
┌──────────────────────── DSH web (browser) ────────────────────────┐
│  client half (src/client)                                          │
│  ┌───────────────┐   registerTab (ctx.betterSidebar)  ┌─────────┐  │
│  │ better-sidebar│ ← tab "Terminal" / "Browser" ───────► │ restty  │  │
│  │  (if present) │                              ┌──────► │ renderer│  │
│  └───────────────┘                              │      │ (chunk) │  │
│  ┌──────────────────────────┐  (else)          │      └────┬────┘  │
│  │ standalone floating panel│ ─────────────────┘           │       │
│  └──────────────────────────┘                                │       │
└──────────────────────────────────────────────────────────── │ ──────┘
                                                              │ ws
┌──────────────────────── DSH host (Node) ───────────────────── ▼ ─────┐
│  host half (src)                                                     │
│  /powerdesk/ws/terminal  (restty native wire protocol) ──► RustPtyManager│
│  /powerdesk/api          (terminal.deps / pty.close / session.cwd)       │
│  /powerdesk/bundle/<n>.js (lazy chunk route, fenced + ETag)              │
│         │                                                            │
│         ▼  createRequire (lazy, cached)                              │
│  ┌─────────────────────── Rust native addon (rust/) ───────────────┐  │
│  │ napi-rs + portable-pty  →  spawn / onData / onExit /            │  │
│  │                            write / resize / kill / pid          │  │
│  └────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────┘
```

### Host half (`src/`)
- `index.ts` — `apply(ctx, config)`: lazy-loads the native module, builds the
  trust fence (reads `ctx.webRuntime.trustedHosts` per request, the same
  source the `/api` gateway fence derives its list from), registers the
  `/powerdesk/api` JSON routes, the `/powerdesk/bundle` chunk route, and the
  `/powerdesk/ws/terminal` upgrade; tears the pty table down on disposal.
- `rust-pty-deps.ts` — lazy loader + degraded-mode status (mirrors
  dsh-better-sidebar's `pty-deps.ts`). Resolves the platform triple and tries,
  in order: `DSH_POWERDESK_PTY_PATH` → `@dsh-powerdesk-pty/<triple>` companion →
  `prebuilt/<triple>/dsh_powerdesk_pty.node`. Never throws; a missing binding
  degrades this plugin only.
- `rust-pty-manager.ts` — `${sessionId}:${tabId}`-keyed pty table, bounded
  transcript ring, per-session quota, reconnect grace, respawn-on-exit /
  respawn-on-cwd-change.
- `rust-pty.ts` — the multi-subscriber JS wrapper around the single-callback
  native surface.
- `pty-wire.ts` — the **pure** client→server frame dispatcher (testable
  without a live WebSocket).
- `bundle-route.ts` — the `/powerdesk/bundle/<name>.js` route (ETag + 304,
  fenced, allowlisted names).
- `config.ts`, `shell.ts`, `wire.ts`, `trust-fence.ts`, `context-types.ts` —
  config schema, interactive-shell resolution, JSON wire helpers, the
  browser-trust fence, and the structural cordis service types (shared by
  both halves; client-reachable, so free of Node types).

### Rust crate (`rust/`)
- `src/lib.rs` — `spawn` + `Pty` (`on_data`/`on_exit`/`write`/`resize`/
  `kill`/`pid`) over `portable-pty`. A background reader thread (started by
  `on_data`) decodes output as lossy UTF-8 and fires the data callback; a
  background wait thread (started by `spawn`) polls `try_wait` every 50 ms so
  `kill()` stays reachable, records the exit, and fires the exit callback
  once the JS side has registered it (or immediately if late).
- `build.rs` — `napi_build::build()` (the napi-rs linker/version metadata).
- `package.json` — the `napi` triples for `napi build --platform` and the
  companion-package names.

### Client half (`src/client/`)
- `index.tsx` — `apply(ctx)`: attaches the DSH locale system, resets the chunk
  cache (HMR-safe), and surfaces the terminal — a dsh-better-sidebar **tab**
  when `ctx.betterSidebar` is present, or a **standalone floating panel**
  otherwise (the two never coexist).
- `ResttyTerminal.tsx` — the renderer lifecycle: `new Restty(...)` with the
  chosen transport, `connectPty(url)`, reconnect loop (bounded failures),
  repair banner on a degraded close, theme/font from prefs, scheme-flip
  re-theme, deferred `open` until the host is sized.
- `restty-transport.ts` — the **own** backend: a `PtyTransport` to
  `/powerdesk/ws/terminal` that surfaces the close code/reason to the view
  (restty's `createWebSocketPtyTransport` swallows it) and is injectable for
  tests.
- `adapter-transport.ts` — the **better-sidebar** backend: a `PtyTransport`
  to `/sidebar/ws/terminal` translating restty↔dsh-better-sidebar protocols.
- `chunk-loader.ts` / `lazy-chunk.tsx` — the lazy chunk machinery (restty is
  several MB; fetched on first terminal-open through `/powerdesk/bundle`).
- `theme.ts`, `terminal-font.ts`, `open-when-sized.ts`, `prefs.ts`, `api.ts`,
  `locales.ts`, `service.ts` — the pure helpers (live theme tokens, font
  resolution, deferred open, prefs read/merge/clamp, the typed `/powerdesk/api`
  fetch + WS URL builders, the i18n `t()`, and the type-only re-export of
  dsh-better-sidebar's service contract).
- `chunks/terminal.tsx` — the chunk entry (re-exports `ResttyTerminal`).
- `standalone-panel.tsx` — the fallback floating panel.

---

## 3. The wire protocol (restty native)

restty's `createWebSocketPtyTransport` / `connectPty` speaks a JSON-control
protocol that **differs** from dsh-better-sidebar's raw-text protocol:

| Direction | restty (this plugin's `/powerdesk/ws/terminal`) | dsh-better-sidebar (`/sidebar/ws/terminal`) |
| --- | --- | --- |
| client → server (input) | `{type:'input',data}` JSON string frame | raw text frame (written verbatim) |
| client → server (resize) | `{type:'resize',cols,rows,…}` JSON | `{type:'resize',cols,rows}` JSON |
| client → server (close) | `{type:'close'}` JSON | socket close |
| server → client (output) | **binary** frame (UTF-8, streaming decoded) | text frame |
| server → client (control) | `{type:'status'|'error'|'exit'}` JSON string frames | (none; exit shown as text) |

The host sends output as **binary** frames (restty decodes them with a
streaming `TextDecoder`), which avoids the false-positive class: a string
output frame that happens to be valid `{"type":"exit",…}` JSON would be
misinterpreted as a control frame, but a binary frame is always data. The
pure dispatcher (`src/pty-wire.ts`) routes each client JSON frame to the live
pty.

---

## 4. The dual backend

The same `ResttyTerminal` component connects to one of two backends, selected
by the user pref `ptyBackend`:

- **`own`** (default) — the plugin's Rust `/powerdesk/ws/terminal`. Self-
  contained; the only backend that works without dsh-better-sidebar.
- **`better-sidebar`** — reuse dsh-better-sidebar's `/sidebar/ws/terminal`
  through `adapter-transport.ts`, which translates restty's `{type:'input',data}`
  JSON to a raw-text frame (dsh-better-sidebar writes non-control frames
  verbatim) and forwards dsh-better-sidebar's text output to restty as
  `onData`. This shares dsh-better-sidebar's PTY lifecycle (reconnect grace,
  per-session quota, session cwd, agent terminals via `?uuid=`). The
  adapter's caveat mirrors dsh-better-sidebar's own documented ambiguity: a
  raw-text input frame that is valid JSON the server recognizes as a control
  (`{type:'resize',…}` / `{type:'close'}`) is treated as control, not written
  to the pty — identical to dsh-better-sidebar's own terminal, so no third
  escaping is invented.

Both backends drive the same reconnect + repair logic; the close reason
distinguishes a transient disconnect (reconnect) from a degraded mode
(`powerdesk-pty-deps-missing` for own, `pty-deps-missing` for the adapter) from a
server refusal (close 1011 with a reason → show the reason, no retry — e.g.
the per-session quota).

---

## 5. Surfacing: sidebar tabs vs standalone panel

The client half branches on `ctx.betterSidebar`:

- **Present** → registers TWO tabs through `ctx.betterSidebar.registerTab`:
  - **Terminal** (`id: 'dsh-powerdesk:terminal'`): mints `restty:<n>`
    ids via a module-level counter, owns font/backend/theme rows in the Side
    card settings popup (`settings.pluginToggles` → the prefs blob in
    `pluginSettings[<tab id>]`), and renders `ResttyTerminal` through a lazy
    chunk. `available` is permissive (the host enforces the real quota); an
    over-quota open surfaces the reason via the close-1011 path.
  - **Browser** (`id: 'dsh-powerdesk:browser'`): mints
    `restty-browser:<n>` ids, claims HTTP external-link clicks via
    `urlTarget` (HTTPS is left to the system browser since most HTTPS sites
    refuse embedding), and renders `BrowserView` directly (no chunk — it is
    a lightweight iframe surface).
- **Absent** → `mountStandalonePanel`: a fixed, body-portal floating panel
  with a toggle button and a **surface switch** (Terminal / Browser) in the
  panel header. The terminal is scoped to the active conversation session;
  the browser is a plain address bar + iframe. Prefs from `localStorage`.

The two paths never coexist (the sidebar tabs are the integrated path; the
floating panel is the self-contained fallback).

`ctx.betterSidebar` is an **optional** peer dependency: a type-only
`import type {} from 'dsh-better-sidebar'` triggers the `declare module
'cordis'` augmentation (erased at build time — no value import crosses the
client bundle purity gate); the client accesses it defensively and skips
registration when undefined. The plugin loads and runs without
dsh-better-sidebar installed.

---

## 5b. The browser tab

The browser is a sandboxed iframe behind an address bar, adapted from
dsh-better-sidebar's `BrowserView` + `browser.ts` + `browser-probe.ts`.

**Security model** — the iframe is ALWAYS sandboxed without
`allow-same-origin` (opaque origin — the visited page can never sit on the
GUI's origin, read its storage, or reach `/powerdesk/api`) and without
`allow-top-navigation` (a page must not hijack the GUI). The sandbox tokens
are `allow-scripts allow-forms allow-popups allow-downloads allow-modals
allow-popups-to-escape-sandbox`. A temporary, component-local unlock drops
the sandbox for trusted sites (a persistent warning bar renders while off).

**Address-bar policy** (`src/client/browser.ts`, pure, unit-tested):
normalizes input to http(s), refuses `javascript:`/`data:`/`file:`/etc.
(scheme block), and refuses loopback addresses (localhost, 127.0.0.0/8,
::1, 0.0.0.0) so a browsed page cannot probe local services. The GUI's own
origin is explicitly allowed (the user may browse the GUI itself; the
sandbox keeps it opaque).

**Embeddability probe** — the host's `/powerdesk/api/browser.probe` route
fetches the target's response headers (HEAD, falling back to GET on
405/501, 8 s timeout) and returns `X-Frame-Options` + the CSP
`frame-ancestors` source list. The client's `embeddabilityOf()` then
decides: `DENY`/`SAMEORIGIN` → blocked; `frame-ancestors` without `*` →
blocked (the site's `'self'` is never our origin). When blocked, the view
shows a reason panel with "Open in browser" + "Load anyway" instead of the
browser's cryptic "refused to connect" blank. This directly solves the
`X-Frame-Options: sameorigin` error (e.g. Google): the user sees *why* the
site refused and can open it in the real browser with one click.

---

## 6. The lazy chunk

restty (WASM + WebGPU/WebGL2) is several MB. The client core bundle never
imports it; `ResttyTerminal` lives in a lazy chunk (`lib/client-terminal.js`)
fetched on first terminal-open through the plugin's own
`/powerdesk/bundle/terminal.js` route (ETag + 304 revalidation). The chunk
registers its CJS factory on `globalThis.__dshChunks__['terminal']` and is
materialized with a `require` that resolves the platform externals through
`__DSH_MODULES__.import(spec)` (the seed-word branch). This mirrors
dsh-better-sidebar's chunk machinery exactly; only the chunk name set differs
(`['terminal']` here vs `['terminal','editor']` there).

---

## 7. Build, install, distribution

- **Build** — `pnpm build` runs `tsc -p tsconfig.build.json` (emits
  `lib/types/*.d.ts`) then `tsdown` (the host ESM lib + two client CJS
  bundles `client.js` / `client-registry.js` + the `client-terminal.js`
  chunk). The client bundles replicate the official DSH client-bundle
  preset: externals resolve through the loader module table, everything else
  inlined, a purity gate rejects non-external `@deepseek-ai/*` value imports
  (cross-plugin collaboration goes through cordis services, never value
  imports), CSS Modules compile to hashed class maps.
- **Rust** — `scripts/build-rust.sh` runs `cargo build --release` and copies
  the cdylib to `prebuilt/<triple>/dsh_powerdesk_pty.node`; `@napi-rs/cli`
  (`napi build --platform`) also works against `rust/package.json`.
- **Install** — `scripts/install.sh` (POSIX) / `install.ps1` (Windows) run
  `dsh plugin --profile <name> add dsh-powerdesk@<version>` (the
  `cordis.patch.yml` bundle-patch auto-mounts it) then download the platform
  prebuilt binary into `prebuilt/<triple>/`. `--repair` re-downloads /
  rebuilds only the binary. The binary is **downloaded** (not built by pnpm),
  so the pnpm 11 `strict-dep-builds` hurdle that affects `node-pty` plugins
  does not apply.

---

## 8. Security and degraded mode

- Every `/powerdesk/*` route passes the same browser-trust fence as the `/api`
  gateway (Host-header loopback or `ctx.webRuntime.trustedHosts`, read per
  request; `sec-fetch-site: cross-site` refused; same-origin `Origin`). This
  is a DNS-rebinding / cross-site defense, not authentication.
- All operations are conversation-scoped (a `sessionId`; the session's
  authoritative cwd from the session store).
- The native module is loaded **lazily** (never at module top level): a
  missing/broken binding degrades **this plugin** (the terminal shows a
  repair banner with a pasteable command) instead of failing the plugin load
  and taking down `dsh web`.
- The WS close reason is a short marker (`powerdesk-pty-deps-missing`); the full
  repair command is fetched from `/powerdesk/api/terminal.deps` (a WS close
  reason is capped at 123 bytes).

---

## 9. Tests

`vitest` (jsdom) covers the testable units without the native module or a
browser — mirroring dsh-better-sidebar's approach: the wire helpers, the
trust fence, the config/shell resolution, the `RustPty` wrapper's
multi-subscriber fan-out, the lazy loader's triple resolution + caching + the
degraded status, the manager (with a fake module), the **pure** wire
dispatcher, both transports (with a fake `WebSocket`), prefs, the URL
builders, the theme helpers, the deferred open, the chunk loader, the locale
switching, the font resolution, and the plugin/manifest shape. The Rust crate
is exercised by the real build (and by hand against `cargo test` if
extended); it is deliberately not required by the TS suite.

---

## 10. Open questions / future work

- **Live font/size** — restty's public API has no documented live
  `fontFamily`/`fontSize` setter; a font-size change takes effect on the next
  tab open (theme is re-applied live where a setter exists, else also deferred).
- **Token-synced theme** — the builtin theme's surface colors are overridden
  from DSH tokens when the theme object exposes `background`/`foreground`;
  other palette slots stay builtin. A deeper token→palette mapping is future
  work.
- **Agent terminals** — the `?uuid=` agent-owned-terminal path
  (dsh-better-sidebar's `terminal_create` tool) is not wired here; the own
  backend serves UI-tab terminals only. The adapter backend inherits
  dsh-better-sidebar's agent terminals transparently.
- **Quota UX** — `available` is permissive; an over-quota open surfaces the
  host's reason via the close-1011 path rather than graying the menu.
- **napi call signature** — the Rust crate targets the napi 2.x
  `ThreadsafeFunction` `call(Ok(value), ctx)` form; verify against the
  installed napi version when building from source (the prebuilt path avoids
  this entirely for most users).
- **portable-pty `ExitStatus`** — the exit code is best-effort 0/1 across
  portable-pty versions; the visible notice and the structured exit both fire.
