import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/ComingSoon";

export const Route = createFileRoute("/tools/etsy-profit")({
  head: () => ({
    meta: [
      { title: "Etsy Profit Calculator — Snap3D" },
      { name: "description", content: "Calculate net profit on Etsy listings." },
    ],
  }),
  component: () => (
    <ComingSoon
      title="Etsy Profit Calculator"
      blurb="Live margin calculations and recommended pricing — almost ready."
    />
  ),
});
