import { useCallback, useRef, useState } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
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
        "relative rounded-2xl border-2 border-dashed transition-all aspect-[4/3] flex items-center justify-center cursor-pointer",
        drag
          ? "border-accent bg-accent/5"
          : "border-border hover:border-accent/60 bg-card/40",
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
            className="absolute inset-0 w-full h-full object-cover rounded-2xl"
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              handle(null);
            }}
            className="absolute top-3 right-3 size-8 rounded-full bg-background/80 backdrop-blur border border-border flex items-center justify-center hover:bg-elevated transition-colors"
            aria-label="Remove file"
          >
            <X className="size-4" />
          </button>
        </>
      ) : (
        <div className="text-center px-6">
          <div className="mx-auto size-12 rounded-xl bg-elevated border border-border-subtle flex items-center justify-center">
            {drag ? <ImageIcon className="size-5 text-accent" /> : <Upload className="size-5 text-muted-foreground" />}
          </div>
          <p className="mt-4 text-sm font-medium">
            Drop a photo here or <span className="text-accent">click to upload</span>
          </p>
          <p className="mt-1.5 text-xs text-muted-foreground">{hint}</p>
        </div>
      )}
    </div>
  );
}
