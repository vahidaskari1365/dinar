"use client";

import { Landmark, ShieldCheck, Globe2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-white/[0.015]">
      <div className="mx-auto max-w-6xl px-4 pt-12 pb-[max(3rem,env(safe-area-inset-bottom))] sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5">
              <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground">
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
                  className="flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-[11px] text-muted-foreground"
                >
                  <b.icon className="size-3 text-primary" aria-hidden />
                  {b.t}
                </span>
              ))}
            </div>
          </div>

          {/* Columns */}
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
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l}>
                    <a
                      href={col.h === "انطباق" ? "#licenses" : "#top"}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-[11px] text-muted-foreground sm:flex-row">
          <p>© ۱۴۰۴ دینار — همه حقوق محفوظ است. این صفحه یک دموی محصول است.</p>
          <p className="tnum font-mono" dir="ltr">
            Tehran • Dubai • Vilnius
          </p>
        </div>
      </div>
    </footer>
  );
}
