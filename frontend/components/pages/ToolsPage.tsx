"use client";

import Image from "next/image";
import Link from "next/link";
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
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PageShell } from "@/components/PageShell";

type Tool = {
  name: string;
  desc: string;
  category: string;
  icon: typeof Box;
  img?: string;
  paid?: boolean;
  pick?: boolean;
  href: string;
  hue: number;
};

const TOOLS: Tool[] = [
  { name: "Image to 3D",      desc: "Photo to textured 3D mesh",      icon: ImageIcon, category: "AI Generation", paid: true,                  href: "/generate/image",    hue: 277 },
  { name: "Text to 3D",       desc: "Describe and generate",           icon: Type,      category: "AI Generation", paid: true,                  href: "/generate/text",     hue: 250 },
  { name: "Pet to 3D",        desc: "Turn your pet into a figurine",   icon: PawPrint,  img: "/assets/pet.png", category: "AI Generation", paid: true, pick: true,       href: "/generate/image",    hue: 200 },
  { name: "Face to 3D",       desc: "Realistic 3D bust from a selfie", icon: User,      img: "/assets/bust.png", category: "AI Generation", paid: true,                  href: "/generate/image",    hue: 160 },
  { name: "Lithophane",       desc: "Photo to printable lithophane",   icon: FileImage, img: "/assets/lithopane-maker.png", category: "Generators",                                  href: "/tools/lithophane",  hue: 175 },
  { name: "3D Text",          desc: "Custom 3D lettering",             icon: Type,      img: "/assets/3d-text-tool.png", category: "Generators",                                  href: "/tools/lithophane",  hue: 300 },
  { name: "Name Sign",        desc: "Standing name signs",             icon: Tag,       category: "Generators",                                  href: "/tools/lithophane",  hue: 320 },
  { name: "Name Plate",       desc: "Door and desk plates",            icon: Square,    img: "/assets/name-plate.png", category: "Generators",                                  href: "/tools/lithophane",  hue: 220 },
  { name: "Vase",             desc: "Parametric vase generator",       icon: Box,       img: "/assets/vase-maker.png", category: "Generators",                                  href: "/tools/lithophane",  hue: 180 },
  { name: "Bin & Tray",       desc: "Custom storage bins",             icon: Trash2,    img: "/assets/bin-tray-generator.png", category: "Generators",                                  href: "/tools/lithophane",  hue: 260 },
  { name: "3D Viewer",        desc: "Inspect STL / GLB / OBJ",         icon: Eye,       category: "Utilities",                                   href: "/tools/lithophane",  hue: 240 },
  { name: "Format Converter", desc: "STL ⇄ GLB ⇄ OBJ",                icon: RefreshCw, category: "Utilities",                                   href: "/tools/lithophane",  hue: 290 },
  { name: "G-code Viewer",    desc: "Inspect toolpaths",               icon: Code,      img: "/assets/g-code-viewer.png", category: "Utilities",                                   href: "/tools/lithophane",  hue: 210 },
];

const CATEGORIES = ["All", "AI Generation", "Generators", "Utilities"] as const;

export function ToolsPage() {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<(typeof CATEGORIES)[number]>("All");

  const filtered = useMemo(
    () =>
      TOOLS.filter(
        (t) =>
          (cat === "All" || t.category === cat) &&
          (query === "" || t.name.toLowerCase().includes(query.toLowerCase())),
      ),
    [query, cat],
  );

  return (
    <PageShell>
      <div className="relative mx-auto max-w-7xl px-4 sm:px-5 lg:px-8 py-12 lg:py-16">
        {/* Page glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[35vh]"
          style={{
            background:
              "radial-gradient(50% 50% at 50% 0%, oklch(0.55 0.22 277 / 0.08), transparent 70%)",
          }}
        />

        {/* Header row */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-accent font-medium">Toolbox</p>
            <h1 className="mt-2 text-3xl sm:text-4xl font-semibold tracking-[-0.03em]">
              Free tools for makers.
            </h1>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search tools…"
              className="w-full pl-10 pr-4 h-10 rounded-full bg-card border border-border-subtle focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all text-sm placeholder:text-muted-foreground"
            />
          </div>
        </div>

        {/* Category filter */}
        <div className="mt-7">
          <LayoutGroup id="tools-tabs">
            <div className="inline-flex flex-wrap gap-1 p-1 rounded-full bg-card border border-border-subtle">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCat(c)}
                  className={cn(
                    "relative px-3.5 py-1.5 text-sm rounded-full transition-colors",
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

        {/* Tool grid */}
        <div className="mt-7 grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
          {filtered.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: Math.min(i, 10) * 0.03, ease: [0.16, 1, 0.3, 1] }}
            >
              <ToolCard tool={t} />
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="mt-20 text-center text-muted-foreground text-sm">
            No tools match &ldquo;{query}&rdquo;
          </div>
        )}
      </div>
    </PageShell>
  );
}

function ToolCard({ tool: t }: { tool: Tool }) {
  return (
    <Link
      href={t.href}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/[0.06] aspect-[4/3] transition-all duration-300 hover:-translate-y-1 hover:border-white/10 hover:shadow-[0_20px_60px_-20px_rgba(0,0,0,0.5)]"
    >
      {/* Dark base */}
      <div
        className="absolute inset-0"
        style={{ background: "oklch(0.11 0.015 277)" }}
      />
      {/* Per-card gradient glow */}
      <div
        className="absolute inset-0 transition-opacity duration-300 group-hover:opacity-130"
        style={{
          background: `radial-gradient(60% 65% at 50% 15%, oklch(0.5 0.2 ${t.hue} / 0.38), transparent 70%)`,
        }}
      />
      {/* Subtle grid */}
      <div className="absolute inset-0 grid-bg opacity-20" />

      {/* PICK badge */}
      {t.pick && (
        <div className="absolute top-3 left-3 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-background/60 backdrop-blur border border-border-subtle text-[10px] font-medium">
          <Sparkles className="size-2.5 text-warning" />
          PICK
        </div>
      )}

      {/* Arrow */}
      <div className="absolute top-3 right-3 size-7 rounded-full bg-background/40 border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 -translate-x-1 group-hover:translate-x-0">
        <ArrowUpRight className="size-3.5 text-foreground" />
      </div>

      {/* Centered icon or image */}
      <div className="flex-1 flex items-center justify-center relative overflow-hidden">
        {t.img ? (
          <Image src={t.img} alt={t.name} fill className="object-cover transition-transform duration-300 group-hover:scale-105" sizes="(max-width: 640px) 50vw, 25vw" />
        ) : (
          <div
            className="size-12 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
            style={{ border: `1px solid oklch(0.55 0.18 ${t.hue} / 0.3)` }}
          >
            <t.icon
              className="size-6"
              style={{ color: `oklch(0.78 0.14 ${t.hue})` }}
            />
          </div>
        )}
      </div>

      {/* Bottom info */}
      <div className="relative px-4 pb-4 pt-0">
        <div className="flex items-end justify-between gap-2">
          <div className="min-w-0">
            <h3 className="text-sm font-semibold truncate">{t.name}</h3>
            <p className="text-[11px] text-muted-foreground truncate">{t.desc}</p>
          </div>
          <span
            className={cn(
              "shrink-0 text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-full border font-medium",
              t.paid
                ? "text-accent border-accent/40 bg-accent/10"
                : "text-success border-success/40 bg-success/10",
            )}
          >
            {t.paid ? "Credits" : "Free"}
          </span>
        </div>
      </div>
    </Link>
  );
}
