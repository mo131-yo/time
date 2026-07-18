"use client";

import { useEffect, useRef } from "react";

/** Кирилл + тоо + тэмдэгт — монгол текст үнэмшилтэй холилдоно */
const CHARSET = "АБВГДЕЖЗИКЛМНОӨПРСТУҮХЦЧШЫЭЮЯ01!<>-_";

/**
 * k3studios-ийн data-scramble маягийн hover эффект: элемент дээр хулгана
 * очиход текст нь санамсаргүй үсгээр холилдоод зүүнээс баруун тийш ~0.6s-т
 * буцаж тогтоно. Touch төхөөрөмж болон reduced-motion үед юу ч хийхгүй.
 *
 * Элементийн шууд textContent-ийг өөрчилдөг тул зөвхөн React-ийн дахин
 * рендэрлэдэггүй, статик текстэй span дээр ашиглана.
 */
export function useScramble<T extends HTMLElement>(): React.RefObject<T | null> {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const isCoarse = window.matchMedia("(pointer: coarse)").matches;
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (isCoarse || prefersReduced) return;

    const original = el.textContent ?? "";
    if (!original.trim()) return;

    let frame = 0;
    let rafId = 0;

    const DURATION_FRAMES = 36; // ~0.6s @60fps
    const chars = Array.from(original);

    function tick() {
      frame++;
      const progress = frame / DURATION_FRAMES;
      const settled = Math.floor(progress * chars.length);
      const next = chars
        .map((ch, i) => {
          if (ch === " ") return " ";
          if (i < settled) return ch;
          return CHARSET[Math.floor(Math.random() * CHARSET.length)];
        })
        .join("");
      el!.textContent = next;
      if (frame < DURATION_FRAMES) {
        rafId = requestAnimationFrame(tick);
      } else {
        el!.textContent = original;
      }
    }

    function onEnter() {
      cancelAnimationFrame(rafId);
      frame = 0;
      rafId = requestAnimationFrame(tick);
    }

    el.addEventListener("mouseenter", onEnter);
    return () => {
      el.removeEventListener("mouseenter", onEnter);
      cancelAnimationFrame(rafId);
      el.textContent = original;
    };
  }, []);

  return ref;
}
