import type { Metadata } from "next";
import { ToolsPage } from "@/components/pages/ToolsPage";

export const metadata: Metadata = {
  title: "Free 3D Printing Tools",
  description:
    "Lithophanes, vases, format converters and AI generators for makers. No account required.",
  openGraph: {
    title: "Free 3D Printing Tools — Snap3D",
    description: "A free toolbox for makers and 3D printing enthusiasts.",
  },
};

export default function ToolsRoute() {
  return <ToolsPage />;
}
