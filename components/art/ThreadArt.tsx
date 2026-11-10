import type { Artwork, Tone } from "@/content/artworks";
import { FRAME_RADIUS, chunkSegments, ringArt, shapeArt, type Point, type ThreadArt as Art } from "@/lib/thread";

export function buildArt(spec: Artwork["art"]): Art {
  return spec.kind === "shape" ? shapeArt(spec.shape, spec.seed) : ringArt(spec.nails, spec.k);
}

/** All nails as one path of zero-length round-capped strokes: one DOM node, any count. */
export function nailPath(nails: Point[]): string {
  return nails.map((n) => `M${n.x} ${n.y}h0`).join("");
}

const PALETTE: Record<Tone, { board: string; ring: string; nail: string; threads: string[] }> = {
  color: { board: "#E5DACD", ring: "rgb(52 60 64 / 0.3)", nail: "#343C40", threads: ["#8C6147", "#905335", "#343C40"] },
  bw: { board: "#060708", ring: "rgb(238 229 219 / 0.28)", nail: "#EEE5DB", threads: ["rgb(238 229 219 / 0.9)", "rgb(238 229 219 / 0.6)", "rgb(238 229 219 / 0.8)"] },
};

interface Props {
  spec: Artwork["art"];
  tone: Tone;
  label?: string;
  /** 0–1: how much of the thread has been pulled. Used by the process chapter. */
  progress?: number;
  nailsOnly?: boolean;
  className?: string;
}

/**
 * A placeholder artwork drawn from the thread engine. It is a stand-in for a
 * photographed LOOMA piece and is replaced as soon as `image` is set on the artwork.
 */
export function ThreadArt({ spec, tone, label, progress = 1, nailsOnly = false, className }: Props) {
  const art = buildArt(spec);
  const p = PALETTE[tone];
  const used = art.segments.slice(0, Math.round(art.segments.length * progress));
  const layers = nailsOnly ? [] : chunkSegments(used, 3);
  return (
    <svg
      viewBox="0 0 1000 1000"
      className={className}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="1000" height="1000" fill={p.board} />
      <circle cx="500" cy="500" r={FRAME_RADIUS} fill="none" stroke={p.ring} strokeWidth="1" vectorEffect="non-scaling-stroke" />
      {layers.map((d, i) => (
        <path key={i} d={d} fill="none" stroke={p.threads[i % p.threads.length]} strokeWidth="0.75" vectorEffect="non-scaling-stroke" />
      ))}
      <path d={nailPath(art.nails)} fill="none" stroke={p.nail} strokeWidth="4" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
