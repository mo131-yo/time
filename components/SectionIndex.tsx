function pad(n: number): string {
  return String(n).padStart(2, "0");
}

export default function SectionIndex({
  n,
  total,
  className = "",
}: {
  n: number;
  total: number;
  className?: string;
}) {
  return (
    <div
      className={`font-mono-nums text-xs tracking-[0.2em] text-bone-dim ${className}`}
    >
      <span className="text-ember">{pad(n)}</span> / {pad(total)}
    </div>
  );
}
