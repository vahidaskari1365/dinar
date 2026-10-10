import { db } from "@/lib/db";
import { getOrCreateWallet, err } from "@/lib/wallet-server";

export const dynamic = "force-dynamic";

const CARD_FEE = 120_000;

export async function POST() {
  try {
    const wallet = await getOrCreateWallet();
    if (wallet.irrBalance < CARD_FEE)
      return err(`موجودی برای کارمصد صدور کافی نیست (۱۲۰,۰۰۰ تومان)`);

    // Deterministic-looking but unique virtual card number
    const bin = "6037";
    const rnd = () => String(Math.floor(1000 + Math.random() * 9000));
    const number = `${bin} ${rnd()} ${rnd()} ${rnd()}`;

    const now = new Date();
    const expYear = now.getFullYear() + 4;
    const expMonth = now.getMonth() + 1;

    const [updated, card] = await db.$transaction([
      db.wallet.update({
        where: { id: wallet.id },
        data: { irrBalance: { decrement: CARD_FEE } },
      }),
      db.card.create({
        data: {
          walletId: wallet.id,
          number,
          expMonth,
          expYear,
          status: "active",
        },
      }),
    ]);

    await db.transaction.create({
      data: {
        walletId: wallet.id,
        type: "card_issue",
        asset: "IRR",
        amount: CARD_FEE,
        meta: `صدور کارت مجازی ${number.slice(-4)}`,
      },
    });

    return Response.json({
      ok: true,
      summary: `کارت مجازی با شماره ${number} صادر شد`,
      card,
      balance: updated.irrBalance,
    });
  } catch (e) {
    console.error("POST /api/wallet/card", e);
    return err("خطا در صدور کارت", 500);
  }
}
