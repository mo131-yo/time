// Төрөх үеийн дундаж наслалт (life expectancy at birth), хүйсээр.
// Эх сурвалж: UN World Population Prospects 2024 revision (population.un.org/wpp) —
// одоогийн хамгийн сүүлийн албан ёсны багц (2026 revision хараахан гараагүй).
// Тоонууд нь хамгийн сүүлийн үеийн тооцоо (2023–2025 medium variant).

export type Sex = "male" | "female";

export interface CountryLifeExpectancy {
  /** ISO-ish түлхүүр */
  code: string;
  /** Монгол нэр */
  name: string;
  male: number;
  female: number;
}

// Цагаан толгойн дарааллаар биш — Монголыг эхэнд, дараа нь бүсээр.
export const COUNTRIES: CountryLifeExpectancy[] = [
  { code: "MN", name: "Монгол", male: 67.2, female: 76.4 },
  { code: "JP", name: "Япон", male: 81.7, female: 87.7 },
  { code: "KR", name: "Өмнөд Солонгос", male: 81.2, female: 87.2 },
  { code: "CN", name: "Хятад", male: 75.2, female: 80.9 },
  { code: "RU", name: "Орос", male: 67.3, female: 79.0 },
  { code: "KZ", name: "Казахстан", male: 70.1, female: 78.4 },
  { code: "US", name: "АНУ", male: 76.9, female: 81.9 },
  { code: "CA", name: "Канад", male: 80.4, female: 84.8 },
  { code: "MX", name: "Мексик", male: 72.2, female: 77.8 },
  { code: "BR", name: "Бразил", male: 72.8, female: 79.0 },
  { code: "GB", name: "Их Британи", male: 79.4, female: 83.2 },
  { code: "DE", name: "Герман", male: 79.0, female: 83.8 },
  { code: "FR", name: "Франц", male: 80.4, female: 86.1 },
  { code: "IT", name: "Итали", male: 81.6, female: 85.8 },
  { code: "ES", name: "Испани", male: 81.0, female: 86.3 },
  { code: "CH", name: "Швейцарь", male: 82.0, female: 85.8 },
  { code: "SE", name: "Швед", male: 81.4, female: 85.1 },
  { code: "NO", name: "Норвег", male: 81.8, female: 84.9 },
  { code: "TR", name: "Турк", male: 74.5, female: 79.9 },
  { code: "EG", name: "Египет", male: 69.5, female: 73.8 },
  { code: "IN", name: "Энэтхэг", male: 70.5, female: 73.6 },
  { code: "ID", name: "Индонез", male: 69.0, female: 73.3 },
  { code: "TH", name: "Тайланд", male: 72.2, female: 80.9 },
  { code: "VN", name: "Вьетнам", male: 69.9, female: 79.3 },
  { code: "PH", name: "Филиппин", male: 66.9, female: 72.8 },
  { code: "SG", name: "Сингапур", male: 81.2, female: 86.2 },
  { code: "AU", name: "Австрали", male: 82.1, female: 85.7 },
  { code: "ZA", name: "ӨАБНУ", male: 62.3, female: 68.9 },
  { code: "NG", name: "Нигери", male: 54.5, female: 56.5 },
  { code: "WORLD", name: "Бусад / Дэлхийн дундаж", male: 70.6, female: 75.9 },
];

export const DEFAULT_COUNTRY_CODE = "MN";

export function getCountry(code: string): CountryLifeExpectancy {
  return (
    COUNTRIES.find((c) => c.code === code) ??
    COUNTRIES.find((c) => c.code === "WORLD")!
  );
}

export function baseLifeExpectancy(code: string, sex: Sex): number {
  const country = getCountry(code);
  return sex === "male" ? country.male : country.female;
}
