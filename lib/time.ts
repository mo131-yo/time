// Хугацааны цэвэр тооцооллын функцууд. Бүх амьд утга бодит Date.now()-оос гарна.

const MS = {
  second: 1000,
  minute: 60 * 1000,
  hour: 60 * 60 * 1000,
  day: 24 * 60 * 60 * 1000,
  week: 7 * 24 * 60 * 60 * 1000,
  year: 365.25 * 24 * 60 * 60 * 1000,
  month: (365.25 / 12) * 24 * 60 * 60 * 1000,
};

/** Нэг жилийг нэгжүүд рүү хөрвүүлсэн тогтмол лавлагаа (365.25 өдөр). */
export function yearInUnits() {
  return {
    days: 365.25,
    hours: 8766, // 365.25 * 24
    minutes: 525960, // 365.25 * 1440
    seconds: 31557600, // 365.25 * 86400
  };
}

/** Нийт наслах хугацаанаас хэдэн хувийг зарцуулсныг (0–100) буцаана. */
export function percentUsed(
  birthDate: string,
  deathDate: string,
  now: number = Date.now(),
): number {
  const birth = new Date(birthDate).getTime();
  const death = new Date(deathDate).getTime();
  const span = death - birth;
  if (span <= 0) return 100;
  const used = ((now - birth) / span) * 100;
  return Math.min(100, Math.max(0, used));
}

export interface Breakdown {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  /** Аравтын бутархайтай (жишээ нь 36.4) — секунд нь бодит цагаар тасралтгүй урсдаг мэдрэмж өгнө. */
  seconds: number;
  totalSeconds: number;
  expired: boolean;
}

/**
 * `ms`-ийг жил/сар/өдөр/цаг/мин/сек болгон задална (nested — нийлбэр нь яг `ms`).
 * `remainingBreakdown` болон `elapsedBreakdown` хоёулаа үүгээр дамждаг дундын логик.
 */
function breakdownBetween(ms: number): Breakdown {
  if (ms <= 0) {
    return {
      years: 0, months: 0, days: 0,
      hours: 0, minutes: 0, seconds: 0, totalSeconds: 0, expired: true,
    };
  }

  const totalSeconds = ms / MS.second;
  let remaining = ms;

  const years = Math.floor(remaining / MS.year);
  remaining -= years * MS.year;

  const months = Math.floor(remaining / MS.month);
  remaining -= months * MS.month;

  const days = Math.floor(remaining / MS.day);
  remaining -= days * MS.day;

  const hours = Math.floor(remaining / MS.hour);
  remaining -= hours * MS.hour;

  const minutes = Math.floor(remaining / MS.minute);
  remaining -= minutes * MS.minute;

  const seconds = remaining / MS.second;

  return { years, months, days, hours, minutes, seconds, totalSeconds, expired: false };
}

/** Үлдсэн хугацааг жил/сар/өдөр/цаг/мин/сек болгон задална. */
export function remainingBreakdown(
  deathDate: string,
  now: number = Date.now(),
): Breakdown {
  const death = new Date(deathDate).getTime();
  return breakdownBetween(death - now);
}

/** Төрснөөс хойш өнгөрсөн хугацааг жил/сар/өдөр/цаг/мин/сек болгон задална. */
export function elapsedBreakdown(
  birthDate: string,
  now: number = Date.now(),
): Breakdown {
  const birth = new Date(birthDate).getTime();
  return breakdownBetween(now - birth);
}

/** Үлдсэн хугацааг тухайн нэгжийн нийт тоогоор (жишээ нь нийт хоног). */
export function remainingInUnit(
  deathDate: string,
  unit: keyof typeof MS,
  now: number = Date.now(),
): number {
  const death = new Date(deathDate).getTime();
  const remaining = Math.max(0, death - now);
  return remaining / MS[unit];
}

/** Мянгатын таслалтай тоо (Монгол уншихад ойлгомжтой). */
export function groupNumber(n: number): string {
  return Math.floor(n).toLocaleString("en-US");
}
