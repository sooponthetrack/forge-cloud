"use client";

import { usePathname } from "next/navigation";
import type { Role } from "@/lib/authz";

const NAV_ITEMS: { label: string; href: string; minRole?: Role }[] = [
  { label: "Overview", href: "/dashboard" },
  { label: "Vault", href: "/vault" },
  { label: "Apps", href: "/apps" },
  { label: "Team", href: "/team" },
  { label: "Backups", href: "/backups" },
  { label: "Billing", href: "/billing" },
  { label: "Security", href: "/security" },
  { label: "Support", href: "/support" },
  { label: "Admin", href: "/admin", minRole: "admin" },
];

const ROLE_RANK: Record<Role, number> = { viewer: 0, member: 1, deployer: 1, admin: 2, super_admin: 3 };

export function Sidebar({ role }: { role: Role }) {
  const pathname = usePathname();

  return (
    <nav className="flex w-56 shrink-0 flex-col gap-1 border-r border-ink/10 bg-stone/40 px-4 py-6">
      <p className="eyebrow mb-3 px-2">ForgeCloud</p>
      {NAV_ITEMS.filter((item) => !item.minRole || ROLE_RANK[role] >= ROLE_RANK[item.minRole]).map((item) => {
        const active = pathname === item.href;
        return (
          <a
            key={item.href}
            href={item.href}
            className={`rounded-card px-3 py-2 text-sm font-medium transition ${
              active ? "bg-charcoal text-ivory" : "text-ink/75 hover:bg-ink/5"
            }`}
          >
            {item.label}
          </a>
        );
      })}
    </nav>
  );
}
