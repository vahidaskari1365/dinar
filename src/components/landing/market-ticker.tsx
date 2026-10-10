"use client";

import { useEffect, useState } from "react";
import { TrendingDown, TrendingUp } from "lucide-react";

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

function Item({
  label,
  value,
  unit,
  change,
}: {
  label: string;
  value: string;
  unit: string;
  change?: number;
}) {
  return (
    <div className="flex items-center gap-2.5 whitespace-nowrap">
      <span className="size-1.5 rounded-full bg-primary/70" aria-hidden />
      <span className="text-xs text-muted-foreground/80">{label}</span>
      <span className="tnum font-mono text-sm font-bold text-foreground/90" dir="ltr">
        {value}
      </span>
      <span className="text-[10px] text-muted-foreground/60">{unit}</span>
      {change !== undefined && change !== 0 ? (
        <span
          className={`tnum inline-flex items-center gap-0.5 text-[10px] font-bold ${
            change > 0
              ? "text-[oklch(0.72_0.15_162)]"
              : "text-[oklch(0.65_0.19_25)]"
          }`}
        >
          {change > 0 ? (
            <TrendingUp className="size-3" />
          ) : (
            <TrendingDown className="size-3" />
          )}
          {fa(Math.abs(change))}٪
        </span>
      ) : null}
    </div>
  );
}

/** Live market tape — polls /api/prices, dual-row marquee with regulators. */
export function MarketTicker() {
  const [p, setP] = useState<Prices>({
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
        const data = await r.json();
        if (alive) setP(data);
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

  const rows = [
    { label: "طلای ۱۸ عیار", value: fa(p.gold), unit: "تومان/گرم", change: p.goldChange },
    { label: "طلای ۲۴ عیار", value: fa(Math.round(p.gold / 0.75)), unit: "تومان/گرم" },
    { label: "تتر", value: fa(p.usdt), unit: "تومان" },
    { label: "دلار", value: fa(p.usd), unit: "تومان" },
  ];

  const regRow = [...REGULATORS, ...REGULATORS];

  return (
    <section
      aria-label="تیکر زنده بازار و نهادهای ناظر"
      className="relative border-y border-border bg-white/[0.015] py-4"
    >
      {/* prices row */}
      <div className="marquee-mask overflow-hidden" dir="ltr">
        <div className="animate-marquee flex w-max items-center gap-12 pl-12" dir="rtl">
          {Array.from({ length: 4 }).flatMap((_, r) =>
            rows.map((it, i) => <Item key={`p-${r}-${i}`} {...it} />)
          )}
        </div>
      </div>

      {/* regulators row — reverse direction */}
      <div className="marquee-mask mt-3 overflow-hidden border-t border-border/60 pt-3" dir="ltr">
        <div className="animate-marquee-rev flex w-max items-center gap-10 pl-10" dir="rtl">
          {regRow.map((r, i) => (
            <div key={`${r}-${i}`} className="flex items-center gap-10">
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
      </div>
    </section>
  );
}
