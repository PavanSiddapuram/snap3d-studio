import type { Metadata } from "next";
import { LithophanePage } from "@/components/pages/LithophanePage";

export const metadata: Metadata = {
  title: "Free Lithophane Generator",
  description:
    "Turn any photo into a print-ready lithophane STL. Free, instant, no account required.",
  openGraph: {
    title: "Free Lithophane Generator — Snap3D",
    description:
      "Free online lithophane generator. Upload a photo, adjust thickness and size, download STL in seconds.",
  },
};

export default function LithophaneRoute() {
  return <LithophanePage />;
}
