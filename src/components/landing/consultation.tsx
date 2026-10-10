"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CalendarClock, Loader2, Send, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BorderBeam } from "@/components/ui/border-beam";
import { DotPattern } from "@/components/ui/dot-pattern";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { useToast } from "@/hooks/use-toast";

const TOPICS = [
  { v: "path", l: "انتخاب مسیر مجوز (بانک عامل یا درگاه)" },
  { v: "gold", l: "ساختار حقوقی سود و حساب طلا" },
  { v: "usdt", l: "معماری دارایی دیجیتال (تتر/دلار)" },
  { v: "investment", l: "مشارکت سرمایه‌گذاری در فاز صفر" },
  { v: "other", l: "سایر" },
];

/** Shared gold input styling — h-12 touch-friendly, navy surface, gold focus ring */
const FIELD =
  "h-12 rounded-xl border-input bg-surface-2 text-base focus-visible:border-primary/50 focus-visible:ring-primary/25 md:text-sm";

export function Consultation() {
  const { toast } = useToast();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    company: "",
    topic: "",
    message: "",
  });
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (sending) return;
    setSending(true);
    try {
      const res = await fetch("/api/consultation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "خطای ناشناخته");
      setDone(true);
      toast({
        title: "درخواست ثبت شد",
        description: "کارشناس انطباق دینار حداکثر تا ۲۴ ساعت آینده تماس می‌گیرد.",
      });
    } catch (err) {
      toast({
        title: "خطا در ارسال",
        description: err instanceof Error ? err.message : "دوباره تلاش کنید.",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  }

  return (
    <section
      id="consult"
      className="relative overflow-hidden border-t border-border px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
    >
      {/* subtle gold dot backdrop — the only decoration on this section */}
      <DotPattern
        width={24}
        height={24}
        cr={1.1}
        className="text-gold/25 [mask-image:radial-gradient(ellipse_65%_55%_at_50%_45%,black_10%,transparent_75%)]"
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1fr_1.1fr]">
        {/* Pitch */}
        <div>
          <p className="mb-3 font-mono text-xs tracking-[0.3em] text-primary">TALK TO US</p>
          <h2 className="text-3xl font-black tracking-tighter md:text-[2.6rem] md:leading-tight">
            جلسه ۳۰ دقیقه‌ای
            <br />
            با تیم انطباق
          </h2>
          <p className="mt-4 max-w-[58ch] leading-relaxed text-muted-foreground">
            وضعیت پروژه خود را بگویید؛ ظرف ۲۴ ساعت یک جلسه تصویری با کارشناس
            مجوز و یک طراح معماری محصول هماهنگ می‌کنیم — رایگان و بدون تعهد.
          </p>

          <div className="mt-8 space-y-4">
            {[
              { icon: CalendarClock, t: "هماهنگی زیر ۲۴ ساعت", d: "زمان‌بندی بر اساس منطقه زمانی شما" },
              { icon: Sparkles, t: "بازخورد مکتوب", d: "جمع‌بندی جلسه به‌صورت سند PDF برای شما" },
            ].map((r) => (
              <div key={r.t} className="flex items-center gap-4">
                <span className="grid size-11 place-items-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
                  <r.icon className="size-5" aria-hidden />
                </span>
                <div>
                  <p className="text-sm font-bold">{r.t}</p>
                  <p className="text-xs leading-relaxed text-muted-foreground">{r.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form — gold beam patrols the card border */}
        <motion.form
          onSubmit={submit}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ type: "spring", stiffness: 75, damping: 18 }}
          className="relative overflow-hidden rounded-3xl border border-border bg-surface p-5 sm:p-6 md:p-8"
          noValidate
        >
          <BorderBeam
            size={70}
            duration={8}
            colorFrom="#a97f3a"
            colorTo="#ecd9a8"
            borderWidth={1.5}
          />

          {done ? (
            <div className="flex min-h-80 flex-col items-center justify-center text-center">
              <span className="grid size-16 place-items-center rounded-full bg-success/15 text-success ring-1 ring-success/30">
                <Send className="size-7" aria-hidden />
              </span>
              <h3 className="mt-5 text-xl font-black">درخواست شما ثبت شد</h3>
              <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
                {form.name || "همراه گرامی"}، همکاران ما به‌زودی از طریق شماره یا
                ایمیل شما تماس می‌گیرند. تا آن زمان می‌توانید دموی زنده را امتحان کنید.
              </p>
            </div>
          ) : (
            <div className="grid gap-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="c-name" className="text-sm">نام و نام خانوادگی *</Label>
                  <Input
                    id="c-name"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="مثلاً آرمین صفوی"
                    className={FIELD}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="c-phone" className="text-sm">شماره تماس *</Label>
                  <Input
                    id="c-phone"
                    required
                    inputMode="tel"
                    dir="ltr"
                    className={`${FIELD} text-right`}
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="۰۹۱۲ ۸۴۷ ۱۹۲۸"
                  />
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="c-email" className="text-sm">ایمیل</Label>
                  <Input
                    id="c-email"
                    type="email"
                    dir="ltr"
                    className={`${FIELD} text-right`}
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="you@company.com"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="c-company" className="text-sm">نام سازمان</Label>
                  <Input
                    id="c-company"
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    placeholder="اختیاری"
                    className={FIELD}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label className="text-sm">موضوع مشاوره *</Label>
                <Select
                  value={form.topic}
                  onValueChange={(v) => setForm({ ...form, topic: v })}
                  required
                >
                  <SelectTrigger className={`w-full ${FIELD}`}>
                    <SelectValue placeholder="یک موضوع را انتخاب کنید" />
                  </SelectTrigger>
                  <SelectContent>
                    {TOPICS.map((t) => (
                      <SelectItem key={t.v} value={t.v}>
                        {t.l}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="c-msg" className="text-sm">توضیح پروژه</Label>
                <Textarea
                  id="c-msg"
                  rows={3}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="در چند خط بگویید در چه مرحله‌ای هستید و دنبال چه چیزی هستید…"
                  className="min-h-28 resize-none rounded-xl border-input bg-surface-2 text-base focus-visible:border-primary/50 focus-visible:ring-primary/25 sm:min-h-36 md:text-sm"
                />
              </div>

              <ShimmerButton
                type="submit"
                disabled={sending}
                background="linear-gradient(135deg, oklch(0.78 0.13 84), oklch(0.88 0.11 92))"
                shimmerColor="#fff7e0"
                borderRadius="1rem"
                className="min-h-12 w-full text-sm font-black text-[oklch(0.16_0.04_85)] shadow-[0_14px_30px_-12px_oklch(0.84_0.135_88/55%)] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {sending ? (
                  <>
                    <Loader2 className="size-4 animate-spin" aria-hidden />
                    در حال ارسال…
                  </>
                ) : (
                  <>
                    ارسال درخواست مشاوره
                    <Send className="size-4 -scale-x-100" aria-hidden />
                  </>
                )}
              </ShimmerButton>
              <p className="text-center text-[11px] leading-relaxed text-muted-foreground">
                اطلاعات شما محرمانه است و صرفاً برای هماهنگی جلسه استفاده می‌شود.
              </p>
            </div>
          )}
        </motion.form>
      </div>
    </section>
  );
}
