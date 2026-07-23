"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Film, MessageCircle, Sparkles, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store";
import { useLocaleStore } from "@/lib/locale-store";

export function BottomNav() {
  const pathname = usePathname();
  const matches = useAppStore((s) => s.user?.matches ?? []);
  const unread = matches.reduce((a, m) => a + m.unread, 0);
  const t = useLocaleStore((s) => s.t)();

  const tabs = [
    { href: "/discover", label: t.nav.discover, icon: Compass },
    { href: "/reels", label: t.nav.reels, icon: Film },
    { href: "/explore", label: t.nav.explore, icon: Sparkles },
    { href: "/matches", label: t.nav.chats, icon: MessageCircle },
    { href: "/profile", label: t.nav.profile, icon: User },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2">
      <div className="glass-strong mx-auto flex max-w-lg items-stretch justify-between rounded-[28px] px-1.5 shadow-[0_12px_40px_rgba(0,0,0,0.45)]">
        {tabs.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "relative flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[10px] font-semibold tracking-wide transition duration-200",
                active ? "text-coral" : "text-muted hover:text-cream/80"
              )}
            >
              <span
                className={cn(
                  "relative flex h-9 w-9 items-center justify-center rounded-2xl transition duration-200",
                  active && "bg-coral/15 shadow-[0_0_20px_rgba(255,61,104,0.25)]"
                )}
              >
                <Icon className="h-[18px] w-[18px]" strokeWidth={active ? 2.5 : 1.8} />
                {href === "/matches" && unread > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-mint px-1 text-[9px] font-bold text-ink">
                    {unread}
                  </span>
                )}
              </span>
              <span className={cn(active ? "opacity-100" : "opacity-70")}>{label}</span>
              {active && (
                <span className="absolute bottom-1 h-0.5 w-4 rounded-full bg-coral" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
