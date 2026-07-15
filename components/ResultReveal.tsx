"use client";

import { LifeEstimate } from "@/lib/lifeExpectancy";
import { getCountry } from "@/lib/countries";
import AnimatedNumber from "./AnimatedNumber";
import SectionIndex from "./SectionIndex";
import Badge from "./Badge";

export default function ResultReveal({
  estimate,
  countryCode,
}: {
  estimate: LifeEstimate;
  countryCode: string;
}) {
  const country = getCountry(countryCode);

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center px-6 py-24 text-center">
      <SectionIndex n={1} total={6} className="absolute right-6 top-24" />
      <Badge className="reveal mb-6">Тооцоолсон нийт наслах нас</Badge>

      <div className="reveal flex items-baseline justify-center gap-3">
        <span className="glow-ember font-mono-nums text-7xl font-black text-ember sm:text-9xl">
          <AnimatedNumber value={estimate.totalYears} decimals={1} />
        </span>
        <span className="text-2xl text-bone-dim sm:text-3xl">нас</span>
      </div>

      <p className="reveal mt-6 max-w-md text-sm text-bone-dim">
        {country.name} орны {estimate.baseYears.toFixed(1)} насны суурь дундажаас
        таны дадал зуршлыг тооцон гаргав.
      </p>

      {/* Хүчин зүйлсийн задаргаа */}
      <div className="reveal mt-12 w-full max-w-md space-y-2 text-left">
        <div className="flex items-center justify-between border-b border-ash pb-2 text-sm">
          <span className="text-bone-dim">Суурь ({country.name})</span>
          <span className="font-mono-nums text-bone">
            {estimate.baseYears.toFixed(1)}
          </span>
        </div>
        {estimate.factors.map((f, i) => (
          <div
            key={i}
            className="flex items-center justify-between py-1 text-sm"
          >
            <span className="text-bone-dim">{f.label}</span>
            <span
              className={`font-mono-nums ${
                f.delta > 0
                  ? "text-emerald-400"
                  : f.delta < 0
                    ? "text-ember"
                    : "text-bone-dim"
              }`}
            >
              {f.delta > 0 ? "+" : ""}
              {f.delta === 0 ? "0" : f.delta.toFixed(1)}
            </span>
          </div>
        ))}
        <div className="flex items-center justify-between border-t border-ash pt-2 text-sm font-semibold">
          <span className="text-bone">Нийт</span>
          <span className="font-mono-nums text-ember">
            {estimate.totalYears.toFixed(1)} нас
          </span>
        </div>
      </div>
    </section>
  );
}
