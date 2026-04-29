import { useCallback, useRef, useState } from "react";
import { Upload, X, Image as ImageIcon, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function UploadZone({
  onFile,
  accept = "image/jpeg,image/png,image/webp",
  hint = "JPEG, PNG, WEBP — max 10MB",
}: {
  onFile?: (file: File | null) => void;
  accept?: string;
  hint?: string;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [drag, setDrag] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handle = useCallback(
    (f: File | null) => {
      setFile(f);
      onFile?.(f);
      if (preview) URL.revokeObjectURL(preview);
      setPreview(f ? URL.createObjectURL(f) : null);
    },
    [onFile, preview],
  );

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
      onClick={() => !file && inputRef.current?.click()}
      className={cn(
        "relative rounded-2xl border-2 border-dashed transition-all aspect-[4/3] flex items-center justify-center cursor-pointer overflow-hidden noise",
        drag
          ? "border-accent bg-accent/8 scale-[1.01]"
          : "border-border hover:border-accent/60 bg-card/40 hover:bg-card/60",
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => handle(e.target.files?.[0] ?? null)}
      />
      {preview ? (
        <>
          <img
            src={preview}
            alt="Upload preview"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
          <button
            onClick={(e) => {
              e.stopPropagation();
              handle(null);
            }}
            className="absolute top-3 right-3 size-9 rounded-full bg-background/80 backdrop-blur-md border border-border flex items-center justify-center hover:bg-elevated transition-all hover:scale-105 active:scale-95"
            aria-label="Remove file"
          >
            <X className="size-4" />
          </button>
          <div className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-background/70 backdrop-blur-md border border-border-subtle text-[11px]">
            <Sparkles className="size-3 text-accent" />
            Ready to generate
          </div>
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
