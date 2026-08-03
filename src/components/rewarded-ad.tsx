"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Play, X } from "lucide-react";
import { showRewardedAd, usesNativeAds } from "@/lib/ads";
import { AD_REWARDS } from "@/lib/constants";
import { useAppStore } from "@/lib/store";
import type { AdRewardKind } from "@/lib/types";
import { adRewardsRemaining, canWatchAdForReward } from "@/lib/utils";
import { Button } from "@/components/ui";
import Link from "next/link";

const AD_SECONDS = 5;

/**
 * Rewarded ad gate: AdMob on Capacitor native, 5s demo player on web.
 * Call onEarned when the network (or demo) marks the reward.
 */
export function RewardedAdGate({
  kind,
  open,
  onClose,
  onEarned,
}: {
  kind: AdRewardKind;
  open: boolean;
  onClose: () => void;
  onEarned?: (amount: number) => void;
}) {
  const user = useAppStore((s) => s.user);
  const claimAdReward = useAppStore((s) => s.claimAdReward);
  const [phase, setPhase] = useState<"ready" | "playing" | "done">("ready");
  const [left, setLeft] = useState(AD_SECONDS);
  const [error, setError] = useState("");
  const claimedRef = useRef(false);
  const onEarnedRef = useRef(onEarned);
  const native = usesNativeAds();

  const cfg = AD_REWARDS[kind];
  const remaining = user ? adRewardsRemaining(user, kind) : 0;

  useEffect(() => {
    onEarnedRef.current = onEarned;
  }, [onEarned]);

  const finishReward = () => {
    if (claimedRef.current) return;
    claimedRef.current = true;
    const res = claimAdReward(kind);
    if (res.blocked) {
      claimedRef.current = false;
      setError(
        res.blocked === "tier"
          ? "Your plan already has unlimited access."
          : "Daily ad limit reached. Come back tomorrow or upgrade."
      );
      setPhase("ready");
      return;
    }
    setPhase("done");
    onEarnedRef.current?.(res.amount ?? cfg.amount);
  };

  useEffect(() => {
    if (open) return;
    const id = window.setTimeout(() => {
      setPhase("ready");
      setLeft(AD_SECONDS);
      setError("");
      claimedRef.current = false;
    }, 0);
    return () => window.clearTimeout(id);
  }, [open]);

  // Web demo countdown
  useEffect(() => {
    if (!open || phase !== "playing" || native) return;
    if (left <= 0) {
      const id = window.setTimeout(() => finishReward(), 0);
      return () => window.clearTimeout(id);
    }
    const t = window.setTimeout(() => setLeft((s) => s - 1), 1000);
    return () => window.clearTimeout(t);
    // finishReward closes over latest claimAdReward/cfg via render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, phase, left, native]);

  const start = async () => {
    if (!user || !canWatchAdForReward(user, kind)) {
      setError(
        remaining <= 0
          ? `You've watched all ${cfg.maxPerDay} ${cfg.label} ads today.`
          : "Can't play an ad right now."
      );
      return;
    }
    setError("");
    claimedRef.current = false;

    if (native) {
      setPhase("playing");
      const result = await showRewardedAd();
      if (result.ok) {
        finishReward();
        return;
      }
      setPhase("ready");
      if (result.reason === "cancelled") {
        setError("Ad closed early — no reward this time.");
      } else {
        setError(
          result.message
            ? `Ad failed to load. Try again. (${result.message})`
            : "Ad failed to load. Check your connection and try again."
        );
      }
      return;
    }

    setLeft(AD_SECONDS);
    setPhase("playing");
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[90] flex items-end justify-center bg-ink/85 p-4 sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-label={`Watch ad for ${cfg.blurb}`}
        >
          <button
            type="button"
            className="absolute inset-0 cursor-default"
            aria-label="Close"
            onClick={() => {
              if (phase === "playing") return;
              onClose();
            }}
          />

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            className="relative z-10 w-full max-w-md overflow-hidden rounded-[28px] border border-white/10 bg-ink-soft"
          >
            <div className="relative aspect-video bg-gradient-to-br from-ink via-ink-elevated to-coral/30">
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                {phase === "playing" ? (
                  <>
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-cream/50">
                      Sponsored
                    </p>
                    <p className="mt-3 font-display text-2xl font-extrabold">
                      {native ? "Loading ad…" : "vibed partner spot"}
                    </p>
                    <p className="mt-2 text-sm text-cream/60">
                      {native
                        ? "Watch the full ad to unlock your reward."
                        : `Reward unlocks in ${left}s…`}
                    </p>
                    {!native && (
                      <div className="mt-5 h-1.5 w-40 overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full bg-mint transition-all duration-1000"
                          style={{
                            width: `${((AD_SECONDS - left) / AD_SECONDS) * 100}%`,
                          }}
                        />
                      </div>
                    )}
                  </>
                ) : phase === "done" ? (
                  <>
                    <p className="font-display text-3xl font-extrabold text-mint">
                      {cfg.blurb}
                    </p>
                    <p className="mt-2 text-sm text-cream/65">
                      Added to today&apos;s Free quota.
                    </p>
                  </>
                ) : (
                  <>
                    <Play className="h-10 w-10 text-coral" />
                    <p className="mt-3 font-display text-xl font-bold">
                      Watch a short ad
                    </p>
                    <p className="mt-1.5 text-sm text-muted">
                      Earn {cfg.blurb}. {remaining} of {cfg.maxPerDay} left today.
                    </p>
                  </>
                )}
              </div>
              {phase !== "playing" && (
                <button
                  type="button"
                  onClick={onClose}
                  className="absolute right-3 top-3 rounded-full border border-white/15 bg-ink/60 p-2 text-cream/80"
                  aria-label="Close ad"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="space-y-3 p-5">
              {error && <p className="text-sm text-coral">{error}</p>}

              {phase === "ready" && (
                <>
                  <Button className="w-full" size="lg" onClick={() => void start()}>
                    <Play className="h-4 w-4" />
                    Watch ad for {cfg.blurb}
                  </Button>
                  <Link
                    href="/premium"
                    className="block text-center text-sm font-semibold text-mint"
                    onClick={onClose}
                  >
                    Or upgrade for unlimited →
                  </Link>
                </>
              )}

              {phase === "playing" && (
                <p className="text-center text-xs text-muted">
                  {native
                    ? "The ad opens full-screen — finish it to earn the reward."
                    : "Stay on this screen — closing early cancels the reward."}
                </p>
              )}

              {phase === "done" && (
                <Button className="w-full" size="lg" variant="mint" onClick={onClose}>
                  Keep going
                </Button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function AdLimitBanner({
  kind,
  title,
  body,
  onWatchAd,
}: {
  kind: AdRewardKind;
  title: string;
  body: string;
  onWatchAd: () => void;
}) {
  const user = useAppStore((s) => s.user)!;
  const remaining = adRewardsRemaining(user, kind);
  const canWatch = canWatchAdForReward(user, kind);
  const cfg = AD_REWARDS[kind];

  return (
    <div className="relative overflow-hidden rounded-3xl border border-sand/30 bg-gradient-to-br from-sand/20 via-ink-elevated to-ink-soft p-5">
      <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-sand/25 blur-2xl" />
      <p className="relative font-display text-xl font-bold text-cream">{title}</p>
      <p className="relative mt-1.5 text-sm leading-relaxed text-cream/65">{body}</p>

      <div className="relative mt-4 flex flex-col gap-2 sm:flex-row">
        {canWatch ? (
          <Button className="flex-1" onClick={onWatchAd}>
            <Play className="h-4 w-4" />
            Watch ad · {cfg.blurb} ({remaining} left today)
          </Button>
        ) : (
          <p className="flex-1 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-muted">
            Ad limit hit ({cfg.maxPerDay}/{cfg.maxPerDay} today). Resets at midnight.
          </p>
        )}
        <Link href="/premium" className="sm:shrink-0">
          <Button variant="mint" className="w-full sm:w-auto">
            Upgrade
          </Button>
        </Link>
      </div>
    </div>
  );
}
