import { Badge } from "../ui/badge";
import { cn } from "../../lib/utils";

const TONES: Record<string, string> = {
  PAID: "border-success/30 bg-success/10 text-success",
  COMPLETED: "border-success/30 bg-success/10 text-success",
  ACTIVE: "border-success/30 bg-success/10 text-success",
  APPROVED: "border-success/30 bg-success/10 text-success",
  PENDING: "border-warning/30 bg-warning/10 text-warning",
  PROCESSING: "border-info/30 bg-info/10 text-info",
  OVERDUE: "border-destructive/30 bg-destructive/10 text-destructive",
  FAILED: "border-destructive/30 bg-destructive/10 text-destructive",
  CANCELLED: "border-muted-foreground/30 bg-muted text-muted-foreground",
  REFUNDED: "border-muted-foreground/30 bg-muted text-muted-foreground",
  REJECTED: "border-destructive/30 bg-destructive/10 text-destructive",
};

export function StatusBadge({ status }: { status: string }) {
  const key = (status || "").toUpperCase();
  return (
    <Badge
      variant="outline"
      className={cn(
        "font-medium capitalize",
        TONES[key] ?? "border-border bg-muted text-muted-foreground",
      )}
    >
      {status?.toLowerCase()}
    </Badge>
  );
}
