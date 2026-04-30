"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, LayoutGroup } from "framer-motion";
import { Box, Download, Coins, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { PageShell } from "@/components/PageShell";

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

export function DashboardPage() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const jobs = JOBS.filter((j) => filter === "All" || j.type === filter);

  return (
    <PageShell>
      <div className="mx-auto max-w-7xl px-5 lg:px-8 py-12">
        <div className="grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)]">
          {/* Sidebar */}
          <aside className="hidden lg:flex flex-col gap-1 sticky top-24 self-start">
            <p className="px-3 text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">Workspace</p>
            <SidebarLink href="/generate/image" label="Generate" />
            <SidebarLink href="/tools" label="Tools" />
            <SidebarLink href="/dashboard" label="Dashboard" active />
            <SidebarLink href="/settings" label="Settings" />
            <div className="mt-8 relative rounded-2xl border border-border-subtle bg-card p-5 overflow-hidden noise">
              <div
                aria-hidden
                className="absolute inset-0 opacity-60"
                style={{
                  background:
                    "radial-gradient(80% 60% at 0% 0%, oklch(0.55 0.22 277 / 0.18), transparent 60%)",
                }}
              />
              <div className="relative">
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Credits</div>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="text-3xl font-semibold tabular-nums">8</span>
                  <span className="text-xs text-muted-foreground">/ 10</span>
                </div>
                <div className="mt-3 h-1 rounded-full bg-elevated overflow-hidden">
                  <div className="h-full rounded-full bg-accent" style={{ width: "80%" }} />
                </div>
                <Link
                  href="/pricing"
                  className="mt-4 block text-center text-xs px-3 py-2 rounded-full bg-foreground text-background hover:opacity-90 transition-opacity font-medium"
                >
                  Upgrade plan
                </Link>
              </div>
            </div>
          </aside>

          <div>
            <div className="flex items-end justify-between gap-4 flex-wrap">
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-accent font-medium">Library</p>
                <h1 className="mt-2 text-4xl font-semibold tracking-[-0.025em]">Your Generations</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  All models you&apos;ve created with Snap3D.
                </p>
              </div>
              <Link
                href="/generate/image"
                className="inline-flex items-center gap-1.5 px-4 h-10 rounded-full bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity active:scale-[0.97]"
              >
                <Plus className="size-4" /> New generation
              </Link>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <Stat label="Models created" value="42" hint="+12 this month" />
              <Stat label="Credits remaining" value="8" icon={<Coins className="size-4 text-warning" />} />
              <Stat label="Current plan" value="Free" hint="Upgrade for more" />
            </div>

            <div className="mt-10 -mx-5 lg:mx-0 px-5 lg:px-0 overflow-x-auto">
              <LayoutGroup id="dash-tabs">
                <div className="inline-flex gap-1 p-1 rounded-full bg-card border border-border-subtle">
                  {FILTERS.map((f) => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className={cn(
                        "relative px-4 py-1.5 text-sm rounded-full transition-colors whitespace-nowrap",
                        filter === f ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {filter === f && (
                        <motion.span
                          layoutId="dash-active"
                          transition={{ type: "spring", stiffness: 400, damping: 32 }}
                          className="absolute inset-0 rounded-full bg-elevated border border-border-subtle"
                        />
                      )}
                      <span className="relative">{f}</span>
                    </button>
                  ))}
                </div>
              </LayoutGroup>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {jobs.map((j, i) => (
                <motion.div
                  key={j.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
                >
                  <JobCard job={j} />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}

function SidebarLink({ href, label, active }: { href: string; label: string; active?: boolean }) {
  return (
    <Link
      href={href}
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
