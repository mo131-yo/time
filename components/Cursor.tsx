"use client";

import { useEffect, useRef } from "react";

/**
 * Захиалгат курсор — зөвхөн заагч нарийвчлалтай (pointer: fine) төхөөрөмж дээр,
 * жишээ нь touch дэлгэц дээр огт рендэрлэгдэхгүй/ажиллахгүй.
 */
export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const isCoarse = window.matchMedia("(pointer: coarse)").matches;
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (isCoarse || prefersReduced) return;

    const el = dotRef.current;
    if (!el) return;

    let cancelled = false;
    let onMove: ((e: MouseEvent) => void) | null = null;
    let onOver: ((e: MouseEvent) => void) | null = null;

    (async () => {
      const gsapMod = await import("gsap");
      if (cancelled) return;
      const gsap = gsapMod.default ?? gsapMod;

      document.documentElement.classList.add("cursor-none-active");
      gsap.set(el, { xPercent: -50, yPercent: -50, opacity: 1 });

      const moveX = gsap.quickTo(el, "x", {
        duration: 0.45,
        ease: "power3.out",
      });
      const moveY = gsap.quickTo(el, "y", {
        duration: 0.45,
        ease: "power3.out",
      });

      onMove = (e: MouseEvent) => {
        moveX(e.clientX);
        moveY(e.clientY);
      };
      onOver = (e: MouseEvent) => {
        const hovering = !!(e.target as HTMLElement)?.closest(
          "a, button, input, select, textarea, [data-cursor-hover]",
        );
        gsap.to(el, {
          scale: hovering ? 1.7 : 1,
          borderColor: hovering ? "var(--bone)" : "var(--ember)",
          duration: 0.3,
          ease: "power3.out",
        });
      };

      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseover", onOver);
    })();

    return () => {
      cancelled = true;
      document.documentElement.classList.remove("cursor-none-active");
      if (onMove) window.removeEventListener("mousemove", onMove);
      if (onOver) window.removeEventListener("mouseover", onOver);
    };
  }, []);

  return (
    <div
      ref={dotRef}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[100] h-7 w-7 rounded-full border-2 border-ember bg-transparent opacity-0"
    />
  );
}
