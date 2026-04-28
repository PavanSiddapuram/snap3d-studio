import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
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
      <div className="mx-auto max-w-7xl px-5 lg:px-8 py-16 lg:py-24">
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-balance">
            Simple pricing for makers.
          </h1>
          <p className="mt-4 text-muted-foreground">
            Start free. Upgrade when you outgrow it. No hidden fees.
          </p>

          <div className="mt-8 inline-flex items-center gap-3 p-1 rounded-full bg-card border border-border-subtle">
            <button
              onClick={() => setAnnual(false)}
              className={cn(
                "px-4 py-1.5 text-sm rounded-full transition-colors",
                !annual ? "bg-elevated text-foreground" : "text-muted-foreground",
              )}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={cn(
                "px-4 py-1.5 text-sm rounded-full transition-colors inline-flex items-center gap-2",
                annual ? "bg-elevated text-foreground" : "text-muted-foreground",
              )}
            >
              Annual
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-success/15 text-success border border-success/30">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {PLANS.map((p) => (
            <div
              key={p.name}
              className={cn(
                "relative rounded-2xl border bg-card p-7 flex flex-col",
                p.highlight
                  ? "border-accent shadow-[0_0_0_1px_var(--accent),0_20px_60px_-20px_var(--accent-glow)] lg:scale-[1.02]"
                  : "border-border-subtle",
              )}
            >
              {p.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 text-[11px] uppercase tracking-wider rounded-full bg-accent text-accent-foreground font-medium">
                  Most Popular
                </span>
              )}
              <h3 className="text-lg font-semibold">{p.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{p.blurb}</p>

              <div className="mt-6 flex items-baseline gap-1.5">
                <span className="text-4xl font-semibold tracking-tight">
                  ₹{annual ? Math.round(p.annual / 12) : p.monthly}
                </span>
                <span className="text-sm text-muted-foreground">/month</span>
              </div>
              {annual && p.annual > 0 && (
                <p className="mt-1 text-xs text-muted-foreground">
                  Billed ₹{p.annual.toLocaleString("en-IN")} yearly
                </p>
              )}

              <Link
                to={p.href}
                className={cn(
                  "mt-6 inline-flex items-center justify-center h-11 rounded-xl text-sm font-medium transition-colors active:scale-95",
                  p.highlight
                    ? "bg-accent text-accent-foreground hover:bg-accent-hover"
                    : "border border-border bg-card hover:bg-elevated",
                )}
              >
                {p.cta}
              </Link>

              <ul className="mt-7 space-y-3 text-sm">
                {p.features.map((f) => (
                  <li key={f.label} className="flex items-start gap-2.5">
                    {f.included ? (
                      <Check className="size-4 text-success mt-0.5 shrink-0" />
                    ) : (
                      <Minus className="size-4 text-muted-foreground mt-0.5 shrink-0" />
                    )}
                    <span className={f.included ? "" : "text-muted-foreground line-through"}>
                      {f.label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold tracking-tight text-center">
            Frequently asked questions
          </h2>
          <div className="mt-8 divide-y divide-border-subtle border border-border-subtle rounded-2xl overflow-hidden bg-card">
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
      className="w-full text-left px-6 py-5 hover:bg-elevated/50 transition-colors"
    >
      <div className="flex items-center justify-between gap-4">
        <span className="font-medium">{q}</span>
        <span
          className={cn(
            "size-6 rounded-full border border-border-subtle flex items-center justify-center text-muted-foreground transition-transform",
            open && "rotate-45",
          )}
        >
          +
        </span>
      </div>
      {open && <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{a}</p>}
    </button>
  );
}
