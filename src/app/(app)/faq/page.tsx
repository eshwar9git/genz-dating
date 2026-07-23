"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, CircleHelp } from "lucide-react";
import { BrandMark, Button } from "@/components/ui";
import {
  FAQ_CATEGORIES,
  FAQ_ITEMS,
  type FaqCategoryId,
} from "@/lib/faq";
import { cn } from "@/lib/utils";

export default function FaqPage() {
  const [category, setCategory] = useState<FaqCategoryId | "all">("all");
  const [openId, setOpenId] = useState<string | null>(FAQ_ITEMS[0]?.id ?? null);

  const items = useMemo(() => {
    if (category === "all") return FAQ_ITEMS;
    return FAQ_ITEMS.filter((item) => item.category === category);
  }, [category]);

  const activeBlurb =
    category === "all"
      ? "Every feature on vibed — how it works and where to find it."
      : FAQ_CATEGORIES.find((c) => c.id === category)?.blurb;

  return (
    <div className="px-4 pt-5 pb-10">
      <header className="mb-6 flex items-center justify-between">
        <BrandMark href="/discover" />
        <Link
          href="/profile"
          className="text-xs font-semibold text-muted transition hover:text-cream"
        >
          Profile
        </Link>
      </header>

      <div className="mb-6">
        <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-coral/15 text-coral">
          <CircleHelp className="h-5 w-5" strokeWidth={2.2} />
        </div>
        <h1 className="font-display text-3xl font-extrabold tracking-tight">
          FAQ
        </h1>
        <p className="mt-2 max-w-[36ch] text-sm leading-relaxed text-muted">
          {activeBlurb}
        </p>
      </div>

      <div className="mb-6 flex gap-2 overflow-x-auto no-scrollbar pb-1">
        <button
          type="button"
          onClick={() => setCategory("all")}
          className={cn(
            "shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition",
            category === "all"
              ? "border-coral/40 bg-coral/15 text-coral"
              : "border-white/10 bg-white/[0.03] text-muted hover:text-cream"
          )}
        >
          All
        </button>
        {FAQ_CATEGORIES.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setCategory(c.id)}
            className={cn(
              "shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition",
              category === c.id
                ? "border-coral/40 bg-coral/15 text-coral"
                : "border-white/10 bg-white/[0.03] text-muted hover:text-cream"
            )}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {items.map((item) => {
          const open = openId === item.id;
          const catLabel = FAQ_CATEGORIES.find(
            (c) => c.id === item.category
          )?.label;
          return (
            <div
              key={item.id}
              className="overflow-hidden rounded-2xl border border-white/10 bg-ink-elevated/50"
            >
              <button
                type="button"
                onClick={() => setOpenId(open ? null : item.id)}
                className="flex w-full items-start gap-3 px-4 py-3.5 text-left transition hover:bg-white/[0.03]"
                aria-expanded={open}
              >
                <div className="min-w-0 flex-1">
                  {category === "all" && (
                    <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-muted">
                      {catLabel}
                    </p>
                  )}
                  <p className="text-sm font-semibold leading-snug text-cream">
                    {item.question}
                  </p>
                </div>
                <ChevronDown
                  className={cn(
                    "mt-0.5 h-4 w-4 shrink-0 text-muted transition duration-200",
                    open && "rotate-180 text-coral"
                  )}
                />
              </button>
              <AnimatePresence initial={false}>
                {open && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-white/5 px-4 pb-4 pt-3">
                      <p className="text-sm leading-relaxed text-cream/80">
                        {item.answer}
                      </p>
                      {item.tip && (
                        <p className="mt-3 rounded-xl border border-mint/20 bg-mint/5 px-3 py-2 text-xs leading-relaxed text-mint">
                          Tip: {item.tip}
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      <div className="mt-8 space-y-2">
        <Link href="/discover" className="block">
          <Button className="w-full" size="lg">
            Back to Discover
          </Button>
        </Link>
        <Link href="/premium" className="block">
          <Button variant="secondary" className="w-full">
            View plans
          </Button>
        </Link>
      </div>
    </div>
  );
}
