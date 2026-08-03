import type {
  LookingFor,
  ReelFlag,
  SituationshipStatus,
  SubscriptionTier,
} from "./types";

export const BRAND = "vibed";

export const LOOKING_FOR_OPTIONS: {
  id: LookingFor;
  label: string;
  blurb: string;
}[] = [
  {
    id: "soft-launch",
    label: "Soft launch only",
    blurb: "Keep it low-key until it feels right",
  },
  {
    id: "situationship",
    label: "Situationship",
    blurb: "Undefined, but intentional vibes",
  },
  {
    id: "talking-stage",
    label: "Talking stage",
    blurb: "Good convos first, labels later",
  },
  {
    id: "casual",
    label: "Something casual",
    blurb: "Fun, chill, no pressure",
  },
  {
    id: "serious",
    label: "Something serious",
    blurb: "Building toward a real relationship",
  },
  {
    id: "friends-to-lovers",
    label: "Friends to lovers",
    blurb: "Start as friends, see where it goes",
  },
  {
    id: "new-friends",
    label: "New friends",
    blurb: "Expand the circle, romance optional",
  },
  {
    id: "long-distance",
    label: "Long distance OK",
    blurb: "Timezone flex, connection first",
  },
  {
    id: "marriage-minded",
    label: "Marriage-minded",
    blurb: "Looking for forever energy",
  },
  {
    id: "open",
    label: "Open to anything",
    blurb: "Let the vibe decide",
  },
];

export const INTERESTS = [
  "Gym rat",
  "Late night talks",
  "Coffee runs",
  "Concerts",
  "Anime",
  "Travel",
  "Cooking",
  "Photography",
  "Gaming",
  "Poetry",
  "Skincare",
  "Hiking",
  "Festivals",
  "Podcasts",
  "Thrifting",
  "Dogs",
  "Cats",
  "Astrology",
  "Art galleries",
  "Street food",
  "Yoga",
  "Football",
  "K-drama",
  "Book clubs",
  "Dancing",
  "Surfing",
  "Board games",
  "Memes",
  "Sustainability",
  "Startup life",
];

export const PROMPTS = [
  "My toxic trait is…",
  "The way to my heart is…",
  "I'm looking for someone who…",
  "Green flag I look for…",
  "My ideal first date…",
  "I'll fall for you if…",
  "Two truths and a lie…",
  "A life goal of mine…",
  "My most controversial opinion…",
  "Soft launching me looks like…",
];

export const VIBE_CHECK_PROMPTS = [
  "Ideal Sunday energy?",
  "Texting style?",
  "Green flag you notice first?",
  "Dealbreaker in week one?",
  "First date vibe?",
  "How do you soft launch?",
];

export const SITUATIONSHIP_OPTIONS: {
  id: SituationshipStatus;
  label: string;
  blurb: string;
}[] = [
  { id: "undefined", label: "No label", blurb: "No label, still intentional" },
  { id: "talking", label: "Talking", blurb: "Getting to know each other" },
  { id: "exclusive-ish", label: "Exclusive-ish", blurb: "Not dating others (mostly)" },
  { id: "soft-launch", label: "Soft launch", blurb: "Ready for blurry stories" },
];

export const DATE_IDEAS = [
  "Voice-note swap (3 prompts)",
  "Watch-party + live reactions",
  "Cafe selfie race",
  "Shared playlist duel",
  "Timezone breakfast date",
  "Museum video walk",
  "Cook the same recipe",
];

export const CITY_VIBE_PROMPTS = [
  "Best low-key 2nd date spot here?",
  "Where do soft launches happen in this city?",
  "Greenest flag neighborhood energy?",
  "Late-night food that impresses?",
  "Most main-character walk route?",
];

export const MAIN_CHARACTER_WEEK = {
  id: "mcw-2026-w28",
  weekLabel: "Week 28",
  theme: "Soft Launch Soft Life",
  description:
    "Post a Reel showing your calm main-character era. Top vibes earn free Super Vibes.",
  // Fixed ISO — Date.now() at module load mismatches SSR vs client
  endsAt: "2026-07-21T23:59:59.000Z",
  rewardSuperVibes: 3,
};

export const REEL_FLAG_OPTIONS: { id: ReelFlag | "all"; label: string }[] = [
  { id: "all", label: "All vibes" },
  { id: "green", label: "Green flags" },
  { id: "red", label: "Red flags (for fun)" },
  { id: "neutral", label: "Neutral" },
];

export const GENDER_OPTIONS = [
  { id: "woman" as const, label: "Woman" },
  { id: "man" as const, label: "Man" },
  { id: "nonbinary" as const, label: "Non-binary" },
  { id: "other" as const, label: "Other" },
];

export const TIMEZONES = [
  "America/New_York",
  "America/Los_Angeles",
  "America/Chicago",
  "America/Toronto",
  "Europe/London",
  "Europe/Berlin",
  "Europe/Paris",
  "Asia/Kolkata",
  "Asia/Dubai",
  "Asia/Tokyo",
  "Asia/Singapore",
  "Australia/Sydney",
  "Africa/Lagos",
  "America/Mexico_City",
];

export const COUNTRY_TIMEZONE: Record<string, string> = {
  US: "America/New_York",
  GB: "Europe/London",
  CA: "America/Toronto",
  AU: "Australia/Sydney",
  IN: "Asia/Kolkata",
  DE: "Europe/Berlin",
  FR: "Europe/Paris",
  BR: "America/Sao_Paulo",
  JP: "Asia/Tokyo",
  SG: "Asia/Singapore",
  AE: "Asia/Dubai",
  NG: "Africa/Lagos",
  MX: "America/Mexico_City",
  KR: "Asia/Seoul",
  ZA: "Africa/Johannesburg",
  KE: "Africa/Nairobi",
  NL: "Europe/Amsterdam",
};

export const COUNTRIES = [
  { code: "US", name: "United States", cities: ["New York", "Los Angeles", "Austin", "Chicago", "Miami"] },
  { code: "GB", name: "United Kingdom", cities: ["London", "Manchester", "Edinburgh"] },
  { code: "CA", name: "Canada", cities: ["Toronto", "Vancouver", "Montreal"] },
  { code: "AU", name: "Australia", cities: ["Sydney", "Melbourne", "Brisbane"] },
  { code: "IN", name: "India", cities: ["Mumbai", "Delhi", "Bangalore", "Hyderabad"] },
  { code: "DE", name: "Germany", cities: ["Berlin", "Munich", "Hamburg"] },
  { code: "FR", name: "France", cities: ["Paris", "Lyon", "Marseille"] },
  { code: "BR", name: "Brazil", cities: ["São Paulo", "Rio de Janeiro"] },
  { code: "JP", name: "Japan", cities: ["Tokyo", "Osaka"] },
  { code: "SG", name: "Singapore", cities: ["Singapore"] },
  { code: "AE", name: "United Arab Emirates", cities: ["Dubai", "Abu Dhabi"] },
  { code: "NG", name: "Nigeria", cities: ["Lagos", "Abuja"] },
  { code: "MX", name: "Mexico", cities: ["Mexico City", "Guadalajara"] },
  { code: "KR", name: "South Korea", cities: ["Seoul", "Busan"] },
  { code: "ZA", name: "South Africa", cities: ["Cape Town", "Johannesburg"] },
  { code: "KE", name: "Kenya", cities: ["Nairobi", "Mombasa"] },
  { code: "NL", name: "Netherlands", cities: ["Amsterdam", "Rotterdam"] },
];

export const FREE_LIMITS = {
  likesPerDay: 20,
  superLikesPerDay: 1,
  rewindsPerDay: 1,
  reelsWatchPerDay: 15,
  reelsPostPerDay: 1,
  boostsPerWeek: 0,
  softLaunchUnlocksPerDay: 1,
};

/**
 * Rewarded ads — watch an ad to top up Free daily limits.
 * Plus/Ultra (unlimited quotas) never need these.
 */
export const AD_REWARDS = {
  likes: {
    label: "likes",
    amount: 5,
    maxPerDay: 3,
    blurb: "+5 likes",
  },
  reels: {
    label: "Reels",
    amount: 5,
    maxPerDay: 3,
    blurb: "+5 Reels",
  },
  rewinds: {
    label: "rewinds",
    amount: 1,
    maxPerDay: 2,
    blurb: "+1 Yoink",
  },
} as const;

export const PLUS_LIMITS = {
  likesPerDay: Infinity,
  superLikesPerDay: 5,
  rewindsPerDay: Infinity,
  reelsWatchPerDay: Infinity,
  reelsPostPerDay: 5,
  boostsPerWeek: 0,
  softLaunchUnlocksPerDay: Infinity,
};

export const ULTRA_LIMITS = {
  likesPerDay: Infinity,
  superLikesPerDay: 15,
  rewindsPerDay: Infinity,
  reelsWatchPerDay: Infinity,
  reelsPostPerDay: Infinity,
  boostsPerWeek: 1,
  softLaunchUnlocksPerDay: Infinity,
};

export const PLANS: {
  id: SubscriptionTier;
  name: string;
  priceMonthly: number;
  priceWeekly: number;
  tagline: string;
  features: string[];
  highlighted?: boolean;
}[] = [
  {
    id: "free",
    name: "Free",
    priceMonthly: 0,
    priceWeekly: 0,
    tagline: "Dip your toes in",
    features: [
      "20 likes per day",
      "Watch ads for +5 likes (3× / day)",
      "1 Soft Launch story unlock / day",
      "Vibe Check + Situationship status",
      "15 GenZ Reels / day (+5 via ads, 3×)",
      "City Vibe Boards",
      "Main Character Week entry",
    ],
  },
  {
    id: "plus",
    name: "vibed Plus",
    priceMonthly: 19.99,
    priceWeekly: 7.99,
    tagline: "Unlock the full dating era",
    highlighted: true,
    features: [
      "Unlimited likes",
      "Unlimited Soft Launch unlocks",
      "See who liked you",
      "5 Super Vibes / day",
      "Unlimited Rewinds & Reels",
      "Advanced filters + flag filters",
      "Timezone Date Planner pro tips",
    ],
  },
  {
    id: "ultra",
    name: "vibed Ultra",
    priceMonthly: 34.99,
    priceWeekly: 14.99,
    tagline: "Main character mode",
    features: [
      "Everything in Plus",
      "Weekly Aura Boost → timed Reel",
      "15 Super Vibes / day",
      "Global Passport",
      "Priority in Main Character Week",
      "Unlimited Reels posts",
    ],
  },
];

export const DEFAULT_PHOTO_GRADIENTS = [
  "from-rose-400 via-orange-300 to-amber-200",
  "from-cyan-400 via-teal-300 to-emerald-200",
  "from-fuchsia-400 via-pink-300 to-rose-200",
  "from-indigo-400 via-sky-300 to-cyan-200",
  "from-lime-400 via-green-300 to-teal-200",
  "from-amber-400 via-orange-300 to-rose-300",
];
