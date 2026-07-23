"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ExternalLink,
  Flag,
  Heart,
  MapPin,
  MessageCircle,
  Plus,
  Sparkles,
  Trophy,
  Volume2,
  Zap,
} from "lucide-react";
import {
  MatchCelebration,
  type MatchCelebrationData,
} from "@/components/match-celebration";
import { ReelComposer } from "@/components/reel-composer";
import { AdLimitBanner, RewardedAdGate } from "@/components/rewarded-ad";
import { BrandMark, Button, Chip } from "@/components/ui";
import { REEL_FLAG_OPTIONS } from "@/lib/constants";
import { MOCK_REELS, getProfileById } from "@/lib/mock-data";
import { useAppStore } from "@/lib/store";
import type { Reel } from "@/lib/types";
import {
  effectiveReelsLimit,
  lookingForLabel,
  maybeResetUsage,
  remainingLabel,
} from "@/lib/utils";
import { cn } from "@/lib/utils";

export default function ReelsPage() {
  const user = useAppStore((s) => s.user)!;
  const watchReel = useAppStore((s) => s.watchReel);
  const like = useAppStore((s) => s.like);
  const updatePreferences = useAppStore((s) => s.updatePreferences);
  const [index, setIndex] = useState(0);
  const [limitHit, setLimitHit] = useState(false);
  const [adOpen, setAdOpen] = useState(false);
  const [likedReel, setLikedReel] = useState<Record<string, boolean>>({});
  const [showFilters, setShowFilters] = useState(false);
  const [composerOpen, setComposerOpen] = useState(false);
  const [celebration, setCelebration] = useState<MatchCelebrationData | null>(
    null
  );

  const reels = useMemo(() => {
    const boostActive =
      user.auraBoostUntil && new Date(user.auraBoostUntil) > new Date();
    const aura: Reel[] = boostActive
      ? [
          {
            id: `aura-${user.id}`,
            userId: user.id,
            videoUrl: "",
            posterUrl: user.photos[0] ?? MOCK_REELS[0].posterUrl,
            caption: "Aura Boost — soft launching myself for 60 mins",
            likes: 42,
            createdAt: new Date().toISOString(),
            flag: "green",
            isAuraBoost: true,
            boostExpiresAt: user.auraBoostUntil,
            source: "vibed",
          },
        ]
      : [];

    const filter = user.preferences.reelFlagFilter ?? "all";
    const base = [...aura, ...(user.myReels ?? []), ...MOCK_REELS].filter(
      (r) => {
        if (filter === "all") return true;
        return r.flag === filter;
      }
    );
    return base.length ? base : MOCK_REELS;
  }, [user]);

  const reel = reels[index % reels.length];
  const profile =
    reel.userId === user.id
      ? {
          id: user.id,
          name: user.name,
          age: user.age,
          city: user.city,
          photos: user.photos,
          lookingFor: user.lookingFor,
        }
      : getProfileById(reel.userId);
  const usage = maybeResetUsage(user.usage);
  const reelsLimit = effectiveReelsLimit(user.tier, usage);

  useEffect(() => {
    const res = watchReel();
    if (res.blocked === "limit") setLimitHit(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  const next = () => {
    // Don't advance while the free-limit gate is showing
    if (limitHit) return;
    setIndex((i) => i + 1);
  };

  const prev = () => setIndex((i) => Math.max(0, i - 1));

  if (!profile || !("photos" in profile) || !profile.photos?.[0]) return null;

  const flagColor =
    reel.flag === "green"
      ? "border-mint/50 bg-mint/20 text-mint"
      : reel.flag === "red"
        ? "border-coral/50 bg-coral/20 text-coral"
        : "border-white/20 bg-white/10 text-cream";

  return (
    <div className="relative flex h-[calc(100dvh-6.5rem)] flex-col overflow-hidden">
      <header className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-4 pt-5">
        <BrandMark href="/discover" className="drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]" />
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowFilters((v) => !v)}
            className="rounded-full border border-white/15 bg-ink/45 p-2 backdrop-blur-md"
            aria-label="Flag filters"
          >
            <Flag className="h-3.5 w-3.5" />
          </button>
          <span className="rounded-full border border-white/10 bg-ink/45 px-2.5 py-1 text-[11px] font-semibold backdrop-blur-md">
            {remainingLabel(usage.reelsWatched, reelsLimit)}
          </span>
          <Button
            size="sm"
            variant="mint"
            className="h-8 gap-1 px-2.5"
            onClick={() => setComposerOpen(true)}
          >
            <Plus className="h-3.5 w-3.5" /> Post
          </Button>
        </div>
      </header>

      {showFilters && (
        <div className="absolute inset-x-3 top-16 z-30 flex flex-wrap gap-1.5 rounded-2xl border border-white/10 bg-ink/80 p-2 backdrop-blur-xl">
          {REEL_FLAG_OPTIONS.map((o) => (
            <Chip
              key={o.id}
              active={user.preferences.reelFlagFilter === o.id}
              onClick={() => {
                updatePreferences({ reelFlagFilter: o.id });
                setIndex(0);
              }}
              className="text-xs"
            >
              {o.label}
            </Chip>
          ))}
        </div>
      )}

      {limitHit ? (
        <div className="flex flex-1 flex-col justify-center gap-4 p-6">
          <AdLimitBanner
            kind="reels"
            title="Free Reels limit reached"
            body="Watch a short ad for +5 Reels (up to 3 ads/day), or upgrade for unlimited scrolling."
            onWatchAd={() => setAdOpen(true)}
          />
          <RewardedAdGate
            kind="reels"
            open={adOpen}
            onClose={() => setAdOpen(false)}
            onEarned={() => {
              setLimitHit(false);
              setAdOpen(false);
            }}
          />
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={reel.id}
            initial={false}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.35 }}
            className="relative flex-1 overflow-hidden bg-ink"
          >
            <Image
              src={reel.posterUrl}
              alt={reel.caption}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-ink/50" />

            <div className="absolute inset-x-4 top-16 z-10 h-[3px] overflow-hidden rounded-full bg-white/20">
              <div
                key={reel.id}
                className="reel-progress h-full rounded-full bg-gradient-to-r from-coral to-mint"
              />
            </div>

            <div className="absolute left-4 top-[4.75rem] z-10 flex flex-wrap gap-1.5">
              <span
                className={cn(
                  "rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider",
                  flagColor
                )}
              >
                {reel.flag === "green"
                  ? "Green flag"
                  : reel.flag === "red"
                    ? "Red flag"
                    : "Neutral"}
              </span>
              {reel.isAuraBoost && (
                <span className="inline-flex items-center gap-1 rounded-full border border-sand/40 bg-sand/20 px-2.5 py-1 text-[10px] font-bold text-sand">
                  <Zap className="h-3 w-3" /> Aura Boost
                </span>
              )}
              {reel.isMainCharacter && (
                <span className="inline-flex items-center gap-1 rounded-full border border-mint/40 bg-mint/20 px-2.5 py-1 text-[10px] font-bold text-mint">
                  <Trophy className="h-3 w-3" /> Main Character
                </span>
              )}
              {(reel.source === "instagram" || reel.source === "tiktok") && (
                <span className="inline-flex items-center gap-1 rounded-full border border-white/25 bg-ink/50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-cream">
                  {reel.source}
                </span>
              )}
            </div>

            <button
              type="button"
              className="absolute left-0 top-20 z-10 h-[70%] w-1/3"
              aria-label="Previous reel"
              onClick={prev}
            />
            <button
              type="button"
              className="absolute right-0 top-20 z-10 h-[70%] w-1/3"
              aria-label="Next reel"
              onClick={next}
            />

            <div className="absolute bottom-7 left-4 right-16 z-10 space-y-3">
              <div className="flex items-center gap-3">
                <div className="relative h-11 w-11 overflow-hidden rounded-full ring-2 ring-white/80 shadow-lg">
                  <Image src={profile.photos[0]} alt="" fill className="object-cover" />
                </div>
                <div>
                  <p className="font-display text-lg font-bold tracking-tight">
                    {profile.name}, {profile.age}
                  </p>
                  <p className="flex items-center gap-1 text-xs text-cream/70">
                    <MapPin className="h-3 w-3" />
                    {profile.city}
                    {"lookingFor" in profile &&
                      profile.lookingFor?.[0] &&
                      ` · ${lookingForLabel(profile.lookingFor[0])}`}
                  </p>
                </div>
              </div>
              <p className="text-[15px] font-medium leading-snug drop-shadow">
                {reel.caption}
              </p>
              {reel.externalUrl && (
                <a
                  href={reel.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-mint underline-offset-2 hover:underline"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Open on{" "}
                  {reel.source === "instagram" ? "Instagram" : "TikTok"}
                </a>
              )}
              {reel.userId !== user.id && (
                <Button
                  size="sm"
                  className="shine"
                  onClick={() => {
                    const res = like(reel.userId);
                    if (res.blocked) {
                      setLimitHit(true);
                      return;
                    }
                    if (res.matched) {
                      setCelebration({
                        name: profile.name,
                        photo: profile.photos[0],
                        myPhoto: user.photos[0],
                      });
                    }
                  }}
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Vibe with {profile.name.split(" ")[0]}
                </Button>
              )}
            </div>

            <div className="absolute bottom-10 right-3 z-10 flex flex-col items-center gap-5">
              <button
                type="button"
                className="flex flex-col items-center gap-1"
                onClick={() =>
                  setLikedReel((m) => ({ ...m, [reel.id]: !m[reel.id] }))
                }
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-ink/35 backdrop-blur-md">
                  <Heart
                    className={`h-6 w-6 ${likedReel[reel.id] ? "fill-coral text-coral" : "text-cream"}`}
                  />
                </span>
                <span className="text-xs font-semibold">
                  {reel.likes + (likedReel[reel.id] ? 1 : 0)}
                </span>
              </button>
              <Link href="/matches" className="flex flex-col items-center gap-1">
                <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-ink/35 backdrop-blur-md">
                  <MessageCircle className="h-6 w-6" />
                </span>
                <span className="text-xs font-semibold">Chat</span>
              </Link>
              <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-ink/35 backdrop-blur-md">
                <Volume2 className="h-5 w-5 text-cream/80" />
              </span>
            </div>
          </motion.div>
        </AnimatePresence>
      )}

      <MatchCelebration
        match={celebration}
        onClose={() => setCelebration(null)}
      />

      <ReelComposer
        open={composerOpen}
        onClose={() => setComposerOpen(false)}
        onPosted={() => setIndex(0)}
      />
    </div>
  );
}
