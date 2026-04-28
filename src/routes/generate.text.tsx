import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/ComingSoon";

export const Route = createFileRoute("/generate/text")({
  head: () => ({
    meta: [
      { title: "Text to 3D — Snap3D" },
      { name: "description", content: "Describe what you want and generate a 3D model." },
    ],
  }),
  component: () => (
    <ComingSoon
      title="Text to 3D"
      blurb="Prompt-based 3D generation is being fine-tuned. Try Image to 3D in the meantime."
    />
  ),
});
