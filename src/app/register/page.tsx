"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BrandMark, Button, Input, Chip } from "@/components/ui";
import { COUNTRIES, GENDER_OPTIONS } from "@/lib/constants";
import { useLocaleStore } from "@/lib/locale-store";
import { useAppStore } from "@/lib/store";
import type { Gender } from "@/lib/types";

export default function RegisterPage() {
  const router = useRouter();
  const register = useAppStore((s) => s.register);
  const syncFromCountry = useLocaleStore((s) => s.syncFromCountry);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [birthday, setBirthday] = useState("");
  const [gender, setGender] = useState<Gender>("woman");
  const [countryCode, setCountryCode] = useState("US");
  const [city, setCity] = useState("New York");
  const [error, setError] = useState("");

  const country = COUNTRIES.find((c) => c.code === countryCode)!;

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name || !email || !birthday) {
      setError("Fill in all required fields.");
      return;
    }
    const age =
      new Date().getFullYear() -
      new Date(birthday).getFullYear() -
      (new Date() <
      new Date(
        new Date().getFullYear(),
        new Date(birthday).getMonth(),
        new Date(birthday).getDate()
      )
        ? 1
        : 0);
    if (age < 18) {
      setError("You must be 18+ to join vibed.");
      return;
    }
    register({
      email,
      name,
      birthday,
      gender,
      city,
      country: country.name,
      countryCode,
    });
    syncFromCountry(countryCode);
    router.push("/onboarding");
  };

  return (
    <div className="mesh-bg grain relative min-h-dvh px-5 py-8">
      <div className="pointer-events-none absolute -right-16 top-10 h-56 w-56 rounded-full bg-coral/20 blur-[90px]" />
      <div className="pointer-events-none absolute -left-20 bottom-20 h-48 w-48 rounded-full bg-mint/15 blur-[80px]" />
      <div className="relative z-10 mx-auto w-full max-w-md">
        <BrandMark />
        <h1 className="mt-8 font-display text-[2.15rem] font-extrabold tracking-tight">
          Join vibed
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Create your profile — free forever, with optional upgrades.
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <Input
            label="First name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="What should we call you?"
            required
          />
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            required
          />
          <Input
            label="Birthday"
            type="date"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
            required
          />

          <div className="space-y-2">
            <span className="text-xs font-medium uppercase tracking-wider text-muted">
              I am a
            </span>
            <div className="flex flex-wrap gap-2">
              {GENDER_OPTIONS.map((g) => (
                <Chip
                  key={g.id}
                  active={gender === g.id}
                  onClick={() => setGender(g.id)}
                >
                  {g.label}
                </Chip>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <label className="block space-y-1.5">
              <span className="text-xs font-medium uppercase tracking-wider text-muted">
                Country
              </span>
              <select
                className="w-full rounded-2xl border border-line bg-ink-soft/80 px-3 py-3.5 text-cream outline-none transition focus:border-coral/45"
                value={countryCode}
                onChange={(e) => {
                  const c = COUNTRIES.find((x) => x.code === e.target.value)!;
                  setCountryCode(c.code);
                  setCity(c.cities[0]);
                }}
              >
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="block space-y-1.5">
              <span className="text-xs font-medium uppercase tracking-wider text-muted">
                City
              </span>
              <select
                className="w-full rounded-2xl border border-line bg-ink-soft/80 px-3 py-3.5 text-cream outline-none transition focus:border-coral/45"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              >
                {country.cities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {error && <p className="text-sm text-coral">{error}</p>}

          <Button type="submit" className="w-full shine" size="lg">
            Continue
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          Already vibing?{" "}
          <Link href="/login" className="text-mint hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
