import { site, type Locale } from "@/content/site";
import type { Dictionary } from "@/content/types";
import { ringArt, joinSegments } from "@/lib/thread";
import { Logo } from "@/components/ui/Logo";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { ChapterHead } from "@/components/ui/ChapterHead";

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3.5 20.5l1.2-4.3A8.5 8.5 0 1 1 8 19.4z" />
      <path d="M9 8.5c0 3.2 2.6 6 6 6.5l1.4-1.5-2-1.2-.9.9a4.5 4.5 0 0 1-2.6-2.6l.9-.9L10.5 7.6z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
      <circle cx="12" cy="12" r="4" />
      <path d="M17.2 6.8h0" strokeWidth="1.6" />
    </svg>
  );
}

/**
 * Chapter 11 — the closing room. The thread returns and closes into a ring around
 * the question; the footer follows in the same Rich Black room.
 */
export function Closing({ t, footer, nav, locale }: { t: Dictionary["contact"]; footer: Dictionary["footer"]; nav: Dictionary["nav"]; locale: Locale }) {
  const ring = ringArt(72, 29, 470);
  const links = [
    { href: "#top", label: nav.home },
    { href: "#about", label: nav.about },
    { href: "#gallery", label: nav.work },
    { href: "#process", label: nav.process },
    { href: "#diy", label: nav.diy },
    { href: "#contact", label: nav.contact },
  ];

  return (
    <div className="room-black on-dark bg-black text-linen">
      <section id="contact" className="relative overflow-hidden py-[var(--section-y)]" aria-labelledby="contact-title">
        <svg viewBox="0 0 1000 1000" className="pointer-events-none absolute left-1/2 top-1/2 h-[min(150vw,1100px)] w-[min(150vw,1100px)] -translate-x-1/2 -translate-y-1/2 opacity-60" aria-hidden="true" data-reveal="draw">
          <circle cx="500" cy="500" r="470" fill="none" stroke="#8C6147" strokeWidth="1" vectorEffect="non-scaling-stroke" pathLength={1} transform="rotate(-90 500 500)" />
          <path d={joinSegments(ring.segments)} fill="none" stroke="#98785D" strokeWidth="0.5" vectorEffect="non-scaling-stroke" opacity="0.35" pathLength={1} />
        </svg>

        <div className="wrap relative grid12">
          <div className="col-span-4 text-center md:col-span-8 lg:col-span-8 lg:col-start-3">
            <div className="flex justify-center">
              <ChapterHead n={11} label={t.label} locale={locale} />
            </div>
            <h2 id="contact-title" className="t-display-l mt-8" data-reveal="text">
              {t.title}
            </h2>
            <p className="t-body-l mx-auto mt-8 max-w-[38ch]" data-reveal="text">
              {t.lead}
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 md:flex-row" data-reveal="text">
              <a href={site.whatsapp.href} target="_blank" rel="noopener noreferrer" aria-label={`${t.whatsappAria} — ${site.whatsapp.display}`} className="btn btn-primary w-full md:w-auto">
                <WhatsAppIcon />
                {t.whatsapp}
              </a>
              <a href={site.instagram.href} target="_blank" rel="noopener noreferrer" aria-label={t.instagramAria} className="btn btn-secondary w-full md:w-auto">
                <InstagramIcon />
                {t.instagram}
              </a>
            </div>
            <p className="mt-6 text-taupe" data-reveal="text">
              <a href={site.whatsapp.href} target="_blank" rel="noopener noreferrer" className="link-thread" dir="ltr">
                {site.whatsapp.display}
              </a>
            </p>
            <p className="t-h1 mx-auto max-w-[20ch]" style={{ marginBlockStart: "calc(var(--section-y) * 0.6)" }} data-reveal="text">
              {t.closing}
            </p>
          </div>
        </div>
      </section>

      <footer className="border-t border-[var(--line-on-dark)]">
        <div className="wrap grid12 gap-y-10 py-16">
          <div className="col-span-4 md:col-span-8 lg:col-span-4">
            <Logo width={150} />
            <p className="t-h2 mt-6 max-w-[18ch]">{footer.statement}</p>
          </div>

          <nav aria-label={nav.primary} className="col-span-2 md:col-span-4 lg:col-span-3 lg:col-start-6">
            <ul>
              {links.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="link-thread">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="col-span-2 md:col-span-4 lg:col-span-3 lg:col-start-10">
            <ul>
              <li>
                <a href={site.whatsapp.href} target="_blank" rel="noopener noreferrer" aria-label={t.whatsappAria} className="link-thread gap-3">
                  <WhatsAppIcon />
                  <span dir="ltr">{site.whatsapp.display}</span>
                </a>
              </li>
              <li>
                <a href={site.instagram.href} target="_blank" rel="noopener noreferrer" aria-label={t.instagramAria} className="link-thread gap-3">
                  <InstagramIcon />
                  <span dir="ltr">{site.instagram.handle}</span>
                </a>
              </li>
            </ul>
            <div className="mt-6">
              <LanguageSwitcher locale={locale} label={nav.language} />
            </div>
          </div>
        </div>
        <div className="wrap flex flex-col gap-2 border-t border-[var(--line-on-dark)] py-6 text-taupe md:flex-row md:justify-between">
          <p className="t-caption">
            <span dir="ltr">© {site.name} {site.year}</span> {footer.rights}
          </p>
          <p className="t-caption">{footer.made}</p>
        </div>
      </footer>
    </div>
  );
}
