import { en, type Dict } from "./en";
import { es } from "./es";
import { fr } from "./fr";
import { hi } from "./hi";
import { ar, de, ja, ko, pt } from "./more";
import type { Locale } from "./locales";

const DICTS: Record<Locale, Dict> = {
  en,
  es,
  fr,
  hi,
  de,
  ja,
  pt,
  ar,
  ko,
};

export function getDict(locale: Locale): Dict {
  return DICTS[locale] ?? en;
}

export type { Dict, Locale };
export {
  LOCALES,
  localeFromCountry,
  currencyFromCountry,
  COUNTRY_CURRENCY,
  distanceUnitFromCountry,
  formatDistanceKm,
} from "./locales";
export type { DistanceUnit } from "./locales";
