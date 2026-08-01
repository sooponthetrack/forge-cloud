import { NextResponse } from "next/server";
import { UnauthorizedError, ForbiddenError } from "@/lib/authz";

/**
 * Route handlers call requireAdmin()/requireSuperAdmin()/requireRole()
 * directly, which throw on failure. Without this, an uncaught throw inside
 * a Next.js route handler becomes a generic 500 with no useful status code
 * — not the 401/403 a client needs to distinguish "log in" from "you don't
 * have access". Every admin/auth-gated route should catch the guard call
 * and pass the error through this before doing anything else.
 *
 * Returns a response for auth errors, or null so the caller can decide
 * what to do with anything else (typically log it and return a generic 500).
 */
export function authErrorResponse(err: unknown): NextResponse | null {
  if (err instanceof UnauthorizedError) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (err instanceof ForbiddenError) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return null;
}
