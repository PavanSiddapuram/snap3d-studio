import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { Menu, X, Coins, Command } from "lucide-react";
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
        "fixed inset-x-0 top-0 z-50 transition-[background,backdrop-filter,border-color] duration-500",
        transparent ? "bg-transparent" : "glass-strong",
      )}
    >
      <div className="mx-auto max-w-7xl px-5 lg:px-8 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group" aria-label="Snap3D home">
          <LogoMark />
          <span className="text-[15px] font-semibold tracking-tight">Snap3D</span>
        </Link>

        <LayoutGroup id="nav">
          <nav className="hidden md:flex items-center gap-0.5 p-1 rounded-full border border-border-subtle bg-card/40 backdrop-blur">
            {links.map((l) => {
              const active = path.startsWith(l.to);
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  className={cn(
                    "relative px-3.5 py-1.5 text-[13px] rounded-full transition-colors",
                    active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-active"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      className="absolute inset-0 rounded-full bg-elevated border border-border-subtle"
                    />
                  )}
                  <span className="relative">{l.label}</span>
                </Link>
              );
            })}
          </nav>
        </LayoutGroup>

        <div className="hidden md:flex items-center gap-2.5">
          <button
            aria-label="Search"
            className="hidden lg:inline-flex items-center gap-2 h-8 pl-2.5 pr-1.5 text-xs text-muted-foreground rounded-full border border-border-subtle bg-card/40 hover:bg-elevated transition-colors"
          >
            <span>Search</span>
            <kbd className="inline-flex items-center gap-0.5 px-1.5 h-5 rounded bg-elevated border border-border-subtle text-[10px] font-mono">
              <Command className="size-2.5" />K
            </kbd>
          </button>
          <CreditPill credits={8} />
          <Link
            to="/dashboard"
            className="text-[13px] font-medium px-3.5 h-8 inline-flex items-center rounded-full bg-foreground text-background hover:opacity-90 transition-opacity active:scale-[0.97]"
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

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-border-subtle glass-strong"
          >
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
                  className="text-sm px-4 py-2 rounded-full bg-foreground text-background"
                >
                  Sign in
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function LogoMark() {
  return (
    <span className="relative inline-flex size-7 items-center justify-center rounded-[8px] overflow-hidden">
      <span
        className="absolute inset-0"
        style={{
          background:
            "conic-gradient(from 200deg, oklch(0.55 0.22 277), oklch(0.6 0.22 250), oklch(0.55 0.22 290), oklch(0.55 0.22 277))",
        }}
      />
      <span className="absolute inset-px rounded-[7px] bg-background/40 backdrop-blur-sm" />
      <svg viewBox="0 0 24 24" className="relative size-3.5 text-foreground" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
        <path d="M12 2 3 7l9 5 9-5-9-5Z" />
        <path d="m3 17 9 5 9-5" opacity="0.7" />
        <path d="m3 12 9 5 9-5" opacity="0.85" />
      </svg>
    </span>
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
        "inline-flex items-center gap-1.5 text-[11px] px-2.5 h-8 rounded-full border font-medium tabular-nums",
        tone,
      )}
    >
      <Coins className="size-3.5" />
      {credits}
    </div>
  );
}
