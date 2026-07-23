"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Compass,
  Film,
  MessageCircle,
  Sparkles,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui";
import { useAppStore } from "@/lib/store";
import { useMounted } from "@/lib/use-mounted";

const STEPS = [
  {
    icon: Compass,
    accent: "text-coral",
    glow: "bg-coral/20",
    title: "Discover",
    body: "Swipe to find your people. Ghost to pass, Vibe to like, Aura for a Super Vibe, Yoink to rewind.",
  },
  {
    icon: Film,
    accent: "text-mint",
    glow: "bg-mint/20",
    title: "Reels",
    body: "Watch short vibes with green & red flag filters. Boost yours with Aura Boost or go Main Character.",
  },
  {
    icon: Sparkles,
    accent: "text-cream",
    glow: "bg-cream/15",
    title: "Explore",
    body: "City Vibe Boards, Soft Launch stories, and weekly challenges live here — more ways to connect beyond the swipe deck.",
  },
  {
    icon: MessageCircle,
    accent: "text-coral",
    glow: "bg-coral/20",
    title: "Chats",
    body: "After you match, finish a Vibe Check to unlock chat. Soft Launch Mode, situationship status, and timezone date ideas keep it moving.",
  },
  {
    icon: Zap,
    accent: "text-mint",
    glow: "bg-mint/20",
    title: "Plus & Ultra",
    body: "Free gets you started. Plus unlocks more likes and Soft Launch. Ultra adds Passport and the full toolkit.",
  },
] as const;

export function FeatureTour() {
  const user = useAppStore((s) => s.user);
  const completeFeatureTour = useAppStore((s) => s.completeFeatureTour);
  const mounted = useMounted();
  const [step, setStep] = useState(0);

  if (!mounted || !user?.onboardingComplete || user.hasSeenFeatureTour) {
    return null;
  }

  const current = STEPS[step];
  const Icon = current.icon;
  const isLast = step === STEPS.length - 1;

  const finish = () => completeFeatureTour();

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center">
      <motion.div
        className="absolute inset-0 bg-ink/80 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={finish}
      />

      <motion.div
        layout
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 320, damping: 28 }}
        className="relative z-10 mx-4 mb-[max(1.5rem,env(safe-area-inset-bottom))] w-full max-w-md overflow-hidden rounded-[28px] border border-white/12 bg-gradient-to-b from-ink-elevated to-ink-soft p-6 shadow-[0_24px_80px_rgba(0,0,0,0.55)] sm:mb-0"
      >
        <div className="mb-5 flex items-center justify-between">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-muted">
            Quick tour · {step + 1}/{STEPS.length}
          </p>
          <button
            type="button"
            onClick={finish}
            className="text-xs font-semibold text-muted transition hover:text-cream"
          >
            Skip
          </button>
        </div>

        <div className="mb-4 flex gap-1.5">
          {STEPS.map((_, i) => (
            <span
              key={i}
              className={`h-1 flex-1 rounded-full transition ${
                i <= step ? "bg-coral" : "bg-white/10"
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -18 }}
            transition={{ duration: 0.22 }}
          >
            <div
              className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${current.glow}`}
            >
              <Icon className={`h-7 w-7 ${current.accent}`} strokeWidth={2.2} />
            </div>
            <h2 className="font-display text-2xl font-extrabold tracking-tight text-cream">
              {current.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {current.body}
            </p>
          </motion.div>
        </AnimatePresence>

        <div className="mt-7 flex gap-2">
          {step > 0 && (
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => setStep((s) => s - 1)}
            >
              Back
            </Button>
          )}
          <Button
            className="flex-[1.4]"
            onClick={() => {
              if (isLast) finish();
              else setStep((s) => s + 1);
            }}
          >
            {isLast ? "Start swiping" : "Next"}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
