import { baseLifeExpectancy, Sex } from "./countries";

export type SmokingStatus = "never" | "former" | "current";

export interface LifeProfile {
  sex: Sex;
  birthDate: string; // ISO "YYYY-MM-DD"
  countryCode: string;
  heightCm: number;
  weightKg: number;
  smokingStatus: SmokingStatus;
  /** Зөвхөн smokingStatus === "current" үед хэрэглэгдэнэ, бусад тохиолдолд 0. */
  cigarettesPerDay: number;
  /** 7 хоногт архи хэрэглэдэг удаа. 0 = хэрэглэдэггүй. */
  drinkOccasionsPerWeek: number;
  /** 7 хоногт дасгал хийдэг минут. 0 = хийдэггүй. */
  exerciseMinPerWeek: number;
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

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

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

/**
 * Тамхины нөлөө. Өдөрт татах ширхэгийн тоо ихсэх тусам ойролцоогоор шугаман
 * буурч, дээд тал нь −10 жилээр хязгаарлагдана (маш ойролцоо тооцоо).
 */
function smokingFactor(
  status: SmokingStatus,
  cigarettesPerDay: number,
): { label: string; delta: number } {
  if (status === "never") return { label: "Тамхи татдаггүй", delta: 0 };
  if (status === "former") return { label: "Тамхи хаясан", delta: -1 };
  const delta = -clamp(1 + cigarettesPerDay * 0.3, 1, 10);
  return {
    label: `Тамхи татдаг (${cigarettesPerDay} ш/өдөрт)`,
    delta,
  };
}

/**
 * Архины нөлөө. 7 хоногт 1–7 удаа дунд зэргийн хэрэглээг бага эрсдэлтэй
 * гэж үзнэ (+0.5); 14-с дээш удаа бол эрсдэл шугаман нэмэгдэж −5 хүртэл хасна.
 */
function alcoholFactor(occasionsPerWeek: number): {
  label: string;
  delta: number;
} {
  if (occasionsPerWeek <= 0)
    return { label: "Архи хэрэглэдэггүй", delta: 0 };
  const label = `Архи хэрэглэдэг (7 хоногт ${occasionsPerWeek} удаа)`;
  if (occasionsPerWeek <= 7) return { label, delta: 0.5 };
  if (occasionsPerWeek <= 14) return { label, delta: 0 };
  return { label, delta: -clamp((occasionsPerWeek - 14) * 0.3, 0, 5) };
}

/**
 * Дасгалын нөлөө. ДЭМБ-ын зөвлөдөг 7 хоногт 150 минутаас цөөн байвал бага
 * эерэг нөлөөтэй; 150-аас дээш байвал илүү их эерэг нөлөөтэй (дээд тал +4.5).
 */
function exerciseFactor(minPerWeek: number): {
  label: string;
  delta: number;
} {
  if (minPerWeek <= 0) return { label: "Дасгал хийдэггүй", delta: -1 };
  const label = `Дасгал хийдэг (7 хоногт ${minPerWeek} мин)`;
  if (minPerWeek < 150) return { label, delta: 1 };
  return { label, delta: clamp(3 + (minPerWeek - 150) * 0.005, 3, 4.5) };
}

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
    smokingFactor(profile.smokingStatus, profile.cigarettesPerDay),
    alcoholFactor(profile.drinkOccasionsPerWeek),
    exerciseFactor(profile.exerciseMinPerWeek),
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
