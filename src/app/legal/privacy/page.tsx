import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — vibed",
  description: "How vibed collects, uses, and protects your data.",
};

export default function PrivacyPage() {
  return (
    <>
      <h1 className="font-display text-3xl font-extrabold text-cream">
        Privacy Policy
      </h1>
      <p>
        This policy explains what vibed collects and how we use it. Questions:
        privacy@vibed.app.
      </p>
      <h2 className="pt-4 font-display text-xl font-bold text-cream">
        1. Data we collect
      </h2>
      <ul className="list-disc space-y-1 pl-5 text-cream/80">
        <li>Account details: name, email, birthday, gender, city/country</li>
        <li>Profile content: photos, bio, prompts, interests, reels</li>
        <li>Usage: likes, matches, messages, preferences, reports you submit</li>
        <li>Payments: processed by Stripe (we do not store full card numbers)</li>
        <li>Device: approximate locale, app version, crash diagnostics if enabled</li>
      </ul>
      <h2 className="pt-4 font-display text-xl font-bold text-cream">
        2. How we use data
      </h2>
      <p>
        To run matching and messaging, personalize discovery, process
        subscriptions, show ads (when applicable), prevent abuse, and improve
        the product. We do not sell your personal information.
      </p>
      <h2 className="pt-4 font-display text-xl font-bold text-cream">
        3. Sharing
      </h2>
      <p>
        We share data with service providers (hosting, payments, analytics,
        ads) under contract, when required by law, or to protect users’ safety.
        Other users see the profile information you choose to publish.
      </p>
      <h2 className="pt-4 font-display text-xl font-bold text-cream">
        4. Retention & deletion
      </h2>
      <p>
        We keep data while your account is active and as needed for legal or
        safety reasons. Use Profile → Delete account to request erasure. Some
        records (e.g. billing, abuse reports) may be retained as required by law.
      </p>
      <h2 className="pt-4 font-display text-xl font-bold text-cream">
        5. Your rights
      </h2>
      <p>
        Depending on your region (including GDPR/CCPA), you may request access,
        correction, export, or deletion of your personal data. Contact
        privacy@vibed.app. You can also adjust language and discovery
        preferences in the app.
      </p>
      <h2 className="pt-4 font-display text-xl font-bold text-cream">
        6. Children
      </h2>
      <p>
        vibed is not for anyone under 18. We delete accounts that we learn belong
        to minors.
      </p>
      <h2 className="pt-4 font-display text-xl font-bold text-cream">
        7. International transfers
      </h2>
      <p>
        Data may be processed in countries where we or our providers operate.
        We use appropriate safeguards where required.
      </p>
      <h2 className="pt-4 font-display text-xl font-bold text-cream">
        8. Changes
      </h2>
      <p>
        We may update this policy and will revise the “Last updated” date. Check
        this page periodically.
      </p>
    </>
  );
}
