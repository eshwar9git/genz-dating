"use client";

import { useMemo, useState } from "react";
import { Calendar, Lock, Radio, Sparkles } from "lucide-react";
import { Button, Chip, Input } from "@/components/ui";
import {
  DATE_IDEAS,
  SITUATIONSHIP_OPTIONS,
  VIBE_CHECK_PROMPTS,
} from "@/lib/constants";
import { getProfileById } from "@/lib/mock-data";
import { useAppStore } from "@/lib/store";
import type { Match, SituationshipStatus, VibeCheckAnswer } from "@/lib/types";
import {
  formatTimeInZone,
  isSoftLaunchPublic,
  isVibeCheckComplete,
  overlappingSlots,
} from "@/lib/utils";
import { cn } from "@/lib/utils";

export function MatchExtras({ match }: { match: Match }) {
  const user = useAppStore((s) => s.user)!;
  const submitVibeCheck = useAppStore((s) => s.submitVibeCheck);
  const setSituationshipStatus = useAppStore((s) => s.setSituationshipStatus);
  const unlockSoftLaunch = useAppStore((s) => s.unlockSoftLaunch);
  const publishSoftLaunchStory = useAppStore((s) => s.publishSoftLaunchStory);
  const proposeDateSlot = useAppStore((s) => s.proposeDateSlot);
  const acceptDateSlot = useAppStore((s) => s.acceptDateSlot);

  const partner = getProfileById(match.userId);
  const vibeDone = isVibeCheckComplete(match);
  const softPublic = isSoftLaunchPublic(match);

  const [answers, setAnswers] = useState<VibeCheckAnswer[]>(() =>
    VIBE_CHECK_PROMPTS.slice(0, 3).map((prompt) => ({ prompt, answer: "" }))
  );
  const [caption, setCaption] = useState("");
  const [toast, setToast] = useState("");

  const slots = useMemo(() => {
    if (!partner) return [];
    return overlappingSlots(user.timezone, partner.timezone, DATE_IDEAS);
  }, [user.timezone, partner?.timezone, partner]);

  if (!partner) return null;

  return (
    <div className="space-y-3">
      {/* Situationship status */}
      <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted">
          Situationship status
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {SITUATIONSHIP_OPTIONS.map((o) => (
            <Chip
              key={o.id}
              active={match.situationshipStatus === o.id}
              onClick={() => {
                setSituationshipStatus(match.id, o.id as SituationshipStatus);
                setToast(`Status → ${o.label}`);
              }}
              className="text-xs"
            >
              {o.label}
            </Chip>
          ))}
        </div>
      </section>

      {/* Soft Launch Mode */}
      <section className="rounded-2xl border border-coral/25 bg-gradient-to-br from-coral/15 to-transparent p-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="flex items-center gap-1.5 text-sm font-bold">
              <Lock className="h-3.5 w-3.5 text-coral" />
              Soft Launch Mode
            </p>
            <p className="mt-1 text-xs text-muted">
              {softPublic
                ? "You're both unlocked — publish a blurry story anytime."
                : match.softLaunchUnlockedByMe
                  ? "Waiting on them to unlock too…"
                  : "Matches stay private until you both soft-launch."}
            </p>
          </div>
          {!match.softLaunchUnlockedByMe && (
            <Button
              size="sm"
              onClick={() => {
                const res = unlockSoftLaunch(match.id);
                setToast(
                  res.public
                    ? "Soft launch is live for both of you"
                    : "You unlocked — waiting on them"
                );
              }}
            >
              Unlock
            </Button>
          )}
        </div>
        {softPublic && (
          <div className="mt-3 flex gap-2">
            <Input
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="hand + latte caption…"
              className="py-2.5 text-sm"
            />
            <Button
              size="sm"
              variant="mint"
              onClick={() => {
                const res = publishSoftLaunchStory(match.id, caption);
                setToast(
                  res.blocked
                    ? "Still private — both need to unlock"
                    : "Soft Launch story posted"
                );
                setCaption("");
              }}
            >
              Post
            </Button>
          </div>
        )}
      </section>

      {/* Vibe Check */}
      {!vibeDone ? (
        <section className="rounded-2xl border border-mint/30 bg-mint/10 p-3">
          <p className="flex items-center gap-1.5 text-sm font-bold text-mint">
            <Sparkles className="h-3.5 w-3.5" />
            Vibe Check required
          </p>
          <p className="mt-1 text-xs text-cream/65">
            Answer 3 micro-prompts before chat unlocks — no more dry &quot;hey&quot;.
          </p>
          <div className="mt-3 space-y-2">
            {answers.map((a, i) => (
              <div key={i} className="space-y-1">
                <select
                  className="w-full rounded-xl border border-line bg-ink-soft px-3 py-2 text-xs outline-none"
                  value={a.prompt}
                  onChange={(e) =>
                    setAnswers((arr) =>
                      arr.map((x, idx) =>
                        idx === i ? { ...x, prompt: e.target.value } : x
                      )
                    )
                  }
                >
                  {VIBE_CHECK_PROMPTS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
                <input
                  value={a.answer}
                  onChange={(e) =>
                    setAnswers((arr) =>
                      arr.map((x, idx) =>
                        idx === i ? { ...x, answer: e.target.value } : x
                      )
                    )
                  }
                  placeholder="Your answer"
                  className="w-full rounded-xl border border-line bg-ink-soft px-3 py-2 text-sm outline-none focus:border-mint/40"
                />
              </div>
            ))}
          </div>
          <Button
            className="mt-3 w-full"
            size="sm"
            variant="mint"
            onClick={() => {
              if (answers.some((a) => a.answer.trim().length < 2)) {
                setToast("Fill all 3 vibe answers");
                return;
              }
              submitVibeCheck(match.id, answers);
              setToast("Vibe Check complete — chat unlocked");
            }}
          >
            Submit Vibe Check
          </Button>
        </section>
      ) : (
        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted">
            Vibe Check results
          </p>
          <div className="mt-2 grid gap-2">
            {match.vibeCheckMe.map((a, i) => (
              <div key={i} className="rounded-xl bg-ink-soft/80 p-2.5 text-xs">
                <p className="text-muted">{a.prompt}</p>
                <p className="mt-0.5 font-medium">You: {a.answer}</p>
                <p className="mt-0.5 text-mint">
                  {partner.name}: {match.vibeCheckThem[i]?.answer ?? "—"}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Timezone Date Planner */}
      <section className="rounded-2xl border border-sky/20 bg-sky/5 p-3">
        <p className="flex items-center gap-1.5 text-sm font-bold">
          <Calendar className="h-3.5 w-3.5 text-sky" />
          Timezone Date Planner
        </p>
        <p className="mt-1 text-xs text-muted">
          You ({user.timezone.split("/").pop()?.replaceAll("_", " ")}) ·{" "}
          {partner.name} (
          {partner.timezone.split("/").pop()?.replaceAll("_", " ")})
        </p>
        <div className="mt-3 space-y-2">
          {slots.map((s, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                proposeDateSlot(match.id, i);
                setToast(
                  `Proposed: ${s.idea} — waiting for ${partner.name} to Lock in`
                );
              }}
              className="w-full rounded-xl border border-white/10 bg-ink-soft/70 px-3 py-2.5 text-left transition hover:border-sky/30"
            >
              <p className="text-sm font-semibold">{s.idea}</p>
              <p className="mt-0.5 text-[11px] text-muted">
                You {s.labelA} · Them {s.labelB}
              </p>
            </button>
          ))}
        </div>
        {match.proposedSlots.length > 0 && (
          <div className="mt-3 space-y-2">
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted">
              Proposed
            </p>
            {match.proposedSlots.map((s) => {
              const iProposed = s.proposedBy === user.id;
              return (
                <div
                  key={s.id}
                  className={cn(
                    "flex items-center justify-between gap-2 rounded-xl border px-3 py-2",
                    s.accepted
                      ? "border-mint/40 bg-mint/10"
                      : "border-line bg-ink-soft"
                  )}
                >
                  <div>
                    <p className="text-sm font-medium">{s.idea}</p>
                    <p className="text-[11px] text-muted">
                      {formatTimeInZone(new Date(s.startISO), user.timezone)}
                    </p>
                  </div>
                  {s.accepted ? (
                    <span className="shrink-0 text-xs font-bold text-mint">
                      Locked
                    </span>
                  ) : iProposed ? (
                    <span className="shrink-0 text-[11px] font-semibold text-muted">
                      Waiting for them…
                    </span>
                  ) : (
                    <Button
                      size="sm"
                      variant="mint"
                      onClick={() => {
                        const res = acceptDateSlot(match.id, s.id);
                        if (res.blocked === "self") {
                          setToast("They need to Lock in — you proposed this one.");
                        } else {
                          setToast("Date locked in");
                        }
                      }}
                    >
                      Lock in
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {toast && (
        <p className="flex items-center gap-1.5 rounded-xl border border-mint/25 bg-mint/10 px-3 py-2 text-xs text-mint">
          <Radio className="h-3 w-3" />
          {toast}
        </p>
      )}
    </div>
  );
}
