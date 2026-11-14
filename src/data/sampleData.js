// Sample mission data (7 days) used until real logs come from localStorage.
// One object per daily log — the same shape the log form will save:
//   date      "YYYY-MM-DD"
//   sleep     hours slept
//   mood      1 (very low) – 5 (great)
//   exercise  workout minutes
//   hr        resting heart rate (bpm)
export const sampleLogs = [
  { date: "2026-11-02", sleep: 5, mood: 3, exercise: 45, hr: 72 },
  { date: "2026-11-03", sleep: 7.5, mood: 4, exercise: 60, hr: 68 },
  { date: "2026-11-04", sleep: 6.5, mood: 3, exercise: 30, hr: 70 },
  { date: "2026-11-05", sleep: 7, mood: 4, exercise: 50, hr: 66 },
  { date: "2026-11-06", sleep: 6, mood: 2, exercise: 15, hr: 78 },
  { date: "2026-11-07", sleep: 8, mood: 4, exercise: 40, hr: 67 },
  { date: "2026-11-08", sleep: 8, mood: 5, exercise: 55, hr: 64 },
];
