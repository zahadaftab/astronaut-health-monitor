// SIMULATED mission data for demo mode. Not real astronaut data.
// 14 consecutive days showing a healthy start, then sleep loss, low mood,
// low exercise and a heart rate spike, so the warnings and score fire.
// Radiation (mSv/day) is optional: ~0.5 normally, a solar event on Nov 9–10,
// and one day not recorded (null) to show missing data.

export const DEMO_LABEL = "Simulated mission data (demo mode)";

export const DEMO_LOGS = [
  { date: "2026-11-01", sleep: 7.5, mood: 4, exercise: 45, heartRate: 62, radiationDose: 0.45 },
  { date: "2026-11-02", sleep: 8, mood: 4, exercise: 50, heartRate: 60, radiationDose: 0.5 },
  { date: "2026-11-03", sleep: 7, mood: 4, exercise: 40, heartRate: 63, radiationDose: null },
  { date: "2026-11-04", sleep: 7.5, mood: 5, exercise: 55, heartRate: 61, radiationDose: 0.48 },
  { date: "2026-11-05", sleep: 6.5, mood: 4, exercise: 35, heartRate: 64, radiationDose: 0.5 },
  { date: "2026-11-06", sleep: 5.5, mood: 3, exercise: 30, heartRate: 66, radiationDose: 0.52 },
  { date: "2026-11-07", sleep: 5, mood: 3, exercise: 25, heartRate: 68, radiationDose: 0.47 },
  { date: "2026-11-08", sleep: 4.5, mood: 2, exercise: 22, heartRate: 72, radiationDose: 0.55 },
  { date: "2026-11-09", sleep: 5, mood: 2, exercise: 15, heartRate: 75, radiationDose: 0.9 },
  { date: "2026-11-10", sleep: 5.5, mood: 2, exercise: 10, heartRate: 128, radiationDose: 1.5 },
  { date: "2026-11-11", sleep: 6, mood: 3, exercise: 12, heartRate: 85, radiationDose: 0.7 },
  { date: "2026-11-12", sleep: 6.5, mood: 3, exercise: 25, heartRate: 78, radiationDose: 0.5 },
  { date: "2026-11-13", sleep: 7, mood: 3, exercise: 30, heartRate: 70, radiationDose: 0.46 },
  { date: "2026-11-14", sleep: 7, mood: 4, exercise: 35, heartRate: 66, radiationDose: 0.44 },
];
