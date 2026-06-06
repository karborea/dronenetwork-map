/**
 * Drone Network — bilingual helper.
 *
 * Tiny utility for FR/EN string switching. We'll graduate to a proper i18n
 * library (next-intl) when we ship localized routes (/en/...). For now, this
 * keeps things simple while we build the components.
 */

export type Locale = "fr" | "en";

export type Translations = {
  fr: string;
  en: string;
};

export const DEFAULT_LOCALE: Locale = "fr";

export function t(strings: Translations, locale: Locale = DEFAULT_LOCALE): string {
  return strings[locale];
}
