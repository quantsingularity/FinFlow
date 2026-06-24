import { cn } from "../../lib/utils";
import { formatCurrency } from "../../lib/format";

export function Money({
  amount,
  currency = "USD",
  className,
  signed = false,
}: {
  amount: number;
  currency?: string;
  className?: string;
  signed?: boolean;
}) {
  const tone = signed ? (amount < 0 ? "text-destructive" : "text-success") : "";
  return (
    <span className={cn("tabular tabular-nums", tone, className)}>
      {signed && amount > 0 ? "+" : ""}
      {formatCurrency(amount, currency)}
    </span>
  );
}
