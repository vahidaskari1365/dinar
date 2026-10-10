import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { getOrCreateWallet, err, summarize } from "@/lib/wallet-server";
import { convert, currentPrices } from "@/lib/prices";

export const dynamic = "force-dynamic";

const ASSETS = ["IRR", "USDT", "GOLD"] as const;
type Asset = (typeof ASSETS)[number];

function balOf(w: { irrBalance: number; usdtBalance: number; goldBalance: number }, a: Asset) {
  return a === "IRR" ? w.irrBalance : a === "USDT" ? w.usdtBalance : w.goldBalance;
}
function decOp(a: Asset, v: number) {
  return a === "IRR"
    ? { irrBalance: { decrement: v } }
    : a === "USDT"
      ? { usdtBalance: { decrement: v } }
      : { goldBalance: { decrement: v } };
}
function incOp(a: Asset, v: number) {
  return a === "IRR"
    ? { irrBalance: { increment: v } }
    : a === "USDT"
      ? { usdtBalance: { increment: v } }
      : { goldBalance: { increment: v } };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const from = String(body?.from) as Asset;
    const to = String(body?.to) as Asset;
    const amount = Number(body?.amount);

    if (!ASSETS.includes(from) || !ASSETS.includes(to))
      return err("دارایی نامعتبر است");
    if (from === to) return err("دو دارایی یکسان انتخاب شده است");
    if (!Number.isFinite(amount) || amount <= 0) return err("مقدار نامعتبر است");

    const prices = currentPrices();
    const result = convert(amount, from, to, prices);
    if (!Number.isFinite(result) || result <= 0) return err("محاسبه نرخ ناموفق بود");

    const wallet = await getOrCreateWallet();
    const available = balOf(wallet, from);
    if (available < amount) return err("موجودی کافی نیست");

    // Anti-float-dust: round outputs sensibly
    const out =
      to === "IRR"
        ? Math.round(result)
        : to === "GOLD"
          ? Math.round(result * 1000) / 1000
          : Math.round(result * 100) / 100;

    const updated = await db.wallet.update({
      where: { id: wallet.id },
      data: { ...decOp(from, amount), ...incOp(to, out) },
    });

    await db.transaction.create({
      data: {
        walletId: wallet.id,
        type: "exchange",
        asset: to,
        amount: out,
        meta: `تبدیل ${summarize("exchange", from, amount)}`,
      },
    });

    return Response.json({
      ok: true,
      summary: `${summarize("exchange", from, amount)} به ${summarize("exchange", to, out)} تبدیل شد`,
      wallet: {
        irr: updated.irrBalance,
        usdt: updated.usdtBalance,
        gold: updated.goldBalance,
      },
    });
  } catch (e) {
    console.error("POST /api/wallet/exchange", e);
    return err("خطا در تبدیل دارایی", 500);
  }
}
