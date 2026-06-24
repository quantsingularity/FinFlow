import { cn } from "../../lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={cn("h-7 w-7", className)}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="ff-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="hsl(243 78% 64%)" />
          <stop offset="100%" stopColor="hsl(199 89% 52%)" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="9" fill="url(#ff-grad)" />
      <path d="M11 22V10h10v3h-6.5v2.6H20v3h-5.5V22H11z" fill="white" />
    </svg>
  );
}

export function Logo({
  className,
  withWordmark = true,
}: {
  className?: string;
  withWordmark?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <LogoMark />
      {withWordmark && (
        <span className="font-display text-lg font-bold tracking-tight">
          FinFlow
        </span>
      )}
    </span>
  );
}
