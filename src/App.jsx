import { useState } from "react";
import "./App.css";
import { checkHealthWarnings } from "./utils/warningEngine.js";
import HealthScoreCard from "./components/HealthScoreCard";
import SpaceContext from "./components/SpaceContext.jsx";
import HazardTag from "./components/HazardTag";
import MetricsCharts from "./components/MetricsCharts";
import { DEMO_LOGS, DEMO_LABEL } from "./data/demoData.js";

const SECTIONS = [
  { id: "overview", icon: "📊", label: "Overview" },
  { id: "log", icon: "📝", label: "Log" },
  { id: "charts", icon: "📈", label: "Charts" },
  { id: "alerts", icon: "⚠️", label: "Alerts" },
  { id: "history", icon: "🗂️", label: "History" },
];

function App() {
  const [activeSection, setActiveSection] = useState("overview");

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    sleep: "",
    mood: 3,
    exercise: "",
    heartRate: "",
    radiationDose: "",
  });

  const [savedLogs, setSavedLogs] = useState(
    JSON.parse(localStorage.getItem("astronautLogs")) || [],
  );

  // Demo mode shows simulated data only. It never touches the saved logs.
  const [demoMode, setDemoMode] = useState(false);
  const logs = demoMode ? DEMO_LOGS : savedLogs;

  const warnings = checkHealthWarnings(logs);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Write logs to localStorage and state together.
  const saveLogs = (updatedLogs) => {
    localStorage.setItem("astronautLogs", JSON.stringify(updatedLogs));
    setSavedLogs(updatedLogs);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // One log per date: saving the same date again replaces the old log.
    const replacing = savedLogs.some((log) => log.date === formData.date);
    saveLogs([
      ...savedLogs.filter((log) => log.date !== formData.date),
      formData,
    ]);
    alert(replacing ? "🚀 Log Updated!" : "🚀 Log Saved Successfully!");
    setFormData({
      ...formData,
      sleep: "",
      exercise: "",
      heartRate: "",
      radiationDose: "",
    });
  };

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-brand">🚀 Astronaut Health Monitor</div>

        <nav className="sidebar-nav">
          {SECTIONS.map((section) => (
            <button
              key={section.id}
              type="button"
              className={
                activeSection === section.id ? "nav-btn active" : "nav-btn"
              }
              onClick={() => setActiveSection(section.id)}
            >
              <span>{section.icon}</span> {section.label}
            </button>
          ))}
        </nav>

        <div className="sidebar-demo">
          <button
            type="button"
            className="demo-btn"
            onClick={() => setDemoMode(!demoMode)}
          >
            {demoMode ? "🧪 Exit demo mode" : "🧪 Start demo mode"}
          </button>
          <small>
            {demoMode
              ? "Showing simulated data. Your own logs are not changed."
              : "Preview the app with simulated mission data."}
          </small>
        </div>
      </aside>

      <main className="main-content">
        {demoMode && <div className="demo-banner">🧪 {DEMO_LABEL}</div>}

        {activeSection === "overview" && (
          <>
            <h1>Overview</h1>
            <HealthScoreCard warnings={warnings} logs={logs} />
            <SpaceContext logs={logs} />
          </>
        )}

        {activeSection === "log" && (
          <>
            <h1>Daily Log</h1>
            {demoMode ? (
              <div className="card">
                <h2>Demo mode is on</h2>
                <p>
                  Logging is turned off while simulated data is shown. Exit demo
                  mode to add your own log.
                </p>
              </div>
            ) : (
              <div className="card">
                <h2>Daily Log Entry</h2>
                <form onSubmit={handleSubmit} className="log-form">
                  <div className="input-group">
                    <label>Date:</label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="input-group">
                    <label>Sleep Hours:</label>
                    <HazardTag metric="sleep" />
                    <input
                      type="number"
                      step="0.1"
                      name="sleep"
                      value={formData.sleep}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="input-group">
                    <label>Mood (1-Bad to 5-Good): {formData.mood}</label>
                    <HazardTag metric="mood" />
                    <input
                      type="range"
                      min="1"
                      max="5"
                      name="mood"
                      value={formData.mood}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="input-group">
                    <label>Exercise (Minutes):</label>
                    <HazardTag metric="exercise" />
                    <input
                      type="number"
                      name="exercise"
                      value={formData.exercise}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="input-group">
                    <label>Heart Rate (BPM):</label>
                    <HazardTag metric="heartRate" />
                    <input
                      type="number"
                      name="heartRate"
                      value={formData.heartRate}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="input-group">
                    <label>Daily Radiation Dose (mSv):</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      name="radiationDose"
                      value={formData.radiationDose}
                      onChange={handleChange}
                      placeholder="Enter radiation dose (optional)"
                    />
                    <small>
                      Records daily radiation exposure for monitoring purposes.
                      Values are recorded in millisieverts (mSv).
                    </small>
                  </div>
                  <button type="submit" className="save-btn">
                    Save Daily Log
                  </button>
                </form>
              </div>
            )}
          </>
        )}

        {activeSection === "charts" && (
          <>
            <h1>Charts</h1>
            <MetricsCharts logs={logs} />
          </>
        )}

        {activeSection === "alerts" && (
          <>
            <h1>Alerts</h1>
            <div className="card">
              <h2>Health Warnings</h2>
              {warnings.length === 0 ? (
                <p>No health warnings detected.</p>
              ) : (
                <ul>
                  {warnings.map((warning, index) => (
                    <li key={index}>
                      <strong>{warning.type.toUpperCase()}</strong> —{" "}
                      {warning.message} ({warning.date})
                      <br />
                      <small>
                        ⚠️ Hazard: {warning.hazard} — {warning.risk}
                      </small>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}

        {activeSection === "history" && (
          <>
            <h1>History</h1>
            <div className="card">
              <h2>Mission History</h2>
              {logs.length === 0 ? (
                <p>No logs saved yet.</p>
              ) : (
                <ul style={{ listStyleType: "none", padding: 0 }}>
                  {logs.map((log, index) => (
                    <li
                      key={index}
                      style={{
                        borderBottom: "1px solid #45a29e",
                        padding: "10px 0",
                      }}
                    >
                      <strong>
                        {new Date(log.date).toLocaleDateString("en-GB")}
                      </strong>{" "}
                      | Sleep: {log.sleep}h | Mood: {log.mood}/5 | Exercise:{" "}
                      {log.exercise}m | HR: {log.heartRate} bpm | Radiation:{" "}
                      {log.radiationDose
                        ? `${log.radiationDose} mSv`
                        : "Not recorded"}
                      {/* Demo data is read-only, so only real logs can be deleted */}
                      {!demoMode && (
                        <button
                          type="button"
                          onClick={() =>
                            saveLogs(
                              savedLogs.filter((l) => l.date !== log.date),
                            )
                          }
                          style={{ marginLeft: "10px" }}
                        >
                          Delete
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default App;
