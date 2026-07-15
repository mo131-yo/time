/** k3studios-ийн "DIGITAL AGENCY · DUBAI, UAE" маягийн bordered pill eyebrow badge. */
export default function Badge({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-md border border-ash px-4 py-1.5 font-mono-nums text-xs uppercase tracking-[0.25em] text-bone-dim ${className}`}
    >
      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-ember" />
      {children}
    </span>
  );
}
