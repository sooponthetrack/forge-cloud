import type { Metadata } from "next";
import { redirect } from "next/navigation";
import "@/styles/globals.css";
import { getDashboardContext } from "@/lib/dashboard/context";
import { UnauthorizedError } from "@/lib/authz";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Topbar } from "@/components/dashboard/topbar";

export const metadata: Metadata = {
  title: "Dashboard — ForgeCloud",
};

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  let ctx;
  try {
    ctx = await getDashboardContext();
  } catch (err) {
    if (err instanceof UnauthorizedError) {
      redirect("/login");
    }
    throw err;
  }

  return (
    <html lang="en">
      <body className="min-h-screen bg-ivory text-ink antialiased">
        <div className="flex min-h-screen">
          <Sidebar role={ctx.role} />
          <div className="flex flex-1 flex-col">
            <Topbar organizationName={ctx.organization.name} userEmail={ctx.user.email} />
            <main className="flex-1 px-6 py-8 md:px-10 md:py-10">
              <div className="mx-auto max-w-5xl">{children}</div>
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
