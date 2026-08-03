import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Community Guidelines — vibed",
  description: "Rules for staying safe and respectful on vibed.",
};

export default function CommunityPage() {
  return (
    <>
      <h1 className="font-display text-3xl font-extrabold text-cream">
        Community Guidelines
      </h1>
      <p>
        vibed is for respectful adult dating. Break these guidelines and we may
        remove content, limit features, or ban your account.
      </p>
      <h2 className="pt-4 font-display text-xl font-bold text-cream">
        Be 18+
      </h2>
      <p>No underage users or content involving minors — zero tolerance.</p>
      <h2 className="pt-4 font-display text-xl font-bold text-cream">
        Be real
      </h2>
      <p>
        Use your own recent photos. No catfishing, stolen identities, or spam
        accounts promoting unrelated businesses.
      </p>
      <h2 className="pt-4 font-display text-xl font-bold text-cream">
        Be kind
      </h2>
      <p>
        No hate speech, threats, stalking, or non-consensual sexual content.
        Soft Launch and chat stay respectful.
      </p>
      <h2 className="pt-4 font-display text-xl font-bold text-cream">
        No scams
      </h2>
      <p>
        Do not solicit money, crypto, or personal financial details. Report
        suspected scams immediately.
      </p>
      <h2 className="pt-4 font-display text-xl font-bold text-cream">
        Report & block
      </h2>
      <p>
        Use in-app Safety tools on profiles and chats. If you are in danger,
        contact local emergency services first.
      </p>
    </>
  );
}
