"use client";

import { useState } from "react";
import { COUNTRIES, DEFAULT_COUNTRY_CODE, Sex } from "@/lib/countries";
import {
  Alcohol,
  Exercise,
  LifeProfile,
  Smoking,
} from "@/lib/lifeExpectancy";

const field =
  "w-full rounded-lg border border-ash bg-ink-2 px-4 py-3 text-bone outline-none transition-colors focus:border-ember";
const labelCls =
  "mb-2 block text-xs font-medium uppercase tracking-[0.2em] text-bone-dim";

export default function ProfileForm({
  initial,
  onSubmit,
}: {
  initial?: LifeProfile | null;
  onSubmit: (profile: LifeProfile) => void;
}) {
  const [sex, setSex] = useState<Sex>(initial?.sex ?? "male");
  const [birthDate, setBirthDate] = useState(initial?.birthDate ?? "");
  const [countryCode, setCountryCode] = useState(
    initial?.countryCode ?? DEFAULT_COUNTRY_CODE,
  );
  const [heightCm, setHeightCm] = useState(
    initial?.heightCm ? String(initial.heightCm) : "",
  );
  const [weightKg, setWeightKg] = useState(
    initial?.weightKg ? String(initial.weightKg) : "",
  );
  const [smoking, setSmoking] = useState<Smoking>(initial?.smoking ?? "none");
  const [alcohol, setAlcohol] = useState<Alcohol>(initial?.alcohol ?? "none");
  const [exercise, setExercise] = useState<Exercise>(
    initial?.exercise ?? "some",
  );
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const h = Number(heightCm);
    const w = Number(weightKg);
    if (!birthDate) return setError("Төрсөн огноогоо оруулна уу.");
    const birthTime = new Date(birthDate).getTime();
    if (Number.isNaN(birthTime) || birthTime > Date.now())
      return setError("Төрсөн огноо буруу байна.");
    if (!h || h < 50 || h > 260) return setError("Өндрөө (см) зөв оруулна уу.");
    if (!w || w < 20 || w > 400) return setError("Жингээ (кг) зөв оруулна уу.");

    setError("");
    onSubmit({
      sex,
      birthDate,
      countryCode,
      heightCm: h,
      weightKg: w,
      smoking,
      alcohol,
      exercise,
    });
  }

  return (
    <section
      id="form"
      className="flex min-h-screen flex-col items-center justify-center px-6 py-24"
    >
      <div className="reveal w-full max-w-xl">
        <h2 className="mb-2 text-3xl font-semibold tracking-tight text-bone">
          Өөрийнхөө тухай хэлээч
        </h2>
        <p className="mb-10 text-sm text-bone-dim">
          Энэ мэдээллийг зөвхөн таны төхөөрөмж дээр (localStorage) хадгална.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Хүйс */}
          <div>
            <span className={labelCls}>Хүйс</span>
            <div className="grid grid-cols-2 gap-3">
              {(
                [
                  ["male", "Эрэгтэй"],
                  ["female", "Эмэгтэй"],
                ] as [Sex, string][]
              ).map(([v, label]) => (
                <button
                  type="button"
                  key={v}
                  onClick={() => setSex(v)}
                  className={`rounded-lg border px-4 py-3 text-sm transition-colors ${
                    sex === v
                      ? "border-ember bg-ember/10 text-ember"
                      : "border-ash bg-ink-2 text-bone-dim hover:border-bone-dim"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Төрсөн огноо + Улс */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="birth" className={labelCls}>
                Төрсөн огноо
              </label>
              <input
                id="birth"
                type="date"
                value={birthDate}
                max={new Date().toISOString().slice(0, 10)}
                onChange={(e) => setBirthDate(e.target.value)}
                className={`${field} scheme-dark`}
              />
            </div>
            <div>
              <label htmlFor="country" className={labelCls}>
                Улс
              </label>
              <select
                id="country"
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className={field}
              >
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Өндөр + Жин */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label htmlFor="height" className={labelCls}>
                Өндөр (см)
              </label>
              <input
                id="height"
                type="number"
                inputMode="numeric"
                placeholder="175"
                value={heightCm}
                onChange={(e) => setHeightCm(e.target.value)}
                className={field}
              />
            </div>
            <div>
              <label htmlFor="weight" className={labelCls}>
                Жин (кг)
              </label>
              <input
                id="weight"
                type="number"
                inputMode="numeric"
                placeholder="70"
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value)}
                className={field}
              />
            </div>
          </div>

          {/* Тамхи */}
          <div>
            <label htmlFor="smoking" className={labelCls}>
              Тамхи
            </label>
            <select
              id="smoking"
              value={smoking}
              onChange={(e) => setSmoking(e.target.value as Smoking)}
              className={field}
            >
              <option value="none">Татдаггүй</option>
              <option value="former">Хаясан</option>
              <option value="light">Бага зэрэг татдаг</option>
              <option value="heavy">Их татдаг</option>
            </select>
          </div>

          {/* Архи */}
          <div>
            <label htmlFor="alcohol" className={labelCls}>
              Архи
            </label>
            <select
              id="alcohol"
              value={alcohol}
              onChange={(e) => setAlcohol(e.target.value as Alcohol)}
              className={field}
            >
              <option value="none">Хэрэглэдэггүй</option>
              <option value="moderate">Дунд зэрэг</option>
              <option value="heavy">Их хэрэглэдэг</option>
            </select>
          </div>

          {/* Дасгал */}
          <div>
            <label htmlFor="exercise" className={labelCls}>
              Дасгал хөдөлгөөн
            </label>
            <select
              id="exercise"
              value={exercise}
              onChange={(e) => setExercise(e.target.value as Exercise)}
              className={field}
            >
              <option value="none">Хийдэггүй</option>
              <option value="some">Хааяа</option>
              <option value="regular">Тогтмол</option>
            </select>
          </div>

          {error && <p className="text-sm text-ember">{error}</p>}

          <button
            type="submit"
            className="w-full rounded-full bg-ember px-8 py-4 text-sm font-semibold tracking-wide text-ink transition-all hover:shadow-[0_0_40px_-6px_rgba(224,96,58,0.7)]"
          >
            Амьдралаа тооцоол
          </button>
        </form>
      </div>
    </section>
  );
}
