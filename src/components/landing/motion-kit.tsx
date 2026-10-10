"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { animate, motion, useInView } from "framer-motion";

/* ---------- Scroll reveal wrapper ---------- */
export function Reveal({
  children,
  delay = 0,
  y = 34,
  once = true,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  once?: boolean;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-72px" }}
      transition={{ type: "spring", stiffness: 70, damping: 18, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ---------- Kinetic word-by-word headline reveal ---------- */
export function KineticWords({
  text,
  className = "",
  delay = 0,
  stagger = 0.09,
  shimmerFrom,
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  /** word index (0-based) that gets the gold shimmer treatment */
  shimmerFrom?: number;
}) {
  const words = text.split(" ");
  return (
    <span className={className} aria-label={text}>
      {words.map((w, i) => (
        <span key={`${w}-${i}`} className="mask-word" aria-hidden>
          <motion.span
            initial={{ y: "112%", rotate: 4 }}
            whileInView={{ y: 0, rotate: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{
              type: "spring",
              stiffness: 90,
              damping: 17,
              delay: delay + i * stagger,
            }}
            className={shimmerFrom !== undefined && i >= shimmerFrom ? "text-shimmer" : ""}
          >
            {w}
            {i < words.length - 1 ? "\u00A0" : ""}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/* ---------- Animated section heading ---------- */
export function SectionHeading({
  eyebrow,
  title,
  shimmerFrom,
  description,
  align = "center",
}: {
  eyebrow: string;
  title: string;
  shimmerFrom?: number;
  description?: string;
  align?: "center" | "start";
}) {
  const centered = align === "center";
  return (
    <div className={`mb-12 ${centered ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}`}>
      <Reveal>
        <span
          className={`inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-1.5 text-[11px] font-bold tracking-wide text-primary ${
            centered ? "" : ""
          }`}
        >
          <span className="breathe size-1.5 rounded-full bg-success" />
          {eyebrow}
        </span>
      </Reveal>
      <h2 className="mt-5 text-3xl font-black leading-[1.15] tracking-tighter md:text-[2.6rem] md:leading-[1.12]">
        <KineticWords text={title} shimmerFrom={shimmerFrom} stagger={0.07} />
      </h2>
      {description ? (
        <Reveal delay={0.15}>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">
            {description}
          </p>
        </Reveal>
      ) : null}
    </div>
  );
}

/* ---------- Count-up number (fires once in view) ---------- */
export function CountUp({
  to,
  format = (v: number) => Math.round(v).toLocaleString("fa-IR"),
  duration = 1.6,
  className = "",
}: {
  to: number;
  format?: (v: number) => string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setVal(v),
    });
    return () => controls.stop();
  }, [inView, to, duration]);

  return (
    <span ref={ref} className={`tnum ${className}`}>
      {format(val)}
    </span>
  );
}

/* ---------- Magnetic button (cursor attraction) ---------- */
export function Magnetic({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  function onMove(e: React.MouseEvent) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    setPos({ x: x * 0.22, y: y * 0.28 });
  }

  return (
    <motion.span
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={() => setPos({ x: 0, y: 0 })}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: "spring", stiffness: 180, damping: 15, mass: 0.4 }}
      className="inline-block"
    >
      {children}
    </motion.span>
  );
}
