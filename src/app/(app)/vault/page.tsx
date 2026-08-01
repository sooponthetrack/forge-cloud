import { db } from "@/lib/db";
import { getDashboardContext } from "@/lib/dashboard/context";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";

function formatBytes(bytes: bigint | number) {
  const n = Number(bytes);
  if (n < 1024) return `${n} B`;
  const units = ["KB", "MB", "GB", "TB"];
  let value = n / 1024;
  let i = 0;
  while (value >= 1024 && i < units.length - 1) {
    value /= 1024;
    i++;
  }
  return `${value.toFixed(1)} ${units[i]}`;
}

export default async function VaultPage() {
  const ctx = await getDashboardContext();

  if (!ctx.tenant) {
    return (
      <div>
        <PageHeader title="Vault" description="Private storage for your files, with share links and backups." />
        <EmptyState
          title="No workspace yet"
          description="Set up a workspace first, then your vault is ready to use."
          ctaLabel="Choose a plan"
          ctaHref="/billing"
        />
      </div>
    );
  }

  const volumes = await db.storage_volumes.findMany({ where: { tenant_id: ctx.tenant.id } });

  return (
    <div>
      <PageHeader title="Vault" description="Private storage for your files, with share links and backups." />
      {volumes.length === 0 ? (
        <EmptyState
          title="No files yet"
          description="Upload your first file to start building your vault."
          ctaLabel="Upload files"
          ctaHref="/vault"
          helper="Drag and drop, or connect a folder to sync automatically."
        />
      ) : (
        <div className="card divide-y divide-ink/10">
          {volumes.map((v) => (
            <div key={v.id} className="flex items-center justify-between p-5">
              <div>
                <p className="text-sm font-medium">{v.ovh_bucket}</p>
                <p className="text-xs text-muted">{v.ovh_prefix}</p>
              </div>
              <p className="text-sm text-ink/70">
                {formatBytes(v.used_bytes)} / {v.quota_gb} GB
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
