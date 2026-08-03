export type Gender = "woman" | "man" | "nonbinary" | "other";

export type LookingFor =
  | "soft-launch"
  | "situationship"
  | "serious"
  | "casual"
  | "friends-to-lovers"
  | "talking-stage"
  | "open"
  | "long-distance"
  | "marriage-minded"
  | "new-friends";

export type SubscriptionTier = "free" | "plus" | "ultra";

export type SituationshipStatus =
  | "undefined"
  | "talking"
  | "exclusive-ish"
  | "soft-launch";

export type ReelFlag = "green" | "red" | "neutral";

export interface PromptAnswer {
  prompt: string;
  answer: string;
}

export interface VibeCheckAnswer {
  prompt: string;
  answer: string;
}

export interface DateSlot {
  id: string;
  startISO: string;
  endISO: string;
  idea: string;
  proposedBy: string;
  /** True only after the other person (or simulated partner) locks in */
  accepted?: boolean;
  /** Who confirmed the lock — proposer cannot self-lock */
  lockedBy?: string;
}

export interface SoftLaunchStory {
  id: string;
  matchId: string;
  userId: string;
  partnerId: string;
  partnerName: string;
  caption: string;
  posterUrl: string;
  createdAt: string;
  isPublic: boolean;
}

export type ReelSource = "upload" | "instagram" | "tiktok" | "vibed";

export interface Reel {
  id: string;
  userId: string;
  videoUrl: string;
  posterUrl: string;
  caption: string;
  likes: number;
  createdAt: string;
  flag: ReelFlag;
  isAuraBoost?: boolean;
  boostExpiresAt?: string;
  isMainCharacter?: boolean;
  isSoftLaunchStory?: boolean;
  softLaunchStoryId?: string;
  matchId?: string;
  /** Where this reel came from */
  source?: ReelSource;
  /** Original Instagram / TikTok link when imported */
  externalUrl?: string;
}

export interface CityVibePost {
  id: string;
  city: string;
  countryCode: string;
  prompt: string;
  answer: string;
  createdAt: string;
  anonymousHandle: string;
  authorId: string;
  tags: string[];
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  age: number;
  birthday: string;
  gender: Gender;
  bio: string;
  city: string;
  country: string;
  countryCode: string;
  photos: string[];
  lookingFor: LookingFor[];
  interests: string[];
  prompts: PromptAnswer[];
  height?: string;
  languages: string[];
  verified: boolean;
  distanceKm: number;
  lastActive: string;
  timezone: string;
}

export interface Preferences {
  genders: Gender[];
  ageMin: number;
  ageMax: number;
  maxDistanceKm: number;
  lookingFor: LookingFor[];
  interests: string[];
  countries: string[];
  globalMode: boolean;
  reelFlagFilter: ReelFlag | "all";
}

export interface Match {
  id: string;
  userId: string;
  matchedAt: string;
  lastMessage?: string;
  lastMessageAt?: string;
  unread: number;
  softLaunchPrivate: boolean;
  softLaunchUnlockedByMe: boolean;
  softLaunchUnlockedByThem: boolean;
  situationshipStatus: SituationshipStatus;
  vibeCheckMe: VibeCheckAnswer[];
  vibeCheckThem: VibeCheckAnswer[];
  proposedSlots: DateSlot[];
}

export interface Message {
  id: string;
  matchId: string;
  senderId: string;
  text: string;
  createdAt: string;
}

export type AdRewardKind = "likes" | "reels" | "rewinds";

export interface UsageLimits {
  likesUsed: number;
  likesResetAt: string;
  superLikesUsed: number;
  rewindsUsed: number;
  reelsWatched: number;
  reelsPosted: number;
  boostsUsed: number;
  softLaunchUnlocksUsed: number;
  /** Extra quota earned by watching rewarded ads today */
  likesBonus: number;
  reelsBonus: number;
  rewindsBonus: number;
  /** How many rewarded ads claimed today (per reward type) */
  adLikesWatched: number;
  adReelsWatched: number;
  adRewindsWatched: number;
}

export interface UserReport {
  id: string;
  targetUserId: string;
  reason: string;
  details?: string;
  createdAt: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  age: number;
  birthday: string;
  gender: Gender;
  bio: string;
  city: string;
  country: string;
  countryCode: string;
  photos: string[];
  lookingFor: LookingFor[];
  interests: string[];
  prompts: PromptAnswer[];
  languages: string[];
  timezone: string;
  onboardingComplete: boolean;
  preferences: Preferences;
  tier: SubscriptionTier;
  usage: UsageLimits;
  likedIds: string[];
  passedIds: string[];
  superLikedIds: string[];
  matches: Match[];
  messages: Message[];
  likedMeIds: string[];
  /** Profiles the user has blocked (hidden from discovery & chats) */
  blockedIds: string[];
  /** Local report log (ship to backend when available) */
  reports: UserReport[];
  /** ISO timestamp when user accepted Terms + Privacy */
  acceptedTermsAt?: string;
  passportCity?: string;
  passportCountry?: string;
  auraBoostUntil?: string;
  unlockedSoftLaunchIds: string[];
  mySoftLaunchStories: SoftLaunchStory[];
  cityVibePosts: CityVibePost[];
  mainCharacterReelIds: string[];
  challengeRewardClaimed: boolean;
  /** First-visit feature tour completed */
  hasSeenFeatureTour: boolean;
  /** Reels the user posted / imported */
  myReels: Reel[];
}
