export default function Badge({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-2 border border-ash px-4 py-1.5 font-mono-nums text-xs uppercase tracking-[0.25em] text-ember ${className}`}
    >
      <span className="h-1.5 w-1.5 shrink-0 bg-ember" />
      {children}
    </span>
  );
}
