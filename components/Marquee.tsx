const DEFAULT_ITEMS = [
  "MEMENTO MORI",
  "ЦАГ ХОРОГДОЖ БАЙНА",
  "МӨЧ БҮР ҮНЭТЭЙ",
  "ХЭН Ч ХЭДЭН ЖИЛ АМЬДРАХАА МЭДЭХГҮЙ",
];

/**
 * Хязгааргүй гүйдэг тууз — цэвэр CSS animation (JS шаардлагагүй, hover дээр зогсоно).
 */
export default function Marquee({ items = DEFAULT_ITEMS }: { items?: string[] }) {
  const content = (
    <div className="flex shrink-0 items-center gap-8 pr-8">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-8">
          <span className="text-base font-black uppercase tracking-[0.15em] text-bone-dim sm:text-lg">
            {item}
          </span>
          <span className="text-ember">✦</span>
        </span>
      ))}
    </div>
  );

  return (
    <div className="overflow-hidden border-y border-ash bg-ink-2/40 py-5">
      <div className="marquee-track">
        {content}
        {content}
      </div>
    </div>
  );
}
