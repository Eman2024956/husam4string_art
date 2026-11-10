"use client";

import { useRef, useState, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import type { Dictionary } from "@/content/types";

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface Props {
  t: Dictionary["diy"];
  numerals: string[];
  /** Server-rendered SVG with groups marked data-layer="photo|simple|nails|threads|frame". */
  stage: ReactNode;
}

/** Which layers are visible at each step: photo → simplified art → nail map → thread paths → final artwork. */
const LAYERS: Record<string, number[]> = {
  photo: [1, 0, 0, 0, 0],
  simple: [0, 1, 0.22, 0, 0],
  nails: [0, 0, 1, 1, 1],
  frame: [0, 0, 0, 0, 1],
};
const THREAD_SHARE = [0, 0, 0, 0.55, 1];

export function DiySequence({ t, numerals, stage }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
  const auto = useRef<gsap.core.Tween | null>(null);
  const last = t.steps.length - 1;

  const go = (next: number) => {
    auto.current?.kill();
    auto.current = null;
    setStep(Math.min(last, Math.max(0, next)));
  };

  // Move the stage to the current step. Reduced motion gets the same states without the travel.
  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const duration = reduce ? 0 : 0.56;
      Object.entries(LAYERS).forEach(([name, values]) => {
        gsap.to(`[data-layer="${name}"]`, { autoAlpha: values[step], duration, ease: "power2.inOut", overwrite: true });
      });
      const threads = gsap.utils.toArray<SVGPathElement>(".diy-thread");
      const shown = Math.round(threads.length * THREAD_SHARE[step]);
      threads.forEach((path, i) => {
        gsap.to(path, { autoAlpha: i < shown ? 1 : 0, duration: reduce ? 0 : 0.4, delay: reduce || i >= shown ? 0 : i * 0.045, ease: "none", overwrite: true });
      });
    },
    { dependencies: [step], scope: root },
  );

  // Play through once when the chapter arrives; any interaction hands control to the visitor.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        ScrollTrigger.create({
          trigger: root.current,
          start: "top 60%",
          once: true,
          onEnter: () => {
            const state = { v: 0 };
            auto.current = gsap.to(state, {
              v: last,
              duration: last * 1.9,
              ease: "none",
              onUpdate: () => setStep(Math.round(state.v)),
            });
          },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div ref={root} className="grid12 items-center gap-y-10">
      <div className="col-span-4 md:col-span-8 lg:col-span-6">
        <div className="relative mx-auto aspect-square w-full max-w-[560px] border border-[var(--room-line)] [&>svg]:h-full [&>svg]:w-full" role="img" aria-label={`${t.stageLabel}: ${t.steps[step].title}`}>
          {stage}
        </div>
      </div>

      <div className="col-span-4 md:col-span-8 lg:col-span-5 lg:col-start-8">
        <ol className="border-t border-[var(--room-line)]">
          {t.steps.map((s, i) => (
            <li key={s.title} className="border-b border-[var(--room-line)]">
              <button
                type="button"
                aria-current={i === step ? "step" : undefined}
                className={`flex min-h-[56px] w-full items-center gap-5 py-2 text-start transition-opacity duration-[240ms] ${i === step ? "opacity-100" : "opacity-60 hover:opacity-100"}`}
                onClick={() => go(i)}
              >
                <span className="t-numeral w-9 flex-none text-[24px] leading-none" aria-hidden="true">
                  {numerals[i]}
                </span>
                <span className="t-h2 flex-1 !text-[clamp(20px,1.7vw,26px)]">{s.title}</span>
                <span className={`nail ${i === step ? "opacity-100" : "opacity-0"}`} aria-hidden="true" />
              </button>
            </li>
          ))}
        </ol>

        <p className="t-body-l mt-6 min-h-[3.4em]" aria-live="polite">
          {t.steps[step].text}
        </p>

        <div className="mt-6 flex items-center gap-3">
          <button type="button" className="btn btn-secondary" onClick={() => go(step - 1)} disabled={step === 0} style={{ opacity: step === 0 ? 0.4 : 1 }}>
            {t.back}
          </button>
          <button type="button" className="btn btn-primary" onClick={() => go(step === last ? 0 : step + 1)}>
            {t.next}
          </button>
        </div>
      </div>
    </div>
  );
}
