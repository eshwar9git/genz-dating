"use client";

import { Capacitor } from "@capacitor/core";

/** Open Stripe Checkout — system browser on native so cards & 3DS work reliably. */
export async function openStripeCheckout(url: string) {
  if (Capacitor.isNativePlatform()) {
    const { Browser } = await import("@capacitor/browser");
    await Browser.open({
      url,
      presentationStyle: "fullscreen",
      toolbarColor: "#07080c",
    });
    return;
  }
  window.location.href = url;
}

export function isNativeApp() {
  return Capacitor.isNativePlatform();
}

/** Custom scheme used for Stripe return deep links on iOS/Android */
export const APP_SCHEME = "vibed";
