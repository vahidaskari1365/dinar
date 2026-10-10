"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeftRight,
  ArrowDownToLine,
  ArrowUpFromLine,
  Coins,
  CreditCard,
  Loader2,
  Plus,
  RefreshCw,
  Snowflake,
  TrendingUp,
  Wallet2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { faCompact, faDateTime, toFa, faTimeAgo } from "@/lib/format";
import { convert, currentPrices, type Prices } from "@/lib/prices";
import { GoldChart } from "./gold-chart";

/* ---------- types ---------- */
type Tx = {
  id: string;
  type: string;
  asset: string;
  amount: number;
  meta: string | null;
  createdAt: string;
};
type Card = {
  id: string;
  number: string;
  expMonth: number;
  expYear: number;
  status: string;
  createdAt: string;
};
type WalletData = {
  wallet: { irr: number; usdt: number; gold: number };
  cards: Card[];
  transactions: Tx[];
};

const CARD_FEE = 120_000;

/* ---------- helpers ---------- */
function parseNum(s: string): number {
  const fa = "۰۱۲۳۴۵۶۷۸۹";
  const ar = "٠١٢٣٤٥٦٧٨٩";
  let out = "";
  for (const ch of s) {
    const fi = fa.indexOf(ch);
    const ai = ar.indexOf(ch);
    out += fi >= 0 ? String(fi) : ai >= 0 ? String(ai) : ch;
  }
  return Number(out.replace(/[,\s٬]/g, "")) || 0;
}

const TX_META: Record<string, { label: string; tone: string; icon: React.ElementType }> = {
  deposit: { label: "واریز", tone: "text-[oklch(0.72_0.15_162)] bg-[oklch(0.72_0.15_162/10%)]", icon: ArrowDownToLine },
  withdraw: { label: "برداشت", tone: "text-foreground/70 bg-white/5", icon: ArrowUpFromLine },
  gold_buy: { label: "خرید طلا", tone: "text-primary bg-primary/10", icon: Coins },
  gold_sell: { label: "فروش طلا", tone: "text-foreground/70 bg-white/5", icon: Coins },
  exchange: { label: "تبدیل ارز", tone: "text-foreground/70 bg-white/5", icon: ArrowLeftRight },
  card_issue: { label: "صدور کارت", tone: "text-foreground/70 bg-white/5", icon: CreditCard },
  profit: { label: "پاداش ماهانه", tone: "text-[oklch(0.72_0.15_162)] bg-[oklch(0.72_0.15_162/10%)]", icon: TrendingUp },
};

function fmtAsset(asset: string, amount: number): string {
  if (asset === "IRR") return `${toFa(amount)} تومان`;
  if (asset === "USDT") return `${toFa(amount, 2)} تتر`;
  if (asset === "GOLD") return `${toFa(amount, 3)} گرم`;
  return toFa(amount);
}

/* ---------- hook ---------- */
function useWallet() {
  const [data, setData] = useState<WalletData | null>(null);
  const [loading, setLoading] = useState(true);
  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/wallet", { cache: "no-store" });
      if (res.ok) setData(await res.json());
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    refresh();
  }, [refresh]);
  return { data, loading, refresh };
}

function usePrices(intervalMs = 4000) {
  const [prices, setPrices] = useState<Prices | null>(null);
  const histRef = useRef<number[]>([]);
  const [hist, setHist] = useState<number[]>([]);

  useEffect(() => {
    let alive = true;
    const tick = () => {
      const p = currentPrices();
      if (!alive) return;
      setPrices(p);
      histRef.current = [...histRef.current.slice(-47), p.gold];
      setHist(histRef.current);
    };
    tick();
    const id = setInterval(tick, intervalMs);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, [intervalMs]);

  return { prices, hist };
}

/* ================================================================ */
export function WalletDemo() {
  return (
    <section id="demo" className="relative border-t border-border px-4 py-20 sm:px-6 md:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="mb-3 font-mono text-xs tracking-[0.3em] text-primary">LIVE DEMO</p>
            <h2 className="text-3xl font-black tracking-tighter md:text-[2.6rem] md:leading-tight">
              دموی زنده — همین حالا امتحان کنید
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              یک کیف پول واقعی روی سرور دمو: واریز کنید، طلا بخرید، تتر تبدیل
              کنید و کارت مجازی صادر کنید. نرخ‌ها هر ثانیه از موتور قیمت به‌روز
              می‌شوند.
            </p>
          </div>
          <span className="flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs text-muted-foreground">
            <span className="breathe size-1.5 rounded-full bg-success" />
            موتور قیمت فعال
          </span>
        </div>

        <Dashboard />
      </div>
    </section>
  );
}

/* ================================================================ */
function Dashboard() {
  const { data, loading, refresh } = useWallet();
  const { prices, hist } = usePrices();
  const { toast } = useToast();
  const [busy, setBusy] = useState<string | null>(null);
  const [dialog, setDialog] = useState<null | "deposit" | "withdraw" | "convert" | "card">(null);

  const act = useCallback(
    async (key: string, url: string, body: Record<string, unknown>, okMsg: string) => {
      setBusy(key);
      try {
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "خطا در انجام عملیات");
        await refresh();
        setDialog(null);
        toast({ title: okMsg, description: json.summary });
      } catch (e) {
        toast({
          title: "انجام نشد",
          description: e instanceof Error ? e.message : "دوباره تلاش کنید",
          variant: "destructive",
        });
      } finally {
        setBusy(null);
      }
    },
    [refresh, toast]
  );

  if (loading || !data || !prices) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-36 animate-pulse rounded-3xl border border-border bg-surface" />
        ))}
        <div className="h-72 animate-pulse rounded-3xl border border-border bg-surface md:col-span-3" />
      </div>
    );
  }

  const w = data.wallet;

  return (
    <>
      {/* Balance strip — asymmetric */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Main IRR */}
        <motion.div
          layout
          className="relative overflow-hidden rounded-3xl border border-primary/25 bg-[linear-gradient(140deg,oklch(0.2_0.03_82),oklch(0.16_0.015_78)_60%,oklch(0.24_0.05_85))] p-6 md:col-span-2"
        >
          <div className="shine pointer-events-none absolute inset-0 overflow-hidden rounded-3xl" />
          <div className="flex items-start justify-between">
            <div>
              <p className="flex items-center gap-2 text-xs text-foreground/60">
                <Wallet2 className="size-3.5" aria-hidden />
                موجودی تومانی
              </p>
              <p className="tnum mt-3 font-mono text-4xl font-black tracking-tight text-foreground md:text-5xl" dir="ltr">
                {toFa(Math.round(w.irr))}
                <span className="mr-2 text-sm font-medium text-foreground/50">تومان</span>
              </p>
              <p className="tnum mt-2 text-xs text-foreground/50" dir="ltr">
                ≈ {faCompact(w.irr / prices.usdt)} تتر
              </p>
            </div>
            <span className="rounded-xl border border-primary/25 bg-primary/10 px-3 py-1.5 text-[11px] font-bold text-primary">
              پاداش ۴٫۲٪ ماهانه
            </span>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            <Button size="sm" className="rounded-xl font-bold active:scale-[0.98]" onClick={() => setDialog("deposit")}>
              <Plus className="size-4" aria-hidden />
              واریز
            </Button>
            <Button size="sm" variant="secondary" className="rounded-xl active:scale-[0.98]" onClick={() => setDialog("withdraw")}>
              <ArrowUpFromLine className="size-4" aria-hidden />
              برداشت
            </Button>
            <Button size="sm" variant="secondary" className="rounded-xl active:scale-[0.98]" onClick={() => setDialog("convert")}>
              <ArrowLeftRight className="size-4" aria-hidden />
              تبدیل
            </Button>
            <Button size="sm" variant="ghost" className="rounded-xl border border-border active:scale-[0.98]" onClick={() => setDialog("card")}>
              <CreditCard className="size-4" aria-hidden />
              کارت جدید
            </Button>
          </div>
        </motion.div>

        {/* Side assets */}
        <div className="grid gap-4">
          <motion.div layout className="rounded-3xl border border-border bg-surface p-6">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">موجودی تتر</p>
              <span className="grid size-8 place-items-center rounded-lg bg-[oklch(0.72_0.15_162/12%)] text-[oklch(0.72_0.15_162)]">
                <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden>
                  <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm4.6 8.9v1.7h-3.7v1.2h3.7v1.7h-3.7v2.6h-1.8v-2.6H7.4v-1.7h3.7v-1.2H7.4v-1.7h6.6l-1.4-1.4 1.2-1.2 3 3-3 3-1.2-1.2 1.3-1.4h-.7Z" />
                </svg>
              </span>
            </div>
            <p className="tnum mt-3 font-mono text-2xl font-black" dir="ltr">
              {toFa(w.usdt, 2)}
              <span className="mr-1.5 text-xs font-medium text-muted-foreground">USDT</span>
            </p>
            <p className="tnum mt-1 text-[11px] text-muted-foreground" dir="ltr">
              ≈ {toFa(Math.round(w.usdt * prices.usdt))} تومان
            </p>
          </motion.div>

          <motion.div layout className="rounded-3xl border border-border bg-surface p-6">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">طلای شما</p>
              <span className="grid size-8 place-items-center rounded-lg bg-primary/10 text-primary">
                <Coins className="size-4" aria-hidden />
              </span>
            </div>
            <p className="tnum mt-3 font-mono text-2xl font-black" dir="ltr">
              {toFa(w.gold, 3)}
              <span className="mr-1.5 text-xs font-medium text-muted-foreground">گرم ۱۸</span>
            </p>
            <p className="tnum mt-1 text-[11px] text-muted-foreground" dir="ltr">
              ≈ {toFa(Math.round(w.gold * prices.gold))} تومان
            </p>
          </motion.div>
        </div>
      </div>

      {/* Market + trade */}
      <div className="mt-4 grid gap-4 lg:grid-cols-[1.25fr_1fr]">
        {/* Gold market */}
        <div className="rounded-3xl border border-border bg-surface p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-extrabold tracking-tight">بازار طلا — هر گرم ۱۸ عیار</p>
              <p className="tnum mt-1.5 font-mono text-2xl font-black text-primary" dir="ltr">
                {toFa(prices.gold)} <span className="text-xs font-medium text-muted-foreground">تومان</span>
              </p>
            </div>
            <div className="flex gap-2">
              <div className="rounded-xl border border-border bg-background/40 px-3 py-2 text-center">
                <p className="text-[10px] text-muted-foreground">تتر</p>
                <p className="tnum font-mono text-sm font-bold" dir="ltr">
                  {toFa(prices.usdt)}
                </p>
              </div>
              <div className="rounded-xl border border-border bg-background/40 px-3 py-2 text-center">
                <p className="text-[10px] text-muted-foreground">دلار</p>
                <p className="tnum font-mono text-sm font-bold" dir="ltr">
                  {toFa(prices.usd)}
                </p>
              </div>
            </div>
          </div>
          <div className="mt-5">
            <GoldChart data={hist} />
          </div>
        </div>

        {/* Gold trade panel */}
        <GoldPanel
          prices={prices}
          wallet={w}
          busy={busy}
          onTrade={(action, grams) =>
            act(
              `gold-${action}`,
              "/api/wallet/gold",
              { action, grams },
              action === "buy" ? "طلای شما خریداری شد" : "طلا با موفقیت فروخته شد"
            )
          }
        />
      </div>

      {/* Activity + cards */}
      <div className="mt-4 grid gap-4 lg:grid-cols-[1.25fr_1fr]">
        <div className="rounded-3xl border border-border bg-surface p-6">
          <div className="flex items-center justify-between">
            <p className="font-extrabold tracking-tight">گردش حساب</p>
            <button
              onClick={refresh}
              className="grid size-8 place-items-center rounded-lg border border-border text-muted-foreground transition-colors hover:text-foreground"
              aria-label="به‌روزرسانی"
            >
              <RefreshCw className="size-3.5" aria-hidden />
            </button>
          </div>
          <div className="mt-4 max-h-96 space-y-2 overflow-y-auto pl-1 [scrollbar-width:thin]">
            {data.transactions.length === 0 ? (
              <div className="grid place-items-center rounded-2xl border border-dashed border-border py-12 text-center">
                <Wallet2 className="size-8 text-muted-foreground/40" aria-hidden />
                <p className="mt-3 text-sm font-semibold text-muted-foreground">هنوز گردشی ثبت نشده</p>
                <p className="mt-1 text-xs text-muted-foreground/70">
                  اولین واریز را انجام دهید تا اینجا دیده شود.
                </p>
              </div>
            ) : (
              <AnimatePresence initial={false}>
                {data.transactions.map((t) => {
                  const m = TX_META[t.type] ?? TX_META.exchange;
                  return (
                    <motion.div
                      key={t.id}
                      layout
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center justify-between rounded-2xl border border-border/70 bg-background/40 px-4 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <span className={`grid size-9 place-items-center rounded-xl ${m.tone}`}>
                          <m.icon className="size-4" aria-hidden />
                        </span>
                        <div>
                          <p className="text-sm font-semibold leading-none">{m.label}</p>
                          <p className="mt-1.5 text-[11px] text-muted-foreground">
                            {faTimeAgo(t.createdAt)} • {faDateTime(t.createdAt)}
                          </p>
                        </div>
                      </div>
                      <p className="tnum font-mono text-sm font-bold text-foreground/90" dir="ltr">
                        {fmtAsset(t.asset, t.amount)}
                      </p>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            )}
          </div>
        </div>

        {/* Cards */}
        <div className="rounded-3xl border border-border bg-surface p-6">
          <div className="flex items-center justify-between">
            <p className="font-extrabold tracking-tight">کارت‌های من</p>
            <Button size="sm" variant="outline" className="rounded-xl" onClick={() => setDialog("card")}>
              <Plus className="size-4" aria-hidden />
              صدور کارت
            </Button>
          </div>
          <div className="mt-4 max-h-96 space-y-3 overflow-y-auto [scrollbar-width:thin]">
            {data.cards.length === 0 ? (
              <div className="grid place-items-center rounded-2xl border border-dashed border-border py-12 text-center">
                <CreditCard className="size-8 text-muted-foreground/40" aria-hidden />
                <p className="mt-3 text-sm font-semibold text-muted-foreground">کارت virtual ندارید</p>
                <p className="mt-1 text-xs text-muted-foreground/70">
                  با کارمزد {toFa(CARD_FEE)} تومانی صادر کنید.
                </p>
              </div>
            ) : (
              data.cards.map((c) => (
                <motion.div
                  key={c.id}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`relative overflow-hidden rounded-2xl border p-4 ${
                    c.status === "frozen"
                      ? "border-border bg-background/50 opacity-60"
                      : "border-primary/20 bg-[linear-gradient(130deg,oklch(0.24_0.035_82),oklch(0.19_0.02_78)_55%,oklch(0.28_0.06_85))]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="rounded-md bg-black/25 px-2 py-0.5 font-mono text-[9px] tracking-[0.2em] text-white/70">
                      VIRTUAL
                    </span>
                    {c.status === "frozen" && (
                      <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <Snowflake className="size-3" aria-hidden />
                        مسدود
                      </span>
                    )}
                  </div>
                  <p className="tnum mt-5 font-mono text-base tracking-[0.15em] text-white/90" dir="ltr">
                    {c.number}
                  </p>
                  <div className="mt-2 flex items-center justify-between text-[10px] text-white/50">
                    <span>کارپوشه دینار</span>
                    <span className="tnum font-mono" dir="ltr">
                      {toFa(c.expMonth, 0).padStart(2, "۰")}/{toFa(c.expYear % 100).padStart(2, "۰")}
                    </span>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <CashDialog
        mode={dialog}
        busy={busy}
        wallet={w}
        onClose={() => setDialog(null)}
        onDeposit={(amt) => act("deposit", "/api/wallet/deposit", { amount: amt }, "واریز با موفقیت انجام شد")}
        onWithdraw={(amt) => act("withdraw", "/api/wallet/withdraw", { amount: amt }, "برداشت ثبت شد")}
        onIssueCard={() => act("card", "/api/wallet/card", {}, "کارت مجازی صادر شد")}
      />
      <ConvertDialog
        open={dialog === "convert"}
        busy={busy}
        prices={prices}
        wallet={w}
        onClose={() => setDialog(null)}
        onConvert={(from, to, amount) =>
          act("convert", "/api/wallet/exchange", { from, to, amount }, "تبدیل با موفقیت انجام شد")
        }
      />
    </>
  );
}

/* ---------- Gold trade panel ---------- */
function GoldPanel({
  prices,
  wallet,
  busy,
  onTrade,
}: {
  prices: Prices;
  wallet: { irr: number; gold: number };
  busy: string | null;
  onTrade: (action: "buy" | "sell", grams: number) => void;
}) {
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [grams, setGrams] = useState("0.5");
  const g = parseNum(grams);
  const total = g * prices.gold;
  const valid =
    g > 0 &&
    (side === "buy"
      ? total <= wallet.irr
      : g <= wallet.gold);

  return (
    <div className="rounded-3xl border border-border bg-surface p-6">
      <div className="flex items-center justify-between">
        <p className="font-extrabold tracking-tight">معامله طلا</p>
        <span className="text-[10px] text-muted-foreground">کارمزد ۰٫۶٪ شفاف</span>
      </div>

      <Tabs value={side} onValueChange={(v) => setSide(v as "buy" | "sell")} className="mt-4">
        <TabsList className="grid w-full grid-cols-2 rounded-xl bg-background/60">
          <TabsTrigger value="buy" className="rounded-lg font-bold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            خرید
          </TabsTrigger>
          <TabsTrigger value="sell" className="rounded-lg font-bold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            فروش
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="mt-4 grid gap-3">
        <div className="grid gap-2">
          <Label htmlFor="gold-grams">مقدار (گرم)</Label>
          <Input
            id="gold-grams"
            dir="ltr"
            inputMode="decimal"
            className="h-12 rounded-xl bg-background/60 text-left font-mono tnum"
            value={grams}
            onChange={(e) => setGrams(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {["0.1", "0.5", "1", "2.5"].map((v) => (
            <button
              key={v}
              onClick={() => setGrams(v)}
              className="tnum flex-1 rounded-lg border border-border bg-background/40 py-1.5 font-mono text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
            >
              {toFa(parseNum(v), 1)}
            </button>
          ))}
        </div>

        <div className="rounded-2xl border border-border bg-background/40 p-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>مبلغ کل</span>
            <span className="tnum font-mono text-sm font-bold text-foreground" dir="ltr">
              {toFa(Math.round(total))} تومان
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
            <span>موجودی قابل استفاده</span>
            <span className="tnum font-mono" dir="ltr">
              {side === "buy"
                ? `${toFa(Math.round(wallet.irr))} تومان`
                : `${toFa(wallet.gold, 3)} گرم`}
            </span>
          </div>
        </div>

        <Button
          disabled={!valid || busy === `gold-${side}`}
          onClick={() => onTrade(side, g)}
          className="h-12 rounded-2xl text-sm font-bold active:scale-[0.98]"
        >
          {busy === `gold-${side}` ? (
            <Loader2 className="size-4 animate-spin" aria-hidden />
          ) : side === "buy" ? (
            "خرید طلا"
          ) : (
            "فروش طلا"
          )}
        </Button>
        {!valid && g > 0 && (
          <p className="text-center text-[11px] text-destructive">
            {side === "buy" ? "موجودی تومانی کافی نیست." : "طلای کافی ندارید."}
          </p>
        )}
      </div>
    </div>
  );
}

/* ---------- Deposit / Withdraw / Card dialog ---------- */
function CashDialog({
  mode,
  busy,
  wallet,
  onClose,
  onDeposit,
  onWithdraw,
  onIssueCard,
}: {
  mode: null | "deposit" | "withdraw" | "card";
  busy: string | null;
  wallet: { irr: number };
  onClose: () => void;
  onDeposit: (amount: number) => void;
  onWithdraw: (amount: number) => void;
  onIssueCard: () => void;
}) {
  const open = mode !== null;
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md rounded-3xl border-border bg-card p-6 sm:rounded-3xl">
        {mode && (
          <CashForm
            key={mode}
            mode={mode}
            busy={busy}
            irr={wallet.irr}
            onClose={onClose}
            onDeposit={onDeposit}
            onWithdraw={onWithdraw}
            onIssueCard={onIssueCard}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function CashForm({
  mode,
  busy,
  irr,
  onDeposit,
  onWithdraw,
  onIssueCard,
}: {
  mode: "deposit" | "withdraw" | "card";
  busy: string | null;
  irr: number;
  onClose: () => void;
  onDeposit: (amount: number) => void;
  onWithdraw: (amount: number) => void;
  onIssueCard: () => void;
}) {
  const [amount, setAmount] = useState("");
  const amt = parseNum(amount);
  const isDeposit = mode === "deposit";
  const presets = isDeposit ? [500_000, 2_000_000, 10_000_000] : [500_000, 2_000_000];
  const valid = amt > 0 && (isDeposit || amt <= irr);

  return (
    <>
      <DialogHeader className="text-right">
        <DialogTitle className="font-black tracking-tight">
          {mode === "card" ? "صدور کارت مجازی" : isDeposit ? "واریز به کیف پول" : "برداشت از کیف پول"}
        </DialogTitle>
        <DialogDescription>
          {mode === "card"
            ? `کارمزد صدور ${toFa(CARD_FEE)} تومان از موجودی شما کسر می‌شود.`
            : isDeposit
              ? "در نسخه دمو، واریز شبیه‌سازی درگاه پرداخت است."
              : "مبلغ باید کمتر یا مساوی موجودی قابل برداشت باشد."}
        </DialogDescription>
      </DialogHeader>

      {mode === "card" ? (
        <Button
          disabled={busy === "card" || irr < CARD_FEE}
          onClick={onIssueCard}
          className="h-12 w-full rounded-2xl font-bold active:scale-[0.98]"
        >
          {busy === "card" ? (
            <Loader2 className="size-4 animate-spin" aria-hidden />
          ) : (
            "صدور کارت"
          )}
        </Button>
      ) : (
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="cash-amount">مبلغ (تومان)</Label>
            <Input
              id="cash-amount"
              dir="ltr"
              inputMode="numeric"
              className="h-12 rounded-xl bg-background/60 text-left font-mono tnum"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="2,000,000"
            />
          </div>
          <div className="flex gap-2">
            {presets.map((p) => (
              <button
                key={p}
                onClick={() => setAmount(String(p))}
                className="flex-1 rounded-lg border border-border bg-background/40 py-2 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
              >
                {faCompact(p)} تومان
              </button>
            ))}
          </div>
          {!isDeposit && (
            <p className="tnum text-center font-mono text-[11px] text-muted-foreground" dir="ltr">
              موجودی: {toFa(Math.round(irr))} تومان
            </p>
          )}
          <Button
            disabled={!valid || !!busy}
            onClick={() => (isDeposit ? onDeposit(amt) : onWithdraw(amt))}
            className="h-12 rounded-2xl font-bold active:scale-[0.98]"
          >
            {busy ? <Loader2 className="size-4 animate-spin" aria-hidden /> : isDeposit ? "تأیید واریز" : "تأیید برداشت"}
          </Button>
          {!valid && amt > 0 && !isDeposit && (
            <p className="text-center text-[11px] text-destructive">موجودی کافی نیست.</p>
          )}
        </div>
      )}
    </>
  );
}

/* ---------- Convert dialog ---------- */
function ConvertDialog({
  open,
  busy,
  prices,
  wallet,
  onClose,
  onConvert,
}: {
  open: boolean;
  busy: string | null;
  prices: Prices;
  wallet: { irr: number; usdt: number; gold: number };
  onClose: () => void;
  onConvert: (from: "IRR" | "USDT" | "GOLD", to: "IRR" | "USDT" | "GOLD", amount: number) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md rounded-3xl border-border bg-card p-6 sm:rounded-3xl">
        {open && (
          <ConvertForm
            key="convert"
            busy={busy}
            prices={prices}
            wallet={wallet}
            onConvert={onConvert}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function ConvertForm({
  busy,
  prices,
  wallet,
  onConvert,
}: {
  busy: string | null;
  prices: Prices;
  wallet: { irr: number; usdt: number; gold: number };
  onConvert: (from: "IRR" | "USDT" | "GOLD", to: "IRR" | "USDT" | "GOLD", amount: number) => void;
}) {
  const ASSETS = [
    { k: "IRR" as const, l: "تومان", max: wallet.irr, dec: 0 },
    { k: "USDT" as const, l: "تتر", max: wallet.usdt, dec: 2 },
    { k: "GOLD" as const, l: "طلا (گرم)", max: wallet.gold, dec: 3 },
  ];
  const [from, setFrom] = useState<"IRR" | "USDT" | "GOLD">("IRR");
  const [to, setTo] = useState<"IRR" | "USDT" | "GOLD">("USDT");
  const [amount, setAmount] = useState("");

  const fromA = ASSETS.find((a) => a.k === from)!;
  const amt = parseNum(amount);
  const result = useMemo(() => (amt > 0 ? convert(amt, from, to, prices) : 0), [amt, from, to, prices]);
  const valid = amt > 0 && amt <= fromA.max && from !== to;

  return (
    <>
      <DialogHeader className="text-right">
        <DialogTitle className="font-black tracking-tight">تبدیل دارایی</DialogTitle>
        <DialogDescription>نرخ لحظه‌ای با اسپرد شفاف ۰٫۶٪.</DialogDescription>
      </DialogHeader>

      <div className="grid gap-3">
          <div className="rounded-2xl border border-border bg-background/40 p-4">
            <div className="flex items-center justify-between gap-3">
              <Label className="shrink-0">از</Label>
              <div className="flex flex-1 items-center gap-2">
                <Input
                  dir="ltr"
                  inputMode="decimal"
                  className="h-10 flex-1 rounded-lg bg-background/60 text-left font-mono tnum"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0"
                />
                <select
                  value={from}
                  onChange={(e) => setFrom(e.target.value as typeof from)}
                  aria-label="از دارایی"
                  className="h-10 rounded-lg border border-border bg-background/80 px-2 text-xs"
                >
                  {ASSETS.map((a) => (
                    <option key={a.k} value={a.k}>
                      {a.l}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <p className="tnum mt-2 text-left font-mono text-[10px] text-muted-foreground" dir="ltr">
              حداکثر: {toFa(fromA.max, fromA.dec)}
            </p>
          </div>

          <button
            onClick={() => {
              const f = from;
              setFrom(to);
              setTo(f);
            }}
            aria-label="جابجایی جهت تبدیل"
            className="mx-auto grid size-9 place-items-center rounded-full border border-primary/30 bg-primary/10 text-primary transition-transform hover:rotate-180"
          >
            <ArrowLeftRight className="size-4" aria-hidden />
          </button>

          <div className="rounded-2xl border border-primary/25 bg-primary/[0.05] p-4">
            <div className="flex items-center justify-between gap-3">
              <Label className="shrink-0 text-primary">به</Label>
              <div className="flex flex-1 items-center justify-end gap-2">
                <p className="tnum flex-1 text-left font-mono text-lg font-black" dir="ltr">
                  {result > 0 ? toFa(result, to === "IRR" ? 0 : to === "GOLD" ? 3 : 2) : "۰"}
                </p>
                <select
                  value={to}
                  onChange={(e) => setTo(e.target.value as typeof to)}
                  aria-label="به دارایی"
                  className="h-10 rounded-lg border border-border bg-background/80 px-2 text-xs"
                >
                  {ASSETS.map((a) => (
                    <option key={a.k} value={a.k}>
                      {a.l}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <Button
            disabled={!valid || !!busy}
            onClick={() => onConvert(from, to, amt)}
            className="h-12 rounded-2xl font-bold active:scale-[0.98]"
          >
            {busy ? <Loader2 className="size-4 animate-spin" aria-hidden /> : "انجام تبدیل"}
          </Button>
          {!valid && amt > 0 && from === to && (
            <p className="text-center text-[11px] text-destructive">دو دارایی یکسان را انتخاب نکنید.</p>
          )}
          {!valid && amt > fromA.max && (
            <p className="text-center text-[11px] text-destructive">موجودی کافی نیست.</p>
          )}
      </div>
    </>
  );
}
