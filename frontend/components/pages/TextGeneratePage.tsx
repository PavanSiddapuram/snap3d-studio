"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { Suspense, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Coins,
  Maximize2,
  Orbit,
  RotateCcw,
  Download,
  Sparkles,
  Wand2,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const ModelViewer = dynamic(() => import("@/components/ModelViewer"), { ssr: false });

type Status = "idle" | "loading" | "complete";

const STAGES = [
  "Understanding prompt…",
  "Synthesising geometry…",
  "Applying textures…",
  "Finalising mesh…",
];

type Style = "Realistic" | "Cartoon" | "Mechanical" | "Organic";

const STYLES: { label: Style; desc: string; hue: number }[] = [
  { label: "Realistic",   desc: "Photorealistic PBR",    hue: 277 },
  { label: "Cartoon",     desc: "Stylised low-poly",     hue: 200 },
  { label: "Mechanical",  desc: "Hard-surface & metal",  hue: 220 },
  { label: "Organic",     desc: "Flowing natural forms", hue: 290 },
];

const EXAMPLE_PROMPTS = [
  "a small dragon sitting on a rock",
  "a low-poly fox curled up sleeping",
  "a detailed medieval castle tower",
  "a cute robot with round eyes",
  "a bonsai tree with twisted trunk",
];

export function TextGeneratePage() {
  const [prompt, setPrompt]         = useState("");
  const [style, setStyle]           = useState<Style>("Realistic");
  const [resolution, setResolution] = useState<"512" | "1024">("1024");
  const [status, setStatus]         = useState<Status>("idle");
  const [stageIdx, setStageIdx]     = useState(0);

  const generate = () => {
    if (!prompt.trim()) { toast.error("Write a prompt first"); return; }
    setStatus("loading");
    setStageIdx(0);
    toast("Job queued");
    let i = 0;
    const t = setInterval(() => {
      i += 1;
      if (i >= STAGES.length) { clearInterval(t); setStatus("complete"); toast.success("Model ready!"); return; }
      setStageIdx(i);
    }, 1600);
  };

  return (
    <div className="mx-auto max-w-7xl px-5 lg:px-8 py-8">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,45fr)_minmax(0,55fr)] lg:min-h-[calc(100vh-8rem)]">

        {/* ── LEFT controls ── */}
        <div className="space-y-5">
          <div>
            <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="size-4" /> Back
            </Link>
            <h1 className="mt-4 text-2xl font-semibold tracking-tight">Text to 3D</h1>
            <p className="mt-1 text-sm text-muted-foreground">Describe what you want. AI builds the geometry.</p>
          </div>

          {/* Prompt textarea */}
          <div className="rounded-2xl border border-border-subtle bg-card overflow-hidden">
            <div className="px-4 pt-4 pb-2 flex items-center justify-between">
              <span className="text-sm font-semibold">Prompt</span>
              <span className="text-[11px] text-muted-foreground tabular-nums">{prompt.length} / 300</span>
            </div>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value.slice(0, 300))}
              placeholder="a small dragon figurine sitting on a rock…"
              rows={4}
              className="w-full resize-none bg-transparent px-4 pb-3 text-sm placeholder:text-muted-foreground/60 focus:outline-none leading-relaxed"
            />
            {/* Example chips */}
            <div className="px-4 pb-3.5 flex flex-wrap gap-1.5 border-t border-border-subtle pt-2.5">
              {EXAMPLE_PROMPTS.map((p) => (
                <button
                  key={p}
                  onClick={() => setPrompt(p)}
                  className="text-[11px] px-2.5 py-1 rounded-full border border-border-subtle bg-elevated/60 text-muted-foreground hover:text-foreground hover:border-accent/40 transition-colors"
                >
                  {p.length > 30 ? p.slice(0, 28) + "…" : p}
                </button>
              ))}
            </div>
          </div>

          {/* Style picker */}
          <div className="rounded-2xl border border-border-subtle bg-card p-5 space-y-3">
            <h3 className="text-sm font-semibold">Style</h3>
            <div className="grid grid-cols-2 gap-2">
              {STYLES.map((s) => (
                <button
                  key={s.label}
                  onClick={() => setStyle(s.label)}
                  className={cn(
                    "relative rounded-xl border p-3.5 text-left transition-all overflow-hidden",
                    style === s.label
                      ? "border-accent/60 bg-accent/8"
                      : "border-border-subtle bg-elevated/40 hover:border-border",
                  )}
                >
                  {style === s.label && (
                    <div
                      aria-hidden
                      className="absolute inset-0 opacity-25 pointer-events-none"
                      style={{ background: `radial-gradient(80% 80% at 0% 0%, oklch(0.55 0.22 ${s.hue} / 0.6), transparent 70%)` }}
                    />
                  )}
                  <div className="relative flex items-center justify-between mb-0.5">
                    <span className="text-sm font-medium">{s.label}</span>
                    {style === s.label && (
                      <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="size-4 rounded-full bg-accent flex items-center justify-center">
                        <svg className="size-2.5 text-white" viewBox="0 0 10 10" fill="none">
                          <path d="M2 5l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </motion.span>
                    )}
                  </div>
                  <span className="relative text-[11px] text-muted-foreground">{s.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Resolution */}
          <div className="rounded-2xl border border-border-subtle bg-card p-5 space-y-3">
            <h3 className="text-sm font-semibold">Resolution</h3>
            <div className="inline-flex p-1 rounded-lg bg-elevated border border-border-subtle w-full">
              {(["512", "1024"] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setResolution(r)}
                  className={cn(
                    "flex-1 px-3 py-2 rounded-md text-xs transition-colors text-center",
                    resolution === r
                      ? "bg-accent text-accent-foreground font-medium"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {r}³ &nbsp;·&nbsp; {r === "512" ? "1 credit · Fast" : "2 credits · Quality"}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Coins className="size-4 text-warning" /> Credits remaining: <b className="text-foreground">8</b>
            </span>
          </div>

          <button
            onClick={generate}
            disabled={status === "loading"}
            className={cn(
              "w-full h-12 rounded-full bg-foreground text-background font-medium hover:opacity-90 transition-opacity active:scale-[0.98] inline-flex items-center justify-center gap-2 shadow-[0_10px_40px_-10px_rgba(255,255,255,0.25)] disabled:opacity-70",
              status === "loading" && "animate-pulse-glow",
            )}
          >
            {status === "loading" ? <><Spinner size="sm" /> Generating…</> : <><Wand2 className="size-4" /> Generate 3D Model</>}
          </button>
          <p className="text-xs text-muted-foreground text-center">~30 seconds · PBR textured output</p>
        </div>

        {/* ── RIGHT viewer ── */}
        <div className="relative rounded-2xl border border-border-subtle bg-card overflow-hidden min-h-[420px] lg:min-h-0">
          <AnimatePresence mode="wait">
            {status === "idle" && (
              <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                <div className="absolute inset-0 grid-bg opacity-25" />
                <div className="relative">
                  <div className="size-20 rounded-2xl flex items-center justify-center border border-border-subtle bg-elevated/60">
                    <Sparkles className="size-7 text-muted-foreground" />
                  </div>
                  <div className="absolute -inset-4 rounded-3xl blur-3xl opacity-20 bg-accent" />
                </div>
                <p className="relative text-sm text-muted-foreground">Your model will appear here</p>
              </motion.div>
            )}

            {status === "loading" && (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center gap-6">
                <div className="relative"><Spinner size="lg" /></div>
                <div className="text-center">
                  <p className="text-sm font-medium">{STAGES[stageIdx]}</p>
                  <p className="mt-1 text-xs text-muted-foreground">Stage {stageIdx + 1} of {STAGES.length}</p>
                </div>
                <div className="absolute bottom-0 inset-x-0 h-1 bg-elevated overflow-hidden">
                  <motion.div className="h-full bg-accent" initial={{ width: "0%" }}
                    animate={{ width: `${((stageIdx + 1) / STAGES.length) * 100}%` }}
                    transition={{ duration: 1.4, ease: "easeOut" }} />
                </div>
              </motion.div>
            )}

            {status === "complete" && (
              <motion.div key="complete" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0">
                <Suspense fallback={<div className="absolute inset-0 flex items-center justify-center"><Spinner size="lg" /></div>}>
                  <ModelViewer />
                </Suspense>
                <div className="absolute top-3 right-3 flex gap-1.5">
                  {[Orbit, RotateCcw, Maximize2].map((Icon, i) => (
                    <button key={i} className="size-9 rounded-lg bg-background/70 backdrop-blur border border-border-subtle hover:bg-elevated transition-colors flex items-center justify-center">
                      <Icon className="size-4" />
                    </button>
                  ))}
                </div>
                <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-background/70 backdrop-blur border border-border-subtle text-[11px]">
                  <span className="size-1.5 rounded-full bg-success" /> {style}
                </div>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                  {(["GLB", "STL"] as const).map((fmt) => (
                    <button key={fmt} onClick={() => toast.success(`${fmt} download started`)}
                      className="px-4 h-9 rounded-full bg-background/80 backdrop-blur border border-border text-xs font-medium hover:bg-elevated transition-colors inline-flex items-center gap-1.5">
                      <Download className="size-3.5" /> {fmt}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {status === "complete" && (
        <motion.p initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
          className="mt-4 text-xs text-muted-foreground text-center tabular-nums">
          348K vertices · 362K faces · {style} style · PBR textured
        </motion.p>
      )}
    </div>
  );
}

function Spinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const dim = size === "sm" ? "size-5" : size === "lg" ? "size-14" : "size-10";
  return (
    <div className={cn("relative", dim)}>
      <div className="absolute inset-0 rounded-full border-2 border-border-subtle" />
      <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-accent border-r-accent animate-spin" />
    </div>
  );
}
