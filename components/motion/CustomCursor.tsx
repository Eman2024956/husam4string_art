"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

type CursorState = "view" | "drag" | "open";

/**
 * Desktop only. At rest: an 8px Toffee nail that trails the pointer. Over artwork it
 * grows into a small disc reading "View"; over drag zones, "Drag". The native cursor
 * stays, so text and controls behave as people expect. Never mounts on touch devices
 * or with reduced motion.
 */
export function CustomCursor({ labels }: { labels: Record<CursorState, string> }) {
  const dot = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [state, setState] = useState<CursorState | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    const update = () => setEnabled(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!enabled || !dot.current) return;
    const el = dot.current;
    const x = gsap.quickTo(el, "x", { duration: 0.24, ease: "power3.out" });
    const y = gsap.quickTo(el, "y", { duration: 0.24, ease: "power3.out" });
    const last = { x: -1, y: -1 };
    const read = (node: Element | null) => {
      const next = node?.closest<HTMLElement>("[data-cursor]")?.dataset.cursor;
      setState(next === "view" || next === "drag" || next === "open" ? next : null);
    };
    const onMove = (e: PointerEvent) => {
      last.x = e.clientX;
      last.y = e.clientY;
      x(e.clientX);
      y(e.clientY);
      el.style.opacity = "1";
      read(e.target as Element | null);
    };
    // The page can move under a still pointer, so re-read what is beneath it on scroll.
    const onScroll = () => {
      if (last.x >= 0) read(document.elementFromPoint(last.x, last.y));
    };
    const onLeave = () => {
      el.style.opacity = "0";
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div ref={dot} aria-hidden="true" className="pointer-events-none fixed left-0 top-0 z-[200] opacity-0">
      <div
        className={`flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full transition-[width,height,background-color,border-color] duration-[240ms] ease-[var(--ease-soft)] ${
          state ? "h-[72px] w-[72px] border border-linen/40 bg-black" : "h-2 w-2 border border-transparent bg-toffee"
        }`}
      >
        <span className={`text-[10px] font-medium uppercase tracking-[0.18em] text-linen transition-opacity duration-[240ms] rtl:text-[13px] rtl:normal-case rtl:tracking-normal ${state ? "opacity-100" : "opacity-0"}`}>
          {state ? labels[state] : ""}
        </span>
      </div>
    </div>
  );
}
