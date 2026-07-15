"use client";

import { LifeProfile, LifeEstimate } from "@/lib/lifeExpectancy";
import { elapsedBreakdown, percentUsed } from "@/lib/time";
import { useLiveClock } from "./useLiveClock";
import TimeBreakdownGrid from "./TimeBreakdownGrid";
import SectionIndex from "./SectionIndex";
import Badge from "./Badge";

export default function PercentUsed({
  profile,
  estimate,
}: {
  profile: LifeProfile;
  estimate: LifeEstimate;
}) {
  const now = useLiveClock(100);
  const used = percentUsed(profile.birthDate, estimate.deathDate, now);
  const left = 100 - used;
  const elapsed = elapsedBreakdown(profile.birthDate, now);

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center px-6 py-24">
      <SectionIndex n={2} total={6} className="absolute right-6 top-24" />
      <div className="reveal w-full max-w-3xl text-center">
        <Badge className="mb-3">Одоогийн нас</Badge>
        <p className="mb-10 mt-4 font-mono-nums text-xl text-bone sm:text-2xl">
          {elapsed.years} жил {elapsed.months} сар {elapsed.days} өдөр
        </p>

        <Badge className="mb-6">Амьдралаас зарцуулсан хугацаа</Badge>

        <div className="mb-4 mt-4 flex items-baseline justify-center gap-2">
          <span className="glow-ember font-mono-nums text-6xl font-black text-ember sm:text-8xl">
            {used.toFixed(7)}
          </span>
          <span className="text-2xl text-bone-dim">%</span>
        </div>
        <p className="mb-12 text-sm text-bone-dim">
          Чиний амьдралын {used.toFixed(4)}% өнгөрч, {left.toFixed(4)}% үлдсэн байна.
        </p>

        {/* Progress bar — амьд */}
        <div className="relative h-6 w-full overflow-hidden rounded-full border border-ash bg-ink-2">
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-ember to-ember-soft"
            style={{ width: `${used}%` }}
          />
        </div>
        <div className="mb-14 mt-3 flex justify-between font-mono-nums text-xs text-bone-dim">
          <span>Төрсөн</span>
          <span>{left.toFixed(1)}% үлдсэн</span>
          <span>Нас барах</span>
        </div>

        {/* Зарцуулсан хугацааны нарийвчилсан задаргаа — бодит цагаар урсана */}
        <div className="mb-8 flex justify-center">
          <Badge>Зарцуулсан хугацааны задаргаа</Badge>
        </div>
        <TimeBreakdownGrid breakdown={elapsed} size="md" />
      </div>
    </section>
  );
}
