"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  AD_REWARDS,
  COUNTRY_TIMEZONE,
  DATE_IDEAS,
  MAIN_CHARACTER_WEEK,
  VIBE_CHECK_PROMPTS,
} from "./constants";
import { MOCK_PROFILES, getProfileById } from "./mock-data";
import type {
  AdRewardKind,
  AuthUser,
  CityVibePost,
  Gender,
  LookingFor,
  Match,
  Message,
  Preferences,
  PromptAnswer,
  Reel,
  ReelFlag,
  ReelSource,
  SituationshipStatus,
  SoftLaunchStory,
  SubscriptionTier,
  VibeCheckAnswer,
} from "./types";
import {
  canAuraBoost,
  canLike,
  canPostReel,
  canRewind,
  canSuperLike,
  canUnlockSoftLaunch,
  canWatchAdForReward,
  canWatchReel,
  freshUsage,
  getLimits,
  isSoftLaunchPublic,
  isVibeCheckComplete,
  maybeResetUsage,
  migrateUser,
  overlappingSlots,
  uid,
} from "./utils";

interface RegisterPayload {
  email: string;
  name: string;
  birthday: string;
  gender: Gender;
  city: string;
  country: string;
  countryCode: string;
}

interface OnboardingPayload {
  photos: string[];
  bio: string;
  lookingFor: LookingFor[];
  interests: string[];
  prompts: PromptAnswer[];
  languages: string[];
  preferences: Preferences;
}

function defaultMatch(userId: string): Match {
  return {
    id: uid("match"),
    userId,
    matchedAt: new Date().toISOString(),
    unread: 0,
    softLaunchPrivate: true,
    softLaunchUnlockedByMe: false,
    softLaunchUnlockedByThem: Math.random() > 0.45,
    situationshipStatus: "undefined",
    vibeCheckMe: [],
    vibeCheckThem: [],
    proposedSlots: [],
  };
}

function demoTheirVibeCheck(): VibeCheckAnswer[] {
  const picks = [...VIBE_CHECK_PROMPTS].sort(() => Math.random() - 0.5).slice(0, 3);
  const answers = [
    "Slow mornings + good coffee",
    "Voice notes > dry texts",
    "Kind to service workers",
    "Flaking without a heads up",
    "Walk + something sweet",
    "Blurry cafe story, always",
  ];
  return picks.map((prompt, i) => ({
    prompt,
    answer: answers[i % answers.length],
  }));
}

interface AppState {
  user: AuthUser | null;
  lastPassedId: string | null;
  hydrated: boolean;
  setHydrated: (v: boolean) => void;
  register: (payload: RegisterPayload) => void;
  login: (email: string) => boolean;
  logout: () => void;
  completeOnboarding: (payload: OnboardingPayload) => void;
  updatePreferences: (prefs: Partial<Preferences>) => void;
  updateProfile: (patch: Partial<AuthUser>) => void;
  like: (profileId: string) => { matched: boolean; blocked?: "limit" };
  pass: (profileId: string) => { blocked?: "limit" };
  superLike: (profileId: string) => { matched: boolean; blocked?: "limit" };
  rewind: () => { blocked?: "limit" | "none" };
  sendMessage: (matchId: string, text: string) => { blocked?: "vibe-check" };
  markMatchRead: (matchId: string) => void;
  watchReel: () => { blocked?: "limit" };
  upgrade: (tier: SubscriptionTier) => void;
  setPassport: (city: string, country: string) => void;
  submitVibeCheck: (matchId: string, answers: VibeCheckAnswer[]) => void;
  setSituationshipStatus: (matchId: string, status: SituationshipStatus) => void;
  unlockSoftLaunch: (matchId: string) => { blocked?: "limit" | "none"; public?: boolean };
  publishSoftLaunchStory: (matchId: string, caption: string) => { blocked?: "private" };
  unlockSoftLaunchStory: (storyId: string) => { blocked?: "limit" | "already" };
  activateAuraBoost: () => { blocked?: "limit" | "tier"; expiresAt?: string };
  proposeDateSlot: (matchId: string, ideaIndex?: number) => void;
  acceptDateSlot: (
    matchId: string,
    slotId: string
  ) => { blocked?: "self" | "none" | "already" };
  postCityVibe: (prompt: string, answer: string) => void;
  enterMainCharacterWeek: () => { blocked?: "already" | "limit"; reward?: boolean };
  completeFeatureTour: () => void;
  /** Grant bonus quota after a rewarded ad finishes. Daily ad caps apply. */
  claimAdReward: (
    kind: AdRewardKind
  ) => { blocked?: "limit" | "tier" | "none"; amount?: number };
  postReel: (payload: {
    caption: string;
    posterUrl: string;
    videoUrl?: string;
    source?: ReelSource;
    externalUrl?: string;
    flag?: ReelFlag;
  }) => { blocked?: "limit"; reel?: Reel };
}

function calcAge(birthday: string) {
  const b = new Date(birthday);
  const now = new Date();
  let age = now.getFullYear() - b.getFullYear();
  const m = now.getMonth() - b.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < b.getDate())) age -= 1;
  return age;
}

function defaultPrefs(): Preferences {
  return {
    genders: ["woman", "man", "nonbinary", "other"],
    ageMin: 18,
    ageMax: 35,
    maxDistanceKm: 50,
    lookingFor: [],
    interests: [],
    countries: [],
    globalMode: true,
    reelFlagFilter: "all",
  };
}

function createLikedMePool(userId: string) {
  return MOCK_PROFILES.filter((p) => p.id !== userId)
    .slice(0, 6)
    .map((p) => p.id);
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      lastPassedId: null,
      hydrated: false,
      setHydrated: (v) => set({ hydrated: v }),

      register: (payload) => {
        const id = uid("user");
        const age = calcAge(payload.birthday);
        const user: AuthUser = {
          id,
          email: payload.email.toLowerCase().trim(),
          name: payload.name.trim(),
          age,
          birthday: payload.birthday,
          gender: payload.gender,
          bio: "",
          city: payload.city,
          country: payload.country,
          countryCode: payload.countryCode,
          photos: [],
          lookingFor: [],
          interests: [],
          prompts: [],
          languages: ["English"],
          timezone: COUNTRY_TIMEZONE[payload.countryCode] ?? "UTC",
          onboardingComplete: false,
          preferences: defaultPrefs(),
          tier: "free",
          usage: freshUsage(),
          likedIds: [],
          passedIds: [],
          superLikedIds: [],
          matches: [],
          messages: [],
          likedMeIds: createLikedMePool(id),
          unlockedSoftLaunchIds: [],
          mySoftLaunchStories: [],
          cityVibePosts: [],
          mainCharacterReelIds: [],
          challengeRewardClaimed: false,
          hasSeenFeatureTour: false,
          myReels: [],
        };
        set({ user, lastPassedId: null });
      },

      login: (email) => {
        const user = get().user;
        if (user && user.email === email.toLowerCase().trim()) {
          set({ user: migrateUser({ ...user, usage: maybeResetUsage(user.usage) }) });
          return true;
        }
        return false;
      },

      logout: () => set({ user: null, lastPassedId: null }),

      completeOnboarding: (payload) => {
        const user = get().user;
        if (!user) return;
        set({
          user: migrateUser({
            ...user,
            ...payload,
            onboardingComplete: true,
          }),
        });
      },

      updatePreferences: (prefs) => {
        const user = get().user;
        if (!user) return;
        set({
          user: {
            ...user,
            preferences: { ...user.preferences, ...prefs },
          },
        });
      },

      updateProfile: (patch) => {
        const user = get().user;
        if (!user) return;
        set({ user: { ...user, ...patch } });
      },

      like: (profileId) => {
        const user = get().user;
        if (!user) return { matched: false };
        const usage = maybeResetUsage(user.usage);
        const nextUser = { ...user, usage };
        if (!canLike(nextUser)) return { matched: false, blocked: "limit" };

        const likedIds = [...new Set([...nextUser.likedIds, profileId])];
        const likedMe = nextUser.likedMeIds.includes(profileId);
        let matches = nextUser.matches;
        let matched = false;

        const addMatch = () => {
          if (matches.some((m) => m.userId === profileId)) return;
          matched = true;
          matches = [defaultMatch(profileId), ...matches];
        };

        if (likedMe) addMatch();
        if (!matched && Math.random() < 0.28) addMatch();

        set({
          user: {
            ...nextUser,
            likedIds,
            matches,
            usage: { ...usage, likesUsed: usage.likesUsed + 1 },
          },
          lastPassedId: null,
        });
        return { matched };
      },

      pass: (profileId) => {
        const user = get().user;
        if (!user) return {};
        set({
          user: {
            ...user,
            passedIds: [...new Set([...user.passedIds, profileId])],
          },
          lastPassedId: profileId,
        });
        return {};
      },

      superLike: (profileId) => {
        const user = get().user;
        if (!user) return { matched: false };
        const usage = maybeResetUsage(user.usage);
        const nextUser = { ...user, usage };
        // Aura spends Super Vibes only — not the daily like quota
        if (!canSuperLike(nextUser)) return { matched: false, blocked: "limit" };

        const likedIds = [...new Set([...nextUser.likedIds, profileId])];
        const likedMe = nextUser.likedMeIds.includes(profileId);
        let matches = nextUser.matches;
        let matched = false;

        const addMatch = () => {
          if (matches.some((m) => m.userId === profileId)) return;
          matched = true;
          matches = [defaultMatch(profileId), ...matches];
        };

        if (likedMe) addMatch();
        // Super Vibes match a bit more often than a regular Vibe
        if (!matched && Math.random() < 0.42) addMatch();

        set({
          user: {
            ...nextUser,
            likedIds,
            matches,
            superLikedIds: [...new Set([...nextUser.superLikedIds, profileId])],
            usage: {
              ...usage,
              superLikesUsed: usage.superLikesUsed + 1,
            },
          },
          lastPassedId: null,
        });
        return { matched };
      },

      rewind: () => {
        const user = get().user;
        const lastPassedId = get().lastPassedId;
        if (!user) return { blocked: "none" };
        if (!lastPassedId) return { blocked: "none" };
        const usage = maybeResetUsage(user.usage);
        const nextUser = { ...user, usage };
        if (!canRewind(nextUser)) return { blocked: "limit" };

        set({
          user: {
            ...nextUser,
            passedIds: nextUser.passedIds.filter((id) => id !== lastPassedId),
            likedIds: nextUser.likedIds.filter((id) => id !== lastPassedId),
            usage: { ...usage, rewindsUsed: usage.rewindsUsed + 1 },
          },
          lastPassedId: null,
        });
        return {};
      },

      sendMessage: (matchId, text) => {
        const user = get().user;
        if (!user || !text.trim()) return {};
        const match = user.matches.find((m) => m.id === matchId);
        if (!match || !isVibeCheckComplete(match)) {
          return { blocked: "vibe-check" };
        }

        const msg: Message = {
          id: uid("msg"),
          matchId,
          senderId: user.id,
          text: text.trim(),
          createdAt: new Date().toISOString(),
        };
        set({
          user: {
            ...user,
            messages: [...user.messages, msg],
            matches: user.matches.map((m) =>
              m.id === matchId
                ? {
                    ...m,
                    lastMessage: text.trim(),
                    lastMessageAt: msg.createdAt,
                  }
                : m
            ),
          },
        });

        const replies = [
          "okay but this made me smile 😭",
          "wait you're actually funny",
          "soft launching this chat already",
          "where have you been hiding",
          "say less — coffee this weekend?",
        ];
        const reply: Message = {
          id: uid("msg"),
          matchId,
          senderId: match.userId,
          text: replies[Math.floor(Math.random() * replies.length)],
          createdAt: new Date(Date.now() + 1200).toISOString(),
        };
        setTimeout(() => {
          const current = get().user;
          if (!current) return;
          set({
            user: {
              ...current,
              messages: [...current.messages, reply],
              matches: current.matches.map((m) =>
                m.id === matchId
                  ? {
                      ...m,
                      lastMessage: reply.text,
                      lastMessageAt: reply.createdAt,
                      unread: m.unread + 1,
                    }
                  : m
              ),
            },
          });
        }, 1400);
        return {};
      },

      markMatchRead: (matchId) => {
        const user = get().user;
        if (!user) return;
        const target = user.matches.find((m) => m.id === matchId);
        if (!target || target.unread <= 0) return;
        set({
          user: {
            ...user,
            matches: user.matches.map((m) =>
              m.id === matchId ? { ...m, unread: 0 } : m
            ),
          },
        });
      },

      watchReel: () => {
        const user = get().user;
        if (!user) return {};
        const usage = maybeResetUsage(user.usage);
        const nextUser = { ...user, usage };
        if (!canWatchReel(nextUser)) return { blocked: "limit" };
        set({
          user: {
            ...nextUser,
            usage: { ...usage, reelsWatched: usage.reelsWatched + 1 },
          },
        });
        return {};
      },

      upgrade: (tier) => {
        const user = get().user;
        if (!user) return;
        set({ user: { ...user, tier } });
      },

      setPassport: (city, country) => {
        const user = get().user;
        if (!user) return;
        set({
          user: {
            ...user,
            passportCity: city,
            passportCountry: country,
          },
        });
      },

      submitVibeCheck: (matchId, answers) => {
        const user = get().user;
        if (!user) return;
        set({
          user: {
            ...user,
            matches: user.matches.map((m) => {
              if (m.id !== matchId) return m;
              const vibeCheckThem =
                m.vibeCheckThem.length >= 3 ? m.vibeCheckThem : demoTheirVibeCheck();
              return {
                ...m,
                vibeCheckMe: answers.slice(0, 3),
                vibeCheckThem,
              };
            }),
          },
        });
      },

      setSituationshipStatus: (matchId, status) => {
        const user = get().user;
        if (!user) return;
        set({
          user: {
            ...user,
            matches: user.matches.map((m) =>
              m.id === matchId ? { ...m, situationshipStatus: status } : m
            ),
          },
        });
      },

      unlockSoftLaunch: (matchId) => {
        const user = get().user;
        if (!user) return { blocked: "none" };
        const match = user.matches.find((m) => m.id === matchId);
        if (!match) return { blocked: "none" };

        const next = {
          ...match,
          softLaunchUnlockedByMe: true,
          softLaunchUnlockedByThem:
            match.softLaunchUnlockedByThem || Math.random() > 0.35,
        };
        const isPublic = isSoftLaunchPublic(next);

        set({
          user: {
            ...user,
            matches: user.matches.map((m) =>
              m.id === matchId
                ? {
                    ...next,
                    softLaunchPrivate: !isPublic,
                  }
                : m
            ),
          },
        });
        return { public: isPublic };
      },

      publishSoftLaunchStory: (matchId, caption) => {
        const user = get().user;
        if (!user) return { blocked: "private" };
        const match = user.matches.find((m) => m.id === matchId);
        if (!match || !isSoftLaunchPublic(match)) return { blocked: "private" };
        const partner = getProfileById(match.userId);
        const story: SoftLaunchStory = {
          id: uid("sl"),
          matchId,
          userId: user.id,
          partnerId: match.userId,
          partnerName: partner ? `${partner.name[0]}.` : "?",
          caption: caption.trim() || "soft launching this era",
          posterUrl: user.photos[0] ?? partner?.photos[0] ?? "",
          createdAt: new Date().toISOString(),
          isPublic: true,
        };
        set({
          user: {
            ...user,
            mySoftLaunchStories: [story, ...user.mySoftLaunchStories],
          },
        });
        return {};
      },

      unlockSoftLaunchStory: (storyId) => {
        const user = get().user;
        if (!user) return { blocked: "already" };
        if (user.unlockedSoftLaunchIds.includes(storyId) || user.tier !== "free") {
          if (!user.unlockedSoftLaunchIds.includes(storyId)) {
            set({
              user: {
                ...user,
                unlockedSoftLaunchIds: [...user.unlockedSoftLaunchIds, storyId],
              },
            });
          }
          return {};
        }
        const usage = maybeResetUsage(user.usage);
        const nextUser = { ...user, usage };
        if (!canUnlockSoftLaunch(nextUser)) return { blocked: "limit" };
        set({
          user: {
            ...nextUser,
            unlockedSoftLaunchIds: [...nextUser.unlockedSoftLaunchIds, storyId],
            usage: {
              ...usage,
              softLaunchUnlocksUsed: usage.softLaunchUnlocksUsed + 1,
            },
          },
        });
        return {};
      },

      activateAuraBoost: () => {
        const user = get().user;
        if (!user) return { blocked: "tier" };
        const usage = maybeResetUsage(user.usage);
        const nextUser = { ...user, usage };
        if (user.tier !== "ultra") return { blocked: "tier" };
        if (!canAuraBoost(nextUser)) return { blocked: "limit" };
        const expiresAt = new Date(Date.now() + 1000 * 60 * 60).toISOString();
        set({
          user: {
            ...nextUser,
            auraBoostUntil: expiresAt,
            usage: { ...usage, boostsUsed: usage.boostsUsed + 1 },
          },
        });
        return { expiresAt };
      },

      proposeDateSlot: (matchId, ideaIndex = 0) => {
        const user = get().user;
        if (!user) return;
        const match = user.matches.find((m) => m.id === matchId);
        const partner = match ? getProfileById(match.userId) : null;
        if (!match || !partner) return;
        const generated = overlappingSlots(
          user.timezone,
          partner.timezone,
          DATE_IDEAS
        );
        const pick = generated[ideaIndex % generated.length];
        const slotId = uid("slot");
        const slot = {
          id: slotId,
          startISO: pick.startISO,
          endISO: pick.endISO,
          idea: pick.idea,
          proposedBy: user.id,
        };
        set({
          user: {
            ...user,
            matches: user.matches.map((m) =>
              m.id === matchId
                ? { ...m, proposedSlots: [slot, ...m.proposedSlots] }
                : m
            ),
          },
        });

        // Demo: partner locks in after a short delay (proposer cannot self-lock)
        const partnerId = partner.id;
        setTimeout(() => {
          const current = get().user;
          if (!current) return;
          set({
            user: {
              ...current,
              matches: current.matches.map((m) => {
                if (m.id !== matchId) return m;
                return {
                  ...m,
                  proposedSlots: m.proposedSlots.map((s) =>
                    s.id === slotId && !s.accepted
                      ? { ...s, accepted: true, lockedBy: partnerId }
                      : s
                  ),
                  lastMessage: "Date locked in",
                  lastMessageAt: new Date().toISOString(),
                  unread: m.unread + 1,
                };
              }),
            },
          });
        }, 1600);
      },

      acceptDateSlot: (matchId, slotId) => {
        const user = get().user;
        if (!user) return { blocked: "none" };
        const match = user.matches.find((m) => m.id === matchId);
        const slot = match?.proposedSlots.find((s) => s.id === slotId);
        if (!match || !slot) return { blocked: "none" };
        if (slot.accepted) return { blocked: "already" };
        // Proposer cannot lock their own proposal — wait for the other person
        if (slot.proposedBy === user.id) return { blocked: "self" };

        set({
          user: {
            ...user,
            matches: user.matches.map((m) =>
              m.id === matchId
                ? {
                    ...m,
                    proposedSlots: m.proposedSlots.map((s) =>
                      s.id === slotId
                        ? { ...s, accepted: true, lockedBy: user.id }
                        : s
                    ),
                    lastMessage: "Date locked in",
                    lastMessageAt: new Date().toISOString(),
                  }
                : m
            ),
          },
        });
        return {};
      },

      postCityVibe: (prompt, answer) => {
        const user = get().user;
        if (!user || !answer.trim()) return;
        const post: CityVibePost = {
          id: uid("cv"),
          city: user.city,
          countryCode: user.countryCode,
          prompt,
          answer: answer.trim(),
          createdAt: new Date().toISOString(),
          anonymousHandle: `${user.name.slice(0, 3).toLowerCase()}.anon`,
          authorId: user.id,
          tags: user.interests.slice(0, 3),
        };
        set({
          user: {
            ...user,
            cityVibePosts: [post, ...user.cityVibePosts],
          },
        });
      },

      enterMainCharacterWeek: () => {
        const user = get().user;
        if (!user) return { blocked: "already" };
        if (user.mainCharacterReelIds.includes(MAIN_CHARACTER_WEEK.id)) {
          return { blocked: "already" };
        }
        const usage = maybeResetUsage(user.usage);
        let reward = false;
        let superLikesUsed = usage.superLikesUsed;
        if (!user.challengeRewardClaimed) {
          reward = true;
          superLikesUsed = Math.max(0, superLikesUsed - MAIN_CHARACTER_WEEK.rewardSuperVibes);
        }
        set({
          user: {
            ...user,
            mainCharacterReelIds: [
              ...user.mainCharacterReelIds,
              MAIN_CHARACTER_WEEK.id,
            ],
            challengeRewardClaimed: true,
            usage: {
              ...usage,
              reelsPosted: usage.reelsPosted + 1,
              superLikesUsed,
            },
          },
        });
        return { reward };
      },

      completeFeatureTour: () => {
        const user = get().user;
        if (!user) return;
        set({
          user: { ...user, hasSeenFeatureTour: true },
        });
      },

      claimAdReward: (kind) => {
        const user = get().user;
        if (!user) return { blocked: "none" };
        const usage = maybeResetUsage(user.usage);
        const nextUser = { ...user, usage };
        if (!canWatchAdForReward(nextUser, kind)) {
          const limits = getLimits(user.tier);
          const unlimited =
            (kind === "likes" && !Number.isFinite(limits.likesPerDay)) ||
            (kind === "reels" && !Number.isFinite(limits.reelsWatchPerDay)) ||
            (kind === "rewinds" && !Number.isFinite(limits.rewindsPerDay));
          return { blocked: unlimited ? "tier" : "limit" };
        }

        const cfg = AD_REWARDS[kind];
        const patch =
          kind === "likes"
            ? {
                likesBonus: (usage.likesBonus ?? 0) + cfg.amount,
                adLikesWatched: (usage.adLikesWatched ?? 0) + 1,
              }
            : kind === "reels"
              ? {
                  reelsBonus: (usage.reelsBonus ?? 0) + cfg.amount,
                  adReelsWatched: (usage.adReelsWatched ?? 0) + 1,
                }
              : {
                  rewindsBonus: (usage.rewindsBonus ?? 0) + cfg.amount,
                  adRewindsWatched: (usage.adRewindsWatched ?? 0) + 1,
                };

        set({
          user: {
            ...nextUser,
            usage: { ...usage, ...patch },
          },
        });
        return { amount: cfg.amount };
      },

      postReel: (payload) => {
        const user = get().user;
        if (!user) return { blocked: "limit" };
        const usage = maybeResetUsage(user.usage);
        const nextUser = { ...user, usage };
        if (!canPostReel(nextUser)) return { blocked: "limit" };

        const reel: Reel = {
          id: uid("reel"),
          userId: user.id,
          videoUrl: payload.videoUrl ?? "",
          posterUrl: payload.posterUrl,
          caption: payload.caption.trim() || "new vibe drop",
          likes: 0,
          createdAt: new Date().toISOString(),
          flag: payload.flag ?? "neutral",
          source: payload.source ?? "upload",
          externalUrl: payload.externalUrl,
        };

        set({
          user: {
            ...nextUser,
            myReels: [reel, ...(nextUser.myReels ?? [])],
            usage: {
              ...usage,
              reelsPosted: usage.reelsPosted + 1,
            },
          },
        });
        return { reel };
      },
    }),
    {
      name: "vibed-storage",
      // Avoid localStorage clobbering SSR HTML before React hydrates (Capacitor/WebView)
      skipHydration: true,
      partialize: (s) => ({ user: s.user, lastPassedId: s.lastPassedId }),
      onRehydrateStorage: () => (state) => {
        if (state?.user) {
          state.user = migrateUser(state.user);
        }
        // Unblock AuthGuard as soon as persist finishes (Providers also sets this)
        queueMicrotask(() => {
          useAppStore.setState({ hydrated: true });
        });
      },
    }
  )
);
