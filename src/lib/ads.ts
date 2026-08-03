"use client";

import { Capacitor } from "@capacitor/core";

/** Google sample IDs — safe for emulator / debug builds */
export const ADMOB_TEST_APP_ID = "ca-app-pub-3940256099942544~3347511713";
export const ADMOB_TEST_REWARDED_UNIT_ID =
  "ca-app-pub-3940256099942544/5224354917";

export function getRewardedAdUnitId(): string {
  return (
    process.env.NEXT_PUBLIC_ADMOB_REWARDED_UNIT_ID?.trim() ||
    ADMOB_TEST_REWARDED_UNIT_ID
  );
}

/** Prefer test ads unless explicitly disabled with a real unit id. */
export function isAdMobTesting(): boolean {
  const flag = process.env.NEXT_PUBLIC_ADMOB_TESTING?.trim().toLowerCase();
  if (flag === "false" || flag === "0") return false;
  if (flag === "true" || flag === "1") return true;
  const unit = getRewardedAdUnitId();
  return unit.includes("3940256099942544");
}

export function usesNativeAds(): boolean {
  return Capacitor.isNativePlatform();
}

let initPromise: Promise<void> | null = null;

export async function initAdMob(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    const { AdMob } = await import("@capacitor-community/admob");
    await AdMob.initialize({
      initializeForTesting: isAdMobTesting(),
    });
  })().catch((err) => {
    initPromise = null;
    throw err;
  });

  return initPromise;
}

export type ShowRewardedResult =
  | { ok: true }
  | {
      ok: false;
      reason: "cancelled" | "failed" | "unavailable";
      message?: string;
    };

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const t = window.setTimeout(
      () => reject(new Error(`${label} timed out after ${ms}ms`)),
      ms
    );
    promise.then(
      (v) => {
        window.clearTimeout(t);
        resolve(v);
      },
      (e) => {
        window.clearTimeout(t);
        reject(e);
      }
    );
  });
}

/**
 * Show a native AdMob rewarded video.
 * Resolves `{ ok: true }` only when the SDK fires the Rewarded event
 * (or showRewardVideoAd returns a reward item). Early dismiss ≠ reward.
 * On web, returns `unavailable` so the UI can use the demo player.
 */
export async function showRewardedAd(): Promise<ShowRewardedResult> {
  if (!Capacitor.isNativePlatform()) {
    return { ok: false, reason: "unavailable", message: "web" };
  }

  try {
    await withTimeout(initAdMob(), 15_000, "AdMob init");
    const { AdMob, RewardAdPluginEvents } = await import(
      "@capacitor-community/admob"
    );

    await withTimeout(
      AdMob.prepareRewardVideoAd({
        adId: getRewardedAdUnitId(),
        isTesting: isAdMobTesting(),
      }),
      30_000,
      "Ad load"
    );

    const result = await withTimeout(
      new Promise<ShowRewardedResult>((resolve) => {
        let settled = false;
        const handles: { remove: () => Promise<void> }[] = [];

        const finish = (value: ShowRewardedResult) => {
          if (settled) return;
          settled = true;
          window.clearTimeout(dismissTimer);
          void Promise.all(handles.map((h) => h.remove().catch(() => undefined)));
          resolve(value);
        };

        let dismissTimer = 0;

        void AdMob.addListener(RewardAdPluginEvents.Rewarded, () => {
          finish({ ok: true });
        }).then((h) => handles.push(h));

        void AdMob.addListener(RewardAdPluginEvents.FailedToShow, (err) => {
          finish({
            ok: false,
            reason: "failed",
            message: err?.message ?? "Ad failed to show",
          });
        }).then((h) => handles.push(h));

        void AdMob.addListener(RewardAdPluginEvents.Dismissed, () => {
          // Rewarded often fires just before dismiss — wait briefly
          dismissTimer = window.setTimeout(() => {
            finish({
              ok: false,
              reason: "cancelled",
              message: "Ad closed without reward",
            });
          }, 400);
        }).then((h) => handles.push(h));

        void AdMob.showRewardVideoAd()
          .then((item) => {
            // Some Android builds resolve with the reward item
            if (item && (item.type != null || item.amount != null)) {
              finish({ ok: true });
            }
          })
          .catch((err: unknown) => {
            const message = err instanceof Error ? err.message : String(err);
            if (/dismiss|cancel|close/i.test(message)) {
              finish({ ok: false, reason: "cancelled", message });
            } else {
              finish({ ok: false, reason: "failed", message });
            }
          });
      }),
      120_000,
      "Ad show"
    );

    return result;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (/dismiss|cancel|close/i.test(message)) {
      return { ok: false, reason: "cancelled", message };
    }
    return { ok: false, reason: "failed", message };
  }
}
