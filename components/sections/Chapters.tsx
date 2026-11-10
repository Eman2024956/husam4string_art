import type { Artwork } from "@/content/artworks";
import type { Locale } from "@/content/site";
import type { Dictionary } from "@/content/types";
import { MacroPlaceholder } from "@/components/art/Placeholders";
import { ArtPiece } from "@/components/art/ArtPiece";
import { ChapterHead, ThreadDivider } from "@/components/ui/ChapterHead";

/** Chapter 02 — the manifesto. One statement, three short lines, one thread. */
export function Intro({ t, locale }: { t: Dictionary["intro"]; locale: Locale }) {
  return (
    <section className="room room-linen" aria-labelledby="intro-title">
      <div className="wrap grid12">
        <div className="col-span-4 md:col-span-8 lg:col-span-8 lg:col-start-3">
          <ChapterHead n={2} label={t.label} locale={locale} />
          <h2 id="intro-title" className="t-display-l mt-8" data-reveal="text">
            {t.title}
          </h2>
          <ThreadDivider className="mt-10 max-w-[420px]" />
          <div className="mt-10 grid gap-6 md:grid-cols-3 md:gap-[var(--gutter)]">
            {t.paragraphs.map((p) => (
              <p key={p} data-reveal="text">
                {p}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/** Chapter 04 — the craft. Graphite room: Linen text only, no brown text. */
export function Craft({ t, locale, slotNote }: { t: Dictionary["craft"]; locale: Locale; slotNote: string }) {
  const kinds = ["nails", "thread", "frame"] as const;
  return (
    <section className="room room-graphite" aria-labelledby="craft-title">
      <div className="wrap">
        <div className="grid12 items-end gap-y-8">
          <div className="col-span-4 md:col-span-8 lg:col-span-7">
            <ChapterHead n={4} label={t.label} locale={locale} />
            <h2 id="craft-title" className="t-display-l mt-8" data-reveal="text">
              {t.title}
            </h2>
          </div>
          <p className="t-body-l col-span-4 md:col-span-6 lg:col-span-4 lg:col-start-9" data-reveal="text">
            {t.lead}
          </p>
        </div>
      </div>

      <figure className="slot mt-16 aspect-[4/5] w-full md:aspect-[21/9] lg:mt-24" data-reveal="image">
        <MacroPlaceholder kind="hands" className="h-full w-full" />
        <figcaption className="slot-note">
          {slotNote} — {t.handsSlot}
        </figcaption>
      </figure>

      <div className="wrap">
        <ul className="grid12 mt-16 gap-y-12 lg:mt-24">
          {t.details.map((d, i) => (
            <li key={d.title} className={`col-span-4 md:col-span-4 lg:col-span-3 ${i === 0 ? "lg:col-start-1" : i === 1 ? "lg:col-start-5 lg:mt-16" : "lg:col-start-9 lg:mt-32"} ${i === 2 ? "md:col-start-3" : ""}`}>
              <figure className="slot aspect-square" data-reveal="image">
                <MacroPlaceholder kind={kinds[i]} className="h-full w-full" />
                <figcaption className="slot-note">{d.slot}</figcaption>
              </figure>
              <h3 className="t-h2 mt-6" data-reveal="text">
                {d.title}
              </h3>
              <p className="mt-3 max-w-[36ch]" data-reveal="text">
                {d.text}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** Chapter 06 — colour. Wall + label; the UI stays in palette, colour comes only from the art. */
export function ColorCollection({ t, locale, works }: { t: Dictionary["color"]; locale: Locale; works: Artwork[] }) {
  const layout = ["lg:col-span-5 lg:col-start-1", "lg:col-span-3 lg:col-start-7 lg:mt-40", "lg:col-span-3 lg:col-start-10 lg:mt-12"];
  return (
    <section id="color" className="room room-linen" aria-labelledby="color-title">
      <div className="wrap">
        <div className="grid12 gap-y-6">
          <div className="col-span-4 md:col-span-5 lg:col-span-5">
            <ChapterHead n={6} label={t.label} locale={locale} />
            <h2 id="color-title" className="t-display-l mt-8" data-reveal="text">
              {t.title}
            </h2>
          </div>
          <p className="t-body-l col-span-4 self-end md:col-span-5 lg:col-span-4 lg:col-start-8" data-reveal="text">
            {t.lead}
          </p>
        </div>
        <ul className="no-scrollbar -mx-[var(--margin)] mt-12 flex snap-x snap-mandatory gap-[var(--gutter)] overflow-x-auto px-[var(--margin)] md:mx-0 md:grid md:grid-cols-8 md:overflow-visible md:px-0 lg:mt-20 lg:grid-cols-12 lg:items-start">
          {works.slice(0, 3).map((work, i) => (
            <li key={work.id} className={`w-[78vw] flex-none snap-center md:w-auto ${i === 0 ? "md:col-span-8" : "md:col-span-4 md:mt-10"} ${layout[i]}`}>
              <figure>
                <div className={`${i === 0 ? "aspect-[4/5]" : "aspect-square"} overflow-hidden`} data-reveal="image">
                  <ArtPiece work={work} locale={locale} className="h-full w-full" />
                </div>
                <figcaption className="t-caption mt-3">{work.title[locale]}</figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** Chapter 07 — black and white. The dramatic room: one lit work, Linen type only. */
export function BwCollection({ t, locale, works }: { t: Dictionary["bw"]; locale: Locale; works: Artwork[] }) {
  const [lead, ...rest] = works;
  return (
    <section id="black-white" className="room room-black on-dark" aria-labelledby="bw-title">
      <div className="wrap grid12 items-center gap-y-12">
        <div className="col-span-4 md:col-span-8 lg:col-span-4">
          <ChapterHead n={7} label={t.label} locale={locale} />
          <h2 id="bw-title" className="t-display-l mt-8" data-reveal="text">
            {t.title}
          </h2>
          <p className="t-body-l mt-8 max-w-[32ch]" data-reveal="text">
            {t.lead}
          </p>
        </div>
        <figure className="col-span-4 md:col-span-6 md:col-start-2 lg:col-span-6 lg:col-start-6">
          <div className="aspect-square overflow-hidden border border-[var(--room-line)]" data-reveal="image">
            <ArtPiece work={lead} locale={locale} className="h-full w-full" />
          </div>
          <figcaption className="t-caption mt-3 text-taupe">{lead.title[locale]}</figcaption>
        </figure>
        <ul className="col-span-4 grid grid-cols-2 gap-[var(--gutter)] md:col-span-8 lg:col-span-2 lg:col-start-11 lg:grid-cols-1 lg:gap-y-10 lg:self-end">
          {rest.slice(0, 2).map((work) => (
            <li key={work.id}>
              <figure>
                <div className="aspect-square overflow-hidden border border-[var(--room-line)]" data-reveal="image">
                  <ArtPiece work={work} locale={locale} className="h-full w-full" />
                </div>
                <figcaption className="t-caption mt-3 text-taupe">{work.title[locale]}</figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** Chapter 09 — the story. A statement and three short paragraphs; no corporate biography. */
export function About({ t, locale, slotNote }: { t: Dictionary["about"]; locale: Locale; slotNote: string }) {
  return (
    <section id="about" className="room room-linen !pt-0" aria-labelledby="about-title">
      <div className="wrap">
        <div style={{ marginBlockEnd: "calc(var(--section-y) * 0.6)" }}>
          <ThreadDivider />
        </div>
        <div className="grid12 gap-y-12">
          <figure className="slot col-span-4 aspect-[4/5] md:col-span-4 lg:col-span-4" data-reveal="image">
            <MacroPlaceholder kind="thread" className="h-full w-full" />
            <figcaption className="slot-note">
              {slotNote} — {t.slot}
            </figcaption>
          </figure>
          <div className="col-span-4 md:col-span-8 lg:col-span-7 lg:col-start-6">
            <ChapterHead n={9} label={t.label} locale={locale} />
            <h2 id="about-title" className="t-display-l mt-8" data-reveal="text">
              {t.title}
            </h2>
            <div className="mt-10 space-y-5">
              {t.paragraphs.map((p, i) => (
                <p key={p} className={`measure ${i === 0 ? "t-body-l" : ""}`} data-reveal="text">
                  {p}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
