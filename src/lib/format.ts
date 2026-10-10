/** Persian-first formatting helpers */

const fa = () => new Intl.NumberFormat("fa-IR", { useGrouping: true });

export function toFa(n: number, digits = 0): string {
  const s = new Intl.NumberFormat("fa-IR", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(n);
  return s;
}

export function faGroup(n: number): string {
  return fa().format(Math.round(n));
}

/** Compact Persian: ۱۲.۵ میلیون */
export function faCompact(n: number): string {
  if (n >= 1_000_000_000) return `${toFa(n / 1_000_000_000, 1)} میلیارد`;
  if (n >= 1_000_000) return `${toFa(n / 1_000_000, 1)} میلیون`;
  if (n >= 1000) return `${toFa(n / 1000, 1)} هزار`;
  return toFa(n);
}

export function faPercent(n: number, digits = 1): string {
  return `${toFa(n, digits)}٪`;
}

/** Relative time in Persian */
export function faTimeAgo(iso: string): string {
  const d = new Date(iso).getTime();
  const diff = Math.max(0, Date.now() - d);
  const m = Math.floor(diff / 60000);
  if (m < 1) return "همین حالا";
  if (m < 60) return `${toFa(m)} دقیقه پیش`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${toFa(h)} ساعت پیش`;
  return `${toFa(Math.floor(h / 24))} روز پیش`;
}

export function faDateTime(iso: string): string {
  return new Intl.DateTimeFormat("fa-IR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

export const ASSET_LABEL: Record<string, string> = {
  IRR: "تومان",
  USDT: "تتر",
  GOLD: "طلا (گرم)",
  USD: "دلار",
};
