import { useState } from "react";
import "./App.css";
import SleepTrendChart from "./components/SleepTrendChart";
import { checkHealthWarnings } from "./utils/warningEngine.js";

function App() {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    sleep: "",
    date: new Date().toISOString().split("T")[0], 
    sleep: '',
    mood: 3,
    exercise: "",
    heartRate: "",
  });

  const [savedLogs, setSavedLogs] = useState(
    JSON.parse(localStorage.getItem("astronautLogs")) || [],
  );

  const warnings = checkHealthWarnings(savedLogs);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const existingLogs =
      JSON.parse(localStorage.getItem("astronautLogs")) || [];
    const updatedLogs = [...existingLogs, formData];
    localStorage.setItem("astronautLogs", JSON.stringify(updatedLogs));
    alert("🚀 Log Saved Successfully!");
    setSavedLogs(updatedLogs);
    setFormData({ ...formData, sleep: "", exercise: "", heartRate: "" });
  };

  return (
    <div className="container">
      <h1>🚀 Astronaut Health Monitor</h1>
      
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
            <input
              type="number"
              name="heartRate"
              value={formData.heartRate}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="save-btn">
            Save Daily Log
          </button>
        </form>
      </div>
      {/* Step 13: Health Warnings */}
      <div className="card" style={{ marginTop: "30px" }}>
        <h2>Health Warnings</h2>

        {warnings.length === 0 ? (
          <p>No health warnings detected.</p>
        ) : (
          <ul>
            {warnings.map((warning, index) => (
              <li key={index}>
                <strong>{warning.type.toUpperCase()}</strong> —{" "}
                {warning.message} ({warning.date})
              </li>
            ))}
          </ul>
        )}
      </div>
      {/* Step 7: Mission History (Dashboard) */}
      <div className="card" style={{ marginTop: "30px" }}>
      <div className="card" style={{ marginTop: '30px' }}>
        <h2>Mission History</h2>
        {savedLogs.length === 0 ? (
          <p>No logs saved yet.</p>
        ) : (
          <ul style={{ listStyleType: "none", padding: 0 }}>
            {savedLogs.map((log, index) => (
              <li
                key={index}
                style={{ borderBottom: "1px solid #45a29e", padding: "10px 0" }}
              >
                <strong>
                  {new Date(log.date).toLocaleDateString("en-GB")}
                </strong>{" "}
                | Sleep: {log.sleep}h | Mood: {log.mood}/5 | Exercise:{" "}
                {log.exercise}m | HR: {log.heartRate}
                bpm
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="card" style={{ marginTop: '30px' }}>
        <h2>Sleep Trend Graph</h2>
        {savedLogs.length === 0 ? (
          <p>No data to show graph.</p>
        ) : (
          <SleepTrendChart logs={savedLogs} />
        )}
      </div>
    </div>
  );
}

export default App;
