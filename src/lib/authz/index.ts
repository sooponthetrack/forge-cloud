import { db } from "@/lib/db";
import { getSessionUserId } from "@/lib/auth/session";

export const ROLES = ["super_admin", "admin", "member", "deployer", "viewer"] as const;
export type Role = (typeof ROLES)[number];

/**
 * Permanent super admins (spec section 10). These accounts always resolve
 * to super_admin regardless of what's stored in the membership row, so a
 * compromised or mis-migrated DB row can never lock them out or elevate
 * someone else in their place.
 */
const PERMANENT_SUPER_ADMINS = new Set<string>([
  "ismail@soundforgearena.app",
  "soop@soundforgearena.app",
]);

export class UnauthorizedError extends Error {
  constructor(message = "Unauthorized") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends Error {
  constructor(message = "Forbidden") {
    super(message);
    this.name = "ForbiddenError";
  }
}

export interface AuthContext {
  user: { id: string; email: string };
  role: Role;
}

/**
 * Every RBAC guard below funnels through here, so this is the single
 * place session validation logic lives.
 */
async function getSession(): Promise<{ id: string; email: string } | null> {
  const userId = await getSessionUserId();
  if (!userId) return null;

  const user = await db.users.findUnique({ where: { id: userId } });
  if (!user) return null;

  return { id: user.id, email: user.email };
}

async function resolveRole(userId: string, email: string): Promise<Role> {
  if (PERMANENT_SUPER_ADMINS.has(email.toLowerCase())) {
    return "super_admin";
  }

  const membership = await db.memberships.findFirst({
    where: { user_id: userId },
    orderBy: { created_at: "desc" },
  });

  return (membership?.role as Role | undefined) ?? "viewer";
}

async function requireAuth(): Promise<AuthContext> {
  const user = await getSession();
  if (!user) throw new UnauthorizedError();
  const role = await resolveRole(user.id, user.email);
  return { user, role };
}

const ROLE_RANK: Record<Role, number> = {
  viewer: 0,
  member: 1,
  deployer: 1,
  admin: 2,
  super_admin: 3,
};

/** Require at least `minRole` (rank-based, e.g. admin also satisfies member checks). */
export async function requireRole(minRole: Role): Promise<AuthContext> {
  const ctx = await requireAuth();
  if (ROLE_RANK[ctx.role] < ROLE_RANK[minRole]) {
    throw new ForbiddenError(`Requires role "${minRole}" or higher`);
  }
  return ctx;
}

export async function requireAdmin(): Promise<AuthContext> {
  return requireRole("admin");
}

export async function requireSuperAdmin(): Promise<AuthContext> {
  return requireRole("super_admin");
}

/**
 * Split-management actions (spec section 11) additionally require these
 * gates on top of requireSuperAdmin(): 2FA-verified session, explicit
 * confirmation, and an audit log entry. Wire session.twoFactorVerified
 * once your session shape includes it — left explicit here rather than
 * silently skipped so it isn't forgotten.
 */
export async function requireSuperAdminWith2FA(): Promise<AuthContext> {
  const ctx = await requireSuperAdmin();
  // TODO: check ctx-linked session for a fresh 2FA verification and throw
  // ForbiddenError("2FA verification required") if missing/stale.
  return ctx;
}
