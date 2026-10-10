"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { toFa } from "@/lib/format";

/**
 * Live gold sparkline — client keeps rolling history polled from /api/prices.
 * Pure SVG path animation; no layout thrash.
 */
export function GoldChart({ data, height = 150 }: { data: number[]; height?: number }) {
  const [width, setWidth] = useState(560);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width;
      if (w) setWidth(w);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const pts = data.length > 1 ? data : [1, 1];
  const min = Math.min(...pts);
  const max = Math.max(...pts);
  const span = max - min || 1;
  const pad = 6;

  const xy = pts.map((v, i) => {
    const x = (i / (pts.length - 1)) * width;
    const y = pad + (1 - (v - min) / span) * (height - pad * 2);
    return [x, y] as const;
  });

  const line = xy
    .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`)
    .join(" ");
  const area = `${line} L${width},${height} L0,${height} Z`;

  const first = pts[0];
  const last = pts[pts.length - 1];
  const delta = ((last - first) / first) * 100;
  const up = delta >= 0;

  return (
    <div ref={ref} className="relative w-full">
      {/* viewBox + w-full → fully fluid: no min-content blowout inside CSS grids on mobile */}
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="block h-auto w-full"
        aria-label="نمودار قیمت طلا"
      >
        <defs>
          <linearGradient id="gfill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.8 0.135 85)" stopOpacity="0.25" />
            <stop offset="100%" stopColor="oklch(0.8 0.135 85)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={area} fill="url(#gfill)" />
        <motion.path
          d={line}
          fill="none"
          stroke="oklch(0.8 0.135 85)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Head dot */}
        <circle
          cx={xy[xy.length - 1][0]}
          cy={xy[xy.length - 1][1]}
          r="4"
          fill="oklch(0.8 0.135 85)"
          stroke="oklch(0.155 0.014 168)"
          strokeWidth="2"
        />
      </svg>
      <div className="pointer-events-none absolute left-2 top-1 rounded-lg bg-background/60 px-2 py-1">
        <span className={`tnum font-mono text-xs font-bold ${up ? "text-[oklch(0.72_0.15_162)]" : "text-destructive"}`} dir="ltr">
          {up ? "+" : "−"}
          {toFa(Math.abs(delta), 2)}٪
        </span>
      </div>
    </div>
  );
}
