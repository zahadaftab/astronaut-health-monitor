import Icon from "../components/ui/Icon";
// Astronaut illustration: vector trace of the image bundled with the "space-login" component.
import astronautUrl from "../assets/astronaut.svg";
import { getHealthScore } from "../utils/healthScore.js";
import { HEALTH_THRESHOLDS as T } from "../data/thresholds.js";
import {
  addDays,
  formatShort,
  parseLocalDate,
  todayKey,
  weekdayInitial,
} from "../utils/dates.js";
import "../styles/home.css";

const LEVEL_CLASS = {
  none: "none",
  green: "healthy",
  yellow: "caution",
  red: "critical",
};

const CAUSE_ORDER = ["sleep", "exercise", "mood", "hr"];
const CAUSE_LABEL = {
  sleep: "Sleep",
  exercise: "Exercise",
  mood: "Mood",
  hr: "Resting HR",
};
const WARNING_NAME = {
  mood: "Low mood",
  hr: "High resting heart rate",
  sleep: "Low sleep, 3 days",
  exercise: "Low exercise, 3 days",
};

// Display rules only: the limits come from thresholds.js, so the UI
// always matches the warning engine.
const METRICS = [
  {
    key: "sleep",
    label: "Sleep",
    unit: "h",
    color: "var(--color-sleep)",
    threshold: T.sleep.belowHours,
    limit: `< ${T.sleep.belowHours} h`,
    outside: (v) => v < T.sleep.belowHours,
    decimals: 1,
  },
  {
    key: "mood",
    label: "Mood",
    unit: "/5",
    color: "var(--color-mood)",
    threshold: T.mood.atOrBelow,
    limit: `≤ ${T.mood.atOrBelow}`,
    outside: (v) => v <= T.mood.atOrBelow,
    decimals: 1,
  },
  {
    key: "exercise",
    label: "Exercise",
    unit: "min",
    color: "var(--color-exercise)",
    threshold: T.exercise.belowMinutes,
    limit: `< ${T.exercise.belowMinutes} min`,
    outside: (v) => v < T.exercise.belowMinutes,
    decimals: 0,
  },
  {
    key: "heartRate",
    label: "Heart rate",
    unit: "bpm",
    color: "var(--color-heart)",
    threshold: T.hr.aboveBpm,
    limit: `> ${T.hr.aboveBpm} bpm`,
    outside: (v) => v > T.hr.aboveBpm,
    decimals: 0,
  },
];

// Positions match src/assets/astronaut.svg placed at x=69, y=10, 221.6 × 260
const SPOTS = [
  { id: "head", types: ["mood", "sleep"], label: "Mood · Sleep", x: 138, y: 62, lx: 82, ly: 58, anchor: "end" },
  { id: "aura", types: [], label: "Radiation", x: 232, y: 40, lx: 250, ly: 36, anchor: "start" },
  { id: "chest", types: ["hr"], label: "Heart rate", x: 169, y: 109, lx: 282, ly: 112, anchor: "start" },
  { id: "legs", types: ["exercise"], label: "Exercise", x: 208, y: 212, lx: 176, ly: 250, anchor: "end" },
];

/* ---------- helpers ---------- */

function toNumber(value) {
  if (value === "" || value === null || value === undefined) return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

const byDate = (a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0);

function formatNumber(value, decimals = 1) {
  if (Number.isInteger(value)) return String(value);
  return value.toFixed(decimals);
}

function formatRange(startKey, endKey) {
  const start = parseLocalDate(startKey);
  const end = parseLocalDate(endKey);
  return start.getMonth() === end.getMonth()
    ? `${formatShort(startKey)}–${end.getDate()}`
    : `${formatShort(startKey)}–${formatShort(endKey)}`;
}

function describeWarning(warning, logs) {
  const log = logs.find((l) => l.date === warning.date);
  const range = formatRange(addDays(warning.date, -2), warning.date);
  switch (warning.type) {
    case "sleep":
      return `Under ${T.sleep.belowHours} h for 3 nights (${range})`;
    case "exercise":
      return `Under ${T.exercise.belowMinutes} min for 3 days (${range})`;
    case "mood":
      return `${toNumber(log?.mood) ?? "—"}/5 on ${formatShort(warning.date)}`;
    case "hr":
      return `${toNumber(log?.heartRate) ?? "—"} bpm on ${formatShort(warning.date)}`;
    default:
      return warning.message;
  }
}

/* ---------- screen ---------- */

function Home({ logs, warnings, onNavigate }) {
  const sorted = logs.filter((l) => l?.date).sort(byDate);
  const latest = sorted.at(-1);
  const windowStart = latest ? addDays(latest.date, -6) : null;
  const week = latest ? sorted.filter((l) => l.date >= windowStart) : [];
  const recent = latest
    ? warnings
        .filter((w) => w.date >= windowStart && w.date <= latest.date)
        .sort(byDate)
    : [];
  const score = getHealthScore(warnings, logs);
  const level = LEVEL_CLASS[score.level] ?? "none";

  return (
    <div className="home-grid">
      <StatusHero
        score={score}
        level={level}
        recent={recent}
        logs={sorted}
        onNavigate={onNavigate}
      />
      <BodyStatus latest={latest} recent={recent} />
      <MetricCards latest={latest} week={week} />
      <WarningsCard recent={recent} />
      <ConsistencyCard logs={sorted} />
    </div>
  );
}

/* ---------- hero ---------- */

function StatusHero({ score, level, recent, logs, onNavigate }) {
  const hasData = score.level !== "none";
  const dates = [...new Set(recent.map((w) => w.date))];
  const lastWarning = dates.at(-1);
  const cleanDays = lastWarning
    ? new Set(logs.filter((l) => l.date > lastWarning).map((l) => l.date)).size
    : 0;

  const latestByType = {};
  const countByType = {};
  recent.forEach((w) => {
    latestByType[w.type] = w;
    countByType[w.type] = (countByType[w.type] || 0) + 1;
  });
  const causes = CAUSE_ORDER.filter((type) => latestByType[type]);

  let summary = "Save your first daily log to see your status.";
  if (hasData && score.count === 0) {
    summary = "No warnings in the last 7 days of data.";
  } else if (hasData) {
    const plural = score.count === 1 ? "" : "s";
    summary =
      dates.length === 1
        ? `${score.count} warning${plural}, all on ${formatShort(dates[0])}.`
        : `${score.count} warning${plural} across ${dates.length} days.`;
  }

  return (
    <section className={`home-card hero hero--${level}`} aria-labelledby="hero-title">
      <p className="eyebrow eyebrow--status">Current status</p>
      <h2 id="hero-title" className="hero__status">
        {hasData ? score.label : "No data yet"}
        {hasData && <span className="hero__dot" aria-hidden="true" />}
      </h2>
      <p className="hero__summary">{summary}</p>

      {score.count > 0 && cleanDays > 0 && (
        <p className="hero__recovery">
          <Icon name="check" size={18} strokeWidth={2.5} />
          No new warnings in the last {cleanDays} logged day
          {cleanDays === 1 ? "" : "s"}.
        </p>
      )}

      {causes.length > 0 && (
        <ul className="hero__causes">
          {causes.map((type) => (
            <li key={type} className="cause-chip">
              <span className="cause-chip__label">{CAUSE_LABEL[type]}</span>
              <span className="cause-chip__detail">
                {describeWarning(latestByType[type], logs)}
                {countByType[type] > 1 && ` · +${countByType[type] - 1} more`}
              </span>
            </li>
          ))}
        </ul>
      )}

      <div className="hero__actions">
        {hasData ? (
          <>
            <button type="button" className="btn btn--primary" onClick={() => onNavigate("trends")}>
              View trends
            </button>
            <button type="button" className="btn btn--ghost" onClick={() => onNavigate("hazards")}>
              Hazard guide
            </button>
          </>
        ) : (
          <button type="button" className="btn btn--primary" onClick={() => onNavigate("log")}>
            Log today
          </button>
        )}
      </div>
    </section>
  );
}

/* ---------- body status (astronaut) ---------- */

function spotState(spot, latest, recent) {
  if (spot.id === "aura") {
    const dose = toNumber(latest?.radiationDose);
    return dose === null
      ? { state: "none", text: "No data" }
      : { state: "ok", text: `${dose} mSv` };
  }
  if (!latest) return { state: "none", text: "No data" };
  const hadWarning = recent.some((w) => spot.types.includes(w.type));
  return hadWarning
    ? { state: "past", text: "Past warning" }
    : { state: "ok", text: "Within limit" };
}

function BodyStatus({ latest, recent }) {
  return (
    <section className="home-card body-status" aria-labelledby="body-title">
      <span className="hud hud--tl" aria-hidden="true" />
      <span className="hud hud--tr" aria-hidden="true" />
      <span className="hud hud--bl" aria-hidden="true" />
      <span className="hud hud--br" aria-hidden="true" />

      <p id="body-title" className="eyebrow">Body status</p>

      <svg
        className="body-status__svg"
        viewBox="-30 0 420 280"
        role="img"
        aria-label="Astronaut body map: mood and sleep at the head, heart rate at the chest, exercise at the legs, radiation around the body"
      >
        <ellipse cx="180" cy="140" rx="150" ry="58" className="body-status__orbit" transform="rotate(-12 180 140)" />

        <g className="body-status__float">
          <image
            href={astronautUrl}
            x="69"
            y="10"
            width="221.6"
            height="260"
            className="body-status__figure"
          />

          {SPOTS.map((spot) => {
            const { state, text } = spotState(spot, latest, recent);
            const leaderEnd = spot.anchor === "end" ? spot.lx + 6 : spot.lx - 6;
            const leaderStart = spot.anchor === "end" ? spot.x - 12 : spot.x + 12;
            return (
              <g key={spot.id} className={`spot spot--${state}`}>
                <line x1={leaderStart} y1={spot.y} x2={leaderEnd} y2={spot.ly - 4} className="spot__leader" />
                <circle cx={spot.x} cy={spot.y} r="11" className="spot__halo" />
                <circle cx={spot.x} cy={spot.y} r="5" className="spot__core" />
                <text x={spot.lx} y={spot.ly} textAnchor={spot.anchor} className="spot__label">
                  {spot.label}
                </text>
                <text x={spot.lx} y={spot.ly + 15} textAnchor={spot.anchor} className="spot__status">
                  {text}
                </text>
              </g>
            );
          })}
        </g>
      </svg>

      <ul className="body-status__legend">
        <li>
          <span className="legend-dot legend-dot--ok" aria-hidden="true" />
          Within limit now
        </li>
        <li>
          <span className="legend-dot legend-dot--past" aria-hidden="true" />
          Warning in last 7 days
        </li>
      </ul>
    </section>
  );
}

/* ---------- metric cards ---------- */

function Sparkline({ values, threshold, color }) {
  if (values.length < 2) {
    return <div className="sparkline" aria-hidden="true" />;
  }
  const min = Math.min(...values, threshold);
  const max = Math.max(...values, threshold);
  const span = max - min || 1;
  const x = (i) => (i / (values.length - 1)) * 100;
  const y = (v) => 28 - ((v - min) / span) * 24;
  const points = values.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");

  return (
    <svg className="sparkline" viewBox="0 0 100 32" preserveAspectRatio="none" aria-hidden="true">
      <line x1="0" x2="100" y1={y(threshold)} y2={y(threshold)} className="sparkline__limit" vectorEffect="non-scaling-stroke" />
      <polyline points={points} fill="none" style={{ stroke: color }} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

function MetricCards({ latest, week }) {
  return (
    <section className="metrics" aria-label="Today's metrics">
      {METRICS.map((m) => {
        const value = toNumber(latest?.[m.key]);
        const values = week.map((l) => toNumber(l[m.key])).filter((v) => v !== null);
        const avg = values.length ? values.reduce((a, b) => a + b, 0) / values.length : null;
        const outside = value !== null && m.outside(value);

        return (
          <article key={m.key} className="home-card metric-card">
            <div className="metric-card__head">
              <p className="eyebrow">{m.label}</p>
              {value !== null && (
                <span className={`tag ${outside ? "tag--outside" : "tag--within"}`}>
                  {outside ? "Outside" : "Within"}
                </span>
              )}
            </div>
            <div className="metric-card__body">
              <p className="metric-card__value">
                {value !== null ? formatNumber(value, m.decimals) : "—"}
                <span className="metric-card__unit">{m.unit}</span>
              </p>
              <Sparkline values={values} threshold={m.threshold} color={m.color} />
            </div>
            <p className="metric-card__caption">
              {avg !== null
                ? `Avg ${formatNumber(Number(avg.toFixed(m.decimals)), m.decimals)} ${m.unit}`
                : "No data"}{" "}
              · limit {m.limit}
            </p>
          </article>
        );
      })}
    </section>
  );
}

/* ---------- warnings ---------- */

function WarningsCard({ recent }) {
  const dates = [...new Set(recent.map((w) => w.date))];
  const title =
    recent.length === 0
      ? "Warnings"
      : dates.length === 1
        ? `Warnings · ${formatShort(dates[0])}`
        : "Warnings · last 7 days";

  return (
    <section className="home-card warnings-card" aria-labelledby="warnings-title">
      <div className="card-head">
        <h2 id="warnings-title" className="card-title">{title}</h2>
        {recent.length > 0 && (
          <span className="tag tag--neutral">
            {recent.length} past event{recent.length === 1 ? "" : "s"}
          </span>
        )}
      </div>

      {recent.length === 0 ? (
        <p className="empty">No warnings in the last 7 days. Keep it up.</p>
      ) : (
        <ul className="warnings-list">
          {recent.map((w, index) => (
            <li key={`${w.type}-${w.date}-${index}`} className="warning-item">
              <span className="warning-item__dot" aria-hidden="true" />
              <div>
                <p className="warning-item__name">
                  {WARNING_NAME[w.type] ?? w.message}
                  {dates.length > 1 && (
                    <span className="warning-item__date"> · {formatShort(w.date)}</span>
                  )}
                </p>
                <p className="warning-item__hazard">{w.hazard}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

/* ---------- consistency ---------- */

function ConsistencyCard({ logs }) {
  const logged = new Set(logs.map((l) => l.date));
  const today = todayKey();

  let cursor = logged.has(today) ? today : addDays(today, -1);
  let streak = 0;
  while (logged.has(cursor)) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }

  const days = Array.from({ length: 7 }, (_, i) => addDays(today, i - 6));
  const loggedThisWeek = days.filter((d) => logged.has(d)).length;

  return (
    <section className="home-card consistency" aria-labelledby="consistency-title">
      <p className="eyebrow">Consistency</p>
      <h2 id="consistency-title" className="consistency__streak">
        <span>{streak}</span>-day streak
      </h2>
      <p className="consistency__sub">{loggedThisWeek} of 7 days logged this week</p>

      <ol className="week-strip">
        {days.map((d) => {
          const isToday = d === today;
          const isLogged = logged.has(d);
          return (
            <li
              key={d}
              className={`day${isLogged ? " day--logged" : ""}${isToday ? " day--today" : ""}`}
            >
              <span className="day__name">{isToday ? "Today" : weekdayInitial(d)}</span>
              <span className="day__box" title={`${formatShort(d)}: ${isLogged ? "logged" : "not logged"}`}>
                {isLogged &&
                  (isToday ? (
                    <span className="day__dot" />
                  ) : (
                    <Icon name="check" size={16} strokeWidth={2.5} />
                  ))}
              </span>
              <span className="day__num">{parseLocalDate(d).getDate()}</span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

export default Home;