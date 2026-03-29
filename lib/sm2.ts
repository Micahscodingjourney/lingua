export type CardSRSData = {
  interval: number;      // days until next review
  easeFactor: number;    // starts at 2.5
  repetitions: number;   // successful reviews in a row
  dueDate: string;       // ISO date string
};

// Grade 0 = Again, Grade 4 = Got it
export function sm2(grade: 0 | 4, data: CardSRSData): CardSRSData {
  let { interval, easeFactor, repetitions } = data;

  if (grade >= 3) {
    if (repetitions === 0) interval = 1;
    else if (repetitions === 1) interval = 6;
    else interval = Math.round(interval * easeFactor);
    repetitions += 1;
  } else {
    repetitions = 0;
    interval = 1;
  }

  // Adjust ease factor (min 1.3)
  easeFactor = Math.max(
    1.3,
    easeFactor + 0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02)
  );

  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + interval);

  return { interval, easeFactor, repetitions, dueDate: dueDate.toISOString() };
}

export function isDue(data: CardSRSData): boolean {
  return new Date(data.dueDate) <= new Date();
}

export function defaultSRS(): CardSRSData {
  return { interval: 0, easeFactor: 2.5, repetitions: 0, dueDate: new Date().toISOString() };
}

const STORAGE_KEY = (level: string) => `lingua_srs_${level}`;

export function loadSRSData(level: string): Record<string, CardSRSData> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY(level)) ?? "{}");
  } catch {
    return {};
  }
}

export function saveSRSData(level: string, data: Record<string, CardSRSData>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY(level), JSON.stringify(data));
}
