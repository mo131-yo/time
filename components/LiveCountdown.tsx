"use client";

import { LifeEstimate } from "@/lib/lifeExpectancy";
import { groupNumber, remainingBreakdown } from "@/lib/time";
import { useLiveClock } from "./useLiveClock";
import TimeBreakdownGrid from "./TimeBreakdownGrid";
import SectionIndex from "./SectionIndex";
import Badge from "./Badge";

export default function LiveCountdown({
  estimate,
}: {
  estimate: LifeEstimate;
}) {
  const now = useLiveClock(100);
  const b = remainingBreakdown(estimate.deathDate, now);

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center px-6 py-24 text-center">
      <SectionIndex n={5} total={6} className="absolute right-6 top-24" />
      <Badge className="reveal mb-4">Үлдсэн амьдрал</Badge>
      <h2 className="reveal mb-12 max-w-2xl text-2xl font-black uppercase text-bone sm:text-4xl">
        Энэ мөч бүр эргэж{" "}
        <span className="glow-ember text-ember">буцахгүй</span>
      </h2>

      {b.expired ? (
        <p className="reveal font-mono-nums text-3xl text-ember">
          Тооцоолсон хугацаа дуусав.
        </p>
      ) : (
        <>
          <div className="reveal">
            <TimeBreakdownGrid breakdown={b} size="lg" />
          </div>

          <p className="reveal mt-14 font-mono-nums text-sm text-bone-dim">
            Нийт{" "}
            <span className="text-bone">{groupNumber(b.totalSeconds)}</span>{" "}
            секунд үлдсэн ба энэ тоо бодит цагаар тасралтгүй буурч байна.
          </p>
        </>
      )}
    </section>
  );
}
