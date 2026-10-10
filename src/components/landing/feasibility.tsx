"use client";

import { motion } from "framer-motion";
import { Check, HelpCircle, X } from "lucide-react";

const CAN = [
  { t: "کیف پول تومانی با درگاه پرداخت", d: "با درگاه اجاره‌ای از PSPها از هفته اول قابل عرضه است." },
  { t: "حساب طلا با پشتوانه واقعی", d: "خرید از بورس کالا با گواهی سپرده؛ کاملاً قانونی و رایج." },
  { t: "صدور کارت مجازی", d: "زیر چتر بانک عامل یا PSP، برای خرید اینترنتی داخلی." },
  { t: "پاداش ماهانه برای نگهداشت", d: "قابل طراحی به‌عنوان پاداش یا درآمد حاصل از طلا، نه سود سپرده." },
];

const CANNOT = [
  { t: "وعده سود تضمینی ۴٪ ماهانه", d: "سقف قانونی سپرده بانکی حدود ۲۰٫۵٪ سالانه است؛ باید بازطراحی شود." },
  { t: "افتتاح حساب رسمی ارزی برای اشخاص", d: "نیازمند مجوز ارزی از بانک مرکزی است که در فاز ۳ با EMI حل می‌شود." },
  { t: "نگهداشت تتر تحت عنوان ایرانی", d: "تا نهایی‌شدن چارچوب، سردخانه دارایی دیجیتال باید خارج از ایران باشد." },
];

export function Feasibility() {
  return (
    <section id="feasibility" className="relative border-t border-border px-4 py-20 sm:px-6 md:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 max-w-2xl">
          <p className="mb-3 font-mono text-xs tracking-[0.3em] text-primary">FEASIBILITY</p>
          <h2 className="text-3xl font-black tracking-tighter md:text-[2.6rem] md:leading-tight">
            آیا واقعاً می‌شود؟ جواب صریح
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            به‌جای وعده، چک‌لیست واقعی: چه چیزهایی همین امروز شدنی است و چه
            چیزهایی باید بازطراحی حقوقی شود.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ type: "spring", stiffness: 75, damping: 18 }}
            className="rounded-3xl border border-success/25 bg-[oklch(0.72_0.15_162/0.04)] p-6 md:p-8"
          >
            <h3 className="flex items-center gap-2 text-xl font-black text-[oklch(0.72_0.15_162)]">
              <Check className="size-5" aria-hidden />
              شدنی — همین امروز شروع می‌شود
            </h3>
            <ul className="mt-6 space-y-5">
              {CAN.map((c) => (
                <li key={c.t} className="flex gap-3">
                  <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-lg bg-success/15 text-[oklch(0.72_0.15_162)]">
                    <Check className="size-3.5" aria-hidden />
                  </span>
                  <div>
                    <p className="font-bold">{c.t}</p>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{c.d}</p>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ type: "spring", stiffness: 75, damping: 18, delay: 0.1 }}
            className="rounded-3xl border border-destructive/25 bg-destructive/[0.04] p-6 md:p-8"
          >
            <h3 className="flex items-center gap-2 text-xl font-black text-destructive">
              <X className="size-5" aria-hidden />
              فعلاً نه — نیاز به بازطراحی دارد
            </h3>
            <ul className="mt-6 space-y-5">
              {CANNOT.map((c) => (
                <li key={c.t} className="flex gap-3">
                  <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-lg bg-destructive/15 text-destructive">
                    <X className="size-3.5" aria-hidden />
                  </span>
                  <div>
                    <p className="font-bold">{c.t}</p>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{c.d}</p>
                  </div>
                </li>
              ))}
            </ul>
            <p className="mt-6 rounded-2xl border border-border bg-background/50 p-4 text-xs leading-relaxed text-muted-foreground">
              نتیجه: با مسیر بانک عامل + ساختار پاداش طلا، تمام اهداف محصول در
              قالب قانونی قابل اجراست. تیم انطباق دینار دقیقاً برای همین طراحی
              شده است.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

const FAQS = [
  {
    q: "فاز اول چطور شروع می‌شود؟ بانک یا درگاه پرداخت؟",
    a: "هر دو قابل اجراست. سریع‌ترین مسیر، درگاه اجاره‌ای از یک PSP معتبر است که در چند روز فعال می‌شود و کاربر می‌تواند پول واریز کند. موازی با آن، قرارداد عاملیت با بانک عامل پیگیری می‌شود تا زیرساخت سپرده و کارت فعال شود. توصیه دینار: شروع با درگاه، هم‌زمان مذاکره با بانک.",
  },
  {
    q: "برای واریز پول کاربران، مجوز بانک مرکزی لازم است؟",
    a: "نگهداشت پول اشخاص ثالث بدون پوشش قانونی ممنوع است. دو راه‌حل قانونی وجود دارد: (۱) پول مستقیم به حساب بانک عامل واریز شود و کیف پول صرفاً رابط نمایش است؛ (۲) درگاه پرداخت دریافت کند و تسویه روزانه با حساب امانی انجام شود. هر دو مدل در قرارداد با بانک/PSP مشخص می‌شود.",
  },
  {
    q: "سود ۴٪ ماهانه از کجا تأمین می‌شود و قانونی است؟",
    a: "۴٪ ماهانه معادل بیش از ۴۸٪ سالانه است و از سقف سپرده بانکی بالاتر می‌رود. راه‌حل حقوقی: این عدد را «پاداش نگهداشت» یا «سهم از درآمد عملیات طلا» تعریف کنید — همان‌طور که برخی صندوق‌های طلا عمل می‌کنند. بخش امکان‌سنجی جزئیات ساختار پیشنهادی را نشان می‌دهد.",
  },
  {
    q: "خرید طلا چطور واقعی می‌ماند؟",
    a: "پول کاربر به گواهی سپرده کالایی (طلای مصوب بورس کالا) تبدیل می‌شود و معادل همان گرم به نام کاربر ثبت است. کاربر هر لحظه می‌تواند بفروشد یا در فازهای بعد، فیزیکال تحویل بگیرد. این مدل در ایران سابقه موفق دارد و نیازی به مجوز جدید ندارد.",
  },
  {
    q: "تتر و دلار چطور؟ در ایران مجاز است؟",
    a: "برای عرضه قانونی، نگهداشت دارایی دیجیتال باید در ساختار خارجی با مجوز VARA دبی یا EMI اروپا انجام شود؛ اپلیکیشن ایرانی صرفاً لایه نمایش و تبدیل است. چارچوب دارایی‌های دیجیتال بانک مرکزی هنوز در حال نهایی‌شدن است، پس معماری دو-سطحی طراحی شده است.",
  },
  {
    q: "کارمزدها و مدل درآمدی چیست؟",
    a: "درآمد از چهار محل: (۱) کارمزد درصدی درگاه، (۲) اسپرد تبدیل ارز و طلا، (۳) کارمزد صدور و سالانه کارت، (۴) سود عملیات خزانه روی موجودی نشسته. مدل شفاف است: هیچ کارمزد پنهانی روی واریز کاربر اعمال نمی‌شود.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="relative border-t border-border px-4 py-20 sm:px-6 md:py-28">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="mb-3 font-mono text-xs tracking-[0.3em] text-primary">FAQ</p>
          <h2 className="text-3xl font-black tracking-tighter md:text-[2.4rem] md:leading-tight">
            سؤال‌هایی که
            <br />
            سرمایه‌گذار می‌پرسد
          </h2>
          <div className="glass mt-8 rounded-3xl p-6">
            <HelpCircle className="size-6 text-primary" aria-hidden />
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              سؤال حقوقی خاصی دارید؟ تیم انطباق دینار در جلسه ۳۰ دقیقه‌ای رایگان
              پاسخ می‌دهد.
            </p>
            <a
              href="#consult"
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-primary transition-transform hover:-translate-x-0.5"
            >
              رزرو جلسه
              <span aria-hidden>←</span>
            </a>
          </div>
        </div>

        <div className="space-y-3">
          {FAQS.map((f, i) => (
            <motion.details
              key={f.q}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.05 }}
              className="group rounded-2xl border border-border bg-surface px-6 py-5 transition-colors open:border-primary/30 [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="flex cursor-pointer items-center justify-between gap-4 font-bold">
                {f.q}
                <span className="grid size-7 shrink-0 place-items-center rounded-full border border-border text-muted-foreground transition-transform group-open:rotate-45">
                  <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                    <path d="M8 2v12M2 8h12" strokeLinecap="round" />
                  </svg>
                </span>
              </summary>
              <p className="mt-4 max-w-[68ch] text-sm leading-relaxed text-muted-foreground">{f.a}</p>
            </motion.details>
          ))}
        </div>
      </div>
    </section>
  );
}
