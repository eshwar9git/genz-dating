"use client";

import { useEffect, useState } from "react";

/** True only after mount — use to avoid SSR/client attribute mismatches. */
export function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  return mounted;
}
