"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Lock } from "lucide-react";
import { BrandMark, Button, Chip, LimitBanner } from "@/components/ui";
import { GENDER_OPTIONS, LOOKING_FOR_OPTIONS } from "@/lib/constants";
import { useAppStore } from "@/lib/store";
import type { Gender, LookingFor } from "@/lib/types";
import { canUseAdvancedFilters, cn } from "@/lib/utils";

export default function PreferencesPage() {
  const user = useAppStore((s) => s.user)!;
  const updatePreferences = useAppStore((s) => s.updatePreferences);
  const prefs = user.preferences;
  const advanced = canUseAdvancedFilters(user);

  const [genders, setGenders] = useState<Gender[]>(prefs.genders);
  const [ageMin, setAgeMin] = useState(prefs.ageMin);
  const [ageMax, setAgeMax] = useState(prefs.ageMax);
  const [maxDistanceKm, setMaxDistanceKm] = useState(prefs.maxDistanceKm);
  const [lookingFor, setLookingFor] = useState<LookingFor[]>(prefs.lookingFor);
  const [globalMode, setGlobalMode] = useState(prefs.globalMode);
  const [saved, setSaved] = useState(false);

  const toggle = <T,>(arr: T[], item: T) =>
    arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item];

  const save = () => {
    updatePreferences({
      genders,
      ageMin,
      ageMax,
      maxDistanceKm,
      lookingFor: advanced ? lookingFor : [],
      globalMode: advanced ? globalMode : prefs.globalMode,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="px-4 pt-5 pb-10">
      <div className="flex items-center gap-3">
        <Link href="/discover" className="rounded-full border border-line p-2">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <BrandMark href="/discover" />
      </div>

      <h1 className="mt-6 font-display text-2xl font-bold">Discovery preferences</h1>
      <p className="mt-1 text-sm text-muted">
        Tune who shows up — basic filters free, advanced filters on Plus+.
      </p>

      <div className="mt-6 space-y-6">
        <section>
          <p className="mb-2 text-xs uppercase tracking-wider text-muted">Show me</p>
          <div className="flex flex-wrap gap-2">
            {GENDER_OPTIONS.map((g) => (
              <Chip
                key={g.id}
                active={genders.includes(g.id)}
                onClick={() => setGenders((arr) => toggle(arr, g.id))}
              >
                {g.label}
              </Chip>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-2 flex justify-between text-sm">
            <span className="text-muted">Age</span>
            <span>
              {ageMin}–{ageMax}
            </span>
          </div>
          <div className="flex gap-3">
            <input
              type="range"
              min={18}
              max={ageMax}
              value={ageMin}
              aria-label="Minimum age"
              onChange={(e) => setAgeMin(Number(e.target.value))}
              className="w-full accent-coral"
            />
            <input
              type="range"
              min={ageMin}
              max={55}
              value={ageMax}
              aria-label="Maximum age"
              onChange={(e) => setAgeMax(Number(e.target.value))}
              className="w-full accent-coral"
            />
          </div>
        </section>

        <section>
          <div className="mb-2 flex justify-between text-sm">
            <span className="text-muted">Distance</span>
            <span>{maxDistanceKm} km</span>
          </div>
          <input
            type="range"
            min={5}
            max={200}
            value={maxDistanceKm}
            aria-label="Maximum distance in kilometers"
            onChange={(e) => setMaxDistanceKm(Number(e.target.value))}
            className="w-full accent-mint"
            disabled={globalMode && advanced}
          />
        </section>

        {!advanced && (
          <LimitBanner
            title="Advanced filters are Plus+"
            body="Filter by relationship category and Global mode — unlock with vibed Plus."
          />
        )}

        <section className={cn(!advanced && "pointer-events-none opacity-50")}>
          <div className="mb-2 flex items-center gap-2">
            <p className="text-xs uppercase tracking-wider text-muted">
              Relationship categories
            </p>
            {!advanced && <Lock className="h-3.5 w-3.5 text-muted" />}
          </div>
          <div className="flex flex-wrap gap-2">
            {LOOKING_FOR_OPTIONS.map((o) => (
              <Chip
                key={o.id}
                active={lookingFor.includes(o.id)}
                onClick={() => setLookingFor((arr) => toggle(arr, o.id))}
              >
                {o.label}
              </Chip>
            ))}
          </div>
        </section>

        <button
          type="button"
          disabled={!advanced}
          onClick={() => setGlobalMode((v) => !v)}
          className={cn(
            "flex w-full items-center justify-between rounded-2xl border px-4 py-3",
            globalMode ? "border-mint/40 bg-mint/10" : "border-line bg-ink-elevated",
            !advanced && "opacity-50"
          )}
        >
          <div className="text-left">
            <p className="font-semibold">Global discovery</p>
            <p className="text-xs text-muted">Match worldwide beyond local distance</p>
          </div>
          <span
            className={cn(
              "h-6 w-11 rounded-full p-0.5 transition",
              globalMode ? "bg-mint" : "bg-muted/40"
            )}
          >
            <span
              className={cn(
                "block h-5 w-5 rounded-full bg-white transition",
                globalMode && "translate-x-5"
              )}
            />
          </span>
        </button>

        <Button className="w-full" size="lg" onClick={save}>
          {saved ? "Saved ✓" : "Save preferences"}
        </Button>
      </div>
    </div>
  );
}
