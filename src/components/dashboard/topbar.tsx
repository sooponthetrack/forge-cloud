"use client";

import { useRouter } from "next/navigation";

export function Topbar({ organizationName, userEmail }: { organizationName: string; userEmail: string }) {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="flex items-center justify-between border-b border-ink/10 bg-ivory px-6 py-4">
      <p className="text-sm font-semibold">{organizationName}</p>
      <div className="flex items-center gap-4">
        <p className="text-sm text-ink/60">{userEmail}</p>
        <button
          onClick={handleLogout}
          className="text-sm font-semibold text-ink/70 underline decoration-ink/30 underline-offset-4 hover:decoration-ink"
        >
          Log out
        </button>
      </div>
    </header>
  );
}
