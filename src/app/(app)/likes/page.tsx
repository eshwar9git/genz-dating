"use client";

import Image from "next/image";
import Link from "next/link";
import { Lock } from "lucide-react";
import { BrandMark, Button, LimitBanner } from "@/components/ui";
import { getProfileById } from "@/lib/mock-data";
import { useAppStore } from "@/lib/store";
import { canSeeWhoLikedYou } from "@/lib/utils";

export default function LikesPage() {
  const user = useAppStore((s) => s.user)!;
  const unlocked = canSeeWhoLikedYou(user);
  const likers = user.likedMeIds
    .map(getProfileById)
    .filter(Boolean)
    .filter((p) => !user.likedIds.includes(p!.id) && !user.passedIds.includes(p!.id));

  return (
    <div className="px-4 pt-5">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <BrandMark href="/discover" />
          <p className="mt-1 text-sm text-muted">People who vibed with you</p>
        </div>
        <span className="rounded-full border border-coral/30 bg-coral/15 px-3 py-1 text-xs font-bold text-coral">
          {likers.length}
        </span>
      </header>

      {!unlocked && (
        <div className="mb-5">
          <LimitBanner
            title="See who likes you"
            body="Free members get blurred teasers. Plus & Ultra reveal full profiles of people who vibed with you."
          />
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        {likers.map((p) => (
          <div
            key={p!.id}
            className="group relative aspect-[3/4] overflow-hidden rounded-[22px] ring-1 ring-white/10"
          >
            <Image
              src={p!.photos[0]}
              alt={p!.name}
              fill
              className={`object-cover transition duration-500 group-hover:scale-105 ${!unlocked ? "scale-110 blur-xl" : ""}`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
            {!unlocked && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-ink/40 backdrop-blur-md">
                  <Lock className="h-5 w-5 text-cream/90" />
                </span>
              </div>
            )}
            <div className="absolute inset-x-0 bottom-0 p-3">
              <p className="font-display text-base font-bold tracking-tight">
                {unlocked ? `${p!.name}, ${p!.age}` : "Someone nearby"}
              </p>
              {unlocked && (
                <p className="truncate text-xs text-cream/60">{p!.city}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {!unlocked && (
        <Link href="/premium" className="mt-6 block">
          <Button className="w-full shine" size="lg">
            Unlock likes with Plus
          </Button>
        </Link>
      )}
    </div>
  );
}
