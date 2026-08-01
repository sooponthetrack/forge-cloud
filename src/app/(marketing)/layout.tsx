import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "ForgeCloud — Private cloud that feels effortless",
  description:
    "Storage, app hosting, team workspaces, backups, and security — managed for you.",
};

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-ivory text-ink antialiased">{children}</body>
    </html>
  );
}
