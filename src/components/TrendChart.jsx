// Reusable line chart for any daily metric (sleep, mood, exercise, heart rate).
// Each metric chart is just this component with different props — don't copy it.
import { Line } from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js parts once, here, for every chart in the app.
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

// "2026-11-02" -> "Mon" (T00:00 keeps it in local time so the day doesn't shift)
const toWeekday = (date) =>
  new Date(`${date}T00:00`).toLocaleDateString("en-US", { weekday: "short" });

// logs:   array of daily log objects (see src/data/sampleData.js)
// metric: which field to plot, e.g. "sleep" or "hr"
// label:  legend text; yTitle: y-axis title; color: line color
// yMin / yMax: y-axis range
function TrendChart({ logs, metric, label, yTitle, color, yMin = 0, yMax }) {
  const data = {
    labels: logs.map((log) => toWeekday(log.date)),
    datasets: [
      {
        label,
        data: logs.map((log) => log[metric]),
        borderColor: color,
        backgroundColor: color,
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        min: yMin,
        max: yMax,
        title: { display: true, text: yTitle },
      },
    },
  };

  return (
    <div style={{ width: "100%", height: "300px" }}>
      <Line data={data} options={options} />
    </div>
  );
}

export default TrendChart;
