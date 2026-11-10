"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import type { Locale } from "@/content/site";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Plays the signature opening once: lines → ring → nails → artwork → logo → statement.
 * Initial hidden states come from CSS keyed on html[data-motion="on"] (set before paint
 * in the layout), so nothing flashes and nothing is hidden when motion is reduced.
 */
export function HeroIntro({ locale }: { locale: Locale }) {
  useGSAP(
    () => {
      const hero = document.getElementById("top");
      if (!hero) return;
      const q = gsap.utils.selector(hero);
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const loaderPlayed = document.documentElement.dataset.loader !== "skip";
        const tl = gsap.timeline({ delay: loaderPlayed ? 1.45 : 0.1, defaults: { ease: "power2.inOut" } });
        tl.to(q(".hc"), { strokeDashoffset: 0, duration: 1.1, stagger: 0.06 })
          .to(q(".hero-ring"), { strokeDashoffset: 0, duration: 1.1 }, 0.35)
          .to(q(".hero-nails"), { autoAlpha: 1, duration: 0.5, ease: "none" }, 1.0)
          .to(q(".ha"), { autoAlpha: 1, duration: 0.6, stagger: 0.11, ease: "power1.out" }, 1.15)
          .to(q(".hc"), { opacity: 0.28, duration: 0.9 }, 1.5)
          .to(q(".hero-logo"), { autoAlpha: 1, duration: 0.6, ease: "none" }, 1.7)
          .to(q("[data-hero]"), { y: 0, autoAlpha: 1, duration: 0.96, stagger: 0.12, ease: "expo.out" }, 1.75);
      });

      // Desktop only: the artwork drifts a little slower than the page (parallax ≤ 8%).
      mm.add("(prefers-reduced-motion: no-preference) and (min-width: 1024px)", () => {
        gsap.to(q(".hero-art"), {
          yPercent: 8,
          ease: "none",
          scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true },
        });
      });

      return () => mm.revert();
    },
    { dependencies: [locale] },
  );
  return null;
}
