# vibed.

GenZ dating app — swipe discovery, prompts, GenZ Reels, global discovery, and freemium subscriptions.

## Features

- **Register / login** with location (15+ countries)
- **Onboarding**: photo upload (or demo photos), bio, GenZ relationship categories, interests, prompts, discovery preferences
- **Discover**: swipe cards, likes, Super Vibes, Rewinds
- **GenZ Reels**: green/red flag tags, Aura Boosts, Main Character entries
- **Soft Launch Mode**: matches stay private until both unlock; publish blurry stories
- **Vibe Check**: 3 micro-prompts before chat unlocks
- **Situationship Status**: shared talking / exclusive-ish / soft-launch labels
- **Timezone Date Planner**: overlapping slots + low-effort date ideas
- **City Vibe Boards**: anonymous local prompts + similar-answer discovery
- **Main Character Week**: weekly Reel challenge with Super Vibe rewards
- **Soft Launch unlocks**: 1/day free, unlimited on Plus
- **Aura Boost** (Ultra): profile becomes a timed Reel in the feed
- **Likes you**: blurred for free, unlocked on Plus/Ultra
- **Monetization**: Free / Plus / Ultra with freemium limits

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- Zustand (persisted local demo auth / state)
- Framer Motion

## Run

```bash
npm install
cp .env.example .env.local   # add Stripe keys for real checkout
npm run dev
```

Open [http://localhost:2000](http://localhost:2000).

> Demo auth is stored in the browser (`localStorage`). Without Stripe keys, Premium upgrades locally (demo mode).

## Global & payments

- **Languages**: Profile → Language (9 locales; defaults from signup country)
- **Payments**: Stripe Checkout via `/api/checkout` + webhook `/api/webhooks/stripe`
- **Go-live checklist**: see [GO_LIVE.md](./GO_LIVE.md)

## iOS & Android

Native apps via Capacitor (`android/`, `ios/`). See **[MOBILE.md](./MOBILE.md)**.

```bash
npm run dev
# Android emulator:
#   set CAPACITOR_SERVER_URL=http://10.0.2.2:2000
npm run mobile:sync
npm run mobile:android   # or mobile:ios on a Mac
```
