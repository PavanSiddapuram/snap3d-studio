import type { Metadata } from "next";
import { LandingPage } from "@/components/pages/LandingPage";

export const metadata: Metadata = {
  title: "Snap3D — Turn Any Photo or Idea Into a 3D Model",
  description:
    "AI-powered 3D model generation, free parametric tools, and instant downloads. No CAD skills needed.",
  openGraph: {
    title: "Snap3D — Turn Any Photo or Idea Into a 3D Model",
    description: "AI generation plus a free toolbox for makers. STL, GLB, OBJ.",
  },
};

export default function HomePage() {
  return <LandingPage />;
}
