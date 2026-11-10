import Image from "next/image";
import type { Artwork } from "@/content/artworks";
import type { Locale } from "@/content/site";
import { ThreadArt } from "./ThreadArt";

/**
 * One artwork. Uses the photographed piece when `image` is set on the artwork;
 * otherwise draws the placeholder so the composition can be judged before the
 * photography exists.
 */
export function ArtPiece({ work, locale, className, sizes = "(min-width: 1024px) 45vw, 80vw", priority = false }: { work: Artwork; locale: Locale; className?: string; sizes?: string; priority?: boolean }) {
  if (work.image) {
    return <Image src={work.image} alt={work.alt[locale]} width={1600} height={1600} sizes={sizes} priority={priority} className={`${className ?? ""} object-cover`} />;
  }
  return <ThreadArt spec={work.art} tone={work.tone} label={work.alt[locale]} className={className} />;
}
