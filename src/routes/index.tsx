import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ImageIcon,
  Type,
  Wrench,
  Sparkles,
  Box,
  FileImage,
  Calculator,
} from "lucide-react";
import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Snap3D — Turn Any Photo or Idea Into a 3D Model" },
      {
        name: "description",
        content:
          "AI-powered 3D model generation, free parametric tools, and instant downloads. No CAD skills needed.",
      },
      { property: "og:title", content: "Snap3D — Turn Any Photo or Idea Into a 3D Model" },
      {
        property: "og:description",
        content: "AI generation plus a free toolbox for makers. STL, GLB, OBJ.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <PageShell>
      <Hero />
      <Features />
      <ToolsStrip />
      <SocialProof />
      <BottomCTA />
    </PageShell>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* ambient gradient */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 0%, rgba(79,70,229,0.18), transparent 70%), radial-gradient(40% 40% at 80% 30%, rgba(79,70,229,0.10), transparent 70%)",
        }}
      />
      <div className="absolute inset-0 -z-10 grid-bg opacity-[0.35] [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />

      <div className="mx-auto max-w-7xl px-5 lg:px-8 pt-28 pb-20 lg:pt-36 lg:pb-28">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border-subtle bg-card/60 text-xs text-muted-foreground">
            <Sparkles className="size-3.5 text-accent" />
            <span>New · Pet-to-3D and Face-to-3D models</span>
          </div>
          <h1 className="mt-6 text-balance text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.05]">
            Turn Any Photo or Idea
            <br />
            <span className="bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              Into a 3D Model
            </span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl leading-relaxed">
            AI-powered generation, free parametric tools, and instant downloads. No CAD skills
            needed.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              to="/generate/image"
              className="group inline-flex items-center gap-2 px-5 h-12 rounded-xl bg-accent text-accent-foreground font-medium hover:bg-accent-hover transition-colors active:scale-95 shadow-[0_8px_30px_-8px_var(--accent)]"
            >
              Generate for Free
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              to="/tools"
              className="inline-flex items-center gap-2 px-5 h-12 rounded-xl border border-border bg-card/40 hover:bg-elevated transition-colors active:scale-95"
            >
              Browse Tools
            </Link>
          </div>
          <p className="mt-5 text-xs text-muted-foreground">
            10 free credits monthly · No credit card · Export STL, GLB, OBJ
          </p>
        </motion.div>

        <HeroGrid />
      </div>
    </section>
  );
}

const HERO_TILES = [
  { hue: 264, label: "Dragon · Text-to-3D" },
  { hue: 200, label: "Lithophane · Tool" },
  { hue: 290, label: "Vase · Generator" },
  { hue: 220, label: "Pet · Image-to-3D" },
  { hue: 280, label: "Gear · Mechanical" },
  { hue: 250, label: "Name Plate" },
  { hue: 310, label: "Face · Bust" },
  { hue: 240, label: "House · Model" },
  { hue: 270, label: "Custom Tag" },
];

function HeroGrid() {
  return (
    <div className="mt-16 lg:mt-20 grid grid-cols-3 gap-3 sm:gap-4 max-w-3xl mx-auto perspective-[1200px]">
      {HERO_TILES.map((t, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 18, rotate: 0 }}
          animate={{
            opacity: 1,
            y: 0,
            rotate: (i % 3) - 1,
          }}
          transition={{ delay: 0.15 + i * 0.05, duration: 0.5, ease: "easeOut" }}
          whileHover={{ y: -4, rotate: 0 }}
          className="group relative aspect-square rounded-xl border border-border-subtle bg-card overflow-hidden glow-on-hover"
        >
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(circle at 50% 40%, oklch(0.6 0.22 ${t.hue} / 0.55), transparent 65%), linear-gradient(135deg, oklch(0.2 0.05 ${t.hue}), oklch(0.13 0.02 280))`,
            }}
          />
          <div className="absolute inset-0 grid-bg opacity-30" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="size-1/2 rounded-full blur-2xl opacity-70"
              style={{
                background: `radial-gradient(circle, oklch(0.7 0.22 ${t.hue}), transparent 70%)`,
              }}
            />
            <Box className="absolute size-10 text-foreground/80 drop-shadow-lg" strokeWidth={1.4} />
          </div>
          <div className="absolute bottom-0 inset-x-0 px-3 py-2 text-[10px] sm:text-xs text-muted-foreground bg-gradient-to-t from-background/90 to-transparent">
            {t.label}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function Features() {
  const items = [
    {
      icon: ImageIcon,
      title: "Image to 3D",
      desc: "Upload a single photo and get a textured 3D model in under 30 seconds.",
    },
    {
      icon: Type,
      title: "Text to 3D",
      desc: "Describe what you want in plain words and watch the geometry appear.",
    },
    {
      icon: Wrench,
      title: "Free Tools Suite",
      desc: "Lithophanes, vases, calculators and converters — no account required.",
    },
  ];
  return (
    <section className="mx-auto max-w-7xl px-5 lg:px-8 py-20">
      <div className="max-w-2xl">
        <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">
          Everything you need to make things real.
        </h2>
        <p className="mt-3 text-muted-foreground">
          From AI generation to print-ready utilities, all in one place.
        </p>
      </div>
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {items.map((it) => (
          <div
            key={it.title}
            className="gradient-border rounded-2xl p-6 glow-on-hover bg-card"
          >
            <div className="size-10 rounded-lg bg-accent/15 text-accent flex items-center justify-center">
              <it.icon className="size-5" />
            </div>
            <h3 className="mt-5 text-lg font-semibold">{it.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{it.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function ToolsStrip() {
  const tools = [
    { name: "Lithophane", icon: FileImage, desc: "Photo to printable lithophane" },
    { name: "3D Text", icon: Type, desc: "Custom 3D lettering" },
    { name: "Vase Maker", icon: Box, desc: "Parametric vases" },
    { name: "Print Cost", icon: Calculator, desc: "Filament cost estimator" },
    { name: "G-code Viewer", icon: Wrench, desc: "Inspect toolpaths" },
    { name: "Format Converter", icon: Sparkles, desc: "STL ⇄ GLB ⇄ OBJ" },
  ];
  return (
    <section className="border-y border-border-subtle bg-card/30">
      <div className="mx-auto max-w-7xl px-5 lg:px-8 py-16">
        <div className="flex items-end justify-between gap-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">Free tools, ready to use</h2>
            <p className="mt-2 text-sm text-muted-foreground">No signup. No credits. Just build.</p>
          </div>
          <Link
            to="/tools"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            View all tools <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="mt-8 -mx-5 lg:mx-0 px-5 lg:px-0 overflow-x-auto">
          <div className="flex gap-4 min-w-max lg:min-w-0 lg:grid lg:grid-cols-6">
            {tools.map((t) => (
              <Link
                key={t.name}
                to="/tools"
                className="group w-56 lg:w-auto shrink-0 rounded-xl border border-border-subtle bg-card p-4 hover:border-accent/40 transition-colors"
              >
                <div className="aspect-video rounded-lg bg-elevated border border-border-subtle relative overflow-hidden">
                  <div className="absolute inset-0 grid-bg opacity-50" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <t.icon className="size-7 text-muted-foreground group-hover:text-accent transition-colors" />
                  </div>
                </div>
                <h4 className="mt-3 text-sm font-medium">{t.name}</h4>
                <p className="text-xs text-muted-foreground">{t.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function SocialProof() {
  const quotes = [
    { name: "Aarav · Maker", q: "Cut my prototype turnaround from days to minutes." },
    { name: "Lena · Etsy seller", q: "The lithophane tool alone is worth bookmarking." },
    { name: "Mike · Hobbyist", q: "Finally a 3D tool that doesn't require a CAD degree." },
  ];
  return (
    <section className="mx-auto max-w-7xl px-5 lg:px-8 py-20">
      <p className="text-xs uppercase tracking-wider text-muted-foreground text-center">
        Trusted by makers worldwide
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {quotes.map((q) => (
          <figure
            key={q.name}
            className="rounded-2xl border border-border-subtle bg-card p-6"
          >
            <blockquote className="text-foreground/90 leading-relaxed">"{q.q}"</blockquote>
            <figcaption className="mt-4 text-xs text-muted-foreground">{q.name}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

function BottomCTA() {
  return (
    <section className="mx-auto max-w-7xl px-5 lg:px-8 pb-24">
      <div
        className="relative overflow-hidden rounded-3xl border border-border-subtle bg-card p-10 sm:p-16 text-center"
        style={{
          background:
            "radial-gradient(60% 80% at 0% 100%, rgba(79,70,229,0.18), transparent 60%), radial-gradient(60% 80% at 100% 0%, rgba(79,70,229,0.16), transparent 60%), var(--card)",
        }}
      >
        <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-balance">
          Start creating for free.
        </h2>
        <p className="mt-4 text-muted-foreground max-w-lg mx-auto">
          Ten generations every month, on the house. Upgrade only when you outgrow it.
        </p>
        <div className="mt-8 inline-flex">
          <Link
            to="/generate/image"
            className="inline-flex items-center gap-2 px-6 h-12 rounded-xl bg-accent text-accent-foreground font-medium hover:bg-accent-hover transition-colors active:scale-95 shadow-[0_10px_40px_-10px_var(--accent)]"
          >
            Generate your first model <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
