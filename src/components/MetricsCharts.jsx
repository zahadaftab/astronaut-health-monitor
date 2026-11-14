import { Bar, Line } from "react-chartjs-2";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

function formatDate(value) {
  const date =
    typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)
      ? new Date(`${value}T00:00:00`)
      : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

function getLogDate(log) {
  return log?.date ?? log?.timestamp ?? log?.createdAt;
}

function MetricChart({
  title,
  subtitle,
  logs = [],
  metric,
  values,
  labels,
  label,
  color = "#38bdf8",
  kind = "line",
  min,
  max,
  stepSize,
  limit,
  yTitle,
}) {
  const points =
    logs.length > 0
      ? [...logs]
        .sort((a, b) => new Date(getLogDate(a)) - new Date(getLogDate(b)))
        .map((log) => ({
          label: getLogDate(log),
          value: metric ? log?.[metric] : undefined,
        }))
        .filter(
          (point) =>
            point.label != null &&
            point.value != null &&
            point.value !== "" &&
            Number.isFinite(Number(point.value)),
        )
      : (values ?? []).map((value, index) => ({
        label: labels?.[index] ?? String(index + 1),
        value,
      }));

  const visible = points.slice(-limit);
  const chartLabels = visible.map((point) => formatDate(point.label));
  const chartValues = visible.map((point) => point.value);
  const hasData = chartValues.length > 0;

  const dataset =
    kind === "bar"
      ? { label, data: chartValues, backgroundColor: color, borderRadius: 4 }
      : {
        label,
        data: chartValues,
        borderColor: color,
        backgroundColor: color,
        tension: 0.3,
      };

  const data = { labels: chartLabels, datasets: [dataset] };
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        min,
        max,
        ticks: { stepSize },
        title: { display: Boolean(yTitle), text: yTitle },
      },
    },
  };
  const Chart = kind === "bar" ? Bar : Line;

  return (
    <section className="card"
    >
      <h2 style={{ marginTop: 0 }}>{title}</h2>
      <p style={{ color: "#94a3b8" }}>{subtitle}</p>

      {hasData ? (
        <div style={{ width: "100%", height: "300px" }}>
          <Chart data={data} options={options} />
        </div>
      ) : (
        <p style={{ color: "#94a3b8" }}>No data available.</p>
      )}
    </section>
  );
}

function MetricsCharts({ logs = [] }) {
  return (
    <>
      <MetricChart
        title="Mood Trend"
        subtitle="Daily mood rating over time"
        logs={logs}
        metric="mood"
        label="Mood"
        color="#66fcf1"
        min={1}
        max={5}
        stepSize={1}
        yTitle="Mood Rating"
      />
      <MetricChart
        title="Exercise Trend"
        subtitle="Daily exercise duration over time"
        logs={logs}
        metric="exercise"
        label="Exercise"
        color="#45a29e"
        yTitle="Minutes"
      />
      <MetricChart
        title="Heart Rate Trend"
        subtitle="Daily resting heart rate over time"
        logs={logs}
        metric="heartRate"
        label="Heart Rate"
        color="#f87171"
        yTitle="BPM"
      />
    </>
  );
}

export default MetricsCharts;
