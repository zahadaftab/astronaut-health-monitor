import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);


const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function MetricsChart({
  title,
  subtitle,
  values,
  label,
  color = "#38bdf8",
  kind = "line",
  min,
  max,
  stepSize,
  yTitle,
}) {
  const dataset =
    kind == "bar"
      ? { label, data: values, backgroundColor: color, borderRadius: 4 }
      : {
        label,
        data: values,
        borderColor: color,
        backgroundColor: color,
        tension: 0.3,
      };

  const data = { labels: DAYS, datasets: [dataset] };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        min,
        max,
        ticks: { stepSize },
        title: { display: true, text: yTitle },

      },
    },
  };
  const Chart = kind === "bar" ? Bar : Line;

  return (
    <section
      style={{ background: "#1e293b", padding: "25px", borderRadius: "16px" }}
    >
      <h2 style={{ marginTop: 0 }}> {title}</h2>
      <p style={{ color: "#94a3b8" }}>{subtitle}</p>

      <div style={{ width: "100%", height: "300px" }}>
        <Chart data={data} options={options} />
      </div>
    </section>

  );
}

export default MetricsChart;