"use client";

import { useEffect, useRef, useState } from "react";

/**
 * k3studios-ийн preloader + 3 самбарт page transition-ы эхлэлийн reveal:
 * Фаза A — лого, progress bar, % тоолуур (~1.4s симуляци);
 * Фаза B — 3 босоо самбар (ember/ink-2/ember) доош гулсаж хуудсыг ил гаргана.
 *
 * Хамгаалалт: reduced-motion болон нэг session дотор давтан зочлоход огт
 * харагдахгүй; GSAP амжилтгүй болсон ч fail-safe timeout-оор заавал арилна.
 * Идэвхтэй үедээ <html data-intro-active="1"> тавьж Hero-той синхрончлогдоно.
 */
export default function Preloader() {
  const [active, setActive] = useState(false);
  const [done, setDone] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  // Эхний шийдвэр: reduced-motion эсвэл нэг session дотор давтан зочилсон бол
  // идэвхжүүлэхгүй. Flag бичих + setState хоёуланг нь microtask дотор хийж
  // StrictMode-ийн давхар effect-д зөв ажиллана (1-р гүйлт цуцлагдана).
  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced || sessionStorage.getItem("mm-intro-seen")) return;

    let cancelled = false;
    Promise.resolve().then(() => {
      if (cancelled) return;
      sessionStorage.setItem("mm-intro-seen", "1");
      document.documentElement.dataset.introActive = "1";
      setActive(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Overlay рендэрлэгдсэний дараа GSAP timeline-ыг ажиллуулна
  useEffect(() => {
    if (!active) return;
    let cancelled = false;

    function finish() {
      delete document.documentElement.dataset.introActive;
      if (!cancelled) setDone(true);
    }

    // Fail-safe: GSAP ачаалагдаагүй/алдаа гарсан ч overlay заавал арилна
    const failSafe = setTimeout(finish, 4500);

    (async () => {
      try {
        const gsapMod = await import("gsap");
        if (cancelled) return;
        const gsap = gsapMod.default ?? gsapMod;
        const root = rootRef.current;
        if (!root) return;

        const fill = root.querySelector<HTMLElement>("[data-preloader-fill]");
        const pct = root.querySelector<HTMLElement>("[data-preloader-pct]");
        const inner = root.querySelector<HTMLElement>("[data-preloader-inner]");
        const panels = root.querySelectorAll<HTMLElement>(
          "[data-preloader-panel]",
        );

        const counter = { n: 0 };
        const tl = gsap.timeline({ onComplete: finish });

        tl.to(counter, {
          n: 100,
          duration: 1.4,
          ease: "power2.inOut",
          onUpdate: () => {
            const v = Math.round(counter.n);
            if (fill) fill.style.width = `${v}%`;
            if (pct) pct.textContent = String(v);
          },
        })
          .to(inner, { opacity: 0, duration: 0.25, ease: "power1.out" })
          .to(
            panels,
            {
              yPercent: 100,
              duration: 0.6,
              ease: "power4.inOut",
              stagger: 0.08,
            },
            "-=0.05",
          );
      } catch {
        finish();
      }
    })();

    return () => {
      cancelled = true;
      clearTimeout(failSafe);
      delete document.documentElement.dataset.introActive;
    };
  }, [active]);

  if (done || !active) return null;

  return (
    <div ref={rootRef} aria-hidden className="fixed inset-0 z-90">
      {/* 3 босоо самбар */}
      <div
        data-preloader-panel
        className="absolute inset-y-0 left-0 w-[33.4%] bg-ember"
      />
      <div
        data-preloader-panel
        className="absolute inset-y-0 left-[33.3%] w-[33.4%] bg-ink-2"
      />
      <div
        data-preloader-panel
        className="absolute inset-y-0 left-[66.6%] w-[33.4%] bg-ember"
      />

      {/* Лого + progress */}
      <div
        data-preloader-inner
        className="absolute inset-0 flex flex-col items-center justify-center gap-5"
      >
        <span className="font-mono-nums text-sm uppercase tracking-[0.4em] text-bone">
          Memento Mori
        </span>
        <div className="h-px w-48 overflow-hidden bg-bone/20">
          <div data-preloader-fill className="h-full w-0 bg-ember" />
        </div>
        <span
          data-preloader-pct
          className="font-mono-nums text-xs tracking-[0.2em] text-bone-dim"
        >
          0
        </span>
      </div>
    </div>
  );
}
