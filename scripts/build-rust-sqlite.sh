#!/usr/bin/env bash
# =============================================================================
# Build the dsh-powerdesk-sqlite Rust native module from source and place the
# produced cdylib at prebuilt/<triple>/dsh_powerdesk_sqlite.node, where the host
# half's lazy loader (src/rust-sqlite-deps.ts) finds it by platform triple.
#
# Sibling to scripts/build-rust.sh (the PTY crate); kept separate so a calendar
# rebuild never touches the terminal binary and vice versa.
#
# Requires the Rust toolchain (rustup). rusqlite's "bundled" feature compiles
# the SQLite amalgamation, so no system libsqlite3 is needed (a C compiler is
# — the same requirement as the PTY crate's portable-pty native deps).
#
# Usage:
#   bash scripts/build-rust-sqlite.sh               # build for the host triple
#   DSH_POWERDESK_SQLITE_TRIPLE=linux-x64-musl bash scripts/build-rust-sqlite.sh
#
# Environment:
#   DSH_POWERDESK_SQLITE_TRIPLE  override the detected platform triple
# =============================================================================
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
RUST_DIR="$ROOT/rust-sqlite"
OUT_DIR="$ROOT/prebuilt"

# ── Detect the platform triple (mirrors src/rust-pty-deps.ts) ───────────────
detect_triple() {
  if [ -n "${DSH_POWERDESK_SQLITE_TRIPLE:-}" ]; then
    echo "$DSH_POWERDESK_SQLITE_TRIPLE"
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
echo "[build-rust-sqlite] triple=$TRIPLE dest=$DEST"

command -v cargo >/dev/null 2>&1 || {
  echo "[build-rust-sqlite] cargo not found. Install the Rust toolchain: https://rustup.rs" >&2
  exit 1
}

cd "$RUST_DIR"
echo "[build-rust-sqlite] cargo build --release"
cargo build --release

# ── Locate the produced cdylib and copy it as a .node addon ─────────────────
CANDIDATES=(
  "target/release/libdsh_powerdesk_sqlite.so"
  "target/release/libdsh_powerdesk_sqlite.dylib"
  "target/release/dsh_powerdesk_sqlite.dll"
  "target/release/libdsh_powerdesk_sqlite.dll.lib"
)
SRC=""
for c in "${CANDIDATES[@]}"; do
  if [ -f "$c" ]; then SRC="$c"; break; fi
done
if [ -z "$SRC" ]; then
  echo "[build-rust-sqlite] could not find the built cdylib in target/release/" >&2
  exit 1
fi

mkdir -p "$DEST"
cp "$SRC" "$DEST/dsh_powerdesk_sqlite.node"
echo "[build-rust-sqlite] installed $DEST/dsh_powerdesk_sqlite.node"
echo "[build-rust-sqlite] restart DSH (and hard-refresh the page) to load the new binary."
