"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Download, Plus, X } from "lucide-react";

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

/**
 * PWA glue:
 * 1. Registers /sw.js (offline shell + asset caching)
 * 2. Shows a tasteful "install app" chip when the browser fires
 *    beforeinstallprompt (Android/tablet Chrome, desktop).
 *    Hidden when already running standalone.
 */
export function PwaProvider() {
  const [installEvt, setInstallEvt] = useState<InstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // 1 — service worker (production only: avoids stale-page confusion in dev)
    if (process.env.NODE_ENV !== "production") return;
    if ("serviceWorker" in navigator) {
      const onLoad = () => {
        navigator.serviceWorker.register("/sw.js").catch(() => {
          /* SW is a progressive enhancement — never break the page */
        });
      };
      if (document.readyState === "complete") onLoad();
      else window.addEventListener("load", onLoad, { once: true });
      return () => window.removeEventListener("load", onLoad);
    }
  }, []);

  useEffect(() => {
    // already installed → never show the chip
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      // iOS Safari
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
    if (standalone) return;

    if (sessionStorage.getItem("dinar-install-dismissed")) return;

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setInstallEvt(e as InstallPromptEvent);
    };
    const onInstalled = () => setInstallEvt(null);

    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  async function install() {
    if (!installEvt) return;
    await installEvt.prompt();
    const { outcome } = await installEvt.userChoice;
    if (outcome === "accepted") setInstallEvt(null);
  }

  function dismiss() {
    sessionStorage.setItem("dinar-install-dismissed", "1");
    setDismissed(true);
  }

  const show = Boolean(installEvt) && !dismissed;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 220, damping: 24 }}
          role="region"
          aria-label="نصب اپلیکیشن دینار"
          className="glass-strong fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-3 z-40 flex items-center gap-3 rounded-2xl py-2.5 pl-2.5 pr-4 shadow-[0_20px_44px_-18px_oklch(0_0_0/75%)]"
        >
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/15 text-primary">
            <Download className="size-5" aria-hidden />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-bold leading-tight">نصب اپلیکیشن دینار</p>
            <p className="mt-0.5 text-[11px] leading-tight text-muted-foreground">
              روی صفحه اصلی گوشی یا تبلت اضافه شود
            </p>
          </div>
          <button
            onClick={install}
            className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground transition-transform active:scale-95"
            aria-label="نصب اپلیکیشن"
          >
            <Plus className="size-5" aria-hidden />
          </button>
          <button
            onClick={dismiss}
            className="grid size-7 shrink-0 place-items-center rounded-lg text-muted-foreground transition-colors hover:text-foreground"
            aria-label="بستن پیشنهاد نصب"
          >
            <X className="size-4" aria-hidden />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
