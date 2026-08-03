"use client";

import { useState } from "react";
import { Flag, Ban, X } from "lucide-react";
import { Button } from "@/components/ui";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const REPORT_REASONS = [
  "Spam or scam",
  "Harassment or hate",
  "Inappropriate photos",
  "Underage / safety concern",
  "Impersonation",
  "Other",
] as const;

export function SafetyActions({
  profileId,
  profileName,
  compact,
}: {
  profileId: string;
  profileName: string;
  compact?: boolean;
}) {
  const blockUser = useAppStore((s) => s.blockUser);
  const reportUser = useAppStore((s) => s.reportUser);
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"menu" | "report" | "done">("menu");
  const [reason, setReason] = useState<string>(REPORT_REASONS[0]);
  const [details, setDetails] = useState("");
  const [message, setMessage] = useState("");

  const close = () => {
    setOpen(false);
    setMode("menu");
    setDetails("");
    setMessage("");
  };

  const onBlock = () => {
    blockUser(profileId);
    setMessage(`${profileName} is blocked and hidden from your feed.`);
    setMode("done");
  };

  const onReport = () => {
    const res = reportUser(profileId, reason, details);
    if (res.blocked === "duplicate") {
      setMessage("You already reported this profile today.");
    } else {
      setMessage(
        "Thanks — we logged your report. This person can also be blocked."
      );
    }
    setMode("done");
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "rounded-full border border-white/15 bg-ink/50 text-cream/80 backdrop-blur-md",
          compact ? "p-2" : "inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold"
        )}
        aria-label={`Report or block ${profileName}`}
      >
        <Flag className="h-3.5 w-3.5" />
        {!compact && "Safety"}
      </button>

      {open && (
        <div className="fixed inset-0 z-[80] flex items-end justify-center bg-ink/80 p-4 sm:items-center">
          <button
            type="button"
            className="absolute inset-0"
            aria-label="Close"
            onClick={close}
          />
          <div className="relative z-10 w-full max-w-md rounded-[28px] border border-white/12 bg-ink-elevated p-5 shadow-[0_24px_80px_rgba(0,0,0,0.55)]">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-xl font-bold">
                {mode === "report" ? "Report" : "Stay safe"}
              </h2>
              <button
                type="button"
                onClick={close}
                className="rounded-full border border-line p-2 text-muted"
                aria-label="Close safety sheet"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {mode === "menu" && (
              <div className="space-y-3">
                <p className="text-sm text-muted">
                  Report or block <span className="text-cream">{profileName}</span>.
                  Blocked people leave your Discover deck and chats.
                </p>
                <Button
                  className="w-full"
                  variant="secondary"
                  onClick={() => setMode("report")}
                >
                  <Flag className="h-4 w-4" /> Report
                </Button>
                <Button className="w-full" variant="danger" onClick={onBlock}>
                  <Ban className="h-4 w-4" /> Block
                </Button>
              </div>
            )}

            {mode === "report" && (
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {REPORT_REASONS.map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setReason(r)}
                      className={cn(
                        "rounded-full border px-3 py-1.5 text-xs font-medium",
                        reason === r
                          ? "border-coral/50 bg-coral/15 text-cream"
                          : "border-line text-muted"
                      )}
                    >
                      {r}
                    </button>
                  ))}
                </div>
                <textarea
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  rows={3}
                  placeholder="Optional details (no passwords or payment info)"
                  className="w-full rounded-2xl border border-line bg-ink-soft px-3 py-3 text-sm text-cream outline-none focus:border-coral/40"
                />
                <Button className="w-full" onClick={onReport}>
                  Submit report
                </Button>
                <button
                  type="button"
                  className="w-full text-center text-sm text-muted"
                  onClick={() => setMode("menu")}
                >
                  Back
                </button>
              </div>
            )}

            {mode === "done" && (
              <div className="space-y-4">
                <p className="text-sm text-cream/85">{message}</p>
                <Button className="w-full" variant="mint" onClick={close}>
                  Done
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
