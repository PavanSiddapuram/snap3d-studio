import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, Coins } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { to: "/tools", label: "Tools" },
  { to: "/pricing", label: "Pricing" },
  { to: "/dashboard", label: "Dashboard" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });
  const transparent = path === "/" && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        transparent
          ? "bg-transparent"
          : "backdrop-blur-md bg-background/75 border-b border-border-subtle",
      )}
    >
      <div className="mx-auto max-w-7xl px-5 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-1.5 group">
          <span className="text-[17px] font-semibold tracking-tight">Snap3D</span>
          <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_12px_var(--accent)] transition-transform group-hover:scale-125" />
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => {
            const active = path.startsWith(l.to);
            return (
              <Link
                key={l.to}
                to={l.to}
                className={cn(
                  "px-3 py-1.5 text-sm rounded-md transition-colors",
                  active
                    ? "text-foreground bg-elevated"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <CreditPill credits={8} />
          <Link
            to="/dashboard"
            className="text-sm px-3.5 py-1.5 rounded-md bg-foreground text-background hover:bg-foreground/90 transition-colors active:scale-95"
          >
            Sign in
          </Link>
        </div>

        <button
          aria-label="Menu"
          onClick={() => setOpen((v) => !v)}
          className="md:hidden p-2 rounded-md hover:bg-elevated"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border-subtle bg-background/95 backdrop-blur-md animate-fade-in">
          <nav className="px-5 py-4 flex flex-col gap-1">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="px-3 py-2.5 text-base rounded-md text-muted-foreground hover:text-foreground hover:bg-elevated"
              >
                {l.label}
              </Link>
            ))}
            <div className="flex items-center justify-between pt-3 mt-2 border-t border-border-subtle">
              <CreditPill credits={8} />
              <Link
                to="/dashboard"
                onClick={() => setOpen(false)}
                className="text-sm px-4 py-2 rounded-md bg-foreground text-background"
              >
                Sign in
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

export function CreditPill({ credits }: { credits: number }) {
  const tone =
    credits > 5
      ? "text-success border-success/30 bg-success/10"
      : credits >= 2
        ? "text-warning border-warning/30 bg-warning/10"
        : "text-error border-error/30 bg-error/10";
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border font-medium tabular-nums",
        tone,
      )}
    >
      <Coins className="size-3.5" />
      {credits} credits
    </div>
  );
}
