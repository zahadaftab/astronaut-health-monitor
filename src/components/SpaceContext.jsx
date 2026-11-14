import { useState } from "react";

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

function SpaceContext() {
  const [activeId, setActiveId] = useState(hazards[0].id);
  const active = hazards.find((h) => h.id === activeId);

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
          return (
            <button
              key={hazard.id}
              type="button"
              onClick={() => setActiveId(hazard.id)}
              style={{
                padding: "8px 14px",
                borderRadius: "6px",
                border: "1px solid #45a29e",
                backgroundColor: isActive ? "#45a29e" : "transparent",
                color: isActive ? "#0b0c10" : "#c5c6c7",
                fontWeight: isActive ? "bold" : "normal",
                cursor: "pointer",
              }}
            >
              {hazard.icon} {hazard.label}
            </button>
          );
        })}
      </div>

      <div
        style={{
          borderLeft: "3px solid #45a29e",
          paddingLeft: "16px",
        }}
      >
        <div
          style={{
            fontSize: "20px",
            fontWeight: "bold",
            color: "#45a29e",
            marginBottom: "8px",
          }}
        >
          {active.label}
        </div>
        <ul style={{ margin: 0, paddingLeft: "20px", color: "#c5c6c7" }}>
          {active.points.map((point, index) => (
            <li key={index} style={{ marginBottom: "6px" }}>
              {point}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default SpaceContext;