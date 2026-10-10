"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { toFa } from "@/lib/format";

/**
 * Responsive sparkline height — maps to h-56 sm:h-64 lg:h-72 (224/256/288px).
 * Shared by gold-vault + wallet-demo so both charts resize fluidly.
 */
export function useChartHeight() {
  const [h, setH] = useState(224);
  useEffect(() => {
    const compute = () =>
      setH(window.innerWidth >= 1024 ? 288 : window.innerWidth >= 640 ? 256 : 224);
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);
  return h;
}

const GOLD = "#e8c877";
const SURFACE = "oklch(0.165 0.026 262)"; // --surface navy (head-dot halo)

/**
 * Live gold sparkline — client keeps rolling history polled from /api/prices.
 * Pure SVG path animation; no layout thrash. Midnight Sovereign palette:
 * champagne-gold line on deep navy, success/destructive only for the delta badge.
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
  // horizontal breathing room so the stroke + head dot never clip at the edges
  const padX = 5;

  const xy = pts.map((v, i) => {
    const x = padX + (i / (pts.length - 1)) * (width - padX * 2);
    const y = pad + (1 - (v - min) / span) * (height - pad * 2);
    return [x, y] as const;
  });

  const line = xy
    .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`)
    .join(" ");
  const area = `${line} L${width - padX},${height} L${padX},${height} Z`;

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
            <stop offset="0%" stopColor={GOLD} stopOpacity="0.22" />
            <stop offset="100%" stopColor={GOLD} stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* faint white/8% gridlines */}
        {[0.28, 0.55, 0.82].map((t) => (
          <line
            key={t}
            x1="0"
            x2={width}
            y1={Math.round(height * t) + 0.5}
            y2={Math.round(height * t) + 0.5}
            stroke="oklch(1 0 0 / 8%)"
            strokeWidth="1"
          />
        ))}
        <path d={area} fill="url(#gfill)" />
        <motion.path
          d={line}
          fill="none"
          stroke={GOLD}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Head dot */}
        <circle
          cx={xy[xy.length - 1][0]}
          cy={xy[xy.length - 1][1]}
          r="4"
          fill={GOLD}
          stroke={SURFACE}
          strokeWidth="2"
        />
      </svg>
      <div className="pointer-events-none absolute left-2 top-1 rounded-lg border border-border bg-card/90 px-2 py-1 backdrop-blur-sm">
        <span className={`tnum font-mono text-xs font-bold ${up ? "text-success" : "text-destructive"}`} dir="ltr">
          {up ? "+" : "−"}
          {toFa(Math.abs(delta), 2)}٪
        </span>
      </div>
    </div>
  );
}
