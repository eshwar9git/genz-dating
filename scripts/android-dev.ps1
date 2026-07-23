# Prep Android emulator to load vibed from the Next.js server on this PC.
# Usage (from repo root):  npm run mobile:fix:android

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

Write-Host "==> Emulator devices"
& $adb devices

Write-Host "==> adb reverse tcp:2000 (backup if app uses localhost)"
& $adb reverse tcp:2000 tcp:2000
& $adb reverse --list

Write-Host "==> cap sync android (server url = http://10.0.2.2:2000)"
$env:CAPACITOR_SERVER_URL = "http://10.0.2.2:2000"
npx cap sync android

Write-Host ""
Write-Host "Done. In Android Studio: Run vibed again (reinstalls config)." -ForegroundColor Green
Write-Host "Emulator loads http://10.0.2.2:2000 (your PC's localhost)."
