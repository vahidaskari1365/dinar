import { db } from "@/lib/db";

const OWNER = "demo-user";

/** Single demo wallet — created with friendly seed data on first touch. */
export async function getOrCreateWallet() {
  const existing = await db.wallet.findUnique({
    where: { owner: OWNER },
    include: { cards: true },
  });
  if (existing) return existing;

  const wallet = await db.wallet.create({
    data: {
      owner: OWNER,
      irrBalance: 24_850_000,
      usdtBalance: 172.5,
      goldBalance: 1.32,
    },
  });

  await db.transaction.createMany({
    data: [
      {
        walletId: wallet.id,
        type: "deposit",
        asset: "IRR",
        amount: 10_000_000,
        meta: "درگاه پرداخت (دمو)",
      },
      {
        walletId: wallet.id,
        type: "gold_buy",
        asset: "GOLD",
        amount: 1.32,
        meta: "خرید از بازار طلا",
      },
      {
        walletId: wallet.id,
        type: "exchange",
        asset: "USDT",
        amount: 172.5,
        meta: "تبدیل تومان به تتر",
      },
    ],
  });

  return wallet;
}

export function err(message: string, status = 400) {
  return Response.json({ error: message }, { status });
}

export function summarize(type: string, asset: string, amount: number): string {
  const fmt =
    asset === "IRR"
      ? `${new Intl.NumberFormat("fa-IR").format(Math.round(amount))} تومان`
      : asset === "USDT"
        ? `${new Intl.NumberFormat("fa-IR", { maximumFractionDigits: 2 }).format(amount)} تتر`
        : `${new Intl.NumberFormat("fa-IR", { maximumFractionDigits: 3 }).format(amount)} گرم طلا`;
  return fmt;
}
