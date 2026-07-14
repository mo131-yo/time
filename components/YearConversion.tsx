"use client";

import { LifeEstimate } from "@/lib/lifeExpectancy";
import { groupNumber, remainingInUnit, yearInUnits } from "@/lib/time";
import { useLiveClock } from "./useLiveClock";

export default function YearConversion({
  estimate,
}: {
  estimate: LifeEstimate;
}) {
  const now = useLiveClock(1000);
  const y = yearInUnits();

  // Үлдсэн амьдралыг нэгжүүдээр (амьд буурна)
  const leftHours = remainingInUnit(estimate.deathDate, "hour", now);
  const leftMinutes = remainingInUnit(estimate.deathDate, "minute", now);
  const leftSeconds = remainingInUnit(estimate.deathDate, "second", now);
  const leftYears = remainingInUnit(estimate.deathDate, "year", now);

  const rows: { unit: string; perYear: number; left: number }[] = [
    { unit: "Цаг", perYear: y.hours, left: leftHours },
    { unit: "Минут", perYear: y.minutes, left: leftMinutes },
    { unit: "Секунд", perYear: y.seconds, left: leftSeconds },
  ];

  return (
    <section className="flex min-h-screen flex-col items-center justify-center px-6 py-24">
      <div className="reveal w-full max-w-3xl">
        <p className="mb-6 text-center font-mono-nums text-xs uppercase tracking-[0.4em] text-bone-dim">
          Нэг жил гэж хэр их вэ?
        </p>
        <h2 className="mb-4 text-center text-2xl font-semibold text-bone sm:text-3xl">
          Ердөө <span className="text-ember">1 жил</span> нь —
        </h2>

        {/* Нэг жилийн хөрвүүлэлт */}
        <div className="mx-auto mb-14 grid max-w-lg grid-cols-3 gap-4 text-center">
          <div>
            <div className="font-mono-nums text-2xl text-bone sm:text-3xl">
              {groupNumber(y.hours)}
            </div>
            <div className="text-xs uppercase tracking-widest text-bone-dim">
              цаг
            </div>
          </div>
          <div>
            <div className="font-mono-nums text-2xl text-bone sm:text-3xl">
              {groupNumber(y.minutes)}
            </div>
            <div className="text-xs uppercase tracking-widest text-bone-dim">
              минут
            </div>
          </div>
          <div>
            <div className="font-mono-nums text-2xl text-bone sm:text-3xl">
              {groupNumber(y.seconds)}
            </div>
            <div className="text-xs uppercase tracking-widest text-bone-dim">
              секунд
            </div>
          </div>
        </div>

        <p className="mb-6 text-center text-sm text-bone-dim">
          Тэгвэл чамд үлдсэн{" "}
          <span className="text-ember">{leftYears.toFixed(1)} жил</span> нь
          нийтдээ —
        </p>

        {/* Үлдсэн амьдрал нэгжээр (амьд) */}
        <div className="mx-auto max-w-lg divide-y divide-ash rounded-2xl border border-ash bg-ink-2/60">
          {rows.map((r) => (
            <div
              key={r.unit}
              className="flex items-center justify-between px-6 py-4"
            >
              <span className="text-sm text-bone-dim">{r.unit}</span>
              <span className="font-mono-nums text-xl text-bone sm:text-2xl">
                {groupNumber(r.left)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
