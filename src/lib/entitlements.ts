/**
 * Server-side entitlement log for Stripe webhooks.
 * Replace with Postgres/Supabase before multi-device production.
 * In-memory map is process-local (fine for single-instance / audit logs).
 */

export type EntitlementRecord = {
  userId: string;
  tier: "plus" | "ultra" | "free";
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  updatedAt: string;
  source: "checkout.session.completed" | "customer.subscription.deleted";
};

const g = globalThis as typeof globalThis & {
  __vibedEntitlements?: Map<string, EntitlementRecord>;
};

function store() {
  if (!g.__vibedEntitlements) g.__vibedEntitlements = new Map();
  return g.__vibedEntitlements;
}

export function upsertEntitlement(record: EntitlementRecord) {
  const key = record.userId || record.stripeCustomerId || "unknown";
  store().set(key, record);
  console.log("[vibed] entitlement upsert", record);
}

export function getEntitlement(userId: string) {
  return store().get(userId) ?? null;
}
