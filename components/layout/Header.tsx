"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { site, type Locale } from "@/content/site";
import type { Dictionary } from "@/content/types";
import { lockScroll } from "@/lib/lenis";
import { numeral } from "@/lib/i18n";
import { useFocusTrap } from "@/lib/useFocusTrap";
import { Logo } from "@/components/ui/Logo";
import { LanguageSwitcher } from "./LanguageSwitcher";

interface Props {
  locale: Locale;
  nav: Dictionary["nav"];
  whatsappLabel: string;
}

const SECTIONS = ["top", "about", "gallery", "process", "diy", "contact"] as const;

export function Header({ locale, nav, whatsappLabel }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("top");
  const menuRef = useRef<HTMLDivElement>(null);
  const lastY = useRef(0);

  const items = [
    { id: "top", label: nav.home },
    { id: "about", label: nav.about },
    { id: "gallery", label: nav.work },
    { id: "process", label: nav.process },
    { id: "diy", label: nav.diy },
    { id: "contact", label: nav.contact },
  ];

  // Hide on scroll-down after 120px, return on any scroll-up.
  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolled(y > 24);
        setHidden(y > 120 && y > lastY.current);
        lastY.current = y;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  // The current chapter is marked with a nail.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    SECTIONS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const close = useCallback(() => setOpen(false), []);
  useFocusTrap(menuRef, open, close);
  useEffect(() => {
    lockScroll(open);
    return () => lockScroll(false);
  }, [open]);

  const solid = scrolled && !open;

  return (
    <>
      <header
        className={[
          "fixed inset-x-0 top-0 z-[100] transition-[transform,background-color,color,height,border-color] duration-[400ms] ease-[var(--ease-soft)] border-b",
          solid ? "h-[60px] bg-linen/[0.88] text-graphite backdrop-blur-[12px] border-[var(--line-on-light)]" : "h-[72px] bg-transparent text-linen border-transparent",
          hidden && !open ? "-translate-y-full" : "translate-y-0",
        ].join(" ")}
      >
        <div className="wrap flex h-full items-center justify-between gap-6">
          <a href={`/${locale}#top`} aria-label={`${site.name} — ${nav.home}`} className="flex min-h-[44px] items-center">
            <Logo width={116} />
          </a>

          <nav aria-label={nav.primary} className="hidden lg:block">
            <ul className="flex items-center gap-8">
              {items.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    aria-current={active === item.id ? "true" : undefined}
                    className="group relative flex min-h-[44px] items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em] rtl:text-[14px] rtl:normal-case rtl:tracking-normal"
                  >
                    <span
                      className={`nail transition-opacity duration-[240ms] ${active === item.id ? "opacity-100" : "opacity-0 group-hover:opacity-50"}`}
                      aria-hidden="true"
                    />
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2 md:gap-6">
            <div className="hidden md:block">
              <LanguageSwitcher locale={locale} label={nav.language} />
            </div>
            <button
              type="button"
              className="flex min-h-[44px] items-center gap-3 text-[11px] font-medium uppercase tracking-[0.2em] lg:hidden rtl:text-[14px] rtl:normal-case rtl:tracking-normal"
              aria-expanded={open}
              aria-controls="site-menu"
              onClick={() => setOpen(true)}
            >
              <span>{nav.menu}</span>
              <span aria-hidden="true" className="relative block h-[9px] w-7">
                <span className="absolute inset-x-0 top-0 h-px bg-current" />
                <span className="absolute inset-x-0 bottom-0 h-px bg-current" />
                <span className="nail absolute -top-[2.5px] start-0" />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Full-screen chapter index. A Rich Black mask wipes down; items rise in sequence. */}
      <div
        id="site-menu"
        ref={menuRef}
        role="dialog"
        aria-modal="true"
        aria-label={nav.menu}
        inert={!open}
        data-lenis-prevent
        className={[
          "on-dark fixed inset-0 z-[300] flex flex-col overflow-y-auto bg-black text-linen transition-[clip-path,visibility] duration-[560ms] ease-[var(--ease-thread)] lg:hidden",
          open ? "visible [clip-path:inset(0_0_0_0)]" : "invisible [clip-path:inset(0_0_100%_0)]",
        ].join(" ")}
      >
        <div className="wrap flex h-[72px] flex-none items-center justify-between">
          <Logo width={116} />
          <button
            type="button"
            className="flex min-h-[44px] items-center gap-3 text-[11px] font-medium uppercase tracking-[0.2em] rtl:text-[14px] rtl:normal-case rtl:tracking-normal"
            onClick={close}
          >
            {nav.close}
            <span aria-hidden="true" className="relative block h-4 w-4">
              <span className="absolute left-0 top-1/2 h-px w-full rotate-45 bg-current" />
              <span className="absolute left-0 top-1/2 h-px w-full -rotate-45 bg-current" />
            </span>
          </button>
        </div>

        <nav aria-label={nav.primary} className="wrap flex-1 py-6">
          <ul>
            {items.map((item, i) => (
              <li
                key={item.id}
                className={`border-b border-[var(--line-on-dark)] transition-[transform,opacity] duration-[560ms] ease-[var(--ease-settle)] ${open ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
                style={{ transitionDelay: open ? `${180 + i * 70}ms` : "0ms" }}
              >
                <a href={`#${item.id}`} onClick={close} className="flex min-h-[64px] items-baseline gap-5 py-3">
                  <span className="t-numeral w-8 flex-none text-[15px] text-toffee" aria-hidden="true">
                    {numeral(i + 1, locale)}
                  </span>
                  <span className="t-h1 !text-[clamp(30px,9vw,44px)]">{item.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="wrap flex flex-none flex-col gap-6 pb-10 pt-4">
          <LanguageSwitcher locale={locale} label={nav.language} />
          <a href={site.whatsapp.href} target="_blank" rel="noopener noreferrer" className="btn btn-primary w-full">
            {whatsappLabel}
          </a>
        </div>
      </div>
    </>
  );
}
