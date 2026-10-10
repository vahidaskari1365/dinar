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
    if (amount > 5_000_000_000) return err("سقف واریز دمو ۵ میلیارد تومان است");

    const wallet = await getOrCreateWallet();
    const updated = await db.wallet.update({
      where: { id: wallet.id },
      data: { irrBalance: { increment: amount } },
    });
    await db.transaction.create({
      data: {
        walletId: wallet.id,
        type: "deposit",
        asset: "IRR",
        amount,
        meta: "درگاه پرداخت (دمو)",
      },
    });

    return Response.json({
      ok: true,
      summary: `${summarize("deposit", "IRR", amount)} به کیف پول شما اضافه شد`,
      balance: updated.irrBalance,
    });
  } catch (e) {
    console.error("POST /api/wallet/deposit", e);
    return err("خطا در پردازش واریز", 500);
  }
}
