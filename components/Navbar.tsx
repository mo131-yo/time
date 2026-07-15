"use client";

function scrollToForm() {
  document.getElementById("form")?.scrollIntoView({ behavior: "smooth" });
}

/** k3studios-ийн маягийн fixed navbar — лого зүүн талд, CTA баруун талд. */
export default function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-ash bg-ink/70 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a
          href="#"
          data-cursor-hover
          className="flex items-center gap-2 font-mono-nums text-sm uppercase tracking-[0.3em] text-bone"
        >
          <span className="h-2 w-2 rounded-full bg-ember" />
          Time
        </a>
        <button
          onClick={scrollToForm}
          data-cursor-hover
          className="btn-outline !px-5 !py-2 text-[11px]"
        >
          Тооцоолох
        </button>
      </div>
    </header>
  );
}
