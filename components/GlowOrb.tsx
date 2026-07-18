"use client";

import { useEffect, useRef } from "react";

/**
 * Хулгана дагадаг бүдэг улбар glow бөмбөлөг — k3studios-ийн hero orb маягаар.
 * Cursor.tsx-тэй ижил хэв маяг: зөвхөн pointer: fine дээр, GSAP dynamic import,
 * quickTo-той удаан ease.
 */
export default function GlowOrb() {
  const orbRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const isCoarse = window.matchMedia("(pointer: coarse)").matches;
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (isCoarse || prefersReduced) return;

    const el = orbRef.current;
    if (!el) return;

    let cancelled = false;
    let onMove: ((e: MouseEvent) => void) | null = null;

    (async () => {
      const gsapMod = await import("gsap");
      if (cancelled) return;
      const gsap = gsapMod.default ?? gsapMod;

      gsap.set(el, { xPercent: -50, yPercent: -50, opacity: 1 });

      const moveX = gsap.quickTo(el, "x", { duration: 1.2, ease: "power3.out" });
      const moveY = gsap.quickTo(el, "y", { duration: 1.2, ease: "power3.out" });

      onMove = (e: MouseEvent) => {
        moveX(e.clientX);
        moveY(e.clientY);
      };
      window.addEventListener("mousemove", onMove);
    })();

    return () => {
      cancelled = true;
      if (onMove) window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <div
      ref={orbRef}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[1] h-72 w-72 rounded-full opacity-0"
      style={{
        background:
          "radial-gradient(circle, rgba(237, 87, 36, 0.14) 0%, transparent 70%)",
        filter: "blur(50px)",
        mixBlendMode: "screen",
      }}
    />
  );
}
