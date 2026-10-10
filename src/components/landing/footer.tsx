"use client";

import { Landmark, ShieldCheck, Globe2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border/60 bg-surface/40">
      <div className="mx-auto max-w-6xl px-4 pt-12 pb-[max(3rem,env(safe-area-inset-bottom))] sm:px-6">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          {/* Brand — spans full row until lg */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-1">
            <div className="flex items-center gap-2.5">
              <span className="grid size-9 place-items-center rounded-xl bg-linear-to-br from-gold-deep via-gold to-gold-soft text-[oklch(0.16_0.04_85)] shadow-[0_8px_24px_-8px_oklch(0.84_0.135_88/60%)]">
                <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden>
                  <path
                    d="M12 2.5 14.6 9.4 21.5 12 14.6 14.6 12 21.5 9.4 14.6 2.5 12 9.4 9.4Z"
                    fill="currentColor"
                  />
                </svg>
              </span>
              <span className="font-extrabold tracking-tight">دینار</span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              زیرساخت بانکداری دیجیتال چندارزی برای خاورمیانه — طلا، تتر، تومان
              و کارت مجازی در یک اپلیکیشن.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {[
                { icon: ShieldCheck, t: "KYC سه‌سطحی" },
                { icon: Landmark, t: "زیر چتر بانک عامل" },
                { icon: Globe2, t: "معماری جهانی" },
              ].map((b) => (
                <span
                  key={b.t}
                  className="flex items-center gap-1.5 rounded-lg border border-border bg-background/40 px-2.5 py-1.5 text-[11px] text-muted-foreground"
                >
                  <b.icon className="size-3 text-primary" aria-hidden />
                  {b.t}
                </span>
              ))}
            </div>
          </div>

          {/* Columns — 2-up on mobile, 3-up on sm, 4-up on lg */}
          {[
            {
              h: "محصول",
              links: ["کیف پول تومانی", "حساب طلا", "تتر و دلار", "کارت مجازی"],
            },
            {
              h: "انطباق",
              links: ["مجوزهای لازم", "مسیر بانک عامل", "مسیر درگاه پرداخت", "قوانین KYC/AML"],
            },
            {
              h: "شرکت",
              links: ["درباره دینار", "تماس با تیم", "فرصت‌های شغلی", "همکاری سرمایه‌گذاری"],
            },
          ].map((col) => (
            <nav key={col.h} aria-label={col.h}>
              <p className="text-sm font-bold">{col.h}</p>
              <ul className="mt-2 space-y-1">
                {col.links.map((l) => (
                  <li key={l}>
                    <a
                      href={col.h === "انطباق" ? "#licenses" : "#top"}
                      className="inline-flex min-h-11 items-center text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border/60 pt-6 text-[11px] leading-relaxed text-muted-foreground sm:flex-row">
          <p>© ۱۴۰۴ دینار — همه حقوق محفوظ است. این صفحه یک دموی مفهومی است.</p>
          <p className="tnum font-mono" dir="ltr">
            Tehran • Dubai • Vilnius
          </p>
        </div>
      </div>
    </footer>
  );
}
