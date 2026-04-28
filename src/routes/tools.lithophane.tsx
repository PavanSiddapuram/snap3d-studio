import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/ComingSoon";

export const Route = createFileRoute("/tools/lithophane")({
  head: () => ({
    meta: [
      { title: "Lithophane Generator — Snap3D" },
      { name: "description", content: "Turn any photo into a printable lithophane STL." },
    ],
  }),
  component: () => (
    <ComingSoon
      title="Lithophane Generator"
      blurb="The full parametric lithophane tool is coming online next."
    />
  ),
});
