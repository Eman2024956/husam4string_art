"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";
import type { Dictionary } from "@/content/types";
import { lockScroll } from "@/lib/lenis";
import { useFocusTrap } from "@/lib/useFocusTrap";
import type { GalleryItem } from "./ArtworkGallery";

interface Props {
  item: GalleryItem;
  meta: string;
  position: string;
  t: Dictionary["gallery"];
  onClose: () => void;
  onMove: (delta: number) => void;
}

/**
 * A Rich Black room. The work never touches the edges. Arrow keys and swipe move
 * between pieces, Esc closes, and focus returns to the card that opened it.
 */
export function ArtworkLightbox({ item, meta, position, t, onClose, onMove }: Props) {
  const root = useRef<HTMLDivElement>(null);
  // Zoom is remembered per artwork, so moving to another piece always starts unzoomed.
  const [zoomedId, setZoomedId] = useState<string | null>(null);
  const zoomed = zoomedId === item.id;
  const [origin, setOrigin] = useState("50% 50%");
  const swipeStart = useRef<number | null>(null);

  useFocusTrap(root, true, onClose);

  useEffect(() => {
    lockScroll(true);
    return () => lockScroll(false);
  }, []);

  useEffect(() => {
    const rtl = document.documentElement.dir === "rtl";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") onMove(rtl ? -1 : 1);
      else if (e.key === "ArrowLeft") onMove(rtl ? 1 : -1);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onMove]);

  const onPointerMove = (e: PointerEvent<HTMLButtonElement>) => {
    if (!zoomed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setOrigin(`${((e.clientX - rect.left) / rect.width) * 100}% ${((e.clientY - rect.top) / rect.height) * 100}%`);
  };

  const control =
    "flex min-h-[44px] min-w-[44px] items-center justify-center gap-3 text-[11px] font-medium uppercase tracking-[0.2em] rtl:text-[14px] rtl:normal-case rtl:tracking-normal";

  return (
    <div
      ref={root}
      role="dialog"
      aria-modal="true"
      aria-label={`${t.dialog}: ${item.title}`}
      data-lenis-prevent
      className="room-black on-dark fixed inset-0 z-[400] flex flex-col overflow-y-auto bg-black text-linen [animation:fade-in_420ms_var(--ease-soft)_both]"
      onPointerDown={(e) => {
        if (e.pointerType === "touch") swipeStart.current = e.clientX;
      }}
      onPointerUp={(e) => {
        if (swipeStart.current === null || zoomed) return;
        const dx = e.clientX - swipeStart.current;
        swipeStart.current = null;
        if (Math.abs(dx) > 60) onMove(dx < 0 ? 1 : -1);
      }}
    >
      <div className="wrap flex h-[72px] flex-none items-center justify-between">
        <p className="t-numeral text-[18px] text-taupe" aria-live="polite">
          {position}
        </p>
        <button type="button" className={control} onClick={onClose}>
          {t.close}
          <span aria-hidden="true" className="relative block h-4 w-4">
            <span className="absolute left-0 top-1/2 h-px w-full rotate-45 bg-current" />
            <span className="absolute left-0 top-1/2 h-px w-full -rotate-45 bg-current" />
          </span>
        </button>
      </div>

      <div className="wrap grid12 flex-1 items-center gap-y-8 pb-10">
        <div className="col-span-4 md:col-span-8 lg:col-span-7">
          <button
            type="button"
            className={`mx-auto block aspect-square w-full max-w-[min(100%,72svh)] overflow-hidden shadow-[0_40px_80px_-40px_rgb(6_7_8/0.6)] ${zoomed ? "cursor-zoom-out" : "cursor-zoom-in"}`}
            aria-label={zoomed ? t.zoomOut : t.zoomIn}
            aria-pressed={zoomed}
            onClick={() => setZoomedId(zoomed ? null : item.id)}
            onPointerMove={onPointerMove}
          >
            <span
              className="block h-full w-full transition-transform duration-[560ms] ease-[var(--ease-settle)] [&>img]:h-full [&>img]:w-full [&>img]:object-cover [&>svg]:h-full [&>svg]:w-full"
              style={{ transform: zoomed ? "scale(2.6)" : "scale(1)", transformOrigin: origin }}
            >
              {item.art}
            </span>
          </button>
        </div>

        <div className="col-span-4 md:col-span-8 lg:col-span-4 lg:col-start-9">
          <h2 className="t-h1">{item.title}</h2>
          <dl className="mt-8 border-t border-[var(--line-on-dark)]">
            {[
              [t.category, meta.split(" · ")[1]],
              [t.tone, meta.split(" · ")[0]],
              [t.technique, t.techniqueValue],
            ].map(([term, value]) => (
              <div key={term} className="flex items-baseline justify-between gap-6 border-b border-[var(--line-on-dark)] py-4">
                <dt className="t-label flex-none">{term}</dt>
                <dd className="text-end">{value}</dd>
              </div>
            ))}
          </dl>

          <figure className="mt-8 flex items-end gap-4">
            <span className="block h-36 w-36 flex-none overflow-hidden border border-[var(--line-on-dark)]" aria-hidden="true">
              <span className="block h-full w-full origin-[50%_62%] scale-[2.2] [&>img]:h-full [&>img]:w-full [&>img]:object-cover [&>svg]:h-full [&>svg]:w-full">{item.art}</span>
            </span>
            <figcaption className="t-caption text-taupe">{t.detail}</figcaption>
          </figure>

          <div className="mt-10 flex items-center gap-2">
            <button type="button" className={`${control} border border-[var(--line-on-dark)] px-4`} onClick={() => onMove(-1)} aria-label={t.prev}>
              <span aria-hidden="true" className="block h-2 w-2 -rotate-45 border-l border-t border-current rtl:rotate-[135deg]" />
            </button>
            <button type="button" className={`${control} border border-[var(--line-on-dark)] px-4`} onClick={() => onMove(1)} aria-label={t.next}>
              <span aria-hidden="true" className="block h-2 w-2 rotate-45 border-r border-t border-current rtl:-rotate-[135deg]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
