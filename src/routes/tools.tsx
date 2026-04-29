import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion, LayoutGroup } from "framer-motion";
import {
  Search,
  ImageIcon,
  Type,
  PawPrint,
  User,
  FileImage,
  Square,
  Tag,
  Box,
  Trash2,
  Eye,
  RefreshCw,
  Code,
  Calculator,
  Coins,
  IndianRupee,
  Clock,
  Layers,
  Zap,
  Maximize,
  ArrowUpRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/tools")({
  head: () => ({
    meta: [
      { title: "Free 3D Printing Tools — Snap3D" },
      {
        name: "description",
        content:
          "Lithophanes, vases, calculators, converters and AI generators. No account required.",
      },
      { property: "og:title", content: "Free 3D Printing Tools — Snap3D" },
      {
        property: "og:description",
        content: "A complete free toolbox for makers and 3D printing enthusiasts.",
      },
    ],
  }),
  component: ToolsIndex,
});

type Tool = {
  name: string;
  desc: string;
  icon: typeof Box;
  category: "AI Generation" | "Generators" | "Utilities" | "Calculators";
  paid?: boolean;
  href: string;
};

const TOOLS: Tool[] = [
  { name: "Image to 3D", desc: "Photo to textured 3D mesh", icon: ImageIcon, category: "AI Generation", paid: true, href: "/generate/image" },
  { name: "Text to 3D", desc: "Describe and generate", icon: Type, category: "AI Generation", paid: true, href: "/generate/text" },
  { name: "Pet to 3D", desc: "Turn your pet into a figurine", icon: PawPrint, category: "AI Generation", paid: true, href: "/generate/image" },
  { name: "Face to 3D", desc: "Realistic 3D bust from a selfie", icon: User, category: "AI Generation", paid: true, href: "/generate/image" },
  { name: "Lithophane", desc: "Photo to printable lithophane", icon: FileImage, category: "Generators", href: "/tools/lithophane" },
  { name: "3D Text", desc: "Custom 3D lettering", icon: Type, category: "Generators", href: "/tools/lithophane" },
  { name: "Name Sign", desc: "Standing name signs", icon: Tag, category: "Generators", href: "/tools/lithophane" },
  { name: "Name Plate", desc: "Door and desk plates", icon: Square, category: "Generators", href: "/tools/lithophane" },
  { name: "Vase", desc: "Parametric vase generator", icon: Box, category: "Generators", href: "/tools/lithophane" },
  { name: "Bin & Tray", desc: "Custom storage bins", icon: Trash2, category: "Generators", href: "/tools/lithophane" },
  { name: "3D Viewer", desc: "Inspect STL/GLB/OBJ", icon: Eye, category: "Utilities", href: "/tools/lithophane" },
  { name: "Format Converter", desc: "STL ⇄ GLB ⇄ OBJ", icon: RefreshCw, category: "Utilities", href: "/tools/lithophane" },
  { name: "G-code Viewer", desc: "Inspect toolpaths", icon: Code, category: "Utilities", href: "/tools/lithophane" },
  { name: "Print Cost", desc: "Filament cost calculator", icon: Calculator, category: "Calculators", href: "/tools/etsy-profit" },
  { name: "Resin Cost", desc: "SLA resin estimator", icon: IndianRupee, category: "Calculators", href: "/tools/etsy-profit" },
  { name: "Etsy Profit", desc: "Pricing & fees calculator", icon: Coins, category: "Calculators", href: "/tools/etsy-profit" },
  { name: "Print Time", desc: "Estimate job duration", icon: Clock, category: "Calculators", href: "/tools/etsy-profit" },
  { name: "Filament Spool", desc: "Track remaining filament", icon: Layers, category: "Calculators", href: "/tools/etsy-profit" },
  { name: "Layer Height", desc: "Quality vs speed tradeoff", icon: Layers, category: "Calculators", href: "/tools/etsy-profit" },
  { name: "E-Steps", desc: "Calibrate extruder steps", icon: Zap, category: "Calculators", href: "/tools/etsy-profit" },
  { name: "Shrinkage", desc: "Compensate for material shrink", icon: Maximize, category: "Calculators", href: "/tools/etsy-profit" },
];

const CATEGORIES = ["All", "AI Generation", "Generators", "Utilities", "Calculators"] as const;

function ToolsIndex() {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<(typeof CATEGORIES)[number]>("All");

  const filtered = useMemo(() => {
    return TOOLS.filter(
      (t) =>
        (cat === "All" || t.category === cat) &&
        (query === "" || t.name.toLowerCase().includes(query.toLowerCase())),
    );
  }, [query, cat]);

  return (
    <PageShell>
    <div className="relative mx-auto max-w-7xl px-5 lg:px-8 py-16 lg:py-20">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[40vh]"
        style={{
          background:
            "radial-gradient(50% 50% at 50% 0%, oklch(0.55 0.22 277 / 0.08), transparent 70%)",
        }}
      />
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-accent font-medium">Toolbox</p>
          <h1 className="mt-3 text-4xl sm:text-5xl font-semibold tracking-[-0.03em] text-balance">
            Free tools for makers.
          </h1>
          <p className="mt-3 text-muted-foreground text-[15px]">
            Twenty-plus utilities. No account, no credits — just build.
          </p>
        </div>
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tools…"
            className="w-full pl-10 pr-3 h-11 rounded-full bg-card border border-border-subtle focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all text-sm placeholder:text-muted-foreground"
          />
        </div>
      </div>

      <div className="mt-10 -mx-5 lg:mx-0 px-5 lg:px-0 overflow-x-auto">
        <LayoutGroup id="tools-tabs">
          <div className="inline-flex gap-1 p-1 rounded-full bg-card border border-border-subtle">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={cn(
                  "relative px-4 py-1.5 text-sm rounded-full transition-colors whitespace-nowrap",
                  cat === c ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {cat === c && (
                  <motion.span
                    layoutId="tool-cat-active"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    className="absolute inset-0 rounded-full bg-elevated border border-border-subtle"
                  />
                )}
                <span className="relative">{c}</span>
              </button>
            ))}
          </div>
        </LayoutGroup>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: Math.min(i, 8) * 0.03, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link
              to={t.href}
              className="group block relative overflow-hidden rounded-2xl border border-border-subtle bg-card p-5 transition-all hover:border-accent/40 hover:-translate-y-0.5 noise"
            >
              <div
                aria-hidden
                className="absolute -top-12 -right-12 size-32 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl"
                style={{ background: "oklch(0.55 0.22 277 / 0.3)" }}
              />
              <div className="relative flex items-start justify-between">
                <div className="size-11 rounded-xl bg-elevated border border-border-subtle flex items-center justify-center group-hover:border-accent/40 group-hover:bg-accent/10 transition-colors">
                  <t.icon className="size-5 text-muted-foreground group-hover:text-accent transition-colors" />
                </div>
                <span
                  className={cn(
                    "text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border font-medium",
                    t.paid
                      ? "text-accent border-accent/40 bg-accent/10"
                      : "text-success border-success/40 bg-success/10",
                  )}
                >
                  {t.paid ? "Credits" : "Free"}
                </span>
              </div>
              <h3 className="relative mt-5 text-base font-semibold flex items-center gap-1.5">
                {t.name}
                <ArrowUpRight className="size-3.5 text-muted-foreground opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </h3>
              <p className="relative mt-1 text-sm text-muted-foreground">{t.desc}</p>
            </Link>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="mt-16 text-center text-muted-foreground">
          <p>No tools match "{query}".</p>
        </div>
      )}
    </div>
    </PageShell>
  );
}
