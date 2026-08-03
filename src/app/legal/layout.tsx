import Link from "next/link";
import { BrandMark } from "@/components/ui";

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mesh-bg min-h-dvh px-5 py-8">
      <div className="mx-auto w-full max-w-2xl">
        <div className="flex items-center justify-between gap-3">
          <BrandMark />
          <Link href="/" className="text-sm text-mint hover:underline">
            Home
          </Link>
        </div>
        <nav className="mt-6 flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-wider text-muted">
          <Link href="/legal/terms" className="hover:text-cream">
            Terms
          </Link>
          <Link href="/legal/privacy" className="hover:text-cream">
            Privacy
          </Link>
          <Link href="/legal/community" className="hover:text-cream">
            Community
          </Link>
        </nav>
        <article className="prose-invert mt-8 space-y-4 text-sm leading-relaxed text-cream/85">
          {children}
        </article>
        <p className="mt-10 text-xs text-muted">
          Contact: support@vibed.app · Last updated August 1, 2026
        </p>
      </div>
    </div>
  );
}
