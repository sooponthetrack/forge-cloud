import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "ForgeCloud",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-ivory text-ink antialiased">
        <div className="flex min-h-screen flex-col">
          <header className="px-6 py-6">
            <a href="/" className="font-display text-lg">
              ForgeCloud
            </a>
          </header>
          <main className="flex flex-1 items-center justify-center px-6 pb-16">{children}</main>
        </div>
      </body>
    </html>
  );
}
