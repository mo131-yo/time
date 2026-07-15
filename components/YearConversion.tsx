"use client";

import { LifeEstimate } from "@/lib/lifeExpectancy";
import { groupNumber, remainingBreakdown, yearInUnits } from "@/lib/time";
import { useLiveClock } from "./useLiveClock";
import TimeBreakdownGrid from "./TimeBreakdownGrid";
import SectionIndex from "./SectionIndex";
import Badge from "./Badge";

export default function YearConversion({
  estimate,
}: {
  estimate: LifeEstimate;
}) {
  const now = useLiveClock(100);
  const y = yearInUnits();
  const remaining = remainingBreakdown(estimate.deathDate, now);

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center px-6 py-24">
      <SectionIndex n={3} total={6} className="absolute right-6 top-24" />
      <div className="reveal w-full max-w-3xl">
        <div className="mb-6 flex justify-center">
          <Badge>Нэг жил гэж хэр их вэ?</Badge>
        </div>
        <h2 className="mb-4 text-center text-2xl font-black uppercase text-bone sm:text-3xl">
          Ердөө <span className="text-ember">1 жил</span> нь —
        </h2>

        {/* Нэг жилийн хөрвүүлэлт (тогтмол лавлагаа) */}
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

        <p className="mb-10 text-center text-sm text-bone-dim">
          Тэгвэл өнөөдрөөс наслах насныхаа төгсгөл хүртэл чамд яг ийм хугацаа
          үлдсэн байна — энэ доорх тоо <span className="text-ember">бодит цагаар</span>{" "}
          урсаж, буурсаар байна:
        </p>

        {/* Өнөөдрөөс наслах насны төгсгөл хүртэлх задаргаа — амьд урсдаг */}
        <TimeBreakdownGrid breakdown={remaining} size="md" />
      </div>
    </section>
  );
}
