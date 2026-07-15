"use client";

import { remainingBreakdown } from "@/lib/time";
import { useLiveClock } from "./useLiveClock";
import TimeBreakdownGrid from "./TimeBreakdownGrid";
import SectionIndex from "./SectionIndex";
import Badge from "./Badge";

/**
 * Профайлаас үл хамааран харагдах — өнөөдрөөс энэ жилийн төгсгөл хүртэл
 * бодит календарь дээр тулгуурлан урсдаг countdown. Профайлгүй урсгал болон
 * үр дүнгийн урсгал хоёуланд ашиглагддаг тул хэсгийн дугаарлалт props-оор ирнэ.
 */
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
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-24 text-center">
      <div className="glow-blob glow-blob-1 -left-40 top-1/4 h-96 w-96 bg-ember/20" />
      <div className="glow-blob glow-blob-2 -right-32 bottom-1/4 h-80 w-80 bg-ember-soft/15" />

      <SectionIndex n={sectionN} total={sectionTotal} className="absolute right-6 top-24" />

      <div className="reveal relative">
        <Badge className="mb-6">Бодит цаг · Календарь</Badge>

        <h2 className="mb-12 max-w-2xl text-3xl font-black uppercase leading-tight tracking-tight text-bone sm:text-5xl">
          {year} он дуусахад{" "}
          <span className="glow-ember text-ember">ийм л хугацаа</span> үлдлээ
        </h2>

        {b.expired ? (
          <p className="font-mono-nums text-2xl text-ember">
            Шинэ жил боллоо!
          </p>
        ) : (
          <TimeBreakdownGrid breakdown={b} size="lg" includeYears={false} />
        )}

        <p className="mx-auto mt-14 max-w-md text-sm text-bone-dim">
          Энэ тоо таны профайлаас үл хамааран, зөвхөн бодит календарийн цагаар
          л урсаж буурдаг.
        </p>
      </div>
    </section>
  );
}
