#!/usr/bin/env bash
# =============================================================================
# Build the dsh-powerdesk-pty Rust native module from source and place the
# produced cdylib at prebuilt/<triple>/dsh_powerdesk_pty.node, where the host
# half's lazy loader (src/rust-pty-deps.ts) finds it by platform triple.
#
# Requires the Rust toolchain (rustup). On Linux you also need a C compiler
# and the usual build tools (portable-pty's native deps are minimal).
#
# Usage:
#   bash scripts/build-rust.sh                # build for the host triple
#   DSH_POWERDESK_PTY_TRIPLE=linux-x64-musl bash scripts/build-rust.sh
#   bash scripts/build-rust.sh --release       # explicit release profile
#
# Environment:
#   DSH_POWERDESK_PTY_TRIPLE  override the detected platform triple
# =============================================================================
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
RUST_DIR="$ROOT/rust"
OUT_DIR="$ROOT/prebuilt"

# ── Detect the platform triple (mirrors src/rust-pty-deps.ts) ───────────────
detect_triple() {
  if [ -n "${DSH_POWERDESK_PTY_TRIPLE:-}" ]; then
    echo "$DSH_POWERDESK_PTY_TRIPLE"
    return
  fi
  local os arch
  os="$(uname -s)"
  arch="$(uname -m)"
  case "$os" in
    Darwin)
      [ "$arch" = "arm64" ] && echo "darwin-arm64" || echo "darwin-x64"
      ;;
    Linux)
      [ "$arch" = "aarch64" ] && echo "linux-arm64-gnu" || echo "linux-x64-gnu"
      ;;
    MINGW*|MSYS*|CYGWIN*)
      [ "$arch" = "aarch64" ] && echo "win32-arm64-msvc" || echo "win32-x64-msvc"
      ;;
    *)
      echo "unknown-$arch" >&2
      return 1
      ;;
  esac
}

TRIPLE="$(detect_triple)"
DEST="$OUT_DIR/$TRIPLE"
echo "[build-rust] triple=$TRIPLE dest=$DEST"

command -v cargo >/dev/null 2>&1 || {
  echo "[build-rust] cargo not found. Install the Rust toolchain: https://rustup.rs" >&2
  exit 1
}

cd "$RUST_DIR"
echo "[build-rust] cargo build --release"
cargo build --release

# ── Locate the produced cdylib and copy it as a .node addon ─────────────────
CANDIDATES=(
  "target/release/libdsh_powerdesk_pty.so"
  "target/release/libdsh_powerdesk_pty.dylib"
  "target/release/dsh_powerdesk_pty.dll"
  "target/release/libdsh_powerdesk_pty.dll.lib"
)
SRC=""
for c in "${CANDIDATES[@]}"; do
  if [ -f "$c" ]; then SRC="$c"; break; fi
done
if [ -z "$SRC" ]; then
  echo "[build-rust] could not find the built cdylib in target/release/" >&2
  exit 1
fi

mkdir -p "$DEST"
cp "$SRC" "$DEST/dsh_powerdesk_pty.node"
echo "[build-rust] installed $DEST/dsh_powerdesk_pty.node"
echo "[build-rust] restart DSH (and hard-refresh the page) to load the new binary."
