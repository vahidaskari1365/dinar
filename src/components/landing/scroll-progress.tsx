"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/** Gold scroll-progress hairline pinned to the very top. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 26,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[70] h-[3px] origin-right bg-gradient-to-l from-gold-deep via-gold to-gold-soft shadow-[0_0_14px_oklch(0.84_0.135_88/60%)]"
    />
  );
}
