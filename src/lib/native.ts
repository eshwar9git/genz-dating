"use client";

import { useEffect } from "react";
import { Capacitor } from "@capacitor/core";

/**
 * Native polish + deep-link handling for Stripe return URLs (vibed://…).
 */
export function useNativeShell() {
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    let removeBack: (() => void) | undefined;
    let removeUrl: (() => void) | undefined;
    let cancelled = false;

    (async () => {
      try {
        const { StatusBar, Style } = await import("@capacitor/status-bar");
        const { SplashScreen } = await import("@capacitor/splash-screen");
        const { App } = await import("@capacitor/app");

        if (cancelled) return;

        await StatusBar.setStyle({ style: Style.Dark });
        if (Capacitor.getPlatform() === "android") {
          await StatusBar.setBackgroundColor({ color: "#07080c" });
        }
        await SplashScreen.hide({ fadeOutDuration: 400 });

        // Don't block shell setup if AdMob is slow/offline
        void import("@/lib/ads")
          .then(({ initAdMob }) => initAdMob())
          .catch(() => undefined);

        const back = await App.addListener("backButton", ({ canGoBack }) => {
          if (canGoBack) window.history.back();
          else App.exitApp();
        });
        removeBack = () => back.remove();

        const urlOpen = await App.addListener("appUrlOpen", async ({ url }) => {
          try {
            const { Browser } = await import("@capacitor/browser");
            await Browser.close().catch(() => undefined);
          } catch {
            // ignore
          }

          // vibed://premium/success?tier=plus&session_id=...
          // or vibed:///premium/success?...
          const cleaned = url
            .replace(/^vibed:\/\//, "")
            .replace(/^\/+/, "");
          const [pathAndQuery] = cleaned.split("#");
          const [path, query = ""] = pathAndQuery.split("?");
          const target = `/${path}${query ? `?${query}` : ""}`;
          if (typeof window !== "undefined") {
            window.location.href = target;
          }
        });
        removeUrl = () => urlOpen.remove();
      } catch {
        // Web / missing plugins
      }
    })();

    return () => {
      cancelled = true;
      removeBack?.();
      removeUrl?.();
    };
  }, []);
}

/** Light haptic feedback for swipe actions on native. */
export async function nativeHaptic(
  style: "light" | "medium" | "heavy" = "medium"
) {
  if (!Capacitor.isNativePlatform()) return;
  try {
    const { Haptics, ImpactStyle } = await import("@capacitor/haptics");
    const map = {
      light: ImpactStyle.Light,
      medium: ImpactStyle.Medium,
      heavy: ImpactStyle.Heavy,
    };
    await Haptics.impact({ style: map[style] });
  } catch {
    // ignore
  }
}
