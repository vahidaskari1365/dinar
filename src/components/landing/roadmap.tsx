"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  CheckCircle2,
  CircleDashed,
  FileCheck2,
  Globe2,
  Landmark,
  Scale,
  Wallet,
  AlertTriangle,
  Clock3,
} from "lucide-react";
import { toFa } from "@/lib/format";

type PathKey = "A" | "B";

const PATHS: Record<
  PathKey,
  { title: string; sub: string; time: string; cost: string; steps: { t: string; d: string }[] }
> = {
  A: {
    title: "قرارداد با بانک عامل",
    sub: "شما زیرمجموعه یک بانک می‌شوید — سریع‌ترین مسیر به بازار",
    time: "۴ تا ۷ ماه",
    cost: "سرمایه‌گذاری تجاری؛ بدون مجوز مستقل",
    steps: [
      { t: "ثبت شرکت و زیرساخت حقوقی", d: "ثبت سهامی خاص، کد اقتصادی، روزنامه رسمی، امضای الکترونیک سازمانی." },
      { t: "عقد قرارداد عاملیت با بانک", d: "مذاکره با بانک عامل (ملت، سامان، پاسارگاد و…) برای عاملیت جذب سپرده و پرداخت." },
      { t: "کد پذیرندگی شاپرک", d: "اتصال به شاپرک از طریق PSP زیرمجموعه بانک برای درگاه و تسویه." },
      { t: "KYC مشترک با بانک", d: "احراز هویت مشتریان با استعلام ثنا، شاهکار و سجام طبق مقررات بانک مرکزی." },
      { t: "چارچوب ضد‌پول‌شویی", d: "پیاده‌سازی AML/CFT مطابق قانون مبارزه با پول‌شویی و آیین‌نامه اجرایی آن." },
    ],
  },
  B: {
    title: "درگاه پرداخت مستقل",
    sub: "مجوز پرداخت‌یاری از بانک مرکزی — کنترل کامل، هزینه بالا",
    time: "۱۲ تا ۲۴ ماه",
    cost: "سرمایه اولیه سنگین + تضمین بانکی",
    steps: [
      { t: "تأسیس شرکت پرداخت‌یاری", d: "درخواست مجوز PSP از معاونت فناوری‌های نوین بانک مرکزی." },
      { t: "ظرفیت سرمایه‌ای", d: "تأمین سرمایه قانونی و تضمین‌نامه بانکی طبق بخشنامه‌های شورای پول و اعتبار." },
      { t: "عضویت در شاپرک", d: "اتصال به سوئیچ ملی، رعایت استاندارد ISO 8583 و آزمون‌های انطباق." },
      { t: "استقرار فنی", d: "مرکز داده داخل کشور، ثبت در زیرساخت اطلاعات مکانی و ارتباطات، پایش امنیتی." },
      { t: "مجوز فعالیت", d: "اخذ پروانه و شروع پذیرندگی درگاه اینترنتی مستقیم." },
    ],
  },
};

const PHASES = [
  {
    n: 0,
    title: "تأسیس و انطباق حقوقی",
    status: "now" as const,
    items: ["ثبت شرکت و امضای الکترونیک", "سیاست‌نامه KYC/AML", "جذب تیم انطباق"],
  },
  {
    n: 1,
    title: "پرداخت و واریز (فاز فعلی بازار)",
    status: "next" as const,
    items: ["درگاه پرداخت اجاره‌ای", "کیف پول تومانی", "حساب‌های طلا و تتر"],
  },
  {
    n: 2,
    title: "نئوبانک کامل",
    status: "later" as const,
    items: ["عاملیت بانکی رسمی", "صدور کارت فیزیکی", "چارچوب بانکداری دیجیتال"],
  },
  {
    n: 3,
    title: "گسترش جهانی",
    status: "later" as const,
    items: ["مجوز VARA دبی برای دارایی دیجیتال", "EMI اروپا و SEPA", "کارت ویزا/مستر کارت بین‌المللی"],
  },
];

const GLOBAL_LICENSES = [
  { org: "VARA — دبی", scope: "مجوز VASP برای نگهداشت و انتقال تتر و دارایی دیجیتال", tone: "gold" },
  { org: "ADGM — ابوظبی", scope: "چارچوب FSRA برای پرداخت و خدمات مالی دیجیتال", tone: "neutral" },
  { org: "EMI — لیتوانی", scope: "مؤسسه پول الکترونیک اروپا با دسترسی SEPA", tone: "neutral" },
  { org: "FCA — بریتانیا", scope: "EMI و حساب‌های پرداخت برای کاربران جهانی", tone: "neutral" },
];

export function LicenseRoadmap() {
  const [path, setPath] = useState<PathKey>("A");
  const p = PATHS[path];

  return (
    <section id="licenses" className="relative border-t border-border px-4 py-20 sm:px-6 md:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 max-w-2xl">
          <p className="mb-3 font-mono text-xs tracking-[0.3em] text-primary">REGULATORY MAP</p>
          <h2 className="text-3xl font-black tracking-tighter md:text-[2.6rem] md:leading-tight">
            نقشه راه مجوز، بدون ابهام حقوقی
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            پاسخ صریح به سؤال اصلی شما: بله، شدنی است — اما به شرط انتخاب مسیر
            درست. دو مسیر قانونی برای فاز اول وجود دارد؛ هر دو را مقایسه کنید.
          </p>
        </div>

        {/* Path selector */}
        <div className="glass mb-6 grid gap-2 rounded-3xl p-2 sm:grid-cols-2">
          {(Object.keys(PATHS) as PathKey[]).map((k) => (
            <button
              key={k}
              onClick={() => setPath(k)}
              aria-pressed={path === k}
              className={`relative rounded-2xl px-5 py-4 text-right transition-colors ${
                path === k ? "text-primary-foreground" : "text-foreground/80 hover:bg-white/[0.04]"
              }`}
            >
              {path === k && (
                <motion.span
                  layoutId="path-pill"
                  className="absolute inset-0 rounded-2xl bg-primary"
                  transition={{ type: "spring", stiffness: 300, damping: 28 }}
                />
              )}
              <span className="relative z-10 block">
                <span className="flex items-center gap-2 font-extrabold">
                  <span className="grid size-7 place-items-center rounded-lg bg-black/15 font-mono text-xs">
                    {k === "A" ? "A" : "B"}
                  </span>
                  {PATHS[k].title}
                </span>
                <span className={`mt-1 block text-xs leading-relaxed ${path === k ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                  {PATHS[k].sub}
                </span>
              </span>
            </button>
          ))}
        </div>

        {/* Path detail */}
        <AnimatePresence mode="wait">
          <motion.div
            key={path}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="grid gap-4 lg:grid-cols-[1fr_320px]"
          >
            {/* Steps */}
            <div className="rounded-3xl border border-border bg-surface p-6 md:p-8">
              <ol className="relative space-y-7 border-r-2 border-dashed border-border pr-6">
                {p.steps.map((s, i) => (
                  <motion.li
                    key={s.t}
                    initial={{ opacity: 0, x: 18 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07 }}
                    className="relative"
                  >
                    <span className="absolute -right-[35px] top-0 grid size-6 place-items-center rounded-full border border-primary/40 bg-background">
                      <CheckCircle2 className="size-3.5 text-primary" aria-hidden />
                    </span>
                    <p className="font-bold">{s.t}</p>
                    <p className="mt-1.5 max-w-[62ch] text-sm leading-relaxed text-muted-foreground">{s.d}</p>
                  </motion.li>
                ))}
              </ol>
            </div>

            {/* Side meta */}
            <div className="flex flex-col gap-4">
              <div className="rounded-3xl border border-border bg-surface p-6">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock3 className="size-4 text-primary" aria-hidden />
                  زمان تقریبی
                </div>
                <p className="mt-2 text-2xl font-black tracking-tight">{p.time}</p>
                <div className="mt-5 flex items-center gap-2 text-sm text-muted-foreground">
                  <Scale className="size-4 text-primary" aria-hidden />
                  بار مالی
                </div>
                <p className="mt-2 text-sm font-semibold leading-relaxed">{p.cost}</p>
              </div>
              <div className="rounded-3xl border border-primary/25 bg-primary/[0.06] p-6">
                <div className="flex items-center gap-2 font-bold text-primary">
                  <FileCheck2 className="size-4" aria-hidden />
                  توصیه کارشناسی دینار
                </div>
                <p className="mt-3 text-sm leading-relaxed text-foreground/85">
                  {path === "A"
                    ? "برای عرضه سریع MVP و تست بازار، مسیر A کم‌ریسک‌ترین گزینه است؛ مجوزها زیر چتر بانک عامل پوشش داده می‌شوند."
                    : "مسیر B مستقل‌تر است اما سرمایه و زمان بیشتری می‌خواهد؛ برای وقتی که مقیاس تراکنش روزانه بالای چند صد میلیارد تومان است منطقی می‌شود."}
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Phase timeline */}
        <div className="mt-14">
          <h3 className="mb-6 flex items-center gap-2 text-xl font-black tracking-tight">
            <Landmark className="size-5 text-primary" aria-hidden />
            چهار فاز تا بانک کامل
          </h3>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {PHASES.map((ph, i) => (
              <motion.div
                key={ph.n}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: i * 0.08, type: "spring", stiffness: 80, damping: 18 }}
                className={`relative rounded-3xl border p-6 ${
                  ph.status === "now"
                    ? "border-primary/35 bg-primary/[0.05]"
                    : "border-border bg-surface"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`tnum grid size-10 place-items-center rounded-2xl font-mono text-base font-black ${
                    ph.status === "now" ? "bg-primary text-primary-foreground" : "bg-white/5 text-foreground/70"
                  }`}>
                    {toFa(ph.n)}
                  </span>
                  {ph.status === "now" ? (
                    <span className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold text-primary">
                      <span className="breathe size-1.5 rounded-full bg-primary" />
                      در جریان
                    </span>
                  ) : (
                    <CircleDashed className="size-4 text-muted-foreground/50" aria-hidden />
                  )}
                </div>
                <p className="mt-4 font-extrabold leading-snug">{ph.title}</p>
                <ul className="mt-3 space-y-2">
                  {ph.items.map((it) => (
                    <li key={it} className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
                      <span className="mt-1.5 size-1 shrink-0 rounded-full bg-primary/60" aria-hidden />
                      {it}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Global licenses + warning */}
        <div className="mt-14 grid gap-4 lg:grid-cols-[1.6fr_1fr]">
          <div className="rounded-3xl border border-border bg-surface p-6 md:p-8">
            <h3 className="flex items-center gap-2 text-lg font-black tracking-tight">
              <Globe2 className="size-5 text-primary" aria-hidden />
              مجوزهای نسل جهانی (فاز ۳)
            </h3>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {GLOBAL_LICENSES.map((l) => (
                <div
                  key={l.org}
                  className={`rounded-2xl border p-4 ${
                    l.tone === "gold" ? "border-primary/30 bg-primary/[0.05]" : "border-border bg-background/40"
                  }`}
                >
                  <p className="flex items-center gap-2 text-sm font-bold">
                    <Building2 className="size-4 text-primary/80" aria-hidden />
                    {l.org}
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{l.scope}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-destructive/25 bg-destructive/[0.05] p-6 md:p-8">
            <h3 className="flex items-center gap-2 text-lg font-black tracking-tight text-destructive">
              <AlertTriangle className="size-5" aria-hidden />
              هشدارهای انطباق
            </h3>
            <ul className="mt-5 space-y-4">
              <li className="flex gap-3">
                <Wallet className="mt-0.5 size-4 shrink-0 text-destructive/80" aria-hidden />
                <p className="text-sm leading-relaxed text-foreground/85">
                  <b>سود ۴٪ ماهانه:</b> از سقف سود مصوب بانکی بالاتر است؛ باید با
                  ساختار «پاداش نگهداشت» یا درآمد واقعی طلا طراحی شود، نه سود
                  سپرده.
                </p>
              </li>
              <li className="flex gap-3">
                <Coins className="mt-0.5 size-4 shrink-0 text-destructive/80" aria-hidden />
                <p className="text-sm leading-relaxed text-foreground/85">
                  <b>تتر و دلار:</b> تا نهایی‌شدن چارچوب دارایی دیجیتال، نگهداشت
                  باید در پلکان حقوقی خارجی (دبی/اروپا) انجام شود.
                </p>
              </li>
              <li className="flex gap-3">
                <Landmark className="mt-0.5 size-4 shrink-0 text-destructive/80" aria-hidden />
                <p className="text-sm leading-relaxed text-foreground/85">
                  <b>بدون مجوز، بدون فعالیت:</b> جذب سپرده عمومی بدون پوشش بانک
                  عامل یا مجوز، جرم تلقی می‌شود.
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

const Coins = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="8" cy="8" r="6" />
    <path d="M18.09 10.37A6 6 0 1 1 10.34 18" />
    <path d="M7 6h1v4" />
    <path d="m16.71 13.88.7.71-2.82 2.82" />
  </svg>
);
