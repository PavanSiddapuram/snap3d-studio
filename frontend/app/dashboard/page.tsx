import type { Metadata } from "next";
import { DashboardPage } from "@/components/pages/DashboardPage";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your generated 3D models, credits, and plan.",
  openGraph: {
    title: "Dashboard — Snap3D",
    description: "Manage your generations and credits.",
  },
};

export default function DashboardRoute() {
  return <DashboardPage />;
}
