import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — Snap3D" },
      {
        name: "description",
        content: "Free, Starter, and Pro plans for AI 3D model generation. Cancel anytime.",
      },
      { property: "og:title", content: "Pricing — Snap3D" },
      {
        property: "og:description",
        content: "Simple, transparent pricing for makers and pros.",
      },
    ],
  }),
  component: Pricing,
});

type Plan = {
  name: string;
  monthly: number;
  annual: number;
  blurb: string;
  cta: string;
  href: string;
  highlight?: boolean;
  features: { label: string; included: boolean }[];
};

const PLANS: Plan[] = [
  {
    name: "Free",
    monthly: 0,
    annual: 0,
    blurb: "Perfect for trying things out.",
    cta: "Get Started Free",
    href: "/dashboard",
    features: [
      { label: "10 generations / month", included: true },
      { label: "All free tools", included: true },
      { label: "STL & GLB export", included: true },
      { label: "1024³ quality models", included: false },
      { label: "Priority queue", included: false },
      { label: "API access", included: false },
    ],
  },
  {
    name: "Starter",
    monthly: 499,
    annual: 4790,
    blurb: "For active makers.",
    cta: "Start Starter",
    href: "/dashboard",
    highlight: true,
    features: [
      { label: "150 generations / month", included: true },
      { label: "All free tools", included: true },
      { label: "STL, GLB & OBJ export", included: true },
      { label: "1024³ quality models", included: true },
      { label: "Priority queue", included: true },
      { label: "API access", included: false },
    ],
  },
  {
    name: "Pro",
    monthly: 1499,
    annual: 14390,
    blurb: "For studios and businesses.",
    cta: "Go Pro",
    href: "/dashboard",
    features: [
      { label: "600 generations / month", included: true },
      { label: "All free tools", included: true },
      { label: "All export formats", included: true },
      { label: "1024³ quality models", included: true },
      { label: "Priority queue", included: true },
      { label: "API access", included: true },
    ],
  },
];

const FAQ = [
  {
    q: "What counts as one generation?",
    a: "Every successful 3D model output (image-to-3D, text-to-3D, etc.) consumes one credit. 1024³ models cost two credits.",
  },
  { q: "Can I cancel anytime?", a: "Yes. Cancellation is instant and you keep access until the end of your billing period." },
  { q: "Do unused credits roll over?", a: "Credits reset each month so generators keep building. Pro users can purchase top-up packs." },
  { q: "What file formats do I get?", a: "STL and GLB on every plan. Starter and Pro also unlock OBJ and PBR texture exports." },
  { q: "Is there a refund policy?", a: "We refund within 7 days of purchase if you haven't used more than 10 credits." },
  { q: "Can I use generated models commercially?", a: "Yes — full commercial rights on all paid plans for content you create." },
];

function Pricing() {
  const [annual, setAnnual] = useState(false);
  return (
    <PageShell>
      <div className="relative mx-auto max-w-7xl px-5 lg:px-8 py-20 lg:py-28">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[60vh]"
          style={{
            background:
              "radial-gradient(50% 50% at 50% 0%, oklch(0.55 0.22 277 / 0.12), transparent 70%)",
          }}
        />
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-[11px] uppercase tracking-[0.2em] text-accent font-medium">Pricing</p>
          <h1 className="mt-4 text-5xl sm:text-6xl font-semibold tracking-[-0.035em] text-balance leading-[1.02]">
            Simple pricing for makers.
          </h1>
          <p className="mt-5 text-muted-foreground text-[15px]">
            Start free. Upgrade when you outgrow it. No hidden fees.
          </p>

          <div className="mt-9 inline-flex items-center gap-1 p-1 rounded-full bg-card border border-border-subtle relative">
            {(["Monthly", "Annual"] as const).map((label, i) => {
              const isAnnual = i === 1;
              const active = annual === isAnnual;
              return (
                <button
                  key={label}
                  onClick={() => setAnnual(isAnnual)}
                  className={cn(
                    "relative px-5 py-1.5 text-sm rounded-full transition-colors inline-flex items-center gap-2 z-10",
                    active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="price-toggle"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                      className="absolute inset-0 rounded-full bg-elevated border border-border-subtle"
                    />
                  )}
                  <span className="relative">{label}</span>
                  {isAnnual && (
                    <span className="relative text-[10px] px-1.5 py-0.5 rounded-full bg-success/15 text-success border border-success/30">
                      −20%
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {PLANS.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className={cn(
                "relative rounded-3xl border bg-card p-7 flex flex-col noise",
                p.highlight
                  ? "border-accent/60 shadow-[0_0_0_1px_var(--accent),0_30px_80px_-30px_var(--accent-glow)] lg:scale-[1.03]"
                  : "border-border-subtle",
              )}
            >
              {p.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 text-[10px] uppercase tracking-[0.15em] rounded-full bg-accent text-accent-foreground font-semibold shadow-[0_8px_30px_-8px_var(--accent)]">
                  Most Popular
                </span>
              )}
              <h3 className="text-lg font-semibold">{p.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{p.blurb}</p>

              <div className="mt-6 flex items-baseline gap-1.5">
                <span className="text-5xl font-semibold tracking-[-0.03em] tabular-nums">
                  ₹{annual ? Math.round(p.annual / 12) : p.monthly}
                </span>
                <span className="text-sm text-muted-foreground">/month</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground h-4">
                {annual && p.annual > 0
                  ? `Billed ₹${p.annual.toLocaleString("en-IN")} yearly`
                  : ""}
              </p>

              <Link
                to={p.href}
                className={cn(
                  "mt-6 inline-flex items-center justify-center h-11 rounded-full text-sm font-medium transition-all active:scale-[0.97]",
                  p.highlight
                    ? "bg-accent text-accent-foreground hover:bg-accent-hover shadow-[0_8px_30px_-8px_var(--accent)]"
                    : "border border-border bg-card hover:bg-elevated",
                )}
              >
                {p.cta}
              </Link>

              <ul className="mt-7 space-y-3 text-sm">
                {p.features.map((f) => (
                  <li key={f.label} className="flex items-start gap-2.5">
                    {f.included ? (
                      <span className="size-4 rounded-full bg-accent/15 text-accent flex items-center justify-center mt-0.5 shrink-0">
                        <Check className="size-2.5" strokeWidth={3} />
                      </span>
                    ) : (
                      <span className="size-4 rounded-full border border-border-subtle flex items-center justify-center mt-0.5 shrink-0">
                        <Minus className="size-2.5 text-muted-foreground" />
                      </span>
                    )}
                    <span className={f.included ? "" : "text-muted-foreground/60"}>
                      {f.label}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <div className="mt-24 max-w-3xl mx-auto">
          <div className="text-center">
            <p className="text-[11px] uppercase tracking-[0.2em] text-accent font-medium">FAQ</p>
            <h2 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-[-0.025em]">
              Frequently asked questions
            </h2>
          </div>
          <div className="mt-10 divide-y divide-border-subtle border border-border-subtle rounded-3xl overflow-hidden bg-card noise">
            {FAQ.map((item, i) => (
              <FaqItem key={i} q={item.q} a={item.a} />
            ))}
          </div>
        </div>
      </div>
    </PageShell>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <button
      onClick={() => setOpen((v) => !v)}
      className="w-full text-left px-6 py-5 hover:bg-elevated/40 transition-colors"
    >
      <div className="flex items-center justify-between gap-4">
        <span className="font-medium text-[15px]">{q}</span>
        <span
          className={cn(
            "size-7 rounded-full border border-border-subtle flex items-center justify-center text-muted-foreground transition-transform shrink-0",
            open && "rotate-45 bg-accent/10 text-accent border-accent/30",
          )}
        >
          +
        </span>
      </div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.p
            initial={{ height: 0, opacity: 0, marginTop: 0 }}
            animate={{ height: "auto", opacity: 1, marginTop: 12 }}
            exit={{ height: 0, opacity: 0, marginTop: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="text-sm text-muted-foreground leading-relaxed overflow-hidden"
          >
            {a}
          </motion.p>
        )}
      </AnimatePresence>
    </button>
  );
}
