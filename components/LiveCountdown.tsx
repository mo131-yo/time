"use client";

import { LifeEstimate } from "@/lib/lifeExpectancy";
import { groupNumber, remainingBreakdown } from "@/lib/time";
import { useLiveClock } from "./useLiveClock";

function Cell({
  value,
  label,
  pad = 2,
  big = false,
}: {
  value: number;
  label: string;
  pad?: number;
  big?: boolean;
}) {
  return (
    <div className="flex flex-col items-center">
      <span
        className={`font-mono-nums tabular-nums ${
          big
            ? "glow-ember text-4xl text-ember sm:text-6xl"
            : "text-3xl text-bone sm:text-5xl"
        }`}
      >
        {String(value).padStart(pad, "0")}
      </span>
      <span className="mt-2 text-[10px] uppercase tracking-[0.25em] text-bone-dim sm:text-xs">
        {label}
      </span>
    </div>
  );
}

export default function LiveCountdown({
  estimate,
}: {
  estimate: LifeEstimate;
}) {
  const now = useLiveClock(1000);
  const b = remainingBreakdown(estimate.deathDate, now);

  return (
    <section className="flex min-h-screen flex-col items-center justify-center px-6 py-24 text-center">
      <p className="reveal mb-4 font-mono-nums text-xs uppercase tracking-[0.4em] text-bone-dim">
        Үлдсэн амьдрал
      </p>
      <h2 className="reveal mb-12 max-w-2xl text-2xl font-semibold text-bone sm:text-4xl">
        Энэ мөч бүр эргэж{" "}
        <span className="glow-ember text-ember">буцахгүй</span>
      </h2>

      {b.expired ? (
        <p className="reveal font-mono-nums text-3xl text-ember">
          Тооцоолсон хугацаа дуусав.
        </p>
      ) : (
        <>
          {/* Нарийвчилсан задаргаа — секунд тутам тик хийнэ */}
          <div className="reveal grid grid-cols-4 gap-x-6 gap-y-10 sm:grid-cols-7 sm:gap-x-8">
            <Cell value={b.years} label="жил" pad={1} big />
            <Cell value={b.months} label="сар" />
            <Cell value={b.weeks} label="долоо хоног" />
            <Cell value={b.days} label="өдөр" />
            <Cell value={b.hours} label="цаг" />
            <Cell value={b.minutes} label="минут" />
            <Cell value={b.seconds} label="секунд" big />
          </div>

          <p className="reveal mt-14 font-mono-nums text-sm text-bone-dim">
            Нийт{" "}
            <span className="text-bone">{groupNumber(b.totalSeconds)}</span>{" "}
            секунд үлдсэн ба энэ тоо секунд тутам буурч байна.
          </p>
        </>
      )}
    </section>
  );
}
