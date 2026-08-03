# Prep Android devices to load vibed from the Next.js server on this PC.
# Usage (from repo root):  npm run mobile:fix:android
#
# Default Cap URL: http://localhost:2000 + adb reverse (works for USB phone AND emulator).
# Override:
#   $env:CAPACITOR_SERVER_URL="http://10.0.2.2:2000"   # emulator only
#   $env:CAPACITOR_SERVER_URL="http://192.168.x.x:2000" # phone on Wi‑Fi (no USB)

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

$adbCandidates = @(
  "$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe",
  "$env:ANDROID_HOME\platform-tools\adb.exe"
)
$adb = $adbCandidates | Where-Object { Test-Path $_ } | Select-Object -First 1
if (-not $adb) {
  Write-Error "adb not found. Install Android SDK platform-tools or set ANDROID_HOME."
}

Write-Host "==> Checking Next.js on http://127.0.0.1:2000 ..."
$serverOk = $false
try {
  $null = Invoke-WebRequest -Uri "http://127.0.0.1:2000" -UseBasicParsing -TimeoutSec 4
  $serverOk = $true
} catch {
  $serverOk = $false
}

if (-not $serverOk) {
  Write-Host "    NOT RUNNING - start it in another terminal:  npm run dev" -ForegroundColor Yellow
  Write-Host "    Then re-run this script."
  exit 1
}
Write-Host "    OK - server is up"

Write-Host "==> Devices"
& $adb devices

$serials = & $adb devices | Select-String -Pattern "^\S+\s+device$" | ForEach-Object {
  ($_ -split "\s+")[0]
}
if (-not $serials) {
  Write-Host "    No devices/emulators online." -ForegroundColor Yellow
}

$serverUrl = if ($env:CAPACITOR_SERVER_URL) { $env:CAPACITOR_SERVER_URL } else { "http://localhost:2000" }

Write-Host "==> adb reverse tcp:2000 on each device (for localhost Cap URL)"
foreach ($s in $serials) {
  & $adb -s $s reverse tcp:2000 tcp:2000 | Out-Null
  Write-Host "    $s -> $(& $adb -s $s reverse --list)"
}

Write-Host "==> cap sync android (server url = $serverUrl)"
$env:CAPACITOR_SERVER_URL = $serverUrl
npx cap sync android

Write-Host ""
Write-Host "Done. Rebuild/Run vibed so the new Cap URL is installed." -ForegroundColor Green
Write-Host "  USB phone + emulator: http://localhost:2000 (with adb reverse above)"
Write-Host "  Emulator-only alt:     `$env:CAPACITOR_SERVER_URL='http://10.0.2.2:2000'"
Write-Host "  Wi‑Fi phone (no USB):  `$env:CAPACITOR_SERVER_URL='http://YOUR_PC_IP:2000'"
