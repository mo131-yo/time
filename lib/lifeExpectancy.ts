import { baseLifeExpectancy, Sex } from "./countries";

export type Smoking = "none" | "former" | "light" | "heavy";
export type Alcohol = "none" | "moderate" | "heavy";
export type Exercise = "none" | "some" | "regular";

export interface LifeProfile {
  sex: Sex;
  birthDate: string; // ISO "YYYY-MM-DD"
  countryCode: string;
  heightCm: number;
  weightKg: number;
  smoking: Smoking;
  alcohol: Alcohol;
  exercise: Exercise;
}

export interface LifeEstimate {
  /** Нийт наслах нас (жилээр) */
  totalYears: number;
  /** Суурь наслалт (улс + хүйс) */
  baseYears: number;
  /** Дадал зуршлаас нэмэгдсэн/хасагдсан жилүүд, задаргаагаар */
  factors: { label: string; delta: number }[];
  /** Тооцоолсон нас барах огноо (ISO) */
  deathDate: string;
  /** Одоогийн нас (аравтын оронтой, жилээр) */
  ageYears: number;
}

export const BMI_ADJUSTMENTS = { normal: 0, over: -1, obese: -3, under: -1 };

export function bmiOf(heightCm: number, weightKg: number): number {
  const m = heightCm / 100;
  if (m <= 0) return 0;
  return weightKg / (m * m);
}

function bmiFactor(bmi: number): { label: string; delta: number } {
  if (bmi === 0) return { label: "Биеийн жингийн индекс", delta: 0 };
  if (bmi < 18.5) return { label: "Туранхай (BMI < 18.5)", delta: BMI_ADJUSTMENTS.under };
  if (bmi < 25) return { label: "Хэвийн жин (BMI)", delta: BMI_ADJUSTMENTS.normal };
  if (bmi < 30) return { label: "Илүүдэл жин (BMI 25–30)", delta: BMI_ADJUSTMENTS.over };
  return { label: "Таргалалт (BMI ≥ 30)", delta: BMI_ADJUSTMENTS.obese };
}

const SMOKING_FACTOR: Record<Smoking, { label: string; delta: number }> = {
  none: { label: "Тамхи татдаггүй", delta: 0 },
  former: { label: "Тамхи хаясан", delta: -1 },
  light: { label: "Бага зэрэг тамхи татдаг", delta: -3 },
  heavy: { label: "Их тамхи татдаг", delta: -7 },
};

const ALCOHOL_FACTOR: Record<Alcohol, { label: string; delta: number }> = {
  none: { label: "Архи хэрэглэдэггүй", delta: 0 },
  moderate: { label: "Дунд зэрэг архи хэрэглэдэг", delta: 0.5 },
  heavy: { label: "Их архи хэрэглэдэг", delta: -3 },
};

const EXERCISE_FACTOR: Record<Exercise, { label: string; delta: number }> = {
  none: { label: "Дасгал хийдэггүй", delta: -1 },
  some: { label: "Хааяа дасгал хийдэг", delta: 1 },
  regular: { label: "Тогтмол дасгал хийдэг", delta: 3 },
};

/** Төрсөн огноо болон одоо/огнооноос нас (жилээр, аравтын оронтой) тооцоолно. */
export function ageFromBirth(birthDate: string, now: number = Date.now()): number {
  const birth = new Date(birthDate).getTime();
  return (now - birth) / (365.25 * 24 * 60 * 60 * 1000);
}

export function estimateLifeExpectancy(
  profile: LifeProfile,
  now: number = Date.now(),
): LifeEstimate {
  const baseYears = baseLifeExpectancy(profile.countryCode, profile.sex);
  const bmi = bmiOf(profile.heightCm, profile.weightKg);

  const factors = [
    bmiFactor(bmi),
    SMOKING_FACTOR[profile.smoking],
    ALCOHOL_FACTOR[profile.alcohol],
    EXERCISE_FACTOR[profile.exercise],
  ];

  const totalDelta = factors.reduce((sum, f) => sum + f.delta, 0);
  const ageYears = ageFromBirth(profile.birthDate, now);

  // Нас барах насыг одоогийн наснаас доошгүй 1 жилээр clamp хийнэ.
  const totalYears = Math.max(ageYears + 1, baseYears + totalDelta);

  const birth = new Date(profile.birthDate).getTime();
  const deathTime = birth + totalYears * 365.25 * 24 * 60 * 60 * 1000;

  return {
    totalYears,
    baseYears,
    factors,
    deathDate: new Date(deathTime).toISOString(),
    ageYears,
  };
}
