"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/** True only after mount — use to avoid SSR/client attribute mismatches. */
export function useMounted() {
  return useSyncExternalStore(subscribe, () => true, () => false);
}
