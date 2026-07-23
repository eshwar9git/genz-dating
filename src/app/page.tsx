"use client";

import Link from "next/link";
import { BrandMark, buttonClassName } from "@/components/ui";
import { useAppStore } from "@/lib/store";
import { useLocaleStore } from "@/lib/locale-store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LandingPage() {
  const router = useRouter();
  const user = useAppStore((s) => s.user);
  const hydrated = useAppStore((s) => s.hydrated);
  const t = useLocaleStore((s) => s.t)();

  useEffect(() => {
    if (!hydrated || !user) return;
    if (user.onboardingComplete) router.replace("/discover");
    else router.replace("/onboarding");
  }, [hydrated, user, router]);

  return (
    <div className="relative min-h-dvh overflow-hidden bg-ink grain">
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 scale-105 animate-aurora"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=1800&h=2400&fit=crop&q=80)",
            backgroundSize: "cover",
            backgroundPosition: "center 28%",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/55 via-ink/35 to-ink" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(7,8,12,0.55)_100%)]" />
        <div className="absolute -left-20 top-24 h-72 w-72 animate-aurora rounded-full bg-coral/25 blur-[100px]" />
        <div className="absolute -right-16 bottom-40 h-64 w-64 animate-float rounded-full bg-mint/15 blur-[90px]" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-dvh max-w-lg flex-col px-6 pb-10 pt-6">
        <header className="flex items-center justify-between">
          <BrandMark />
          <Link
            href="/login"
            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-cream/90 backdrop-blur-md transition hover:bg-white/10"
          >
            {t.landing.login}
          </Link>
        </header>

        <main className="flex flex-1 flex-col justify-end pb-2 pt-20">
          <div>
            <p
              className="font-display text-[4.75rem] font-extrabold leading-[0.85] tracking-[-0.05em] sm:text-[5.5rem]"
              style={{ fontWeight: 800 }}
            >
              <span className="text-gradient">vibed</span>
              <span className="text-coral">.</span>
            </p>
            <h1 className="mt-5 max-w-[14ch] font-display text-[1.75rem] font-semibold leading-[1.15] tracking-tight text-cream sm:text-[2rem]">
              {t.landing.headline}
            </h1>
            <p className="mt-4 max-w-[30ch] text-[15px] leading-relaxed text-cream/65">
              {t.landing.sub}
            </p>
          </div>

          <div className="mt-9 flex flex-col gap-3">
            <Link
              href="/register"
              className={buttonClassName("primary", "lg", "w-full")}
            >
              {t.landing.create}
            </Link>
            <Link
              href="/login"
              className={buttonClassName("secondary", "lg", "w-full")}
            >
              {t.landing.haveAccount}
            </Link>
          </div>

          <p className="mt-8 text-center text-[11px] tracking-[0.18em] text-cream/40 uppercase">
            {t.landing.worldwide}
          </p>
        </main>
      </div>
    </div>
  );
}
