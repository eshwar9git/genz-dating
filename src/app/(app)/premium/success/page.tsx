"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui";
import { useLocaleStore } from "@/lib/locale-store";
import { useAppStore } from "@/lib/store";
import type { SubscriptionTier } from "@/lib/types";

function SuccessInner() {
  const params = useSearchParams();
  const upgrade = useAppStore((s) => s.upgrade);
  const user = useAppStore((s) => s.user);
  const t = useLocaleStore((s) => s.t)();
  const sessionId = params.get("session_id");
  const tierHint = params.get("tier") as SubscriptionTier | null;
  const [status, setStatus] = useState<"loading" | "ok" | "error">("loading");
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function apply() {
      // Demo checkout (no Stripe keys): allow local upgrade from tier hint only
      if (!sessionId) {
        if (tierHint === "plus" || tierHint === "ultra") {
          upgrade(tierHint);
          if (!cancelled) setStatus("ok");
          return;
        }
        if (!cancelled) {
          setError("Missing checkout session.");
          setStatus("error");
        }
        return;
      }

      try {
        const res = await fetch(
          `/api/checkout/verify?session_id=${encodeURIComponent(sessionId)}`
        );
        const data = (await res.json()) as {
          ok?: boolean;
          tier?: SubscriptionTier;
          userId?: string;
          error?: string;
          demo?: boolean;
        };

        if (data.demo) {
          // Stripe not configured — fall back carefully
          if (tierHint === "plus" || tierHint === "ultra") {
            upgrade(tierHint);
            if (!cancelled) setStatus("ok");
            return;
          }
        }

        if (!data.ok || (data.tier !== "plus" && data.tier !== "ultra")) {
          if (!cancelled) {
            setError(data.error || "Could not verify payment.");
            setStatus("error");
          }
          return;
        }

        // Prefer verifying the session belongs to this user when metadata set
        if (
          data.userId &&
          user?.id &&
          data.userId !== user.id &&
          data.userId.length > 0
        ) {
          if (!cancelled) {
            setError("This checkout belongs to a different account.");
            setStatus("error");
          }
          return;
        }

        upgrade(data.tier);
        if (!cancelled) setStatus("ok");
      } catch {
        if (!cancelled) {
          setError("Network error verifying payment.");
          setStatus("error");
        }
      }
    }

    void apply();
    return () => {
      cancelled = true;
    };
  }, [sessionId, tierHint, upgrade, user?.id]);

  return (
    <div className="mesh-bg flex min-h-dvh flex-col px-6 py-10">
      <div className="mx-auto mt-16 w-full max-w-md text-center">
        <p className="text-sm uppercase tracking-[0.2em] text-mint">Stripe</p>
        <h1 className="mt-3 font-display text-3xl font-extrabold">
          {status === "loading"
            ? "Confirming payment…"
            : status === "ok"
              ? t.payments.successTitle
              : "Payment not confirmed"}
        </h1>
        <p className="mt-3 text-sm text-muted">
          {status === "loading"
            ? "Verifying your Checkout session with Stripe."
            : status === "ok"
              ? t.payments.successBody
              : error}
        </p>
        <Link href="/discover" className="mt-8 block">
          <Button className="w-full" size="lg" disabled={status === "loading"}>
            {t.payments.backDiscover}
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default function PremiumSuccessPage() {
  return (
    <Suspense fallback={<div className="mesh-bg min-h-dvh" />}>
      <SuccessInner />
    </Suspense>
  );
}
