"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Send } from "lucide-react";
import { MatchExtras } from "@/components/match-extras";
import { Button } from "@/components/ui";
import { SITUATIONSHIP_OPTIONS } from "@/lib/constants";
import { getProfileById } from "@/lib/mock-data";
import { useAppStore } from "@/lib/store";
import { isVibeCheckComplete } from "@/lib/utils";

export default function ChatPage() {
  const params = useParams<{ id: string }>();
  const user = useAppStore((s) => s.user)!;
  const sendMessage = useAppStore((s) => s.sendMessage);
  const markMatchRead = useAppStore((s) => s.markMatchRead);
  const [text, setText] = useState("");
  const [showExtras, setShowExtras] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  const match = user.matches.find((m) => m.id === params.id);
  const profile = match ? getProfileById(match.userId) : null;
  const messages = user.messages.filter((m) => m.matchId === params.id);
  const vibeDone = match ? isVibeCheckComplete(match) : false;
  const statusLabel =
    SITUATIONSHIP_OPTIONS.find((o) => o.id === match?.situationshipStatus)?.label ??
    "Undefined";

  useEffect(() => {
    if (!match?.id || match.unread <= 0) return;
    markMatchRead(match.id);
  }, [match?.id, match?.unread, markMatchRead]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  if (!match || !profile) {
    return (
      <div className="p-6">
        <p>Match not found.</p>
        <Link href="/matches" className="text-mint">
          Back
        </Link>
      </div>
    );
  }

  const onSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    const res = sendMessage(match.id, text);
    if (res.blocked === "vibe-check") {
      setShowExtras(true);
      return;
    }
    setText("");
  };

  return (
    <div className="flex h-[calc(100dvh-6.5rem)] flex-col">
      <header className="flex items-center gap-3 border-b border-line px-4 py-3">
        <Link href="/matches" className="rounded-full p-2 hover:bg-white/5">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="relative h-10 w-10 overflow-hidden rounded-full ring-2 ring-coral/30">
          <Image src={profile.photos[0]} alt="" fill className="object-cover" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-display font-bold tracking-tight">{profile.name}</p>
          <p className="truncate text-[11px] text-muted">
            {profile.city} · {statusLabel}
            {!vibeDone && " · Vibe Check pending"}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowExtras((v) => !v)}
          className="rounded-full border border-white/10 px-3 py-1.5 text-[11px] font-semibold text-mint"
        >
          {showExtras ? "Hide" : "Vibes"}
        </button>
      </header>

      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {showExtras && <MatchExtras match={match} />}

        <div className="mx-auto max-w-[85%] rounded-2xl border border-line bg-ink-soft/80 p-3 text-center text-xs text-muted">
          Soft Launch stays private until you both unlock. Chat opens after Vibe Check.
        </div>

        {messages.map((m) => {
          const mine = m.senderId === user.id;
          return (
            <div
              key={m.id}
              className={`flex ${mine ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] rounded-2xl px-3.5 py-2.5 text-sm ${
                  mine
                    ? "rounded-br-md bg-coral text-white"
                    : "rounded-bl-md bg-ink-elevated text-cream"
                }`}
              >
                {m.text}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <form
        onSubmit={onSend}
        className="flex items-center gap-2 border-t border-line px-3 py-3"
      >
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={!vibeDone}
          placeholder={
            vibeDone
              ? "Say something unhinged (but sweet)"
              : "Complete Vibe Check to chat…"
          }
          className="flex-1 rounded-2xl border border-line bg-ink-soft px-4 py-3 text-sm outline-none focus:border-coral/40 disabled:opacity-50"
        />
        <Button
          type="submit"
          className="h-11 w-11 rounded-full p-0"
          aria-label="Send"
          disabled={!vibeDone}
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
