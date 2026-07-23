"use client";

import { LOCALES, type Locale } from "@/lib/i18n/locales";
import { useLocaleStore } from "@/lib/locale-store";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const AUTO_VALUE = "auto";

export function LanguageSwitcher({ className }: { className?: string }) {
  const locale = useLocaleStore((s) => s.locale);
  const setLocale = useLocaleStore((s) => s.setLocale);
  const autoFromCountry = useLocaleStore((s) => s.autoFromCountry);
  const setAutoFromCountry = useLocaleStore((s) => s.setAutoFromCountry);
  const syncFromCountry = useLocaleStore((s) => s.syncFromCountry);
  const countryCode = useAppStore((s) => s.user?.countryCode);
  const t = useLocaleStore((s) => s.t)();

  const selectValue = autoFromCountry ? AUTO_VALUE : locale;

  return (
    <div className={cn("space-y-3", className)}>
      <div>
        <p className="font-display text-lg font-bold">{t.settings.languageTitle}</p>
        <p className="mt-1 text-sm text-muted">{t.settings.languageBody}</p>
      </div>

      <label className="block space-y-1.5">
        <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
          Language
        </span>
        <div className="relative">
          <select
            value={selectValue}
            onChange={(e) => {
              const value = e.target.value;
              if (value === AUTO_VALUE) {
                setAutoFromCountry(true);
                syncFromCountry(countryCode);
                return;
              }
              setLocale(value as Locale);
            }}
            className="w-full appearance-none rounded-2xl border border-line bg-ink-soft/80 px-4 py-3.5 pr-10 text-sm font-medium text-cream outline-none transition focus:border-coral/45 focus:shadow-[0_0_0_3px_rgba(255,61,104,0.12)]"
          >
            <option value={AUTO_VALUE}>
              {t.settings.autoFromCountry}
              {countryCode ? ` (${countryCode})` : ""}
            </option>
            {LOCALES.map((l) => (
              <option key={l.code} value={l.code}>
                {l.native} — {l.label}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-muted">
            ▾
          </span>
        </div>
      </label>
    </div>
  );
}
