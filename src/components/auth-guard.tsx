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
        <span
          className="h-8 w-8 animate-spin rounded-full border-2 border-white/15 border-t-coral"
          role="status"
          aria-label="Loading"
        />
      </div>
    );
  }

  if (requireOnboarding && !user.onboardingComplete) {
    return (
      <div className="mesh-bg flex min-h-dvh items-center justify-center">
        <span
          className="h-8 w-8 animate-spin rounded-full border-2 border-white/15 border-t-coral"
          role="status"
          aria-label="Loading"
        />
      </div>
    );
  }

  return <>{children}</>;
}
