import { cache } from "react";
import { db } from "@/lib/db";
import { requireRole, type Role } from "@/lib/authz";

export interface DashboardContext {
  user: { id: string; email: string; name: string | null; two_factor_enabled: boolean };
  role: Role;
  organization: { id: string; name: string };
  /** First tenant only, for now — good enough until an org can own several. */
  tenant: Awaited<ReturnType<typeof loadTenant>>;
}

async function loadTenant(organizationId: string) {
  return db.tenants.findFirst({
    where: { organization_id: organizationId },
    include: { template: true, subscription: { include: { plan: true } } },
    orderBy: { created_at: "asc" },
  });
}

/**
 * Every (app) page calls this once. It enforces auth (redirects handled by
 * the layout, not here — this just throws UnauthorizedError) and hands back
 * the org + first tenant so pages don't each write their own membership
 * lookup.
 */
export const getDashboardContext = cache(async (): Promise<DashboardContext> => {
  const auth = await requireRole("viewer");

  const membership = await db.memberships.findFirst({
    where: { user_id: auth.user.id },
    orderBy: { created_at: "asc" },
    include: { organization: true },
  });

  if (!membership) {
    // Shouldn't happen — signup always creates one — but don't 500 on it.
    throw new Error("No organization found for this account");
  }

  const user = await db.users.findUniqueOrThrow({ where: { id: auth.user.id } });
  const tenant = await loadTenant(membership.organization_id);

  return {
    user: { id: user.id, email: user.email, name: user.name, two_factor_enabled: user.two_factor_enabled },
    role: auth.role,
    organization: { id: membership.organization.id, name: membership.organization.name },
    tenant,
  };
});
