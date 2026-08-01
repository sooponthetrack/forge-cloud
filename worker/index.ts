import { db } from "@/lib/db";

/**
 * This file is the entrypoint for the Railway `worker` service (spec
 * section 27). Deploy it as its own Railway service pointed at
 * `npm run worker`, kept private (no public ingress).
 */

export async function processSplitReconciliation(stripeEventId: string) {
  const event = await db.stripe_events.findUnique({
    where: { stripe_event_id: stripeEventId },
  });
  if (!event) return;

  const payload = event.raw_payload_json as any;
  const type = event.event_type;

  if (type === "charge.succeeded") {
    const charge = payload.data.object;
    const tenantId = charge.metadata?.tenant_id;
    const connectedAccountId = charge.metadata?.connected_account_id;
    const grossAmount = charge.amount || 0;
    const currency = charge.currency || "usd";

    const split = await db.revenue_splits.findFirst({
      where: { tenant_id: tenantId, active: true },
      orderBy: { effective_from: "desc" },
    });

    if (!split) return;

    const platformFeeAmount = Math.round((grossAmount * Number(split.platform_share_pct)) / 100);
    const recipientAmount = grossAmount - platformFeeAmount;

    await db.payout_ledger.create({
      data: {
        stripe_event_id: stripeEventId,
        tenant_id: tenantId,
        connected_account_id: connectedAccountId,
        gross_amount: grossAmount,
        platform_fee_amount: platformFeeAmount,
        recipient_amount: recipientAmount,
        currency,
        status: "reserved",
        reference_type: "charge",
        reference_id: charge.id,
      },
    });
  }

  if (type === "charge.refunded") {
    const charge = payload.data.object;
    await db.payout_ledger.updateMany({
      where: { reference_type: "charge", reference_id: charge.id },
      data: { status: "reversed" },
    });
  }
}

/**
 * Minimal polling loop placeholder. Swap for a real queue (e.g. a
 * Postgres-backed job table, or Redis/BullMQ once the `redis` Railway
 * service from spec section 27 is provisioned) before relying on this
 * in production — polling `stripe_events` directly doesn't scale past
 * light traffic and has no backoff/retry policy.
 */
async function main() {
  console.log("ForgeCloud worker started");
  // TODO: subscribe to a real job queue and dispatch to
  // processSplitReconciliation / provisioning job handlers
  // (create-tenant, apply-template, allocate-storage, setup-backup,
  // setup-domain, issue-ssl, seed-template-data, verify-health,
  // send-welcome-email, sync-connected-account, update-payout-state).
}

main().catch((err) => {
  console.error("Worker crashed:", err);
  process.exit(1);
});
