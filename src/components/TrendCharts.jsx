import { useEffect, useRef, useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { HEALTH_THRESHOLDS as T } from "../data/thresholds.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);
ChartJS.defaults.font.family = '"Inter", system-ui, sans-serif';
ChartJS.defaults.color = "#64748b";

/* ---------- Data helpers (team, unchanged) ---------- */

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

/* ---------- UI helpers (new) ---------- */

const CAUTION = "#e8c77a";

function withAlpha(hex, alpha) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
}

function formatValue(value, decimals = 0) {
  return Number.isInteger(value) ? String(value) : value.toFixed(decimals);
}

function usePrefersReducedMotion() {
  const [reduce, setReduce] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduce(query.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);
  return reduce;
}

// Animated number: counts up to the latest value, or shows it directly
// when the user prefers reduced motion.
function CountUp({ value, decimals = 0, reduce }) {
  const ref = useRef(null);
  const from = useRef(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (reduce) {
      el.textContent = formatValue(value, decimals);
      from.current = value;
      return undefined;
    }
    const start = from.current;
    const t0 = performance.now();
    let raf = 0;
    const step = (now) => {
      const t = Math.min(1, (now - t0) / 900);
      const eased = 1 - Math.pow(1 - t, 3);
      const current = start + (value - start) * eased;
      el.textContent = t < 1 ? current.toFixed(decimals) : formatValue(value, decimals);
      from.current = current;
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value, decimals, reduce]);

  return <span ref={ref}>{formatValue(value, decimals)}</span>;
}

/* ---------- Chart card ---------- */

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
  // UI additions
  unit = "",
  decimals = 0,
  threshold,
  isOutside,
  rule,
  span = 5,
  reduce = false,
}) {
  /* Data preparation (team, unchanged) */
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

  /* Display stats (new) */
  const numbers = chartValues.map(Number);
  const latest = numbers.at(-1);
  const avg = numbers.length ? numbers.reduce((a, b) => a + b, 0) / numbers.length : null;
  const flagged = numbers.map((v) => (isOutside ? isOutside(v) : false));
  const flaggedCount = flagged.filter(Boolean).length;
  const lastIndex = numbers.length - 1;

  const dataset =
    kind === "bar"
      ? { label, data: chartValues, backgroundColor: color, borderRadius: 4 }
      : {
        label,
        data: chartValues,
        borderColor: color,
        borderWidth: 2.5,
        tension: 0.4,
        fill: true,
        backgroundColor: (ctx) => {
          const area = ctx.chart.chartArea;
          if (!area) return withAlpha(color, 0.1);
          const gradient = ctx.chart.ctx.createLinearGradient(0, area.top, 0, area.bottom);
          gradient.addColorStop(0, withAlpha(color, 0.28));
          gradient.addColorStop(1, withAlpha(color, 0));
          return gradient;
        },
        pointRadius: (ctx) =>
          flagged[ctx.dataIndex] ? 5 : ctx.dataIndex === lastIndex ? 4.5 : 0,
        pointHoverRadius: 6,
        pointBackgroundColor: (ctx) => (flagged[ctx.dataIndex] ? CAUTION : color),
        pointBorderColor: "#0b1020",
        pointBorderWidth: 2,
      };

  const datasets = [dataset];
  if (threshold !== undefined && hasData) {
    datasets.push({
      label: "Limit",
      data: chartValues.map(() => threshold),
      borderColor: "rgba(148, 163, 184, 0.55)",
      borderWidth: 1.5,
      borderDash: [4, 5],
      pointRadius: 0,
      pointHoverRadius: 0,
      fill: false,
      tension: 0,
    });
  }

  const data = { labels: chartLabels, datasets };
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: reduce ? false : { duration: 900, easing: "easeOutCubic" },
    interaction: { mode: "index", intersect: false },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(11, 16, 32, 0.95)",
        borderColor: "rgba(255, 255, 255, 0.1)",
        borderWidth: 1,
        cornerRadius: 12,
        padding: 10,
        titleColor: "#8a94a6",
        bodyColor: "#e6edf7",
        titleFont: { size: 12, weight: "500" },
        bodyFont: { size: 13, weight: "600" },
        boxWidth: 8,
        boxHeight: 8,
        usePointStyle: true,
        callbacks: {
          label: (ctx) =>
            ` ${ctx.dataset.label}: ${ctx.formattedValue}${unit ? ` ${unit}` : ""}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: { color: "#64748b", font: { size: 12 }, maxRotation: 0, autoSkip: true, maxTicksLimit: 8 },
      },
      y: {
        min,
        max,
        ticks: { stepSize, color: "#64748b", font: { size: 12 }, padding: 8 },
        grid: { color: "rgba(255, 255, 255, 0.05)" },
        border: { display: false },
        title: { display: false, text: yTitle },
      },
    },
  };
  const Chart = kind === "bar" ? Bar : Line;

  return (
    <section
      className="trend-card"
      aria-label={title}
      style={{ "--metric": color, "--span": span }}
    >
      <header className="trend-card__head">
        <div>
          <p className="trend-card__label">
            <span className="trend-card__swatch" aria-hidden="true" />
            {title}
          </p>
          <p className="trend-card__value">
            {hasData ? <CountUp value={latest} decimals={decimals} reduce={reduce} /> : "—"}
            {hasData && unit && <span className="trend-card__unit">{unit}</span>}
          </p>
          <p className="trend-card__meta">
            {subtitle}
            {avg !== null &&
              ` · Avg ${formatValue(Number(avg.toFixed(decimals)), decimals)}${unit ? ` ${unit}` : ""}`}
          </p>
        </div>
        {hasData && isOutside && (
          <span className={`trend-tag ${flaggedCount ? "trend-tag--warn" : "trend-tag--ok"}`}>
            {flaggedCount
              ? `${flaggedCount} day${flaggedCount === 1 ? "" : "s"} outside`
              : "All within limit"}
          </span>
        )}
      </header>

      {hasData ? (
        <div className="trend-card__chart">
          <Chart data={data} options={options} />
        </div>
      ) : (
        <p className="trend-card__empty">No data available.</p>
      )}

      {rule && (
        <p className="trend-card__rule">
          <span className="trend-card__ring" aria-hidden="true" />
          {rule}
        </p>
      )}
    </section>
  );
}

/* ---------- Trends grid ---------- */

function MetricsCharts({ logs = [], range }) {
  const reduce = usePrefersReducedMotion();

  return (
    <div className="trends-grid">
      <MetricChart
        title="Sleep"
        subtitle="Hours slept per night"
        logs={logs}
        metric="sleep"
        label="Sleep"
        color="#a9b4f5"
        min={0}
        max={12}
        stepSize={2}
        limit={range}
        unit="h"
        decimals={1}
        threshold={T.sleep.belowHours}
        isOutside={(v) => v < T.sleep.belowHours}
        rule={`Sleep below ${T.sleep.belowHours} h for ${T.sleep.consecutiveDays} consecutive days triggers a warning.`}
        span={7}
        reduce={reduce}
      />
      <MetricChart
        title="Mood"
        subtitle="Daily mood rating"
        logs={logs}
        metric="mood"
        label="Mood"
        color="#c4b5fd"
        min={1}
        max={5}
        stepSize={1}
        limit={range}
        unit="/ 5"
        decimals={1}
        threshold={T.mood.atOrBelow}
        isOutside={(v) => v <= T.mood.atOrBelow}
        rule={`Mood ${T.mood.atOrBelow} or below on any day triggers a warning.`}
        span={5}
        reduce={reduce}
      />
      <MetricChart
        title="Exercise"
        subtitle="Daily exercise duration"
        logs={logs}
        metric="exercise"
        label="Exercise"
        color="#5eead4"
        min={0}
        limit={range}
        unit="min"
        threshold={T.exercise.belowMinutes}
        isOutside={(v) => v < T.exercise.belowMinutes}
        rule={`Exercise below ${T.exercise.belowMinutes} min for ${T.exercise.consecutiveDays} consecutive days triggers a warning.`}
        span={5}
        reduce={reduce}
      />
      <MetricChart
        title="Heart rate"
        subtitle="Daily resting heart rate"
        logs={logs}
        metric="heartRate"
        label="Heart rate"
        color="#ff6b6b"
        limit={range}
        unit="bpm"
        threshold={T.hr.aboveBpm}
        isOutside={(v) => v > T.hr.aboveBpm}
        rule={`Resting heart rate above ${T.hr.aboveBpm} bpm triggers a warning.`}
        span={7}
        reduce={reduce}
      />
      <MetricChart
        title="Radiation dose"
        subtitle="Daily dose (optional field)"
        logs={logs}
        metric="radiationDose"
        label="Radiation"
        color="#2dd4bf"
        min={0}
        limit={range}
        unit="mSv"
        decimals={2}
        threshold={T.radiation.aboveMsv}
        isOutside={(v) => v > T.radiation.aboveMsv}
        rule={`Daily dose above ${T.radiation.aboveMsv} mSv triggers a warning.`}
        span={12}
        reduce={reduce}
      />
    </div>
  );
}

export default MetricsCharts;

{/*
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
*/}