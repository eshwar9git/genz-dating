import { NextResponse } from "next/server";
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
        console.log("[vibed] subscription checkout completed", {
          customer: session.customer,
          tier: session.metadata?.tier,
          userId: session.metadata?.userId,
        });
        // Production: persist entitlement in your database here.
        break;
      }
      case "customer.subscription.deleted": {
        console.log("[vibed] subscription canceled", event.data.object.id);
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
