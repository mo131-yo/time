"use client";

import { useEffect, useRef } from "react";
import { useMagnetic } from "./useMagnetic";
import HeroBackground from "./HeroBackground";
import Marquee from "./Marquee";
import SectionIndex from "./SectionIndex";
import SplitChars from "./SplitChars";
import Badge from "./Badge";

export default function Hero({ onStart }: { onStart: () => void }) {
  const sectionRef = useRef<HTMLElement>(null);
  const btnRef = useMagnetic<HTMLButtonElement>();
  const ghostRef = useMagnetic<HTMLButtonElement>();

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const introRunning = document.documentElement.dataset.introActive === "1";

    let cancelled = false;
    let ctx: { revert: () => void } | null = null;

    (async () => {
      const gsapMod = await import("gsap");
      if (cancelled) return;
      const gsap = gsapMod.default ?? gsapMod;

      document.documentElement.classList.add("js");

      ctx = gsap.context(() => {
        if (prefersReduced) {
          gsap.set([".char", ".hero-item"], {
            opacity: 1,
            y: 0,
            yPercent: 0,
          });
          return;
        }
        const tl = gsap.timeline({ delay: introRunning ? 1.6 : 0.15 });
        tl.fromTo(
          ".split-ready .char",
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: "power4.out",
            stagger: 0.025,
          },
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
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pb-28 pt-28 text-center"
    >
      <HeroBackground />

      <SectionIndex n={1} total={3} className="absolute right-6 top-24 z-10" />

      <div className="relative z-10 flex flex-col items-center">
        <Badge className="hero-item mb-6">Memento Mori · Амьдралын цаг</Badge>

        <h1 className="split-ready text-[clamp(1.9rem,6vw,4.5rem)] font-black uppercase leading-[1.05] tracking-tight text-bone">
          <span className="block whitespace-nowrap">
            <SplitChars text="Чамд амьдрахад" />
          </span>
          <span className="block whitespace-nowrap">
            <SplitChars text="хэдэн секунд" />
          </span>
          <span className="block whitespace-nowrap text-ember">
            <SplitChars text="үлдсэн бэ?" />
          </span>
        </h1>

        <p className="hero-item font-mono-nums mt-6 max-w-xl text-sm leading-relaxed text-bone-dim sm:text-base">
          Хүйс, нас, улс үндэс, бие бялдар, дадал зуршлаа оруулаад нийт наслах
          насаа тооцоолж, үлдсэн амьдралаа секунд тутам буурах цаг хэлбэрээр
          хараарай.
        </p>

        <div className="hero-item mt-8 flex flex-col items-center gap-4 sm:mt-10 sm:flex-row">
          <button
            ref={btnRef}
            onClick={onStart}
            data-cursor-hover
            className="btn-primary"
          >
            Тооцоолж эхлэх
          </button>
          <button
            ref={ghostRef}
            onClick={onStart}
            data-cursor-hover
            className="btn-outline group"
          >
            Асуулт бөглөх
            <span className="inline-block transition-transform group-hover:translate-x-1">
              →
            </span>
          </button>
        </div>

        <div className="hero-item mt-10 flex flex-col items-center gap-3">
          <span className="font-mono-nums text-[10px] uppercase tracking-[0.35em] text-bone-dim">
            Доош гүйлгэ
          </span>
          <span className="block h-10 w-px bg-linear-to-b from-ember to-transparent" />
        </div>
      </div>

      <div className="hero-item absolute inset-x-0 bottom-0">
        <Marquee />
      </div>
    </section>
  );
}
