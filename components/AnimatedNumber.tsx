"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  value: number;
  decimals?: number;
  duration?: number;
  className?: string;
  /** Мянгатын таслал тавих эсэх */
  group?: boolean;
  /** true бол дэлгэцэнд орж ирэх хүртэл 0 дээр хүлээгээд дараа нь эхэлнэ */
  startOnView?: boolean;
}

/**
 * GSAP-аар тоог 0-оос (эсвэл өмнөх утгаас) гөлгөр эргэлдүүлж харуулна.
 * Countdown-д тохиромжгүй (тэнд шууд утга харуулна); нэг удаагийн reveal-д тохиромжтой.
 */
export default function AnimatedNumber({
  value,
  decimals = 0,
  duration = 1.6,
  className,
  group = false,
  startOnView = false,
}: Props) {
  const [display, setDisplay] = useState(0);
  const [inView, setInView] = useState(!startOnView);
  const fromRef = useRef(0);
  const spanRef = useRef<HTMLSpanElement>(null);

  // startOnView: дэлгэцэнд орж ирэхийг нэг удаа ажиглана
  useEffect(() => {
    if (!startOnView) return;
    const el = spanRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [startOnView]);

  useEffect(() => {
    if (!inView) return;
    let cancelled = false;
    const start = fromRef.current;

    (async () => {
      const gsapMod = await import("gsap");
      if (cancelled) return;
      const gsap = gsapMod.default ?? gsapMod;
      const obj = { n: start };
      gsap.to(obj, {
        n: value,
        duration,
        ease: "power2.out",
        onUpdate: () => setDisplay(obj.n),
        onComplete: () => {
          fromRef.current = value;
        },
      });
    })();

    return () => {
      cancelled = true;
    };
  }, [value, duration, inView]);

  const formatted = group
    ? Math.round(display).toLocaleString("en-US")
    : display.toFixed(decimals);

  return (
    <span ref={spanRef} className={className}>
      {formatted}
    </span>
  );
}
