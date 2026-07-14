"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  value: number;
  decimals?: number;
  duration?: number;
  className?: string;
  /** Мянгатын таслал тавих эсэх */
  group?: boolean;
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
}: Props) {
  const [display, setDisplay] = useState(0);
  const fromRef = useRef(0);

  useEffect(() => {
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
  }, [value, duration]);

  const formatted = group
    ? Math.round(display).toLocaleString("en-US")
    : display.toFixed(decimals);

  return <span className={className}>{formatted}</span>;
}
