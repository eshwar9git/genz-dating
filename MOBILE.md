# vibed — iOS & Android apps

Native shells are set up with **Capacitor**. They load your Next.js app (same UI, auth, payments, reels) inside a real iOS/Android project.

```
App ID:  app.vibed.dating
Name:    vibed
Folders: /android   /ios   /mobile/www
```

---

## Prerequisites

| Platform | You need |
|---|---|
| **Android** | [Android Studio](https://developer.android.com/studio) + SDK + emulator or device |
| **iOS** | **Mac** + [Xcode](https://developer.apple.com/xcode/) + CocoaPods (simulator or device) |
| **Both** | Node.js, this repo, `npm install` |

---

## 1. Start the web app

```bash
npm run dev
```

App runs at `http://localhost:2000`.

---

## 2. Point the native apps at your server

Default in `capacitor.config.ts` is `http://10.0.2.2:2000` (Android emulator → your PC).

| Target | Set `CAPACITOR_SERVER_URL` to |
|---|---|
| Android emulator | `http://10.0.2.2:2000` (default, no reverse needed) |
| Android emulator (alt) | `http://localhost:2000` + `adb reverse tcp:2000 tcp:2000` |
| iOS simulator | `http://localhost:2000` |
| Physical phone (same Wi‑Fi) | `http://YOUR_PC_IP:2000` (e.g. `http://192.168.1.42:2000`) |
| Production | `https://your-domain.com` |

**Windows — one-shot fix for the emulator:**

```powershell
# Terminal 1 — keep running
npm run dev

# Terminal 2
npm run mobile:fix:android
```

Then in Android Studio: **Run** (reinstalls the app with the synced server URL).

If you see **Can't reach the vibed server**:
1. Confirm `http://localhost:2000` opens in your PC browser
2. Restart `npm run dev` (needed after `next.config` changes)
3. `npm run mobile:fix:android`
4. Android Studio → **Run** again
5. Optional check: on the emulator open Chrome to `http://10.0.2.2:2000` — if that fails, Windows Firewall may be blocking Node

**iOS / production override:**

```powershell
$env:CAPACITOR_SERVER_URL="http://localhost:2000"
npm run mobile:sync
```

```powershell
$env:CAPACITOR_SERVER_URL="https://your-domain.com"
npm run mobile:sync
```

---

## 3. Open & run

### Android

```bash
npm run mobile:sync
npm run mobile:android
```

In Android Studio: pick an emulator or device → **Run**.

Or:

```bash
npm run mobile:run:android
```

### iOS (Mac only — Apple requires Xcode)

**You cannot build or run the iOS app on Windows.** Copy `C:\AI\genz-dating` to a Mac, then:

```bash
# Terminal 1 — keep running
npm install
npm run dev

# Terminal 2 — sync for Simulator + CocoaPods
npm run mobile:fix:ios
npm run mobile:ios
```

In Xcode: select an **iPhone Simulator** (or a plugged-in iPhone) → set **Signing Team** → **Run**.

| Target | `CAPACITOR_SERVER_URL` |
|---|---|
| iOS Simulator | `http://localhost:2000` (default from `mobile:fix:ios`) |
| Physical iPhone (same Wi‑Fi as Mac) | `http://YOUR_MAC_LAN_IP:2000` then `npm run mobile:fix:ios` |

**From Windows (prep only):** sync the `ios/` folder so it’s ready to open on a Mac:

```powershell
npm run mobile:sync:ios
```

---

## NPM scripts

| Script | What it does |
|---|---|
| `npm run mobile:sync` | Copy config + plugins into native projects |
| `npm run mobile:sync:ios` | Sync iOS for Simulator (`localhost:2000`) — works on Windows |
| `npm run mobile:fix:ios` | Mac: sync iOS + `pod install` |
| `npm run mobile:android` | Open Android Studio |
| `npm run mobile:ios` | Open Xcode (Mac) |
| `npm run mobile:run:android` | Build & run on Android |
| `npm run mobile:run:ios` | Build & run on iOS (Mac) |

---

## What’s included natively

- Splash screen (ink background)
- Status bar styling
- Android back button → history / exit
- Haptics on Ghost / Vibe / Aura / Yoink
- Safe-area padding
- Camera / photo library usage strings (iOS)
- Stripe Checkout via system browser + `vibed://` deep-link return
- **AdMob rewarded ads** (`@capacitor-community/admob`) for Free-tier likes / reels / rewinds

---

## AdMob rewarded ads (Android & iOS)

On native, “Watch ad” opens a real **Google AdMob** rewarded video. On web, the same UI uses a short demo player.

| Piece | Where |
|---|---|
| Plugin | `@capacitor-community/admob` |
| Helper | `src/lib/ads.ts` (`initAdMob`, `showRewardedAd`) |
| UI | `src/components/rewarded-ad.tsx` |
| Android App ID | `android/app/src/main/res/values/strings.xml` → `admob_app_id` + manifest meta-data |
| iOS App ID | `ios/App/App/Info.plist` → `GADApplicationIdentifier` |
| Rewarded unit | `NEXT_PUBLIC_ADMOB_REWARDED_UNIT_ID` (defaults to Google’s sample unit) |

**Dev defaults (Google sample IDs — safe for emulator):**

- App ID: `ca-app-pub-3940256099942544~3347511713`
- Rewarded unit: `ca-app-pub-3940256099942544/5224354917`

**Production:**

1. Create an AdMob app for `app.vibed.dating` and a **Rewarded** ad unit  
2. Put the App ID in `strings.xml` / `Info.plist`  
3. Set in `.env` (and rebuild / redeploy the Next server the WebView loads):

```env
NEXT_PUBLIC_ADMOB_REWARDED_UNIT_ID=ca-app-pub-xxxxxxxx/zzzzzzzzzz
NEXT_PUBLIC_ADMOB_TESTING=false
```

4. `npm run mobile:sync` (or `mobile:fix:android`) → rebuild in Android Studio / Xcode  

**Test on Android emulator:** hit a Free-tier limit → **Watch ad** → Google test rewarded video → quota increases.

---

## Stripe on iOS & Android

Premium uses the same Stripe Checkout API as web. On native:

1. App calls `POST /api/checkout` with `platform: "native"`
2. Checkout opens in the **system browser** (`@capacitor/browser`)
3. Success/cancel URLs are `vibed://premium/success?tier=…` and `vibed://premium/cancel`
4. Deep links reopen the app; `useNativeShell` closes the browser and navigates to `/premium/success` or `/premium/cancel`

**Requirements**

- `STRIPE_SECRET_KEY` + `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` on the Next.js server
- Android intent filter for scheme `vibed` (already in `AndroidManifest.xml`)
- iOS `CFBundleURLTypes` for scheme `vibed` (already in `Info.plist`)
- After plugin/config changes: `npm run mobile:sync`

**Note:** App Store / Play rules around digital subscriptions can require Apple IAP / Google Play Billing for some digital goods. Stripe-in-browser is fine for development and many web-first flows — confirm compliance before store submission.

---

## Store release checklist

1. Deploy Next.js to HTTPS (Vercel) and set `CAPACITOR_SERVER_URL` to that URL  
2. Replace launcher icons in `android/app/src/main/res/` and `ios/App/App/Assets.xcassets`  
3. Set version codes in Android Studio / Xcode  
4. Apple Developer account ($99/yr) + App Store Connect  
5. Google Play Console (one-time fee)  
6. Privacy Policy + age rating questionnaires  
7. Confirm subscription compliance (Stripe browser vs Apple IAP / Play Billing)  
8. Replace AdMob sample App ID / rewarded unit with your production IDs (`strings.xml`, `Info.plist`, `.env`)  
9. `npm run mobile:sync` → archive → upload  

---

## Architecture note

These are **native wrappers** around the live vibed web app (not a full React Native rewrite). You get App Store / Play distribution, splash, haptics, and device chrome, while features stay in Next.js so one codebase powers web + mobile.
