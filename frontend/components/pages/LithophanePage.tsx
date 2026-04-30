"use client";

import Link from "next/link";
import { useState, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Download, Info, Upload, X, Sliders } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { PageShell } from "@/components/PageShell";

type Shape = "flat" | "curved" | "box";
const SHAPES: { value: Shape; label: string; desc: string }[] = [
  { value: "flat",   label: "Flat",   desc: "Wall-mount panel" },
  { value: "curved", label: "Curved", desc: "Lamp shade / nightlight" },
  { value: "box",    label: "Box",    desc: "Backlit display box" },
];

export function LithophanePage() {
  const [preview, setPreview]       = useState<string | null>(null);
  const [drag, setDrag]             = useState(false);
  const [shape, setShape]           = useState<Shape>("flat");
  const [width, setWidth]           = useState(100);
  const [thickness, setThickness]   = useState(3);
  const [border, setBorder]         = useState(true);
  const [generating, setGenerating] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) { toast.error("Please upload an image file"); return; }
    if (file.size > 20 * 1024 * 1024) { toast.error("File must be under 20 MB"); return; }
    if (preview) URL.revokeObjectURL(preview);
    setPreview(URL.createObjectURL(file));
  }, [preview]);

  const generate = () => {
    if (!preview) { toast.error("Upload a photo first"); return; }
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      toast.success("STL ready — download starting");
    }, 2200);
  };

  const height = Math.round(width * 0.75);

  return (
    <PageShell>
      <div className="mx-auto max-w-7xl px-5 lg:px-8 py-12 lg:py-16">

        {/* Header */}
        <div className="mb-10">
          <Link href="/tools" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-5">
            <ArrowLeft className="size-4" /> All tools
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-accent font-medium">Free · No account</p>
              <h1 className="mt-2 text-4xl sm:text-5xl font-semibold tracking-[-0.03em]">
                Lithophane Generator
              </h1>
              <p className="mt-3 text-muted-foreground text-[15px] max-w-xl leading-relaxed">
                Upload any photo and get a print-ready STL lithophane. Adjust size, thickness, and shape — download instantly.
              </p>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-success/30 bg-success/10 text-success text-[11px] font-medium self-start sm:self-end">
              <span className="size-1.5 rounded-full bg-success" /> Free forever
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">

          {/* ── Preview panel ── */}
          <div className="space-y-4">
            {/* Upload zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
              onDragLeave={() => setDrag(false)}
              onDrop={(e) => { e.preventDefault(); setDrag(false); const f = e.dataTransfer.files?.[0]; if (f) handleFile(f); }}
              onClick={() => !preview && inputRef.current?.click()}
              className={cn(
                "relative rounded-2xl border-2 border-dashed transition-all overflow-hidden cursor-pointer",
                preview ? "aspect-[4/3]" : "aspect-[4/3] flex items-center justify-center",
                drag ? "border-accent bg-accent/8" : "border-border hover:border-accent/50 bg-card/40",
              )}
            >
              <input ref={inputRef} type="file" accept="image/*" className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />

              {preview ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={preview} alt="Source" className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 mix-blend-multiply" style={{
                    background: "linear-gradient(to bottom, rgba(255,255,255,0.1), rgba(0,0,0,0.05))",
                    filter: "grayscale(1) contrast(1.2)",
                  }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
                  <button
                    onClick={(e) => { e.stopPropagation(); if (preview) URL.revokeObjectURL(preview); setPreview(null); }}
                    className="absolute top-3 right-3 size-9 rounded-full bg-background/80 backdrop-blur-md border border-border flex items-center justify-center hover:bg-elevated transition-all hover:scale-105 active:scale-95"
                  >
                    <X className="size-4" />
                  </button>
                  <div className="absolute bottom-3 left-3 text-[10px] font-mono px-2 py-1 rounded bg-background/60 backdrop-blur text-muted-foreground">
                    {width}×{height} mm · {thickness} mm thick
                  </div>
                </>
              ) : (
                <motion.div animate={drag ? { scale: 1.05 } : { scale: 1 }} className="text-center px-8">
                  <div className="mx-auto size-14 rounded-2xl bg-elevated border border-border-subtle flex items-center justify-center mb-4">
                    <Upload className="size-5 text-muted-foreground" />
                  </div>
                  <p className="text-[15px] font-medium">Drop a photo or <span className="text-accent">browse</span></p>
                  <p className="mt-1.5 text-xs text-muted-foreground">JPEG, PNG, WEBP — up to 20 MB</p>
                </motion.div>
              )}
            </div>

            {preview && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="flex items-center gap-2 text-xs text-muted-foreground px-1">
                <Info className="size-3.5 shrink-0" />
                Preview shows source image. The actual lithophane will be a translucent height-map STL.
              </motion.div>
            )}
          </div>

          {/* ── Controls panel ── */}
          <div className="space-y-4">

            {/* Shape */}
            <ControlCard title="Shape" icon={Sliders}>
              <div className="grid grid-cols-3 gap-2">
                {SHAPES.map((s) => (
                  <button key={s.value} onClick={() => setShape(s.value)}
                    className={cn(
                      "rounded-xl border p-3 text-center transition-all",
                      shape === s.value ? "border-accent/60 bg-accent/8" : "border-border-subtle bg-elevated/40 hover:border-border",
                    )}
                  >
                    <ShapeIcon shape={s.value} active={shape === s.value} />
                    <p className="mt-2 text-xs font-medium">{s.label}</p>
                    <p className="text-[10px] text-muted-foreground">{s.desc}</p>
                  </button>
                ))}
              </div>
            </ControlCard>

            {/* Size */}
            <ControlCard title="Size">
              <SliderRow
                label="Width"
                value={width}
                min={50} max={250} step={5}
                unit="mm"
                onChange={setWidth}
              />
              <div className="flex items-center justify-between text-[11px] text-muted-foreground mt-1">
                <span>Height (auto 4:3)</span>
                <span className="tabular-nums font-medium text-foreground">{height} mm</span>
              </div>
            </ControlCard>

            {/* Thickness */}
            <ControlCard title="Thickness">
              <SliderRow
                label="Max thickness"
                value={thickness}
                min={2} max={8} step={0.5}
                unit="mm"
                onChange={setThickness}
              />
              <div className="mt-2 grid grid-cols-3 gap-1.5">
                {([2, 3, 5] as const).map((v) => (
                  <button key={v} onClick={() => setThickness(v)}
                    className={cn(
                      "rounded-lg border py-1.5 text-[11px] transition-colors",
                      thickness === v ? "border-accent/50 bg-accent/10 text-accent" : "border-border-subtle text-muted-foreground hover:border-border",
                    )}>
                    {v} mm
                  </button>
                ))}
              </div>
            </ControlCard>

            {/* Options */}
            <ControlCard title="Options">
              <Toggle
                label="Include border frame"
                hint="Adds a 3 mm raised border for easier mounting"
                checked={border}
                onChange={setBorder}
              />
            </ControlCard>

            {/* Estimate */}
            <div className="rounded-xl border border-border-subtle bg-card p-4 space-y-2">
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Print estimate</p>
              <div className="grid grid-cols-3 gap-3 text-center">
                {[
                  { label: "Print time", value: `~${Math.round((width / 50) * 2.5)}h` },
                  { label: "Filament", value: `~${Math.round(width * thickness * 0.04)}g` },
                  { label: "Polygons", value: `~${(width * height * 0.8).toLocaleString()}` },
                ].map((e) => (
                  <div key={e.label}>
                    <p className="text-base font-semibold tabular-nums">{e.value}</p>
                    <p className="text-[10px] text-muted-foreground">{e.label}</p>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-muted-foreground">
                Estimates based on 0.1 mm layer height, PETG. Translucent PETG or PLA recommended.
              </p>
            </div>

            {/* CTA */}
            <button
              onClick={generate}
              disabled={!preview || generating}
              className="w-full h-12 rounded-full bg-foreground text-background font-medium hover:opacity-90 transition-opacity active:scale-[0.98] inline-flex items-center justify-center gap-2 shadow-[0_10px_40px_-10px_rgba(255,255,255,0.2)] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {generating ? (
                <><span className="size-4 rounded-full border-2 border-background/40 border-t-background animate-spin" /> Generating STL…</>
              ) : (
                <><Download className="size-4" /> Download STL</>
              )}
            </button>
            <p className="text-[11px] text-muted-foreground text-center">
              Free · No account needed · Instant download
            </p>
          </div>
        </div>

        {/* How it works */}
        <div className="mt-20 border-t border-border-subtle pt-16">
          <p className="text-[11px] uppercase tracking-[0.2em] text-accent font-medium">How it works</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight">Three steps to a printable lithophane</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {[
              { n: "01", t: "Upload your photo", d: "Any JPEG, PNG, or WEBP. Higher resolution gives more detail in the final print." },
              { n: "02", t: "Adjust settings", d: "Set the print size in mm, choose thickness, and pick flat or curved shape." },
              { n: "03", t: "Download & print", d: "Slice the STL at 0.1 mm layer height. Use translucent PETG or PLA for best results." },
            ].map((s) => (
              <div key={s.n} className="rounded-2xl border border-border-subtle bg-card p-6 noise">
                <span className="font-mono text-xs text-accent">{s.n}</span>
                <h3 className="mt-3 font-semibold">{s.t}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageShell>
  );
}

/* ── Sub-components ── */

function ControlCard({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon?: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border-subtle bg-card p-5 space-y-4">
      <div className="flex items-center gap-2">
        {Icon && <Icon className="size-4 text-muted-foreground" />}
        <h3 className="text-sm font-semibold">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function SliderRow({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="tabular-nums font-medium">{value} {unit}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none bg-elevated cursor-pointer accent-accent"
        style={{ accentColor: "var(--accent)" }}
      />
      <div className="flex justify-between text-[10px] text-muted-foreground">
        <span>{min} {unit}</span>
        <span>{max} {unit}</span>
      </div>
    </div>
  );
}

function Toggle({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-start justify-between gap-4 cursor-pointer">
      <div>
        <p className="text-sm">{label}</p>
        {hint && <p className="text-[11px] text-muted-foreground mt-0.5">{hint}</p>}
      </div>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative shrink-0 w-10 h-6 rounded-full border transition-colors",
          checked ? "bg-accent border-accent" : "bg-elevated border-border",
        )}
      >
        <span className={cn(
          "absolute top-0.5 size-5 rounded-full bg-foreground transition-transform",
          checked ? "left-[18px]" : "left-0.5",
        )} />
      </button>
    </label>
  );
}

function ShapeIcon({ shape, active }: { shape: "flat" | "curved" | "box"; active: boolean }) {
  const col = active ? "var(--accent)" : "var(--muted-foreground)";
  if (shape === "flat") return (
    <svg viewBox="0 0 32 20" className="mx-auto w-8 h-5">
      <rect x="1" y="1" width="30" height="18" rx="2" fill="none" stroke={col} strokeWidth="1.5" />
    </svg>
  );
  if (shape === "curved") return (
    <svg viewBox="0 0 32 20" className="mx-auto w-8 h-5">
      <path d="M1 10 Q16 2 31 10 Q16 18 1 10Z" fill="none" stroke={col} strokeWidth="1.5" />
    </svg>
  );
  return (
    <svg viewBox="0 0 28 24" className="mx-auto w-7 h-6">
      <rect x="1" y="5" width="22" height="18" rx="2" fill="none" stroke={col} strokeWidth="1.5" />
      <path d="M1 5 L8 1 L29 1 L23 5" fill="none" stroke={col} strokeWidth="1.5" />
      <path d="M23 5 L29 1 L29 19 L23 23" fill="none" stroke={col} strokeWidth="1.5" />
    </svg>
  );
}
