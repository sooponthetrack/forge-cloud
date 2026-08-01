import { z } from "zod";

/**
 * Central env schema. Every secret lives in Railway environment variables
 * (per spec section 20/27) — never commit a filled-in .env file.
 */
const envSchema = z.object({
  DATABASE_URL: z.string().min(1),

  // Signs session cookies (src/lib/auth/session.ts). Generate with
  // `openssl rand -base64 32` and set it in Railway variables — never commit it.
  SESSION_SECRET: z.string().min(32),

  STRIPE_SECRET_KEY: z.string().min(1),
  STRIPE_WEBHOOK_SECRET: z.string().min(1),

  // OVH Cloud Storage — S3-compatible object storage.
  // Used to satisfy the tech-stack requirement for "S3-compatible storage"
  // (spec section 26) for vault files, app artifacts, and backup archives.
  OVH_S3_ENDPOINT: z.string().min(1), // e.g. https://s3.gra.io.cloud.ovh.net
  OVH_S3_REGION: z.string().min(1), // e.g. gra
  OVH_S3_BUCKET: z.string().min(1),
  OVH_S3_ACCESS_KEY_ID: z.string().min(1),
  OVH_S3_SECRET_ACCESS_KEY: z.string().min(1),

  APP_URL: z.string().url(),
  NODE_ENV: z.enum(["development", "staging", "production"]).default("development"),
});

export type Env = z.infer<typeof envSchema>;

function loadEnv(): Env {
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    // Fail loudly at boot rather than at first use.
    console.error("Invalid environment configuration:", parsed.error.flatten().fieldErrors);
    throw new Error("Invalid environment configuration");
  }
  return parsed.data;
}

export const env = loadEnv();
