# What you need to make vibed live

This checklist covers everything on **your side** to ship globally with payments and multi-language.

---

## 1. Accounts & infrastructure

| Item | Why | Action |
|---|---|---|
| **Domain** | Brand URL (e.g. `vibed.app`) | Buy via Namecheap / Cloudflare / Google Domains |
| **Hosting** | Run Next.js | [Vercel](https://vercel.com) recommended (connect GitHub repo) |
| **Stripe account** | Global card / subscription payments | [stripe.com](https://stripe.com) → activate business |
| **Business entity** | Contracts, taxes, Stripe verification | LLC / company in your jurisdiction |
| **Email provider** | Auth, receipts, support | Resend, SendGrid, or Postmark |
| **Database** | Real users (replace localStorage demo) | Supabase, Neon (Postgres), or PlanetScale |
| **File storage** | Profile photos / reels | Cloudflare R2, AWS S3, or Uploadcare |
| **Analytics** | Funnels & crashes | Mixpanel / Amplitude + Sentry |

---

## 2. Stripe payment setup (already wired in code)

1. Create a Stripe account and complete identity / business verification.
2. Enable **Subscriptions** and the countries/currencies you want.
3. Copy keys into Vercel env (or local `.env.local` from `.env.example`):
   - `STRIPE_SECRET_KEY`
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - `STRIPE_WEBHOOK_SECRET`
   - `NEXT_PUBLIC_APP_URL=https://your-domain.com`
4. Add webhook endpoint in Stripe Dashboard:
   - URL: `https://your-domain.com/api/webhooks/stripe`
   - Events: `checkout.session.completed`, `customer.subscription.deleted`
5. Test with Stripe test cards (`4242…`), then switch to **live** keys.

Without Stripe keys, Premium still upgrades **locally in demo mode**.

---

## 3. Global availability

Already in the product:

- Country + city on signup  
- Global discovery / Passport (Ultra)  
- 9 UI languages (EN, ES, FR, HI, DE, JA, PT, AR, KO) with country-based default  
- Stripe Checkout for worldwide cards  

Still on you:

- **Legal age of consent** per country (dating apps often 18+)  
- **App store / web geo** if you block sanctioned regions  
- **Local payment methods** (UPI, iDEAL, etc.) via Stripe Payment Methods  
- **Professional translations** for legal pages and full UI copy  
- **Content moderation** for photos, reels, chat (required for app stores)

---

## 4. Language

- Users pick language under **Profile**  
- Or leave “Use country default” on (auto from signup country)  
- Arabic sets RTL (`dir=rtl`)  
- Expand dictionaries in `src/lib/i18n/` for full coverage  

---

## 5. Legal & compliance (required to operate)

| Document / process | Notes |
|---|---|
| Terms of Service | Age, conduct, subscriptions, bans |
| Privacy Policy | Photos, location, payments, retention |
| Cookie / tracking notice | If you use analytics |
| GDPR / CCPA | Data export & delete account |
| Age verification | 18+ gate (already in signup) |
| Content moderation policy | Reports, NSFW, harassment |
| Tax / VAT | Stripe Tax or accountant |

---

## 6. Replace the demo backend

Today auth + matches live in **browser localStorage**. Before a real launch you need:

1. Real auth (email magic link, Apple, Google)  
2. User / match / message tables  
3. Photo & reel upload pipeline + CDN  
4. Server-side entitlement from Stripe webhooks  
5. Push notifications (optional but expected)  
6. Admin tools for bans / reports  

---

## 7. App store vs web

| Channel | Extra requirements |
|---|---|
| **Web (fastest)** | Deploy Vercel + domain + Stripe + legal pages |
| **iOS App Store** | Apple Developer ($99/yr), IAP rules if charging in-app, review guidelines, privacy nutrition labels |
| **Google Play** | Play Console fee, Data safety form, possibly Play Billing for in-app |

Many dating apps launch **web + PWA first**, then native wrappers.

---

## 8. Suggested launch order

1. Stripe test mode + Vercel preview  
2. Database + real auth  
3. Photo uploads  
4. Legal pages  
5. Soft launch in 1–2 countries  
6. Enable more languages / currencies  
7. App Store / Play (optional)

---

## Env quick start

```bash
cp .env.example .env.local
# paste Stripe test keys
npm run dev
```

Open [http://localhost:2000](http://localhost:2000) → Premium → Subscribe (demo or Stripe).
