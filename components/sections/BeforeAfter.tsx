"use client";

import { useCallback, useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import type { Dictionary } from "@/content/types";

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface Pair {
  before: ReactNode;
  after: ReactNode;
}

interface Props {
  pairs: Pair[];
  t: Dictionary["beforeAfter"];
  /** In Arabic the Original sits on the right. */
  originalOnRight: boolean;
}

const clamp = (n: number) => Math.min(100, Math.max(0, n));

/**
 * The seam is a thread with a nail at its centre. Drag it, click the image, or focus
 * the handle and use the arrow keys. touch-action is disabled only on the handle, so
 * the page still scrolls when a thumb lands on the picture.
 */
export function BeforeAfter({ pairs, t, originalOnRight }: Props) {
  const [pos, setPos] = useState(50); // seam position in % from the left edge
  const [active, setActive] = useState(0);
  const frame = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const fromPointer = useCallback((clientX: number) => {
    const rect = frame.current?.getBoundingClientRect();
    if (!rect) return;
    setPos(clamp(((clientX - rect.left) / rect.width) * 100));
  }, []);

  const onHandleDown = (e: PointerEvent<HTMLButtonElement>) => {
    dragging.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onHandleMove = (e: PointerEvent<HTMLButtonElement>) => {
    if (dragging.current) fromPointer(e.clientX);
  };
  const onHandleUp = () => {
    dragging.current = false;
  };

  const onKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    const step = e.shiftKey ? 20 : 5;
    if (e.key === "ArrowLeft") setPos((p) => clamp(p - step));
    else if (e.key === "ArrowRight") setPos((p) => clamp(p + step));
    else if (e.key === "Home") setPos(0);
    else if (e.key === "End") setPos(100);
    else return;
    e.preventDefault();
  };

  // On reveal the seam sweeps 15% → 50% once, so visitors see that it moves.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const state = { v: 15 };
        ScrollTrigger.create({
          trigger: frame.current,
          start: "top 75%",
          once: true,
          onEnter: () => {
            setPos(15);
            gsap.to(state, { v: 50, duration: 1.6, ease: "power3.inOut", onUpdate: () => setPos(state.v) });
          },
        });
      });
      return () => mm.revert();
    },
    { scope: frame },
  );

  const revealed = Math.round(originalOnRight ? pos : 100 - pos);
  const beforeClip = originalOnRight ? `inset(0 0 0 ${pos}%)` : `inset(0 ${100 - pos}% 0 0)`;
  const pair = pairs[active];

  return (
    <div>
      <div
        ref={frame}
        className="relative aspect-[4/5] w-full select-none overflow-hidden bg-linen-dark md:aspect-[16/10]"
        onPointerDown={(e) => {
          if (e.pointerType === "mouse" && !(e.target as Element).closest("button")) fromPointer(e.clientX);
        }}
      >
        <div className="absolute inset-0 [&>svg]:h-full [&>svg]:w-full">{pair.after}</div>
        <div className="absolute inset-0 [&>svg]:h-full [&>svg]:w-full" style={{ clipPath: beforeClip }}>
          {pair.before}
        </div>

        <span className={`ba-label ${originalOnRight ? "right-3" : "left-3"}`}>{t.original}</span>
        <span className={`ba-label ${originalOnRight ? "left-3" : "right-3"}`}>{t.art}</span>

        <div className="pointer-events-none absolute inset-y-0 w-px -translate-x-1/2 bg-toffee" style={{ left: `${pos}%` }} aria-hidden="true" />
        <button
          type="button"
          role="slider"
          aria-label={t.slider}
          aria-orientation="horizontal"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={revealed}
          aria-valuetext={`${revealed}%`}
          data-cursor="drag"
          className="absolute top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize touch-none items-center justify-center gap-[7px] rounded-full border border-toffee bg-linen text-graphite"
          style={{ left: `${pos}%` }}
          onPointerDown={onHandleDown}
          onPointerMove={onHandleMove}
          onPointerUp={onHandleUp}
          onPointerCancel={onHandleUp}
          onKeyDown={onKey}
        >
          <span aria-hidden="true" className="h-2 w-2 -rotate-45 border-l border-t border-current" />
          <span aria-hidden="true" className="nail !bg-toffee" />
          <span aria-hidden="true" className="h-2 w-2 rotate-45 border-r border-t border-current" />
        </button>
      </div>

      <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div role="group" aria-label={t.pairsLabel} className="no-scrollbar -mx-[var(--margin)] flex gap-2 overflow-x-auto px-[var(--margin)] md:mx-0 md:px-0">
          {t.pairs.slice(0, pairs.length).map((name, i) => (
            <button key={name} type="button" className="tag" aria-pressed={active === i} onClick={() => setActive(i)}>
              {name}
            </button>
          ))}
        </div>
        <p className="t-caption">{t.hint}</p>
      </div>
    </div>
  );
}
