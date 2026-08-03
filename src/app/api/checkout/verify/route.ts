import { NextResponse } from "next/server";
import { getStripe, isStripeConfigured } from "@/lib/stripe";
import type { SubscriptionTier } from "@/lib/types";

/**
 * Verifies a Stripe Checkout session before granting Plus/Ultra in the client.
 * Never trust `?tier=` alone — always confirm payment_status via Stripe.
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.json(
      { ok: false, error: "Missing session_id" },
      { status: 400 }
    );
  }

  if (!isStripeConfigured()) {
    return NextResponse.json({
      ok: false,
      error: "Stripe not configured",
      demo: true,
    });
  }

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json(
      { ok: false, error: "Stripe unavailable" },
      { status: 500 }
    );
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const paid =
      session.payment_status === "paid" ||
      session.status === "complete";
    const tier = (session.metadata?.tier ?? "") as SubscriptionTier;
    const userId = session.metadata?.userId ?? "";

    if (!paid || (tier !== "plus" && tier !== "ultra")) {
      return NextResponse.json({
        ok: false,
        error: "Checkout not completed",
        paymentStatus: session.payment_status,
      });
    }

    return NextResponse.json({
      ok: true,
      tier,
      userId,
      customerEmail: session.customer_details?.email ?? session.customer_email,
      sessionId: session.id,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Verify failed";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
