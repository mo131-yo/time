"use client";

import { Breakdown } from "@/lib/time";

function Cell({
  value,
  label,
  pad = 2,
  emphasize = false,
  size = "md",
}: {
  value: string;
  label: string;
  pad?: number;
  emphasize?: boolean;
  size?: "lg" | "md";
}) {
  return (
    <div className="flex flex-col items-center">
      <span
        className={`font-mono-nums tabular-nums ${
          emphasize ? "text-ember" : "text-bone"
        } ${
          size === "lg"
            ? emphasize
              ? "text-4xl sm:text-6xl"
              : "text-3xl sm:text-5xl"
            : emphasize
              ? "text-2xl sm:text-4xl"
              : "text-xl sm:text-3xl"
        }`}
      >
        {value.padStart(pad, "0")}
      </span>
      <span className="mt-2 text-[10px] uppercase tracking-[0.25em] text-bone-dim sm:text-xs">
        {label}
      </span>
    </div>
  );
}

/**
 * Хугацааны задаргааг (жил/сар/өдөр/цаг/мин/сек) grid хэлбэрээр харуулна.
 * Секундыг аравтын нэг оронтой харуулж, бодит цагаар тасралтгүй урсаж буйг мэдрүүлнэ.
 * `remainingBreakdown` (үлдсэн) болон `elapsedBreakdown` (өнгөрсөн) хоёуланд ашиглагдана.
 */
export default function TimeBreakdownGrid({
  breakdown,
  size = "md",
  includeYears = true,
}: {
  breakdown: Breakdown;
  size?: "lg" | "md";
  includeYears?: boolean;
}) {
  const b = breakdown;

  return (
    <div
      className={`grid grid-cols-3 gap-x-4 gap-y-8 sm:grid-cols-6 ${
        size === "lg" ? "gap-x-6 sm:gap-x-8" : "gap-x-4 sm:gap-x-6"
      }`}
    >
      {includeYears && (
        <Cell
          value={String(b.years)}
          label="жил"
          pad={1}
          emphasize={size === "lg"}
          size={size}
        />
      )}
      <Cell value={String(b.months)} label="сар" size={size} />
      <Cell value={String(b.days)} label="өдөр" size={size} />
      <Cell value={String(b.hours)} label="цаг" size={size} />
      <Cell value={String(b.minutes)} label="минут" size={size} />
      <Cell
        value={b.seconds.toFixed(1)}
        label="секунд"
        pad={4}
        emphasize
        size={size}
      />
    </div>
  );
}
