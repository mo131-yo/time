"use client";

import { useEffect, useState } from "react";

export function useLiveClock(intervalMs: number = 100): number {
  const [now, setNow] = useState<number>(() => Date.now());

  useEffect(() => {
    let cancelled = false;
    let fallbackId: ReturnType<typeof setInterval> | null = setInterval(
      () => setNow(Date.now()),
      intervalMs,
    );
    let gsapRef: { ticker: { remove: (fn: () => void) => void } } | null =
      null;
    let tickFn: (() => void) | null = null;

    (async () => {
      const gsapMod = await import("gsap");
      if (cancelled) return;
      const gsap = gsapMod.default ?? gsapMod;
      gsapRef = gsap;

      if (fallbackId) {
        clearInterval(fallbackId);
        fallbackId = null;
      }

      let last = 0;
      tickFn = () => {
        const t = performance.now();
        if (t - last >= intervalMs) {
          last = t;
          setNow(Date.now());
        }
      };
      gsap.ticker.add(tickFn);
    })();

    return () => {
      cancelled = true;
      if (fallbackId) clearInterval(fallbackId);
      if (gsapRef && tickFn) gsapRef.ticker.remove(tickFn);
    };
  }, [intervalMs]);

  return now;
}
