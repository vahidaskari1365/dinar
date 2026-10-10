"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useMotionValue, useSpring } from "framer-motion";
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  BadgeCheck,
  CircleDollarSign,
  Coins,
  CreditCard,
  Landmark,
  ShieldCheck,
  TrendingUp,
  Wallet2,
} from "lucide-react";
import { toFa } from "@/lib/format";
import { BlurFade } from "@/components/ui/blur-fade";
import { BorderBeam } from "@/components/ui/border-beam";
import { DotPattern } from "@/components/ui/dot-pattern";
import { MagicCard } from "@/components/ui/magic-card";

/* ---------- fa-IR number ticker (local wrapper, Persian digits) ---------- */
function NumberTickerFa({
  value,
  decimals = 0,
  delay = 0,
  className = "",
}: {
  value: number;
  decimals?: number;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { damping: 60, stiffness: 100 });
  const inView = useInView(ref, { once: true, margin: "0px" });

  useEffect(() => {
    if (!inView) return;
    const t = setTimeout(() => mv.set(value), delay * 1000);
    return () => clearTimeout(t);
  }, [inView, mv, value, delay]);

  useEffect(
    () =>
      spring.on("change", (v) => {
        if (ref.current) {
          ref.current.textContent = new Intl.NumberFormat("fa-IR", {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
          }).format(Number(v.toFixed(decimals)));
        }
      }),
    [spring, decimals]
  );

  return (
    <span ref={ref} className={`tnum inline-block ${className}`}>
      {toFa(0, decimals)}
    </span>
  );
}

/* ---------- Section shell ---------- */
export function FeaturesBento() {
  return (
    <section id="features" className="relative px-4 py-20 sm:px-6 md:py-28 lg:px-8">
      {/* gold dot pattern backdrop with radial fade */}
      <DotPattern
        width={18}
        height={18}
        className="text-primary/30 opacity-25 [mask-image:radial-gradient(70%_55%_at_50%_32%,black,transparent)]"
      />

      <div className="relative mx-auto max-w-6xl">
        <BlurFade inView inViewMargin="-80px" className="mb-12 max-w-2xl">
          <div>
            <p className="mb-3 font-mono text-xs tracking-[0.3em] text-primary">CORE FEATURES</p>
            <h2 className="text-3xl font-black tracking-tighter md:text-[2.6rem] md:leading-tight">
              همه حساب‌ها، یک اپلیکیشن
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              هر بلوک، یک قابلیت واقعی محصول است — دقیقاً همان چیزی که در دموی زنده
              پایین صفحه می‌توانید امتحان کنید.
            </p>
          </div>
        </BlurFade>

        {/* Asymmetric bento: 1 → 2 → 3 cols */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <BentoLiveFeed className="sm:col-span-2" />
          <BentoProfit />
          <BentoGold />
          <BentoMultiAsset />
          <BentoCard />
        </div>

        {/* Compliance strip */}
        <BlurFade delay={0.15} inView inViewMargin="-60px" className="mt-4">
          <div className="glass flex flex-col items-start gap-4 rounded-3xl p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              {/* gold — emerald (text-success) is reserved for positive numbers/status only */}
              <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-primary/15 text-primary">
                <ShieldCheck className="size-6" aria-hidden />
              </span>
              <div>
                <p className="font-bold">احراز هویت و ضد‌پول‌شویی از روز اول</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  KYC سه‌سطحی، تطبیق با FATF و گزارش‌دهی خودکار به نهاد ناظر.
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              {["KYC", "AML/CFT", "FATF"].map((t) => (
                <span
                  key={t}
                  className="inline-flex min-h-11 items-center rounded-lg border border-border px-3 py-1.5 font-mono text-[11px] tracking-wider text-muted-foreground"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </BlurFade>
      </div>
    </section>
  );
}

/* ---------- Card shell (MagicCard: cursor-tracked gold spotlight + gradient border) ---------- */
function Card({
  children,
  className = "",
  delay = 0,
  premium = false,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  premium?: boolean;
}) {
  return (
    <BlurFade delay={delay} inView inViewMargin="-60px" className={`min-w-0 ${className}`}>
      <MagicCard
        className="grid h-full rounded-3xl before:absolute before:inset-px before:z-[25] before:rounded-[inherit] before:bg-surface"
        gradientFrom="#e8c877"
        gradientTo="#39415f"
        gradientColor="rgba(232,200,119,0.12)"
        gradientSize={320}
      >
        <div className="relative z-40 flex h-full flex-col p-5 sm:p-6">{children}</div>
        {premium && (
          <>
            <BorderBeam size={180} duration={12} colorFrom="#e8c877" colorTo="#6f8fd9" className="rounded-3xl" />
            <BorderBeam
              size={180}
              duration={12}
              delay={6}
              reverse
              colorFrom="#6f8fd9"
              colorTo="#e8c877"
              className="rounded-3xl"
            />
          </>
        )}
      </MagicCard>
    </BlurFade>
  );
}

function TileHead({ icon: Icon, title, desc }: { icon: React.ElementType; title: string; desc: string }) {
  return (
    <div>
      <div className="mb-5 grid size-11 place-items-center rounded-2xl border border-primary/20 bg-primary/10 text-primary transition-[background-color,border-color,box-shadow] duration-300 group-hover:border-primary/40 group-hover:bg-primary/15 group-hover:shadow-[0_0_24px_-4px_oklch(0.84_0.135_88/50%)]">
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
      return { icon: ArrowDownToLine, tone: "text-success bg-success/10", verb: "واریز" };
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
    <Card className={className} delay={0}>
      <div className="flex h-full flex-col justify-between gap-6">
        <div className="flex items-start justify-between gap-3">
          <TileHead
            icon={Wallet2}
            title="واریز و برداشت لحظه‌ای"
            desc="اتصال به درگاه پرداخت در فاز اول؛ تسویه‌های بین‌بانکی زیر ثانیه در فازهای بعد."
          />
          <span className="flex shrink-0 items-center gap-1.5 rounded-full border border-border px-2.5 py-1 text-[10px] text-muted-foreground">
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
                  className="flex items-center justify-between gap-2 rounded-2xl border border-border/70 bg-background/40 px-4 py-3"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className={`grid size-9 shrink-0 place-items-center rounded-xl ${meta.tone}`}>
                      <meta.icon className="size-4" aria-hidden />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold leading-none">{it.name}</p>
                      <p className="mt-1.5 text-[11px] text-muted-foreground">{meta.verb}</p>
                    </div>
                  </div>
                  <p className="tnum shrink-0 font-mono text-sm font-bold text-foreground/90" dir="ltr">
                    {toFa(it.amount)} <span className="text-[10px] font-normal text-muted-foreground">{it.asset}</span>
                  </p>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ul>
      </div>
    </Card>
  );
}

/* ---------- 2. 4% monthly reward (premium — gold border beam) ---------- */
function BentoProfit() {
  const months = useMemo(() => [1, 3, 6, 12], []);

  return (
    <Card delay={0.05} premium>
      <div className="flex h-full flex-col justify-between gap-6">
        <TileHead
          icon={TrendingUp}
          title="پاداش نگهداشت ماهانه"
          desc="موجودی نشسته در دینار، هر ماه اول ماه به‌صورت خودکار پاداش می‌گیرد."
        />
        <div>
          <p className="tnum font-mono text-4xl font-black text-primary" dir="ltr">
            <NumberTickerFa value={4.2} decimals={1} />
            ٪
          </p>
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
    </Card>
  );
}

/* ---------- 3. Gold (animated sparkline + fa ticker price) ---------- */
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
    <Card delay={0.1}>
      <div className="flex h-full flex-col justify-between gap-6">
        <TileHead
          icon={Coins}
          title="خرید طلا از همین امروز"
          desc="خرید مستقیم از بورس کالای رسمی؛ مالکیت واقعی گرم به نام شما، فروش در هر لحظه."
        />
        <div className="rounded-2xl border border-border/70 bg-background/40 p-4">
          <div className="flex items-center justify-between">
            <p className="tnum font-mono text-lg font-black" dir="ltr">
              <NumberTickerFa value={8_150_000} delay={0.2} />
            </p>
            <span className="tnum rounded-lg bg-success/10 px-2 py-1 font-mono text-[11px] font-bold text-success">
              ‎+۱۸٫۴٪
            </span>
          </div>
          <svg viewBox="0 0 200 44" className="mt-3 w-full" aria-hidden>
            <defs>
              <linearGradient id="goldfill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#e8c877" stopOpacity="0.22" />
                <stop offset="100%" stopColor="#e8c877" stopOpacity="0" />
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
              stroke="#e8c877"
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
    </Card>
  );
}

/* ---------- 4. Multi-asset (ticker strip) ---------- */
function BentoMultiAsset() {
  const rows = [
    { asset: "تومان", sym: "IRR", value: "۱۰۰٪", tone: "text-foreground/85", icon: Landmark },
    { asset: "تتر", sym: "USDT", value: "۱۰۸٬۵۰۰", tone: "text-foreground/85", icon: CircleDollarSign },
    { asset: "دلار", sym: "USD", value: "۱۰۹٬۲۰۰", tone: "text-foreground/85", icon: CircleDollarSign },
  ];
  return (
    <Card delay={0.15}>
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
              className="flex items-center justify-between gap-2 rounded-2xl border border-border/70 bg-background/40 px-4 py-3"
            >
              <div className="flex min-w-0 items-center gap-3">
                <r.icon className="size-4 shrink-0 text-muted-foreground" aria-hidden />
                <div className="min-w-0">
                  <p className="text-sm font-semibold">{r.asset}</p>
                  <p className="font-mono text-[10px] tracking-widest text-muted-foreground">{r.sym}</p>
                </div>
              </div>
              <p className={`tnum shrink-0 font-mono text-sm font-bold ${r.tone}`} dir="ltr">
                {r.value}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </Card>
  );
}

/* ---------- 5. Virtual card (premium — gold border beam) ---------- */
function BentoCard() {
  return (
    <Card delay={0.2} premium>
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
    </Card>
  );
}
