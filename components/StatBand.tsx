import { LifeEstimate, LifeProfile } from "@/lib/lifeExpectancy";
import { percentUsed } from "@/lib/time";

/** k3studios-ийн бүтэн өргөнтэй, ембер өнгийн stat band-тай төстэй — бодит тооцоолсон утгуудтай. */
export default function StatBand({
  profile,
  estimate,
}: {
  profile: LifeProfile;
  estimate: LifeEstimate;
}) {
  const now = Date.now();
  const birth = new Date(profile.birthDate).getTime();
  const daysLived = Math.floor((now - birth) / (1000 * 60 * 60 * 24));
  const used = percentUsed(profile.birthDate, estimate.deathDate, now);
  const yearsLeft = Math.max(0, estimate.totalYears - estimate.ageYears);

  const stats = [
    { value: daysLived.toLocaleString("en-US"), label: "Амьдарсан өдөр" },
    { value: `${used.toFixed(0)}%`, label: "Ашигласан хугацаа" },
    { value: yearsLeft.toFixed(1), label: "Үлдсэн жил" },
    { value: String(estimate.factors.length), label: "Тооцоолсон хүчин зүйл" },
  ];

  return (
    <div className="bg-ember py-10">
      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 px-6 text-center sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label}>
            <div className="font-mono-nums text-3xl font-black text-ink sm:text-4xl">
              {s.value}
            </div>
            <div className="mt-1 text-xs uppercase tracking-widest text-ink/70">
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
