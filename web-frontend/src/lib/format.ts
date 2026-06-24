// Formatting helpers for money, dates, and numbers.

export function formatCurrency(
  amount: number,
  currency = "USD",
  opts: Intl.NumberFormatOptions = {},
): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: (currency || "USD").toUpperCase(),
    maximumFractionDigits: 2,
    ...opts,
  }).format(Number.isFinite(amount) ? amount : 0);
}

export function formatCompactCurrency(
  amount: number,
  currency = "USD",
): string {
  return formatCurrency(amount, currency, {
    notation: "compact",
    maximumFractionDigits: 1,
  });
}

export function formatNumber(
  value: number,
  opts: Intl.NumberFormatOptions = {},
): string {
  return new Intl.NumberFormat("en-US", opts).format(
    Number.isFinite(value) ? value : 0,
  );
}

export function formatPercent(value: number, fractionDigits = 1): string {
  return `${value > 0 ? "+" : ""}${value.toFixed(fractionDigits)}%`;
}

export function formatDate(
  value: string | number | Date,
  opts?: Intl.DateTimeFormatOptions,
): string {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleDateString(
    "en-US",
    opts ?? { year: "numeric", month: "short", day: "numeric" },
  );
}

export function formatDateTime(value: string | number | Date): string {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });
}

export function formatRelative(value: string | number | Date): string {
  const d = new Date(value).getTime();
  if (Number.isNaN(d)) return "-";
  const diff = d - Date.now();
  const abs = Math.abs(diff);
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ["day", 86400000],
    ["hour", 3600000],
    ["minute", 60000],
    ["second", 1000],
  ];
  for (const [unit, ms] of units) {
    if (abs >= ms || unit === "second")
      return rtf.format(Math.round(diff / ms), unit);
  }
  return "just now";
}

export function initials(value: string): string {
  return value
    .split(/[\s@.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase() ?? "")
    .join("");
}
