import type { Locale } from "@/content/site";
import { numeral } from "@/lib/i18n";

/** Numeral · thread · label on one line. The thread draws in on reveal. */
export function ChapterHead({ n, label, locale }: { n: number; label: string; locale: Locale }) {
  return (
    <p className="chapter-head" data-reveal="head">
      <span className="t-numeral text-[22px] leading-none" aria-hidden="true">
        {numeral(n, locale)}
      </span>
      <span className="thread" aria-hidden="true" />
      <span className="t-label">{label}</span>
    </p>
  );
}

/** A hand-pulled divider: one thread with a nail, drawn across a hard cut between rooms. */
export function ThreadDivider({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 1200 24" preserveAspectRatio="none" className={`block h-6 w-full ${className}`} aria-hidden="true" data-reveal="draw">
      <path d="M0 10Q600 20 1200 9" fill="none" stroke="var(--room-thread)" strokeWidth="1" vectorEffect="non-scaling-stroke" pathLength={1} />
    </svg>
  );
}
