"use client";

import { useEffect, useState } from "react";
import { TrendingDown, TrendingUp } from "lucide-react";
import { Marquee } from "@/components/ui/marquee";

type Prices = {
  gold: number;
  goldChange: number;
  usdt: number;
  usd: number;
};

const REGULATORS = [
  "بانک مرکزی جمهوری اسلامی ایران",
  "شاپرک",
  "شورای پول و اعتبار",
  "زیرساخت اطلاعات و ارتباطات ایران",
  "VARA — دبی",
  "ADGM — ابوظبی",
  "EMI — لیتوانی",
  "FCA — بریتانیا",
  "FATF",
  "مرکز مبارزه با جرم‌های مالی",
];

const fa = (n: number) => n.toLocaleString("fa-IR");

const INITIAL: Prices = {
  gold: 8_150_000,
  goldChange: 0,
  usdt: 108_500,
  usd: 109_259,
};

type Flash = "up" | "down" | null;

function Item({
  label,
  value,
  unit,
  change,
  flash,
  gold,
}: {
  label: string;
  value: string;
  unit: string;
  change?: number;
  flash?: Flash;
  gold?: boolean;
}) {
  return (
    <div className="flex items-center gap-2 whitespace-nowrap sm:gap-2.5">
      <span className="size-1.5 rounded-full bg-primary/70" aria-hidden />
      <span className="text-[11px] text-muted-foreground/80 sm:text-xs">{label}</span>
      {/* key={value} remounts on every price tick → replays the flash animation */}
      <span
        key={value}
        dir="ltr"
        className={`tnum font-mono text-xs font-bold sm:text-sm ${
          gold ? "text-gold" : "text-foreground/90"
        } ${flash === "up" ? "flash-up" : flash === "down" ? "flash-down" : ""}`}
      >
        {value}
      </span>
      <span className="text-[10px] text-muted-foreground/60">{unit}</span>
      {change !== undefined && change !== 0 ? (
        <span
          className={`tnum inline-flex items-center gap-0.5 text-[10px] font-bold ${
            change > 0 ? "text-success" : "text-destructive"
          }`}
        >
          {change > 0 ? (
            <TrendingUp className="size-3" />
          ) : (
            <TrendingDown className="size-3" />
          )}
          {/* dir=ltr + manual sign → minus/plus always leads the number (no RTL bidi flip) */}
          <span dir="ltr" className="inline-flex tnum">
            {change > 0 ? "+" : "−"}
            {fa(Math.abs(change))}٪
          </span>
        </span>
      ) : null}
    </div>
  );
}

/** Live market tape — polls /api/prices, dual-row Magic UI marquee with regulators. */
export function MarketTicker() {
  const [tape, setTape] = useState<{ p: Prices; prev: Prices }>({
    p: INITIAL,
    prev: INITIAL,
  });

  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const r = await fetch("/api/prices");
        if (!r.ok) return;
        const data: Prices = await r.json();
        if (alive) setTape((s) => ({ prev: s.p, p: data }));
      } catch {
        /* keep last */
      }
    };
    load();
    const id = setInterval(load, 5000);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, []);

  const { p, prev } = tape;
  const dir = (now: number, before: number): Flash =>
    now > before ? "up" : now < before ? "down" : null;

  const rows = [
    {
      label: "طلای ۱۸ عیار",
      value: fa(p.gold),
      unit: "تومان/گرم",
      change: p.goldChange,
      flash: dir(p.gold, prev.gold),
      gold: true,
    },
    {
      label: "طلای ۲۴ عیار",
      value: fa(Math.round(p.gold / 0.75)),
      unit: "تومان/گرم",
      flash: dir(p.gold, prev.gold),
      gold: true,
    },
    { label: "تتر", value: fa(p.usdt), unit: "تومان", flash: dir(p.usdt, prev.usdt) },
    { label: "دلار", value: fa(p.usd), unit: "تومان", flash: dir(p.usd, prev.usd) },
  ];

  return (
    <section
      aria-label="تیکر زنده بازار و نهادهای ناظر"
      className="relative border-y border-border bg-white/[0.015] py-4"
    >
      {/* live prices — LTR track, RTL items (keeps Persian reading order correct) */}
      <div className="marquee-mask overflow-hidden" dir="ltr">
        <Marquee
          pauseOnHover
          repeat={3}
          className="py-0 [--duration:35s] [--gap:1.5rem] sm:[--gap:2.5rem]"
        >
          <div dir="rtl" className="flex items-center gap-(--gap)">
            {rows.map((it) => (
              <Item key={it.label} {...it} />
            ))}
          </div>
        </Marquee>
      </div>

      {/* regulators — reverse direction */}
      <div className="marquee-mask mt-3 overflow-hidden border-t border-border/60 pt-3" dir="ltr">
        <Marquee
          reverse
          pauseOnHover
          repeat={3}
          className="py-0 [--duration:45s] [--gap:1.25rem] sm:[--gap:2.5rem]"
        >
          <div dir="rtl" className="flex items-center gap-(--gap)">
            {REGULATORS.map((r) => (
              <div key={r} className="flex items-center gap-(--gap)">
                <span className="whitespace-nowrap text-[11px] font-medium text-muted-foreground/60">
                  {r}
                </span>
                <svg
                  viewBox="0 0 24 24"
                  className="size-3 text-primary/40"
                  fill="currentColor"
                  aria-hidden
                >
                  <path d="M12 2.5 14.6 9.4 21.5 12 14.6 14.6 12 21.5 9.4 14.6 2.5 12 9.4 9.4Z" />
                </svg>
              </div>
            ))}
          </div>
        </Marquee>
      </div>
    </section>
  );
}
