import { createFileRoute, Link } from "@tanstack/react-router";
import { lazy, Suspense, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Coins, Maximize2, Orbit, RotateCcw, Download } from "lucide-react";
import { toast } from "sonner";
import { UploadZone } from "@/components/UploadZone";
import { cn } from "@/lib/utils";

const ModelViewer = lazy(() => import("@/components/ModelViewer"));

export const Route = createFileRoute("/generate/image")({
  head: () => ({
    meta: [
      { title: "Image to 3D — Snap3D" },
      {
        name: "description",
        content: "Upload a photo and turn it into a textured 3D model in seconds.",
      },
      { property: "og:title", content: "Image to 3D — Snap3D" },
      {
        property: "og:description",
        content: "Upload a photo and turn it into a textured 3D model in seconds.",
      },
    ],
  }),
  component: ImageGenerate,
});

type Status = "idle" | "loading" | "complete";
const STAGES = [
  "Analyzing image…",
  "Generating mesh…",
  "Applying textures…",
  "Finalizing…",
];

function ImageGenerate() {
  const [file, setFile] = useState<File | null>(null);
  const [resolution, setResolution] = useState<"512" | "1024">("512");
  const [detail, setDetail] = useState<"Low" | "Medium" | "High">("Medium");
  const [bgRemove, setBgRemove] = useState(true);
  const [status, setStatus] = useState<Status>("idle");
  const [stageIdx, setStageIdx] = useState(0);

  const generate = () => {
    if (!file) {
      toast.error("Upload a photo first");
      return;
    }
    setStatus("loading");
    setStageIdx(0);
    toast("Job queued");
    let i = 0;
    const t = setInterval(() => {
      i += 1;
      if (i >= STAGES.length) {
        clearInterval(t);
        setStatus("complete");
        toast.success("Model ready!");
        return;
      }
      setStageIdx(i);
    }, 1400);
  };

  return (
    <div className="mx-auto max-w-7xl px-5 lg:px-8 py-8">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,45fr)_minmax(0,55fr)] lg:min-h-[calc(100vh-8rem)]">
        {/* LEFT */}
        <div className="space-y-6">
          <div>
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="size-4" /> Back
            </Link>
            <h1 className="mt-4 text-2xl font-semibold tracking-tight">Image to 3D</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Upload a photo to generate a fully textured 3D mesh.
            </p>
          </div>

          <UploadZone onFile={setFile} />

          <div className="rounded-2xl border border-border-subtle bg-card p-5 space-y-5">
            <h3 className="text-sm font-semibold">Settings</h3>

            <Field label="Resolution">
              <SegmentedToggle
                value={resolution}
                onChange={(v) => setResolution(v as "512" | "1024")}
                options={[
                  { value: "512", label: "512³ Fast", sub: "1 credit" },
                  { value: "1024", label: "1024³ Quality", sub: "2 credits" },
                ]}
              />
            </Field>

            <Field label="Detail level">
              <Segmented
                value={detail}
                onChange={(v) => setDetail(v as typeof detail)}
                options={["Low", "Medium", "High"]}
              />
            </Field>

            <Field label="Auto remove background">
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={bgRemove}
                  onChange={(e) => setBgRemove(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-10 h-6 rounded-full bg-elevated border border-border peer-checked:bg-accent peer-checked:border-accent transition-colors relative">
                  <div className="absolute top-0.5 left-0.5 size-5 rounded-full bg-foreground transition-transform peer-checked:translate-x-4" />
                </div>
              </label>
            </Field>
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
            {status === "loading" ? "Generating…" : "Generate 3D Model →"}
          </button>
          <p className="text-xs text-muted-foreground text-center">
            ~25 seconds · PBR textured output
          </p>
        </div>

        {/* RIGHT */}
        <div className="relative rounded-2xl border border-border-subtle bg-card overflow-hidden min-h-[420px] lg:min-h-0">
          <AnimatePresence mode="wait">
            {status === "idle" && (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 grid-bg flex items-center justify-center"
              >
                <p className="text-sm text-muted-foreground">Your model will appear here</p>
              </motion.div>
            )}
            {status === "loading" && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center gap-6"
              >
                <Spinner />
                <p className="text-sm text-muted-foreground tabular-nums">
                  {STAGES[stageIdx]}
                </p>
                <div className="absolute bottom-0 inset-x-0 h-1 bg-elevated overflow-hidden">
                  <motion.div
                    className="h-full bg-accent"
                    initial={{ width: "0%" }}
                    animate={{ width: `${((stageIdx + 1) / STAGES.length) * 100}%` }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                  />
                </div>
              </motion.div>
            )}
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
                <div className="absolute top-3 right-3 flex gap-1.5">
                  {[Orbit, RotateCcw, Maximize2].map((Icon, i) => (
                    <button
                      key={i}
                      className="size-9 rounded-lg bg-background/70 backdrop-blur border border-border-subtle hover:bg-elevated transition-colors flex items-center justify-center"
                    >
                      <Icon className="size-4" />
                    </button>
                  ))}
                </div>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                  {(["GLB", "STL"] as const).map((fmt) => (
                    <button
                      key={fmt}
                      onClick={() => toast.success(`${fmt} download started`)}
                      className="px-4 h-9 rounded-full bg-background/80 backdrop-blur border border-border text-xs font-medium hover:bg-elevated transition-colors inline-flex items-center gap-1.5"
                    >
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
        <div className="mt-4 text-xs text-muted-foreground text-center tabular-nums">
          482K vertices · 498K faces · PBR textured
        </div>
      )}
    </div>
  );
}

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
          onClick={() => onChange(o.value)}
          className={cn(
            "px-3 py-1.5 rounded-md text-xs transition-colors",
            value === o.value
              ? "bg-accent text-accent-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <span className="font-medium">{o.label}</span>
          <span className="opacity-70 ml-1">· {o.sub}</span>
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

function Spinner() {
  return (
    <div className="relative size-12">
      <div className="absolute inset-0 rounded-full border-2 border-border-subtle" />
      <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-accent border-r-accent animate-spin" />
    </div>
  );
}
