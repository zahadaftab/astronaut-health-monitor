// Turns recent warnings into a green / yellow / red health score.
// It looks at the 7 days ending on the most recent log date,
// so it also works with demo data that isn't from today.

const WINDOW_DAYS = 7;
const YELLOW_AT = 1; // 1-2 warnings in the window
const RED_AT = 3; // 3 or more warnings in the window

export function getHealthScore(warnings, logs) {
  if (!logs || logs.length === 0) {
    return {
      level: "none",
      label: "No data yet",
      color: "#8892a0",
      count: 0,
    };
  }

  const latest = Math.max(...logs.map((log) => new Date(log.date).getTime()));
  const windowStart = latest - (WINDOW_DAYS - 1) * 24 * 60 * 60 * 1000;

  const recent = warnings.filter((w) => {
    const time = new Date(w.date).getTime();
    return time >= windowStart && time <= latest;
  });

  const count = recent.length;

  if (count >= RED_AT) {
    return { level: "red", label: "Critical", color: "#ff4d4d", count };
  }
  if (count >= YELLOW_AT) {
    return { level: "yellow", label: "Caution", color: "#ffc107", count };
  }
  return { level: "green", label: "Healthy", color: "#2ecc71", count };
}
