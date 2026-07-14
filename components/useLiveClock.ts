"use client";

import { useEffect, useState } from "react";

/**
 * Бодит цагийн амьд тоолуур. Тодорхой интервал тутам `now` (ms)-ийг шинэчилнэ.
 * Секунд тутам тик хийж, countdown-г бодит хугацаагаар буулгана.
 */
export function useLiveClock(intervalMs: number = 1000): number {
  const [now, setNow] = useState<number>(() => Date.now());

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  return now;
}
