import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { getOrCreateWallet, err, summarize } from "@/lib/wallet-server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const amount = Number(body?.amount);
    if (!Number.isFinite(amount) || amount <= 0)
      return err("مبلغ نامعتبر است");

    const wallet = await getOrCreateWallet();
    if (wallet.irrBalance < amount) return err("موجودی تومانی کافی نیست");

    const updated = await db.wallet.update({
      where: { id: wallet.id },
      data: { irrBalance: { decrement: amount } },
    });
    await db.transaction.create({
      data: {
        walletId: wallet.id,
        type: "withdraw",
        asset: "IRR",
        amount,
        meta: "انتقال به شبای ثبت‌شده (دمو)",
      },
    });

    return Response.json({
      ok: true,
      summary: `${summarize("withdraw", "IRR", amount)} برداشت شد`,
      balance: updated.irrBalance,
    });
  } catch (e) {
    console.error("POST /api/wallet/withdraw", e);
    return err("خطا در پردازش برداشت", 500);
  }
}
