"use client";

import { useEffect } from "react";
import { Capacitor } from "@capacitor/core";
import { useLocaleStore } from "@/lib/locale-store";
import { useAppStore } from "@/lib/store";
import { useNativeShell } from "@/lib/native";

export function Providers({ children }: { children: React.ReactNode }) {
  const setHydrated = useAppStore((s) => s.setHydrated);
  const setLocaleHydrated = useLocaleStore((s) => s.setHydrated);
  const syncFromCountry = useLocaleStore((s) => s.syncFromCountry);
  const locale = useLocaleStore((s) => s.locale);
  const dir = useLocaleStore((s) => s.dir);
  const countryCode = useAppStore((s) => s.user?.countryCode);
  const appHydrated = useAppStore((s) => s.hydrated);

  useNativeShell();

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        await Promise.all([
          useAppStore.persist.rehydrate(),
          useLocaleStore.persist.rehydrate(),
        ]);
      } catch {
        // Corrupt storage / private mode — still unblock the UI
      } finally {
        if (!cancelled) {
          setHydrated(true);
          setLocaleHydrated(true);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [setHydrated, setLocaleHydrated]);

  useEffect(() => {
    if (!appHydrated || !countryCode) return;
    syncFromCountry(countryCode);
  }, [appHydrated, countryCode, syncFromCountry]);

  useEffect(() => {
    if (!appHydrated) return;
    document.documentElement.lang = locale;
    document.documentElement.dir = dir();
    if (Capacitor.isNativePlatform()) {
      document.documentElement.classList.add("native-app");
    }
  }, [appHydrated, locale, dir]);

  return <>{children}</>;
}
