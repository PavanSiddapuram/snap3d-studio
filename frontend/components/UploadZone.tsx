"use client";

import { useCallback, useRef, useState } from "react";
import { Upload, X, Image as ImageIcon, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function UploadZone({
  onFile,
  accept = "image/jpeg,image/png,image/webp",
  hint = "JPEG, PNG, WEBP — max 10MB",
  previewUrl,
  onClearPreview,
}: {
  onFile?: (file: File | null) => void;
  accept?: string;
  hint?: string;
  previewUrl?: string;
  onClearPreview?: () => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [blobPreview, setBlobPreview] = useState<string | null>(null);
  const [drag, setDrag] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handle = useCallback(
    (f: File | null) => {
      setFile(f);
      onFile?.(f);
      if (blobPreview) URL.revokeObjectURL(blobPreview);
      setBlobPreview(f ? URL.createObjectURL(f) : null);
      if (f) onClearPreview?.();
    },
    [onFile, blobPreview, onClearPreview],
  );

  const clearAll = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      handle(null);
      onClearPreview?.();
    },
    [handle, onClearPreview],
  );

  const effectivePreview = blobPreview || previewUrl || null;
  const hasFile = file !== null || (previewUrl != null && previewUrl !== "");

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDrag(true);
      }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDrag(false);
        const f = e.dataTransfer.files?.[0];
        if (f) handle(f);
      }}
      onClick={() => !effectivePreview && inputRef.current?.click()}
      className={cn(
        "relative rounded-2xl border-2 border-dashed transition-all aspect-4/3 flex items-center justify-center cursor-pointer overflow-hidden noise",
        drag
          ? "border-accent bg-accent/8 scale-[1.01]"
          : effectivePreview
          ? "border-border cursor-default"
          : "border-border hover:border-accent/60 bg-card/40 hover:bg-card/60",
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        aria-label="Upload image file"
        className="hidden"
        onChange={(e) => handle(e.target.files?.[0] ?? null)}
      />

      {effectivePreview ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={effectivePreview}
            alt="Upload preview"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-background/80 via-transparent to-transparent" />
          <button
            type="button"
            onClick={clearAll}
            className="absolute top-3 right-3 size-9 rounded-full bg-background/80 backdrop-blur-md border border-border flex items-center justify-center hover:bg-elevated transition-all hover:scale-105 active:scale-95"
            aria-label="Remove image"
          >
            <X className="size-4" />
          </button>
          <div className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-background/70 backdrop-blur-md border border-border-subtle text-[11px]">
            <Sparkles className="size-3 text-accent" />
            Ready to generate
          </div>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="absolute bottom-3 right-3 px-3 h-7 rounded-full bg-background/70 backdrop-blur-md border border-border-subtle text-[11px] hover:bg-elevated transition-colors"
          >
            Replace
          </button>
        </>
      ) : (
        <div className="text-center px-6 relative">
          <motion.div
            animate={drag ? { scale: 1.08, y: -2 } : { scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
            className="mx-auto size-14 rounded-2xl bg-elevated border border-border-subtle flex items-center justify-center shadow-soft"
          >
            {drag ? (
              <ImageIcon className="size-6 text-accent" />
            ) : (
              <Upload className="size-5 text-muted-foreground" />
            )}
          </motion.div>
          <p className="mt-5 text-[15px] font-medium">
            Drop a photo or <span className="text-accent">browse</span>
          </p>
          <p className="mt-1.5 text-xs text-muted-foreground">{hint}</p>
        </div>
      )}
    </div>
  );
}
