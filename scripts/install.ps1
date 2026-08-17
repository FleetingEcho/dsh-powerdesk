# =============================================================================
# dsh-powerdesk installer for Windows PowerShell (official CLI + platform
# prebuilt binary download). See scripts/install.sh for the full-featured
# POSIX version. The Rust PTY binary is DOWNLOADED (not built by pnpm), so the
# pnpm 11 strict-dep-builds hurdle does not apply.
#
# Usage:
#   powershell -ExecutionPolicy Bypass -File scripts\install.ps1 [-Version latest] [-Profile web] [-Restart] [-DryRun]
#   powershell -ExecutionPolicy Bypass -File scripts\install.ps1 -Repair [-Profile web]
# =============================================================================
[CmdletBinding()]
param(
  [string]$Version = 'latest',
  [string]$Profile = 'web',
  [switch]$Restart,
  [switch]$DryRun,
  [switch]$Repair
)

$ErrorActionPreference = 'Stop'
$PKG = 'dsh-powerdesk'
$PREBUILT_BASE = if ($env:PREBUILT_BASE) { $env:PREBUILT_BASE } else { 'https://github.com/omdsh-dev/dsh-powerdesk/releases/download' }

function Detect-Triple {
  if ($env:DSH_POWERDESK_PTY_TRIPLE) { return $env:DSH_POWERDESK_PTY_TRIPLE }
  $arch = if ([Environment]::Is64BitOperatingSystem) {
    if ($env:PROCESSOR_ARCHITECTURE -match 'ARM') { 'arm64' } else { 'x64' }
  } else { 'x64' }
  return "win32-$arch-msvc"
}

function Resolve-Tag {
  if ($Version -eq 'latest') {
    $v = (npm view $PKG version 2>$null)
    if (-not $v) { throw "Could not resolve latest version (npm view failed); pass -Version explicitly." }
    return "v$v"
  }
  return if ($Version.StartsWith('v')) { $Version } else { "v$Version" }
}

function Download-Prebuilt([string]$Tag, [string]$DestDir) {
  $triple = Detect-Triple
  $url = "$PREBUILT_BASE/$Tag/dsh_powerdesk_pty-$triple.node"
  if ($DryRun) { Write-Host "[dry-run] would download $url -> $DestDir\dsh_powerdesk_pty.node"; return $true }
  New-Item -ItemType Directory -Force -Path $DestDir | Out-Null
  Write-Host "Downloading prebuilt PTY binary: $url"
  try {
    Invoke-WebRequest -Uri $url -OutFile (Join-Path $DestDir 'dsh_powerdesk_pty.node') -UseBasicParsing
    return $true
  } catch {
    Write-Warning "Prebuilt download failed: $_"
    return $false
  }
}

function Ensure-Prebuilt([string]$PluginRoot, [string]$Tag) {
  $dest = Join-Path $PluginRoot "prebuilt\$(Detect-Triple)"
  if (Download-Prebuilt $Tag $dest) { return }
  Write-Warning 'Falling back to building from source (requires the Rust toolchain).'
  $script = Join-Path $PluginRoot 'scripts\build-rust.sh'
  if (Test-Path $script) {
    if (Get-Command cargo -ErrorAction SilentlyContinue) {
      & bash $script
      return
    }
    Write-Warning 'cargo not found on PATH; cannot build from source.'
  }
  throw 'Could not obtain the platform PTY binary. Install the Rust toolchain and run scripts/build-rust.sh, or set $env:PREBUILT_BASE.'
}

# ── Repair ──────────────────────────────────────────────────────────────────
if ($Repair) {
  $dshHome = if ($env:DSH_HOME) { $env:DSH_HOME } else { Join-Path $env:USERPROFILE '.dsh' }
  $profileDir = Join-Path $dshHome "profiles\$Profile"
  $pluginRoot = Join-Path $profileDir "node_modules\$PKG"
  if (-not (Test-Path $pluginRoot)) { $pluginRoot = Join-Path $profileDir "plugins\$PKG" }
  if (-not (Test-Path $pluginRoot)) { throw "Could not find an installed $PKG (profile=$Profile). Install once first." }
  $ver = (node -p "require('$pluginRoot/package.json').version" 2>$null)
  $tag = if ($ver) { "v$ver" } else { Resolve-Tag }
  Ensure-Prebuilt $pluginRoot $tag
  Write-Host 'Repair complete. Restart DSH and hard-refresh the page.'
  return
}

# ── Install ─────────────────────────────────────────────────────────────────
if ($DryRun) {
  Write-Host "[dry-run] would run: dsh plugin --profile $Profile add $PKG@$Version"
  Write-Host "[dry-run] then download the platform prebuilt (triple=$(Detect-Triple))"
  return
}

$tag = Resolve-Tag
$dsh = if ($env:DSH_CMD) { $env:DSH_CMD } else { 'dsh' }
if (Get-Command $dsh -ErrorAction SilentlyContinue) {
  & $dsh plugin --profile $Profile add "$PKG@$Version"
} elseif (Get-Command npx -ErrorAction SilentlyContinue) {
  & npx -y --package '@deepseek-ai/dsh' dsh plugin --profile $Profile add "$PKG@$Version"
} else {
  throw 'dsh command not found (set $env:DSH_CMD or install @deepseek-ai/dsh).'
}

$dshHome = if ($env:DSH_HOME) { $env:DSH_HOME } else { Join-Path $env:USERPROFILE '.dsh' }
$pluginRoot = Join-Path $dshHome "profiles\$Profile\node_modules\$PKG"
if (-not (Test-Path $pluginRoot)) {
  Write-Warning "Could not find $pluginRoot; skipping prebuilt download (run -Repair later)."
} else {
  Ensure-Prebuilt $pluginRoot $tag
}

Write-Host "Install complete: $PKG@$Version"
if ($Restart -and (Get-Command pm2 -ErrorAction SilentlyContinue)) { pm2 restart dsh-web }
else { Write-Host 'Next: restart DSH and hard-refresh (Ctrl+Shift+R) to load the new build.' }
