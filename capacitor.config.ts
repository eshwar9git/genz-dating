import type { CapacitorConfig } from "@capacitor/cli";

/**
 * vibed native shell (iOS + Android) via Capacitor.
 *
 * Android emulator default: http://10.0.2.2:2000 (emulator alias for host loopback).
 * No adb reverse required. Override with CAPACITOR_SERVER_URL for device/prod.
 *
 * Prod: set CAPACITOR_SERVER_URL to your deployed HTTPS URL before `npx cap sync`.
 */
const serverUrl =
  process.env.CAPACITOR_SERVER_URL || "http://10.0.2.2:2000";

const config: CapacitorConfig = {
  appId: "app.vibed.dating",
  appName: "vibed",
  webDir: "mobile/www",
  server: {
    url: serverUrl,
    cleartext: serverUrl.startsWith("http://"),
    androidScheme: "http",
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
    allowMixedContent: true,
    backgroundColor: "#07080c",
  },
};

export default config;
