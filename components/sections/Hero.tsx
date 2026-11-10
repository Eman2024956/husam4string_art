import { site, type Locale } from "@/content/site";
import type { Dictionary } from "@/content/types";
import { FRAME_RADIUS, chunkSegments, frameChords, shapeArt } from "@/lib/thread";
import { nailPath } from "@/components/art/ThreadArt";
import { Logo } from "@/components/ui/Logo";
import { HeroIntro } from "./HeroIntro";

/**
 * Chapter 01. Fine lines appear, connect, form a structure, and the artwork emerges
 * inside the ring; then the logo, then the statement. The drawing is server-rendered
 * SVG — HeroIntro only plays it.
 */
export function Hero({ t, locale }: { t: Dictionary["hero"]; locale: Locale }) {
  const art = shapeArt("bust", 7, 170, 520);
  const layers = chunkSegments(art.segments, 6);
  const chords = frameChords(12, 41, 640);

  return (
    <section id="top" className="room-black on-dark relative flex min-h-[100svh] flex-col overflow-hidden bg-black text-linen">
      <div className="wrap grid12 flex-1 items-end pb-12 pt-[96px] md:pb-16 lg:items-center lg:pb-20 lg:pt-[120px]">
        <div className="hero-art col-span-4 mx-auto w-full max-w-[min(78vw,52svh)] md:col-span-8 lg:order-2 lg:col-span-6 lg:col-start-7 lg:max-w-[min(100%,74svh)]">
          <svg viewBox="0 0 1000 1000" role="img" aria-label={t.artAlt} className="h-auto w-full overflow-visible">
            <g className="hero-chords hidden md:block" fill="none" stroke="#98785D" strokeWidth="1.3">
              {chords.map((d, i) => (
                <path key={i} d={d} pathLength={1} className="hc" />
              ))}
            </g>
            <circle cx="500" cy="500" r={FRAME_RADIUS} fill="none" stroke="#8C6147" strokeWidth="1.6" pathLength={1} className="hero-ring" transform="rotate(-90 500 500)" />
            <g fill="none" strokeWidth="1.25">
              {layers.map((d, i) => (
                <path key={i} d={d} className="ha" stroke={i % 3 === 1 ? "#98785D" : "#EEE5DB"} opacity={i % 3 === 1 ? 0.9 : 0.78} />
              ))}
            </g>
            <path d={nailPath(art.nails)} fill="none" stroke="#8C6147" strokeWidth="5" strokeLinecap="round" className="hero-nails" />
          </svg>
          <div className="hero-logo mt-6 flex justify-center lg:mt-8">
            <Logo width={150} />
          </div>
        </div>

        <div className="col-span-4 mt-10 md:col-span-7 lg:order-1 lg:col-span-6 lg:mt-0">
          <h1 className="hero-title" data-hero>
            <span className="block">{t.line1}</span>
            <span className="block">{t.line2}</span>
          </h1>
          <p className="t-body-l mt-6 max-w-[34ch] text-linen md:mt-8" data-hero>
            {t.sub}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 md:mt-12" data-hero>
            <a href={site.whatsapp.href} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
              {t.cta}
            </a>
            <a href="#gallery" className="link-thread text-[12px] font-medium uppercase tracking-[0.16em] rtl:text-[15px] rtl:normal-case rtl:tracking-normal">
              {t.secondary}
            </a>
          </div>
        </div>
      </div>
      <HeroIntro locale={locale} />
    </section>
  );
}
