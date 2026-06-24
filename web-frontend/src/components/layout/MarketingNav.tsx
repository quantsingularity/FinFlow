import { Link } from "react-router-dom";
import { Logo } from "../brand/Logo";
import { Button } from "../ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { useAppSelector } from "../../store/hooks";

export function MarketingNav() {
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link to="/">
          <Logo />
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex">
          <a
            href="#features"
            className="transition-colors hover:text-foreground"
          >
            Product
          </a>
          <a
            href="#metrics"
            className="transition-colors hover:text-foreground"
          >
            Why FinFlow
          </a>
          <a href="#cta" className="transition-colors hover:text-foreground">
            Pricing
          </a>
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {isAuthenticated ? (
            <Button asChild>
              <Link to="/dashboard">Go to dashboard</Link>
            </Button>
          ) : (
            <>
              <Button asChild variant="ghost" className="hidden sm:inline-flex">
                <Link to="/login">Sign in</Link>
              </Button>
              <Button asChild>
                <Link to="/register">Get started</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
