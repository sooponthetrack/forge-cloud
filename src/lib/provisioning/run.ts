import { db } from "@/lib/db";
import { env } from "@/lib/env";

/**
 * Mirrors the worker job list in spec section 15/worker/index.ts. Runs
 * synchronously right after checkout completes rather than being dispatched
 * to the `worker` Railway service through a real queue — there's no queue
 * wired up yet (see worker/index.ts). Swap the call site in the webhook
 * handler for a queue publish once one exists; the step logic here doesn't
 * need to change.
 */
const JOB_SEQUENCE = [
  "apply-template",
  "allocate-storage",
  "setup-backup",
  "setup-domain",
  "issue-ssl",
  "seed-template-data",
  "verify-health",
  "send-welcome-email",
] as const;

type JobType = (typeof JOB_SEQUENCE)[number];

export async function runProvisioning(tenantId: string) {
  const tenant = await db.tenants.findUniqueOrThrow({
    where: { id: tenantId },
    include: { template: true },
  });

  for (const jobType of JOB_SEQUENCE) {
    const job = await db.tenant_provisions.create({
      data: { tenant_id: tenantId, job_type: jobType, status: "running" },
    });

    try {
      await runJob(jobType, tenant);
      await db.tenant_provisions.update({ where: { id: job.id }, data: { status: "completed" } });
    } catch (err: any) {
      await db.tenant_provisions.update({
        where: { id: job.id },
        data: { status: "failed", error: err?.message ?? "Unknown error" },
      });
      // A failed step shouldn't silently continue — the tenant stays in
      // "provisioning" and the failure is visible in tenant_provisions.
      throw err;
    }
  }

  await db.tenants.update({ where: { id: tenantId }, data: { status: "ready" } });
}

async function runJob(jobType: JobType, tenant: { id: string; template: { default_quota_gb: number; default_backup_policy: unknown } }) {
  switch (jobType) {
    case "apply-template":
      // Defaults live on the template relation already — nothing to copy
      // yet since there's no per-tenant override model. Placeholder for
      // when tenants gain their own settings row.
      return;

    case "allocate-storage":
      await db.storage_volumes.create({
        data: {
          tenant_id: tenant.id,
          quota_gb: tenant.template.default_quota_gb,
          ovh_bucket: env.OVH_S3_BUCKET,
          ovh_prefix: `tenants/${tenant.id}`,
        },
      });
      return;

    case "setup-backup": {
      const policy = (tenant.template.default_backup_policy as { retention_days?: number } | null) ?? {};
      await db.backup_jobs.create({
        data: { tenant_id: tenant.id, status: "scheduled", retention_days: policy.retention_days ?? 30 },
      });
      return;
    }

    case "setup-domain":
      // No domain requested at signup — the user connects one later from
      // the Apps page. Nothing to do here yet.
      return;

    case "issue-ssl":
      // Paired with setup-domain; no-op until a domain exists.
      return;

    case "seed-template-data":
      // Placeholder for template-specific starter content (e.g. a sample
      // folder structure). Nothing defined yet.
      return;

    case "verify-health":
      // Nothing to health-check yet with zero real infra provisioned —
      // this is where a real deployment would ping the new tenant's
      // resources before marking it ready.
      return;

    case "send-welcome-email":
      // TODO: wire a transactional email provider (Resend, Postmark, SES).
      return;
  }
}
