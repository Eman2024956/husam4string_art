"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Scroll reveals for the page. Rendered as the last child of <main> on purpose: the
 * page is streamed and hydrated after the layout, and GSAP must not touch the chapters'
 * inline styles until React has hydrated them, or the markup no longer matches.
 */
export function Reveals() {
  /**
   * Each element animates once. Text rises 24px and fades; images open
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
