import Link from "next/link";
import { Sparkles, ArrowLeft, ArrowRight } from "lucide-react";

export function ComingSoon({
  title,
  blurb,
}: {
  title: string;
  blurb?: string;
}) {
  return (
    <div className="relative mx-auto max-w-2xl px-5 lg:px-8 py-32 text-center noise">
      <div aria-hidden className="aurora opacity-50" />
      <div className="relative">
        <div className="mx-auto inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-accent/30 bg-accent/10 text-accent text-[11px] uppercase tracking-[0.15em] font-medium">
          <Sparkles className="size-3" /> In progress
        </div>
        <h1 className="mt-6 text-4xl sm:text-5xl font-semibold tracking-[-0.03em] text-balance">
          {title}
        </h1>
        <p className="mt-4 text-muted-foreground text-[15px] leading-relaxed">
          {blurb ?? "This page is on the way. We're polishing the interface and the math behind it."}
        </p>
        <div className="mt-9 inline-flex flex-wrap justify-center gap-2">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-4 h-11 rounded-full border border-border bg-card/40 backdrop-blur hover:bg-elevated transition-colors text-sm"
          >
            <ArrowLeft className="size-4" /> Back home
          </Link>
          <Link
            href="/tools"
            className="inline-flex items-center gap-1.5 px-4 h-11 rounded-full bg-foreground text-background hover:opacity-90 transition-opacity text-sm font-medium"
          >
            Explore tools <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
