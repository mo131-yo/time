import { LifeProfile } from "./lifeExpectancy";

const KEY = "time.profile";

/** SSR-safe: серверт localStorage байхгүй тул null буцаана. */
export function loadProfile(): LifeProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as LifeProfile;
    // Наад захын баталгаажуулалт — хуучин (тоон бус дадал зуршилтай) хэлбэрийн
    // профайл байвал null буцааж, хэрэглэгчийг форм руу дахин чиглүүлнэ.
    if (
      !parsed.birthDate ||
      !parsed.sex ||
      !parsed.countryCode ||
      !parsed.smokingStatus ||
      typeof parsed.drinkOccasionsPerWeek !== "number" ||
      typeof parsed.exerciseMinPerWeek !== "number"
    )
      return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveProfile(profile: LifeProfile): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(profile));
  } catch {
    // хадгалах боломжгүй бол чимээгүй өнгөрөөнө
  }
}

export function clearProfile(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    // no-op
  }
}
