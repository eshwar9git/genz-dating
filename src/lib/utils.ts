import { clsx, type ClassValue } from "clsx";
import {
  AD_REWARDS,
  FREE_LIMITS,
  PLUS_LIMITS,
  ULTRA_LIMITS,
} from "./constants";
import type {
  AdRewardKind,
  AuthUser,
  Match,
  SubscriptionTier,
  UsageLimits,
} from "./types";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function getLimits(tier: SubscriptionTier) {
  if (tier === "ultra") return ULTRA_LIMITS;
  if (tier === "plus") return PLUS_LIMITS;
  return FREE_LIMITS;
}

export function startOfNextDayISO() {
  const d = new Date();
  d.setHours(24, 0, 0, 0);
  return d.toISOString();
}

export function freshUsage(): UsageLimits {
  return {
    likesUsed: 0,
    likesResetAt: startOfNextDayISO(),
    superLikesUsed: 0,
    rewindsUsed: 0,
    reelsWatched: 0,
    reelsPosted: 0,
    boostsUsed: 0,
    softLaunchUnlocksUsed: 0,
    likesBonus: 0,
    reelsBonus: 0,
    rewindsBonus: 0,
    adLikesWatched: 0,
    adReelsWatched: 0,
    adRewindsWatched: 0,
  };
}

export function effectiveLikesLimit(tier: SubscriptionTier, usage: UsageLimits) {
  const base = getLimits(tier).likesPerDay;
  if (!Number.isFinite(base)) return base;
  return base + (usage.likesBonus ?? 0);
}

export function effectiveReelsLimit(tier: SubscriptionTier, usage: UsageLimits) {
  const base = getLimits(tier).reelsWatchPerDay;
  if (!Number.isFinite(base)) return base;
  return base + (usage.reelsBonus ?? 0);
}

export function effectiveRewindsLimit(
  tier: SubscriptionTier,
  usage: UsageLimits
) {
  const base = getLimits(tier).rewindsPerDay;
  if (!Number.isFinite(base)) return base;
  return base + (usage.rewindsBonus ?? 0);
}

export function adWatchedCount(usage: UsageLimits, kind: AdRewardKind) {
  if (kind === "likes") return usage.adLikesWatched ?? 0;
  if (kind === "reels") return usage.adReelsWatched ?? 0;
  return usage.adRewindsWatched ?? 0;
}

export function canWatchAdForReward(user: AuthUser, kind: AdRewardKind) {
  const usage = maybeResetUsage(user.usage);
  const limits = getLimits(user.tier);
  const cfg = AD_REWARDS[kind];
  if (kind === "likes" && !Number.isFinite(limits.likesPerDay)) return false;
  if (kind === "reels" && !Number.isFinite(limits.reelsWatchPerDay)) return false;
  if (kind === "rewinds" && !Number.isFinite(limits.rewindsPerDay)) return false;
  return adWatchedCount(usage, kind) < cfg.maxPerDay;
}

export function adRewardsRemaining(user: AuthUser, kind: AdRewardKind) {
  const usage = maybeResetUsage(user.usage);
  return Math.max(0, AD_REWARDS[kind].maxPerDay - adWatchedCount(usage, kind));
}

export function maybeResetUsage(usage: UsageLimits): UsageLimits {
  if (new Date() >= new Date(usage.likesResetAt)) {
    return freshUsage();
  }
  return usage;
}

export function canLike(user: AuthUser) {
  const usage = maybeResetUsage(user.usage);
  return usage.likesUsed < effectiveLikesLimit(user.tier, usage);
}

export function canSuperLike(user: AuthUser) {
  const usage = maybeResetUsage(user.usage);
  const limits = getLimits(user.tier);
  return usage.superLikesUsed < limits.superLikesPerDay;
}

export function canRewind(user: AuthUser) {
  const usage = maybeResetUsage(user.usage);
  return usage.rewindsUsed < effectiveRewindsLimit(user.tier, usage);
}

export function canWatchReel(user: AuthUser) {
  const usage = maybeResetUsage(user.usage);
  return usage.reelsWatched < effectiveReelsLimit(user.tier, usage);
}

export function canPostReel(user: AuthUser) {
  const usage = maybeResetUsage(user.usage);
  const limits = getLimits(user.tier);
  return usage.reelsPosted < limits.reelsPostPerDay;
}

export function canUnlockSoftLaunch(user: AuthUser) {
  const usage = maybeResetUsage(user.usage);
  const limits = getLimits(user.tier);
  return usage.softLaunchUnlocksUsed < limits.softLaunchUnlocksPerDay;
}

export function canAuraBoost(user: AuthUser) {
  const usage = maybeResetUsage(user.usage);
  const limits = getLimits(user.tier);
  if (user.tier !== "ultra") return false;
  if (user.auraBoostUntil && new Date(user.auraBoostUntil) > new Date()) {
    return false;
  }
  return usage.boostsUsed < limits.boostsPerWeek;
}

export function canSeeWhoLikedYou(user: AuthUser) {
  return user.tier !== "free";
}

export function canUsePassport(user: AuthUser) {
  return user.tier === "ultra";
}

export function canUseAdvancedFilters(user: AuthUser) {
  return user.tier !== "free";
}

export function isVibeCheckComplete(match: Match) {
  return match.vibeCheckMe.length >= 3 && match.vibeCheckThem.length >= 3;
}

export function isSoftLaunchPublic(match: Match) {
  return match.softLaunchUnlockedByMe && match.softLaunchUnlockedByThem;
}

export function remainingLabel(used: number, limit: number) {
  if (!Number.isFinite(limit)) return "Unlimited";
  return `${Math.max(0, limit - used)} left`;
}

export function formatPrice(n: number) {
  return n === 0 ? "Free" : `$${n.toFixed(2)}`;
}

export function lookingForLabel(id: string) {
  return id
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function uid(prefix = "id") {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

export function formatTimeInZone(date: Date, timeZone: string) {
  try {
    return new Intl.DateTimeFormat("en-US", {
      timeZone,
      weekday: "short",
      hour: "numeric",
      minute: "2-digit",
    }).format(date);
  } catch {
    return date.toLocaleString();
  }
}

/** Convert a wall-clock time in `timeZone` to a real UTC Date. */
function wallTimeInZoneToDate(
  timeZone: string,
  year: number,
  month: number,
  day: number,
  hour: number,
  minute = 0
): Date {
  const utcGuess = Date.UTC(year, month - 1, day, hour, minute, 0);
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });
  const parts = Object.fromEntries(
    dtf.formatToParts(new Date(utcGuess)).map((p) => [p.type, p.value])
  ) as Record<string, string>;
  const asIfUtc = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour),
    Number(parts.minute),
    0
  );
  return new Date(utcGuess - (asIfUtc - utcGuess));
}

export function overlappingSlots(
  tzA: string,
  tzB: string,
  ideas: string[]
): { startISO: string; endISO: string; idea: string; labelA: string; labelB: string }[] {
  const now = new Date();
  // Anchor suggestions as wall times in *your* timezone, then show both labels
  const slots = [18, 20, 11].map((hour, i) => {
    const day = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1 + (i % 2))
    );
    const start = wallTimeInZoneToDate(
      tzA,
      day.getUTCFullYear(),
      day.getUTCMonth() + 1,
      day.getUTCDate(),
      hour,
      0
    );
    const end = new Date(start.getTime() + 60 * 60 * 1000);
    return {
      startISO: start.toISOString(),
      endISO: end.toISOString(),
      idea: ideas[i % ideas.length],
      labelA: formatTimeInZone(start, tzA),
      labelB: formatTimeInZone(start, tzB),
    };
  });
  return slots;
}

export function migrateUser(user: AuthUser): AuthUser {
  const usage = maybeResetUsage({
    ...freshUsage(),
    ...user.usage,
    softLaunchUnlocksUsed: user.usage?.softLaunchUnlocksUsed ?? 0,
    likesBonus: user.usage?.likesBonus ?? 0,
    reelsBonus: user.usage?.reelsBonus ?? 0,
    rewindsBonus: user.usage?.rewindsBonus ?? 0,
    adLikesWatched: user.usage?.adLikesWatched ?? 0,
    adReelsWatched: user.usage?.adReelsWatched ?? 0,
    adRewindsWatched: user.usage?.adRewindsWatched ?? 0,
  });
  return {
    ...user,
    timezone: user.timezone ?? "America/New_York",
    unlockedSoftLaunchIds: user.unlockedSoftLaunchIds ?? [],
    mySoftLaunchStories: user.mySoftLaunchStories ?? [],
    cityVibePosts: user.cityVibePosts ?? [],
    mainCharacterReelIds: user.mainCharacterReelIds ?? [],
    challengeRewardClaimed: user.challengeRewardClaimed ?? false,
    // Legacy accounts skip the intro tour; new signups set this to false on register
    hasSeenFeatureTour: user.hasSeenFeatureTour ?? true,
    myReels: user.myReels ?? [],
    preferences: {
      ...user.preferences,
      reelFlagFilter: user.preferences?.reelFlagFilter ?? "all",
    },
    usage,
    matches: (user.matches ?? []).map((m) => ({
      ...m,
      softLaunchPrivate: m.softLaunchPrivate ?? true,
      softLaunchUnlockedByMe: m.softLaunchUnlockedByMe ?? false,
      softLaunchUnlockedByThem: m.softLaunchUnlockedByThem ?? false,
      situationshipStatus: m.situationshipStatus ?? "undefined",
      vibeCheckMe: m.vibeCheckMe ?? [],
      vibeCheckThem: m.vibeCheckThem ?? [],
      proposedSlots: m.proposedSlots ?? [],
    })),
  };
}
