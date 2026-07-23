export type Dict = {
  nav: {
    discover: string;
    reels: string;
    explore: string;
    chats: string;
    profile: string;
  };
  common: {
    continue: string;
    back: string;
    save: string;
    loading: string;
    upgrade: string;
    free: string;
    language: string;
    global: string;
  };
  landing: {
    headline: string;
    sub: string;
    create: string;
    haveAccount: string;
    worldwide: string;
    login: string;
  };
  discover: {
    goPlus: string;
    deckCleared: string;
    deckClearedBody: string;
    editPrefs: string;
    itsAVibe: string;
    youVibed: string;
    vibedBody: string;
    matchedWith: string;
    sendMessage: string;
    keepSwiping: string;
  };
  premium: {
    eyebrow: string;
    title: string;
    titleAccent: string;
    body: string;
    weekly: string;
    monthly: string;
    currentPlan: string;
    getPlan: string;
    downgrade: string;
    paySecure: string;
    demoMode: string;
    passport: string;
    passportBody: string;
    setPassport: string;
    unlockUltra: string;
  };
  settings: {
    languageTitle: string;
    languageBody: string;
    autoFromCountry: string;
    paymentTitle: string;
    paymentBody: string;
  };
  payments: {
    successTitle: string;
    successBody: string;
    cancelTitle: string;
    cancelBody: string;
    backDiscover: string;
    retry: string;
    processing: string;
  };
};

export const en: Dict = {
  nav: {
    discover: "Discover",
    reels: "Reels",
    explore: "Explore",
    chats: "Chats",
    profile: "Profile",
  },
  common: {
    continue: "Continue",
    back: "Back",
    save: "Save",
    loading: "Loading…",
    upgrade: "Upgrade",
    free: "Free",
    language: "Language",
    global: "Global",
  },
  landing: {
    headline: "Dating for your soft-launch era.",
    sub: "Swipe, prompt, and GenZ Reels — intentional dating, worldwide.",
    create: "Create account",
    haveAccount: "I already have an account",
    worldwide: "Free to start · 150+ countries",
    login: "Log in",
  },
  discover: {
    goPlus: "Go Plus",
    deckCleared: "Deck cleared",
    deckClearedBody: "No more people with your filters. Widen preferences or go Global.",
    editPrefs: "Edit preferences",
    itsAVibe: "It's a vibe",
    youVibed: "You vibed!",
    vibedBody: "They vibed with you too — don't leave them hanging.",
    matchedWith: "You vibed with",
    sendMessage: "Send a message",
    keepSwiping: "Keep swiping",
  },
  premium: {
    eyebrow: "Monetization",
    title: "Free to start.",
    titleAccent: "Upgrade to unlock.",
    body: "Free core dating, paid extras after limits — upgrade when you want the full era.",
    weekly: "Weekly",
    monthly: "Monthly",
    currentPlan: "Current plan",
    getPlan: "Subscribe",
    downgrade: "Downgrade to Free",
    paySecure: "Pay securely with Stripe",
    demoMode: "Demo mode — add Stripe keys to charge for real",
    passport: "Global Passport",
    passportBody: "Change your discovery city worldwide — Ultra only.",
    setPassport: "Set passport location",
    unlockUltra: "Unlock with Ultra",
  },
  settings: {
    languageTitle: "Language",
    languageBody: "UI language follows your country by default. Change it anytime.",
    autoFromCountry: "Use country default",
    paymentTitle: "Payments",
    paymentBody: "Subscriptions are processed globally via Stripe Checkout.",
  },
  payments: {
    successTitle: "You're upgraded",
    successBody: "Welcome to the paid era. Limits are unlocked on this device.",
    cancelTitle: "Checkout canceled",
    cancelBody: "No charge was made. You can subscribe anytime from Premium.",
    backDiscover: "Back to Discover",
    retry: "Try again",
    processing: "Redirecting to secure checkout…",
  },
};
