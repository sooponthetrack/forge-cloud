/**
 * The spec doesn't define an explicit plan↔template picker UI yet (that's
 * still open — see README), so checkout pairs each plan with a sensible
 * default template rather than requiring a separate selection step.
 * Revisit once a real template-picker exists on the pricing/billing page.
 */
export const PLAN_TEMPLATE_MAP: Record<string, string> = {
  starter: "creator-vault",
  pro: "founder-stack",
  team: "team-workspace",
  business: "business-cloud",
};
