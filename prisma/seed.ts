import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const PLANS = [
  { slug: "starter", name: "Starter", price_cents: 1900 },
  { slug: "pro", name: "Pro", price_cents: 4900 },
  { slug: "team", name: "Team", price_cents: 9900 },
  { slug: "business", name: "Business", price_cents: 19900 },
];

const TEMPLATES = [
  {
    slug: "creator-vault",
    name: "Creator Vault",
    category: "creator",
    default_quota_gb: 50,
    default_backup_policy: { schedule: "nightly", retention_days: 30 },
    default_roles: ["admin", "member"],
    default_onboarding_checklist: ["Upload your first file", "Create a share link", "Invite a collaborator"],
    support_tier: "standard",
  },
  {
    slug: "founder-stack",
    name: "Founder Stack",
    category: "founder",
    default_quota_gb: 20,
    default_backup_policy: { schedule: "nightly", retention_days: 30 },
    default_roles: ["admin", "deployer", "viewer"],
    default_onboarding_checklist: ["Deploy your app", "Connect a domain", "Set environment variables"],
    support_tier: "standard",
  },
  {
    slug: "team-workspace",
    name: "Team Workspace",
    category: "team",
    default_quota_gb: 100,
    default_backup_policy: { schedule: "nightly", retention_days: 30 },
    default_roles: ["admin", "member", "viewer"],
    default_onboarding_checklist: ["Invite your team", "Create your first folder", "Set roles"],
    support_tier: "standard",
  },
  {
    slug: "client-vault",
    name: "Client Vault",
    category: "agency",
    default_quota_gb: 75,
    default_backup_policy: { schedule: "nightly", retention_days: 30 },
    default_roles: ["admin", "member", "viewer"],
    default_onboarding_checklist: ["Create your first client space", "Set handoff permissions"],
    support_tier: "priority",
  },
  {
    slug: "business-cloud",
    name: "Business Cloud",
    category: "business",
    default_quota_gb: 250,
    default_backup_policy: { schedule: "nightly", retention_days: 60 },
    default_roles: ["admin", "member", "viewer"],
    default_onboarding_checklist: ["Onboarding call scheduled", "Security review", "Restore test"],
    support_tier: "priority",
  },
];

async function main() {
  for (const plan of PLANS) {
    await db.plans.upsert({ where: { slug: plan.slug }, update: plan, create: plan });
  }

  for (const template of TEMPLATES) {
    await db.templates.upsert({
      where: { slug: template.slug },
      update: template,
      create: template,
    });
  }

  console.log(`Seeded ${PLANS.length} plans and ${TEMPLATES.length} templates.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
