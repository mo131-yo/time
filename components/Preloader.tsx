"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Сайтын theme-тэй нийцсэн preloader: бүтэн дэлгэцийн хар (bg-ink) overlay
 * дээр лого + progress bar + % тоолуур (~1.4s симуляци), дараа нь overlay
 * бүхэлдээ зөөлөн fade out хийж арилна.
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
        }).to(root, { opacity: 0, duration: 0.5, ease: "power1.out" });
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
    <div
      ref={rootRef}
      aria-hidden
      className="fixed inset-0 z-90 flex flex-col items-center justify-center gap-5 bg-ink"
    >
      <span className="font-mono-nums text-sm uppercase tracking-[0.4em] text-bone">
        Memento Mori
      </span>
      <div className="h-px w-48 overflow-hidden bg-ash">
        <div data-preloader-fill className="h-full w-0 bg-ember" />
      </div>
      <span
        data-preloader-pct
        className="font-mono-nums text-xs tracking-[0.2em] text-bone-dim"
      >
        0
      </span>
    </div>
  );
}
