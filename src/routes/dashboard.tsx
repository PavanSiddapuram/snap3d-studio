import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Box, Download, Coins, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Snap3D" },
      { name: "description", content: "Your generated 3D models, credits, and plan." },
      { property: "og:title", content: "Dashboard — Snap3D" },
      { property: "og:description", content: "Manage your generations and credits." },
    ],
  }),
  component: Dashboard,
});

type Job = {
  id: string;
  type: "Image to 3D" | "Text to 3D" | "Figurines";
  status: "Complete" | "Processing" | "Failed";
  when: string;
  hue: number;
};

const JOBS: Job[] = [
  { id: "1", type: "Image to 3D", status: "Complete", when: "2 hours ago", hue: 264 },
  { id: "2", type: "Text to 3D", status: "Complete", when: "yesterday", hue: 290 },
  { id: "3", type: "Figurines", status: "Processing", when: "just now", hue: 220 },
  { id: "4", type: "Image to 3D", status: "Complete", when: "3 days ago", hue: 200 },
  { id: "5", type: "Text to 3D", status: "Failed", when: "4 days ago", hue: 25 },
  { id: "6", type: "Image to 3D", status: "Complete", when: "1 week ago", hue: 280 },
];

const FILTERS = ["All", "Image to 3D", "Text to 3D", "Figurines"] as const;

function Dashboard() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const jobs = JOBS.filter((j) => filter === "All" || j.type === filter);

  return (
    <div className="mx-auto max-w-7xl px-5 lg:px-8 py-10">
      <div className="grid gap-8 lg:grid-cols-[200px_minmax(0,1fr)]">
        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col gap-1 sticky top-24 self-start">
          <SidebarLink to="/generate/image" label="Generate" />
          <SidebarLink to="/tools" label="Tools" />
          <SidebarLink to="/dashboard" label="Dashboard" active />
          <SidebarLink to="/settings" label="Settings" />
          <div className="mt-8 rounded-xl border border-border-subtle bg-card p-4">
            <div className="text-xs text-muted-foreground">Credits</div>
            <div className="mt-1 text-2xl font-semibold tabular-nums">8</div>
            <Link
              to="/pricing"
              className="mt-3 block text-center text-xs px-3 py-2 rounded-md bg-accent text-accent-foreground hover:bg-accent-hover transition-colors"
            >
              Upgrade
            </Link>
          </div>
        </aside>

        <div>
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">Your Generations</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                All models you've created with Snap3D.
              </p>
            </div>
            <Link
              to="/generate/image"
              className="inline-flex items-center gap-1.5 px-4 h-10 rounded-lg bg-accent text-accent-foreground text-sm font-medium hover:bg-accent-hover transition-colors active:scale-95"
            >
              <Plus className="size-4" /> New
            </Link>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <Stat label="Models created" value="42" />
            <Stat label="Credits remaining" value="8" icon={<Coins className="size-4 text-warning" />} />
            <Stat label="Plan" value="Free" hint="Upgrade for more" />
          </div>

          <div className="mt-8 -mx-5 lg:mx-0 px-5 lg:px-0 overflow-x-auto">
            <div className="flex gap-1 min-w-max border-b border-border-subtle">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={cn(
                    "px-4 py-2.5 text-sm transition-colors relative",
                    filter === f ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {f}
                  {filter === f && (
                    <span className="absolute inset-x-3 -bottom-px h-0.5 bg-accent rounded-full" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {jobs.map((j) => (
              <JobCard key={j.id} job={j} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SidebarLink({ to, label, active }: { to: string; label: string; active?: boolean }) {
  return (
    <Link
      to={to}
      className={cn(
        "px-3 py-2 rounded-md text-sm transition-colors",
        active ? "bg-elevated text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-elevated/60",
      )}
    >
      {label}
    </Link>
  );
}

function Stat({
  label,
  value,
  icon,
  hint,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="rounded-xl border border-border-subtle bg-card p-5">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-2 flex items-center gap-2">
        {icon}
        <div className="text-2xl font-semibold tabular-nums">{value}</div>
      </div>
      {hint && <div className="mt-1 text-xs text-muted-foreground">{hint}</div>}
    </div>
  );
}

function JobCard({ job }: { job: Job }) {
  const isProcessing = job.status === "Processing";
  return (
    <div className="group rounded-2xl border border-border-subtle bg-card overflow-hidden hover:border-accent/40 transition-colors">
      <div className="relative aspect-square overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at 50% 40%, oklch(0.55 0.22 ${job.hue} / 0.45), transparent 65%), linear-gradient(135deg, oklch(0.2 0.05 ${job.hue}), oklch(0.13 0.02 280))`,
          }}
        />
        <div className="absolute inset-0 grid-bg opacity-30" />
        {isProcessing && <div className="absolute inset-0 shimmer" />}
        <div className="absolute inset-0 flex items-center justify-center">
          <Box className="size-12 text-foreground/70" strokeWidth={1.3} />
        </div>
        <div className="absolute top-3 right-3">
          <StatusBadge status={job.status} />
        </div>
        {job.status === "Complete" && (
          <div className="absolute inset-x-0 bottom-0 p-3 flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-t from-background/90 to-transparent">
            {(["GLB", "STL"] as const).map((f) => (
              <button
                key={f}
                className="px-2.5 h-8 rounded-md bg-background/80 backdrop-blur border border-border text-[11px] inline-flex items-center gap-1 hover:bg-elevated"
              >
                <Download className="size-3" /> {f}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="p-4">
        <p className="text-sm font-medium">{job.type}</p>
        <p className="text-xs text-muted-foreground">{job.when}</p>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: Job["status"] }) {
  const map = {
    Complete: "text-success border-success/40 bg-success/15",
    Processing: "text-warning border-warning/40 bg-warning/15",
    Failed: "text-error border-error/40 bg-error/15",
  };
  return (
    <span
      className={cn(
        "text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border font-medium backdrop-blur",
        map[status],
      )}
    >
      {status === "Processing" && (
        <span className="inline-block size-1.5 rounded-full bg-warning animate-pulse mr-1.5 align-middle" />
      )}
      {status}
    </span>
  );
}
