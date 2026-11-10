/**
 * LOOMA thread engine — pure, deterministic geometry for the "one thread" visual language.
 * Everything is generated in a 1000 × 1000 viewBox and returned as SVG path data,
 * so it renders on the server and costs no client JavaScript.
 */

export type Shape = "bust" | "duo" | "child";

export interface Point {
  x: number;
  y: number;
}

interface Ellipse {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
}

/** Abstract silhouettes built from ellipses. They stand in for a photograph's subject. */
export const SHAPES: Record<Shape, Ellipse[]> = {
  bust: [
    { cx: 500, cy: 360, rx: 118, ry: 138 },
    { cx: 500, cy: 520, rx: 56, ry: 84 },
    { cx: 500, cy: 870, rx: 300, ry: 262 },
  ],
  duo: [
    { cx: 362, cy: 404, rx: 94, ry: 112 },
    { cx: 360, cy: 560, rx: 46, ry: 80 },
    { cx: 352, cy: 868, rx: 212, ry: 256 },
    { cx: 642, cy: 344, rx: 104, ry: 124 },
    { cx: 644, cy: 510, rx: 50, ry: 84 },
    { cx: 652, cy: 860, rx: 236, ry: 286 },
  ],
  child: [
    { cx: 606, cy: 304, rx: 100, ry: 118 },
    { cx: 608, cy: 462, rx: 48, ry: 80 },
    { cx: 614, cy: 812, rx: 232, ry: 306 },
    { cx: 362, cy: 528, rx: 74, ry: 84 },
    { cx: 358, cy: 650, rx: 38, ry: 64 },
    { cx: 352, cy: 908, rx: 152, ry: 214 },
  ],
};

export const FRAME_RADIUS = 440;
const CENTER = 500;

/** Small seeded PRNG so server and client always agree. */
export function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function inFrame(x: number, y: number, r = FRAME_RADIUS - 14): boolean {
  const dx = x - CENTER;
  const dy = y - CENTER;
  return dx * dx + dy * dy <= r * r;
}

function inShape(shape: Shape, x: number, y: number): boolean {
  if (!inFrame(x, y)) return false;
  return SHAPES[shape].some((e) => {
    const nx = (x - e.cx) / e.rx;
    const ny = (y - e.cy) / e.ry;
    return nx * nx + ny * ny <= 1;
  });
}

const r1 = (n: number): number => Math.round(n * 10) / 10;

export interface ThreadArt {
  nails: Point[];
  /** Thread passes in the order they would be pulled, as "Mx y Lx y" segments. */
  segments: string[];
}

/**
 * Nails are scattered inside the silhouette; thread is pulled between nearby nails
 * whose path stays inside it. The result reads as a hand-strung figure, not a plot.
 */
export function shapeArt(shape: Shape, seed: number, nailCount = 150, passCount = 420): ThreadArt {
  const rand = rng(seed);
  const nails: Point[] = [];
  let guard = 0;
  while (nails.length < nailCount && guard < 40000) {
    guard += 1;
    const x = 60 + rand() * 880;
    const y = 60 + rand() * 880;
    if (!inShape(shape, x, y)) continue;
    if (nails.some((n) => (n.x - x) ** 2 + (n.y - y) ** 2 < 26 * 26)) continue;
    nails.push({ x: r1(x), y: r1(y) });
  }

  const segments: string[] = [];
  let current = Math.floor(rand() * nails.length);
  let misses = 0;
  guard = 0;
  while (segments.length < passCount && guard < passCount * 80) {
    guard += 1;
    if (misses > 24) {
      current = Math.floor(rand() * nails.length);
      misses = 0;
    }
    const next = Math.floor(rand() * nails.length);
    misses += 1;
    if (next === current) continue;
    const a = nails[current];
    const b = nails[next];
    const dist = Math.hypot(a.x - b.x, a.y - b.y);
    if (dist < 60 || dist > 430) continue;
    let ok = true;
    for (let s = 1; s < 10; s += 1) {
      const t = s / 10;
      if (!inShape(shape, a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t)) {
        ok = false;
        break;
      }
    }
    if (!ok) continue;
    segments.push(`M${a.x} ${a.y}L${b.x} ${b.y}`);
    current = next;
    misses = 0;
  }
  return { nails, segments };
}

/** Nails on the frame ring, thread pulled from nail i to nail i·k — classic chord work. */
export function ringArt(nailCount: number, k: number, radius = FRAME_RADIUS - 20): ThreadArt {
  const nails: Point[] = [];
  for (let i = 0; i < nailCount; i += 1) {
    const a = (i / nailCount) * Math.PI * 2 - Math.PI / 2;
    nails.push({ x: r1(CENTER + Math.cos(a) * radius), y: r1(CENTER + Math.sin(a) * radius) });
  }
  const segments: string[] = [];
  for (let i = 1; i < nailCount; i += 1) {
    const j = Math.round(i * k) % nailCount;
    if (j === i) continue;
    segments.push(`M${nails[i].x} ${nails[i].y}L${nails[j].x} ${nails[j].y}`);
  }
  return { nails, segments };
}

/** Join a slice of passes into one path, so a whole artwork is a handful of DOM nodes. */
export function joinSegments(segments: string[], from = 0, to = segments.length): string {
  return segments.slice(from, to).join("");
}

/** Split passes into n paths for staged reveals. */
export function chunkSegments(segments: string[], n: number): string[] {
  const size = Math.ceil(segments.length / n);
  const out: string[] = [];
  for (let i = 0; i < n; i += 1) {
    const d = joinSegments(segments, i * size, (i + 1) * size);
    if (d) out.push(d);
  }
  return out;
}

/** A hand-pulled line: never perfectly straight, a 1–2% sag. */
export function sagPath(x1: number, y1: number, x2: number, y2: number, sag = 0.015): string {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2 + Math.hypot(x2 - x1, y2 - y1) * sag;
  return `M${r1(x1)} ${r1(y1)}Q${r1(mx)} ${r1(my)} ${r1(x2)} ${r1(y2)}`;
}

/** Long construction chords across the frame, used for the hero's opening lines. */
export function frameChords(count: number, seed: number, radius = FRAME_RADIUS): string[] {
  const rand = rng(seed);
  const out: string[] = [];
  for (let i = 0; i < count; i += 1) {
    const a = rand() * Math.PI * 2;
    const b = a + Math.PI * (0.55 + rand() * 0.9);
    out.push(
      sagPath(
        CENTER + Math.cos(a) * radius,
        CENTER + Math.sin(a) * radius,
        CENTER + Math.cos(b) * radius,
        CENTER + Math.sin(b) * radius,
        0.012,
      ),
    );
  }
  return out;
}
