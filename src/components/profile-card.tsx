"use client";

import Image from "next/image";
import { motion, useMotionValue, useTransform, PanInfo } from "framer-motion";
import { BadgeCheck, MapPin } from "lucide-react";
import { useState } from "react";
import type { UserProfile } from "@/lib/types";
import { lookingForLabel } from "@/lib/utils";
import {
  IconAura,
  IconGhost,
  IconVibeWave,
  IconYoink,
} from "@/components/swipe-icons";
import { nativeHaptic } from "@/lib/native";

export function ProfileCard({
  profile,
  onLike,
  onPass,
  onSuperLike,
  onRewind,
  canRewind,
  remainingLikes,
}: {
  profile: UserProfile;
  onLike: () => void;
  onPass: () => void;
  onSuperLike: () => void;
  onRewind: () => void;
  canRewind: boolean;
  remainingLikes: string;
}) {
  const [photoIndex, setPhotoIndex] = useState(0);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-220, 220], [-14, 14]);
  const likeOpacity = useTransform(x, [50, 150], [0, 1]);
  const nopeOpacity = useTransform(x, [-150, -50], [1, 0]);
  const likeScale = useTransform(x, [0, 150], [0.9, 1.05]);
  const nopeScale = useTransform(x, [-150, 0], [1.05, 0.9]);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x > 120) {
      void nativeHaptic("medium");
      onLike();
    } else if (info.offset.x < -120) {
      void nativeHaptic("light");
      onPass();
    }
  };

  const nextPhoto = () =>
    setPhotoIndex((i) => Math.min(i + 1, profile.photos.length - 1));
  const prevPhoto = () => setPhotoIndex((i) => Math.max(i - 1, 0));

  return (
    <div className="relative mx-auto flex h-full w-full max-w-md flex-col">
      <motion.div
        style={{ x, rotate }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.85}
        onDragEnd={handleDragEnd}
        className="relative min-h-[62dvh] flex-1 overflow-hidden rounded-[32px] bg-ink-elevated shadow-[0_30px_80px_rgba(0,0,0,0.55)] ring-1 ring-white/10"
      >
        <div className="absolute inset-0">
          <Image
            src={profile.photos[photoIndex]}
            alt={profile.name}
            fill
            className="object-cover"
            sizes="(max-width: 512px) 100vw, 448px"
            priority
            draggable={false}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 via-35% to-transparent to-55%" />
          <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-ink/50 to-transparent" />
        </div>

        <div className="absolute inset-x-4 top-4 z-10 flex gap-1.5">
          {profile.photos.map((_, i) => (
            <div
              key={i}
              className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/25"
            >
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  i === photoIndex
                    ? "w-full bg-white"
                    : i < photoIndex
                      ? "w-full bg-white/70"
                      : "w-0"
                }`}
              />
            </div>
          ))}
        </div>

        <button
          type="button"
          aria-label="Previous photo"
          className="absolute left-0 top-0 z-10 h-[65%] w-1/3"
          onClick={prevPhoto}
        />
        <button
          type="button"
          aria-label="Next photo"
          className="absolute right-0 top-0 z-10 h-[65%] w-1/3"
          onClick={nextPhoto}
        />

        <motion.div
          style={{ opacity: likeOpacity, scale: likeScale }}
          className="pointer-events-none absolute left-5 top-16 -rotate-12 rounded-2xl border-[3px] border-mint bg-mint/10 px-3.5 py-1.5 font-display text-2xl font-extrabold tracking-wide text-mint backdrop-blur-sm"
        >
          VIBE
        </motion.div>
        <motion.div
          style={{ opacity: nopeOpacity, scale: nopeScale }}
          className="pointer-events-none absolute right-5 top-16 rotate-12 rounded-2xl border-[3px] border-coral bg-coral/10 px-3.5 py-1.5 font-display text-2xl font-extrabold tracking-wide text-coral backdrop-blur-sm"
        >
          GHOST
        </motion.div>

        <div className="absolute inset-x-0 bottom-0 z-10 space-y-3 p-5 pb-6">
          <div className="flex items-end justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display text-[2rem] font-extrabold tracking-tight drop-shadow-lg">
                  {profile.name}
                  <span className="font-semibold text-cream/80">, {profile.age}</span>
                </h2>
                {profile.verified && (
                  <BadgeCheck
                    className="h-6 w-6 shrink-0 text-mint drop-shadow"
                    fill="currentColor"
                    stroke="var(--ink)"
                    strokeWidth={1}
                  />
                )}
              </div>
              <p className="mt-1.5 flex items-center gap-1.5 text-sm text-cream/75">
                <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 backdrop-blur-md">
                  <MapPin className="h-3 w-3" />
                  {profile.city}
                </span>
                <span className="text-cream/50">·</span>
                <span>{profile.distanceKm} km</span>
                <span className="text-cream/50">·</span>
                <span className="uppercase tracking-wider text-[11px] text-cream/60">
                  {profile.countryCode}
                </span>
              </p>
            </div>
            <span className="shrink-0 rounded-full border border-white/10 bg-ink/45 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-cream/70 backdrop-blur-md">
              {remainingLikes}
            </span>
          </div>

          <p className="line-clamp-2 text-[13.5px] leading-relaxed text-cream/85">
            {profile.bio}
          </p>

          <div className="flex flex-wrap gap-1.5">
            {profile.lookingFor.slice(0, 3).map((lf) => (
              <span
                key={lf}
                className="rounded-full border border-coral/30 bg-coral/20 px-2.5 py-1 text-[11px] font-semibold text-cream backdrop-blur-sm"
              >
                {lookingForLabel(lf)}
              </span>
            ))}
          </div>
        </div>
      </motion.div>

      {/* GenZ action dock — equal size orbs */}
      <div className="mt-5 flex items-end justify-center gap-3.5 pb-1">
        <ActionOrb
          label="Yoink"
          onClick={() => {
            void nativeHaptic("light");
            onRewind();
          }}
          disabled={!canRewind}
          ariaLabel="Yoink — undo last pass"
          className="border border-sand/25 bg-ink-elevated/90 text-sand shadow-lg"
        >
          <IconYoink size={24} />
        </ActionOrb>

        <ActionOrb
          label="Ghost"
          onClick={() => {
            void nativeHaptic("light");
            onPass();
          }}
          ariaLabel="Ghost — pass"
          className="border border-coral/35 bg-gradient-to-b from-[#2a1520] to-ink-soft text-coral shadow-[0_10px_30px_rgba(255,61,104,0.22)]"
        >
          <IconGhost size={24} />
        </ActionOrb>

        <ActionOrb
          label="Aura"
          onClick={() => {
            void nativeHaptic("heavy");
            onSuperLike();
          }}
          ariaLabel="Aura — super vibe"
          className="bg-gradient-to-b from-[#6fffc8] to-mint text-ink shadow-[0_10px_28px_var(--glow-mint)]"
        >
          <IconAura size={24} />
        </ActionOrb>

        <ActionOrb
          label="Vibe"
          onClick={() => {
            void nativeHaptic("medium");
            onLike();
          }}
          ariaLabel="Vibe — like"
          className="bg-gradient-to-b from-[#ff5a7a] to-coral text-white shadow-[0_12px_36px_var(--glow-coral)]"
        >
          <IconVibeWave size={24} />
        </ActionOrb>
      </div>
    </div>
  );
}

function ActionOrb({
  children,
  label,
  onClick,
  disabled,
  ariaLabel,
  className,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  ariaLabel: string;
  className: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className="action-orb group flex flex-col items-center gap-1.5 disabled:opacity-30"
    >
      <span
        className={`flex h-14 w-14 items-center justify-center rounded-[20px] backdrop-blur-md transition group-hover:rounded-[16px] ${className}`}
      >
        {children}
      </span>
      <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-cream/45 group-hover:text-cream/70">
        {label}
      </span>
    </button>
  );
}
