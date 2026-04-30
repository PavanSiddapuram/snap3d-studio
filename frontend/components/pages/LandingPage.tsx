"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ImageIcon,
  Type,
  Wrench,
  Sparkles,
  Box,
  FileImage,
  Layers,
  Star,
  Trash2,
  Zap,
} from "lucide-react";
import { PageShell } from "@/components/PageShell";

export function LandingPage() {
  return (
    <PageShell>
      <Hero />
      <Marquee />
      <Features />
      <Showcase />
      <ToolsStrip />
      <BottomCTA />
    </PageShell>
  );
}

/* ---------------- Hero ---------------- */

function Hero() {
  return (
    <section className="relative overflow-hidden noise">
      <div aria-hidden className="aurora" />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 grid-bg opacity-[0.28] [mask-image:radial-gradient(ellipse_at_top,black,transparent_72%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[120vh]"
        style={{
          background:
            "radial-gradient(50% 40% at 50% 0%, oklch(0.85 0.15 250 / 0.3), transparent 70%)",
        }}
      />

      <div className="mx-auto max-w-7xl px-5 lg:px-8 pt-32 pb-16 lg:pt-40 lg:pb-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <Link
            href="/generate/image"
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border-subtle bg-card/60 backdrop-blur-md text-[11px] text-muted-foreground hover:border-accent/50 hover:text-foreground transition-colors group"
          >
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-accent/15 text-accent font-medium">
              <Sparkles className="size-3" /> New
            </span>
            <span>Pet-to-3D and Face-to-3D models are live</span>
            <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
          className="mt-7 text-balance text-[44px] sm:text-6xl lg:text-[80px] font-semibold tracking-[-0.04em] leading-[0.98]"
        >
          Anything you imagine.
          <br />
          <span className="bg-gradient-to-b from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent">
            Now in three dimensions.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 mx-auto text-[17px] sm:text-xl text-muted-foreground max-w-2xl leading-relaxed"
        >
          AI-powered generation, parametric tools, and instant downloads.
          From a single photo to a print-ready model — in seconds.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="mt-9 flex flex-wrap items-center justify-center gap-3"
        >
          <Link
            href="/generate/image"
            className="group relative inline-flex items-center gap-2 px-5 h-12 rounded-full bg-foreground text-background font-medium text-[14px] hover:opacity-90 transition-all active:scale-[0.97] shadow-[0_10px_40px_-10px_rgba(255,255,255,0.25)]"
          >
            Generate for Free
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="/tools"
            className="inline-flex items-center gap-2 px-5 h-12 rounded-full border border-border bg-card/40 backdrop-blur-md hover:bg-elevated transition-colors active:scale-[0.97] text-[14px]"
          >
            Explore Tools
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-6 inline-flex items-center gap-4 text-[12px] text-muted-foreground"
        >
          <span className="inline-flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-success animate-pulse" />
            10 free credits / month
          </span>
          <span className="size-0.5 rounded-full bg-border" />
          <span>No credit card</span>
          <span className="size-0.5 rounded-full bg-border" />
          <span>STL · GLB · OBJ</span>
        </motion.div>
      </div>

      <HeroGrid />
    </section>
  );
}

const HERO_TILES = [
  { hue: 264, label: "Dragon",     sub: "Text-to-3D",    img: "/assets/dragon.png" },
  { hue: 200, label: "Lithophane", sub: "Photo tool",    img: "/assets/lithopane.png" },
  { hue: 290, label: "Vase",       sub: "Generator",     img: "/assets/vase.png" },
  { hue: 220, label: "Pet",        sub: "Image-to-3D",   img: "/assets/pet.png" },
  { hue: 277, label: "Featured",   sub: "Snap3D pick",   img: "/assets/featured.png", featured: true },
  { hue: 250, label: "Name Plate", sub: "Custom",        img: "/assets/name-plate.png" },
  { hue: 310, label: "Bust",       sub: "Face-to-3D",    img: "/assets/bust.png" },
  { hue: 240, label: "House",      sub: "Architectural", img: "/assets/house.png" },
  { hue: 270, label: "Tag",        sub: "Personalised",  img: "/assets/tag.png" },
];

function HeroGrid() {
  return (
    <div className="relative pb-16 sm:pb-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-10 bottom-0 -z-10"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 50%, oklch(0.90 0.10 270 / 0.5), transparent 70%)",
        }}
      />
      {/* perspective reduced on mobile so the tilt doesn't clip */}
      <div className="mx-auto max-w-5xl px-4 sm:px-5 lg:px-8 perspective-[600px] sm:perspective-distant lg:perspective-[1600px]">
        <motion.div
          initial={{ opacity: 0, rotateX: 14, y: 32 }}
          animate={{ opacity: 1, rotateX: 6, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3 lg:gap-4 transform-3d"
        >
          {HERO_TILES.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.04, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -5, scale: 1.02, rotateX: 5, rotateY: -5 }}
              /* hide last 3 tiles on mobile — 6 tiles fill a 2-col grid cleanly */
              className={`group relative aspect-square rounded-xl sm:rounded-2xl border border-border-subtle bg-card overflow-hidden transition-shadow hover:shadow-[0_20px_60px_-20px_oklch(0.55_0.22_${t.hue}_/_0.4)] ${i >= 6 ? "hidden sm:block" : ""} ${t.featured ? "ring-conic" : ""}`}
            >
              {/* Photo layer — tinted by gradient overlay */}
              {t.img ? (
                <Image
                  src={t.img}
                  alt={t.label}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, 33vw"
                />
              ) : (
                <div className="absolute inset-0 bg-muted/20" />
              )}
              {/* Light gradient overlay — keeps brand colour & bright aesthetic */}
              {!t.img && (
                <div
                  className="absolute inset-0"
                  style={{
                    background: `radial-gradient(circle at 50% 35%, oklch(0.90 0.10 ${t.hue} / 0.4), transparent 65%), linear-gradient(160deg, oklch(0.98 0.02 ${t.hue} / 0.6), transparent)`,
                  }}
                />
              )}
              <div className="absolute inset-0 grid-bg opacity-15" />
              {!t.img && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    className="size-1/2 rounded-full blur-2xl opacity-60"
                    style={{
                      background: `radial-gradient(circle, oklch(0.78 0.22 ${t.hue}), transparent 70%)`,
                    }}
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 4 + i * 0.3, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <Box
                    className="absolute size-8 sm:size-10 lg:size-12 text-foreground/70 drop-shadow-sm transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6"
                    strokeWidth={1.2}
                  />
                </div>
              )}
              <div className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5">
                {t.featured && (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[9px] uppercase tracking-wider rounded-full bg-foreground/90 text-background font-semibold">
                    <Star className="size-2.5 fill-current" /> Pick
                  </span>
                )}
              </div>
              <div className="absolute bottom-0 inset-x-0 px-2.5 py-2 sm:px-3 sm:py-2.5 bg-linear-to-t from-background/90 via-background/50 to-transparent">
                <div className="text-[10px] sm:text-[11px] font-medium text-foreground truncate">{t.label}</div>
                <div className="text-[9px] sm:text-[10px] text-muted-foreground truncate">{t.sub}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

/* ---------------- Marquee ---------------- */

function Marquee() {
  const items = [
    "Maker Studio",
    "Etsy Shops",
    "FormLabs Users",
    "Bambu Lab",
    "Prusa Community",
    "Indie Designers",
    "School Labs",
    "Hardware Startups",
  ];
  return (
    <section className="border-y border-border-subtle bg-background py-10 overflow-hidden">
      <p className="text-center text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-6">
        Built for creators who ship
      </p>
      <div className="relative mask-[linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]">
        <div className="marquee-track gap-12 pr-12">
          {[...items, ...items].map((it, i) => (
            <span
              key={i}
              className="text-lg sm:text-2xl font-semibold tracking-tight text-muted-foreground/60 whitespace-nowrap"
            >
              {it}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Features (bento) ---------------- */

function Features() {
  return (
    <section className="mx-auto max-w-7xl px-5 lg:px-8 py-24 lg:py-32">
      <div className="max-w-2xl">
        <p className="text-[11px] uppercase tracking-[0.2em] text-accent font-medium">Capabilities</p>
        <h2 className="mt-4 text-4xl sm:text-5xl font-semibold tracking-tight text-balance">
          Everything you need to make things real.
        </h2>
        <p className="mt-4 text-muted-foreground text-lg max-w-xl leading-relaxed">
          From AI generation to print-ready utilities — all in one place, all crafted for makers.
        </p>
      </div>

      <div className="mt-12 grid gap-4 lg:grid-cols-3 lg:grid-rows-2 lg:auto-rows-[260px]">
        {/* Feature 1 — wide */}
        <BentoCard className="lg:col-span-2 lg:row-span-1" hue={277}>
          <div className="relative z-10">
            <FeatureBadge icon={ImageIcon} />
            <h3 className="mt-5 text-2xl font-semibold tracking-tight">Image to 3D</h3>
            <p className="mt-2 text-sm text-muted-foreground max-w-md leading-relaxed">
              Upload a single photo and get a fully textured 3D model in under 30 seconds.
              PBR materials. Print-ready geometry.
            </p>
          </div>
          <div aria-hidden className="absolute right-0 bottom-0 w-1/2 h-full pointer-events-none">
            <div
              className="absolute inset-0 opacity-60"
              style={{
                background:
                  "radial-gradient(60% 60% at 70% 60%, oklch(0.85 0.15 277 / 0.6), transparent 65%)",
              }}
            />
            <Box
              className="absolute right-12 bottom-10 size-32 text-foreground/15 -rotate-12"
              strokeWidth={1}
            />
          </div>
        </BentoCard>

        {/* Feature 2 */}
        <BentoCard hue={290}>
          <FeatureBadge icon={Type} />
          <h3 className="mt-5 text-2xl font-semibold tracking-tight">Text to 3D</h3>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            Describe what you want and watch the geometry appear.
          </p>
          <div aria-hidden className="mt-5 rounded-lg border border-border-subtle bg-elevated/40 p-3 font-mono text-[11px] text-muted-foreground">
            <span className="text-success">$</span> &ldquo;a low-poly fox sitting&rdquo;
            <span className="ml-1 inline-block w-1.5 h-3 bg-foreground/60 align-middle animate-pulse" />
          </div>
        </BentoCard>

        {/* Feature 3 */}
        <BentoCard hue={250}>
          <FeatureBadge icon={Zap} />
          <h3 className="mt-5 text-2xl font-semibold tracking-tight">Sub-30s render</h3>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            Distributed GPU pipeline. Watch your idea materialise in real time.
          </p>
        </BentoCard>

        {/* Feature 4 — wide */}
        <BentoCard className="lg:col-span-2" hue={200}>
          <div className="relative z-10">
            <FeatureBadge icon={Wrench} />
            <h3 className="mt-5 text-2xl font-semibold tracking-tight">Free Tools Suite</h3>
            <p className="mt-2 text-sm text-muted-foreground max-w-md leading-relaxed">
              Lithophanes, vases, format converters and more. No account required.
              Parametric generators and utilities, all built in.
            </p>
            <Link
              href="/tools"
              className="mt-5 inline-flex items-center gap-1.5 text-sm text-accent hover:gap-2 transition-all"
            >
              Browse all tools <ArrowRight className="size-3.5" />
            </Link>
          </div>
          <div aria-hidden className="absolute right-6 top-1/2 -translate-y-1/2 grid grid-cols-2 gap-2 opacity-60 pointer-events-none">
            {[FileImage, Trash2, Layers, Wrench].map((Icon, i) => (
              <div
                key={i}
                className="size-14 rounded-lg border border-border-subtle bg-elevated/60 backdrop-blur flex items-center justify-center"
                style={{ transform: `rotate(${(i - 1.5) * 4}deg)` }}
              >
                <Icon className="size-5 text-muted-foreground" />
              </div>
            ))}
          </div>
        </BentoCard>
      </div>
    </section>
  );
}

function BentoCard({
  children,
  className = "",
  hue,
}: {
  children: React.ReactNode;
  className?: string;
  hue: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`relative overflow-hidden rounded-3xl border border-border-subtle bg-card p-7 noise transition-all hover:border-border ${className}`}
    >
      <div
        aria-hidden
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          background: `radial-gradient(120% 80% at 0% 0%, oklch(0.85 0.15 ${hue} / 0.4), transparent 60%)`,
        }}
      />
      {children}
    </motion.div>
  );
}

function FeatureBadge({ icon: Icon }: { icon: typeof ImageIcon }) {
  return (
    <div className="inline-flex size-10 items-center justify-center rounded-xl bg-accent/15 text-accent border border-accent/20">
      <Icon className="size-5" />
    </div>
  );
}

/* ---------------- Showcase strip ---------------- */

function Showcase() {
  return (
    <section className="mx-auto max-w-7xl px-5 lg:px-8 py-24">
      <div className="relative overflow-hidden rounded-3xl border border-border-subtle bg-card noise">
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(60% 60% at 80% 0%, oklch(0.85 0.15 277 / 0.4), transparent 60%), radial-gradient(50% 60% at 0% 100%, oklch(0.80 0.15 250 / 0.3), transparent 65%)",
          }}
        />
        <div className="grid gap-10 lg:grid-cols-2 p-8 lg:p-14">
          <div className="relative z-10">
            <p className="text-[11px] uppercase tracking-[0.2em] text-accent font-medium">Workflow</p>
            <h2 className="mt-4 text-3xl sm:text-4xl font-semibold tracking-tight text-balance">
              From idea to print, in three steps.
            </h2>
            <ol className="mt-8 space-y-5">
              {[
                { n: "01", t: "Upload or describe", d: "Drop a photo or write a one-line prompt." },
                { n: "02", t: "AI generates the mesh", d: "Watch the model build itself in seconds, with PBR textures." },
                { n: "03", t: "Download & print", d: "Export STL, GLB or OBJ — slice and print immediately." },
              ].map((s) => (
                <li key={s.n} className="flex gap-4">
                  <span className="font-mono text-xs text-accent mt-1 tabular-nums">{s.n}</span>
                  <div>
                    <p className="font-medium">{s.t}</p>
                    <p className="text-sm text-muted-foreground mt-1">{s.d}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <div className="relative aspect-square lg:aspect-auto rounded-2xl border border-border-subtle bg-background/60 overflow-hidden">
            <div className="absolute inset-0 grid-bg opacity-40" />
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                animate={{ rotateY: 360 }}
                transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
                className="size-48 transform-3d"
                style={{
                  background:
                    "radial-gradient(circle at 30% 30%, oklch(0.9 0.15 277), oklch(0.8 0.15 290) 60%, oklch(0.95 0.05 280))",
                  borderRadius: "30%",
                  boxShadow:
                    "0 30px 80px -20px oklch(0.7 0.15 277 / 0.3), inset -20px -30px 60px oklch(0.9 0.05 280 / 0.6)",
                }}
              />
            </div>
            <div className="absolute bottom-3 left-3 text-[10px] font-mono text-muted-foreground bg-background/60 backdrop-blur px-2 py-1 rounded">
              482K verts · PBR · GLB
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Tools strip ---------------- */

function ToolsStrip() {
  const tools = [
    { name: "Lithophane",       icon: FileImage, img: "/assets/lithopane-maker.png", desc: "Photo to printable lithophane" },
    { name: "3D Text",          icon: Type,      img: "/assets/3d-text-tool.png", desc: "Custom 3D lettering" },
    { name: "Vase Maker",       icon: Box,       img: "/assets/vase-maker.png", desc: "Parametric vases" },
    { name: "Bin & Tray",       icon: Trash2,    img: "/assets/bin-tray-generator.png", desc: "Custom storage bins" },
    { name: "G-code Viewer",    icon: Wrench,    img: "/assets/g-code-viewer.png", desc: "Inspect toolpaths" },
    { name: "Format Converter", icon: Sparkles,  desc: "STL ⇄ GLB ⇄ OBJ" },
  ];
  return (
    <section className="border-y border-border-subtle">
      <div className="mx-auto max-w-7xl px-5 lg:px-8 py-20">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-accent font-medium">Free forever</p>
            <h2 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight">Tools, ready to use.</h2>
            <p className="mt-2 text-muted-foreground">No signup. No credits. Just build.</p>
          </div>
          <Link
            href="/tools"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground link-underline self-start sm:self-end"
          >
            View all tools <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {tools.map((t) => (
            <Link
              key={t.name}
              href="/tools"
              className="group rounded-2xl border border-border-subtle bg-card p-4 hover:border-accent/40 transition-all hover:-translate-y-0.5"
            >
              <div className="aspect-video rounded-lg bg-elevated border border-border-subtle relative overflow-hidden group-hover:border-accent/30 transition-all">
                <div className="absolute inset-0 grid-bg opacity-50" />
                {t.img ? (
                  <Image src={t.img} alt={t.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 640px) 50vw, 16vw" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <t.icon className="size-7 text-muted-foreground group-hover:text-accent group-hover:scale-110 transition-all duration-300" />
                  </div>
                )}
              </div>
              <h4 className="mt-3 text-sm font-medium">{t.name}</h4>
              <p className="text-xs text-muted-foreground">{t.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Bottom CTA ---------------- */

function BottomCTA() {
  return (
    <section className="mx-auto max-w-7xl px-5 lg:px-8 pb-24">
      <div className="relative overflow-hidden rounded-4xl border border-border-subtle bg-card p-10 sm:p-20 text-center noise">
        <div aria-hidden className="aurora opacity-60" />
        <div
          aria-hidden
          className="absolute inset-0 grid-bg opacity-25 mask-[radial-gradient(ellipse_at_center,black,transparent_70%)]"
        />
        <div className="relative">
          <h2 className="text-4xl sm:text-6xl font-semibold tracking-[-0.03em] text-balance leading-[1.05]">
            Start creating.
            <br />
            <span className="text-muted-foreground">It&apos;s free.</span>
          </h2>
          <p className="mt-6 text-muted-foreground max-w-md mx-auto text-[15px] leading-relaxed">
            Ten generations every month, on the house. Upgrade only when you outgrow it.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/generate/image"
              className="inline-flex items-center gap-2 px-6 h-12 rounded-full bg-foreground text-background font-medium hover:opacity-90 transition-opacity active:scale-[0.97] shadow-[0_10px_40px_-10px_rgba(255,255,255,0.3)]"
            >
              Generate your first model <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center px-6 h-12 rounded-full border border-border bg-card/40 backdrop-blur hover:bg-elevated transition-colors active:scale-[0.97]"
            >
              See pricing
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
