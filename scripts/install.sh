#!/usr/bin/env bash
# =============================================================================
# dsh-powerdesk 一键安装脚本（官方 CLI 方式 + 平台预编译二进制下载）
#
# 通过 DSH 官方插件命令安装 npm 包并自动挂载：
#   dsh plugin --profile <name> add dsh-powerdesk@<version>
#
# 包内声明了 dsh.bundle.patch（cordis.patch.yml）：CLI 的 bundle 协调会把它
# 自动加进 profile 的 dsh.profile.bundles，下次启动即挂载——无需手动写
# cordis.patch.yml 挂载行。
#
# 与 node-pty 插件不同，本插件的 Rust 原生 PTY 二进制是**下载**的（不走 pnpm
# 的构建脚本），因此不会触发 pnpm 11 的 strict-dep-builds 拦截。
#
# 用法：
#   bash scripts/install.sh [版本] [--restart] [--dry-run] [--profile <名>]
#   bash scripts/install.sh --repair [--profile <名>] [--dry-run]
#
#   版本        npm 版本号/范围，缺省为 latest。
#   --repair    修复模式：不重装插件，只重新下载/构建平台预编译 PTY 二进制
#               （终端提示「Rust PTY 加载失败」时用它）。
#   --profile   目标 profile 名（缺省 web）。
#   --restart   装完后尝试 `pm2 restart dsh-web`（无 pm2 时仅打印提示）。
#   --dry-run   只打印将要执行的操作，不写任何文件。
#   -h/--help   打印本帮助。
#
# 环境（均可省略）：
#   DSH_HOME           默认 ~/.dsh
#   DSH_CMD            默认优先 PATH 上的 `dsh`，缺省回退 npx
#   DSH_POWERDESK_PTY_TRIPLE  覆盖探测到的平台 triple（如 linux-x64-musl）
#   PREBUILT_BASE      预编译二进制下载基址（缺省 GitHub releases）
# =============================================================================
set -euo pipefail

PKG="dsh-powerdesk"
DSH_CMD="${DSH_CMD:-dsh}"
RESTART=false
DRY_RUN=false
REPAIR=false
VERSION_SPEC="latest"
PROFILE_NAME="web"

for arg in "$@"; do
  case "$arg" in
    -h|--help)
      sed -n '2,40p' "${BASH_SOURCE[0]:-$0}" 2>/dev/null || true
      exit 0
      ;;
  esac
done

while [ $# -gt 0 ]; do
  case "$1" in
    --restart) RESTART=true ;;
    --dry-run) DRY_RUN=true ;;
    --repair) REPAIR=true ;;
    --profile)
      [ $# -lt 2 ] && { echo "--profile 需要一个 profile 名" >&2; exit 2; }
      PROFILE_NAME="$2"; shift ;;
    -*) echo "未知参数: $1（用 -h 查看用法）" >&2; exit 2 ;;
    *) VERSION_SPEC="$1" ;;
  esac
  shift
done

say()  { printf '\033[32m[install]\033[0m %s\n' "$*"; }
warn() { printf '\033[33m[warn]\033[0m %s\n' "$*" >&2; }
die()  { printf '\033[31m[error]\033[0m %s\n' "$*" >&2; exit 1; }

# ── 平台 triple 探测（与 src/rust-pty-deps.ts 一致） ────────────────────────
detect_triple() {
  if [ -n "${DSH_POWERDESK_PTY_TRIPLE:-}" ]; then echo "$DSH_POWERDESK_PTY_TRIPLE"; return; fi
  local os arch
  os="$(uname -s)"; arch="$(uname -m)"
  case "$os" in
    Darwin) [ "$arch" = "arm64" ] && echo "darwin-arm64" || echo "darwin-x64" ;;
    Linux)  [ "$arch" = "aarch64" ] && echo "linux-arm64-gnu" || echo "linux-x64-gnu" ;;
    MINGW*|MSYS*|CYGWIN*) [ "$arch" = "aarch64" ] && echo "win32-arm64-msvc" || echo "win32-x64-msvc" ;;
    *) die "无法识别的平台：$os（用 DSH_POWERDESK_PTY_TRIPLE 覆盖）" ;;
  esac
}

TRIPLE="$(detect_triple)"
PREBUILT_BASE="${PREBUILT_BASE:-https://github.com/FleetingEcho/dsh-powerdesk/releases/download}"

# 解析 "latest" → 最新版本的 tag 形如 v0.1.0；显式版本直接用作 tag 前缀。
resolve_tag() {
  if [ "$1" = "latest" ]; then
    # 通过 npm registry 取最新版本号
    local v
    v="$(npm view "$PKG" version 2>/dev/null || true)"
    [ -z "$v" ] && die "无法解析最新版本（npm view 失败）；请显式传版本号"
    echo "v$v"
  else
    case "$1" in
      v*) echo "$1" ;;
      *) echo "v$1" ;;
    esac
  fi
}

download_prebuilt() {
  local tag="$1" dest_dir="$2"
  local url="$PREBUILT_BASE/$tag/dsh_powerdesk_pty-$TRIPLE.node"
  mkdir -p "$dest_dir"
  if [ "$DRY_RUN" = true ]; then
    say "[dry-run] 将下载 $url -> $dest_dir/dsh_powerdesk_pty.node"
    return
  fi
  say "下载预编译 PTY 二进制：$url"
  if command -v curl >/dev/null 2>&1; then
    curl -fsSL "$url" -o "$dest_dir/dsh_powerdesk_pty.node" || return 1
  elif command -v wget >/dev/null 2>&1; then
    wget -qO "$dest_dir/dsh_powerdesk_pty.node" "$url" || return 1
  else
    warn "未找到 curl/wget，无法下载预编译二进制"
    return 1
  fi
  chmod +x "$dest_dir/dsh_powerdesk_pty.node" 2>/dev/null || true
  say "已安装 $dest_dir/dsh_powerdesk_pty.node"
}

ensure_prebuilt() {
  local plugin_root="$1" tag="$2"
  local dest="$plugin_root/prebuilt/$TRIPLE"
  if download_prebuilt "$tag" "$dest"; then
    return 0
  fi
  warn "预编译二进制下载失败，尝试从源码构建（需要 Rust 工具链）…"
  if [ -x "$plugin_root/scripts/build-rust.sh" ]; then
    ( cd "$plugin_root" && DSH_POWERDESK_PTY_TRIPLE="$TRIPLE" bash scripts/build-rust.sh ) && return 0
  fi
  die "无法获取平台 PTY 二进制。请安装 Rust 工具链后运行 scripts/build-rust.sh，或设置 PREBUILT_BASE 指向可用的下载源。"
}

# ripgrep（Search 标签页用）：与 PTY 二进制同一套下载约定，但非致命 —
# search-deps.ts 在找不到预编译副本时还会回退到 PATH 上的 rg，很多开发机
# 已经装过（Homebrew/Cargo/VSCode），所以下载失败只警告，不中断安装。
download_ripgrep() {
  local tag="$1" dest_dir="$2"
  local url="$PREBUILT_BASE/$tag/rg-$TRIPLE"
  mkdir -p "$dest_dir"
  if [ "$DRY_RUN" = true ]; then
    say "[dry-run] 将下载 $url -> $dest_dir/rg"
    return
  fi
  say "下载预编译 ripgrep 二进制：$url"
  if command -v curl >/dev/null 2>&1; then
    curl -fsSL "$url" -o "$dest_dir/rg" || return 1
  elif command -v wget >/dev/null 2>&1; then
    wget -qO "$dest_dir/rg" "$url" || return 1
  else
    return 1
  fi
  chmod +x "$dest_dir/rg" 2>/dev/null || true
  say "已安装 $dest_dir/rg"
}

ensure_ripgrep() {
  local plugin_root="$1" tag="$2"
  local dest="$plugin_root/prebuilt/$TRIPLE"
  if download_ripgrep "$tag" "$dest"; then
    return 0
  fi
  warn "ripgrep 预编译二进制下载失败；search-deps.ts 会回退到 PATH 上的 rg（如果有的话）。"
}

# ── 修复模式：只重装二进制 ─────────────────────────────────────────────────
if [ "$REPAIR" = true ]; then
  DSH_HOME="${DSH_HOME:-$HOME/.dsh}"
  PROFILE_DIR="$DSH_HOME/profiles/$PROFILE_NAME"
  PLUGIN_ROOT="$PROFILE_DIR/node_modules/$PKG"
  [ -d "$PLUGIN_ROOT" ] || PLUGIN_ROOT="$PROFILE_DIR/plugins/$PKG"
  [ -d "$PLUGIN_ROOT" ] || die "未找到已安装的 $PKG（profile=$PROFILE_NAME）。请先正常安装一次。"
  # 已安装版本的 package.json 版本 → tag
  TAG="v$(node -p "require('$PLUGIN_ROOT/package.json').version" 2>/dev/null || echo latest)"
  ensure_prebuilt "$PLUGIN_ROOT" "$TAG"
  ensure_ripgrep "$PLUGIN_ROOT" "$TAG"
  say "修复完成。请重启 DSH 并硬刷新页面。"
  exit 0
fi

# ── 正常安装：dsh plugin add（bundle 通道）+ 下载二进制 ───────────────────
if [ "$DRY_RUN" = true ]; then
  say "[dry-run] 将运行：$DSH_CMD plugin --profile $PROFILE_NAME add $PKG@$VERSION_SPEC"
  say "[dry-run] 随后下载平台预编译二进制（triple=$TRIPLE）"
  exit 0
fi

TAG="$(resolve_tag "$VERSION_SPEC")"
if command -v "$DSH_CMD" >/dev/null 2>&1; then
  "$DSH_CMD" plugin --profile "$PROFILE_NAME" add "$PKG@$VERSION_SPEC" || die "dsh plugin add 失败"
elif command -v npx >/dev/null 2>&1; then
  npx -y --package @deepseek-ai/dsh dsh plugin --profile "$PROFILE_NAME" add "$PKG@$VERSION_SPEC" || die "dsh plugin add 失败"
else
  die "未找到 dsh 命令（设置 DSH_CMD 或安装 @deepseek-ai/dsh）"
fi

DSH_HOME="${DSH_HOME:-$HOME/.dsh}"
PROFILE_DIR="$DSH_HOME/profiles/$PROFILE_NAME"
PLUGIN_ROOT="$PROFILE_DIR/node_modules/$PKG"
[ -d "$PLUGIN_ROOT" ] || PLUGIN_ROOT="$PROFILE_DIR/plugins/$PKG"
if [ ! -d "$PLUGIN_ROOT" ]; then
  warn "未找到 $PLUGIN_ROOT；跳过预编译二进制下载（请稍后运行 --repair）"
else
  ensure_prebuilt "$PLUGIN_ROOT" "$TAG"
  ensure_ripgrep "$PLUGIN_ROOT" "$TAG"
fi

say "安装完成：$PKG@$VERSION_SPEC"
if [ "$RESTART" = true ]; then
  if command -v pm2 >/dev/null 2>&1; then
    pm2 restart dsh-web || warn "pm2 restart 失败，请手动重启 DSH"
  else
    warn "未找到 pm2，请手动重启 DSH（如：pm2 restart dsh-web 或 dsh web）"
  fi
else
  say "下一步：重启 DSH 并硬刷新（Cmd/Ctrl+Shift+R）使新副本生效。"
fi
