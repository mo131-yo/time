"use client";

import { remainingBreakdown } from "@/lib/time";
import { useLiveClock } from "./useLiveClock";
import TimeBreakdownGrid from "./TimeBreakdownGrid";
import SectionHeading from "./SectionHeading";
import SectionIndex from "./SectionIndex";

export default function YearEndCountdown({
  sectionN = 2,
  sectionTotal = 3,
}: {
  sectionN?: number;
  sectionTotal?: number;
}) {
  const now = useLiveClock(100);
  const year = new Date(now).getFullYear();
  const yearEnd = new Date(year, 11, 31, 23, 59, 59, 999).toISOString();
  const b = remainingBreakdown(yearEnd, now);

  return (
    <section
      id="countdown"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-24 text-center"
    >
      <div className="breathe-glow -left-40 top-1/4 h-96 w-96 bg-ember/15" />
      <div
        className="breathe-glow -right-32 bottom-1/4 h-80 w-80 bg-ember-soft/10"
        style={{ animationDelay: "2.5s" }}
      />

      <SectionIndex n={sectionN} total={sectionTotal} className="absolute right-6 top-24" />

      <div className="relative">
        <SectionHeading
          line1={`${year} он`}
          line2="Дуусахад"
          badge="Бодит цаг · Календарь"
          className="mb-12"
        />

        {b.expired ? (
          <p className="reveal font-mono-nums text-2xl text-ember">
            Шинэ жил боллоо!
          </p>
        ) : (
          <div className="reveal">
            <TimeBreakdownGrid breakdown={b} size="lg" includeYears={false} />
          </div>
        )}

        <p className="reveal mx-auto mt-14 max-w-md text-sm text-bone-dim">
          Энэ тоо таны профайлаас үл хамааран, зөвхөн бодит календарийн цагаар
          л урсаж буурдаг.
        </p>
      </div>
    </section>
  );
}
