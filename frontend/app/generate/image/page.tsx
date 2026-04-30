import type { Metadata } from "next";
import { ImageGeneratePage } from "@/components/pages/ImageGeneratePage";

export const metadata: Metadata = {
  title: "Image to 3D",
  description: "Upload a photo and turn it into a textured 3D model in seconds.",
  openGraph: {
    title: "Image to 3D — Snap3D",
    description: "Upload a photo and turn it into a textured 3D model in seconds.",
  },
};

export default function ImageGenerateRoute() {
  return <ImageGeneratePage />;
}
