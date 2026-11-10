import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import "@fontsource/cormorant-garamond/latin-300.css";
import "@fontsource/cormorant-garamond/latin-400.css";
import "@fontsource/ibm-plex-sans/latin-300.css";
import "@fontsource/ibm-plex-sans/latin-400.css";
import "@fontsource/ibm-plex-sans/latin-500.css";
import "@fontsource/ibm-plex-sans-arabic/arabic-300.css";
import "@fontsource/ibm-plex-sans-arabic/arabic-400.css";
import "@fontsource/ibm-plex-sans-arabic/arabic-500.css";
import "../globals.css";
import { dirOf, isLocale, locales, site } from "@/content/site";
import { getDictionary } from "@/lib/i18n";
import { Header } from "@/components/layout/Header";
import { Loader } from "@/components/layout/Loader";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { CustomCursor } from "@/components/motion/CustomCursor";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#060708",
};

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDictionary(locale);
  return {
    metadataBase: new URL(site.url),
    title: t.meta.title,
    description: t.meta.description,
    alternates: {
      canonical: `/${locale}`,
      languages: { ar: "/ar", en: "/en", "x-default": "/ar" },
    },
    openGraph: {
      type: "website",
      siteName: site.name,
      title: t.meta.title,
      description: t.meta.description,
      url: `/${locale}`,
      locale: locale === "ar" ? "ar_IQ" : "en_US",
      alternateLocale: locale === "ar" ? ["en_US"] : ["ar_IQ"],
    },
    twitter: { card: "summary_large_image", title: t.meta.title, description: t.meta.description },
  };
}

/**
 * Runs before first paint. Marks whether motion is allowed (so CSS can hold the hero's
 * opening state without a flash) and whether the loader has already played this session.
 */
const BOOT = `(function(){try{var d=document.documentElement,r=matchMedia('(prefers-reduced-motion: reduce)').matches;d.dataset.motion=r?'off':'on';if(r||sessionStorage.getItem('looma-seen')){d.dataset.loader='skip'}else{sessionStorage.setItem('looma-seen','1')}}catch(e){document.documentElement.dataset.loader='skip'}})();`;

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    url: `${site.url}/${locale}`,
    description: t.meta.description,
    sameAs: [site.instagram.href],
    contactPoint: { "@type": "ContactPoint", contactType: "customer service", telephone: "+9647760665557", availableLanguage: ["ar", "en"] },
  };

  return (
    <html lang={locale} dir={dirOf(locale)} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: BOOT }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body>
        <a href="#main" className="skip-link">
          {t.nav.skip}
        </a>
        <Loader />
        <Header locale={locale} nav={t.nav} whatsappLabel={t.contact.whatsapp} />
        {children}
        <SmoothScroll />
        <CustomCursor labels={t.cursor} />
      </body>
    </html>
  );
}
