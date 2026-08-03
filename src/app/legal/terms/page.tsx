import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — vibed",
  description: "Terms of Service for the vibed dating app.",
};

export default function TermsPage() {
  return (
    <>
      <h1 className="font-display text-3xl font-extrabold text-cream">
        Terms of Service
      </h1>
      <p>
        By creating a vibed account or using the app, you agree to these Terms.
        If you do not agree, do not use vibed.
      </p>
      <h2 className="pt-4 font-display text-xl font-bold text-cream">
        1. Eligibility
      </h2>
      <p>
        You must be at least 18 years old. vibed is for adults only. We may ask
        for age confirmation and may suspend accounts that violate this rule.
      </p>
      <h2 className="pt-4 font-display text-xl font-bold text-cream">
        2. Your account
      </h2>
      <p>
        You are responsible for activity under your account and for keeping login
        details secure. Provide accurate profile information. Do not impersonate
        others.
      </p>
      <h2 className="pt-4 font-display text-xl font-bold text-cream">
        3. Acceptable use
      </h2>
      <p>
        Do not harass, threaten, scam, spam, share illegal content, or upload
        sexual content involving minors. Do not scrape the service or reverse
        engineer it except as allowed by law. We may remove content and suspend
        accounts that break these rules or our Community Guidelines.
      </p>
      <h2 className="pt-4 font-display text-xl font-bold text-cream">
        4. Subscriptions & payments
      </h2>
      <p>
        Optional vibed Plus and Ultra plans are billed through Stripe (web) or
        the applicable app store billing system when required by platform
        policy. Subscriptions renew until canceled. Taxes may apply. Demo or
        test checkouts are not a paid entitlement.
      </p>
      <h2 className="pt-4 font-display text-xl font-bold text-cream">
        5. Safety
      </h2>
      <p>
        Meet offline at your own risk. Use in-app Report and Block tools. vibed
        is not a background-check service. Contact local authorities for
        emergencies.
      </p>
      <h2 className="pt-4 font-display text-xl font-bold text-cream">
        6. Disclaimers
      </h2>
      <p>
        The service is provided “as is.” To the fullest extent allowed by law,
        we disclaim warranties of merchantability, fitness for a particular
        purpose, and non-infringement. We are not liable for user-generated
        content or offline interactions.
      </p>
      <h2 className="pt-4 font-display text-xl font-bold text-cream">
        7. Termination
      </h2>
      <p>
        You may delete your account in Profile. We may suspend or terminate
        accounts for Terms or safety violations. Surviving clauses include
        payment obligations already incurred and limitation of liability.
      </p>
      <h2 className="pt-4 font-display text-xl font-bold text-cream">
        8. Changes
      </h2>
      <p>
        We may update these Terms. Continued use after changes means you accept
        the updated Terms. Material changes will be highlighted in-app when
        practical.
      </p>
    </>
  );
}
