import type { Metadata } from "next";
import { SettingsPage } from "@/components/pages/SettingsPage";

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage your profile and billing.",
};

export default function SettingsRoute() {
  return <SettingsPage />;
}
