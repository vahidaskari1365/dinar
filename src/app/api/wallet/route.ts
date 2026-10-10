import { db } from "@/lib/db";
import { getOrCreateWallet, err } from "@/lib/wallet-server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const wallet = await getOrCreateWallet();
    const [transactions, cards] = await Promise.all([
      db.transaction.findMany({
        where: { walletId: wallet.id },
        orderBy: { createdAt: "desc" },
        take: 30,
      }),
      db.card.findMany({
        where: { walletId: wallet.id },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    return Response.json({
      wallet: {
        irr: wallet.irrBalance,
        usdt: wallet.usdtBalance,
        gold: wallet.goldBalance,
      },
      transactions,
      cards,
    });
  } catch (e) {
    console.error("GET /api/wallet", e);
    return err("خطا در دریافت کیف پول", 500);
  }
}
