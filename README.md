# ForgeCloud

Private cloud that feels effortless — storage, app hosting, team workspaces,
backups, and security, managed for you.

## Stack

Next.js (App Router) · TypeScript · Tailwind · Postgres via Prisma · Stripe
(subscriptions + Stripe Connect Express for revenue splits) · OVH Object
Storage (S3-compatible) for files, app artifacts, and backups.

## Status

This is an early build. Working:

- Public marketing site and pricing page
- Auth (signup/login/logout) with scrypt password hashing and signed
  session cookies
- Server-side RBAC (`super_admin` / `admin` / `member` / `deployer` /
  `viewer`), enforced on every route, not just hidden in the UI
- Dashboard shell — Overview, Vault, Apps, Team, Backups, Billing,
  Security, Support
- Stripe Checkout → webhook → automatic tenant provisioning pipeline
- Admin console — templates, tenants (suspend/reactivate), revenue splits
  (super-admin only), audit logs, payments
- OVH Object Storage integration for tenant files and backups

Not built yet: backup/restore execution, 2FA enrollment, a real
plan/template picker (currently a fixed plan→template map), transactional
email, rate limiting.

## Local setup

```bash
npm install
cp .env.example .env      # fill in real values — DATABASE_URL, SESSION_SECRET,
                           # STRIPE_*, OVH_S3_*
npx prisma db push        # or `prisma migrate dev` once there's a real dev DB
npm run db:seed           # loads default plans + templates
npm run dev
```

## Deployment

Three services, matching `railway` conventions:

- `web` — `npm run build` / `npm start`
- `worker` — background job runner (`npm run worker`)
- `db` — Postgres

Keep `db` and any queue/cache service private; expose only `web`. Secrets
live in the platform's environment variables, never in the repo.
