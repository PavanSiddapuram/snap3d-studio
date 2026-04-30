import type { Metadata } from "next";
import { TextGeneratePage } from "@/components/pages/TextGeneratePage";

export const metadata: Metadata = {
  title: "Text to 3D Model Generator",
  description:
    "Describe what you want and get a print-ready 3D model in seconds. No CAD skills required.",
  openGraph: {
    title: "Text to 3D — Snap3D",
    description: "Type a prompt, pick a style, and watch your idea become a 3D model.",
  },
};

export default function TextGenerateRoute() {
  return <TextGeneratePage />;
}
