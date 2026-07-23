# Sync the iOS Capacitor project from Windows (cannot build/run iOS here).
# Prepares ios/ for a Mac: default Simulator URL http://localhost:2000
# Usage (from repo root):  npm run mobile:sync:ios

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

$serverUrl = if ($env:CAPACITOR_SERVER_URL) { $env:CAPACITOR_SERVER_URL } else { "http://localhost:2000" }

Write-Host "==> Checking Next.js on http://127.0.0.1:2000 ..."
$serverOk = $false
try {
  $null = Invoke-WebRequest -Uri "http://127.0.0.1:2000" -UseBasicParsing -TimeoutSec 4
  $serverOk = $true
} catch {
  $serverOk = $false
}

if (-not $serverOk) {
  Write-Host "    Server not required for sync, but you'll need npm run dev on the Mac." -ForegroundColor Yellow
} else {
  Write-Host "    OK - server is up"
}

Write-Host "==> cap sync ios (server url = $serverUrl)"
$env:CAPACITOR_SERVER_URL = $serverUrl
npx cap sync ios

Write-Host ""
Write-Host "iOS project synced." -ForegroundColor Green
Write-Host "Next steps on a Mac:"
Write-Host "  1. Copy/clone this repo to the Mac"
Write-Host "  2. npm install && npm run dev"
Write-Host "  3. npm run mobile:fix:ios"
Write-Host "  4. npm run mobile:ios  (opens Xcode) → Run"
Write-Host "Simulator uses http://localhost:2000"
Write-Host "Physical iPhone: set CAPACITOR_SERVER_URL=http://YOUR_MAC_LAN_IP:2000 then re-sync"
