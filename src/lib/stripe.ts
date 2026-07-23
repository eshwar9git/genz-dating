import Stripe from "stripe";
import type { SubscriptionTier } from "@/lib/types";

export function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key);
}

export function isStripeConfigured() {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

const PLAN_AMOUNTS: Record<
  Exclude<SubscriptionTier, "free">,
  { monthly: number; weekly: number; name: string }
> = {
  plus: { monthly: 19.99, weekly: 7.99, name: "vibed Plus" },
  ultra: { monthly: 34.99, weekly: 14.99, name: "vibed Ultra" },
};

/**
 * Checkout currency. Default USD for global reliability.
 * Set STRIPE_CHECKOUT_CURRENCY=eur (etc.) after enabling that currency in Stripe.
 */
export function checkoutCurrency() {
  return (process.env.STRIPE_CHECKOUT_CURRENCY || "usd").toLowerCase();
}

export function buildSubscriptionLineItem(
  tier: "plus" | "ultra",
  billing: "monthly" | "weekly"
) {
  const currency = checkoutCurrency();
  const plan = PLAN_AMOUNTS[tier];
  const amount = billing === "monthly" ? plan.monthly : plan.weekly;
  const zeroDecimal = ["jpy", "krw"].includes(currency);
  const unit_amount = zeroDecimal
    ? Math.round(amount * 100)
    : Math.round(amount * 100);

  return {
    price_data: {
      currency,
      unit_amount,
      recurring: {
        interval: (billing === "monthly" ? "month" : "week") as "month" | "week",
      },
      product_data: {
        name: plan.name,
        description: `${billing} subscription on vibed`,
        metadata: { tier, billing },
      },
    },
    quantity: 1,
  };
}
