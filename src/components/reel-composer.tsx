"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Link2, Loader2, Upload, X } from "lucide-react";
import { Button, Input, TextArea } from "@/components/ui";
import {
  fetchExternalReelPreview,
  readFileAsDataUrl,
} from "@/lib/reel-import";
import { useAppStore } from "@/lib/store";
import type { ReelFlag, ReelSource } from "@/lib/types";
import { canPostReel, getLimits, maybeResetUsage, remainingLabel } from "@/lib/utils";
import { cn } from "@/lib/utils";

type Tab = "social" | "upload";

const FLAGS: { id: ReelFlag; label: string }[] = [
  { id: "green", label: "Green flag" },
  { id: "neutral", label: "Neutral" },
  { id: "red", label: "Red flag" },
];

function InstagramGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function TikTokGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15.3 6.34 6.34 0 0 0 9.49 21.6a6.34 6.34 0 0 0 6.34-6.34V8.73a8.19 8.19 0 0 0 4.76 1.52V6.8a4.84 4.84 0 0 1-.999-.11Z" />
    </svg>
  );
}

export function ReelComposer({
  open,
  onClose,
  onPosted,
}: {
  open: boolean;
  onClose: () => void;
  onPosted?: () => void;
}) {
  const user = useAppStore((s) => s.user)!;
  const postReel = useAppStore((s) => s.postReel);
  const [tab, setTab] = useState<Tab>("social");
  const [url, setUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [flag, setFlag] = useState<ReelFlag>("green");
  const [posterUrl, setPosterUrl] = useState(user.photos[0] ?? "");
  const [videoUrl, setVideoUrl] = useState("");
  const [source, setSource] = useState<ReelSource>("upload");
  const [externalUrl, setExternalUrl] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const usage = maybeResetUsage(user.usage);
  const limits = getLimits(user.tier);
  const postsLeft = remainingLabel(usage.reelsPosted, limits.reelsPostPerDay);

  if (!open) return null;

  const reset = () => {
    setUrl("");
    setCaption("");
    setFlag("green");
    setPosterUrl(user.photos[0] ?? "");
    setVideoUrl("");
    setSource("upload");
    setExternalUrl(undefined);
    setError("");
    setToast("");
  };

  const importLink = async () => {
    setLoading(true);
    setError("");
    setToast("");
    const preview = await fetchExternalReelPreview(
      url,
      user.photos[0] ?? "/next.svg"
    );
    setLoading(false);
    if ("error" in preview) {
      setError(preview.error);
      return;
    }
    setSource(preview.source);
    setExternalUrl(preview.externalUrl);
    setPosterUrl(preview.posterUrl);
    setCaption(preview.caption);
    setVideoUrl("");
    setToast(
      preview.source === "instagram"
        ? "Instagram link ready — post to drop it in vibed Reels."
        : "TikTok preview loaded — post to drop it in vibed Reels."
    );
  };

  const onFile = async (file: File | null) => {
    if (!file) return;
    setError("");
    try {
      const dataUrl = await readFileAsDataUrl(file);
      setSource("upload");
      setExternalUrl(undefined);
      if (file.type.startsWith("video/")) {
        setVideoUrl(dataUrl);
        setPosterUrl(user.photos[0] || dataUrl);
      } else {
        setVideoUrl("");
        setPosterUrl(dataUrl);
      }
      if (!caption) setCaption(file.name.replace(/\.[^.]+$/, ""));
      setToast("File ready to post.");
    } catch {
      setError("Could not read that file.");
    }
  };

  const submit = () => {
    setError("");
    if (!canPostReel(user)) {
      setError("Daily reel post limit hit — upgrade for more.");
      return;
    }
    if (!posterUrl) {
      setError("Add a clip, photo, or Instagram/TikTok link first.");
      return;
    }
    if (tab === "social" && !externalUrl) {
      setError("Import the Instagram or TikTok link before posting.");
      return;
    }

    const res = postReel({
      caption,
      posterUrl,
      videoUrl,
      source: tab === "social" ? source : "upload",
      externalUrl: tab === "social" ? externalUrl : undefined,
      flag,
    });

    if (res.blocked === "limit") {
      setError("Daily reel post limit hit — upgrade for more.");
      return;
    }

    reset();
    onPosted?.();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center">
      <button
        type="button"
        className="absolute inset-0 bg-ink/80"
        aria-label="Close"
        onClick={() => {
          reset();
          onClose();
        }}
      />
      <div className="relative z-10 mx-3 mb-[max(1rem,env(safe-area-inset-bottom))] w-full max-w-md overflow-hidden rounded-[28px] border border-white/12 bg-ink-elevated shadow-[0_24px_80px_rgba(0,0,0,0.55)] sm:mb-0">
        <div className="flex items-center justify-between border-b border-white/8 px-4 py-3.5">
          <div>
            <p className="font-display text-lg font-extrabold">Post a Reel</p>
            <p className="text-[11px] text-muted">Posts left today · {postsLeft}</p>
          </div>
          <button
            type="button"
            onClick={() => {
              reset();
              onClose();
            }}
            className="rounded-full border border-white/10 p-2 text-muted hover:text-cream"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex gap-1 px-4 pt-3">
          {(
            [
              { id: "social" as const, label: "Instagram / TikTok" },
              { id: "upload" as const, label: "Upload" },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => {
                setTab(t.id);
                setError("");
              }}
              className={cn(
                "flex-1 rounded-full px-3 py-2 text-xs font-semibold transition",
                tab === t.id
                  ? "bg-coral/20 text-coral"
                  : "bg-white/[0.04] text-muted hover:text-cream"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="space-y-3 px-4 py-4">
          {tab === "social" ? (
            <>
              <div className="flex items-center gap-2 text-xs text-muted">
                <InstagramGlyph className="h-3.5 w-3.5 text-cream/80" />
                <TikTokGlyph className="h-3.5 w-3.5 text-cream/80" />
                <span>Paste a public Reel / TikTok link</span>
              </div>
              <Input
                label="Link"
                placeholder="https://www.instagram.com/reel/… or tiktok.com/…"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
              <Button
                type="button"
                variant="secondary"
                className="w-full"
                disabled={loading || !url.trim()}
                onClick={importLink}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Link2 className="h-4 w-4" />
                )}
                Import link
              </Button>
            </>
          ) : (
            <>
              <input
                ref={fileRef}
                type="file"
                accept="video/*,image/*"
                className="hidden"
                onChange={(e) => onFile(e.target.files?.[0] ?? null)}
              />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="flex w-full flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-white/15 bg-ink-soft/60 px-4 py-8 text-sm text-muted transition hover:border-coral/40 hover:text-cream"
              >
                <Upload className="h-5 w-5 text-coral" />
                Choose video or photo from device
              </button>
            </>
          )}

          {posterUrl && (
            <div className="relative mx-auto h-40 w-28 overflow-hidden rounded-2xl border border-white/10">
              <Image
                src={posterUrl}
                alt=""
                fill
                className="object-cover"
                unoptimized
              />
              {source !== "upload" && source !== "vibed" && (
                <span className="absolute left-1.5 top-1.5 rounded-full bg-ink/70 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-cream">
                  {source}
                </span>
              )}
            </div>
          )}

          <TextArea
            label="Caption"
            rows={2}
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="soft launching this era…"
          />

          <div>
            <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
              Vibe flag
            </p>
            <select
              value={flag}
              onChange={(e) => setFlag(e.target.value as ReelFlag)}
              className="w-full appearance-none rounded-2xl border border-line bg-ink-soft/80 px-4 py-3 text-sm text-cream outline-none focus:border-coral/45"
            >
              {FLAGS.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.label}
                </option>
              ))}
            </select>
          </div>

          {error && <p className="text-xs text-coral">{error}</p>}
          {toast && <p className="text-xs text-mint">{toast}</p>}

          <Button type="button" className="w-full" size="lg" onClick={submit}>
            Post to vibed Reels
          </Button>
          <p className="text-center text-[10px] leading-relaxed text-muted">
            Instagram & TikTok imports keep your original link — viewers can open
            the source. Official API sync needs creator app credentials later.
          </p>
        </div>
      </div>
    </div>
  );
}
