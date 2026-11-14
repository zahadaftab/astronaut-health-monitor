import { useState } from "react";
import { checkHealthWarnings } from "./utils/warningEngine.js";
import { DEMO_LOGS, DEMO_LABEL } from "./data/demoData.js";
import CrewCheckApp from "./CrewCheckApp";

// App owns the data (logs, demo mode, warnings) and the handlers.
// All UI lives in CrewCheckApp.jsx and src/screens/.
function App() {
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
    <CrewCheckApp
      logs={logs}
      savedLogs={savedLogs}
      warnings={warnings}
      formData={formData}
      onChange={handleChange}
      onSubmit={handleSubmit}
      onDelete={(date) => saveLogs(savedLogs.filter((l) => l.date !== date))}
      demoMode={demoMode}
      demoLabel={DEMO_LABEL}
      onToggleDemo={() => setDemoMode(!demoMode)}
    />
  );
}

export default App;
