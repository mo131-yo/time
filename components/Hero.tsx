"use client";

export default function Hero({ onStart }: { onStart: () => void }) {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="reveal mb-6 font-mono-nums text-xs uppercase tracking-[0.4em] text-bone-dim">
        Memento Mori
      </p>
      <h1 className="reveal max-w-4xl text-4xl font-semibold leading-tight tracking-tight text-bone sm:text-6xl md:text-7xl">
        Чамд амьдрахад
        <br />
        <span className="glow-ember text-ember">хэдэн секунд</span> үлдсэн бэ?
      </h1>
      <p className="reveal mt-8 max-w-xl text-base leading-relaxed text-bone-dim sm:text-lg">
        Хүйс, нас, улс үндэс, бие бялдар, дадал зуршлаа оруулаад нийт наслах
        насаа тооцоолж, үлдсэн амьдралаа секунд тутам буурах цаг хэлбэрээр хараарай.
      </p>

      <button
        onClick={onStart}
        className="reveal group mt-12 rounded-full border border-ash bg-ink-2/60 px-8 py-4 text-sm font-medium tracking-wide text-bone transition-all hover:border-ember hover:text-ember hover:shadow-[0_0_40px_-8px_rgba(224,96,58,0.6)]"
      >
        Тооцоолж эхлэх
        <span className="ml-2 inline-block transition-transform group-hover:translate-y-0.5">
          ↓
        </span>
      </button>

      <div className="reveal absolute bottom-10 left-1/2 -translate-x-1/2 text-xs uppercase tracking-[0.3em] text-bone-dim">
        <span className="inline-block animate-pulse">доош гүйлгэ</span>
      </div>
    </section>
  );
}
