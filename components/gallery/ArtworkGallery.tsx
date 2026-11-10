"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { Category, Tone } from "@/content/artworks";
import type { Dictionary, FilterKey } from "@/content/types";
import { ArtworkLightbox } from "./ArtworkLightbox";

export interface GalleryItem {
  id: string;
  title: string;
  tone: Tone;
  category: Category;
  span: 3 | 4 | 5 | 6;
  offset: 0 | 1 | 2;
  /** Server-rendered image or placeholder piece. */
  art: ReactNode;
}

const FILTERS: FilterKey[] = ["all", "color", "bw", "portraits", "memories", "custom"];
const SPAN: Record<GalleryItem["span"], string> = { 3: "lg:col-span-3", 4: "lg:col-span-4", 5: "lg:col-span-5", 6: "lg:col-span-6" };
const RATIO: Record<GalleryItem["span"], string> = { 3: "lg:aspect-[3/4]", 4: "lg:aspect-square", 5: "lg:aspect-[4/5]", 6: "lg:aspect-[4/5]" };
const OFFSET: Record<GalleryItem["offset"], string> = { 0: "", 1: "lg:mt-16", 2: "lg:mt-32" };

function matches(item: GalleryItem, filter: FilterKey): boolean {
  if (filter === "all") return true;
  if (filter === "color" || filter === "bw") return item.tone === filter;
  return item.category === filter;
}

/** A wall, not a grid: works hang at different widths and offsets. Filters re-hang it. */
export function ArtworkGallery({ items, t, numerals }: { items: GalleryItem[]; t: Dictionary["gallery"]; numerals: Record<number, string> }) {
  const [filter, setFilter] = useState<FilterKey>("all");
  const [openId, setOpenId] = useState<string | null>(null);
  const opener = useRef<HTMLElement | null>(null);

  // Keep the chosen filter in the URL so a filtered wall can be shared.
  useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get("filter");
    if (!fromUrl || !(FILTERS as string[]).includes(fromUrl)) return;
    // Applied after hydration so the server-rendered wall and the first client render match.
    const frame = requestAnimationFrame(() => setFilter(fromUrl as FilterKey));
    return () => cancelAnimationFrame(frame);
  }, []);

  const choose = (next: FilterKey) => {
    setFilter(next);
    const url = new URL(window.location.href);
    if (next === "all") url.searchParams.delete("filter");
    else url.searchParams.set("filter", next);
    window.history.replaceState(null, "", url);
  };

  const visible = useMemo(() => items.filter((item) => matches(item, filter)), [items, filter]);
  const openIndex = openId ? visible.findIndex((item) => item.id === openId) : -1;

  const close = useCallback(() => setOpenId(null), []);
  const move = useCallback(
    (delta: number) => {
      if (openIndex < 0) return;
      const next = (openIndex + delta + visible.length) % visible.length;
      setOpenId(visible[next].id);
    },
    [openIndex, visible],
  );

  const metaOf = (item: GalleryItem) => `${item.tone === "color" ? t.toneColor : t.toneBw} · ${t.filters[item.category]}`;

  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div role="group" aria-label={t.filtersLabel} className="no-scrollbar -mx-[var(--margin)] flex gap-2 overflow-x-auto px-[var(--margin)] md:mx-0 md:flex-wrap md:overflow-visible md:px-0">
          {FILTERS.map((key) => (
            <button key={key} type="button" className="tag flex-none" aria-pressed={filter === key} onClick={() => choose(key)}>
              {t.filters[key]}
            </button>
          ))}
        </div>
        <p className="t-caption flex-none" aria-live="polite">
          <span className="t-numeral text-[20px]">{numerals[visible.length] ?? visible.length}</span> {t.count}
        </p>
      </div>

      <ul
        key={filter}
        className="no-scrollbar -mx-[var(--margin)] mt-10 flex snap-x snap-mandatory gap-[var(--gutter)] overflow-x-auto px-[var(--margin)] [animation:fade-in_560ms_var(--ease-soft)_both] md:mx-0 md:grid md:grid-cols-2 md:gap-y-16 md:overflow-visible md:px-0 lg:mt-16 lg:grid-cols-12 lg:items-start lg:gap-y-24"
      >
        {visible.map((item, i) => (
          <li key={item.id} className={`w-[78vw] flex-none snap-center md:w-auto ${i % 2 === 1 ? "md:mt-16" : ""} lg:!mt-0 ${SPAN[item.span]} ${OFFSET[item.offset]}`}>
            <button
              type="button"
              className="group block w-full text-start"
              data-cursor="view"
              aria-label={`${t.open}: ${item.title}`}
              onClick={(e) => {
                opener.current = e.currentTarget;
                setOpenId(item.id);
              }}
            >
              <span className={`block aspect-[4/5] overflow-hidden ${RATIO[item.span]}`}>
                <span className="block h-full w-full transition-transform duration-[960ms] ease-[var(--ease-settle)] group-hover:scale-[1.035] group-focus-visible:scale-[1.035] [&>img]:h-full [&>img]:w-full [&>img]:object-cover [&>svg]:h-full [&>svg]:w-full">
                  {item.art}
                </span>
              </span>
              <span className="mt-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <span className="t-h2 !text-[clamp(20px,1.8vw,28px)]">{item.title}</span>
                <span className="t-label">{metaOf(item)}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      {openIndex >= 0 && (
        <ArtworkLightbox
          item={visible[openIndex]}
          meta={metaOf(visible[openIndex])}
          position={`${numerals[openIndex + 1] ?? openIndex + 1} / ${numerals[visible.length] ?? visible.length}`}
          t={t}
          onClose={close}
          onMove={move}
        />
      )}
    </div>
  );
}
