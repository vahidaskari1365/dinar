"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpLeft, Menu } from "lucide-react";
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

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
          scrolled
            ? // near-opaque navy (97%) + blur → no ghost text bleed on mobile,
              // while border + inset highlight keep the glass look
              "border border-white/10 bg-background/[0.97] shadow-[inset_0_1px_0_oklch(1_0_0/12%),0_16px_40px_-24px_oklch(0_0_0/70%)] backdrop-blur-xl backdrop-saturate-150"
            : "border border-transparent"
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
              <AnimatedShinyText className="text-primary-foreground dark:text-primary-foreground">
                درخواست مشاوره
              </AnimatedShinyText>
              <ArrowUpLeft className="size-4" />
            </a>
          </Button>

          {/* Mobile drawer — RTL-safe slide from the right */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                aria-label="باز کردن منو"
                className="grid size-11 place-items-center rounded-xl border border-border text-foreground/80 transition-colors hover:bg-white/5 lg:hidden"
              >
                <Menu className="size-5" />
              </button>
            </SheetTrigger>
            <SheetContent
              side="right"
              aria-describedby={undefined}
              className="glass-strong w-[84vw] max-w-xs gap-0 border-l border-white/10 p-0 [&>button]:grid [&>button]:size-11 [&>button]:place-items-center [&>button]:rounded-xl [&>button]:top-3 [&>button]:right-3 [&>button]:bg-white/5 [&>button]:text-foreground"
            >
              <SheetHeader className="border-b border-white/10 p-5">
                <div className="flex items-center gap-2.5">
                  <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground">
                    <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden>
                      <path
                        d="M12 2.5 14.6 9.4 21.5 12 14.6 14.6 12 21.5 9.4 14.6 2.5 12 9.4 9.4Z"
                        fill="currentColor"
                      />
                    </svg>
                  </span>
                  <SheetTitle className="text-base font-extrabold tracking-tight">
                    دینار
                  </SheetTitle>
                </div>
              </SheetHeader>

              <nav aria-label="ناوبری موبایل" className="flex flex-col p-3">
                {LINKS.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="flex min-h-11 items-center rounded-xl px-4 text-[15px] text-foreground/85 transition-colors hover:bg-white/5 hover:text-foreground"
                  >
                    {l.label}
                  </a>
                ))}
              </nav>

              <div className="mt-auto border-t border-white/10 p-5">
                <Button asChild className="h-11 w-full rounded-xl font-semibold">
                  <a href="#consult" onClick={() => setOpen(false)}>
                    درخواست مشاوره
                    <ArrowUpLeft className="size-4" />
                  </a>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </motion.header>
  );
}
