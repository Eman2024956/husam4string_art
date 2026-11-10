import { notFound } from "next/navigation";
import { artworks } from "@/content/artworks";
import { isLocale } from "@/content/site";
import { getDictionary, numeral } from "@/lib/i18n";
import { FRAME_RADIUS, SHAPES, chunkSegments, shapeArt, type Shape } from "@/lib/thread";
import { ArtPiece } from "@/components/art/ArtPiece";
import { PhotoPlaceholder } from "@/components/art/Placeholders";
import { ThreadArt, nailPath } from "@/components/art/ThreadArt";
import { ArtworkGallery, type GalleryItem } from "@/components/gallery/ArtworkGallery";
import { BeforeAfter } from "@/components/sections/BeforeAfter";
import { About, BwCollection, ColorCollection, Craft, Intro } from "@/components/sections/Chapters";
import { Closing } from "@/components/sections/Closing";
import { DiySequence } from "@/components/sections/DiySequence";
import { Hero } from "@/components/sections/Hero";
import { ProcessTimeline } from "@/components/sections/ProcessTimeline";
import { ChapterHead } from "@/components/ui/ChapterHead";

const PAIRS: { shape: Shape; seed: number }[] = [
  { shape: "bust", seed: 11 },
  { shape: "duo", seed: 23 },
  { shape: "child", seed: 37 },
];

/** The DIY stage: one drawing with five layers the sequence fades between. */
function DiyStage() {
  const art = shapeArt("bust", 19, 120, 360);
  const threads = chunkSegments(art.segments, 18);
  return (
    <svg viewBox="0 0 1000 1000" aria-hidden="true">
      <g data-layer="photo">
        <rect width="1000" height="1000" fill="#EEE5DB" opacity="0.5" />
        <g fill="#060708" opacity="0.72">
          {SHAPES.bust.map((e, i) => (
            <ellipse key={i} cx={e.cx} cy={e.cy} rx={e.rx} ry={e.ry} />
          ))}
        </g>
      </g>
      <g data-layer="simple" fill="none" stroke="#060708" strokeWidth="1.5" style={{ opacity: 0, visibility: "hidden" }}>
        {SHAPES.bust.map((e, i) => (
          <ellipse key={i} cx={e.cx} cy={e.cy} rx={e.rx} ry={e.ry} />
        ))}
      </g>
      <g data-layer="nails" style={{ opacity: 0, visibility: "hidden" }}>
        <circle cx="500" cy="500" r={FRAME_RADIUS} fill="none" stroke="#060708" strokeWidth="1" opacity="0.5" />
        <path d={nailPath(art.nails)} fill="none" stroke="#060708" strokeWidth="11" strokeLinecap="round" />
      </g>
      <g data-layer="threads" fill="none" stroke="#060708" strokeWidth="1.2">
        {threads.map((d, i) => (
          <path key={i} d={d} className="diy-thread" style={{ opacity: 0, visibility: "hidden" }} />
        ))}
      </g>
      <g data-layer="frame" fill="none" stroke="#060708" style={{ opacity: 0, visibility: "hidden" }}>
        <rect x="16" y="16" width="968" height="968" strokeWidth="10" />
        <rect x="40" y="40" width="920" height="920" strokeWidth="1" />
      </g>
    </svg>
  );
}

export default async function Home({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);

  const colorWorks = artworks.filter((a) => a.tone === "color");
  const bwWorks = artworks.filter((a) => a.tone === "bw");

  const galleryItems: GalleryItem[] = artworks.map((work) => ({
    id: work.id,
    title: work.title[locale],
    tone: work.tone,
    category: work.category,
    span: work.wall.span,
    offset: work.wall.offset,
    art: <ArtPiece work={work} locale={locale} />,
  }));
  const numerals = Object.fromEntries(Array.from({ length: artworks.length + 1 }, (_, i) => [i, numeral(i, locale)]));

  const pairs = PAIRS.map((p) => ({
    before: <PhotoPlaceholder shape={p.shape} label={t.beforeAfter.originalAlt} />,
    after: <ThreadArt spec={{ kind: "shape", shape: p.shape, seed: p.seed }} tone="bw" label={t.beforeAfter.artAlt} />,
  }));

  const stepArt = { kind: "shape", shape: "bust", seed: 11 } as const;
  const processVisuals = [
    <PhotoPlaceholder key="1" shape="bust" />,
    <PhotoPlaceholder key="2" shape="bust" grid />,
    <ThreadArt key="3" spec={stepArt} tone="color" nailsOnly />,
    <ThreadArt key="4" spec={stepArt} tone="color" progress={0.3} />,
    <ThreadArt key="5" spec={stepArt} tone="color" progress={0.7} />,
    <ThreadArt key="6" spec={stepArt} tone="color" />,
  ];

  return (
    <main id="main">
      <Hero t={t.hero} locale={locale} />
      <Intro t={t.intro} locale={locale} />

      {/* Chapter 03 — the signature comparison */}
      <section className="room room-linen !pt-0" aria-labelledby="ba-title">
        <div className="wrap">
          <div className="grid12 gap-y-6">
            <div className="col-span-4 md:col-span-5 lg:col-span-6">
              <ChapterHead n={3} label={t.beforeAfter.label} locale={locale} />
              <h2 id="ba-title" className="t-display-l mt-8" data-reveal="text">
                {t.beforeAfter.title}
              </h2>
            </div>
            <p className="t-body-l col-span-4 self-end md:col-span-3 lg:col-span-4 lg:col-start-9" data-reveal="text">
              {t.beforeAfter.lead}
            </p>
          </div>
          <div className="mt-12 lg:mt-20">
            <BeforeAfter pairs={pairs} t={t.beforeAfter} originalOnRight={locale === "ar"} />
          </div>
        </div>
      </section>

      <Craft t={t.craft} locale={locale} slotNote={t.slot} />

      {/* Chapter 05 — the process */}
      <section id="process" className="room room-linen" aria-labelledby="process-title">
        <div className="wrap">
          <div className="grid12 gap-y-6">
            <div className="col-span-4 md:col-span-6 lg:col-span-7">
              <ChapterHead n={5} label={t.process.label} locale={locale} />
              <h2 id="process-title" className="t-display-l mt-8" data-reveal="text">
                {t.process.title}
              </h2>
            </div>
            <p className="t-body-l col-span-4 self-end md:col-span-2 lg:col-span-3 lg:col-start-10" data-reveal="text">
              {t.process.lead}
            </p>
          </div>
          <div className="mt-12 lg:mt-16">
            <ProcessTimeline steps={t.process.steps} numerals={t.process.steps.map((_, i) => numeral(i + 1, locale))} visuals={processVisuals} stepWord={t.process.stepWord} />
          </div>
        </div>
      </section>

      <ColorCollection t={t.color} locale={locale} works={colorWorks} />
      <BwCollection t={t.bw} locale={locale} works={bwWorks} />

      {/* Chapter 08 — the gallery, the heart of the site */}
      <section id="gallery" className="room room-linen" aria-labelledby="gallery-title">
        <div className="wrap">
          <div className="grid12 gap-y-6">
            <div className="col-span-4 md:col-span-5 lg:col-span-6">
              <ChapterHead n={8} label={t.gallery.label} locale={locale} />
              <h2 id="gallery-title" className="t-display-l mt-8" data-reveal="text">
                {t.gallery.title}
              </h2>
            </div>
            <div className="col-span-4 self-end md:col-span-3 lg:col-span-4 lg:col-start-9" data-reveal="text">
              <p className="t-body-l">{t.gallery.lead}</p>
              <p className="t-caption mt-4 flex items-start gap-3 text-cinnamon">
                <span className="nail mt-[7px] !bg-cinnamon" aria-hidden="true" />
                {t.gallery.note}
              </p>
            </div>
          </div>
          <div className="mt-12 lg:mt-16">
            <ArtworkGallery items={galleryItems} t={t.gallery} numerals={numerals} />
          </div>
        </div>
      </section>

      <About t={t.about} locale={locale} slotNote={t.slot} />

      {/* Chapter 10 — LOOMA DIY, the warm room. A concept, clearly not on sale. */}
      <section id="diy" className="room room-taupe" aria-labelledby="diy-title">
        <div className="wrap">
          <div className="grid12 gap-y-6">
            <div className="col-span-4 md:col-span-6 lg:col-span-7">
              <ChapterHead n={10} label={t.diy.label} locale={locale} />
              <p className="mt-8 flex items-center gap-3 text-[13px] font-medium uppercase tracking-[0.2em] rtl:text-[16px] rtl:normal-case rtl:tracking-normal" data-reveal="text">
                <span className="nail" aria-hidden="true" />
                {t.diy.soon}
              </p>
              <h2 id="diy-title" className="t-display-l mt-4" data-reveal="text">
                {t.diy.title}
              </h2>
            </div>
            <p className="t-body-l col-span-4 self-end md:col-span-6 lg:col-span-4 lg:col-start-9" data-reveal="text">
              {t.diy.lead}
            </p>
          </div>

          <div className="mt-12 lg:mt-20">
            <DiySequence t={t.diy} numerals={t.diy.steps.map((_, i) => numeral(i + 1, locale))} stage={<DiyStage />} />
          </div>

          <div className="grid12 mt-16 gap-y-8 border-t border-[var(--room-line)] pt-10 lg:mt-24">
            <h3 className="t-h2 col-span-4 md:col-span-8 lg:col-span-4">{t.diy.kitTitle}</h3>
            <ul className="col-span-4 grid grid-cols-2 gap-x-[var(--gutter)] md:col-span-8 md:grid-cols-3 lg:col-span-7 lg:col-start-6">
              {t.diy.kit.map((item) => (
                <li key={item} className="flex min-h-[52px] items-center gap-3 border-b border-[var(--room-line)]">
                  <span className="nail" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="t-caption col-span-4 md:col-span-8 lg:col-span-7 lg:col-start-6">
              {t.diy.codeLabel}:{" "}
              <span dir="ltr" className="font-medium tracking-[0.12em]">
                LM-7Q4K-2R96
              </span>
              <span className="mx-2" aria-hidden="true">
                /
              </span>
              {t.diy.note}
            </p>
          </div>
        </div>
      </section>

      <Closing t={t.contact} footer={t.footer} nav={t.nav} locale={locale} />
    </main>
  );
}
