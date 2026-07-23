#!/usr/bin/env bash
# Prep iOS (Simulator or device) to load vibed from the Next.js server.
# Run on a Mac from the repo root:  npm run mobile:fix:ios
#
# Usage:
#   npm run mobile:fix:ios              → Simulator (http://localhost:2000)
#   CAPACITOR_SERVER_URL=http://192.168.x.x:2000 npm run mobile:fix:ios

set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

SERVER_URL="${CAPACITOR_SERVER_URL:-http://localhost:2000}"

echo "==> Checking Next.js on http://127.0.0.1:2000 ..."
if curl -fsS --max-time 4 "http://127.0.0.1:2000" >/dev/null 2>&1; then
  echo "    OK - server is up"
else
  echo "    NOT RUNNING - start it in another terminal:  npm run dev" >&2
  echo "    Then re-run this script." >&2
  exit 1
fi

echo "==> cap sync ios (server url = ${SERVER_URL})"
export CAPACITOR_SERVER_URL="$SERVER_URL"
npx cap sync ios

if command -v pod >/dev/null 2>&1; then
  echo "==> pod install"
  (cd ios/App && pod install)
else
  echo "    CocoaPods not found — install with:  sudo gem install cocoapods"
  echo "    Then:  cd ios/App && pod install"
fi

echo ""
echo "Done. Open Xcode:"
echo "  npm run mobile:ios"
echo "Then pick a Simulator or iPhone → Run."
echo "App loads: ${SERVER_URL}"
