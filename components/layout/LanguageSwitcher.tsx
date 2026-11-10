import type { Locale } from "@/content/site";

/** العربية | EN — plain links, so each language loads with its own lang and dir. */
export function LanguageSwitcher({ locale, label }: { locale: Locale; label: string }) {
  const item = (code: Locale, text: string, font: string) => (
    <a
      href={`/${code}`}
      hrefLang={code}
      lang={code}
      aria-current={locale === code ? "true" : undefined}
      className={`flex min-h-[44px] items-center px-1 ${font} ${locale === code ? "opacity-100" : "opacity-60 hover:opacity-100"} transition-opacity duration-[240ms]`}
    >
      {text}
    </a>
  );
  return (
    <div role="group" aria-label={label} className="flex items-center gap-2">
      {item("ar", "العربية", "font-[family-name:var(--font-arabic)] text-[14px]")}
      <span aria-hidden="true" className="h-3 w-px bg-current opacity-40" />
      {item("en", "EN", "font-[family-name:var(--font-sans)] text-[11px] font-medium tracking-[0.2em]")}
    </div>
  );
}
