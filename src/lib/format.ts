const usd0 = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export const formatUsd = (n: number) => usd0.format(n);

export function formatUsdCompact(n: number) {
  if (Math.abs(n) >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (Math.abs(n) >= 1_000) return `$${(n / 1_000).toFixed(n >= 10_000 ? 0 : 1)}k`;
  return `$${Math.round(n)}`;
}

export const formatPct = (n: number, digits = 0) => `${(n * 100).toFixed(digits)}%`;

export function formatSigned(n: number, digits = 0) {
  const v = (n * 100).toFixed(digits);
  return `${n > 0 ? "+" : ""}${v}%`;
}

export function formatRelative(iso: string, now = Date.now()) {
  const mins = Math.max(0, Math.round((now - new Date(iso).getTime()) / 60_000));
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.round(mins / 60);
  return hours < 24 ? `${hours} h ago` : `${Math.round(hours / 24)} d ago`;
}

export function formatAsOf(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
}
