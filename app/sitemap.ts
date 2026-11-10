import type { MetadataRoute } from "next";
import { locales, site } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(locales.map((l) => [l, `${site.url}/${l}`]));
  return locales.map((locale) => ({
    url: `${site.url}/${locale}`,
    changeFrequency: "monthly",
    priority: locale === "ar" ? 1 : 0.9,
    alternates: { languages },
  }));
}
