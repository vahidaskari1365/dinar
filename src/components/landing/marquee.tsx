"use client";

import { Marquee } from "@/components/ui/marquee";

const REGULATORS = [
  "بانک مرکزی جمهوری اسلامی ایران",
  "شاپرک",
  "شورای پول و اعتبار",
  "سازمان اطلاعات و ارتباطات ایران (زیرساخت)",
  "VARA — دبی",
  "ADGM — ابوظبی",
  "EMI — لیتوانی",
  "FCA — بریتانیا",
  "FATF — کمیته مبارزه با پول‌شویی",
  "مرکز مبارزه با جرم‌های مالی",
];

export function RegulatorMarquee() {
  return (
    <section
      aria-label="نهادهای ناظر و مقرراتی"
      className="relative border-y border-border bg-white/[0.015] py-6"
    >
      {/* LTR track, RTL items — seamless Magic UI marquee */}
      <div className="marquee-mask overflow-hidden" dir="ltr">
        <Marquee
          pauseOnHover
          repeat={3}
          className="py-0 [--duration:40s] [--gap:2rem] sm:[--gap:2.5rem]"
        >
          <div dir="rtl" className="flex items-center gap-(--gap)">
            {REGULATORS.map((r) => (
              <div key={r} className="flex items-center gap-(--gap)">
                <span className="whitespace-nowrap text-xs font-medium text-muted-foreground/80 sm:text-sm">
                  {r}
                </span>
                <svg
                  viewBox="0 0 24 24"
                  className="size-3.5 text-primary/50"
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
