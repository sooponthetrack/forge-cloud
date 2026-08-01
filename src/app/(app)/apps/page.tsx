import { db } from "@/lib/db";
import { getDashboardContext } from "@/lib/dashboard/context";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";

const STATUS_TONE: Record<string, string> = {
  running: "text-success",
  stopped: "text-muted",
  deploying: "text-warning",
  failed: "text-danger",
};

export default async function AppsPage() {
  const ctx = await getDashboardContext();

  if (!ctx.tenant) {
    return (
      <div>
        <PageHeader title="Apps" description="Deploy an app, connect a domain, watch logs and health." />
        <EmptyState
          title="No workspace yet"
          description="Set up a workspace first, then you can deploy your first app."
          ctaLabel="Choose a plan"
          ctaHref="/billing"
        />
      </div>
    );
  }

  const [apps, domains] = await Promise.all([
    db.apps.findMany({ where: { tenant_id: ctx.tenant.id }, orderBy: { created_at: "desc" } }),
    db.domains.findMany({ where: { tenant_id: ctx.tenant.id } }),
  ]);

  return (
    <div>
      <PageHeader title="Apps" description="Deploy an app, connect a domain, watch logs and health." />
      {apps.length === 0 ? (
        <EmptyState
          title="No apps deployed"
          description="Deploy your first app to see logs, health, and environment variables here."
          ctaLabel="Deploy app"
          ctaHref="/apps"
          helper="Connects to your Git repo or a container image."
        />
      ) : (
        <div className="card divide-y divide-ink/10">
          {apps.map((a) => (
            <div key={a.id} className="flex items-center justify-between p-5">
              <div>
                <p className="text-sm font-medium">{a.name}</p>
                <p className="text-xs text-muted">{a.runtime}</p>
              </div>
              <p className={`text-sm font-medium ${STATUS_TONE[a.status] ?? "text-ink/70"}`}>{a.status}</p>
            </div>
          ))}
        </div>
      )}

      {domains.length > 0 && (
        <div className="card mt-4 divide-y divide-ink/10">
          {domains.map((d) => (
            <div key={d.id} className="flex items-center justify-between p-5">
              <p className="text-sm font-medium">{d.hostname}</p>
              <p className="text-sm text-ink/70">SSL: {d.ssl_status}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
