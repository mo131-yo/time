"use client";

import { useEffect, useRef } from "react";

export function useMagnetic<T extends HTMLElement>(
  strength: number = 0.35,
): React.RefObject<T | null> {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cancelled = false;
    let onMove: ((e: MouseEvent) => void) | null = null;
    let onLeave: (() => void) | null = null;

    (async () => {
      const gsapMod = await import("gsap");
      if (cancelled) return;
      const gsap = gsapMod.default ?? gsapMod;

      const moveX = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3.out" });
      const moveY = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3.out" });

      onMove = (e: MouseEvent) => {
        const rect = el.getBoundingClientRect();
        const relX = e.clientX - (rect.left + rect.width / 2);
        const relY = e.clientY - (rect.top + rect.height / 2);
        moveX(relX * strength);
        moveY(relY * strength);
      };
      onLeave = () => {
        moveX(0);
        moveY(0);
      };

      el.addEventListener("mousemove", onMove);
      el.addEventListener("mouseleave", onLeave);
    })();

    return () => {
      cancelled = true;
      if (onMove) el.removeEventListener("mousemove", onMove);
      if (onLeave) el.removeEventListener("mouseleave", onLeave);
    };
  }, [strength]);

  return ref;
}
