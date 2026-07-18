"use client";

import { useState } from "react";
import { LifeEstimate, LifeProfile } from "@/lib/lifeExpectancy";
import { percentUsed } from "@/lib/time";
import AnimatedNumber from "./AnimatedNumber";

/** k3studios-ийн хар stats зурвас — scroll дээр count-up хийдэг бодит утгуудтай. */
export default function StatBand({
  profile,
  estimate,
}: {
  profile: LifeProfile;
  estimate: LifeEstimate;
}) {
  // Рендэр бүрт өөрчлөгдөхгүй нэг удаагийн цагийн зураг (purity дүрэмд нийцүүлэв)
  const [now] = useState(() => Date.now());
  const birth = new Date(profile.birthDate).getTime();
  const daysLived = Math.floor((now - birth) / (1000 * 60 * 60 * 24));
  const used = percentUsed(profile.birthDate, estimate.deathDate, now);
  const yearsLeft = Math.max(0, estimate.totalYears - estimate.ageYears);

  const stats: {
    value: number;
    decimals?: number;
    group?: boolean;
    suffix?: string;
    label: string;
    accent?: boolean;
  }[] = [
    { value: daysLived, group: true, label: "Амьдарсан өдөр" },
    { value: used, suffix: "%", label: "Ашигласан хугацаа", accent: true },
    { value: yearsLeft, decimals: 1, label: "Үлдсэн жил" },
    { value: estimate.factors.length, label: "Тооцоолсон хүчин зүйл" },
  ];

  return (
    <div className="border-y border-ash bg-ink">
      <div className="mx-auto grid max-w-6xl grid-cols-2 divide-x divide-ash sm:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="flex flex-col items-center gap-2 border-b border-ash px-4 py-10 text-center sm:border-b-0"
          >
            <div
              className={`font-mono-nums text-4xl font-black sm:text-5xl ${
                s.accent ? "text-ember" : "text-bone"
              }`}
            >
              <AnimatedNumber
                value={s.value}
                decimals={s.decimals ?? 0}
                group={s.group}
                startOnView
              />
              {s.suffix}
            </div>
            <div className="font-mono-nums text-[10px] uppercase tracking-[0.25em] text-bone-dim">
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
