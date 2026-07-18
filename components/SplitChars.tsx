/**
 * Текстийг үсэг тус бүрээр `<span class="char">`-уудад хуваана — k3studios-ийн
 * per-character орох анимацид зориулав. Дэлгэц уншигчид бүтэн текстийг
 * aria-label-ээс уншина; span-ууд нь aria-hidden.
 */
export default function SplitChars({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  return (
    <span aria-label={text} className={className}>
      {Array.from(text).map((ch, i) => (
        <span key={i} aria-hidden className="char">
          {ch === " " ? " " : ch}
        </span>
      ))}
    </span>
  );
}
