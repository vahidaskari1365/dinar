"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/**
 * Cinematic brand preloader — logo draw + progress, exits with a curtain lift.
 * Shown once per browser session so navigation stays snappy.
 * Backdrop stays opaque midnight-navy until the curtain fully leaves (no white flash).
 */
export function Preloader() {
  const [done, setDone] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem("dinar-intro")) {
      // async skip so the effect body stays synchronous-safe
      const skip = setTimeout(() => setDone(true), 0);
      return () => clearTimeout(skip);
    }
    const start = performance.now();
    const DURATION = 1300;
    let raf = 0;
    function tick(now: number) {
      const p = Math.min(1, (now - start) / DURATION);
      // ease-out curve for satisfying deceleration
      setProgress(Math.round((1 - Math.pow(1 - p, 3)) * 100));
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        sessionStorage.setItem("dinar-intro", "1");
        setTimeout(() => setDone(true), 260);
      }
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="preloader"
          exit={{ y: "-100%" }}
          transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[oklch(0.14_0.025_265)]"
          aria-hidden
        >
          {/* gold halo pulse behind the coin */}
          <div
            aria-hidden
            className="glow-pulse pointer-events-none absolute size-56 rounded-full bg-[radial-gradient(circle,oklch(0.84_0.135_88/16%),transparent_65%)] blur-2xl"
          />

          {/* Logo draw */}
          <svg
            viewBox="0 0 24 24"
            className="relative size-16 text-primary drop-shadow-[0_0_18px_oklch(0.84_0.135_88/45%)]"
            fill="none"
          >
            <motion.path
              d="M12 2.5 14.6 9.4 21.5 12 14.6 14.6 12 21.5 9.4 14.6 2.5 12 9.4 9.4Z"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinejoin="round"
              initial={{ pathLength: 0, fill: "oklch(0.84 0.135 88 / 0%)" }}
              animate={{ pathLength: 1, fill: "oklch(0.84 0.135 88 / 90%)" }}
              transition={{
                pathLength: { duration: 0.9, ease: "easeInOut" },
                fill: { duration: 0.5, delay: 0.55 },
              }}
            />
          </svg>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="relative mt-5 text-2xl font-black tracking-tight"
          >
            دینار
          </motion.p>

          {/* Progress — gold brand gradient */}
          <div className="relative mt-7 h-1 w-44 overflow-hidden rounded-full bg-surface-2">
            <motion.div
              className="h-full bg-gradient-to-l from-gold-deep via-gold to-gold-soft shadow-[0_0_12px_oklch(0.84_0.135_88/55%)]"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="tnum relative mt-3 font-mono text-xs text-muted-foreground" dir="ltr">
            {progress}%
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
