import { FRAME_RADIUS, SHAPES, rng, sagPath, type Shape } from "@/lib/thread";

/** Stand-in for a customer's photograph: the same silhouette the thread piece is built from. */
export function PhotoPlaceholder({ shape, label, grid = false, className }: { shape: Shape; label?: string; grid?: boolean; className?: string }) {
  return (
    <svg
      viewBox="0 0 1000 1000"
      className={className}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <clipPath id={`photo-clip-${shape}`}>
          <rect width="1000" height="1000" />
        </clipPath>
      </defs>
      <rect width="1000" height="1000" fill="#98785D" />
      <rect width="1000" height="1000" fill="#EEE5DB" opacity="0.55" />
      <g clipPath={`url(#photo-clip-${shape})`} fill="#343C40" opacity="0.72">
        {SHAPES[shape].map((e, i) => (
          <ellipse key={i} cx={e.cx} cy={e.cy} rx={e.rx} ry={e.ry} />
        ))}
      </g>
      {grid && (
        <g stroke="#060708" strokeWidth="1" opacity="0.35" vectorEffect="non-scaling-stroke">
          {Array.from({ length: 9 }, (_, i) => (
            <path key={i} d={`M${(i + 1) * 100} 0V1000M0 ${(i + 1) * 100}H1000`} fill="none" vectorEffect="non-scaling-stroke" />
          ))}
          <circle cx="500" cy="500" r={FRAME_RADIUS} fill="none" vectorEffect="non-scaling-stroke" />
        </g>
      )}
    </svg>
  );
}

type Macro = "hands" | "nails" | "thread" | "frame";

/** Line drawings that mark where close-up photography goes. Thread language only, no stock imagery. */
export function MacroPlaceholder({ kind, className }: { kind: Macro; className?: string }) {
  const rand = rng(kind.length * 97);
  const stroke = "var(--room-thread)";
  const common = { fill: "none", stroke, strokeWidth: 1, vectorEffect: "non-scaling-stroke" as const };
  let body: React.ReactNode = null;

  if (kind === "nails") {
    const dots: string[] = [];
    const shadows: string[] = [];
    for (let r = 0; r < 5; r += 1) {
      for (let c = 0; c < 7; c += 1) {
        const x = 130 + c * 124 + (rand() - 0.5) * 14;
        const y = 150 + r * 176 + (rand() - 0.5) * 14;
        dots.push(`M${x.toFixed(1)} ${y.toFixed(1)}h0`);
        shadows.push(`M${x.toFixed(1)} ${y.toFixed(1)}l46 22`);
      }
    }
    body = (
      <>
        <path d={shadows.join("")} {...common} opacity="0.35" />
        <path d={dots.join("")} {...common} strokeWidth={9} strokeLinecap="round" />
      </>
    );
  } else if (kind === "thread") {
    const lines: string[] = [];
    for (let i = 0; i < 16; i += 1) {
      const y1 = 80 + rand() * 840;
      const y2 = 80 + rand() * 840;
      lines.push(sagPath(60, y1, 940, y2, 0.02));
    }
    body = <path d={lines.join("")} {...common} />;
  } else if (kind === "frame") {
    const lines: string[] = [];
    for (let i = 0; i < 10; i += 1) {
      lines.push(sagPath(250, 250 + i * 70, 250 + (i + 1) * 70, 930, 0.01));
    }
    body = (
      <>
        <path d="M120 940V120H940M180 940V180H940M250 940V250H940" {...common} />
        <path d={lines.join("")} {...common} opacity="0.7" />
        <path d="M250 250h0M250 320h0M250 390h0M250 460h0M250 530h0M250 600h0M250 670h0M250 740h0M250 810h0M250 880h0" {...common} strokeWidth={7} strokeLinecap="round" />
      </>
    );
  } else {
    const nails: string[] = [];
    const lines: string[] = [];
    for (let i = 0; i < 22; i += 1) {
      const x = 90 + i * 66;
      const y = 700 + Math.sin(i * 0.6) * 46;
      nails.push(`M${x.toFixed(1)} ${y.toFixed(1)}h0`);
      lines.push(sagPath(1180, 180, x, y, 0.018));
    }
    body = (
      <>
        <path d={lines.join("")} {...common} />
        <path d={nails.join("")} {...common} strokeWidth={8} strokeLinecap="round" />
        <circle cx="1180" cy="180" r="34" {...common} />
      </>
    );
  }

  const wide = kind === "hands";
  return (
    <svg viewBox={wide ? "0 0 1500 1000" : "0 0 1000 1000"} className={className} aria-hidden="true" preserveAspectRatio="xMidYMid slice">
      {body}
    </svg>
  );
}
