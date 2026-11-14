// Maps each warning type to a NASA Human Research Program hazard.
// Hazard names follow NASA's "Five Hazards of Human Spaceflight".
export const HAZARD_MAP = {
  mood: {
    hazard: "Isolation & Confinement",
    risk: "Behavioral health decline",
  },
  sleep: {
    hazard: "Isolation & Confinement",
    risk: "Sleep loss and circadian disruption",
  },
  exercise: {
    hazard: "Altered Gravity",
    risk: "Bone and muscle loss",
  },
  hr: {
    hazard: "Altered Gravity",
    risk: "Cardiovascular deconditioning",
  },
  radiation: {
    hazard: "Space Radiation",
    risk: "Cumulative radiation exposure",
  },
};
