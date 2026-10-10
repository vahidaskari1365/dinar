"use client";

import { useEffect, useRef, useState } from "react";
import { animate, motion } from "framer-motion";
import { BadgeCheck, Coins, ShieldCheck, Sparkles } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { GoldChart } from "@/components/wallet/gold-chart";
import { Reveal, SectionHeading } from "./motion-kit";

const fa = (n: number) => Math.round(n).toLocaleString("fa-IR");
const fa2 = (n: number) => n.toLocaleString("fa-IR", { maximumFractionDigits: 2 });

/* ---------- live animated number ---------- */
function LiveNum({ value, format = fa, className = "" }: { value: number; format?: (v: number) => string; className?: string }) {
  const [display, setDisplay] = useState(value);
  const prev = useRef(value);

  useEffect(() => {
    const controls = animate(prev.current, value, {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(v),
    });
    prev.current = value;
    return () => controls.stop();
  }, [value]);

  return <span className={`tnum ${className}`}>{format(display)}</span>;
}

/* ---------- 3D rotating gold coin ---------- */
function GoldCoin() {
  const edges = Array.from({ length: 14 }, (_, i) => -21 + i * 3);
  return (
    <div className="coin-scene relative mx-auto aspect-square w-56 sm:w-64" aria-hidden>
      {/* ambient glow */}
      <div className="absolute inset-0 scale-125 rounded-full bg-[radial-gradient(circle,oklch(0.75_0.13_85/35%),transparent_65%)] blur-2xl" />
      {/* orbit rings */}
      <div className="absolute -inset-8 rounded-full border border-dashed border-primary/25 animate-[spin_22s_linear_infinite]" />
      <div className="absolute -inset-14 rounded-full border border-primary/10" />

      <div className="coin relative size-full">
        {edges.map((z, i) => (
          <div key={i} className="coin-edge" style={{ transform: `translateZ(${z}px)` }} />
        ))}
        <div className="coin-face front">
          <div className="flex flex-col items-center gap-1 text-[oklch(0.38_0.09_72)]">
            <svg viewBox="0 0 24 24" className="size-14 drop-shadow" fill="currentColor">
              <path d="M12 2.5 14.6 9.4 21.5 12 14.6 14.6 12 21.5 9.4 14.6 2.5 12 9.4 9.4Z" />
            </svg>
            <p className="text-2xl font-black tracking-tight">دینار</p>
            <p className="font-mono text-[9px] tracking-[0.35em]">DINAR · 900 GOLD</p>
          </div>
        </div>
        <div className="coin-face back">
          <div className="flex flex-col items-center gap-1 text-[oklch(0.38_0.09_72)]">
            <p className="tnum text-4xl font-black">۴٪</p>
            <p className="text-xs font-bold">پاداش ماهانه نگهداشت</p>
            <p className="font-mono text-[9px] tracking-[0.3em]">BACKED BY REAL GOLD</p>
          </div>
        </div>
      </div>

      {/* twinkles */}
      <Sparkles className="twinkle absolute -right-10 top-8 size-5 text-primary/80" />
      <Sparkles className="twinkle absolute -left-9 bottom-24 size-4 text-primary/60" style={{ animationDelay: "1.2s" }} />
      <span className="twinkle absolute -top-6 left-1/3 size-2 rounded-full bg-primary shadow-[0_0_12px_oklch(0.85_0.14_88)]" />
    </div>
  );
}

/* ---------- section ---------- */
export function GoldVault() {
  const [history, setHistory] = useState<number[]>([]);
  const [gold, setGold] = useState(8_150_000);
  const [deposit, setDeposit] = useState(50_000_000);

  useEffect(() => {
    let alive = true;
    // seed chart with 48-minute history, then keep appending live ticks
    fetch("/api/prices/history")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!alive || !d) return;
        setHistory(d.history as number[]);
        setGold(d.current.gold as number);
      })
      .catch(() => {});
    const id = setInterval(() => {
      fetch("/api/prices")
        .then((r) => (r.ok ? r.json() : null))
        .then((p) => {
          if (!alive || !p) return;
          setGold(p.gold);
          setHistory((h) => [...h.slice(-59), p.gold as number]);
        })
        .catch(() => {});
    }, 5000);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, []);

  const monthly = deposit * 0.04;
  const yearEnd = deposit * Math.pow(1.04, 12);
  const grams = deposit / gold;

  return (
    <section id="gold" className="relative overflow-hidden px-4 py-24 sm:px-6 md:py-32">
      {/* ambient */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="aurora-b absolute -right-40 top-10 size-[36rem] rounded-full bg-[radial-gradient(circle,oklch(0.55_0.11_80/18%),transparent_65%)] blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="خزانه طلا"
          title="طلای واقعی، در قالب دیجیتال"
          shimmerFrom={3}
          description="موجودی‌ات رو در چند ثانیه به طلای ۱۸ عیار تبدیل کن — خرید از دومین‌های رسمی، پشتیبانی‌شده یک‌به‌یک، با فروش آنی به قیمت لحظه‌ای بازار."
        />

        <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          {/* coin visual */}
          <Reveal className="relative order-2 lg:order-1">
            <GoldCoin />
            {/* floating gram badges */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4.6, repeat: Infinity, ease: "easeInOut" }}
              className="glass absolute -top-2 right-0 z-10 rounded-2xl px-4 py-2.5 sm:-right-4"
            >
              <p className="text-[10px] text-muted-foreground">قیمت لحظه‌ای</p>
              <LiveNum value={gold} className="font-mono text-sm font-bold text-primary" format={(v) => `${fa(v)} ت`} />
            </motion.div>
            <motion.div
              animate={{ y: [0, 9, 0] }}
              transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
              className="glass absolute -left-2 bottom-0 z-10 rounded-2xl px-4 py-2.5 sm:left-0"
            >
              <p className="text-[10px] text-muted-foreground">حداقل خرید</p>
              <p className="tnum font-mono text-sm font-bold">۰٫۱ گرم</p>
            </motion.div>
          </Reveal>

          {/* chart + calculator */}
          <div className="order-1 space-y-6 lg:order-2">
            <Reveal>
              <div className="glass rounded-3xl p-5">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="flex items-center gap-2 text-sm font-bold">
                    <Coins className="size-4 text-primary" />
                    نمودار زنده طلا
                  </h3>
                  <span className="tnum rounded-full bg-[oklch(0.72_0.15_162/12%)] px-2.5 py-1 font-mono text-[11px] font-bold text-[oklch(0.72_0.15_162)]" dir="ltr">
                    {fa(gold)} ت
                  </span>
                </div>
                {history.length > 1 ? (
                  <GoldChart data={history} height={140} />
                ) : (
                  <div className="h-[140px] animate-pulse rounded-xl bg-white/[0.04]" />
                )}
                <p className="mt-2 text-[10px] text-muted-foreground/70">
                  بازه ۴۸ دقیقه — به‌روزرسانی هر ۵ ثانیه · قیمت‌ها شبیه‌سازی دموی امن هستند
                </p>
              </div>
            </Reveal>

            {/* calculator */}
            <Reveal delay={0.12}>
              <div className="conic-frame rounded-3xl p-5">
                <h3 className="flex items-center gap-2 text-sm font-bold">
                  <Sparkles className="size-4 text-primary" />
                  اگر امروز بذاری، چی می‌شه؟
                </h3>

                <div className="mt-5">
                  <div className="mb-3 flex items-baseline justify-between">
                    <span className="text-xs text-muted-foreground">مبلغ اولیه</span>
                    <span className="tnum font-mono text-lg font-black text-primary">
                      <LiveNum value={deposit} format={(v) => `${fa(v)} تومان`} />
                    </span>
                  </div>
                  <Slider
                    value={[deposit]}
                    onValueChange={([v]) => setDeposit(v)}
                    min={5_000_000}
                    max={500_000_000}
                    step={5_000_000}
                    aria-label="مبلغ اولیه به تومان"
                  />
                  <div className="tnum mt-1.5 flex justify-between font-mono text-[10px] text-muted-foreground/70">
                    <span>۵ میلیون</span>
                    <span>۵۰۰ میلیون</span>
                  </div>
                </div>

                <dl className="mt-6 grid grid-cols-3 gap-3 text-center">
                  <div className="rounded-2xl border border-border bg-white/[0.03] p-3">
                    <dt className="text-[10px] text-muted-foreground">پاداش ماه اول</dt>
                    <dd className="tnum mt-1 font-mono text-sm font-black text-[oklch(0.72_0.15_162)]">
                      +<LiveNum value={monthly} />
                    </dd>
                  </div>
                  <div className="rounded-2xl border border-border bg-white/[0.03] p-3">
                    <dt className="text-[10px] text-muted-foreground">تا پایان سال</dt>
                    <dd className="tnum mt-1 font-mono text-sm font-black text-primary">
                      <LiveNum value={yearEnd} />
                    </dd>
                  </div>
                  <div className="rounded-2xl border border-border bg-white/[0.03] p-3">
                    <dt className="text-[10px] text-muted-foreground">معادل طلا</dt>
                    <dd className="tnum mt-1 font-mono text-sm font-black">
                      <LiveNum value={grams} format={fa2} /> <span className="text-[10px] font-normal">گرم</span>
                    </dd>
                  </div>
                </dl>

                <p className="mt-4 flex items-start gap-1.5 text-[10px] leading-relaxed text-muted-foreground/70">
                  <ShieldCheck className="mt-0.5 size-3 shrink-0" />
                  پاداش نگهداشت ۴٪ ماهانه به‌صورت سهم درآمد عملیات پرداخت و طلا پرداخت می‌شود — نه سود سپرده بانکی. محاسبه فوق با مرکب‌شدن ماهانه است.
                </p>

                <a
                  href="#demo"
                  className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-primary text-sm font-bold text-primary-foreground shadow-[0_12px_28px_-12px_oklch(0.8_0.135_85/55%)] transition-transform active:scale-[0.98]"
                >
                  <BadgeCheck className="size-4" />
                  در دموی زنده امتحان کن
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
