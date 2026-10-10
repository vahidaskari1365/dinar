"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpLeft, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const LINKS = [
  { href: "#features", label: "امکانات" },
  { href: "#demo", label: "دموی زنده" },
  { href: "#licenses", label: "مجوزها" },
  { href: "#feasibility", label: "امکان‌سنجی" },
  { href: "#faq", label: "سوالات" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 90, damping: 18 }}
      className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6 sm:pt-4"
    >
      <nav
        aria-label="ناوبری اصلی"
        className={`mx-auto flex h-14 max-w-6xl items-center justify-between rounded-2xl px-4 transition-all duration-500 sm:px-6 ${
          scrolled ? "glass-strong shadow-[0_16px_40px_-24px_oklch(0_0_0/70%)]" : "border border-transparent"
        }`}
      >
        {/* Logo */}
        <a href="#top" className="flex items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground">
            <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden>
              <path
                d="M12 2.5 14.6 9.4 21.5 12 14.6 14.6 12 21.5 9.4 14.6 2.5 12 9.4 9.4Z"
                fill="currentColor"
              />
            </svg>
          </span>
          <span className="text-base font-extrabold tracking-tight">دینار</span>
          <span className="hidden font-mono text-[10px] tracking-[0.25em] text-muted-foreground sm:inline">
            DINAR
          </span>
        </a>

        {/* Desktop links */}
        <div className="hidden items-center gap-1 lg:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-xl px-3.5 py-2 text-sm text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Button
            asChild
            size="sm"
            className="hidden rounded-xl px-4 font-semibold active:scale-[0.98] sm:inline-flex"
          >
            <a href="#consult">
              درخواست مشاوره
              <ArrowUpLeft className="size-4" />
            </a>
          </Button>
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "بستن منو" : "باز کردن منو"}
            aria-expanded={open}
            className="grid size-10 place-items-center rounded-xl border border-border text-foreground/80 lg:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-strong mx-auto mt-2 max-w-6xl rounded-2xl p-3 lg:hidden"
        >
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block rounded-xl px-4 py-3 text-sm text-foreground/85 transition-colors hover:bg-white/5"
            >
              {l.label}
            </a>
          ))}
          <Button asChild className="mt-2 w-full rounded-xl font-semibold">
            <a href="#consult" onClick={() => setOpen(false)}>
              درخواست مشاوره
            </a>
          </Button>
        </motion.div>
      )}
    </motion.header>
  );
}
