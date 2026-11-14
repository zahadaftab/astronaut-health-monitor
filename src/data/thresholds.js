// Warning thresholds — the ONE place these numbers live.
// Used by warningEngine.js (warnings + health score) and SpaceContext.jsx.
// Where each number comes from: see SOURCES.md (numbers in [] = reference).
// For monitoring trends in a prototype, not medical diagnosis.

export const HEALTH_THRESHOLDS = {
  sleep: {
    targetHours: 8.5, // ISS crews are allotted 8.5 h [6][8]
    belowHours: 6, // crews averaged ~6 h in space; 5–6 h impairs performance [7]
    criticalBelow: 4, // project-defined
    consecutiveDays: 3, // project-defined
  },

  mood: {
    atOrBelow: 2, // project-defined (self-rated 1–5)
  },

  exercise: {
    targetMinutes: 120, // ~2 h/day on the ISS [4][5]
    belowMinutes: 60, // project-defined: half of the NASA target
    consecutiveDays: 3, // project-defined
  },

  // Only apply this threshold to heart rate measured at rest.
  hr: {
    aboveBpm: 100, // project-defined
    criticalAbove: 120, // project-defined
  },

  radiation: {
    aboveMsv: 0.5, // per day: ISS crews get ~0.2–0.5 mSv/day [2][3]
    criticalAbove: 1.0, // per day: ~1 mSv/day+ projected beyond low-Earth orbit [2]
    careerLimitMsv: 600, // NASA occupational career exposure standard, not a medical safety threshold [1][2]
  },
};
