/** Deterministic market simulation — smooth random-walk prices shared by all clients. */

function hash(n: number): number {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

/** Smooth value noise in [-1, 1] */
function smoothNoise(t: number, bucketMs: number, seed: number): number {
  const i = Math.floor(t / bucketMs);
  const f = (t % bucketMs) / bucketMs;
  const a = hash(i * 1.618 + seed) * 2 - 1;
  const b = hash((i + 1) * 1.618 + seed) * 2 - 1;
  const u = f * f * (3 - 2 * f);
  return a + (b - a) * u;
}

export type Prices = {
  gold: number; // toman / gram 18k
  goldChange: number; // % vs 24h-ish baseline
  usdt: number; // toman / USDT
  usd: number; // toman / USD
  t: number;
};

export function currentPrices(): Prices {
  const t = Date.now();
  const gN = smoothNoise(t, 240_000, 17) * 0.022 + smoothNoise(t, 47_000, 91) * 0.007;
  const uN = smoothNoise(t, 240_000, 43) * 0.014 + smoothNoise(t, 47_000, 77) * 0.005;
  const gold = Math.round((8_150_000 * (1 + gN)) / 1000) * 1000;
  const usdt = Math.round(108_500 * (1 + uN));
  const usd = Math.round(usdt * 1.007);
  return {
    gold,
    goldChange: Math.round(gN * 10000) / 100,
    usdt,
    usd,
    t,
  };
}

export function priceHistory(points: number, stepMs: number): number[] {
  const now = Date.now();
  const out: number[] = [];
  for (let i = points - 1; i >= 0; i--) {
    const t = now - i * stepMs;
    const gN =
      smoothNoise(t, 240_000, 17) * 0.022 + smoothNoise(t, 47_000, 91) * 0.007;
    out.push(Math.round((8_150_000 * (1 + gN)) / 1000) * 1000);
  }
  return out;
}

/** Conversion math between IRR / USDT / GOLD at market prices (with spread). */
export function convert(
  amount: number,
  from: "IRR" | "USDT" | "GOLD",
  to: "IRR" | "USDT" | "GOLD",
  p: Prices
): number {
  if (from === to) return amount;
  const SPREAD = 0.006; // 0.6% transparent spread
  const toToman = (a: number, f: string) =>
    f === "IRR" ? a : f === "USDT" ? a * p.usdt : a * p.gold;
  const fromToman = (v: number, t: string) =>
    t === "IRR" ? v : t === "USDT" ? v / p.usdt : v / p.gold;
  return fromToman(toToman(amount, from) * (1 - SPREAD), to);
}
