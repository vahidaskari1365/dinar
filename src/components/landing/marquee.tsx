"use client";

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
  const row = [...REGULATORS, ...REGULATORS];
  return (
    <section aria-label="نهادهای ناظر و مقرراتی" className="relative border-y border-border bg-white/[0.015] py-6">
      <div className="marquee-mask overflow-hidden" dir="ltr">
        <div className="animate-marquee flex w-max items-center gap-10 pl-10" dir="rtl">
          {row.map((r, i) => (
            <div key={`${r}-${i}`} className="flex items-center gap-10">
              <span className="whitespace-nowrap text-sm font-medium text-muted-foreground/80">
                {r}
              </span>
              <svg viewBox="0 0 24 24" className="size-3.5 text-primary/50" fill="currentColor" aria-hidden>
                <path d="M12 2.5 14.6 9.4 21.5 12 14.6 14.6 12 21.5 9.4 14.6 2.5 12 9.4 9.4Z" />
              </svg>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
