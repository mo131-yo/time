"use client";

export default function Disclaimer({ onReset }: { onReset: () => void }) {
  return (
    <footer className="flex flex-col items-center justify-center gap-6 border-t border-ash px-6 py-20 text-center">
      <button
        onClick={onReset}
        className="rounded-full border border-ash px-6 py-3 text-sm text-bone-dim transition-colors hover:border-ember hover:text-ember"
      >
        Дахин тооцоолох
      </button>
      <p className="max-w-xl text-xs leading-relaxed text-bone-dim">
        Энэ бол зугаа цэнгэл, өөрийгөө эргэцүүлэн бодоход зориулсан{" "}
        <span className="text-bone">ойролцоо тооцоолол</span> бөгөөд эмнэлгийн
        зөвлөгөө биш. Суурь наслалтын тоо нь НҮБ-ын World Population Prospects
        2024 (хамгийн сүүлийн албан ёсны багц)-д тулгуурлав. Хэн ч яг хэдэн жил
        амьдрахаа мэдэхгүй — тийм ч учраас өнөө өдөр чухал.
      </p>
      <p className="font-mono-nums text-[10px] uppercase tracking-[0.4em] text-bone-dim">
        Memento Mori
      </p>
    </footer>
  );
}
