import { priceHistory, currentPrices } from "@/lib/prices";

export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json({
    history: priceHistory(48, 60_000),
    current: currentPrices(),
  });
}
