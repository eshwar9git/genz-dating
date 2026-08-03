"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Check,
  CircleHelp,
  Crown,
  Globe2,
  LogOut,
  Settings2,
  Sparkles,
  Trash2,
} from "lucide-react";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Button } from "@/components/ui";
import { AD_REWARDS, PLANS } from "@/lib/constants";
import { useLocaleStore } from "@/lib/locale-store";
import { useAppStore } from "@/lib/store";
import {
  adRewardsRemaining,
  effectiveLikesLimit,
  effectiveReelsLimit,
  effectiveRewindsLimit,
  getLimits,
  lookingForLabel,
  maybeResetUsage,
  remainingLabel,
} from "@/lib/utils";

export default function ProfilePage() {
  const user = useAppStore((s) => s.user)!;
  const logout = useAppStore((s) => s.logout);
  const deleteAccount = useAppStore((s) => s.deleteAccount);
  const t = useLocaleStore((s) => s.t)();
  const usage = maybeResetUsage(user.usage);
  const limits = getLimits(user.tier);
  const plan = PLANS.find((p) => p.id === user.tier)!;
  const likesLimit = effectiveLikesLimit(user.tier, usage);
  const reelsLimit = effectiveReelsLimit(user.tier, usage);
  const rewindsLimit = effectiveRewindsLimit(user.tier, usage);

  return (
    <div className="px-4 pt-5 pb-8">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-extrabold tracking-tight">
          {t.nav.profile}
        </h1>
        <Link href="/preferences" className="rounded-full border border-line p-2 text-muted">
          <Settings2 className="h-4 w-4" />
        </Link>
      </header>

      <div className="overflow-hidden rounded-3xl border border-line bg-ink-soft">
        <div className="relative h-56">
          {user.photos[0] && (
            <Image src={user.photos[0]} alt="" fill className="object-cover" unoptimized={user.photos[0].startsWith("data:")} />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-ink-soft to-transparent" />
        </div>
        <div className="relative -mt-10 px-4 pb-5">
          <h1 className="font-display text-3xl font-bold">
            {user.name}, {user.age}
          </h1>
          <p className="mt-1 flex items-center gap-1 text-sm text-muted">
            <Globe2 className="h-3.5 w-3.5" />
            {user.city}, {user.country}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-cream/90">{user.bio}</p>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {user.lookingFor.map((lf) => (
              <span
                key={lf}
                className="rounded-full bg-coral/20 px-2.5 py-1 text-[11px] font-medium"
              >
                {lookingForLabel(lf)}
              </span>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {user.interests.map((i) => (
              <span
                key={i}
                className="rounded-full border border-line px-2.5 py-1 text-[11px] text-muted"
              >
                {i}
              </span>
            ))}
          </div>
        </div>
      </div>

      <section className="mt-5 rounded-3xl border border-line bg-ink-elevated/60 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-sand" />
            <div>
              <p className="font-semibold">{plan.name}</p>
              <p className="text-xs text-muted">{plan.tagline}</p>
            </div>
          </div>
          <Link href="/premium">
            <Button size="sm" variant={user.tier === "free" ? "primary" : "mint"}>
              <Sparkles className="h-3.5 w-3.5" />
              {user.tier === "free" ? "Upgrade" : "Manage"}
            </Button>
          </Link>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
          <div className="rounded-xl bg-ink-soft p-3">
            <p className="text-muted">Likes today</p>
            <p className="mt-1 font-semibold">
              {remainingLabel(usage.likesUsed, likesLimit)}
            </p>
          </div>
          <div className="rounded-xl bg-ink-soft p-3">
            <p className="text-muted">Reels today</p>
            <p className="mt-1 font-semibold">
              {remainingLabel(usage.reelsWatched, reelsLimit)}
            </p>
          </div>
          <div className="rounded-xl bg-ink-soft p-3">
            <p className="text-muted">Super Vibes</p>
            <p className="mt-1 font-semibold">
              {remainingLabel(usage.superLikesUsed, limits.superLikesPerDay)}
            </p>
          </div>
          <div className="rounded-xl bg-ink-soft p-3">
            <p className="text-muted">Rewinds</p>
            <p className="mt-1 font-semibold">
              {remainingLabel(usage.rewindsUsed, rewindsLimit)}
            </p>
          </div>
        </div>

        {user.tier === "free" && (
          <div className="mt-3 rounded-2xl border border-sand/25 bg-sand/10 p-3">
            <p className="text-xs font-bold uppercase tracking-wider text-sand">
              Watch ads for more
            </p>
            <ul className="mt-2 space-y-1 text-xs text-cream/75">
              <li>
                Likes: {AD_REWARDS.likes.blurb} ·{" "}
                {adRewardsRemaining(user, "likes")}/{AD_REWARDS.likes.maxPerDay}{" "}
                ads left
              </li>
              <li>
                Reels: {AD_REWARDS.reels.blurb} ·{" "}
                {adRewardsRemaining(user, "reels")}/{AD_REWARDS.reels.maxPerDay}{" "}
                ads left
              </li>
              <li>
                Yoinks: {AD_REWARDS.rewinds.blurb} ·{" "}
                {adRewardsRemaining(user, "rewinds")}/
                {AD_REWARDS.rewinds.maxPerDay} ads left
              </li>
            </ul>
            <p className="mt-2 text-[11px] text-muted">
              Hit a daily limit on Discover or Reels, then tap Watch ad.
            </p>
          </div>
        )}
      </section>

      {user.prompts.length > 0 && (
        <section className="mt-5 space-y-3">
          <h2 className="font-display text-lg font-bold">Prompts</h2>
          {user.prompts.map((p, i) => (
            <div key={i} className="rounded-2xl border border-line bg-ink-soft p-4">
              <p className="text-xs text-muted">{p.prompt}</p>
              <p className="mt-1 font-medium">{p.answer}</p>
            </div>
          ))}
        </section>
      )}

      <section className="mt-6 rounded-3xl border border-line bg-ink-soft/60 p-4">
        <LanguageSwitcher />
        <p className="mt-4 text-xs text-muted">
          {t.settings.paymentTitle}: {t.settings.paymentBody}
        </p>
      </section>

      <div className="mt-6 space-y-2">
        <Link href="/explore" className="block">
          <Button variant="mint" className="w-full">
            Explore · Soft Launch, City Boards, Aura
          </Button>
        </Link>
        <Link href="/likes" className="block">
          <Button variant="secondary" className="w-full">
            See who liked you
          </Button>
        </Link>
        <Link href="/onboarding?edit=1" className="block">
          <Button variant="secondary" className="w-full justify-between">
            Edit profile & photos
            <Check className="h-4 w-4 text-mint" />
          </Button>
        </Link>
        <Link href="/faq" className="block">
          <Button variant="secondary" className="w-full justify-between">
            FAQ · how to use vibed
            <CircleHelp className="h-4 w-4 text-muted" />
          </Button>
        </Link>
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 py-2 text-center text-xs text-muted">
          <Link href="/legal/terms" className="hover:text-mint">
            Terms
          </Link>
          <Link href="/legal/privacy" className="hover:text-mint">
            Privacy
          </Link>
          <Link href="/legal/community" className="hover:text-mint">
            Community
          </Link>
        </div>
        <Button
          variant="secondary"
          className="w-full"
          onClick={() => {
            logout();
            window.location.href = "/";
          }}
        >
          <LogOut className="h-4 w-4" /> Log out
        </Button>
        <Button
          variant="danger"
          className="w-full"
          onClick={() => {
            const ok = window.confirm(
              "Delete your vibed account and all local data on this device? This cannot be undone."
            );
            if (!ok) return;
            deleteAccount();
            window.location.href = "/";
          }}
        >
          <Trash2 className="h-4 w-4" /> Delete account
        </Button>
      </div>
    </div>
  );
}
