import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { getOrCreateWallet, err, summarize } from "@/lib/wallet-server";
import { currentPrices } from "@/lib/prices";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const action = String(body?.action);
    const grams = Number(body?.grams);

    if (action !== "buy" && action !== "sell") return err("عملیات نامعتبر است");
    if (!Number.isFinite(grams) || grams <= 0) return err("مقدار گرم نامعتبر است");
    if (grams > 50) return err("سقف هر معامله دمو ۵۰ گرم است");

    const { gold } = currentPrices();
    const total = grams * gold;

    const wallet = await getOrCreateWallet();

    if (action === "buy") {
      if (wallet.irrBalance < total) return err("موجودی تومانی برای این خرید کافی نیست");

      const updated = await db.wallet.update({
        where: { id: wallet.id },
        data: {
          irrBalance: { decrement: total },
          goldBalance: { increment: Math.round(grams * 1000) / 1000 },
        },
      });
      await db.transaction.create({
        data: {
          walletId: wallet.id,
          type: "gold_buy",
          asset: "GOLD",
          amount: Math.round(grams * 1000) / 1000,
          meta: `خرید به نرخ ${new Intl.NumberFormat("fa-IR").format(gold)} تومان`,
        },
      });
      return Response.json({
        ok: true,
        summary: `${summarize("trade", "GOLD", grams)} به قیمت ${summarize("trade", "IRR", total)} خریداری شد`,
        wallet: {
          irr: updated.irrBalance,
          usdt: updated.usdtBalance,
          gold: updated.goldBalance,
        },
      });
    }

    // sell
    if (wallet.goldBalance < grams) return err("طلای کافی برای فروش ندارید");

    const updated = await db.wallet.update({
      where: { id: wallet.id },
      data: {
        goldBalance: { decrement: grams },
        irrBalance: { increment: Math.round(total) },
      },
    });
    await db.transaction.create({
      data: {
        walletId: wallet.id,
        type: "gold_sell",
        asset: "IRR",
        amount: Math.round(total),
        meta: `فروش ${new Intl.NumberFormat("fa-IR", { maximumFractionDigits: 3 }).format(grams)} گرم`,
      },
    });
    return Response.json({
      ok: true,
      summary: `${summarize("trade", "GOLD", grams)} فروخته شد و ${summarize("trade", "IRR", total)} واریز شد`,
      wallet: {
        irr: updated.irrBalance,
        usdt: updated.usdtBalance,
        gold: updated.goldBalance,
      },
    });
  } catch (e) {
    console.error("POST /api/wallet/gold", e);
    return err("خطا در معامله طلا", 500);
  }
}
