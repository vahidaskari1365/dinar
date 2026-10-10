import { currentPrices } from "@/lib/prices";

export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json(currentPrices());
}
