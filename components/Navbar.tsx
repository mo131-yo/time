"use client";

import { useEffect, useState } from "react";
import { useScramble } from "./useScramble";

const LINKS = [
  { label: "Нүүр", href: "#" },
  { label: "Цаг", href: "#countdown" },
  { label: "Тооцоолох", href: "#form" },
];

function NavLink({
  label,
  href,
  onClick,
  className = "",
}: {
  label: string;
  href: string;
  onClick?: () => void;
  className?: string;
}) {
  const ref = useScramble<HTMLSpanElement>();
  return (
    <a
      href={href}
      onClick={onClick}
      data-cursor-hover
      className={`font-mono-nums text-[11px] uppercase tracking-[0.2em] text-bone-dim transition-colors hover:text-bone ${className}`}
    >
      <span ref={ref}>{label}</span>
    </a>
  );
}

/** k3studios-ийн маягийн fixed navbar — лого зүүн, mono линкүүд гол, CTA баруун. */
export default function Navbar() {
  const [open, setOpen] = useState(false);
  const ctaRef = useScramble<HTMLSpanElement>();

  // Mobile цэс нээлттэй үед body scroll-ыг түгжинэ
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  function scrollToForm() {
    document.getElementById("form")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 border-b border-ash bg-ink/70 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <a
            href="#"
            data-cursor-hover
            className="flex items-center gap-2 font-mono-nums text-sm uppercase tracking-[0.3em] text-bone"
          >
            <span className="h-2 w-2 bg-ember" />
            Time
          </a>

          {/* Гол линкүүд — зөвхөн desktop */}
          <nav className="hidden items-center gap-8 md:flex">
            {LINKS.map((l) => (
              <NavLink key={l.href} label={l.label} href={l.href} />
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <span className="border border-ash px-2.5 py-1.5 font-mono-nums text-[10px] font-bold uppercase tracking-widest text-ember">
              MN
            </span>
            <button
              onClick={scrollToForm}
              data-cursor-hover
              className="btn-outline px-5! py-2! text-[11px]"
            >
              <span ref={ctaRef}>Тооцоолох</span>
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Цэс хаах" : "Цэс нээх"}
            aria-expanded={open}
            data-cursor-hover
            className="flex h-8 w-8 flex-col items-center justify-center gap-1.5 md:hidden"
          >
            <span
              className={`block h-px w-5 bg-bone transition-transform duration-300 ${open ? "translate-y-1.75 rotate-45" : ""}`}
            />
            <span
              className={`block h-px w-5 bg-bone transition-opacity duration-300 ${open ? "opacity-0" : ""}`}
            />
            <span
              className={`block h-px w-5 bg-bone transition-transform duration-300 ${open ? "-translate-y-1.75 -rotate-45" : ""}`}
            />
          </button>
        </div>
      </header>

      {/* Mobile fullscreen цэс */}
      <div
        className={`fixed inset-0 z-30 flex flex-col items-center justify-center gap-2 bg-ink/95 backdrop-blur-xl transition-opacity duration-300 md:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        {LINKS.map((l, i) => (
          <a
            key={l.href}
            href={l.href}
            onClick={() => setOpen(false)}
            className={`py-2 text-3xl font-black uppercase tracking-tight text-bone transition-all duration-300 hover:text-ember ${
              open ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
            style={{ transitionDelay: open ? `${100 + i * 70}ms` : "0ms" }}
          >
            {l.label}
          </a>
        ))}
        <span
          className={`mt-10 font-mono-nums text-[10px] uppercase tracking-[0.3em] text-bone-dim transition-opacity duration-300 ${
            open ? "opacity-100 delay-300" : "opacity-0"
          }`}
        >
          Memento Mori
        </span>
      </div>
    </>
  );
}
