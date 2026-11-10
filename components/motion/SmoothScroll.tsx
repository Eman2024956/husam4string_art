"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { setLenis } from "@/lib/lenis";

gsap.registerPlugin(ScrollTrigger, useGSAP);

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

  /**
   * Scroll reveals. Each element animates once. Text rises 24px and fades; images open
   * from an 8% inset; chapter threads and dividers are drawn. With reduced motion the
   * block is skipped and everything simply stays visible.
   */
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const text = gsap.utils.toArray<HTMLElement>('[data-reveal="text"]');
      gsap.set(text, { y: 24, autoAlpha: 0 });
      ScrollTrigger.batch(text, {
        start: "top 88%",
        once: true,
        onEnter: (batch) => gsap.to(batch, { y: 0, autoAlpha: 1, duration: 0.96, ease: "expo.out", stagger: 0.12, overwrite: true }),
      });

      const images = gsap.utils.toArray<HTMLElement>('[data-reveal="image"]');
      gsap.set(images, { clipPath: "inset(8% 8% 8% 8%)", autoAlpha: 0 });
      ScrollTrigger.batch(images, {
        start: "top 88%",
        once: true,
        onEnter: (batch) => gsap.to(batch, { clipPath: "inset(0% 0% 0% 0%)", autoAlpha: 1, duration: 0.96, ease: "power2.inOut", stagger: 0.12, overwrite: true }),
      });

      gsap.utils.toArray<HTMLElement>('[data-reveal="head"]').forEach((head) => {
        const thread = head.querySelector(".thread");
        gsap.set(head, { autoAlpha: 0 });
        if (thread) gsap.set(thread, { scaleX: 0 });
        ScrollTrigger.create({
          trigger: head,
          start: "top 88%",
          once: true,
          onEnter: () => {
            gsap.to(head, { autoAlpha: 1, duration: 0.4 });
            if (thread) gsap.to(thread, { scaleX: 1, duration: 0.96, ease: "power2.inOut" });
          },
        });
      });

      gsap.utils.toArray<SVGElement>('[data-reveal="draw"]').forEach((svg) => {
        const paths = svg.querySelectorAll("path, circle");
        gsap.set(paths, { strokeDasharray: 1, strokeDashoffset: 1 });
        ScrollTrigger.create({
          trigger: svg,
          start: "top 90%",
          once: true,
          onEnter: () => gsap.to(paths, { strokeDashoffset: 0, duration: 1.6, ease: "power3.inOut", stagger: 0.08 }),
        });
      });
    });
    return () => mm.revert();
  });

  return null;
}
