import { db } from "@/lib/db";
import { getDashboardContext } from "@/lib/dashboard/context";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { StatusCard } from "@/components/dashboard/status-card";
import { QuickActions } from "@/components/dashboard/quick-actions";

export default async function OverviewPage() {
  const ctx = await getDashboardContext();

  if (!ctx.tenant) {
    return (
      <div>
        <PageHeader title="Overview" />
        <EmptyState
          title="No workspace yet"
          description="Create your first vault, app, or team space in under two minutes."
          ctaLabel="Start setup"
          ctaHref="/billing"
          helper="Choose a plan and your workspace is provisioned automatically."
        />
      </div>
    );
  }

  const tenant = ctx.tenant;

  const [latestBackup, openTickets, recentActivity, connectedAccount] = await Promise.all([
    db.backup_jobs.findFirst({ where: { tenant_id: tenant.id }, orderBy: { created_at: "desc" } }),
    db.support_tickets.count({ where: { tenant_id: tenant.id, status: "open" } }),
    db.audit_logs.findMany({
      where: { actor_user_id: ctx.user.id },
      orderBy: { created_at: "desc" },
      take: 5,
    }),
    db.connected_accounts.findFirst({ where: { user_id: ctx.user.id } }),
  ]);

  const backupTone = !latestBackup ? "muted" : latestBackup.status === "completed" ? "success" : "warning";
  const setupTone = tenant.status === "ready" ? "success" : tenant.status === "suspended" ? "danger" : "warning";

  return (
    <div>
      <PageHeader
        title="Overview"
        description={`${tenant.name} · ${tenant.template.name}`}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatusCard
          label="Plan status"
          value={tenant.subscription?.plan.name ?? "No active plan"}
          detail={tenant.subscription?.status}
          tone={tenant.subscription ? "success" : "warning"}
        />
        <StatusCard label="Setup progress" value={tenant.status} tone={setupTone} />
        <StatusCard
          label="Backup health"
          value={latestBackup ? latestBackup.status : "No backups yet"}
          detail={latestBackup ? new Date(latestBackup.created_at).toLocaleDateString() : undefined}
          tone={backupTone}
        />
        <StatusCard
          label="Security status"
          value={ctx.user.two_factor_enabled ? "2FA enabled" : "2FA not set up"}
          detail={ctx.user.two_factor_enabled ? undefined : "Set it up from Security"}
          tone={ctx.user.two_factor_enabled ? "success" : "warning"}
        />
        <StatusCard
          label="Support"
          value={openTickets > 0 ? `${openTickets} open ticket${openTickets === 1 ? "" : "s"}` : "No open tickets"}
          tone={openTickets > 0 ? "warning" : "success"}
        />
        {connectedAccount && (
          <StatusCard
            label="Payouts"
            value={connectedAccount.payouts_enabled ? "Enabled" : "Setup incomplete"}
            detail={connectedAccount.status}
            tone={connectedAccount.payouts_enabled ? "success" : "warning"}
          />
        )}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <QuickActions />

        <div className="card p-6">
          <h3 className="font-display text-lg">Recent activity</h3>
          {recentActivity.length === 0 ? (
            <p className="mt-3 text-sm text-ink/60">Nothing to show yet — activity will appear here as you use ForgeCloud.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {recentActivity.map((log) => (
                <li key={log.id} className="flex items-center justify-between text-sm">
                  <span className="text-ink/80">{log.action}</span>
                  <span className="text-xs text-muted">{new Date(log.created_at).toLocaleString()}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
