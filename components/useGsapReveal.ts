"use client";

import { useEffect, useRef } from "react";

/**
 * Контейнер доторх `.reveal` элементүүдийг scroll хийхэд GSAP ScrollTrigger-ээр
 * дэлбэрүүлэн гаргана. GSAP зөвхөн client дээр — dynamic import ашиглана.
 * `deps` өөрчлөгдөх бүрт (жишээ нь үзэгдэл солигдоход) дахин холбоно.
 */
export function useGsapReveal<T extends HTMLElement>(
  deps: unknown[] = [],
): React.RefObject<T | null> {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let ctx: { revert: () => void } | null = null;
    let cancelled = false;

    (async () => {
      const gsapMod = await import("gsap");
      const stMod = await import("gsap/ScrollTrigger");
      if (cancelled) return;
      const gsap = gsapMod.default ?? gsapMod;
      const ScrollTrigger = stMod.ScrollTrigger ?? stMod.default;
      gsap.registerPlugin(ScrollTrigger);

      // GSAP амжилттай ачаалсны дараа л reveal-ийг нуух (эс бөгөөс контент харагдана)
      document.documentElement.classList.add("js");

      ctx = gsap.context(() => {
        const targets = gsap.utils.toArray<HTMLElement>(".reveal", el);
        targets.forEach((target) => {
          if (prefersReduced) {
            gsap.set(target, { opacity: 1, y: 0 });
            return;
          }
          gsap.fromTo(
            target,
            { opacity: 0, y: 40 },
            {
              opacity: 1,
              y: 0,
              duration: 1.1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: target,
                start: "top 85%",
                toggleActions: "play none none reverse",
              },
            },
          );
        });
        ScrollTrigger.refresh();
      }, el);
    })();

    return () => {
      cancelled = true;
      ctx?.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return ref;
}
