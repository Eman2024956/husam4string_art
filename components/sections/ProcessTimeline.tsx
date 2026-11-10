"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import type { Step } from "@/content/types";

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface Props {
  steps: Step[];
  numerals: string[];
  visuals: ReactNode[];
  stepWord: string;
}

const PIN_QUERY = "(min-width: 1024px) and (min-height: 640px) and (prefers-reduced-motion: no-preference)";

/**
 * Thread = progress, nails = steps. On desktop the chapter pins and scrolling pulls
 * the thread through six nails. On touch screens, small windows and with reduced
 * motion it is a plain swipeable row (or grid) with every step readable at once.
 */
export function ProcessTimeline({ steps, numerals, visuals, stepWord }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const line = useRef<HTMLSpanElement>(null);
  const [pinned, setPinned] = useState(false);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const mq = window.matchMedia(PIN_QUERY);
    const update = () => setPinned(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useGSAP(
    () => {
      if (!pinned || !root.current) return;
      const last = steps.length - 1;
      ScrollTrigger.create({
        trigger: root.current,
        start: "top 96px",
        end: `+=${steps.length * 55}%`,
        pin: true,
        scrub: true,
        onUpdate: (self) => {
          const idx = Math.min(last, Math.floor(self.progress * steps.length));
          setActive(idx);
          if (line.current) gsap.set(line.current, { scaleX: Math.min(1, (self.progress * steps.length) / last) });
        },
      });
    },
    { dependencies: [pinned, steps.length], revertOnUpdate: true, scope: root },
  );

  return (
    <div ref={root}>
      {pinned && (
        <ol className="relative mb-10 flex justify-between" aria-hidden="true">
          <span className="absolute inset-x-0 top-[5px] h-px bg-[var(--room-line)]" />
          <span ref={line} className="absolute inset-x-0 top-[5px] h-px origin-left scale-x-0 bg-toffee rtl:origin-right" />
          {steps.map((step, i) => (
            <li key={step.title} className="relative flex flex-col items-center gap-3">
              <span
                className={`block h-[11px] w-[11px] rounded-full border border-toffee transition-[background-color,box-shadow] duration-[240ms] ${i <= active ? "bg-toffee" : "bg-linen"} ${i === active ? "shadow-[0_0_0_5px_rgb(140_97_71/0.18)]" : ""}`}
              />
              <span className={`t-label transition-opacity duration-[240ms] ${i === active ? "opacity-100" : "opacity-50"}`}>{step.title}</span>
            </li>
          ))}
        </ol>
      )}

      <ol
        className={
          pinned
            ? "relative h-[min(62svh,600px)]"
            : "no-scrollbar -mx-[var(--margin)] flex snap-x snap-mandatory gap-[var(--gutter)] overflow-x-auto px-[var(--margin)] lg:mx-0 lg:grid lg:grid-cols-3 lg:gap-y-16 lg:overflow-visible lg:px-0"
        }
      >
        {steps.map((step, i) => (
          <li
            key={step.title}
            aria-hidden={pinned && i !== active ? true : undefined}
            className={
              pinned
                ? `absolute inset-0 grid grid-cols-12 items-center gap-x-[var(--gutter)] transition-opacity duration-[560ms] ease-[var(--ease-soft)] ${i === active ? "opacity-100" : "pointer-events-none opacity-0"}`
                : "relative w-[78vw] flex-none snap-center md:w-[44vw] lg:w-auto"
            }
          >
            <div className={pinned ? "col-span-5 col-start-1 h-full max-h-full" : ""}>
              <div className={`slot aspect-square ${pinned ? "mx-auto h-full max-h-full w-auto" : "w-full"} [&>svg]:h-full [&>svg]:w-full`}>{visuals[i]}</div>
            </div>
            <div className={pinned ? "col-span-5 col-start-8" : "mt-6"}>
              <p className={`t-numeral ${pinned ? "text-[clamp(64px,7vw,120px)]" : "text-[44px]"} leading-none`} aria-label={`${stepWord} ${numerals[i]}`}>
                {numerals[i]}
              </p>
              <h3 className={`${pinned ? "t-h1 mt-6" : "t-h2 mt-3"}`}>{step.title}</h3>
              <p className={`${pinned ? "t-body-l mt-6" : "mt-3"} measure`}>{step.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
