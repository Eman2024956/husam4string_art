import { Logo } from "@/components/ui/Logo";

/**
 * Thread closes the ring, four chords cross, the wordmark appears. About 1.6s, once
 * per session, and pure CSS — so it can never trap the visitor if scripts fail.
 * Skipped entirely for reduced motion (see globals.css and the boot script).
 */
export function Loader() {
  return (
    <div className="loader" aria-hidden="true">
      <div className="flex flex-col items-center">
        <svg viewBox="0 0 200 200" fill="none" stroke="#8C6147" strokeWidth="1">
          <circle className="ring" cx="100" cy="100" r="92" pathLength={1} transform="rotate(-90 100 100)" />
          <path className="chord" d="M24 54L176 146" pathLength={1} />
          <path className="chord" d="M176 54L24 146" pathLength={1} />
          <path className="chord" d="M100 8L146 180" pathLength={1} />
          <path className="chord" d="M54 180L100 8" pathLength={1} />
        </svg>
        <div className="mark">
          <Logo width={132} />
        </div>
      </div>
    </div>
  );
}
