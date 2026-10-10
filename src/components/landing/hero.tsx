"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { ArrowDownLeft, TrendingDown, TrendingUp } from "lucide-react";
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern";
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";
import { NumberTicker } from "@/components/ui/number-ticker";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { WordRotate } from "@/components/ui/word-rotate";
import { BankCard } from "./bank-card";
import { KineticWords, Magnetic } from "./motion-kit";

type Prices = {
  gold: number;
  goldChange: number;
  usdt: number;
  usd: number;
};

const fa = (n: number) => n.toLocaleString("fa-IR");

/** Rotating gold-accent words — module scope keeps identity stable across renders */
const GOLD_WORDS = ["طلا بشه", "سرمایه بشه", "آرامش بشه"];

const faFmt1 = (v: number) =>
  v.toLocaleString("fa-IR", { maximumFractionDigits: 1 });
const faFmt0 = (v: number) =>
  v.toLocaleString("fa-IR", { maximumFractionDigits: 0 });

/* ---------- live price chip (real data from /api/prices) ---------- */
function PriceChip({
  label,
  value,
  unit,
  change,
  className,
  delay = 0,
}: {
  label: string;
  value: number;
  unit?: string;
  change?: number;
  className?: string;
  delay?: number;
}) {
  const [tick, setTick] = useState({ prev: value, dir: null as null | "up" | "down" });
  if (value !== tick.prev) {
    setTick({ prev: value, dir: value > tick.prev ? "up" : "down" });
  }
  const dir = tick.dir;

  return (
    <motion.div
      animate={{ y: [0, 9, 0] }}
      transition={{ duration: 5.4, repeat: Infinity, ease: "easeInOut", delay }}
      className={`glass rounded-2xl px-4 py-3 shadow-[0_18px_40px_-18px_oklch(0_0_0/80%)] ${className ?? ""}`}
    >
      <div className="flex items-center gap-2">
        <p className="text-[11px] text-muted-foreground">{label}</p>
        {change !== undefined && change !== 0 ? (
          <span
            className={`tnum inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
              change > 0 ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive"
            }`}
          >
            {change > 0 ? (
              <TrendingUp className="size-2.5" />
            ) : (
              <TrendingDown className="size-2.5" />
            )}
            {/* dir=ltr + manual sign → minus/plus always leads the number (no RTL bidi flip) */}
            <span dir="ltr" className="inline-flex tnum">
              {change > 0 ? "+" : "−"}
              {fa(Math.abs(change))}٪
            </span>
          </span>
        ) : null}
      </div>
      <p
        key={value}
        dir="ltr"
        className={`tnum mt-0.5 font-mono text-sm font-bold ${
          dir === "up" ? "flash-up" : dir === "down" ? "flash-down" : ""
        } ${label.includes("طلا") ? "text-primary" : ""}`}
      >
        {fa(value)}
        {unit ? <span className="text-[10px] text-muted-foreground"> {unit}</span> : null}
      </p>
    </motion.div>
  );
}

/* ---------- floating gold coin dust ---------- */
function CoinDust() {
  const coins = [
    { size: "size-9", top: "6%", left: "58%", d: 7, o: 0.9 },
    { size: "size-5", top: "70%", left: "92%", d: 5.6, o: 0.7 },
    { size: "size-7", top: "84%", left: "60%", d: 6.4, o: 0.5 },
    { size: "size-4", top: "16%", left: "88%", d: 5, o: 0.6 },
  ];
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-20 hidden lg:block">
      {coins.map((c, i) => (
        <motion.span
          key={i}
          className={`absolute ${c.size} rounded-full bg-[radial-gradient(circle_at_32%_28%,oklch(0.93_0.13_92),oklch(0.78_0.13_84)_55%,oklch(0.58_0.11_74))] shadow-[0_8px_18px_-6px_oklch(0.75_0.13_85/60%)]`}
          style={{ top: c.top, left: c.left, opacity: c.o }}
          animate={{ y: [0, -14, 0], rotate: [0, 180, 360] }}
          transition={{
            duration: c.d,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.7,
          }}
        />
      ))}
    </div>
  );
}

const STATS = [
  { to: 4, format: (v: number) => `${faFmt1(v)}٪`, label: "پاداش نگهداشت ماهانه" },
  {
    to: 0.5,
    format: (v: number) => `${faFmt1(v)} ثانیه`,
    label: "میانگین تسویه واریز",
  },
  { to: 3, format: (v: number) => `${faFmt0(v)} ارز + طلا`, label: "سبد حساب چندارزی" },
];

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const smx = useMotionValue(50);
  const smy = useMotionValue(30);
  const spotlight = useMotionTemplate`radial-gradient(560px circle at ${smx}% ${smy}%, oklch(0.8 0.135 85 / 7.5%), transparent 70%)`;

  function onSpot(e: React.MouseEvent) {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    smx.set(toPercent(e.clientX - rect.left, rect.width));
    smy.set(toPercent(e.clientY - rect.top, rect.height));
  }

  // live prices — deterministic baselines match the server on first paint
  const [prices, setPrices] = useState<Prices>({
    gold: 8_150_000,
    goldChange: 0,
    usdt: 108_500,
    usd: 109_259,
  });

  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const r = await fetch("/api/prices");
        if (!r.ok) return;
        const p = await r.json();
        if (alive) setPrices(p);
      } catch {
        /* silent — chips keep last known price */
      }
    };
    load();
    const id = setInterval(load, 5000);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, []);

  return (
    <section
      id="top"
      ref={sectionRef}
      onMouseMove={onSpot}
      className="vignette relative flex min-h-[100svh] items-center overflow-hidden px-4 pb-20 pt-32 sm:px-6 md:pb-24 md:pt-36"
    >
      {/* ---------- cinematic backdrop ---------- */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {/* Magic UI animated blueprint grid — gold-tinted squares, radial fade */}
        <AnimatedGridPattern
          width={56}
          height={56}
          numSquares={30}
          maxOpacity={0.07}
          duration={4}
          repeatDelay={0.5}
          className="fill-gold stroke-gold/10 [mask-image:radial-gradient(ellipse_90%_70%_at_50%_30%,black_25%,transparent_72%)] [-webkit-mask-image:radial-gradient(ellipse_90%_70%_at_50%_30%,black_25%,transparent_72%)]"
        />
        <div className="aurora-a absolute -top-40 right-[4%] size-[42rem] rounded-full bg-[radial-gradient(circle,oklch(0.55_0.11_80/30%),transparent_62%)] blur-3xl" />
        {/* navy-blue blob — Midnight Sovereign (was green hue 168) */}
        <div className="aurora-b absolute top-1/3 -left-48 size-[44rem] rounded-full bg-[radial-gradient(circle,oklch(0.5_0.12_262/30%),transparent_64%)] blur-3xl" />
        <div className="absolute bottom-[-12rem] left-1/4 h-[30rem] w-[52rem] rounded-full bg-[radial-gradient(ellipse,oklch(0.6_0.13_85/16%),transparent_68%)] blur-3xl" />
        {/* mouse spotlight */}
        <motion.div className="absolute inset-0" style={{ background: spotlight }} />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-primary/40 to-transparent" />
      </div>

      <motion.div
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.1, delayChildren: 0.35 } },
        }}
        className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-6"
      >
        {/* ---------- copy ---------- */}
        <div className="max-w-xl">
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 90, damping: 16 } },
            }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-1.5 text-xs font-medium"
          >
            <span className="breathe size-1.5 shrink-0 rounded-full bg-success" />
            <AnimatedShinyText className="text-primary/90 dark:text-primary/90">
              فاز صفر — جذب سرمایه و اخذ مجوز در جریان است
            </AnimatedShinyText>
          </motion.div>

          <h1 className="text-[2.2rem] font-black leading-[1.16] tracking-tighter sm:text-[2.6rem] md:text-[3.6rem] md:leading-[1.1]">
            <KineticWords text="پولت نباید خواب بمونه؛" stagger={0.1} />
            <span className="-mt-1 flex flex-wrap items-center gap-x-3">
              <KineticWords text="بذار" delay={0.35} stagger={0.12} />
              <WordRotate
                words={GOLD_WORDS}
                duration={2600}
                className="text-shimmer inline-flex"
              />
            </span>
          </h1>

          <motion.p
            variants={{
              hidden: { opacity: 0, y: 22 },
              show: {
                opacity: 1,
                y: 0,
                transition: { type: "spring", stiffness: 80, damping: 18, delay: 0.5 },
              },
            }}
            className="mt-6 max-w-[60ch] text-base leading-relaxed text-muted-foreground md:text-lg"
          >
            دینار یک نئوبانک چندارزی برای خاورمیانه است: واریز و برداشت آنی با
            درگاه پرداخت، حساب تومان و تتر و دلار، خرید طلای واقعی از دومین‌های
            رسمی و صدور کارت مجازی — همه در یک اپ، بدون شعبه و بدون کاغذ.
          </motion.p>

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 22 },
              show: {
                opacity: 1,
                y: 0,
                transition: { type: "spring", stiffness: 80, damping: 18, delay: 0.62 },
              },
            }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <Magnetic>
              <ShimmerButton
                type="button"
                onClick={() =>
                  document.getElementById("demo")?.scrollIntoView({ behavior: "smooth" })
                }
                background="linear-gradient(110deg, oklch(0.62 0.11 78), oklch(0.84 0.135 88), oklch(0.89 0.09 92))"
                shimmerColor="oklch(0.99 0.06 95)"
                shimmerSize="0.06em"
                borderRadius="1rem"
                className="glow-pulse h-12 min-h-12 gap-2 rounded-2xl px-7 text-sm font-bold text-primary-foreground"
              >
                تجربه دموی زنده
                <ArrowDownLeft className="size-4 transition-transform group-hover:-translate-x-0.5 group-hover:translate-y-0.5" />
              </ShimmerButton>
            </Magnetic>
            <a
              href="#gold"
              className="inline-flex h-12 items-center rounded-2xl border border-white/[0.12] bg-white/[0.07] px-6 text-sm font-semibold text-foreground backdrop-blur transition-colors hover:border-primary/30 hover:bg-white/[0.12]"
            >
              خزانه طلا
            </a>
          </motion.div>

          {/* animated stats */}
          <motion.dl
            variants={{
              hidden: { opacity: 0, y: 22 },
              show: {
                opacity: 1,
                y: 0,
                transition: { type: "spring", stiffness: 80, damping: 18, delay: 0.74 },
              },
            }}
            className="mt-10 grid grid-cols-3 gap-2.5 border-t border-border pt-6 sm:gap-4"
          >
            {STATS.map((s) => (
              <div key={s.label} className="min-w-0">
                <dt className="order-2 mt-1 text-[11px] leading-snug text-muted-foreground md:text-xs">
                  {s.label}
                </dt>
                <dd className="order-1 text-lg font-extrabold text-foreground md:text-xl">
                  <NumberTicker value={s.to} format={s.format} className="tnum text-foreground dark:text-foreground" />
                </dd>
              </div>
            ))}
          </motion.dl>
        </div>

        {/* ---------- visual ---------- */}
        <motion.div
          variants={{
            hidden: { opacity: 0, scale: 0.92, y: 30 },
            show: {
              opacity: 1,
              scale: 1,
              y: 0,
              transition: { type: "spring", stiffness: 70, damping: 18, delay: 0.45 },
            },
          }}
          className="relative mx-auto w-full max-w-md lg:max-w-none"
        >
          <CoinDust />

          <motion.div
            animate={{ y: [0, -14, 0] }}
            transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
            className="relative z-10"
          >
            <BankCard />
          </motion.div>

          {/* live chips — desktop: floating mid-zones around the card */}
          <div className="absolute -top-4 left-3 z-20 hidden lg:-left-14 lg:top-24 lg:block">
            <PriceChip
              label="هر گرم طلای ۱۸"
              value={prices.gold}
              unit="تومان"
              change={prices.goldChange}
              delay={0.5}
            />
          </div>
          <div className="absolute -bottom-5 right-3 z-20 hidden lg:-right-14 lg:bottom-32 lg:block">
            <PriceChip label="نرخ تتر" value={prices.usdt} unit="تومان" delay={1.1} />
          </div>

          {/* live chips — mobile/tablet: tidy row under the card */}
          <div className="relative z-20 mt-7 flex flex-wrap items-stretch justify-center gap-3 lg:hidden">
            <PriceChip
              label="هر گرم طلای ۱۸"
              value={prices.gold}
              unit="تومان"
              change={prices.goldChange}
              delay={0.5}
            />
            <PriceChip label="نرخ تتر" value={prices.usdt} unit="تومان" delay={1.1} />
          </div>

          {/* ground shadow */}
          <div
            className="absolute inset-x-8 -bottom-6 h-10 rounded-[50%] bg-black/50 blur-xl"
            aria-hidden
          />
        </motion.div>
      </motion.div>

      {/* scroll hint */}
      <motion.a
        href="#features"
        aria-label="اسکرول به بخش امکانات"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.8 }}
        className="absolute bottom-5 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-muted-foreground/70 transition-colors hover:text-foreground md:flex"
      >
        <span className="flex h-9 w-6 items-start justify-center rounded-full border border-current p-1.5">
          <span className="scroll-dot size-1.5 rounded-full bg-current" />
        </span>
        <span className="text-[10px]">اسکرول</span>
      </motion.a>
    </section>
  );
}

/* tiny local helper — normalizes cursor pos to percent */
function toPercent(px: number, total: number) {
  return Math.min(100, Math.max(0, (px / total) * 100));
}
