/** Facts about LOOMA that are the same in every language. */
export const site = {
  name: "LOOMA",
  /** Set NEXT_PUBLIC_SITE_URL in the environment to the real domain before launch. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://looma.example",
  whatsapp: {
    display: "0776 066 5557",
    /** 07760665557 in international format for wa.me */
    href: "https://wa.me/9647760665557",
  },
  instagram: {
    handle: "@looma_.iq",
    href: "https://www.instagram.com/looma_.iq/",
  },
  /**
   * Official logo artwork. The identity masks the wordmark from the original PNG.
   * Put the files in /public/images/looma/logo/ and set `available` to true.
   * While it is false the header shows the name set in the display face as a stand-in.
   */
  logo: {
    available: false,
    wordmark: "/images/looma/logo/looma-wordmark.png",
    wordmarkRatio: "826 / 196",
    symbol: "/images/looma/logo/looma-symbol.png",
  },
  year: 2026,
} as const;

export const locales = ["ar", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "ar";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function dirOf(locale: Locale): "rtl" | "ltr" {
  return locale === "ar" ? "rtl" : "ltr";
}
