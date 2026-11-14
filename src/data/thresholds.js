// Prototype warning thresholds.
// These values are for monitoring trends, not medical diagnosis.

export const HEALTH_THRESHOLDS = {
  sleep: {
    belowHours: 7,
    consecutiveDays: 3,
  },

  mood: {
    atOrBelow: 2,
  },

  // Only apply this threshold to heart rate measured at rest.
  hr: {
    aboveBpm: 100,
  },

  exercise: {
    belowMinutes: 20,
    consecutiveDays: 3,
  },
};
