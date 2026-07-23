"use client";

import { Suspense, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { BrandMark, Button } from "@/components/ui";
import { useLocaleStore } from "@/lib/locale-store";
import { useAppStore } from "@/lib/store";
import type { SubscriptionTier } from "@/lib/types";

function SuccessInner() {
  const params = useSearchParams();
  const upgrade = useAppStore((s) => s.upgrade);
  const t = useLocaleStore((s) => s.t)();
  const tier = (params.get("tier") as SubscriptionTier) || "plus";

  useEffect(() => {
    if (tier === "plus" || tier === "ultra") upgrade(tier);
  }, [tier, upgrade]);

  return (
    <div className="mesh-bg flex min-h-dvh flex-col px-6 py-10">
      <BrandMark href="/discover" />
      <div className="mx-auto mt-16 w-full max-w-md text-center">
        <p className="text-sm uppercase tracking-[0.2em] text-mint">Stripe</p>
        <h1 className="mt-3 font-display text-3xl font-extrabold">
          {t.payments.successTitle}
        </h1>
        <p className="mt-3 text-sm text-muted">{t.payments.successBody}</p>
        <Link href="/discover" className="mt-8 block">
          <Button className="w-full" size="lg">
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
