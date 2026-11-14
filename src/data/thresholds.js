// Prototype warning thresholds — the ONE place these numbers live.
// Used by warningEngine.js (warnings + health score) and SpaceContext.jsx.
// These values are for monitoring trends, not medical diagnosis.

export const HEALTH_THRESHOLDS = {
  sleep: {
    belowHours: 7,
    criticalBelow: 4,
    consecutiveDays: 3,
  },

  mood: {
    atOrBelow: 2,
  },

  exercise: {
    belowMinutes: 20,
    consecutiveDays: 3,
  },

  // Only apply this threshold to heart rate measured at rest.
  hr: {
    aboveBpm: 100,
    criticalAbove: 120,
  },

  // mSv per day: green < 0.6, yellow 0.6–1.3, red > 1.3
  radiation: {
    aboveMsv: 0.6,
    criticalAbove: 1.3,
  },
};
