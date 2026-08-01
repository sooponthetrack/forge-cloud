const QUICK_ACTIONS = [
  { label: "Upload files", href: "/vault" },
  { label: "Deploy app", href: "/apps" },
  { label: "Invite user", href: "/team" },
  { label: "Create backup", href: "/backups" },
  { label: "Restore backup", href: "/backups" },
  { label: "Connect domain", href: "/apps" },
  { label: "Upgrade plan", href: "/billing" },
];

export function QuickActions() {
  return (
    <div className="card p-6">
      <h3 className="font-display text-lg">Quick actions</h3>
      <div className="mt-4 flex flex-wrap gap-2">
        {QUICK_ACTIONS.map((a) => (
          <a
            key={a.label}
            href={a.href}
            className="rounded-card border border-ink/15 bg-white px-3.5 py-2 text-sm font-medium text-ink/80 transition hover:border-ember hover:text-ink"
          >
            {a.label}
          </a>
        ))}
      </div>
    </div>
  );
}
