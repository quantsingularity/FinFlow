import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Logo } from "../brand/Logo";
import { ShieldCheck, Zap, TrendingUp } from "lucide-react";

const highlights = [
  { icon: Zap, text: "Move money and reconcile in real time" },
  { icon: TrendingUp, text: "Forecast cash flow with built-in analytics" },
  { icon: ShieldCheck, text: "Bank-grade security on every transaction" },
];

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-sidebar p-12 text-sidebar-foreground lg:flex">
        <div className="bg-grid pointer-events-none absolute inset-0 opacity-[0.07]" />
        <div className="bg-radial-fade pointer-events-none absolute inset-0" />
        <Link to="/" className="relative">
          <Logo className="text-sidebar-foreground" />
        </Link>
        <div className="relative space-y-8">
          <h2 className="max-w-md font-display text-3xl font-bold leading-tight tracking-tight">
            The financial operating system for modern businesses.
          </h2>
          <ul className="space-y-4">
            {highlights.map(({ icon: Icon, text }) => (
              <li
                key={text}
                className="flex items-center gap-3 text-sidebar-foreground/80"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-accent text-sidebar-primary">
                  <Icon className="h-4.5 w-4.5" />
                </span>
                <span className="text-sm">{text}</span>
              </li>
            ))}
          </ul>
        </div>
        <p className="relative text-xs text-sidebar-foreground/40">
          © {new Date().getFullYear()} FinFlow. All rights reserved.
        </p>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center bg-background px-6 py-12">
        <div className="w-full max-w-sm animate-fade-up">
          <Link to="/" className="mb-8 inline-flex lg:hidden">
            <Logo />
          </Link>
          {children}
        </div>
      </div>
    </div>
  );
}
