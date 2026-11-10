import { ar } from "@/content/ar";
import { en } from "@/content/en";
import type { Locale } from "@/content/site";
import type { Dictionary } from "@/content/types";

const dictionaries: Record<Locale, Dictionary> = { ar, en };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

/** Arabic-Indic numerals in editorial Arabic copy; Western digits elsewhere. */
export function numeral(n: number, locale: Locale, pad = 2): string {
  const s = String(n).padStart(pad, "0");
  if (locale !== "ar") return s;
  return s.replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[Number(d)]);
}
