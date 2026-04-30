import type { Metadata } from "next";
import { PricingPage } from "@/components/pages/PricingPage";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Free, Starter, and Pro plans for AI 3D model generation. Cancel anytime.",
  openGraph: {
    title: "Pricing — Snap3D",
    description: "Simple, transparent pricing for makers and pros.",
  },
};

export default function PricingRoute() {
  return <PricingPage />;
}
