import type Lenis from "lenis";

/** One Lenis instance for the page, reachable by overlays that need to pause scrolling. */
let instance: Lenis | null = null;

export function setLenis(lenis: Lenis | null): void {
  instance = lenis;
}

export function getLenis(): Lenis | null {
  return instance;
}

/** Pause page scroll while an overlay (menu, lightbox) is open. */
export function lockScroll(locked: boolean): void {
  if (locked) instance?.stop();
  else instance?.start();
  document.documentElement.style.overflow = locked ? "hidden" : "";
}
