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
