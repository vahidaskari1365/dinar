"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  BadgeCheck,
  CircleDollarSign,
  Coins,
  CreditCard,
  Landmark,
  ShieldCheck,
  Wallet2,
} from "lucide-react";
import { toFa } from "@/lib/format";

/* ---------- Section shell ---------- */
export function FeaturesBento() {
  return (
    <section id="features" className="relative px-4 py-20 sm:px-6 md:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 max-w-2xl">
          <p className="mb-3 font-mono text-xs tracking-[0.3em] text-primary">CORE FEATURES</p>
          <h2 className="text-3xl font-black tracking-tighter md:text-[2.6rem] md:leading-tight">
            همه حساب‌ها، یک اپلیکیشن
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            هر بلوک، یک قابلیت واقعی محصول است — دقیقاً همان چیزی که در دموی زنده
            پایین صفحه می‌توانید امتحان کنید.
          </p>
        </div>

        {/* Asymmetric bento: 2fr/1fr rows */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <BentoLiveFeed className="md:col-span-2" />
          <BentoProfit />
          <BentoGold />
          <BentoMultiAsset />
          <BentoCard />
        </div>

        {/* Compliance strip */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ type: "spring", stiffness: 70, damping: 18 }}
          className="glass mt-4 flex flex-col items-start gap-4 rounded-3xl p-6 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-center gap-4">
            <span className="grid size-12 place-items-center rounded-2xl bg-success/10 text-[oklch(0.72_0.15_162)]">
              <ShieldCheck className="size-6" aria-hidden />
            </span>
            <div>
              <p className="font-bold">احراز هویت و ضد‌پول‌شویی از روز اول</p>
              <p className="mt-1 text-sm text-muted-foreground">
                KYC سه‌سطحی، تطبیق با FATF و گزارش‌دهی خودکار به نهاد ناظر.
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            {["KYC", "AML/CFT", "FATF"].map((t) => (
              <span
                key={t}
                className="rounded-lg border border-border px-3 py-1.5 font-mono text-[11px] tracking-wider text-muted-foreground"
              >
                {t}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ---------- Card shell (cursor-tracked spotlight) ---------- */
function Tile({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  function onMove(e: React.MouseEvent) {
    const el = ref.current;
    const rect = el?.getBoundingClientRect();
    if (!el || !rect) return;
    el.style.setProperty("--spot-x", `${((e.clientX - rect.left) / rect.width) * 100}%`);
    el.style.setProperty("--spot-y", `${((e.clientY - rect.top) / rect.height) * 100}%`);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ type: "spring", stiffness: 75, damping: 18, delay }}
      className={`spot group relative overflow-hidden rounded-3xl border border-border bg-surface p-7 transition-colors hover:border-primary/25 ${className}`}
    >
      <div className="pointer-events-none absolute -left-20 -top-20 size-48 rounded-full bg-[radial-gradient(circle,oklch(0.8_0.135_85/7%),transparent_70%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      {children}
    </motion.div>
  );
}

function TileHead({ icon: Icon, title, desc }: { icon: React.ElementType; title: string; desc: string }) {
  return (
    <div>
      <div className="mb-5 grid size-11 place-items-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
        <Icon className="size-5" aria-hidden />
      </div>
      <h3 className="text-lg font-extrabold tracking-tight">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{desc}</p>
    </div>
  );
}

/* ---------- 1. Live transaction feed (auto-sorting, layoutId) ---------- */
const FEED_SEEDS = [
  { name: "آرمان رضایی", type: "deposit", amount: 4_820_000, asset: "تومان" },
  { name: "نگار مصطفوی", type: "gold", amount: 2.35, asset: "گرم طلا" },
  { name: "کیان درویش", type: "withdraw", amount: 96, asset: "تتر" },
  { name: "سحر امانی", type: "deposit", amount: 12_400_000, asset: "تومان" },
  { name: "بردیا نعمتی", type: "card", amount: 1, asset: "کارت مجازی" },
] as const;

type FeedItem = { id: number; name: string; type: string; amount: number; asset: string };

function feedMeta(type: string) {
  switch (type) {
    case "deposit":
      return { icon: ArrowDownToLine, tone: "text-[oklch(0.72_0.15_162)] bg-[oklch(0.72_0.15_162/12%)]", verb: "واریز" };
    case "withdraw":
      return { icon: ArrowUpFromLine, tone: "text-foreground/70 bg-white/5", verb: "برداشت" };
    case "gold":
      return { icon: Coins, tone: "text-primary bg-primary/10", verb: "خرید طلا" };
    default:
      return { icon: CreditCard, tone: "text-foreground/70 bg-white/5", verb: "صدور" };
  }
}

function BentoLiveFeed({ className = "" }: { className?: string }) {
  const [items, setItems] = useState<FeedItem[]>(
    FEED_SEEDS.map((s, i) => ({ ...s, id: i, amount: s.amount }))
  );
  const counter = useRef(FEED_SEEDS.length);

  useEffect(() => {
    const t = setInterval(() => {
      setItems((prev) => {
        const seed = FEED_SEEDS[Math.floor(Math.random() * FEED_SEEDS.length)];
        counter.current += 1;
        const jitter = 0.6 + Math.random() * 1.9;
        const next: FeedItem = {
          id: counter.current,
          name: seed.name,
          type: seed.type,
          amount: Math.round(seed.amount * jitter),
          asset: seed.asset,
        };
        return [next, ...prev.slice(0, 3)];
      });
    }, 2600);
    return () => clearInterval(t);
  }, []);

  return (
    <Tile className={className} delay={0}>
      <div className="flex h-full flex-col justify-between gap-6">
        <div className="flex items-start justify-between">
          <TileHead
            icon={Wallet2}
            title="واریز و برداشت لحظه‌ای"
            desc="اتصال به درگاه پرداخت در فاز اول؛ تسویه‌های بین‌بانکی زیر ثانیه در فازهای بعد."
          />
          <span className="flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1 text-[10px] text-muted-foreground">
            <span className="breathe size-1.5 rounded-full bg-success" />
            زنده
          </span>
        </div>
        <ul className="space-y-2" aria-label="گردش‌های اخیر (شبیه‌سازی)">
          <AnimatePresence initial={false} mode="popLayout">
            {items.map((it) => {
              const meta = feedMeta(it.type);
              return (
                <motion.li
                  key={it.id}
                  layoutId={`feed-${it.id}`}
                  initial={{ opacity: 0, y: -18, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 220, damping: 26 }}
                  className="flex items-center justify-between rounded-2xl border border-border/70 bg-background/40 px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <span className={`grid size-9 place-items-center rounded-xl ${meta.tone}`}>
                      <meta.icon className="size-4" aria-hidden />
                    </span>
                    <div>
                      <p className="text-sm font-semibold leading-none">{it.name}</p>
                      <p className="mt-1.5 text-[11px] text-muted-foreground">{meta.verb}</p>
                    </div>
                  </div>
                  <p className="tnum font-mono text-sm font-bold text-foreground/90" dir="ltr">
                    {toFa(it.amount)} <span className="text-[10px] font-normal text-muted-foreground">{it.asset}</span>
                  </p>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ul>
      </div>
    </Tile>
  );
}

/* ---------- 2. 4% monthly profit (counting meter) ---------- */
function BentoProfit() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { stiffness: 40, damping: 16 });
  const display = useTransform(spring, (v) => toFa(v, 1) + "٪");

  useEffect(() => {
    if (inView) mv.set(4.2);
  }, [inView, mv]);

  const months = useMemo(() => [1, 3, 6, 12], []);

  return (
    <Tile delay={0.05}>
      <div ref={ref} className="flex h-full flex-col justify-between gap-6">
        <TileHead
          icon={TrendingUpIcon}
          title="پاداش نگهداشت ماهانه"
          desc="موجودی نشسته در دینار، هر ماه اول ماه به‌صورت خودکار پاداش می‌گیرد."
        />
        <div>
          <motion.p className="tnum font-mono text-4xl font-black text-primary" dir="ltr">
            {display}
          </motion.p>
          <div className="mt-5 grid grid-cols-4 gap-1.5" aria-label="رشد تجمعی">
            {months.map((m, i) => (
              <div key={m} className="rounded-xl border border-border/70 bg-background/40 p-2 text-center">
                <p className="text-[10px] text-muted-foreground">{toFa(m)} ماهه</p>
                <p className="tnum mt-1 font-mono text-xs font-bold text-foreground/90">
                  +{toFa((Math.pow(1.042, m) - 1) * 100, 0)}٪
                </p>
                <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-white/5">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${25 + i * 24}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.3 + i * 0.15 }}
                    className="h-full rounded-full bg-primary/80"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Tile>
  );
}
const TrendingUpIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
    <polyline points="16 7 22 7 22 13" />
  </svg>
);

/* ---------- 3. Gold (animated sparkline) ---------- */
function BentoGold() {
  const path = useMemo(() => {
    // Deterministic upward walk (seeded) — SSR/client identical
    let seed = 42;
    const rand = () => {
      seed = (seed * 16807) % 2147483647;
      return seed / 2147483647;
    };
    let y = 38;
    const pts: number[] = [];
    for (let i = 0; i < 24; i++) {
      y += (rand() - 0.42) * 9;
      y = Math.max(6, Math.min(38, y));
      pts.push(y);
    }
    pts.unshift(38);
    const step = 200 / (pts.length - 1);
    return pts.map((p, i) => `${i === 0 ? "M" : "L"}${(i * step).toFixed(1)},${p.toFixed(1)}`).join(" ");
  }, []);

  return (
    <Tile delay={0.1}>
      <div className="flex h-full flex-col justify-between gap-6">
        <TileHead
          icon={Coins}
          title="خرید طلا از همین امروز"
          desc="خرید مستقیم از بورس کالای رسمی؛ مالکیت واقعی گرم به نام شما، فروش در هر لحظه."
        />
        <div className="rounded-2xl border border-border/70 bg-background/40 p-4">
          <div className="flex items-center justify-between">
            <p className="tnum font-mono text-lg font-black" dir="ltr">
              ۸٬۱۵۰٬۰۰۰
            </p>
            <span className="tnum rounded-lg bg-[oklch(0.72_0.15_162/12%)] px-2 py-1 font-mono text-[11px] font-bold text-[oklch(0.72_0.15_162)]">
              ‎+۱۸٫۴٪
            </span>
          </div>
          <svg viewBox="0 0 200 44" className="mt-3 w-full" aria-hidden>
            <defs>
              <linearGradient id="goldfill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="oklch(0.8 0.135 85)" stopOpacity="0.28" />
                <stop offset="100%" stopColor="oklch(0.8 0.135 85)" stopOpacity="0" />
              </linearGradient>
            </defs>
            <motion.path
              d={`${path} L200,44 L0,44 Z`}
              fill="url(#goldfill)"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 0.4 }}
            />
            <motion.path
              d={path}
              fill="none"
              stroke="oklch(0.8 0.135 85)"
              strokeWidth="2"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.6, ease: "easeOut" }}
            />
          </svg>
        </div>
      </div>
    </Tile>
  );
}

/* ---------- 4. Multi-asset (ticker strip) ---------- */
function BentoMultiAsset() {
  const rows = [
    { asset: "تومان", sym: "IRR", value: "۱۰۰٪", tone: "text-foreground/85", icon: Landmark },
    { asset: "تتر", sym: "USDT", value: "۱۰۸٬۵۰۰", tone: "text-[oklch(0.72_0.15_162)]", icon: CircleDollarSign },
    { asset: "دلار", sym: "USD", value: "۱۰۹٬۲۰۰", tone: "text-foreground/85", icon: CircleDollarSign },
  ];
  return (
    <Tile delay={0.15}>
      <div className="flex h-full flex-col justify-between gap-6">
        <TileHead
          icon={CircleDollarSign}
          title="حساب چندارزی واقعی"
          desc="تومان، تتر و دلار در یک سبد؛ تبدیل بین ارزها با نرخ شفاف لحظه‌ای."
        />
        <div className="space-y-2">
          {rows.map((r, i) => (
            <motion.div
              key={r.sym}
              initial={{ opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.25 + i * 0.12 }}
              className="flex items-center justify-between rounded-2xl border border-border/70 bg-background/40 px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <r.icon className="size-4 text-muted-foreground" aria-hidden />
                <div>
                  <p className="text-sm font-semibold">{r.asset}</p>
                  <p className="font-mono text-[10px] tracking-widest text-muted-foreground">{r.sym}</p>
                </div>
              </div>
              <p className={`tnum font-mono text-sm font-bold ${r.tone}`} dir="ltr">
                {r.value}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </Tile>
  );
}

/* ---------- 5. Virtual card ---------- */
function BentoCard() {
  return (
    <Tile delay={0.2}>
      <div className="flex h-full flex-col justify-between gap-6">
        <TileHead
          icon={CreditCard}
          title="کارت مجازی در ۶۰ ثانیه"
          desc="صدور آنی کارت خرید اینترنتی با مسدودسازی موجودی؛ فریز، شارژ و محدودسازی از خودِ اپ."
        />
        <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-[linear-gradient(130deg,oklch(0.24_0.035_82),oklch(0.19_0.02_78)_55%,oklch(0.28_0.06_85))] p-4">
          <div className="shine pointer-events-none absolute inset-0 overflow-hidden rounded-2xl" />
          <div className="flex items-center justify-between">
            <span className="grid size-8 place-items-center rounded-lg bg-primary/90 text-primary-foreground">
              <BadgeCheck className="size-4" aria-hidden />
            </span>
            <span className="rounded-md bg-black/25 px-2 py-0.5 font-mono text-[9px] tracking-[0.2em] text-white/70">
              VIRTUAL
            </span>
          </div>
          <p className="tnum mt-6 font-mono text-sm tracking-[0.15em] text-white/85" dir="ltr">
            6037••••••••4217
          </p>
          <div className="mt-2 flex items-center justify-between text-[10px] text-white/50">
            <span>کارپوشه دینار</span>
            <span className="font-mono" dir="ltr">
              09/29
            </span>
          </div>
        </div>
      </div>
    </Tile>
  );
}
