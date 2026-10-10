"use client";

import { useRef } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

/**
 * Premium 3D bank card — mouse-tracked tilt physics + holographic foil glare.
 * Motion values kept outside React render cycle (taste-skill rule).
 */
export function BankCard({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rx = useSpring(useTransform(my, [0, 1], [14, -14]), {
    stiffness: 130,
    damping: 16,
  });
  const ry = useSpring(useTransform(mx, [0, 1], [-16, 16]), {
    stiffness: 130,
    damping: 16,
  });
  const glareX = useTransform(mx, [0, 1], ["12%", "88%"]);
  const glareY = useTransform(my, [0, 1], ["8%", "92%"]);
  const glare = useMotionTemplate`radial-gradient(520px circle at ${glareX} ${glareY}, oklch(0.98 0.06 95 / 30%), oklch(0.85 0.13 88 / 8%) 34%, transparent 60%)`;

  function onMove(e: React.MouseEvent) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width);
    my.set((e.clientY - rect.top) / rect.height);
  }
  function onLeave() {
    mx.set(0.5);
    my.set(0.5);
  }

  return (
    <div
      className={`[perspective:1500px] ${className}`}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <motion.div
        ref={ref}
        style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
        className="relative aspect-[8/5] w-full select-none rounded-[1.75rem] p-6 md:p-7"
      >
        {/* Card body — layered gold on charcoal */}
        <div className="absolute inset-0 rounded-[1.75rem] bg-[linear-gradient(135deg,oklch(0.27_0.035_80)_0%,oklch(0.18_0.02_78)_45%,oklch(0.25_0.05_85)_100%)]" />

        {/* Holographic foil — subtle conic sheen */}
        <div className="absolute inset-0 rounded-[1.75rem] bg-[conic-gradient(from_210deg_at_70%_30%,transparent_0deg,oklch(0.85_0.12_88/14%)_60deg,transparent_130deg,oklch(0.8_0.1_95/10%)_220deg,transparent_300deg)]" />

        <div className="absolute inset-0 rounded-[1.75rem] border border-white/15" />
        <div className="absolute inset-0 rounded-[1.75rem] shadow-[inset_0_1px_0_oklch(1_0_0/20%),inset_0_-1px_0_oklch(0_0_0/35%),0_40px_80px_-24px_oklch(0_0_0/70%)]" />

        {/* Cursor-tracked foil glare */}
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-[1.75rem] opacity-80 mix-blend-soft-light"
          style={{ background: glare }}
        />

        {/* Shine sweep */}
        <div className="shine pointer-events-none absolute inset-0 overflow-hidden rounded-[1.75rem]" />

        {/* Content */}
        <div
          className="relative flex h-full flex-col justify-between"
          style={{ transform: "translateZ(46px)" }}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="glow-pulse grid size-11 place-items-center rounded-2xl bg-primary text-primary-foreground">
                <svg viewBox="0 0 24 24" className="size-6" fill="none" aria-hidden>
                  <path
                    d="M12 2.5 14.6 9.4 21.5 12 14.6 14.6 12 21.5 9.4 14.6 2.5 12 9.4 9.4Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <div>
                <p className="text-lg font-extrabold leading-none tracking-tight">
                  دینار
                </p>
                <p className="mt-1 font-mono text-[10px] tracking-[0.3em] text-foreground/50">
                  DINAR
                </p>
              </div>
            </div>
            <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] font-semibold text-primary">
              مجازی
            </span>
          </div>

          {/* Chip + waves */}
          <div className="flex items-center justify-between">
            <div className="h-9 w-12 rounded-lg bg-[linear-gradient(135deg,oklch(0.83_0.12_86),oklch(0.65_0.1_78))] p-[3px] shadow-[0_4px_10px_-3px_oklch(0_0_0/50%)]">
              <div className="grid h-full w-full grid-cols-3 gap-[2px] opacity-80">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="rounded-[2px] bg-black/20" />
                ))}
              </div>
            </div>
            <svg
              viewBox="0 0 36 24"
              className="size-8 text-foreground/60"
              fill="currentColor"
              aria-hidden
            >
              <path d="M12 4a8 8 0 0 1 0 16 8 8 0 0 0 0-16Zm12 0a8 8 0 0 1 0 16 8 8 0 0 0 0-16Z" />
            </svg>
          </div>

          {/* Number */}
          <div>
            <p
              dir="ltr"
              className="tnum text-right font-mono text-[17px] tracking-[0.14em] text-foreground/85 md:text-lg"
            >
              6037••••••••4217
            </p>
            <div className="mt-3 flex items-center justify-between text-[11px] text-foreground/55">
              <span>حساب چندارزی</span>
              <span className="font-mono" dir="ltr">
                09/29
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
