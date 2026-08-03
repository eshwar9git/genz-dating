"use client";

import Image from "next/image";
import Link from "next/link";
import { SITUATIONSHIP_OPTIONS } from "@/lib/constants";
import { getProfileById } from "@/lib/mock-data";
import { useAppStore } from "@/lib/store";
import { isSoftLaunchPublic, isVibeCheckComplete } from "@/lib/utils";

export default function MatchesPage() {
  const user = useAppStore((s) => s.user)!;
  const matches = user.matches;

  return (
    <div className="px-4 pt-5">
      <h1 className="font-display text-[1.85rem] font-extrabold tracking-tight">
        Matches
      </h1>
      <p className="mt-1 text-sm text-muted">
        Soft Launch private by default · Vibe Check before chat
      </p>

      {matches.length === 0 ? (
        <div className="mt-16 rounded-[28px] border border-white/10 bg-gradient-to-b from-ink-elevated/60 to-ink-soft p-8 text-center">
          <p className="font-display text-2xl font-extrabold">No matches yet</p>
          <p className="mt-2 text-sm text-muted">
            Keep swiping on Discover or vibe through Reels.
          </p>
          <Link
            href="/discover"
            className="mt-5 inline-block text-sm font-bold text-mint"
          >
            Go discover →
          </Link>
        </div>
      ) : (
        <ul className="mt-6 space-y-2.5">
          {matches.map((m) => {
            const p = getProfileById(m.userId);
            if (!p) return null;
            const vibeDone = isVibeCheckComplete(m);
            const softPublic = isSoftLaunchPublic(m);
            const status =
              SITUATIONSHIP_OPTIONS.find((o) => o.id === m.situationshipStatus)
                ?.label ?? "Undefined";
            return (
              <li key={m.id}>
                <Link
                  href={`/matches/${m.id}`}
                  className="relative z-10 flex items-center gap-3 rounded-[22px] border border-white/8 bg-white/[0.03] px-3 py-3 transition hover:border-white/15 hover:bg-white/[0.06]"
                >
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full ring-2 ring-coral/30">
                    <Image
                      src={p.photos[0]}
                      alt=""
                      fill
                      sizes="56px"
                      className="pointer-events-none object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-display text-base font-bold tracking-tight">
                        {p.name}
                      </p>
                      {m.unread > 0 && (
                        <span className="rounded-full bg-mint px-2 py-0.5 text-[10px] font-bold text-ink">
                          {m.unread}
                        </span>
                      )}
                    </div>
                    <p className="truncate text-sm text-muted">
                      {m.lastMessage ??
                        (vibeDone
                          ? "Say hi — don't leave them hanging"
                          : "Complete Vibe Check to chat")}
                    </p>
                    <div className="mt-1 flex flex-wrap gap-1">
                      <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-muted">
                        {status}
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] ${
                          softPublic
                            ? "bg-mint/15 text-mint"
                            : "bg-coral/15 text-coral"
                        }`}
                      >
                        {softPublic ? "Soft Launch live" : "Soft Launch private"}
                      </span>
                      {!vibeDone && (
                        <span className="rounded-full bg-sand/15 px-2 py-0.5 text-[10px] text-sand">
                          Vibe Check
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
