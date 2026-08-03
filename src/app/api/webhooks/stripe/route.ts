import { NextResponse } from "next/server";
import { upsertEntitlement } from "@/lib/entitlements";
import { getStripe, isStripeConfigured } from "@/lib/stripe";

export async function POST(req: Request) {
  if (!isStripeConfigured()) {
    return NextResponse.json(
      { error: "Stripe not configured" },
      { status: 503 }
    );
  }

  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !secret) {
    return NextResponse.json(
      { error: "Webhook secret missing" },
      { status: 503 }
    );
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  const rawBody = await req.text();

  try {
    const event = stripe.webhooks.constructEvent(rawBody, signature, secret);

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const tier = session.metadata?.tier;
        const userId = session.metadata?.userId ?? "";
        if (tier === "plus" || tier === "ultra") {
          upsertEntitlement({
            userId,
            tier,
            stripeCustomerId:
              typeof session.customer === "string"
                ? session.customer
                : undefined,
            stripeSubscriptionId:
              typeof session.subscription === "string"
                ? session.subscription
                : undefined,
            updatedAt: new Date().toISOString(),
            source: "checkout.session.completed",
          });
        }
        break;
      }
      case "customer.subscription.deleted": {
        const sub = event.data.object;
        const userId =
          typeof sub.metadata?.userId === "string" ? sub.metadata.userId : "";
        upsertEntitlement({
          userId,
          tier: "free",
          stripeCustomerId:
            typeof sub.customer === "string" ? sub.customer : undefined,
          stripeSubscriptionId: sub.id,
          updatedAt: new Date().toISOString(),
          source: "customer.subscription.deleted",
        });
        break;
      }
      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Webhook error";
    console.error("Webhook error:", message);
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
