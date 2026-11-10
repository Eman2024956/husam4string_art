"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { setLenis } from "@/lib/lenis";

gsap.registerPlugin(ScrollTrigger);

/**
 * Lenis drives the scroll, GSAP's ticker drives Lenis, and ScrollTrigger reads from
 * both — one clock for everything. Lenis already switches smoothing off for
 * prefers-reduced-motion, so no extra branch is needed here.
 */
export function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({ anchors: true, lerp: 0.11 });
    setLenis(lenis);
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  return null;
}
