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
          scale: hovering ? 1.5 : 1,
          color: hovering ? "var(--bone)" : "var(--ember)",
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

  // CS:GO-ийн буун crosshair маягийн + хэлбэр: 4 богино зураас, голдоо зайтай
  return (
    <div
      ref={dotRef}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-100 h-5 w-5 text-ember opacity-0"
    >
      <span className="absolute left-1/2 top-0 h-1.5 w-0.5 -translate-x-1/2 bg-current" />
      <span className="absolute bottom-0 left-1/2 h-1.5 w-0.5 -translate-x-1/2 bg-current" />
      <span className="absolute left-0 top-1/2 h-0.5 w-1.5 -translate-y-1/2 bg-current" />
      <span className="absolute right-0 top-1/2 h-0.5 w-1.5 -translate-y-1/2 bg-current" />
    </div>
  );
}
