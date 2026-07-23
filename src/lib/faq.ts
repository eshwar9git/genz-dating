export type FaqCategoryId =
  | "getting-started"
  | "discover"
  | "reels"
  | "explore"
  | "chats"
  | "premium"
  | "account";

export type FaqItem = {
  id: string;
  category: FaqCategoryId;
  question: string;
  answer: string;
  tip?: string;
};

export const FAQ_CATEGORIES: {
  id: FaqCategoryId;
  label: string;
  blurb: string;
}[] = [
  {
    id: "getting-started",
    label: "Getting started",
    blurb: "Sign up, onboarding, and your first day on vibed.",
  },
  {
    id: "discover",
    label: "Discover",
    blurb: "Swipe, Ghost, Vibe, Aura, and Yoink.",
  },
  {
    id: "reels",
    label: "Reels",
    blurb: "Short vibes, flag filters, and boosts.",
  },
  {
    id: "explore",
    label: "Explore",
    blurb: "City boards, Soft Launch, Main Character, Aura.",
  },
  {
    id: "chats",
    label: "Chats",
    blurb: "Matches, Vibe Check, Soft Launch Mode, dates.",
  },
  {
    id: "premium",
    label: "Plans",
    blurb: "Free, Plus, Ultra, Passport, and limits.",
  },
  {
    id: "account",
    label: "Account",
    blurb: "Profile, preferences, language, and likes.",
  },
];

export const FAQ_ITEMS: FaqItem[] = [
  // —— Getting started ——
  {
    id: "what-is-vibed",
    category: "getting-started",
    question: "What is vibed?",
    answer:
      "vibed is a dating app built for soft-launch energy — discover people with Ghost / Vibe / Aura / Yoink, watch GenZ Reels, explore city vibes and Soft Launch stories, then chat after a quick Vibe Check.",
  },
  {
    id: "how-to-sign-up",
    category: "getting-started",
    question: "How do I create an account?",
    answer:
      "Tap Create account on the home screen. Enter your first name, email, birthday (you must be 18+), gender, country, and city. Continue into onboarding to finish your profile.",
    tip: "Demo login is email-only and stays on this device/browser.",
  },
  {
    id: "onboarding-steps",
    category: "getting-started",
    question: "What happens during onboarding?",
    answer:
      "You’ll complete six steps: add at least 2 photos (up to 6), write a short bio, pick dating goals (soft launch, situationship, talking stage, etc.), choose 3+ interests, answer 2 prompts, then set discovery preferences (who to show, age, distance, Global mode). Tap Start vibing to open Discover.",
  },
  {
    id: "feature-tour",
    category: "getting-started",
    question: "What is the Quick tour?",
    answer:
      "The first time you finish onboarding, vibed walks you through Discover, Reels, Explore, Chats, and Plus & Ultra. You can Skip anytime or tap Start swiping at the end. It only shows once per new account.",
  },
  {
    id: "edit-profile-later",
    category: "getting-started",
    question: "Can I change my profile later?",
    answer:
      "Yes. Open Profile → Edit profile & photos to re-run the onboarding wizard and update photos, bio, goals, interests, and prompts.",
  },

  // —— Discover ——
  {
    id: "discover-basics",
    category: "discover",
    question: "How does Discover work?",
    answer:
      "Open Discover from the bottom nav. You’ll see a deck of profiles filtered by your preferences. Swipe or use the action buttons to decide. Mutual Vibes trigger a You vibed! celebration.",
  },
  {
    id: "ghost-vibe-aura-yoink",
    category: "discover",
    question: "What do Ghost, Vibe, Aura, and Yoink mean?",
    answer:
      "Ghost = pass (skip this person). Vibe = like them. Aura = Super Vibe (a stronger like that stands out; limited each day). Yoink = rewind your last pass so you can see them again.",
    tip: "On phones, actions also give light haptics.",
  },
  {
    id: "discover-prefs",
    category: "discover",
    question: "How do I change who I see?",
    answer:
      "Tap the sliders icon on Discover (or Profile → gear) to open Preferences. Adjust genders, age range, max distance, and Global mode. Relationship-category filters and full Global discovery unlock with Plus or Ultra.",
  },
  {
    id: "deck-cleared",
    category: "discover",
    question: "Why does Discover say the deck is cleared?",
    answer:
      "You’ve liked or passed everyone who matches your current filters. Widen age/distance, turn on Global mode, or edit preferences — then come back for a fresh deck.",
  },
  {
    id: "daily-limits-discover",
    category: "discover",
    question: "I hit a daily free limit — what now?",
    answer:
      "Free accounts get limited likes, Super Vibes (Aura), and Yoinks per day. When you see the limit banner, wait for the daily reset or upgrade to Plus/Ultra from the Go Plus chip or Profile → Upgrade.",
  },

  // —— Reels ——
  {
    id: "reels-basics",
    category: "reels",
    question: "How do I use Reels?",
    answer:
      "Open Reels from the bottom nav. Tap the left or right side of the screen to move between short vibes. Use Vibe with {name} on a reel you like — it can create a match just like Discover.",
  },
  {
    id: "flag-filters",
    category: "reels",
    question: "What are green / red flag filters?",
    answer:
      "Tap the flag icon on Reels to filter: All vibes, Green flags, Red flags (for fun), or Neutral. Badges on each reel show its tone so you can browse the energy you want.",
  },
  {
    id: "aura-boost-reels",
    category: "reels",
    question: "What is Aura Boost on Reels?",
    answer:
      "When Aura Boost is active, your profile appears as a timed reel in feeds (“soft launching myself for 60 mins”). Activate it from Explore → Aura (Ultra includes a weekly boost).",
  },
  {
    id: "main-character-reels",
    category: "reels",
    question: "What are Main Character reels?",
    answer:
      "They’re challenge entries for Main Character Week. Enter from Explore → Main Character; challenge reels show a Main Character badge in the Reels feed.",
  },
  {
    id: "reels-limits",
    category: "reels",
    question: "Are Reels limited on Free?",
    answer:
      "Yes. Free can watch about 15 reels per day and post fewer. Plus and Ultra unlock unlimited watching (and higher or unlimited posting). Remaining count shows in the Reels header.",
  },
  {
    id: "reels-instagram-tiktok",
    category: "reels",
    question: "Can I post from Instagram or TikTok?",
    answer:
      "Yes. On Reels tap Post → Instagram / TikTok, paste a public Reel or TikTok link, Import, then Post to vibed Reels. Or use Upload to add a video/photo from your device. Imported posts keep an Open on Instagram/TikTok link.",
  },

  // —— Explore ——
  {
    id: "explore-tabs",
    category: "explore",
    question: "What’s inside Explore?",
    answer:
      "Explore has four tabs: City (local vibe boards), Soft Launch (blurry story feed), Main Character (weekly challenge), and Aura (boost + reel flag tools). Open it from the bottom nav or the compass on Discover.",
  },
  {
    id: "city-vibe-boards",
    category: "explore",
    question: "How do City Vibe Boards work?",
    answer:
      "On Explore → City, pick a prompt, write your local take, and tap Drop the vibe. Posts are anonymous local intel. You’ll also see people who answered similarly — jump to Discover to vibe with them.",
  },
  {
    id: "soft-launch-feed",
    category: "explore",
    question: "How do Soft Launch stories work in Explore?",
    answer:
      "Soft Launch stories are intentionally blurry until you unlock them. Free gets 1 unlock per day; Plus and Ultra can unlock freely. Stories come from matches who’ve mutually opened Soft Launch Mode in chat.",
  },
  {
    id: "main-character-week",
    category: "explore",
    question: "How do I join Main Character Week?",
    answer:
      "Go to Explore → Main Character, read the week’s theme, and tap Enter with a Reel. First-time entry can reward Super Vibes. Then watch challenge entries in Reels.",
  },
  {
    id: "activate-aura",
    category: "explore",
    question: "How do I activate Aura Boost?",
    answer:
      "Open Explore → Aura. Ultra members can fire a weekly 60-minute boost that puts you into Reels feeds. Other plans see an unlock prompt for Ultra.",
  },

  // —— Chats ——
  {
    id: "matches-list",
    category: "chats",
    question: "Where are my matches?",
    answer:
      "Open Chats in the bottom nav. You’ll see everyone you’ve matched with, plus badges for situationship status, Soft Launch private/live, and pending Vibe Checks. Unread counts show as a mint pill on the tab.",
  },
  {
    id: "vibe-check",
    category: "chats",
    question: "What is Vibe Check and why can’t I chat yet?",
    answer:
      "Before messaging, both of you complete a short Vibe Check — three micro-prompts. Open a match → show Vibes extras → answer and Submit Vibe Check. Chat unlocks after you submit; you can then compare your answers vs theirs.",
    tip: "This keeps first messages intentional instead of empty “hey.”",
  },
  {
    id: "soft-launch-mode",
    category: "chats",
    question: "How does Soft Launch Mode work in a chat?",
    answer:
      "In match extras, Soft Launch stays private until both people tap Unlock. After a mutual unlock, either of you can post a blurry Soft Launch story with a caption — it can appear in Explore’s Soft Launch feed.",
  },
  {
    id: "situationship-status",
    category: "chats",
    question: "What is situationship status?",
    answer:
      "Inside a chat’s Vibes panel, set where things stand: No label, Talking, Exclusive-ish, or Soft launch. It’s a light label for both of you — not a hard commitment, just clarity.",
  },
  {
    id: "date-planner",
    category: "chats",
    question: "How do I use the Timezone Date Planner?",
    answer:
      "In chat extras, open the Date Planner to see overlapping time slots (anchored in your timezone, shown in theirs too). Propose a slot — you can’t Lock in your own proposal. When they lock it (simulated shortly in this demo), it shows Locked and the chat preview says Date locked in.",
  },
  {
    id: "match-celebration",
    category: "chats",
    question: "What happens when we match?",
    answer:
      "You’ll see a full-screen You vibed! moment with both photos. Choose Send a message to jump to Chats, or Keep swiping to stay on Discover/Reels.",
  },

  // —— Premium ——
  {
    id: "plans-overview",
    category: "premium",
    question: "What’s the difference between Free, Plus, and Ultra?",
    answer:
      "Free lets you try the core loop with daily caps. vibed Plus unlocks unlimited likes, Soft Launch unlocks, Yoinks, and Reels watching, plus who liked you, more Super Vibes, and advanced filters. vibed Ultra adds weekly Aura Boost, more Super Vibes, Global Passport, Main Character priority, and unlimited reel posts.",
  },
  {
    id: "free-limits",
    category: "premium",
    question: "What are the Free daily limits?",
    answer:
      "Roughly: 20 likes/day, 1 Super Vibe (Aura), 1 Yoink, 15 Reels watched, 1 Soft Launch unlock, and limited reel posts. Limits reset daily. Check your remaining counts on Profile.",
  },
  {
    id: "watch-ads",
    category: "premium",
    question: "Can I watch an ad for more likes or Reels?",
    answer:
      "Yes on Free. When you hit a daily limit, tap Watch ad: +5 likes (max 3 ads/day), +5 Reels (max 3 ads/day), or +1 Yoink (max 2 ads/day). Ad caps also reset daily. Plus & Ultra already have unlimited likes/Reels/Yoinks so they don’t use rewarded ads.",
  },
  {
    id: "how-to-upgrade",
    category: "premium",
    question: "How do I upgrade?",
    answer:
      "Open Premium from Discover’s Go Plus chip, Profile → Upgrade, or the Premium page. Pick weekly or monthly billing, choose Plus or Ultra, then complete Stripe Checkout. On iOS/Android, Checkout opens in the system browser and returns you to vibed when done.",
    tip: "If Stripe isn’t configured, the app can activate the plan in demo mode locally.",
  },
  {
    id: "passport",
    category: "premium",
    question: "What is Global Passport?",
    answer:
      "Ultra members can set a city anywhere in the world from the Premium page so discovery feels local to that spot. Free and Plus see Unlock with Ultra instead.",
  },
  {
    id: "who-liked-you",
    category: "premium",
    question: "Can I see who liked me?",
    answer:
      "Open Profile → See who liked you (or /likes). On Free, profiles stay blurred as teasers. Plus and Ultra reveal the full list so you can vibe back intentionally.",
  },
  {
    id: "downgrade",
    category: "premium",
    question: "Can I go back to Free?",
    answer:
      "Yes. On the Premium page, choose Free / Downgrade to Free. Daily limits apply again immediately in this demo app.",
  },

  // —— Account ——
  {
    id: "preferences",
    category: "account",
    question: "Where do I set discovery preferences?",
    answer:
      "Profile → gear icon, or Discover → sliders. Gender and age/distance are available on Free. Extra relationship categories and Global discovery are Plus+ features.",
  },
  {
    id: "language",
    category: "account",
    question: "How do I change the app language?",
    answer:
      "On Profile, use the Language switcher. vibed supports several locales and can follow your country’s default. Pick a language anytime — it updates labels across the app.",
  },
  {
    id: "usage-stats",
    category: "account",
    question: "Where do I see my usage today?",
    answer:
      "Your Profile plan card shows remaining Likes, Reels, Super Vibes, and Rewinds for today based on your current plan.",
  },
  {
    id: "logout",
    category: "account",
    question: "How do I log out?",
    answer:
      "Profile → Log out. On this demo build, your account data stays in local storage on the device so you can log back in with the same email.",
  },
  {
    id: "login-again",
    category: "account",
    question: "I already have an account — how do I log in?",
    answer:
      "From the landing page, tap I already have an account / Log in and enter the email you registered with on this device. There’s no password in the demo auth flow.",
  },
];
