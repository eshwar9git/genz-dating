"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Flag,
  Lock,
  MapPin,
  Sparkles,
  Trophy,
  Zap,
} from "lucide-react";
import { BrandMark, Button, Chip, LimitBanner, TextArea } from "@/components/ui";
import {
  CITY_VIBE_PROMPTS,
  MAIN_CHARACTER_WEEK,
  REEL_FLAG_OPTIONS,
} from "@/lib/constants";
import {
  MOCK_CITY_VIBES,
  MOCK_SOFT_LAUNCH_FEED,
  getProfileById,
} from "@/lib/mock-data";
import { useAppStore } from "@/lib/store";
import {
  canAuraBoost,
  canUnlockSoftLaunch,
  getLimits,
  maybeResetUsage,
  remainingLabel,
} from "@/lib/utils";
import { cn } from "@/lib/utils";

type Tab = "city" | "soft" | "challenge" | "aura";

export default function ExplorePage() {
  const user = useAppStore((s) => s.user)!;
  const unlockSoftLaunchStory = useAppStore((s) => s.unlockSoftLaunchStory);
  const activateAuraBoost = useAppStore((s) => s.activateAuraBoost);
  const postCityVibe = useAppStore((s) => s.postCityVibe);
  const enterMainCharacterWeek = useAppStore((s) => s.enterMainCharacterWeek);
  const updatePreferences = useAppStore((s) => s.updatePreferences);

  const [tab, setTab] = useState<Tab>("city");
  const [prompt, setPrompt] = useState(CITY_VIBE_PROMPTS[0]);
  const [answer, setAnswer] = useState("");
  const [toast, setToast] = useState("");
  const [cityFilter, setCityFilter] = useState<"mine" | "global">("global");

  const usage = maybeResetUsage(user.usage);
  const limits = getLimits(user.tier);

  const cityPosts = useMemo(() => {
    const all = [...user.cityVibePosts, ...MOCK_CITY_VIBES];
    const filtered =
      cityFilter === "mine"
        ? all.filter((p) => p.city === user.city || p.countryCode === user.countryCode)
        : all;
    return filtered.sort(
      (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)
    );
  }, [user, cityFilter]);

  const similar = useMemo(() => {
    const myTags = new Set(user.interests);
    return cityPosts
      .filter((p) => p.tags.some((t) => myTags.has(t)) && p.authorId !== user.id)
      .slice(0, 3);
  }, [cityPosts, user]);

  const stories = useMemo(
    () => [...user.mySoftLaunchStories, ...MOCK_SOFT_LAUNCH_FEED],
    [user.mySoftLaunchStories]
  );

  const tabs: { id: Tab; label: string }[] = [
    { id: "city", label: "City" },
    { id: "soft", label: "Soft Launch" },
    { id: "challenge", label: "Main Character" },
    { id: "aura", label: "Aura" },
  ];

  return (
    <div className="px-4 pt-5 pb-8">
      <BrandMark href="/discover" />
      <h1 className="mt-4 font-display text-[1.85rem] font-extrabold tracking-tight">
        Explore
      </h1>
      <p className="mt-1 text-sm text-muted">
        City boards, Soft Launches, Aura Boosts & weekly challenges.
      </p>

      <div className="mt-5 flex gap-1.5 overflow-x-auto no-scrollbar">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn(
              "shrink-0 rounded-full px-3.5 py-2 text-xs font-bold transition",
              tab === t.id
                ? "bg-coral text-white"
                : "border border-white/10 bg-white/[0.03] text-muted"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {toast && (
        <p className="mt-4 rounded-2xl border border-mint/30 bg-mint/10 px-3 py-2 text-sm text-mint">
          {toast}
        </p>
      )}

      {tab === "city" && (
        <div className="mt-5 space-y-4">
          <div className="flex gap-2">
            <Chip active={cityFilter === "global"} onClick={() => setCityFilter("global")}>
              Global
            </Chip>
            <Chip active={cityFilter === "mine"} onClick={() => setCityFilter("mine")}>
              {user.city}
            </Chip>
          </div>

          <section className="rounded-3xl border border-white/10 bg-ink-soft/70 p-4">
            <p className="flex items-center gap-1.5 text-sm font-bold">
              <MapPin className="h-4 w-4 text-mint" />
              Post anonymously
            </p>
            <select
              className="mt-3 w-full rounded-xl border border-line bg-ink-elevated px-3 py-2.5 text-sm outline-none"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            >
              {CITY_VIBE_PROMPTS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            <TextArea
              className="mt-2"
              rows={3}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Your local intel…"
            />
            <Button
              className="mt-3 w-full"
              onClick={() => {
                postCityVibe(prompt, answer);
                setAnswer("");
                setToast("Posted to City Vibe Board");
              }}
            >
              Drop the vibe
            </Button>
          </section>

          {similar.length > 0 && (
            <section>
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-mint">
                People who answered like you
              </p>
              <div className="flex gap-2 overflow-x-auto no-scrollbar">
                {similar.map((p) => {
                  const profile = getProfileById(p.authorId);
                  if (!profile) return null;
                  return (
                    <Link
                      key={p.id}
                      href="/discover"
                      className="shrink-0 w-36 overflow-hidden rounded-2xl border border-white/10"
                    >
                      <div className="relative h-28">
                        <Image src={profile.photos[0]} alt="" fill className="object-cover" />
                      </div>
                      <div className="p-2">
                        <p className="text-sm font-semibold">
                          {profile.name}, {profile.age}
                        </p>
                        <p className="truncate text-[10px] text-muted">{p.answer}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

          <ul className="space-y-3">
            {cityPosts.map((p) => (
              <li
                key={p.id}
                className="rounded-2xl border border-white/8 bg-white/[0.03] p-4"
              >
                <p className="text-[11px] text-muted">
                  {p.anonymousHandle} · {p.city}
                </p>
                <p className="mt-1 text-xs font-semibold text-coral">{p.prompt}</p>
                <p className="mt-1.5 text-sm leading-relaxed">{p.answer}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {p.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-muted"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {tab === "soft" && (
        <div className="mt-5 space-y-4">
          <p className="text-sm text-muted">
            Free: {remainingLabel(usage.softLaunchUnlocksUsed, limits.softLaunchUnlocksPerDay)}{" "}
            Soft Launch unlocks today. Plus unlocks all.
          </p>
          {!canUnlockSoftLaunch({ ...user, usage }) && user.tier === "free" && (
            <LimitBanner
              title="Daily Soft Launch unlock used"
              body="Free members get 1 Soft Launch story unlock per day. Plus unlocks unlimited."
            />
          )}
          <div className="grid grid-cols-2 gap-3">
            {stories.map((s) => {
              const unlocked =
                user.tier !== "free" ||
                user.unlockedSoftLaunchIds.includes(s.id) ||
                s.userId === user.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    if (unlocked) return;
                    const res = unlockSoftLaunchStory(s.id);
                    if (res.blocked === "limit") {
                      setToast("Unlock limit hit — upgrade for unlimited");
                    } else {
                      setToast("Soft Launch unlocked");
                    }
                  }}
                  className="relative aspect-[3/4] overflow-hidden rounded-[22px] ring-1 ring-white/10 text-left"
                >
                  <Image
                    src={s.posterUrl}
                    alt=""
                    fill
                    className={cn("object-cover", !unlocked && "scale-110 blur-xl")}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/30" />
                  {!unlocked && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Lock className="h-6 w-6 text-cream" />
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 p-3">
                    <p className="text-[10px] uppercase tracking-wider text-coral">
                      Soft Launch · {s.partnerName}
                    </p>
                    <p className="text-sm font-semibold">
                      {unlocked ? s.caption : "Tap to unlock"}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {tab === "challenge" && (
        <div className="mt-5 space-y-4">
          <section className="relative overflow-hidden rounded-3xl border border-mint/30 bg-gradient-to-br from-mint/20 to-ink-elevated p-5">
            <div className="pointer-events-none absolute -right-8 top-0 h-32 w-32 rounded-full bg-mint/20 blur-2xl" />
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-mint">
              {MAIN_CHARACTER_WEEK.weekLabel}
            </p>
            <h2 className="mt-2 font-display text-2xl font-extrabold tracking-tight">
              {MAIN_CHARACTER_WEEK.theme}
            </h2>
            <p className="mt-2 text-sm text-cream/70">
              {MAIN_CHARACTER_WEEK.description}
            </p>
            <p className="mt-3 text-xs text-muted">
              Ends{" "}
              {new Date(MAIN_CHARACTER_WEEK.endsAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}{" "}
              · Reward: {MAIN_CHARACTER_WEEK.rewardSuperVibes} Super Vibes
            </p>
            <Button
              className="mt-4 w-full"
              variant="mint"
              onClick={() => {
                const res = enterMainCharacterWeek();
                if (res.blocked === "already") {
                  setToast("You're already in this week's challenge");
                } else {
                  setToast(
                    res.reward
                      ? `Entered! +${MAIN_CHARACTER_WEEK.rewardSuperVibes} Super Vibes`
                      : "Challenge Reel entered"
                  );
                }
              }}
            >
              <Trophy className="h-4 w-4" />
              {user.mainCharacterReelIds.includes(MAIN_CHARACTER_WEEK.id)
                ? "Entered ✓"
                : "Enter with a Reel"}
            </Button>
          </section>
          <Link href="/reels" className="block">
            <Button variant="secondary" className="w-full">
              <Flag className="h-4 w-4" />
              Watch Main Character Reels
            </Button>
          </Link>
        </div>
      )}

      {tab === "aura" && (
        <div className="mt-5 space-y-4">
          <section className="rounded-3xl border border-sand/30 bg-gradient-to-br from-sand/15 to-ink-elevated p-5">
            <p className="flex items-center gap-2 font-display text-xl font-extrabold">
              <Zap className="h-5 w-5 text-sand" />
              Aura Boost
            </p>
            <p className="mt-2 text-sm text-cream/70">
              Your profile becomes a timed Reel in everyone&apos;s feed for 60 minutes —
              then it expires. Ultra weekly perk.
            </p>
            {user.auraBoostUntil && new Date(user.auraBoostUntil) > new Date() ? (
              <p className="mt-4 rounded-xl bg-mint/15 px-3 py-2 text-sm text-mint">
                Live until{" "}
                {new Date(user.auraBoostUntil).toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </p>
            ) : (
              <Button
                className="mt-4 w-full"
                variant="primary"
                onClick={() => {
                  const res = activateAuraBoost();
                  if (res.blocked === "tier") {
                    setToast("Aura Boost is Ultra only");
                  } else if (res.blocked === "limit") {
                    setToast("Weekly Aura Boost already used");
                  } else {
                    setToast("Aura Boost live — you're a Reel now");
                  }
                }}
              >
                <Sparkles className="h-4 w-4" />
                {canAuraBoost(user) ? "Activate Aura Boost" : "Unavailable"}
              </Button>
            )}
            {user.tier !== "ultra" && (
              <Link href="/premium" className="mt-3 block text-center text-sm text-mint">
                Get Ultra for weekly Aura Boost →
              </Link>
            )}
          </section>

          <section className="rounded-3xl border border-white/10 p-4">
            <p className="text-sm font-bold">Reel flag filter</p>
            <p className="mt-1 text-xs text-muted">
              Prefer green-flag stories or chaotic red-flag comedy? Plus+ recommended.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {REEL_FLAG_OPTIONS.map((o) => (
                <Chip
                  key={o.id}
                  active={user.preferences.reelFlagFilter === o.id}
                  onClick={() => updatePreferences({ reelFlagFilter: o.id })}
                >
                  {o.label}
                </Chip>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
