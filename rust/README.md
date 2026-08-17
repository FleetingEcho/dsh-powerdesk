# dsh-powerdesk-pty

The Rust native addon that backs `dsh-powerdesk`'s host half. It spawns a
local PTY (terminal emulator subprocess) using wezterm's [`portable-pty`]
(pure Rust, cross-platform) and exposes a tiny napi-rs surface the host loads
lazily.

## Public surface (the JS the host half sees)

```ts
spawn(shell: string, args: string[], options: { cols, rows, cwd, env }): Pty
Pty.on_data(callback: (data: string) => void): void   // single callback slot
Pty.on_exit(callback: (event: { exitCode, signal? }): void): void
Pty.write(data: string): void
Pty.resize(cols, rows, pixelW?, pixelH?): void
Pty.kill(): void
Pty.pid: number
```

`on_data` / `on_exit` register **one** callback each (the JS wrapper in
`src/rust-pty.ts` installs a single dispatcher at construction and fans out
to multiple subscribers itself, so `RustPtyManager` can attach a transcript
mirror and a WS forwarder to the same live pty).

## Build from source

Requires the Rust toolchain (`rustup`) and, on Linux, the usual C build
tools (the portable-pty native deps are minimal).

```sh
# From the plugin root:
bash scripts/build-rust.sh
```

This runs `cargo build --release` and copies the produced cdylib to
`prebuilt/<triple>/dsh_powerdesk_pty.node`, where the host half's lazy loader
(`src/rust-pty-deps.ts`) finds it by platform triple.

Alternatively, with the napi-rs CLI installed (`@napi-rs/cli`):

```sh
cd rust && npx napi build --release --platform
```

## Cross-compile / prebuilt binaries

`rust/package.json` declares the `napi` triples for `napi build --platform`
and the published companion packages (`@dsh-powerdesk-pty/<triple>`). The host
loader resolves, in order:

1. `DSH_POWERDESK_PTY_PATH` — an explicit `.node` path;
2. `@dsh-powerdesk-pty/<triple>` — the companion optionalDependency;
3. `prebuilt/<triple>/dsh_powerdesk_pty.node` — next to the plugin.

Override the detected triple with `DSH_POWERDESK_PTY_TRIPLE` (e.g.
`linux-x64-musl` for Alpine/musl).

## Notes

- Output is delivered as lossy UTF-8 (`String::from_utf8_lossy`); the common
  case (valid UTF-8 chunks) is exact. A partial multibyte sequence split
  across reads may surface as `U+FFFD`; the host sends output as binary
  frames and restty decodes them with a streaming `TextDecoder`, which is the
  robust path. This trade-off keeps the native reader panic-free.
- The exit code is best-effort 0/1 across portable-pty versions; the visible
  `[process exited with code N]` notice and the structured `{type:'exit'}`
  control both fire on exit.
