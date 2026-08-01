import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { env } from "@/lib/env";

/**
 * OVH Cloud Storage is S3-compatible, so it slots directly into the
 * "S3-compatible storage" line item in the tech stack (spec section 26).
 * This client is used for: vault files, app deploy artifacts, and
 * backup/restore archives (storage_volumes + backup_jobs tables).
 *
 * Required env vars (see .env.example):
 *   OVH_S3_ENDPOINT   e.g. https://s3.gra.io.cloud.ovh.net
 *   OVH_S3_REGION     e.g. gra
 *   OVH_S3_BUCKET
 *   OVH_S3_ACCESS_KEY_ID
 *   OVH_S3_SECRET_ACCESS_KEY
 */
export const ovhStorage = new S3Client({
  region: env.OVH_S3_REGION,
  endpoint: env.OVH_S3_ENDPOINT,
  forcePathStyle: true, // required by most OVH-compatible S3 endpoints
  credentials: {
    accessKeyId: env.OVH_S3_ACCESS_KEY_ID,
    secretAccessKey: env.OVH_S3_SECRET_ACCESS_KEY,
  },
});

const bucket = env.OVH_S3_BUCKET;

/** Namespace every object under the owning tenant so a leaked prefix can't cross tenants. */
function tenantKey(tenantId: string, path: string) {
  return `tenants/${tenantId}/${path.replace(/^\/+/, "")}`;
}

export async function putTenantObject(tenantId: string, path: string, body: Buffer | Uint8Array, contentType?: string) {
  const key = tenantKey(tenantId, path);
  await ovhStorage.send(
    new PutObjectCommand({ Bucket: bucket, Key: key, Body: body, ContentType: contentType })
  );
  return key;
}

export async function getSignedDownloadUrl(tenantId: string, path: string, expiresInSeconds = 300) {
  const key = tenantKey(tenantId, path);
  const command = new GetObjectCommand({ Bucket: bucket, Key: key });
  return getSignedUrl(ovhStorage, command, { expiresIn: expiresInSeconds });
}

export async function deleteTenantObject(tenantId: string, path: string) {
  const key = tenantKey(tenantId, path);
  await ovhStorage.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
}

export async function tenantObjectExists(tenantId: string, path: string) {
  const key = tenantKey(tenantId, path);
  try {
    await ovhStorage.send(new HeadObjectCommand({ Bucket: bucket, Key: key }));
    return true;
  } catch {
    return false;
  }
}

/** Backup archives get their own prefix so retention/lifecycle rules can target them separately. */
export function backupObjectPath(tenantId: string, backupJobId: string) {
  return `backups/${tenantId}/${backupJobId}.tar.zst`;
}
