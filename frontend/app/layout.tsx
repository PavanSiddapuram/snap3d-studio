import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "@/components/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Snap3D — Turn Any Photo or Idea Into a 3D Model",
    template: "%s | Snap3D",
  },
  description:
    "AI-powered 3D model generation, free parametric tools, and instant downloads. No CAD skills needed.",
  openGraph: {
    siteName: "Snap3D",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
    >
      <body>
        <Navbar />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
