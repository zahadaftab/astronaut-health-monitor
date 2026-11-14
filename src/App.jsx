import SleepTrendChart from "./components/SleepTrendChart";
import { sampleLogs } from "./data/sampleData";

function App() {
  // Sample data for now; later this will be the logs loaded from localStorage.
  const logs = sampleLogs;

  const totalSleep = logs.reduce((total, log) => total + log.sleep, 0);

  const averageSleep = (totalSleep / logs.length).toFixed(1);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        color: "#f8fafc",
        padding: "40px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <header style={{ marginBottom: "35px" }}>
        <p style={{ color: "#38bdf8", letterSpacing: "2px" }}>CREWCHECK</p>

        <h1>Astronaut Health Monitor</h1>

        <p style={{ color: "#94a3b8" }}>Monitoring crew health and wellbeing</p>
      </header>

      <section
        style={{
          background: "#1e293b",
          padding: "25px",
          borderRadius: "16px",
          marginBottom: "25px",
        }}
      >
        <p style={{ color: "#94a3b8" }}>Average sleep</p>

        <h2 style={{ fontSize: "32px", margin: "5px 0" }}>
          {averageSleep} hours
        </h2>

        <p style={{ color: "#94a3b8", margin: 0 }}>Last 7 days · Sample data</p>
      </section>

      <section
        style={{
          background: "#1e293b",
          padding: "25px",
          borderRadius: "16px",
        }}
      >
        <h2>Sleep Trends</h2>

        <p style={{ color: "#94a3b8" }}>
          Daily sleep duration over the last week
        </p>

        <SleepTrendChart logs={logs} />
      </section>
    </main>
  );
}

export default App;
