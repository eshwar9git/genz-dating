"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { useMounted } from "@/lib/use-mounted";

export function AuthGuard({
  children,
  requireOnboarding = true,
}: {
  children: React.ReactNode;
  requireOnboarding?: boolean;
}) {
  const router = useRouter();
  const user = useAppStore((s) => s.user);
  const hydrated = useAppStore((s) => s.hydrated);
  // Keep SSR + first client paint identical (splash) to avoid hydration mismatch
  const mounted = useMounted();

  useEffect(() => {
    if (!mounted || !hydrated) return;
    if (!user) {
      router.replace("/register");
      return;
    }
    if (requireOnboarding && !user.onboardingComplete) {
      router.replace("/onboarding");
    }
  }, [mounted, hydrated, user, requireOnboarding, router]);

  if (!mounted || !hydrated || !user) {
    return (
      <div className="mesh-bg flex min-h-dvh items-center justify-center">
        <p className="font-display text-2xl font-bold text-cream">
          vibed<span className="text-coral">.</span>
        </p>
      </div>
    );
  }

  if (requireOnboarding && !user.onboardingComplete) {
    return null;
  }

  return <>{children}</>;
}
