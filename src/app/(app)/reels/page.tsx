"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
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
import { Button, Chip } from "@/components/ui";
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
  const [likesAdOpen, setLikesAdOpen] = useState(false);
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
    return [...aura, ...(user.myReels ?? []), ...MOCK_REELS].filter((r) => {
      if (filter === "all") return true;
      return r.flag === filter;
    });
  }, [user]);

  const safeIndex = reels.length ? index % reels.length : 0;
  const reel = reels[safeIndex];
  const profile = reel
    ? reel.userId === user.id
      ? {
          id: user.id,
          name: user.name,
          age: user.age,
          city: user.city,
          photos: user.photos,
          lookingFor: user.lookingFor,
        }
      : getProfileById(reel.userId)
    : null;
  const usage = maybeResetUsage(user.usage);
  const reelsLimit = effectiveReelsLimit(user.tier, usage);

  // Only count forward views — scrubbing back must not burn Free quota
  const maxCountedIndex = useRef(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const gestureLock = useRef(false);
  /** 1 = swipe up / next, -1 = swipe down / previous */
  const [slideDir, setSlideDir] = useState<1 | -1>(1);

  useEffect(() => {
    if (!reels.length) return;
    if (index <= maxCountedIndex.current) return;
    maxCountedIndex.current = index;
    const id = window.setTimeout(() => {
      const res = watchReel();
      if (res.blocked === "limit") setLimitHit(true);
    }, 0);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, reels.length]);

  const next = () => {
    if (limitHit || gestureLock.current) return;
    gestureLock.current = true;
    setSlideDir(1);
    setIndex((i) => i + 1);
    window.setTimeout(() => {
      gestureLock.current = false;
    }, 420);
  };

  const prev = () => {
    if (gestureLock.current || index <= 0) return;
    gestureLock.current = true;
    setSlideDir(-1);
    setIndex((i) => Math.max(0, i - 1));
    window.setTimeout(() => {
      gestureLock.current = false;
    }, 420);
  };

  // Vertical wheel / trackpad scroll (TikTok-style)
  useEffect(() => {
    const el = containerRef.current;
    if (!el || limitHit) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (Math.abs(e.deltaY) < 18) return;
      if (e.deltaY > 0) next();
      else prev();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === "j") {
        e.preventDefault();
        next();
      } else if (e.key === "ArrowUp" || e.key === "PageUp" || e.key === "k") {
        e.preventDefault();
        prev();
      }
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);
    return () => {
      el.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
    };
    // Rebind when index/limit change so handlers see fresh closures
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [limitHit, index]);

  if (!reels.length || !profile || !("photos" in profile) || !profile.photos?.[0]) {
    return (
      <div className="app-screen-height flex flex-col items-center justify-center gap-3 px-6 text-center">
        <h1 className="font-display text-2xl font-extrabold">Reels</h1>
        <p className="text-sm text-muted">
          Nothing to show for this filter. Try another flag or post your own.
        </p>
        <Button size="sm" variant="mint" onClick={() => setComposerOpen(true)}>
          <Plus className="h-3.5 w-3.5" /> Post a Reel
        </Button>
        <ReelComposer open={composerOpen} onClose={() => setComposerOpen(false)} />
      </div>
    );
  }

  const flagColor =
    reel.flag === "green"
      ? "border-mint/50 bg-mint/20 text-mint"
      : reel.flag === "red"
        ? "border-coral/50 bg-coral/20 text-coral"
        : "border-white/20 bg-white/10 text-cream";

  return (
    <div
      ref={containerRef}
      className="app-screen-height relative flex touch-pan-y flex-col overflow-hidden overscroll-none"
      tabIndex={0}
      aria-label="Reels feed. Swipe or scroll vertically to change reels."
    >
      <header
        className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-4 pt-5"
        onPointerDown={(e) => e.stopPropagation()}
      >
        <h1 className="font-display text-2xl font-extrabold tracking-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]">
          Reels
        </h1>
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
        <AnimatePresence mode="wait" custom={slideDir}>
          <motion.div
            key={reel.id}
            custom={slideDir}
            initial={{ y: `${slideDir * 100}%`, opacity: 0.85 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: `${slideDir * -100}%`, opacity: 0.85 }}
            transition={{ type: "spring", stiffness: 380, damping: 36, mass: 0.85 }}
            className="relative flex-1 overflow-hidden bg-ink"
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.18}
            onDragEnd={(_, info) => {
              if (limitHit) return;
              const dy = info.offset.y;
              const vy = info.velocity.y;
              if (dy < -72 || vy < -650) next();
              else if (dy > 72 || vy > 650) prev();
            }}
          >
            <Image
              src={reel.posterUrl}
              alt={reel.caption}
              fill
              className="object-cover"
              priority
              sizes="100vw"
              quality={90}
              draggable={false}
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-ink/50" />

            <div className="pointer-events-none absolute inset-x-4 top-16 z-10 h-[3px] overflow-hidden rounded-full bg-white/20">
              <div
                key={reel.id}
                className="reel-progress h-full rounded-full bg-gradient-to-r from-coral to-mint"
              />
            </div>

            <div className="pointer-events-none absolute left-4 top-[4.75rem] z-10 flex flex-wrap gap-1.5">
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

            <div
              className="absolute bottom-7 left-4 right-16 z-10 space-y-3"
              onPointerDown={(e) => e.stopPropagation()}
            >
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
                      // Likes limit — don't reuse the Reels limit screen
                      setLikesAdOpen(true);
                      return;
                    }
                    setLikedReel((m) => ({ ...m, [reel.id]: true }));
                    if (res.matched) {
                      setCelebration({
                        name: profile.name,
                        photo: profile.photos[0],
                        myPhoto: user.photos[0],
                        matchId: res.matchId,
                      });
                    }
                  }}
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Vibe with {profile.name.split(" ")[0]}
                </Button>
              )}
            </div>

            <div
              className="absolute bottom-10 right-3 z-10 flex flex-col items-center gap-5"
              onPointerDown={(e) => e.stopPropagation()}
            >
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

      <RewardedAdGate
        kind="likes"
        open={likesAdOpen}
        onClose={() => setLikesAdOpen(false)}
        onEarned={() => setLikesAdOpen(false)}
      />

      <ReelComposer
        open={composerOpen}
        onClose={() => setComposerOpen(false)}
        onPosted={() => setIndex(0)}
      />
    </div>
  );
}
