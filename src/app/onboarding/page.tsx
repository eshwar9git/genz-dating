"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Camera, ChevronLeft, ChevronRight } from "lucide-react";
import { AuthGuard } from "@/components/auth-guard";
import { BrandMark, Button, Chip, Input, TextArea } from "@/components/ui";
import {
  GENDER_OPTIONS,
  INTERESTS,
  LOOKING_FOR_OPTIONS,
  PROMPTS,
} from "@/lib/constants";
import { useAppStore } from "@/lib/store";
import type { Gender, LookingFor, PromptAnswer } from "@/lib/types";
import { cn } from "@/lib/utils";

const DEMO_PHOTOS = [
  "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&h=1000&fit=crop",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&h=1000&fit=crop",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&h=1000&fit=crop",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&h=1000&fit=crop",
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&h=1000&fit=crop",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&h=1000&fit=crop",
];

const STEPS = ["Photos", "About you", "Dating goals", "Interests", "Prompts", "Preferences"];

function OnboardingInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editing = searchParams.get("edit") === "1";
  const user = useAppStore((s) => s.user)!;
  const completeOnboarding = useAppStore((s) => s.completeOnboarding);

  const [step, setStep] = useState(0);
  const [photos, setPhotos] = useState<string[]>(user.photos.length ? user.photos : []);
  const [bio, setBio] = useState(user.bio);
  const [lookingFor, setLookingFor] = useState<LookingFor[]>(user.lookingFor);
  const [interests, setInterests] = useState<string[]>(user.interests);
  const [prompts, setPrompts] = useState<PromptAnswer[]>(
    user.prompts.length
      ? user.prompts
      : [
          { prompt: PROMPTS[0], answer: "" },
          { prompt: PROMPTS[1], answer: "" },
        ]
  );
  const [genders, setGenders] = useState<Gender[]>(["woman", "man"]);
  const [ageMin, setAgeMin] = useState(18);
  const [ageMax, setAgeMax] = useState(35);
  const [maxDistanceKm, setMaxDistanceKm] = useState(80);
  const [globalMode, setGlobalMode] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user.onboardingComplete && !editing) router.replace("/discover");
  }, [user.onboardingComplete, editing, router]);

  const progress = ((step + 1) / STEPS.length) * 100;

  const toggle = <T,>(arr: T[], item: T) =>
    arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item];

  const addDemoPhoto = () => {
    const next = DEMO_PHOTOS.find((p) => !photos.includes(p));
    if (next) setPhotos((p) => [...p, next]);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setPhotos((p) => [...p, reader.result as string].slice(0, 6));
      }
    };
    reader.readAsDataURL(file);
  };

  const canNext = useMemo(() => {
    if (step === 0) return photos.length >= 2;
    if (step === 1) return bio.trim().length >= 10;
    if (step === 2) return lookingFor.length >= 1;
    if (step === 3) return interests.length >= 3;
    if (step === 4) return prompts.every((p) => p.answer.trim().length >= 2);
    if (step === 5) return genders.length >= 1;
    return true;
  }, [step, photos, bio, lookingFor, interests, prompts, genders]);

  // Clear stale validation once the current step becomes valid
  useEffect(() => {
    if (canNext && error) setError("");
  }, [canNext, error]);

  const finish = () => {
    completeOnboarding({
      photos,
      bio,
      lookingFor,
      interests,
      prompts,
      languages: user.languages.length ? user.languages : ["English"],
      preferences: {
        genders,
        ageMin,
        ageMax,
        maxDistanceKm,
        lookingFor,
        interests: [],
        countries: [],
        globalMode,
        reelFlagFilter: "all",
      },
    });
    router.push("/discover");
  };

  const next = () => {
    setError("");
    if (!canNext) {
      setError("Complete this step to continue.");
      return;
    }
    if (step === STEPS.length - 1) finish();
    else setStep((s) => s + 1);
  };

  return (
    <div className="mesh-bg min-h-dvh px-5 py-6">
      <div className="mx-auto w-full max-w-md">
        <div className="flex items-center justify-between">
          <BrandMark href="#" />
          <span className="text-xs text-muted">
            {step + 1}/{STEPS.length}
          </span>
        </div>
        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-ink-elevated">
          <div
            className="h-full rounded-full bg-gradient-to-r from-coral to-mint transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        <h1 className="mt-6 font-display text-2xl font-bold">{STEPS[step]}</h1>

        <div className="mt-5 min-h-[420px]">
          {step === 0 && (
            <div className="space-y-4">
              <p className="text-sm text-muted">
                Add at least 2 photos. Upload yours or tap to use demo shots.
              </p>
              <div className="grid grid-cols-3 gap-2">
                {Array.from({ length: 6 }).map((_, i) => {
                  const photo = photos[i];
                  return (
                    <div
                      key={i}
                      className={cn(
                        "relative aspect-[3/4] overflow-hidden rounded-2xl border border-dashed border-line bg-ink-soft",
                        photo && "border-solid"
                      )}
                    >
                      {photo ? (
                        <>
                          <Image src={photo} alt="" fill className="object-cover" unoptimized={photo.startsWith("data:")} />
                          <button
                            type="button"
                            className="absolute right-1 top-1 rounded-full bg-ink/70 px-2 text-xs"
                            onClick={() => setPhotos((p) => p.filter((_, idx) => idx !== i))}
                          >
                            ×
                          </button>
                        </>
                      ) : (
                        <label className="flex h-full cursor-pointer flex-col items-center justify-center gap-1 text-muted">
                          <Camera className="h-5 w-5" />
                          <span className="text-[10px]">Upload</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handlePhotoUpload}
                          />
                        </label>
                      )}
                    </div>
                  );
                })}
              </div>
              <Button type="button" variant="secondary" className="w-full" onClick={addDemoPhoto}>
                Add demo photo
              </Button>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <TextArea
                label="Bio"
                rows={5}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Soft launching yourself in one paragraph…"
              />
              <p className="text-xs text-muted">{bio.length}/300 · min 10 chars</p>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3">
              <p className="text-sm text-muted">
                Pick what you&apos;re open to — GenZ relationship categories that match how you date.
              </p>
              <div className="space-y-2">
                {LOOKING_FOR_OPTIONS.map((o) => (
                  <button
                    key={o.id}
                    type="button"
                    onClick={() => setLookingFor((arr) => toggle(arr, o.id))}
                    className={cn(
                      "w-full rounded-2xl border px-4 py-3 text-left transition",
                      lookingFor.includes(o.id)
                        ? "border-coral bg-coral/15"
                        : "border-line bg-ink-elevated/40"
                    )}
                  >
                    <p className="font-semibold">{o.label}</p>
                    <p className="text-xs text-muted">{o.blurb}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-3">
              <p className="text-sm text-muted">Choose at least 3 interests.</p>
              <div className="flex flex-wrap gap-2">
                {INTERESTS.map((interest) => (
                  <Chip
                    key={interest}
                    active={interests.includes(interest)}
                    onClick={() => setInterests((arr) => toggle(arr, interest))}
                  >
                    {interest}
                  </Chip>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <p className="text-sm text-muted">
                Prompts — give people something to vibe with.
              </p>
              {prompts.map((p, i) => (
                <div key={i} className="space-y-2 rounded-2xl border border-line bg-ink-soft p-3">
                  <select
                    className="w-full rounded-xl border border-line bg-ink-elevated px-3 py-2 text-sm outline-none"
                    value={p.prompt}
                    onChange={(e) =>
                      setPrompts((arr) =>
                        arr.map((x, idx) =>
                          idx === i ? { ...x, prompt: e.target.value } : x
                        )
                      )
                    }
                  >
                    {PROMPTS.map((pr) => (
                      <option key={pr} value={pr}>
                        {pr}
                      </option>
                    ))}
                  </select>
                  <Input
                    value={p.answer}
                    onChange={(e) =>
                      setPrompts((arr) =>
                        arr.map((x, idx) =>
                          idx === i ? { ...x, answer: e.target.value } : x
                        )
                      )
                    }
                    placeholder="Your answer"
                  />
                </div>
              ))}
            </div>
          )}

          {step === 5 && (
            <div className="space-y-5">
              <div>
                <p className="mb-2 text-xs uppercase tracking-wider text-muted">
                  Show me
                </p>
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
              </div>

              <div>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-muted">Age range</span>
                  <span>
                    {ageMin} – {ageMax}
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
              </div>

              <div>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-muted">Max distance</span>
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
                />
              </div>

              <button
                type="button"
                onClick={() => setGlobalMode((v) => !v)}
                className={cn(
                  "flex w-full items-center justify-between rounded-2xl border px-4 py-3",
                  globalMode ? "border-mint/40 bg-mint/10" : "border-line bg-ink-elevated"
                )}
              >
                <div className="text-left">
                  <p className="font-semibold">Global mode</p>
                  <p className="text-xs text-muted">
                    Discover people worldwide beyond your local distance
                  </p>
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
            </div>
          )}
        </div>

        {error && <p className="mt-2 text-sm text-coral">{error}</p>}

        <div className="mt-6 flex gap-3">
          <Button
            variant="secondary"
            className="flex-1"
            disabled={step === 0}
            onClick={() => setStep((s) => Math.max(0, s - 1))}
          >
            <ChevronLeft className="h-4 w-4" /> Back
          </Button>
          <Button className="flex-1" onClick={next}>
            {step === STEPS.length - 1 ? "Start vibing" : "Next"}
            {step < STEPS.length - 1 && <ChevronRight className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <AuthGuard requireOnboarding={false}>
      <Suspense
        fallback={
          <div className="mesh-bg flex min-h-dvh items-center justify-center">
            <p className="font-display text-2xl font-bold">vibed.</p>
          </div>
        }
      >
        <OnboardingInner />
      </Suspense>
    </AuthGuard>
  );
}
