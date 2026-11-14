// SIMULATED mission data for demo mode. Not real astronaut data.
// Values are based on the reference numbers in SOURCES.md:
//   - Sleep: ~7–7.5 h on good nights (8.5 h allotted, crews often get less)
//   - Exercise: ~2 h/day on the ISS (110–130 min)
//   - Radiation: ~0.4–0.5 mSv/day on the ISS, one day not recorded (null)
// Story: 6 healthy days, then from Nov 7 sleep drops under 6 h, exercise falls
// under 60 min, mood drops and heart rate rises, with a solar particle event
// on Nov 9–11. Recovery starts Nov 12.

export const DEMO_LABEL = "Simulated mission data (demo mode)";

export const DEMO_LOGS = [
  { date: "2026-11-01", sleep: 7.5, mood: 4, exercise: 120, heartRate: 62, radiationDose: 0.42 },
  { date: "2026-11-02", sleep: 7.2, mood: 4, exercise: 125, heartRate: 61, radiationDose: 0.45 },
  { date: "2026-11-03", sleep: 7.6, mood: 4, exercise: 115, heartRate: 63, radiationDose: null },
  { date: "2026-11-04", sleep: 7.0, mood: 5, exercise: 130, heartRate: 60, radiationDose: 0.4 },
  { date: "2026-11-05", sleep: 7.3, mood: 4, exercise: 110, heartRate: 62, radiationDose: 0.47 },
  { date: "2026-11-06", sleep: 6.8, mood: 4, exercise: 100, heartRate: 64, radiationDose: 0.44 },
  { date: "2026-11-07", sleep: 5.8, mood: 3, exercise: 75, heartRate: 68, radiationDose: 0.48 },
  { date: "2026-11-08", sleep: 5.5, mood: 3, exercise: 55, heartRate: 72, radiationDose: 0.5 },
  { date: "2026-11-09", sleep: 5.2, mood: 2, exercise: 45, heartRate: 76, radiationDose: 0.8 },
  { date: "2026-11-10", sleep: 5.0, mood: 2, exercise: 40, heartRate: 104, radiationDose: 1.2 },
  { date: "2026-11-11", sleep: 5.6, mood: 2, exercise: 50, heartRate: 84, radiationDose: 0.6 },
  { date: "2026-11-12", sleep: 6.4, mood: 3, exercise: 80, heartRate: 74, radiationDose: 0.45 },
  { date: "2026-11-13", sleep: 6.9, mood: 3, exercise: 100, heartRate: 68, radiationDose: 0.42 },
  { date: "2026-11-14", sleep: 7.2, mood: 4, exercise: 115, heartRate: 64, radiationDose: 0.43 },
];
