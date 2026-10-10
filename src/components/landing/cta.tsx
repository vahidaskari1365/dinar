"use client";

import { Flame, Sparkles } from "lucide-react";
import { Magnetic, Reveal } from "./motion-kit";

export function CtaBanner() {
  return (
    <section className="px-4 pb-24 pt-4 sm:px-6">
      <Reveal className="mx-auto max-w-5xl">
        <div className="conic-frame glow-pulse relative overflow-hidden rounded-[2.5rem] px-6 py-14 text-center md:px-12 md:py-20">
          {/* inner aurora */}
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="aurora-a absolute -top-24 left-1/4 size-96 rounded-full bg-[radial-gradient(circle,oklch(0.6_0.12_85/22%),transparent_65%)] blur-3xl" />
            <div className="aurora-b absolute -bottom-28 right-1/5 size-96 rounded-full bg-[radial-gradient(circle,oklch(0.5_0.09_95/18%),transparent_65%)] blur-3xl" />
            <Sparkles className="twinkle absolute right-[12%] top-8 size-5 text-primary/70" />
            <Sparkles className="twinkle absolute bottom-10 left-[10%] size-4 text-primary/50" style={{ animationDelay: "1.4s" }} />
            <span className="twinkle absolute left-[28%] top-12 size-1.5 rounded-full bg-primary shadow-[0_0_12px_oklch(0.85_0.14_88)]" />
            <span className="twinkle absolute bottom-14 right-[30%] size-1.5 rounded-full bg-primary shadow-[0_0_12px_oklch(0.85_0.14_88)]" style={{ animationDelay: "0.8s" }} />
          </div>

          <div className="relative">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-[11px] font-bold text-primary">
              <Flame className="size-3.5" />
              پذیرش سرمایه‌گذار فاز صفر باز است
            </span>

            <h2 className="mx-auto mt-6 max-w-2xl text-3xl font-black leading-[1.16] tracking-tighter md:text-5xl md:leading-[1.1]">
              <span className="text-shimmer">طلایی</span> شدن رو از
              <br />
              همین‌جا شروع کن
            </h2>

            <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
              برای مشاوره‌ی مجوز، مدل درآمدی و شریک بانکی فرم رو پر کن — تیم
              استراتژی دینار در کمتر از ۲۴ ساعت کاری باهات تماس می‌گیره.
            </p>

            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <Magnetic>
                <a
                  href="#consult"
                  className="glow-pulse inline-flex h-13 items-center rounded-2xl bg-primary px-8 py-3.5 text-sm font-black text-primary-foreground transition-transform active:scale-[0.97]"
                >
                  درخواست مشاوره رایگان
                </a>
              </Magnetic>
              <a
                href="#demo"
                className="inline-flex items-center rounded-2xl border border-border bg-white/[0.04] px-7 py-3.5 text-sm font-semibold text-foreground/85 transition-colors hover:bg-white/[0.08]"
              >
                اول دمو رو ببین
              </a>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
