"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BrandMark, Button, Input } from "@/components/ui";
import { useAppStore } from "@/lib/store";

export default function LoginPage() {
  const router = useRouter();
  const login = useAppStore((s) => s.login);
  const user = useAppStore((s) => s.user);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(email)) {
      const u = useAppStore.getState().user;
      router.push(u?.onboardingComplete ? "/discover" : "/onboarding");
    } else if (user) {
      setError("Email doesn't match the account on this device. Try registering.");
    } else {
      setError("No account found on this device. Create one to get started.");
    }
  };

  return (
    <div className="mesh-bg grain relative min-h-dvh px-5 py-8">
      <div className="pointer-events-none absolute -left-16 top-16 h-52 w-52 rounded-full bg-mint/15 blur-[90px]" />
      <div className="pointer-events-none absolute -right-12 bottom-24 h-44 w-44 rounded-full bg-coral/20 blur-[80px]" />
      <div className="relative z-10 mx-auto w-full max-w-md">
        <BrandMark />
        <h1 className="mt-8 font-display text-[2.15rem] font-extrabold tracking-tight">
          Welcome back
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Demo auth is local to this browser — use the email you registered with.
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            required
          />
          {error && <p className="text-sm text-coral">{error}</p>}
          <Button type="submit" className="w-full" size="lg">
            Log in
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          New here?{" "}
          <Link href="/register" className="text-mint hover:underline">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}
