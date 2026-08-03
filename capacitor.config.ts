import type { CapacitorConfig } from "@capacitor/cli";

/**
 * vibed native shell (iOS + Android) via Capacitor.
 *
 * Default: http://localhost:2000 + `adb reverse tcp:2000 tcp:2000`
 * (works for USB physical phones AND the Android emulator).
 *
 * Alternatives via CAPACITOR_SERVER_URL:
 * - Emulator without reverse: http://10.0.2.2:2000
 * - Phone on Wi‑Fi (no USB):   http://YOUR_PC_LAN_IP:2000
 * - Production:                https://your-domain.com
 */
const serverUrl =
  process.env.CAPACITOR_SERVER_URL || "http://localhost:2000";
const isHttps = serverUrl.startsWith("https://");

const config: CapacitorConfig = {
  appId: "app.vibed.dating",
  appName: "vibed",
  webDir: "mobile/www",
  server: {
    url: serverUrl,
    cleartext: !isHttps && serverUrl.startsWith("http://"),
    androidScheme: isHttps ? "https" : "http",
    allowNavigation: [
      "checkout.stripe.com",
      "*.stripe.com",
      "localhost",
      "10.0.2.2",
      "127.0.0.1",
      // Dev LAN hosts (physical phone / Mac → Next.js)
      "192.168.*.*",
      "10.*.*.*",
      "172.*.*.*",
    ],
    // Shown inside the WebView if the live server URL fails to load
    errorPath: "error.html",
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 800,
      launchAutoHide: true,
      backgroundColor: "#07080c",
      showSpinner: false,
      androidSplashResourceName: "splash",
      splashFullScreen: true,
      splashImmersive: true,
    },
    StatusBar: {
      style: "DARK",
      backgroundColor: "#07080c",
    },
    Keyboard: {
      resize: "body",
      resizeOnFullScreen: true,
    },
  },
  ios: {
    contentInset: "automatic",
    preferredContentMode: "mobile",
    backgroundColor: "#07080c",
    scheme: "vibed",
  },
  android: {
    allowMixedContent: !isHttps,
    backgroundColor: "#07080c",
  },
};

export default config;
