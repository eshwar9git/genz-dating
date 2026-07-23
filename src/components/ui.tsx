"use client";

import Link from "next/link";
import { useMounted } from "@/lib/use-mounted";
import { cn } from "@/lib/utils";

export function BrandMark({
  className,
  href = "/",
  size = "md",
}: {
  className?: string;
  href?: string;
  size?: "sm" | "md" | "lg";
}) {
  const mounted = useMounted();
  const sizes = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-4xl",
  };
  return (
    <Link
      href={href}
      className={cn(
        "font-display tracking-tight text-cream transition hover:opacity-90",
        sizes[size],
        className
      )}
      style={{ fontWeight: 800 }}
    >
      vibed
      <span className="relative inline-block text-coral">
        .
        {/* Pulse only after mount — avoids SSR/client style hydration mismatch */}
        {mounted && (
          <span className="absolute -right-1 top-1 h-1.5 w-1.5 animate-pulse-soft rounded-full bg-mint" />
        )}
      </span>
    </Link>
  );
}

type ButtonVariant = "primary" | "secondary" | "ghost" | "mint" | "danger" | "glass";
type ButtonSize = "sm" | "md" | "lg";

/** Shared styles so Links can look like buttons without nesting <button> in <a>. */
export function buttonClassName(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  className?: string
) {
  const variants = {
    primary:
      "bg-gradient-to-b from-[#ff5a7a] to-coral text-white shadow-[0_8px_32px_var(--glow-coral)] hover:from-[#ff6b88] hover:to-coral-hot",
    secondary:
      "bg-white/[0.04] text-cream border border-line-strong hover:bg-white/[0.08] hover:border-cream/25",
    ghost: "bg-transparent text-cream hover:bg-white/5",
    mint: "bg-gradient-to-b from-[#6fffc8] to-mint text-ink shadow-[0_8px_32px_var(--glow-mint)] hover:to-mint-dim",
    danger: "bg-white/8 text-coral border border-coral/20 hover:bg-coral/10",
    glass:
      "glass text-cream hover:bg-white/10 shadow-[0_4px_24px_rgba(0,0,0,0.25)]",
  };
  const sizes = {
    sm: "h-9 px-3.5 text-sm rounded-xl",
    md: "h-11 px-5 text-sm rounded-2xl",
    lg: "h-[52px] px-7 text-[15px] rounded-2xl",
  };
  return cn(
    "inline-flex items-center justify-center gap-2 font-semibold tracking-tight transition duration-200 active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none",
    variants[variant],
    sizes[size],
    className
  );
}

export function Button({
  children,
  className,
  variant = "primary",
  size = "md",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
}) {
  return (
    <button className={buttonClassName(variant, size, className)} {...props}>
      {children}
    </button>
  );
}

export function Input({
  className,
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label?: string }) {
  return (
    <label className="block space-y-1.5">
      {label && (
        <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
          {label}
        </span>
      )}
      <input
        className={cn(
          "w-full rounded-2xl border border-line bg-ink-soft/80 px-4 py-3.5 text-cream outline-none transition placeholder:text-muted/50 focus:border-coral/45 focus:bg-ink-soft focus:shadow-[0_0_0_3px_rgba(255,61,104,0.12)]",
          className
        )}
        {...props}
      />
    </label>
  );
}

export function TextArea({
  className,
  label,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string }) {
  return (
    <label className="block space-y-1.5">
      {label && (
        <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
          {label}
        </span>
      )}
      <textarea
        className={cn(
          "w-full resize-none rounded-2xl border border-line bg-ink-soft/80 px-4 py-3.5 text-cream outline-none transition placeholder:text-muted/50 focus:border-coral/45 focus:shadow-[0_0_0_3px_rgba(255,61,104,0.12)]",
          className
        )}
        {...props}
      />
    </label>
  );
}

export function Chip({
  active,
  children,
  onClick,
  className,
}: {
  active?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3.5 py-2 text-sm font-medium transition duration-200",
        active
          ? "border-coral/60 bg-gradient-to-r from-coral/25 to-coral/10 text-cream shadow-[0_0_20px_rgba(255,61,104,0.15)]"
          : "border-line bg-white/[0.03] text-muted hover:border-line-strong hover:text-cream",
        className
      )}
    >
      {children}
    </button>
  );
}

export function LimitBanner({
  title,
  body,
  ctaHref = "/premium",
}: {
  title: string;
  body: string;
  ctaHref?: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-coral/25 bg-gradient-to-br from-coral/25 via-ink-elevated to-ink-soft p-5">
      <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-coral/30 blur-2xl" />
      <p className="relative font-display text-xl font-bold text-cream">{title}</p>
      <p className="relative mt-1.5 text-sm leading-relaxed text-cream/65">{body}</p>
      <Link
        href={ctaHref}
        className="relative mt-4 inline-flex items-center gap-1 text-sm font-bold text-mint transition hover:gap-2"
      >
        Upgrade to unlock
        <span aria-hidden>→</span>
      </Link>
    </div>
  );
}
