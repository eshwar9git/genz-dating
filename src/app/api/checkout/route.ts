import { NextResponse } from "next/server";
import {
  buildSubscriptionLineItem,
  getStripe,
  isStripeConfigured,
} from "@/lib/stripe";
import type { SubscriptionTier } from "@/lib/types";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const tier = body.tier as SubscriptionTier;
    const billing = (body.billing === "weekly" ? "weekly" : "monthly") as
      | "weekly"
      | "monthly";
    const email = typeof body.email === "string" ? body.email : undefined;
    const userId = typeof body.userId === "string" ? body.userId : undefined;
    const countryCode =
      typeof body.countryCode === "string" ? body.countryCode : undefined;
    const platform = body.platform === "native" ? "native" : "web";

    if (tier !== "plus" && tier !== "ultra") {
      return NextResponse.json(
        { error: "Invalid plan. Choose plus or ultra." },
        { status: 400 }
      );
    }

    if (!isStripeConfigured()) {
      return NextResponse.json({
        mode: "demo",
        message:
          "Stripe is not configured. Set STRIPE_SECRET_KEY to enable live checkout.",
        demoUpgrade: true,
        tier,
      });
    }

    const stripe = getStripe();
    if (!stripe) {
      return NextResponse.json({ error: "Stripe unavailable" }, { status: 500 });
    }

    const webOrigin =
      (typeof body.returnOrigin === "string" && body.returnOrigin) ||
      req.headers.get("origin") ||
      process.env.NEXT_PUBLIC_APP_URL ||
      "http://localhost:2000";

    // Native apps return via custom scheme so the WebView reopens after Checkout
    const successUrl =
      platform === "native"
        ? `vibed://premium/success?session_id={CHECKOUT_SESSION_ID}&tier=${tier}`
        : `${webOrigin}/premium/success?session_id={CHECKOUT_SESSION_ID}&tier=${tier}`;
    const cancelUrl =
      platform === "native"
        ? `vibed://premium/cancel`
        : `${webOrigin}/premium/cancel`;

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer_email: email,
      line_items: [buildSubscriptionLineItem(tier, billing)],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        userId: userId ?? "",
        tier,
        billing,
        countryCode: countryCode ?? "",
        platform,
      },
      allow_promotion_codes: true,
      billing_address_collection: "auto",
    });

    return NextResponse.json({
      mode: "stripe",
      url: session.url,
      sessionId: session.id,
      platform,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Checkout failed";
    console.error("Stripe checkout error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    configured: isStripeConfigured(),
    publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? null,
  });
}
