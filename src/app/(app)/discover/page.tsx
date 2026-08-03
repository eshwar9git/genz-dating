"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Compass, SlidersHorizontal, Sparkles } from "lucide-react";
import {
  MatchCelebration,
  type MatchCelebrationData,
} from "@/components/match-celebration";
import { ProfileCard } from "@/components/profile-card";
import { AdLimitBanner, RewardedAdGate } from "@/components/rewarded-ad";
import { Button } from "@/components/ui";
import { MOCK_PROFILES } from "@/lib/mock-data";
import { useLocaleStore } from "@/lib/locale-store";
import { useAppStore } from "@/lib/store";
import type { AdRewardKind } from "@/lib/types";
import {
  canRewind,
  effectiveLikesLimit,
  lookingForLabel,
  maybeResetUsage,
  remainingLabel,
} from "@/lib/utils";

export default function DiscoverPage() {
  const user = useAppStore((s) => s.user)!;
  const like = useAppStore((s) => s.like);
  const pass = useAppStore((s) => s.pass);
  const superLike = useAppStore((s) => s.superLike);
  const rewind = useAppStore((s) => s.rewind);
  const t = useLocaleStore((s) => s.t)();
  const [celebration, setCelebration] = useState<MatchCelebrationData | null>(
    null
  );
  const [limitKind, setLimitKind] = useState<AdRewardKind | "super" | null>(
    null
  );
  const [adOpen, setAdOpen] = useState(false);

  const showVibed = (
    profile: { name: string; photos: string[] },
    matchId?: string
  ) => {
    setCelebration({
      name: profile.name,
      photo: profile.photos[0],
      myPhoto: user.photos[0],
      matchId,
    });
  };

  const deck = useMemo(() => {
    const seen = new Set([...user.likedIds, ...user.passedIds]);
    const prefs = user.preferences;
    const blocked = new Set(user.blockedIds ?? []);
    return MOCK_PROFILES.filter((p) => {
      if (p.id === user.id || seen.has(p.id) || blocked.has(p.id)) return false;
      if (!prefs.genders.includes(p.gender)) return false;
      if (p.age < prefs.ageMin || p.age > prefs.ageMax) return false;
      if (!prefs.globalMode && p.distanceKm > prefs.maxDistanceKm) return false;
      if (
        prefs.lookingFor.length > 0 &&
        !p.lookingFor.some((lf) => prefs.lookingFor.includes(lf))
      ) {
        return false;
      }
      return true;
    });
  }, [user]);

  const current = deck[0];
  const usage = maybeResetUsage(user.usage);
  const likesLimit = effectiveLikesLimit(user.tier, usage);

  const handleLike = () => {
    if (!current) return;
    const res = like(current.id);
    if (res.blocked === "limit") {
      setLimitKind("likes");
      return;
    }
    if (res.matched) showVibed(current, res.matchId);
  };

  const handleSuper = () => {
    if (!current) return;
    const res = superLike(current.id);
    if (res.blocked === "limit") {
      setLimitKind("super");
      return;
    }
    if (res.matched) showVibed(current, res.matchId);
  };

  const handlePass = () => {
    if (!current) return;
    pass(current.id);
  };

  const handleRewind = () => {
    const res = rewind();
    if (res.blocked === "limit") setLimitKind("rewinds");
  };

  return (
    <div className="relative flex min-h-[calc(100dvh-var(--app-nav-clearance))] flex-col px-4 pt-5">
      <div className="pointer-events-none absolute -left-10 top-20 h-40 w-40 rounded-full bg-coral/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-8 top-40 h-36 w-36 rounded-full bg-mint/10 blur-3xl" />

      <header className="relative z-10 mb-3 flex items-center justify-between">
        <h1 className="font-display text-2xl font-extrabold tracking-tight">
          {t.nav.discover}
        </h1>
        <div className="flex items-center gap-2">
          <Link
            href="/explore"
            className="rounded-full border border-white/10 bg-white/5 p-2.5 text-cream/70 backdrop-blur-md transition hover:bg-white/10 hover:text-cream"
            aria-label="Explore"
          >
            <Compass className="h-4 w-4" />
          </Link>
          <Link
            href="/premium"
            className="inline-flex items-center gap-1.5 rounded-full border border-mint/25 bg-mint/10 px-3 py-1.5 text-xs font-bold text-mint shadow-[0_0_20px_rgba(61,255,181,0.12)] backdrop-blur-md transition hover:bg-mint/20"
          >
            <Sparkles className="h-3.5 w-3.5" />
            {user.tier === "free" ? t.discover.goPlus : user.tier}
          </Link>
          <Link
            href="/preferences"
            className="rounded-full border border-white/10 bg-white/5 p-2.5 text-cream/70 backdrop-blur-md transition hover:bg-white/10 hover:text-cream"
            aria-label="Preferences"
          >
            <SlidersHorizontal className="h-4 w-4" />
          </Link>
        </div>
      </header>

      {user.preferences.lookingFor.length > 0 && (
        <div className="relative z-10 mb-3 flex gap-2 overflow-x-auto no-scrollbar">
          {user.preferences.lookingFor.slice(0, 4).map((lf) => (
            <span
              key={lf}
              className="shrink-0 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-medium text-cream/70"
            >
              {lookingForLabel(lf)}
            </span>
          ))}
        </div>
      )}

      <div className="relative z-10 flex flex-1 flex-col">
        {limitKind === "likes" && (
          <div className="mb-3">
            <AdLimitBanner
              kind="likes"
              title="Out of likes for today"
              body="Watch a short ad for +5 likes (up to 3 ads/day), or upgrade for unlimited."
              onWatchAd={() => setAdOpen(true)}
            />
          </div>
        )}
        {limitKind === "rewinds" && (
          <div className="mb-3">
            <AdLimitBanner
              kind="rewinds"
              title="Out of Yoinks"
              body="Watch an ad for +1 rewind (up to 2 ads/day), or go Plus for unlimited Yoinks."
              onWatchAd={() => setAdOpen(true)}
            />
          </div>
        )}
        {limitKind === "super" && (
          <div className="mb-3 rounded-3xl border border-coral/25 bg-coral/10 p-4 text-sm text-cream/80">
            Super Vibes are used up for today.{" "}
            <Link href="/premium" className="font-bold text-mint">
              Upgrade for more →
            </Link>
          </div>
        )}

        <AnimatePresence mode="wait">
          {current ? (
            <motion.div
              key={current.id}
              initial={false}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, x: -60, rotate: -6 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="flex-1"
            >
              <ProfileCard
                profile={current}
                onLike={handleLike}
                onPass={handlePass}
                onSuperLike={handleSuper}
                onRewind={handleRewind}
                canRewind={canRewind({ ...user, usage })}
                remainingLikes={remainingLabel(usage.likesUsed, likesLimit)}
              />
            </motion.div>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center rounded-[32px] border border-white/10 bg-gradient-to-b from-ink-elevated/80 to-ink-soft p-8 text-center">
              <p className="font-display text-3xl font-extrabold tracking-tight">
                {t.discover.deckCleared}
              </p>
              <p className="mt-3 max-w-[28ch] text-sm leading-relaxed text-muted">
                {t.discover.deckClearedBody}
              </p>
              <Link href="/preferences" className="mt-6">
                <Button size="lg">{t.discover.editPrefs}</Button>
              </Link>
            </div>
          )}
        </AnimatePresence>
      </div>

      <MatchCelebration
        match={celebration}
        onClose={() => setCelebration(null)}
      />

      {(limitKind === "likes" || limitKind === "rewinds") && (
        <RewardedAdGate
          kind={limitKind}
          open={adOpen}
          onClose={() => {
            // Keep the limit banner visible so they can retry or upgrade
            setAdOpen(false);
          }}
          onEarned={() => {
            setLimitKind(null);
            setAdOpen(false);
          }}
        />
      )}
    </div>
  );
}
