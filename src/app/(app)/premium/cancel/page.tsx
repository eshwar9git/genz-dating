"use client";

import Link from "next/link";
import { BrandMark, Button } from "@/components/ui";
import { useLocaleStore } from "@/lib/locale-store";

export default function PremiumCancelPage() {
  const t = useLocaleStore((s) => s.t)();

  return (
    <div className="mesh-bg flex min-h-dvh flex-col px-6 py-10">
      <BrandMark href="/discover" />
      <div className="mx-auto mt-16 w-full max-w-md text-center">
        <h1 className="font-display text-3xl font-extrabold">
          {t.payments.cancelTitle}
        </h1>
        <p className="mt-3 text-sm text-muted">{t.payments.cancelBody}</p>
        <div className="mt-8 flex flex-col gap-3">
          <Link href="/premium">
            <Button className="w-full" size="lg">
              {t.payments.retry}
            </Button>
          </Link>
          <Link href="/discover">
            <Button className="w-full" size="lg" variant="secondary">
              {t.payments.backDiscover}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
