"use client";

import { useEffect, useRef } from "react";
import { useMagnetic } from "./useMagnetic";
import SectionIndex from "./SectionIndex";
import Badge from "./Badge";

export default function Hero({ onStart }: { onStart: () => void }) {
  const sectionRef = useRef<HTMLElement>(null);
  const btnRef = useMagnetic<HTMLButtonElement>();

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let cancelled = false;
    let ctx: { revert: () => void } | null = null;

    (async () => {
      const gsapMod = await import("gsap");
      if (cancelled) return;
      const gsap = gsapMod.default ?? gsapMod;

      document.documentElement.classList.add("js");

      ctx = gsap.context(() => {
        if (prefersReduced) {
          gsap.set([".hero-line", ".hero-item"], { opacity: 1, y: 0 });
          return;
        }
        const tl = gsap.timeline({ delay: 0.15 });
        tl.fromTo(
          ".hero-line",
          { yPercent: 110 },
          { yPercent: 0, duration: 1, ease: "power4.out", stagger: 0.12 },
        ).fromTo(
          ".hero-item",
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            stagger: 0.15,
          },
          "-=0.55",
        );
      }, el);
    })();

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center"
    >
      <div className="glow-blob glow-blob-1 -left-32 top-1/3 h-96 w-96 bg-ember/20" />
      <div className="glow-blob glow-blob-2 -right-40 bottom-1/4 h-80 w-80 bg-ember-soft/15" />

      <SectionIndex n={1} total={3} className="absolute right-6 top-24" />

      <Badge className="hero-item mb-6">Memento Mori</Badge>

      <h1 className="max-w-4xl text-4xl font-black leading-tight tracking-tight text-bone sm:text-6xl md:text-7xl">
        <span className="block overflow-hidden pb-1">
          <span className="hero-line block">Чамд амьдрахад</span>
        </span>
        <span className="block overflow-hidden pb-1">
          <span className="hero-line block">
            <span className="glow-ember text-ember">хэдэн секунд</span>{" "}
            үлдсэн бэ?
          </span>
        </span>
      </h1>

      <p className="hero-item mt-8 max-w-xl text-base leading-relaxed text-bone-dim sm:text-lg">
        Хүйс, нас, улс үндэс, бие бялдар, дадал зуршлаа оруулаад нийт наслах
        насаа тооцоолж, үлдсэн амьдралаа секунд тутам буурах цаг хэлбэрээр
        хараарай.
      </p>

      <button
        ref={btnRef}
        onClick={onStart}
        data-cursor-hover
        className="hero-item group btn-primary mt-12"
      >
        Тооцоолж эхлэх
        <span className="inline-block transition-transform group-hover:translate-y-0.5">
          ↓
        </span>
      </button>

      <div className="hero-item absolute bottom-10 left-1/2 -translate-x-1/2 text-xs uppercase tracking-[0.3em] text-bone-dim">
        <span className="inline-block animate-pulse">доош гүйлгэ</span>
      </div>
    </section>
  );
}
