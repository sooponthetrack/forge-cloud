import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { env } from "@/lib/env";

const SESSION_COOKIE = "fc_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30; // 30 days

function secretKey() {
  return new TextEncoder().encode(env.SESSION_SECRET);
}

export async function createSession(userId: string) {
  const token = await new SignJWT({ sub: userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(secretKey());

  cookies().set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: env.NODE_ENV !== "development",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
}

export async function getSessionUserId(): Promise<string | null> {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secretKey());
    return typeof payload.sub === "string" ? payload.sub : null;
  } catch {
    // expired, tampered, or wrong secret — treat as logged out rather than erroring
    return null;
  }
}

export function destroySession() {
  cookies().set(SESSION_COOKIE, "", { path: "/", maxAge: 0 });
}
