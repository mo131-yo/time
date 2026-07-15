"use client";

import { useMagnetic } from "./useMagnetic";
import SectionIndex from "./SectionIndex";

export default function Disclaimer({ onReset }: { onReset: () => void }) {
  const btnRef = useMagnetic<HTMLButtonElement>();

  return (
    <footer className="relative flex flex-col items-center justify-center gap-6 border-t border-ash px-6 py-20 text-center">
      <SectionIndex n={6} total={6} className="absolute right-6 top-24" />
      <button
        ref={btnRef}
        onClick={onReset}
        data-cursor-hover
        className="btn-outline"
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
      <p className="text-outline mt-6 text-4xl font-black uppercase tracking-tight sm:text-6xl">
        Memento Mori
      </p>
    </footer>
  );
}
