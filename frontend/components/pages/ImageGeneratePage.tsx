"use client";

import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Suspense, useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Coins, Maximize2, Orbit, RotateCcw, Download,
  Check, Sparkles, Share2,
} from "lucide-react";
import { toast } from "sonner";
import { UploadZone } from "@/components/UploadZone";
import { cn } from "@/lib/utils";
import { submitGenerate, type JobAssets } from "@/lib/api";
import { useJobProgress } from "@/hooks/use-job-progress";

const ModelViewer = dynamic(() => import("@/components/ModelViewer"), { ssr: false });

type PageStatus = "idle" | "loading" | "complete";

const BACKEND_STAGES = [
  { key: "Starting",            label: "Analyzing image" },
  { key: "Removing background", label: "Removing background" },
  { key: "Generating 3D model", label: "Generating 3D mesh" },
  { key: "Uploading assets",    label: "Finalizing" },
];

const SAMPLES = [
  { id: "s1", label: "Sneaker", url: "https://picsum.photos/seed/sneaker2025/300/300" },
  { id: "s2", label: "Ceramic", url: "https://picsum.photos/seed/ceramic2025/300/300" },
  { id: "s3", label: "Figurine", url: "https://picsum.photos/seed/figur2025/300/300" },
  { id: "s4", label: "Plant",   url: "https://picsum.photos/seed/plant2025/300/300" },
];

export function ImageGeneratePage() {
  const [file, setFile] = useState<File | null>(null);
  const [sampleUrl, setSampleUrl] = useState<string | null>(null);
  const [activeSample, setActiveSample] = useState<string | null>(null);
  const [resolution, setResolution] = useState<"512" | "1024">("512");
  const [detail, setDetail] = useState<"Low" | "Medium" | "High">("Medium");
  const [bgRemove, setBgRemove] = useState(true);
  const [status, setStatus] = useState<PageStatus>("idle");
  const [jobId, setJobId] = useState<string | null>(null);
  const [assets, setAssets] = useState<JobAssets | null>(null);
  const [meshInfo, setMeshInfo] = useState<{ vertices: number; faces: number } | null>(null);

  const { progress, status: jobStatus, stage } = useJobProgress(jobId);

  // Derive stage index from the backend's reported stage string
  const stageIdx = Math.max(
    0,
    BACKEND_STAGES.findIndex((s) => s.key === stage),
  );

  // React to job completion / failure
  useEffect(() => {
    if (!jobId) return;
    if (jobStatus === "complete") {
      setStatus("complete");
      toast.success("Model ready!");
    } else if (jobStatus === "failed") {
      setStatus("idle");
      setJobId(null);
      toast.error("Generation failed — please try again");
    }
  }, [jobStatus, jobId]);

  const hasInput = file !== null || sampleUrl !== null;

  const handleFile = useCallback((f: File | null) => {
    setFile(f);
    if (f) { setSampleUrl(null); setActiveSample(null); }
  }, []);

  const handleSample = useCallback((s: (typeof SAMPLES)[0]) => {
    setActiveSample(s.id);
    setSampleUrl(s.url);
    setFile(null);
  }, []);

  const generate = async () => {
    if (!hasInput) { toast.error("Upload a photo or pick a sample first"); return; }
    setStatus("loading");
    setJobId(null);
    setAssets(null);
    setMeshInfo(null);

    try {
      const fd = new FormData();
      fd.append("job_type", "image_to_3d");
      fd.append("resolution", resolution);
      fd.append("poly_budget", detail.toLowerCase() as string);

      if (file) {
        fd.append("image", file);
      } else if (sampleUrl) {
        // Fetch the sample image and attach it as a blob
        const resp = await fetch(sampleUrl);
        const blob = await resp.blob();
        fd.append("image", blob, "sample.jpg");
      }

      const queued = await submitGenerate(fd);
      setJobId(queued.job_id);
    } catch (err) {
      setStatus("idle");
      toast.error((err as Error).message ?? "Failed to submit — is the backend running?");
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-5 lg:px-8 py-8">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,44fr)_minmax(0,56fr)] lg:min-h-[calc(100vh-8rem)]">

        {/* ── LEFT COLUMN ─────────────────────────────── */}
        <div className="flex flex-col gap-5">

          {/* Header */}
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="size-4" /> Back
            </Link>
            <div className="mt-4 flex items-start justify-between gap-3">
              <div>
                <h1 className="text-2xl font-semibold tracking-tight">Image to 3D</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Upload a photo — get a textured 3D mesh in ~25 s.
                </p>
              </div>
              <span className="shrink-0 inline-flex items-center gap-1.5 text-xs text-muted-foreground bg-elevated border border-border-subtle rounded-full px-2.5 py-1">
                <span className="size-1.5 rounded-full bg-success animate-pulse" />
                GPU ready
              </span>
            </div>
          </div>

          {/* Upload zone */}
          <UploadZone
            onFile={handleFile}
            previewUrl={sampleUrl ?? undefined}
            onClearPreview={() => { setSampleUrl(null); setActiveSample(null); }}
          />

          {/* Sample thumbnails */}
          <div>
            <p className="text-xs text-muted-foreground mb-2.5">Or try a sample →</p>
            <div className="grid grid-cols-4 gap-2">
              {SAMPLES.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => handleSample(s)}
                  className={cn(
                    "relative rounded-xl overflow-hidden aspect-square border-2 transition-all hover:scale-[1.04] active:scale-[0.97]",
                    activeSample === s.id
                      ? "border-accent shadow-[0_0_0_1px_var(--accent)]"
                      : "border-border-subtle hover:border-border",
                  )}
                >
                  <Image
                    src={s.url}
                    alt={s.label}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-background/90 to-transparent pt-3 pb-1.5 px-1.5">
                    <p className="text-[10px] font-medium leading-none">{s.label}</p>
                  </div>
                  {activeSample === s.id && (
                    <div className="absolute top-1.5 right-1.5 size-4 rounded-full bg-accent flex items-center justify-center">
                      <Check className="size-2.5 text-accent-foreground" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Settings */}
          <div className="rounded-2xl border border-border-subtle bg-card p-4 space-y-4">
            <h3 className="text-sm font-semibold">Settings</h3>

            <Field label="Resolution">
              <SegmentedToggle
                value={resolution}
                onChange={(v) => setResolution(v as "512" | "1024")}
                options={[
                  { value: "512", label: "512³", sub: "1 cr" },
                  { value: "1024", label: "1024³", sub: "2 cr" },
                ]}
              />
            </Field>

            <Field label="Detail">
              <Segmented
                value={detail}
                onChange={(v) => setDetail(v as typeof detail)}
                options={["Low", "Medium", "High"]}
              />
            </Field>

            <Field label="Remove background">
              <Toggle checked={bgRemove} onChange={setBgRemove} />
            </Field>
          </div>

          {/* Credits + CTA */}
          <div className="space-y-3 mt-auto">
            <div className="flex items-center justify-between text-sm">
              <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                <Coins className="size-4 text-warning" />
                8 credits remaining
              </span>
              <button type="button" className="text-xs text-accent hover:underline underline-offset-2">
                Buy more
              </button>
            </div>

            <button
              type="button"
              onClick={generate}
              disabled={status === "loading"}
              className={cn(
                "w-full h-12 rounded-full bg-foreground text-background font-medium transition-all active:scale-[0.98] inline-flex items-center justify-center gap-2 shadow-[0_10px_40px_-10px_rgba(255,255,255,0.22)]",
                status === "loading"
                  ? "opacity-80 animate-pulse-glow cursor-wait"
                  : "hover:opacity-90",
              )}
            >
              {status === "loading" ? (
                <><Spinner sm />Generating…</>
              ) : (
                "Generate 3D Model →"
              )}
            </button>

            <div className="flex items-center justify-center gap-3 text-xs text-muted-foreground">
              <span>~25 seconds</span>
              <Dot />
              <span>PBR textured</span>
              <Dot />
              <span>GLB · STL · OBJ</span>
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN — Viewer ───────────────────── */}
        <div className="relative rounded-2xl border border-border-subtle bg-card overflow-hidden min-h-[480px] lg:min-h-0">
          <AnimatePresence mode="wait">

            {/* Idle state */}
            {status === "idle" && (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 grid-bg flex flex-col items-center justify-center gap-6"
              >
                <div className="relative">
                  <div className="size-24 rounded-3xl bg-elevated/60 border border-border-subtle flex items-center justify-center">
                    <svg viewBox="0 0 64 64" className="size-14 text-muted-foreground/40" fill="none">
                      <path d="M32 8L8 22v20l24 14 24-14V22L32 8z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                      <path d="M32 8v34M8 22l24 14 24-14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
                    </svg>
                  </div>
                  <div className="absolute -bottom-1 -right-1 size-7 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center">
                    <Sparkles className="size-3.5 text-accent" />
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-sm font-medium">Your 3D model will appear here</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Upload a photo or pick a sample to get started
                  </p>
                </div>

                {/* Tips footer */}
                <div className="absolute bottom-4 inset-x-4 rounded-xl bg-elevated/50 border border-border-subtle p-3">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2.5">
                    Tips for best results
                  </p>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    {[
                      { icon: "☀️", tip: "Good lighting" },
                      { icon: "📐", tip: "Clear edges" },
                      { icon: "🎯", tip: "Single object" },
                    ].map((t) => (
                      <div key={t.tip} className="space-y-1">
                        <div className="text-lg">{t.icon}</div>
                        <p className="text-[10px] text-muted-foreground">{t.tip}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Loading state */}
            {status === "loading" && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center gap-8 px-10"
              >
                <Spinner />

                <div className="w-full max-w-xs space-y-1.5">
                  {BACKEND_STAGES.map((s, i) => {
                    const done = i < stageIdx;
                    const active = i === stageIdx;
                    return (
                      <motion.div
                        key={s.key}
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.07 }}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                          active && "bg-elevated border border-border-subtle",
                          done && "opacity-40",
                        )}
                      >
                        <div
                          className={cn(
                            "size-5 rounded-full border flex items-center justify-center shrink-0 text-[10px] font-medium",
                            done
                              ? "bg-success/20 border-success/50 text-success"
                              : active
                              ? "border-accent/60"
                              : "border-border text-muted-foreground",
                          )}
                        >
                          {done ? <Check className="size-3" /> : i + 1}
                        </div>
                        <span
                          className={cn(
                            "text-sm",
                            active ? "text-foreground font-medium" : "text-muted-foreground",
                          )}
                        >
                          {s.label}
                        </span>
                        {active && (
                          <motion.span
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ duration: 1.4, repeat: Infinity }}
                            className="ml-auto text-xs text-accent tracking-widest"
                          >
                            ···
                          </motion.span>
                        )}
                      </motion.div>
                    );
                  })}
                </div>

                {/* Progress bar driven by real SSE progress (0–100) */}
                <div className="absolute bottom-0 inset-x-0 h-0.5 bg-elevated overflow-hidden">
                  <motion.div
                    className="h-full bg-accent"
                    initial={{ width: "0%" }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </div>
              </motion.div>
            )}

            {/* Complete state */}
            {status === "complete" && (
              <motion.div
                key="complete"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0"
              >
                <Suspense
                  fallback={
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Spinner />
                    </div>
                  }
                >
                  <ModelViewer />
                </Suspense>

                {/* Mesh badge */}
                <div className="absolute top-3 left-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-background/70 backdrop-blur border border-border-subtle text-[11px] text-muted-foreground">
                  <span className="size-1.5 rounded-full bg-success" />
                  {meshInfo
                    ? `${(meshInfo.vertices / 1000).toFixed(0)}K verts · PBR textured`
                    : "PBR textured"}
                </div>

                {/* Viewer controls */}
                <div className="absolute top-3 right-3 flex gap-1.5">
                  {([Orbit, RotateCcw, Maximize2] as const).map((Icon, i) => (
                    <button
                      key={i}
                      type="button"
                      className="size-9 rounded-lg bg-background/70 backdrop-blur border border-border-subtle hover:bg-elevated transition-colors flex items-center justify-center"
                    >
                      <Icon className="size-4" />
                    </button>
                  ))}
                </div>

                {/* Download + share */}
                <div className="absolute bottom-3 inset-x-3 flex items-center gap-2">
                  {([
                    { fmt: "GLB", url: assets?.glb },
                    { fmt: "STL", url: assets?.stl },
                  ] as const).map(({ fmt, url }) => (
                    <a
                      key={fmt}
                      href={url ?? "#"}
                      download={url ? `model.${fmt.toLowerCase()}` : undefined}
                      onClick={!url ? (e) => { e.preventDefault(); toast.success(`${fmt} download started`); } : undefined}
                      className="flex-1 h-9 rounded-full bg-background/80 backdrop-blur border border-border text-xs font-medium hover:bg-elevated transition-colors inline-flex items-center justify-center gap-1.5"
                    >
                      <Download className="size-3.5" /> {fmt}
                    </a>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      const shareUrl = assets?.glb ?? window.location.href;
                      navigator.clipboard.writeText(shareUrl).then(() => toast.success("Link copied!"));
                    }}
                    className="size-9 rounded-full bg-background/80 backdrop-blur border border-border hover:bg-elevated transition-colors flex items-center justify-center"
                    aria-label="Share"
                  >
                    <Share2 className="size-3.5" />
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/* ── Sub-components ─────────────────────────────────── */

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm text-muted-foreground">{label}</span>
      {children}
    </div>
  );
}

function SegmentedToggle({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string; sub: string }[];
}) {
  return (
    <div className="inline-flex p-1 rounded-lg bg-elevated border border-border-subtle">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={cn(
            "px-3 py-1.5 rounded-md text-xs transition-colors",
            value === o.value
              ? "bg-accent text-accent-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <span className="font-medium">{o.label}</span>
          <span className="opacity-60 ml-1">· {o.sub}</span>
        </button>
      ))}
    </div>
  );
}

function Segmented({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div className="inline-flex p-1 rounded-lg bg-elevated border border-border-subtle">
      {options.map((o) => (
        <button
          key={o}
          type="button"
          onClick={() => onChange(o)}
          className={cn(
            "px-3 py-1.5 rounded-md text-xs transition-colors",
            value === o
              ? "bg-accent text-accent-foreground font-medium"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative w-10 h-6 rounded-full border transition-colors",
        checked ? "bg-accent border-accent" : "bg-elevated border-border",
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 left-0.5 size-5 rounded-full bg-foreground shadow transition-transform",
          checked && "translate-x-4",
        )}
      />
    </button>
  );
}

function Spinner({ sm }: { sm?: boolean }) {
  return (
    <div className={cn("relative shrink-0", sm ? "size-4" : "size-12")}>
      <div className={cn("absolute inset-0 rounded-full border-border-subtle", sm ? "border" : "border-2")} />
      <div
        className={cn(
          "absolute inset-0 rounded-full border-transparent border-t-accent border-r-accent animate-spin",
          sm ? "border" : "border-2",
        )}
      />
    </div>
  );
}

function Dot() {
  return <span className="size-1 rounded-full bg-border-subtle" />;
}
