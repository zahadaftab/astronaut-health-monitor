import { HEALTH_THRESHOLDS } from "../data/thresholds.js";
import { HAZARD_MAP } from "../data/hazards.js";
export function checkHealthWarnings(rawLogs) {
  // Sort by date so "consecutive days" works even if logs were entered out of order
  const logs = [...rawLogs].sort((a, b) => new Date(a.date) - new Date(b.date));
  const warnings = [];
  // Mood and heart rate warnings
  logs.forEach((log) => {
    if (Number(log.mood) <= HEALTH_THRESHOLDS.mood.atOrBelow) {
      warnings.push({
        type: "mood",
        date: log.date,
        message: "Low mood detected",
      });
    }

    if (Number(log.heartRate) > HEALTH_THRESHOLDS.hr.aboveBpm) {
      warnings.push({
        type: "hr",
        date: log.date,
        message: "High resting heart rate detected",
      });
    }
  });

  // Sleep and exercise warnings
  for (let i = 0; i <= logs.length - 3; i++) {
    const first = new Date(logs[i].date);
    const second = new Date(logs[i + 1].date);
    const third = new Date(logs[i + 2].date);

    const consecutive =
      (second - first) / (1000 * 60 * 60 * 24) === 1 &&
      (third - second) / (1000 * 60 * 60 * 24) === 1;

    if (!consecutive) continue;

    if (
      logs[i].sleep < HEALTH_THRESHOLDS.sleep.belowHours &&
      logs[i + 1].sleep < HEALTH_THRESHOLDS.sleep.belowHours &&
      logs[i + 2].sleep < HEALTH_THRESHOLDS.sleep.belowHours
    ) {
      warnings.push({
        type: "sleep",
        date: logs[i + 2].date,
        message: "Low sleep detected for 3 consecutive days",
      });
    }

    if (
      logs[i].exercise < HEALTH_THRESHOLDS.exercise.belowMinutes &&
      logs[i + 1].exercise < HEALTH_THRESHOLDS.exercise.belowMinutes &&
      logs[i + 2].exercise < HEALTH_THRESHOLDS.exercise.belowMinutes
    ) {
      warnings.push({
        type: "exercise",
        date: logs[i + 2].date,
        message: "Low exercise detected for 3 consecutive days",
      });
    }
  }

  return warnings.map((w) => ({ ...w, ...HAZARD_MAP[w.type] }));
}
