"use client";

import { usePathname } from "next/navigation";

const TABS = [
  { label: "Overview", href: "/admin" },
  { label: "Templates", href: "/admin/templates" },
  { label: "Tenants", href: "/admin/tenants" },
  { label: "Splits", href: "/admin/splits" },
  { label: "Audit logs", href: "/admin/audit-logs" },
  { label: "Payments", href: "/admin/payments" },
];

export function AdminTabs() {
  const pathname = usePathname();

  return (
    <div className="mb-8 flex flex-wrap gap-2 border-b border-ink/10 pb-4">
      {TABS.map((t) => {
        const active = pathname === t.href;
        return (
          <a
            key={t.href}
            href={t.href}
            className={`rounded-card px-3.5 py-1.5 text-sm font-medium transition ${
              active ? "bg-charcoal text-ivory" : "text-ink/70 hover:bg-ink/5"
            }`}
          >
            {t.label}
          </a>
        );
      })}
    </div>
  );
}
