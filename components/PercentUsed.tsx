"use client";

import { LifeProfile, LifeEstimate } from "@/lib/lifeExpectancy";
import { percentUsed } from "@/lib/time";
import { useLiveClock } from "./useLiveClock";

export default function PercentUsed({
  profile,
  estimate,
}: {
  profile: LifeProfile;
  estimate: LifeEstimate;
}) {
  const now = useLiveClock(1000);
  const used = percentUsed(profile.birthDate, estimate.deathDate, now);
  const left = 100 - used;

  return (
    <section className="flex min-h-screen flex-col items-center justify-center px-6 py-24">
      <div className="reveal w-full max-w-2xl text-center">
        <p className="mb-6 font-mono-nums text-xs uppercase tracking-[0.4em] text-bone-dim">
          Амьдралаас зарцуулсан хугацаа
        </p>

        <div className="mb-4 flex items-baseline justify-center gap-2">
          <span className="glow-ember font-mono-nums text-6xl font-semibold text-ember sm:text-8xl">
            {used.toFixed(6)}
          </span>
          <span className="text-2xl text-bone-dim">%</span>
        </div>
        <p className="mb-12 text-sm text-bone-dim">
          Чиний амьдралын {used.toFixed(2)}% өнгөрч, {left.toFixed(2)}% үлдсэн байна.
        </p>

        {/* Progress bar — амьд */}
        <div className="relative h-6 w-full overflow-hidden rounded-full border border-ash bg-ink-2">
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-ember to-ember-soft transition-[width] duration-500 ease-linear"
            style={{ width: `${used}%` }}
          />
        </div>
        <div className="mt-3 flex justify-between font-mono-nums text-xs text-bone-dim">
          <span>Төрсөн</span>
          <span>{left.toFixed(1)}% үлдсэн</span>
          <span>Нас барах</span>
        </div>
      </div>
    </section>
  );
}
