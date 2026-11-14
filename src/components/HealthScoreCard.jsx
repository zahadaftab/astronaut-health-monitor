import { getHealthScore } from "../utils/healthScore.js";

function HealthScoreCard({ warnings, logs }) {
  const score = getHealthScore(warnings, logs);

  return (
    <div
      className="card"
      style={{ marginTop: "30px", borderColor: score.color }}
    >
      <h2>Astronaut Health Score</h2>
      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        <div
          style={{
            width: "70px",
            height: "70px",
            borderRadius: "50%",
            backgroundColor: score.color,
            flexShrink: 0,
          }}
        />
        <div>
          <div
            style={{ fontSize: "24px", fontWeight: "bold", color: score.color }}
          >
            {score.label}
          </div>
          <div style={{ color: "#c5c6c7" }}>
            {score.level === "none"
              ? "Save a daily log to see your score."
              : `${score.count} warning(s) in the last 7 days of data`}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HealthScoreCard;
