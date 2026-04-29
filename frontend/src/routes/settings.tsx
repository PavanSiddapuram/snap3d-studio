import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/ComingSoon";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Snap3D" },
      { name: "description", content: "Manage your profile, API keys and billing." },
    ],
  }),
  component: () => (
    <ComingSoon
      title="Settings"
      blurb="Profile, API keys, and billing controls land in the next update."
    />
  ),
});
