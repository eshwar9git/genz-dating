export type Locale =
  | "en"
  | "es"
  | "fr"
  | "hi"
  | "de"
  | "ja"
  | "pt"
  | "ar"
  | "ko";

export const LOCALES: {
  code: Locale;
  label: string;
  native: string;
  dir?: "ltr" | "rtl";
}[] = [
  { code: "en", label: "English", native: "English" },
  { code: "es", label: "Spanish", native: "Español" },
  { code: "fr", label: "French", native: "Français" },
  { code: "hi", label: "Hindi", native: "हिन्दी" },
  { code: "de", label: "German", native: "Deutsch" },
  { code: "ja", label: "Japanese", native: "日本語" },
  { code: "pt", label: "Portuguese", native: "Português" },
  { code: "ar", label: "Arabic", native: "العربية", dir: "rtl" },
  { code: "ko", label: "Korean", native: "한국어" },
];

/** Default UI language from country code */
export const COUNTRY_LOCALE: Record<string, Locale> = {
  US: "en",
  GB: "en",
  CA: "en",
  AU: "en",
  IN: "hi",
  DE: "de",
  FR: "fr",
  BR: "pt",
  JP: "ja",
  SG: "en",
  AE: "ar",
  NG: "en",
  MX: "es",
  KR: "ko",
  ZA: "en",
  ES: "es",
};

export const COUNTRY_CURRENCY: Record<string, string> = {
  US: "usd",
  GB: "gbp",
  CA: "cad",
  AU: "aud",
  IN: "inr",
  DE: "eur",
  FR: "eur",
  BR: "brl",
  JP: "jpy",
  SG: "sgd",
  AE: "aed",
  NG: "ngn",
  MX: "mxn",
  KR: "krw",
  ZA: "zar",
};

export function localeFromCountry(countryCode?: string): Locale {
  if (!countryCode) return "en";
  return COUNTRY_LOCALE[countryCode] ?? "en";
}

export function currencyFromCountry(countryCode?: string): string {
  if (!countryCode) return "usd";
  return COUNTRY_CURRENCY[countryCode] ?? "usd";
}
