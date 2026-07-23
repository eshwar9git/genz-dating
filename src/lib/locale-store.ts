"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getDict, localeFromCountry, type Locale } from "@/lib/i18n";
import { LOCALES } from "@/lib/i18n/locales";

interface LocaleState {
  locale: Locale;
  autoFromCountry: boolean;
  hydrated: boolean;
  setHydrated: (v: boolean) => void;
  setLocale: (locale: Locale) => void;
  setAutoFromCountry: (v: boolean) => void;
  syncFromCountry: (countryCode?: string) => void;
  t: () => ReturnType<typeof getDict>;
  dir: () => "ltr" | "rtl";
}

export const useLocaleStore = create<LocaleState>()(
  persist(
    (set, get) => ({
      locale: "en",
      autoFromCountry: true,
      hydrated: false,
      setHydrated: (v) => set({ hydrated: v }),
      setLocale: (locale) => set({ locale, autoFromCountry: false }),
      setAutoFromCountry: (v) => set({ autoFromCountry: v }),
      syncFromCountry: (countryCode) => {
        if (!get().autoFromCountry) return;
        set({ locale: localeFromCountry(countryCode) });
      },
      t: () => getDict(get().locale),
      dir: () =>
        LOCALES.find((l) => l.code === get().locale)?.dir === "rtl" ? "rtl" : "ltr",
    }),
    {
      name: "vibed-locale",
      skipHydration: true,
      partialize: (s) => ({
        locale: s.locale,
        autoFromCountry: s.autoFromCountry,
      }),
    }
  )
);
