"use client";

import { AuthGuard } from "@/components/auth-guard";
import { BottomNav } from "@/components/bottom-nav";
import { FeatureTour } from "@/components/feature-tour";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="mesh-bg grain min-h-dvh pb-28">
        <div className="relative z-10 mx-auto min-h-dvh max-w-lg">{children}</div>
        <BottomNav />
        <FeatureTour />
      </div>
    </AuthGuard>
  );
}
