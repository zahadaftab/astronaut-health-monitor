// Sleep trend chart — a thin wrapper around the shared TrendChart.
// New metric charts (mood, exercise, HR) should follow this same pattern.
import TrendChart from "./TrendChart";

function SleepTrendChart({ logs }) {
  return (
    <TrendChart
      logs={logs}
      metric="sleep"
      label="Sleep Hours"
      yTitle="Hours of Sleep"
      color="#38bdf8"
      yMax={12}
    />
  );
}

export default SleepTrendChart;
