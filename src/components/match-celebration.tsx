"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui";
import { useLocaleStore } from "@/lib/locale-store";

export type MatchCelebrationData = {
  name: string;
  photo: string;
  myPhoto?: string;
  matchId?: string;
};

/**
 * Match overlay tuned for Android WebView:
 * - no backdrop-filter
 * - no infinite opacity/blur loops
 * - solid headline
 * - short one-shot entrance only
 */
export function MatchCelebration({
  match,
  onClose,
}: {
  match: MatchCelebrationData | null;
  onClose: () => void;
}) {
  const t = useLocaleStore((s) => s.t)();
  const router = useRouter();

  const close = () => {
    onClose();
  };

  return (
    <AnimatePresence mode="wait">
      {match ? (
        <motion.div
          key={`vibed-${match.name}-${match.photo}`}
          className="fixed inset-0 z-[80] flex items-center justify-center overflow-hidden bg-[#07080c] p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          role="dialog"
          aria-modal="true"
          aria-label={`${t.discover.youVibed} ${match.name}`}
        >
          <button
            type="button"
            className="absolute inset-0 cursor-default"
            aria-label="Dismiss"
            onClick={close}
          />

          <div className="pointer-events-none absolute inset-0" aria-hidden>
            <div className="absolute left-1/2 top-[28%] h-64 w-64 -translate-x-1/2 rounded-full bg-coral/25 blur-[72px]" />
            <div className="absolute bottom-[18%] left-[12%] h-48 w-48 rounded-full bg-mint/15 blur-[64px]" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 w-full max-w-sm text-center"
          >
            <p
              className="font-display text-3xl tracking-tight text-cream"
              style={{ fontWeight: 800 }}
            >
              vibed<span className="text-coral">.</span>
            </p>

            <p className="mt-5 font-display text-[11px] font-bold uppercase tracking-[0.35em] text-mint">
              {t.discover.itsAVibe}
            </p>

            <h2 className="mt-2 font-display text-5xl font-extrabold tracking-tight text-cream sm:text-6xl">
              {t.discover.youVibed}
            </h2>

            <div className="relative mx-auto mt-8 flex items-center justify-center">
              <div className="relative z-10 h-28 w-28 overflow-hidden rounded-full ring-4 ring-coral/80 shadow-[0_0_28px_rgba(255,61,104,0.35)]">
                {match.myPhoto ? (
                  <Image
                    src={match.myPhoto}
                    alt=""
                    fill
                    className="object-cover"
                    unoptimized={match.myPhoto.startsWith("data:")}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-ink-elevated font-display text-3xl font-bold text-coral">
                    vibed
                  </div>
                )}
              </div>

              <div className="relative z-20 -mx-3 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-coral to-mint text-ink shadow-lg">
                <span className="font-display text-[10px] font-extrabold leading-none tracking-tight">
                  vibed<span className="text-ink">.</span>
                </span>
              </div>

              <div className="relative z-10 h-28 w-28 overflow-hidden rounded-full ring-4 ring-mint/80 shadow-[0_0_28px_rgba(61,255,181,0.3)]">
                <Image
                  src={match.photo}
                  alt={match.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            </div>

            <p className="mt-6 text-lg text-cream/85">
              {t.discover.matchedWith}{" "}
              <span className="font-display text-xl font-bold text-cream">
                {match.name}
              </span>
            </p>
            <p className="mt-1 text-sm text-muted">{t.discover.vibedBody}</p>

            <div className="mt-8 flex flex-col gap-2.5">
              <Button
                className="w-full"
                size="lg"
                type="button"
                onClick={() => {
                  close();
                  router.push(
                    match.matchId ? `/matches/${match.matchId}` : "/matches"
                  );
                }}
              >
                {t.discover.sendMessage}
              </Button>
              <Button
                variant="ghost"
                className="w-full"
                type="button"
                onClick={close}
              >
                {t.discover.keepSwiping}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
