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

function MetricsChart({
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
    <section
      style={{ background: "#1e293b", padding: "25px", borderRadius: "16px" }}
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

export default MetricsChart;
