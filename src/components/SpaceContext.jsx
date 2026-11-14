import { useState } from "react";

/* ---------- Hazard content ---------- */

const hazards = [
  {
    id: "radiation",
    label: "Radiation",
    points: [
      "Check dosimeter readings and heed solar particle event alerts. Shelter early.",
      "Log unexplained fatigue or nausea after any radiation event.",
    ],
  },
  {
    id: "isolation",
    label: "Isolation",
    points: [
      "Sleep and mood shifts are often the first sign of behavioral strain.",
      "A falling mood trend is worth raising with the crew or ground support.",
    ],
  },
  {
    id: "distance",
    label: "Distance",
    points: [
      "Comm delay and no quick return mean more autonomous medical decisions.",
      "Consistent daily logs give ground teams the baseline they need.",
    ],
  },
  {
    id: "gravity",
    label: "Gravity",
    points: [
      "Altered gravity drives bone loss, muscle loss, and fluid shifts.",
      "Protect your exercise minutes. Watch for resting heart rate drift.",
    ],
  },
  {
    id: "environment",
    label: "Environment",
    points: [
      "Cabin CO₂, noise, light, and temperature all affect sleep quality.",
      "Persistent headaches or poor sleep may point to a habitat issue. Report them.",
    ],
  },
];

/* ---------- Which check-in fields feed which hazard ----------
   Edit this map to match your HazardTag component.
   Distance is driven by logging consistency instead of a field. */

const HAZARD_METRICS = {
  radiation: ["radiationDose"],
  isolation: ["mood"],
  distance: [],
  gravity: ["exercise", "heartRate"],
  environment: ["sleep"],
};

/* ---------- Standards (edit to match mission requirements) ----------
   isBelow:  value is outside standard (too low, or too high for dose/HR)
   critical: value is dangerous on its own
   worsens:  direction that counts as a negative trend            */

const METRICS = {
  sleep: {
    label: "Sleep",
    unit: "h",
    target: "7h or more",
    isBelow: (v) => v < 7,
    critical: (v) => v < 4,
    worsens: "down",
  },
  mood: {
    label: "Mood",
    unit: "/5",
    target: "3 or higher",
    isBelow: (v) => v < 3,
    critical: () => false,
    worsens: "down",
  },
  exercise: {
    label: "Exercise",
    unit: "m",
    target: "60m or more",
    isBelow: (v) => v < 60,
    critical: () => false,
    worsens: "down",
  },
  radiationDose: {
    label: "Radiation dose",
    unit: " mSv",
    target: "1 mSv/day or less",
    isBelow: (v) => v > 1,
    critical: (v) => v > 10,
    worsens: "up",
  },
  heartRate: {
    label: "Heart rate",
    unit: " bpm",
    target: "50-90 bpm",
    isBelow: (v) => v < 50 || v > 90,
    critical: (v) => v < 40 || v > 110,
    worsens: "up",
  },
};

/* ---------- Status styling ---------- */

const STATUS = {
  green: { color: "#2ecc71", label: "On track", rank: 0 },
  yellow: { color: "#f1c40f", label: "Watch", rank: 1 },
  red: { color: "#e74c3c", label: "Action needed", rank: 2 },
  none: { color: "#7f8c8d", label: "No data", rank: -1 },
};

/* ---------- Evaluation logic ---------- */

const average = (nums) => nums.reduce((a, b) => a + b, 0) / nums.length;

function evaluateMetric(key, logs) {
  const cfg = METRICS[key];
  const values = logs.map((l) => Number(l[key])).filter(Number.isFinite);

  if (values.length === 0) {
    return { level: "none", note: `${cfg.label}: no data yet` };
  }

  const latest = values[values.length - 1];
  const recent = values.slice(-3);
  const earlier = values.slice(-6, -3);
  const shown = `${latest}${cfg.unit}`;

  // Dangerous on its own
  if (cfg.critical(latest)) {
    return {
      level: "red",
      note: `${cfg.label}: ${shown} is critical (standard ${cfg.target})`,
    };
  }

  // Consistently below standard
  if (recent.length >= 3 && recent.every(cfg.isBelow)) {
    return {
      level: "red",
      note: `${cfg.label}: below standard (${cfg.target}) for the last 3 logs`,
    };
  }

  // Slightly below standard
  if (recent.some(cfg.isBelow)) {
    return {
      level: "yellow",
      note: `${cfg.label}: recently below standard (latest ${shown}, standard ${cfg.target})`,
    };
  }

  // Still within standard, but heading the wrong way
  if (earlier.length >= 2 && average(earlier) > 0) {
    const change = (average(recent) - average(earlier)) / average(earlier);
    const worsening = cfg.worsens === "down" ? change <= -0.1 : change >= 0.1;
    if (worsening) {
      return {
        level: "yellow",
        note: `${cfg.label}: trending ${cfg.worsens === "down" ? "down" : "up"} but still within standard (latest ${shown})`,
      };
    }
  }

  return {
    level: "green",
    note: `${cfg.label}: meeting standard (latest ${shown})`,
  };
}

function evaluateLogging(logs) {
  const dates = logs
    .map((l) => new Date(`${l.date}T00:00:00`))
    .filter((d) => !Number.isNaN(d.getTime()));

  if (dates.length === 0) {
    return { level: "none", note: "Logging: no logs saved yet" };
  }

  const last = new Date(Math.max(...dates));
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const days = Math.max(0, Math.round((today - last) / 86400000));

  if (days <= 1) {
    return { level: "green", note: "Logging: up to date" };
  }
  if (days === 2) {
    return { level: "yellow", note: "Logging: last log was 2 days ago" };
  }
  return { level: "red", note: `Logging: last log was ${days} days ago` };
}

function evaluateHazard(id, logs) {
  const results = HAZARD_METRICS[id].map((key) => evaluateMetric(key, logs));
  if (id === "distance") results.push(evaluateLogging(logs));

  const level = results.reduce(
    (worst, r) => (STATUS[r.level].rank > STATUS[worst].rank ? r.level : worst),
    "none",
  );

  return { level, notes: results.map((r) => r.note) };
}

/* ---------- Component ---------- */

function SpaceContext({ logs = [] }) {
  const [activeId, setActiveId] = useState(hazards[0].id);
  const active = hazards.find((h) => h.id === activeId);

  // Oldest to newest so "recent" always means the latest entries
  const sortedLogs = [...logs].sort(
    (a, b) => new Date(a.date) - new Date(b.date),
  );

  const statuses = {};
  hazards.forEach((h) => {
    statuses[h.id] = evaluateHazard(h.id, sortedLogs);
  });

  const activeStatus = statuses[active.id];
  const activeStyle = STATUS[activeStatus.level];

  return (
    <div className="card" style={{ marginTop: "30px" }}>
      <h2>Five Hazards of Spaceflight</h2>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          marginBottom: "20px",
        }}
      >
        {hazards.map((hazard) => {
          const isActive = hazard.id === activeId;
          const status = STATUS[statuses[hazard.id].level];
          return (
            <button
              key={hazard.id}
              type="button"
              onClick={() => setActiveId(hazard.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 14px",
                borderRadius: "6px",
                border: `1px solid ${status.color}`,
                backgroundColor: isActive ? status.color : "transparent",
                color: isActive ? "#0b0c10" : "#c5c6c7",
                fontWeight: isActive ? "bold" : "normal",
                cursor: "pointer",
              }}
            >
              <span
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  backgroundColor: isActive ? "#0b0c10" : status.color,
                  flexShrink: 0,
                }}
              />
              {hazard.label}
            </button>
          );
        })}
      </div>

      <div
        style={{
          borderLeft: `3px solid ${activeStyle.color}`,
          paddingLeft: "16px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: "12px",
            marginBottom: "8px",
          }}
        >
          <div
            style={{
              fontSize: "20px",
              fontWeight: "bold",
              color: activeStyle.color,
            }}
          >
            {active.label}
          </div>
          <div style={{ color: activeStyle.color }}>{activeStyle.label}</div>
        </div>

        <ul style={{ margin: 0, paddingLeft: "20px", color: "#c5c6c7" }}>
          {active.points.map((point, index) => (
            <li key={index} style={{ marginBottom: "6px" }}>
              {point}
            </li>
          ))}
        </ul>

        <div style={{ marginTop: "12px", color: "#c5c6c7", fontSize: "14px" }}>
          {activeStatus.notes.map((note, index) => (
            <div key={index}>{note}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SpaceContext;