import { createFileRoute, Link } from "@tanstack/react-router";
import { Construction, ArrowLeft } from "lucide-react";

export function ComingSoon({
  title,
  blurb,
}: {
  title: string;
  blurb?: string;
}) {
  return (
    <div className="mx-auto max-w-2xl px-5 lg:px-8 py-32 text-center">
      <div className="mx-auto size-14 rounded-2xl bg-accent/10 border border-accent/30 flex items-center justify-center text-accent">
        <Construction className="size-6" />
      </div>
      <h1 className="mt-6 text-3xl sm:text-4xl font-semibold tracking-tight text-balance">
        {title}
      </h1>
      <p className="mt-3 text-muted-foreground">
        {blurb ?? "This page is on the way. We're polishing the interface and the math behind it."}
      </p>
      <div className="mt-8 inline-flex gap-2">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 px-4 h-10 rounded-lg border border-border bg-card hover:bg-elevated transition-colors text-sm"
        >
          <ArrowLeft className="size-4" /> Back home
        </Link>
        <Link
          to="/tools"
          className="inline-flex items-center px-4 h-10 rounded-lg bg-accent text-accent-foreground hover:bg-accent-hover transition-colors text-sm font-medium"
        >
          Explore tools
        </Link>
      </div>
    </div>
  );
}

// Re-export for route files
export const __noop = createFileRoute;
