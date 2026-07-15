"use client";

import { useState } from "react";
import { COUNTRIES, DEFAULT_COUNTRY_CODE, Sex } from "@/lib/countries";
import { LifeProfile, SmokingStatus } from "@/lib/lifeExpectancy";
import { useMagnetic } from "./useMagnetic";
import SectionIndex from "./SectionIndex";

const field =
  "w-full rounded-lg border border-ash bg-ink-2 px-4 py-3 text-bone outline-none transition-colors focus:border-ember";
const labelCls =
  "mb-2 block text-xs font-medium uppercase tracking-[0.2em] text-bone-dim";

function toggleBtnCls(active: boolean) {
  return `rounded-lg border px-4 py-3 text-sm transition-colors ${
    active
      ? "border-ember bg-ember/10 text-ember"
      : "border-ash bg-ink-2 text-bone-dim hover:border-bone-dim"
  }`;
}

type AlcoholUse = "none" | "some";
type ExerciseUse = "none" | "some";

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

  const [smokingStatus, setSmokingStatus] = useState<SmokingStatus>(
    initial?.smokingStatus ?? "never",
  );
  const [cigarettesPerDay, setCigarettesPerDay] = useState(
    initial?.cigarettesPerDay ? String(initial.cigarettesPerDay) : "",
  );

  const [alcoholUse, setAlcoholUse] = useState<AlcoholUse>(
    initial && initial.drinkOccasionsPerWeek > 0 ? "some" : "none",
  );
  const [drinkOccasionsPerWeek, setDrinkOccasionsPerWeek] = useState(
    initial?.drinkOccasionsPerWeek ? String(initial.drinkOccasionsPerWeek) : "",
  );

  const [exerciseUse, setExerciseUse] = useState<ExerciseUse>(
    initial && initial.exerciseMinPerWeek > 0 ? "some" : "none",
  );
  const [exerciseMinPerWeek, setExerciseMinPerWeek] = useState(
    initial?.exerciseMinPerWeek ? String(initial.exerciseMinPerWeek) : "",
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

    let cigs = 0;
    if (smokingStatus === "current") {
      cigs = Number(cigarettesPerDay);
      if (!cigs || cigs < 1 || cigs > 100)
        return setError("Өдөрт хэдэн ширхэг татдагаа (1–100) оруулна уу.");
    }

    let drinks = 0;
    if (alcoholUse === "some") {
      drinks = Number(drinkOccasionsPerWeek);
      if (!drinks || drinks < 1 || drinks > 70)
        return setError("7 хоногт хэдэн удаа хэрэглэдгээ (1–70) оруулна уу.");
    }

    let exerciseMin = 0;
    if (exerciseUse === "some") {
      exerciseMin = Number(exerciseMinPerWeek);
      if (!exerciseMin || exerciseMin < 1 || exerciseMin > 2000)
        return setError("7 хоногт нийт хэдэн минут дасгал хийдгээ оруулна уу.");
    }

    setError("");
    onSubmit({
      sex,
      birthDate,
      countryCode,
      heightCm: h,
      weightKg: w,
      smokingStatus,
      cigarettesPerDay: cigs,
      drinkOccasionsPerWeek: drinks,
      exerciseMinPerWeek: exerciseMin,
    });
  }

  const submitRef = useMagnetic<HTMLButtonElement>();

  return (
    <section
      id="form"
      className="relative flex min-h-screen flex-col items-center justify-center px-6 py-24"
    >
      <SectionIndex n={3} total={3} className="absolute right-6 top-24" />
      <div className="reveal w-full max-w-xl">
        <h2 className="mb-2 text-3xl font-black tracking-tight text-bone">
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
                  className={toggleBtnCls(sex === v)}
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
            <span className={labelCls}>Тамхи</span>
            <div className="grid grid-cols-3 gap-3">
              {(
                [
                  ["never", "Татдаггүй"],
                  ["former", "Хаясан"],
                  ["current", "Татдаг"],
                ] as [SmokingStatus, string][]
              ).map(([v, label]) => (
                <button
                  type="button"
                  key={v}
                  onClick={() => setSmokingStatus(v)}
                  className={toggleBtnCls(smokingStatus === v)}
                >
                  {label}
                </button>
              ))}
            </div>
            {smokingStatus === "current" && (
              <div className="mt-3">
                <label htmlFor="cigs" className={labelCls}>
                  Өдөрт хэдэн ширхэг татдаг вэ?
                </label>
                <input
                  id="cigs"
                  type="number"
                  inputMode="numeric"
                  placeholder="10"
                  value={cigarettesPerDay}
                  onChange={(e) => setCigarettesPerDay(e.target.value)}
                  className={field}
                />
              </div>
            )}
          </div>

          {/* Архи */}
          <div>
            <span className={labelCls}>Архи</span>
            <div className="grid grid-cols-2 gap-3">
              {(
                [
                  ["none", "Хэрэглэдэггүй"],
                  ["some", "Хэрэглэдэг"],
                ] as [AlcoholUse, string][]
              ).map(([v, label]) => (
                <button
                  type="button"
                  key={v}
                  onClick={() => setAlcoholUse(v)}
                  className={toggleBtnCls(alcoholUse === v)}
                >
                  {label}
                </button>
              ))}
            </div>
            {alcoholUse === "some" && (
              <div className="mt-3">
                <label htmlFor="drinks" className={labelCls}>
                  7 хоногт хэдэн удаа хэрэглэдэг вэ?
                </label>
                <input
                  id="drinks"
                  type="number"
                  inputMode="numeric"
                  placeholder="2"
                  value={drinkOccasionsPerWeek}
                  onChange={(e) => setDrinkOccasionsPerWeek(e.target.value)}
                  className={field}
                />
              </div>
            )}
          </div>

          {/* Дасгал */}
          <div>
            <span className={labelCls}>Дасгал хөдөлгөөн</span>
            <div className="grid grid-cols-2 gap-3">
              {(
                [
                  ["none", "Хийдэггүй"],
                  ["some", "Хийдэг"],
                ] as [ExerciseUse, string][]
              ).map(([v, label]) => (
                <button
                  type="button"
                  key={v}
                  onClick={() => setExerciseUse(v)}
                  className={toggleBtnCls(exerciseUse === v)}
                >
                  {label}
                </button>
              ))}
            </div>
            {exerciseUse === "some" && (
              <div className="mt-3">
                <label htmlFor="exerciseMin" className={labelCls}>
                  7 хоногт нийт хэдэн минут дасгал хийдэг вэ?
                </label>
                <input
                  id="exerciseMin"
                  type="number"
                  inputMode="numeric"
                  placeholder="180"
                  value={exerciseMinPerWeek}
                  onChange={(e) => setExerciseMinPerWeek(e.target.value)}
                  className={field}
                />
              </div>
            )}
          </div>

          {error && <p className="text-sm text-ember">{error}</p>}

          <button
            ref={submitRef}
            type="submit"
            data-cursor-hover
            className="btn-primary w-full"
          >
            Амьдралаа тооцоол
          </button>
        </form>
      </div>
    </section>
  );
}
