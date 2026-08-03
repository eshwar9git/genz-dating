import { COUNTRY_TIMEZONE, INTERESTS, PROMPTS } from "./constants";
import type {
  CityVibePost,
  Gender,
  LookingFor,
  Reel,
  ReelFlag,
  SoftLaunchStory,
  UserProfile,
} from "./types";

const looking: LookingFor[] = [
  "soft-launch",
  "situationship",
  "serious",
  "casual",
  "friends-to-lovers",
  "talking-stage",
  "open",
  "long-distance",
  "marriage-minded",
  "new-friends",
];

const flags: ReelFlag[] = [
  "green",
  "red",
  "neutral",
  "green",
  "green",
  "red",
  "neutral",
  "green",
  "red",
  "green",
];

type LocaleSeed = {
  city: string;
  country: string;
  countryCode: string;
  timezone: string;
};

const LOCALES: LocaleSeed[] = [
  { city: "Brooklyn", country: "United States", countryCode: "US", timezone: COUNTRY_TIMEZONE.US },
  { city: "Los Angeles", country: "United States", countryCode: "US", timezone: "America/Los_Angeles" },
  { city: "Austin", country: "United States", countryCode: "US", timezone: "America/Chicago" },
  { city: "Chicago", country: "United States", countryCode: "US", timezone: "America/Chicago" },
  { city: "Miami", country: "United States", countryCode: "US", timezone: "America/New_York" },
  { city: "London", country: "United Kingdom", countryCode: "GB", timezone: COUNTRY_TIMEZONE.GB },
  { city: "Manchester", country: "United Kingdom", countryCode: "GB", timezone: COUNTRY_TIMEZONE.GB },
  { city: "Toronto", country: "Canada", countryCode: "CA", timezone: COUNTRY_TIMEZONE.CA },
  { city: "Vancouver", country: "Canada", countryCode: "CA", timezone: "America/Vancouver" },
  { city: "Sydney", country: "Australia", countryCode: "AU", timezone: COUNTRY_TIMEZONE.AU },
  { city: "Melbourne", country: "Australia", countryCode: "AU", timezone: "Australia/Melbourne" },
  { city: "Mumbai", country: "India", countryCode: "IN", timezone: COUNTRY_TIMEZONE.IN },
  { city: "Bangalore", country: "India", countryCode: "IN", timezone: COUNTRY_TIMEZONE.IN },
  { city: "Delhi", country: "India", countryCode: "IN", timezone: COUNTRY_TIMEZONE.IN },
  { city: "Berlin", country: "Germany", countryCode: "DE", timezone: COUNTRY_TIMEZONE.DE },
  { city: "Paris", country: "France", countryCode: "FR", timezone: COUNTRY_TIMEZONE.FR },
  { city: "Tokyo", country: "Japan", countryCode: "JP", timezone: COUNTRY_TIMEZONE.JP },
  { city: "Seoul", country: "South Korea", countryCode: "KR", timezone: COUNTRY_TIMEZONE.KR },
  { city: "Dubai", country: "United Arab Emirates", countryCode: "AE", timezone: COUNTRY_TIMEZONE.AE },
  { city: "Singapore", country: "Singapore", countryCode: "SG", timezone: COUNTRY_TIMEZONE.SG },
  { city: "Mexico City", country: "Mexico", countryCode: "MX", timezone: COUNTRY_TIMEZONE.MX },
  { city: "São Paulo", country: "Brazil", countryCode: "BR", timezone: COUNTRY_TIMEZONE.BR },
  { city: "Lagos", country: "Nigeria", countryCode: "NG", timezone: COUNTRY_TIMEZONE.NG },
  { city: "Nairobi", country: "Kenya", countryCode: "KE", timezone: COUNTRY_TIMEZONE.KE },
  { city: "Amsterdam", country: "Netherlands", countryCode: "NL", timezone: COUNTRY_TIMEZONE.NL },
];

const WOMAN_NAMES = [
  "Maya", "Aisha", "Sofia", "Priya", "Elena", "Zoe", "Amara", "Nora", "Ivy", "Lina",
  "Chloe", "Ava", "Mila", "Yuna", "Sara", "Leila", "Hana", "Ruby", "Nina", "Tara",
  "Jasmine", "Freya", "Anya", "Mei", "Camila", "Isla", "Nadia", "Vera", "Kiara", "Aria",
  "Sienna", "Lara", "Dina", "Noor", "Ember", "Rhea", "Piper", "Zara", "Willa", "Eden",
  "Suki", "Iris", "Lucia", "Remi", "Tessa", "Quinn", "Blair", "Sasha", "Hope", "Juniper",
];

const MAN_NAMES = [
  "Jordan", "Leo", "Kenji", "Mateo", "Noah", "Omar", "Ryan", "Kai", "Ethan", "Adrian",
  "Marcus", "Diego", "Arjun", "Luca", "Felix", "Hugo", "Theo", "Ezra", "Miles", "Caleb",
  "Andre", "Niko", "Ibrahim", "Samir", "Jonas", "Ravi", "Owen", "Cole", "Axel", "Dev",
  "Sean", "Tyler", "Marco", "Eli", "Jasper", "Rohan", "Finley", "Blake", "Nate", "Victor",
  "Aaron", "Damien", "Yuki", "Bruno", "Seth", "Harvey", "Reid", "Cruz", "Pablo", "Zane",
];

const WOMAN_BIOS = [
  "Soft launching myself until further notice. Dog mom. Cold brew dependent.",
  "Main character energy. Situationships need not apply.",
  "Gallery hopper who still texts back. Prove me wrong.",
  "Building a life that looks good offline too.",
  "Part-time romantic, full-time playlist curator.",
  "Looking for someone who gets the bit and the feelings.",
  "Travel for food, stay for the people.",
  "If you can roast me kindly, we're already matching.",
  "Sunday farmers markets > club lines.",
  "Fluent in voice notes and oversharing (tastefully).",
  "Trying soft life on hard mode in a big city.",
  "Here for intentional vibes, not endless talking stages.",
  "Skincare shelf is longer than my situationship list.",
  "Will match if your green flags have receipts.",
  "Writer by day, soft-launch photographer by night.",
  "Looking for co-pilot energy, not a project.",
  "Gym at 7, dumplings by 8. Negotiate the rest.",
  "I collect cities like stamps and playlists like secrets.",
  "Emotionally available, geographically flexible.",
  "Please be funny. Attractiveness is a bonus round.",
  "Low drama, high curiosity, medium spice.",
  "If you send memes with context, I melt.",
  "Serious about kindness. Casual about labels (for now).",
  "Book club dropout who still buys hardcovers.",
  "Golden hour walks are my love language.",
  "I soft launch with blurry coffee cups. Deal with it.",
  "Looking for someone who shows up — literally.",
  "Career girl with a soft spot for street food.",
  "My toxic trait is planning the third date on the first.",
  "Here to find a favorite person, not a highlight reel.",
  "Plant mom. Human friendship optional but preferred.",
  "If you hate brunch, we can still negotiate.",
  "I want depth, banter, and shared fries.",
  "Timezone flex unlocked. Heart still picky.",
  "Currently accepting applications for adventure buddy.",
  "Will disappear into a museum with the right person.",
  "Looking for calm chaos and clean communication.",
  "I notice effort. That's the whole app.",
  "Soft launch only until it feels like home.",
  "Bring snacks and emotional vocabulary.",
  "Running on iced matcha and cautious optimism.",
  "I like people who are kind to servers.",
  "Looking for a slow burn that actually burns.",
  "Fashion adjacent. Feelings front and center.",
  "If your playlist has range, so do we.",
  "Not here for situationship Olympics.",
  "I fall for curiosity and consistent good mornings.",
  "City girl with hiking boots in the closet.",
  "Let's keep it light until it isn't.",
  "Looking for someone who makes ordinary Tuesdays fun.",
];

const MAN_BIOS = [
  "Building something weird. Looking for someone who gets the bit.",
  "Surfer by morning, playlist curator by night. Labels later.",
  "Gym, ramen, and emotionally literate conversations.",
  "I cook better than I text — give me a chance.",
  "Looking for co-conspirator energy.",
  "Startup hours, weekend hikes, midweek memes.",
  "Soft launch friendly. Hard launch eventually.",
  "Here for intentional vibes and zero breadcrumbing.",
  "If you can out-joke me, I'll fall first.",
  "Photographer who still prints film sometimes.",
  "Looking for someone who likes airports and late dinners.",
  "I show up on time. Revolutionary, I know.",
  "Part-time gamer, full-time overthinker (in a cute way).",
  "Bring curiosity. I'll bring snacks.",
  "Trying to date like an adult. Still learning.",
  "Coffee snob with a soft spot for dive bars.",
  "Looking for depth without the heavy script.",
  "I'll plan the date if you pick the playlist.",
  "Kindness is non-negotiable. Everything else is negotiable.",
  "Currently soft-launching my better habits.",
  "I like people who ask good questions.",
  "Weekend explorer. Weekday builder.",
  "Looking for talking stage with a destination.",
  "Will match for dogs, stay for the banter.",
  "I believe in voice notes and clear intentions.",
  "Not allergic to feelings. Mildly allergic to games.",
  "Looking for a favorite notification.",
  "I can fix a bike and a bad mood (usually).",
  "Golden retriever energy, border mind.",
  "Here for something that feels easy and real.",
  "If you hate small talk, we already vibe.",
  "Travel for food markets. Stay for bookstores.",
  "Looking for someone who texts like they mean it.",
  "I take photos of strangers' dogs. That's the bio.",
  "Serious about growth. Casual about perfect plans.",
  "Let's get coffee and accidentally talk for three hours.",
  "I soft launch with blurry concert pics.",
  "Looking for a partner in crime and grocery runs.",
  "Emotionally available, schedule flexible.",
  "If your humor is dry, hydrate me with it.",
  "Builder by day, amateur chef by night.",
  "Looking for calm chemistry, not chaos.",
  "I notice effort. That's rare currency.",
  "Down to be friends first if the vibe asks for it.",
  "Looking for someone who makes cities feel smaller.",
  "I'll bring the aux. You bring the opinions.",
  "Not here for situationship endless mode.",
  "Looking for a slow yes, not a fast maybe.",
  "I like mornings, markets, and meaningful tangents.",
  "Let's keep it honest and a little bit fun.",
];

const PROMPT_ANSWERS = [
  "Texts back and shows up on time",
  "Sunset walk + dumplings",
  "Turning everything into a bit",
  "You can roast me without mercy",
  "Has emotional vocabulary",
  "A blurry cafe story",
  "Curious about the world",
  "Gallery hop then dessert crawl",
  "Sending the perfect meme at 1am",
  "Voice notes > dry texts",
  "Kind to service workers",
  "Flaking without a heads up",
  "Walk + something sweet",
  "Slow mornings + good coffee",
  "Someone who asks follow-up questions",
  "Late night street food crawl",
  "Planning too many dates at once",
  "You laugh at my worst jokes",
  "Consistent energy, not hot-and-cold",
  "Bookstore browse then noodles",
  "Oversharing playlists on day two",
  "You remember small details",
  "A soft launch that feels earned",
  "Park picnic with zero agenda",
  "Caring loudly about niche hobbies",
  "You can sit in comfortable silence",
  "Live music and walking home talking",
  "Being too honest too early",
  "You match my chaotic good energy",
  "Museum date with spicy opinions",
];

const LANG_SETS = [
  ["English"],
  ["English", "Spanish"],
  ["English", "French"],
  ["English", "Hindi"],
  ["English", "Mandarin"],
  ["English", "Arabic"],
  ["English", "Portuguese"],
  ["English", "Korean"],
  ["English", "Japanese"],
  ["English", "German"],
  ["English", "Yoruba"],
  ["English", "Urdu"],
];

const LAST_ACTIVE = [
  "Just now",
  "Online",
  "12m ago",
  "1h ago",
  "2h ago",
  "3h ago",
  "5h ago",
  "Yesterday",
];

/** Sharp Unsplash portrait (1600px face crop — not the old 128px randomuser thumbs). */
function portraitUrl(photoId: string) {
  return `https://images.unsplash.com/photo-${photoId}?auto=format&fit=crop&w=1600&h=2000&q=90&crop=faces`;
}

/** Woman portrait photo IDs (Unsplash). */
const WOMAN_PHOTO_IDS = [
  "1534528741775-53994a69daeb",
  "1494790108377-be9c29b29330",
  "1529626455594-4ff0802cfb7e",
  "1544005313-94ddf0286df2",
  "1531746020798-e6953c6e8e04",
  "1524504388940-b1c1722653e1",
  "1517841905240-472988babdf9",
  "1488426862026-3ee34a7d66df",
  "1524638431109-93d95c968f03",
  "1438761681033-6461ffad8d80",
  "1548142813-c348350df52b",
  "1487412720507-e7ab68f16796",
  "1531123897727-8f129e1688ce",
  "1508214751196-bcfd4ca60f91",
  "1546961329-78bef0414d8c",
  "1502823403499-6ccfcf4fb453",
  "1514315384763-ba401779410f",
  "1554151228-14d9def656e4",
  "1541823709867-1b206113eafd",
  "1515886657613-9f3515b0c78f",
  "1485893086445-ed75865251da",
  "1499952127939-9bbf5af6c00c",
  "1519699047748-de8e457a634e",
  "1544716273-d0501ba2fe65",
  "1580489944761-15a19d654956",
  "1573496359142-b8d87734a5a2",
  "1589156280159-27698a70f29e",
  "1607746882042-944635dfe10e",
  "1542596594-649edbc13630",
  "1619895862022-09114b41f16f",
  "1592621385612-4d7129426394",
  "1526510747491-57f7430d0ce7",
  "1602233158242-3ba0ac4d2167",
  "1573497019940-1c64cf1a6d8a",
  "1551836022-d5d88e9218df",
  "1557053910-d9eadeed1c58",
  "1594744803329-e58b31de8bf5",
  "1614283233556-f35b0c801283",
  "1521146764736-56c929d59c83",
  "1504439904031-93ded912795b",
  "1534528741775-53994a69daeb",
  "1494790108377-be9c29b29330",
  "1529626455594-4ff0802cfb7e",
  "1544005313-94ddf0286df2",
  "1531746020798-e6953c6e8e04",
  "1524504388940-b1c1722653e1",
  "1517841905240-472988babdf9",
  "1488426862026-3ee34a7d66df",
  "1524638431109-93d95c968f03",
  "1438761681033-6461ffad8d80",
];

/** Man portrait photo IDs (Unsplash). */
const MAN_PHOTO_IDS = [
  "1506794778202-cad84cf45f1d",
  "1507003211169-0a1dd7228f2d",
  "1539571696357-5a69c17a67c6",
  "1492562080023-ab3db95bfbce",
  "1500648767791-00dcc994a43e",
  "1519085360753-af011ed40377",
  "1472099645785-5658abf4ff4e",
  "1463453091185-61582044d556",
  "1521119986981-2bdfe0c8e4c0",
  "1531427186611-ecfd6d936c79",
  "1560250097-0b93528c311a",
  "1566492031773-4f4e44671857",
  "1570295999919-56ceb5ecca61",
  "1552374196-c4e7ffc6e126",
  "1545167622-3a6ac456ed39",
  "1557862921-37829c790f19",
  "1568602471122-7832951cc4c5",
  "1615109398623-88346a601842",
  "1618886614638-80e3c103d31a",
  "1600486913747-55e5470d6f40",
  "1599566150163-29194dcaad36",
  "1583195764036-4ad617595b35",
  "1617127365659-c47fa864d8bc",
  "1633332755192-727a05c4013d",
  "1628157588553-5eeeee5a478f",
  "1603415526960-f7e0328c63b1",
  "1605462863863-10d9e47e15ee",
  "1618077360395-f3068be8e001",
  "1618641986557-1ecd230959aa",
  "1624561172888-ac93c696e10c",
  "1590086782792-42dd2350140f",
  "1522075469751-3a6694fb2f61",
  "1542178243-d17680177c2b",
  "1552058544-f2b08422138a",
  "1564564321837-a57b7070ac4f",
  "1506794778202-cad84cf45f1d",
  "1507003211169-0a1dd7228f2d",
  "1539571696357-5a69c17a67c6",
  "1492562080023-ab3db95bfbce",
  "1500648767791-00dcc994a43e",
  "1519085360753-af011ed40377",
  "1472099645785-5658abf4ff4e",
  "1463453091185-61582044d556",
  "1521119986981-2bdfe0c8e4c0",
  "1531427186611-ecfd6d936c79",
  "1560250097-0b93528c311a",
  "1566492031773-4f4e44671857",
  "1570295999919-56ceb5ecca61",
  "1552374196-c4e7ffc6e126",
  "1545167622-3a6ac456ed39",
];

function facePhoto(gender: "women" | "men", index: number) {
  const ids = gender === "women" ? WOMAN_PHOTO_IDS : MAN_PHOTO_IDS;
  return portraitUrl(ids[index % ids.length]);
}

/** Lifestyle B-roll (not a second face) so the card has a second slide. */
const LIFESTYLE_PHOTOS = [
  "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=1600&h=2000&q=90",
  "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1600&h=2000&q=90",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1600&h=2000&q=90",
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1600&h=2000&q=90",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&h=2000&q=90",
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&h=2000&q=90",
  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1600&h=2000&q=90",
  "https://images.unsplash.com/photo-1470225620780-dba8ba35d745?auto=format&fit=crop&w=1600&h=2000&q=90",
  "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1600&h=2000&q=90",
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&h=2000&q=90",
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1600&h=2000&q=90",
  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1600&h=2000&q=90",
  "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1600&h=2000&q=90",
  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1600&h=2000&q=90",
  "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&w=1600&h=2000&q=90",
  "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1600&h=2000&q=90",
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&h=2000&q=90",
  "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=1600&h=2000&q=90",
  "https://images.unsplash.com/photo-1496412705862-e0088f151c47?auto=format&fit=crop&w=1600&h=2000&q=90",
  "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1600&h=2000&q=90",
];

function lifestylePhoto(seed: number) {
  return LIFESTYLE_PHOTOS[seed % LIFESTYLE_PHOTOS.length];
}

function birthdayFromAge(age: number, seed: number) {
  const year = 2026 - age;
  const month = String((seed % 12) + 1).padStart(2, "0");
  const day = String((seed % 27) + 1).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function pickLookingFor(seed: number): LookingFor[] {
  const a = looking[seed % looking.length];
  const b = looking[(seed + 3) % looking.length];
  return a === b ? [a] : [a, b];
}

function pickInterests(seed: number): string[] {
  const out: string[] = [];
  for (let i = 0; i < 4; i++) {
    out.push(INTERESTS[(seed * 3 + i * 5) % INTERESTS.length]);
  }
  return [...new Set(out)];
}

function pickPrompts(seed: number) {
  const p1 = PROMPTS[seed % PROMPTS.length];
  const p2 = PROMPTS[(seed + 2) % PROMPTS.length];
  return [
    {
      prompt: p1,
      answer: PROMPT_ANSWERS[seed % PROMPT_ANSWERS.length],
    },
    {
      prompt: p2 === p1 ? PROMPTS[(seed + 1) % PROMPTS.length] : p2,
      answer: PROMPT_ANSWERS[(seed + 7) % PROMPT_ANSWERS.length],
    },
  ];
}

function buildProfile(
  gender: Gender,
  name: string,
  index: number,
  bio: string
): UserProfile {
  const locale = LOCALES[index % LOCALES.length];
  const age = 21 + (index % 14); // 21–34
  const photoGender = gender === "woman" ? "women" : "men";
  const id = gender === "woman" ? `w${index + 1}` : `m${index + 1}`;
  const slug = name.toLowerCase().replace(/[^a-z]/g, "");

  return {
    id,
    email: `${slug}${index + 1}@example.com`,
    name,
    age,
    birthday: birthdayFromAge(age, index + (gender === "woman" ? 0 : 50)),
    gender,
    bio,
    city: locale.city,
    country: locale.country,
    countryCode: locale.countryCode,
    photos: [
      facePhoto(photoGender, index),
      lifestylePhoto(index + (gender === "man" ? 50 : 0)),
    ],
    lookingFor: pickLookingFor(index + (gender === "man" ? 17 : 0)),
    interests: pickInterests(index + (gender === "man" ? 11 : 0)),
    prompts: pickPrompts(index + (gender === "man" ? 23 : 0)),
    languages: LANG_SETS[index % LANG_SETS.length],
    verified: index % 3 !== 2,
    distanceKm: 2 + (index * 3) % 45,
    lastActive: LAST_ACTIVE[index % LAST_ACTIVE.length],
    timezone: locale.timezone,
  };
}

function buildAllProfiles(): UserProfile[] {
  const women = WOMAN_NAMES.map((name, i) =>
    buildProfile("woman", name, i, WOMAN_BIOS[i])
  );
  const men = MAN_NAMES.map((name, i) =>
    buildProfile("man", name, i, MAN_BIOS[i])
  );
  // Interleave so Discover doesn't show 50 women then 50 men
  const mixed: UserProfile[] = [];
  for (let i = 0; i < 50; i++) {
    mixed.push(women[i], men[i]);
  }
  return mixed;
}

export const MOCK_PROFILES: UserProfile[] = buildAllProfiles();

const captions = [
  "POV: first date energy ✨",
  "soft launch practice run",
  "tell me this isn't main character coded",
  "day in my life if we matched",
  "green flags only challenge",
  "red flag? I call it personality",
  "timezone date outfit check",
  "city walk, no agenda",
  "golden hour soft launch drill",
  "match me if you get the bit",
];

/** Fixed anchor so mock timestamps match between SSR and the WebView client. */
const MOCK_NOW = Date.parse("2026-07-16T12:00:00.000Z");

/** One reel per profile (100 total) — keeps the feed full without blowing memory. */
export const MOCK_REELS: Reel[] = MOCK_PROFILES.map((p, i) => ({
  id: `r-${p.id}-1`,
  userId: p.id,
  videoUrl: "",
  posterUrl: p.photos[0],
  caption: captions[i % captions.length],
  likes: 40 + i * 13,
  createdAt: new Date(MOCK_NOW - i * 1800000).toISOString(),
  flag: flags[i % flags.length],
  isMainCharacter: i % 7 === 0,
  isAuraBoost: i === 3,
  boostExpiresAt:
    i === 3 ? new Date(MOCK_NOW + 1000 * 60 * 45).toISOString() : undefined,
  source: "vibed" as const,
}));

export const MOCK_CITY_VIBES: CityVibePost[] = [
  {
    id: "cv1",
    city: "Brooklyn",
    countryCode: "US",
    prompt: "Best low-key 2nd date spot here?",
    answer: "Domino Park at golden hour — zero pressure, max vibe.",
    createdAt: new Date(MOCK_NOW - 3600000).toISOString(),
    anonymousHandle: "coldbrew.kid",
    authorId: "w1",
    tags: ["Coffee runs", "Dogs"],
  },
  {
    id: "cv2",
    city: "Bangalore",
    countryCode: "IN",
    prompt: "Where do soft launches happen in this city?",
    answer: "Cubbon Park walks + filter so heavy nobody knows it's a date.",
    createdAt: new Date(MOCK_NOW - 7200000).toISOString(),
    anonymousHandle: "filter.soft",
    authorId: "w4",
    tags: ["Coffee runs", "Travel"],
  },
  {
    id: "cv3",
    city: "London",
    countryCode: "GB",
    prompt: "Greenest flag neighborhood energy?",
    answer: "Hackney people who show up on time. Rare. Sacred.",
    createdAt: new Date(MOCK_NOW - 10800000).toISOString(),
    anonymousHandle: "gallery.hours",
    authorId: "w2",
    tags: ["Art galleries", "Poetry"],
  },
  {
    id: "cv4",
    city: "Berlin",
    countryCode: "DE",
    prompt: "Late-night food that impresses?",
    answer: "Döner after a gallery. If they get it, marry them.",
    createdAt: new Date(MOCK_NOW - 14400000).toISOString(),
    anonymousHandle: "night.owl",
    authorId: "m5",
    tags: ["Photography", "Concerts"],
  },
  {
    id: "cv5",
    city: "Tokyo",
    countryCode: "JP",
    prompt: "Most main-character walk route?",
    answer: "Shimokitazawa at 10pm with headphones. Instant soft life.",
    createdAt: new Date(MOCK_NOW - 18000000).toISOString(),
    anonymousHandle: "ramen.run",
    authorId: "m9",
    tags: ["Street food", "Anime"],
  },
  {
    id: "cv6",
    city: "Dubai",
    countryCode: "AE",
    prompt: "Best low-key 2nd date spot here?",
    answer: "Alserkal gallery hop then karak. Quiet flex.",
    createdAt: new Date(MOCK_NOW - 21600000).toISOString(),
    anonymousHandle: "desert.drip",
    authorId: "w19",
    tags: ["Art galleries", "Travel"],
  },
];

export const MOCK_SOFT_LAUNCH_FEED: SoftLaunchStory[] = [
  {
    id: "sl1",
    matchId: "demo",
    userId: "w1",
    partnerId: "m1",
    partnerName: "J.",
    caption: "hand + latte. that's the tweet.",
    posterUrl: facePhoto("women", 0),
    createdAt: new Date(MOCK_NOW - 5400000).toISOString(),
    isPublic: true,
  },
  {
    id: "sl2",
    matchId: "demo2",
    userId: "w4",
    partnerId: "m2",
    partnerName: "L.",
    caption: "blurry on purpose",
    posterUrl: facePhoto("women", 3),
    createdAt: new Date(MOCK_NOW - 9000000).toISOString(),
    isPublic: true,
  },
  {
    id: "sl3",
    matchId: "demo3",
    userId: "m4",
    partnerId: "w6",
    partnerName: "A.",
    caption: "not naming names (yet)",
    posterUrl: facePhoto("men", 3),
    createdAt: new Date(MOCK_NOW - 12600000).toISOString(),
    isPublic: true,
  },
];

export function getProfileById(id: string) {
  return MOCK_PROFILES.find((p) => p.id === id);
}
