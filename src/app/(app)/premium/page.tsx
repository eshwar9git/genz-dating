"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Check, Crown, Globe, Loader2 } from "lucide-react";
import { Button } from "@/components/ui";
import { COUNTRIES, PLANS } from "@/lib/constants";
import { useLocaleStore } from "@/lib/locale-store";
import { useAppStore } from "@/lib/store";
import type { SubscriptionTier } from "@/lib/types";
import { isNativeApp, openStripeCheckout } from "@/lib/payments";
import { canUsePassport, cn, formatPrice } from "@/lib/utils";

export default function PremiumPage() {
  const user = useAppStore((s) => s.user)!;
  const upgrade = useAppStore((s) => s.upgrade);
  const setPassport = useAppStore((s) => s.setPassport);
  const t = useLocaleStore((s) => s.t)();
  const [billing, setBilling] = useState<"weekly" | "monthly">("monthly");
  const [toast, setToast] = useState("");
  const [loadingTier, setLoadingTier] = useState<SubscriptionTier | null>(null);
  const [stripeReady, setStripeReady] = useState<boolean | null>(null);
  const [passportCity, setPassportCity] = useState(
    user.passportCity ?? COUNTRIES[0].cities[0]
  );
  const [passportCountry, setPassportCountry] = useState(
    user.passportCountry ?? COUNTRIES[0].name
  );

  useEffect(() => {
    fetch("/api/checkout")
      .then((r) => r.json())
      .then((d) => setStripeReady(Boolean(d.configured)))
      .catch(() => setStripeReady(false));
  }, []);

  const subscribe = async (tier: SubscriptionTier) => {
    if (tier === "free") {
      upgrade("free");
      setToast("Back on Free — daily limits apply.");
      return;
    }

    setLoadingTier(tier);
    setToast(t.payments.processing);

    try {
      const native = isNativeApp();
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tier,
          billing,
          email: user.email,
          userId: user.id,
          countryCode: user.countryCode,
          platform: native ? "native" : "web",
          returnOrigin: window.location.origin,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setToast(data.error || "Checkout failed");
        setLoadingTier(null);
        return;
      }

      if (data.mode === "stripe" && data.url) {
        await openStripeCheckout(data.url);
        setToast(
          native
            ? "Complete payment in the browser — you'll return to vibed automatically."
            : t.payments.processing
        );
        return;
      }

      // Demo fallback when Stripe keys are not set
      if (data.demoUpgrade) {
        upgrade(tier);
        setToast(
          `${PLANS.find((p) => p.id === tier)?.name} activated locally. ${t.premium.demoMode}`
        );
      }
    } catch {
      setToast("Network error — try again");
    } finally {
      setLoadingTier(null);
    }
  };

  return (
    <div className="px-4 pt-5 pb-10">
      <div>
        <p className="text-sm uppercase tracking-[0.18em] text-mint">
          {t.premium.eyebrow}
        </p>
        <h1 className="mt-1 font-display text-3xl font-bold">
          {t.premium.title}{" "}
          <span className="text-coral">{t.premium.titleAccent}</span>
        </h1>
        <p className="mt-2 text-sm text-muted">{t.premium.body}</p>
        <p className="mt-2 text-xs text-mint">
          {stripeReady
            ? t.premium.paySecure
            : stripeReady === false
              ? t.premium.demoMode
              : t.common.loading}
        </p>
      </div>

      <div className="mt-5 flex rounded-2xl border border-line bg-ink-soft p-1">
        {(["weekly", "monthly"] as const).map((b) => (
          <button
            key={b}
            type="button"
            onClick={() => setBilling(b)}
            className={cn(
              "flex-1 rounded-xl py-2 text-sm font-semibold capitalize transition",
              billing === b ? "bg-coral text-white" : "text-muted"
            )}
          >
            {b === "weekly" ? t.premium.weekly : t.premium.monthly}
          </button>
        ))}
      </div>

      <div className="mt-5 space-y-3">
        {PLANS.map((plan) => {
          const price =
            billing === "monthly" ? plan.priceMonthly : plan.priceWeekly;
          const active = user.tier === plan.id;
          const busy = loadingTier === plan.id;
          return (
            <div
              key={plan.id}
              className={cn(
                "rounded-3xl border p-5",
                plan.highlighted
                  ? "border-coral/50 bg-gradient-to-br from-coral/20 to-ink-elevated"
                  : "border-line bg-ink-soft",
                active && "ring-2 ring-mint"
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-display text-xl font-bold">{plan.name}</h2>
                    {plan.highlighted && (
                      <span className="rounded-full bg-coral px-2 py-0.5 text-[10px] font-bold uppercase">
                        Popular
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-muted">{plan.tagline}</p>
                </div>
                <div className="text-right">
                  <p className="font-display text-2xl font-bold">
                    {formatPrice(price)}
                  </p>
                  {price > 0 && (
                    <p className="text-[11px] text-muted">
                      /{billing === "monthly" ? "mo" : "wk"}
                    </p>
                  )}
                </div>
              </div>
              <ul className="mt-4 space-y-2">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-mint" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Button
                className="mt-5 w-full"
                variant={
                  active ? "secondary" : plan.id === "ultra" ? "mint" : "primary"
                }
                disabled={active || busy}
                onClick={() => subscribe(plan.id)}
              >
                {busy ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {t.payments.processing}
                  </>
                ) : active ? (
                  <>
                    <Crown className="h-4 w-4" /> {t.premium.currentPlan}
                  </>
                ) : plan.id === "free" ? (
                  t.premium.downgrade
                ) : (
                  t.premium.getPlan
                )}
              </Button>
            </div>
          );
        })}
      </div>

      <section className="mt-8 rounded-3xl border border-line bg-ink-elevated/50 p-5">
        <div className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-mint" />
          <h2 className="font-display text-lg font-bold">{t.premium.passport}</h2>
        </div>
        <p className="mt-1 text-sm text-muted">{t.premium.passportBody}</p>
        {canUsePassport(user) ? (
          <div className="mt-4 space-y-3">
            <select
              className="w-full rounded-2xl border border-line bg-ink-soft px-3 py-3 outline-none"
              value={`${passportCountry}|${passportCity}`}
              onChange={(e) => {
                const [country, city] = e.target.value.split("|");
                setPassportCountry(country);
                setPassportCity(city);
              }}
            >
              {COUNTRIES.flatMap((c) =>
                c.cities.map((city) => (
                  <option key={`${c.code}-${city}`} value={`${c.name}|${city}`}>
                    {city}, {c.name}
                  </option>
                ))
              )}
            </select>
            <Button
              variant="mint"
              className="w-full"
              onClick={() => {
                setPassport(passportCity, passportCountry);
                setToast(`Passport → ${passportCity}, ${passportCountry}`);
              }}
            >
              {t.premium.setPassport}
            </Button>
          </div>
        ) : (
          <Button className="mt-4 w-full" onClick={() => subscribe("ultra")}>
            {t.premium.unlockUltra}
          </Button>
        )}
      </section>

      {toast && (
        <p className="mt-4 rounded-2xl border border-mint/30 bg-mint/10 px-4 py-3 text-sm text-mint">
          {toast}
        </p>
      )}

      <Link
        href="/discover"
        className="mt-6 block text-center text-sm text-muted hover:text-cream"
      >
        ← {t.payments.backDiscover}
      </Link>
    </div>
  );
}
