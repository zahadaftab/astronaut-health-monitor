import { HEALTH_THRESHOLDS as T } from "../data/thresholds.js";
import { parseLocalDate, toDateKey } from "../utils/dates.js";
import "../styles/history.css";

/* ---------- Display config (rules read from thresholds.js) ---------- */

const METRICS = [
  {
    key: "sleep",
    label: "Sleep",
    color: "var(--color-sleep, #a9b4f5)",
    isOutside: (v) => v < T.sleep.belowHours,
    format: (v) => `${v} h`,
    formatAvg: (v) => `${v.toFixed(1)} h`,
  },
  {
    key: "mood",
    label: "Mood",
    color: "var(--color-mood, #c4b5fd)",
    isOutside: (v) => v <= T.mood.atOrBelow,
    format: (v) => `${v} / 5`,
    formatAvg: (v) => `${v.toFixed(1)} / 5`,
  },
  {
    key: "exercise",
    label: "Exercise",
    color: "var(--color-exercise, #5eead4)",
    isOutside: (v) => v < T.exercise.belowMinutes,
    format: (v) => `${v} min`,
    formatAvg: (v) => `${Math.round(v)} min`,
  },
  {
    key: "heartRate",
    label: "Heart rate",
    color: "var(--color-heart, #ff6b6b)",
    isOutside: (v) => v > T.hr.aboveBpm,
    format: (v) => `${v} bpm`,
    formatAvg: (v) => `${Math.round(v)} bpm`,
  },
];

const RADIATION = {
  key: "radiationDose",
  label: "Radiation",
  color: "var(--color-radiation, #2dd4bf)",
  isOutside: (v) => v > T.radiation.aboveMsv,
  format: (v) => `${v} mSv`,
};

/* ---------- Helpers (display only) ---------- */

const hasValue = (v) => v !== undefined && v !== null && v !== "";

// Local date key, so "2026-11-14" never shows as Nov 13 (UTC shift)
const keyOf = (value) => toDateKey(parseLocalDate(String(value).slice(0, 10)));

function shiftKey(key, days) {
  const date = parseLocalDate(key);
  date.setDate(date.getDate() + days);
  return toDateKey(date);
}

const formatLong = (key) =>
  parseLocalDate(key).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const formatWeekday = (key) =>
  parseLocalDate(key).toLocaleDateString("en-US", { weekday: "long" });

const average = (list) =>
  list.length ? list.reduce((a, b) => a + b, 0) / list.length : null;

/* ---------- Small parts ---------- */

function ValueChip({ metric, value }) {
  if (!hasValue(value)) return <span className="history-dash">—</span>;
  const flagged = metric.isOutside(Number(value));
  return (
    <span
      className={`value-chip${flagged ? " is-flagged" : ""}`}
      style={{ "--metric": metric.color }}
    >
      {metric.format(value)}
      {flagged && <span className="history-sr"> (outside limit)</span>}
    </span>
  );
}

function StatusChip({ count, watch }) {
  if (count > 0) {
    return (
      <span className="status-tag status-tag--alert">
        {count} warning{count === 1 ? "" : "s"}
      </span>
    );
  }
  if (watch) return <span className="status-tag status-tag--watch">Watch</span>;
  return <span className="status-tag status-tag--ok">Normal</span>;
}

/* ---------- Screen ---------- */

function History({ logs = [], warnings = [], onDelete }) {
  if (logs.length === 0) {
    return (
      <section className="history-card">
        <h2 className="history-card__title">Mission History</h2>
        <p className="history-empty">
          No logs saved yet. Your daily check-ins will appear here.
        </p>
      </section>
    );
  }

  // Group the team's warnings (checkHealthWarnings) by day
  const warningsByDay = new Map();
  warnings.forEach((w) => {
    const key = keyOf(w.date);
    warningsByDay.set(key, [...(warningsByDay.get(key) ?? []), w]);
  });

  // Newest first; same-day logs keep their save order
  const rows = logs
    .map((log, index) => ({ log, index, key: keyOf(log.date) }))
    .sort((a, b) => b.key.localeCompare(a.key) || b.index - a.index);

  // "This week" = 7 days ending at the latest log (same window as Home)
  const latestKey = rows[0].key;
  const weekKeys = new Set(Array.from({ length: 7 }, (_, i) => shiftKey(latestKey, -i)));
  const weekRows = rows.filter((r) => weekKeys.has(r.key));
  const daysLogged = new Set(weekRows.map((r) => r.key)).size;

  const allDays = new Set(rows.map((r) => r.key));
  let streak = 0;
  while (allDays.has(shiftKey(latestKey, -streak))) streak += 1;

  const weekWarnings = warnings.filter((w) => weekKeys.has(keyOf(w.date)));

  const mostFlagged = [...new Set(weekRows.map((r) => r.key))]
    .map((key) => ({ key, items: warningsByDay.get(key) ?? [] }))
    .sort((a, b) => b.items.length - a.items.length || b.key.localeCompare(a.key))[0];

  const averages = METRICS.map((m) => ({
    ...m,
    avg: average(
      weekRows.map((r) => r.log[m.key]).filter(hasValue).map(Number),
    ),
  }));

  return (
    <div className="history">
      {/* ---------- Table ---------- */}
      <section className="history-card" aria-labelledby="history-title">
        <header className="history-card__head">
          <h2 id="history-title" className="history-card__title">
            Mission History
          </h2>
          <span className="history-count">
            {logs.length} log{logs.length === 1 ? "" : "s"}
          </span>
        </header>

        <div className="history-table-wrap">
          <table className="history-table">
            <caption className="history-sr">
              All saved daily logs, newest first
            </caption>
            <thead>
              <tr>
                <th scope="col">Date</th>
                {METRICS.map((m) => (
                  <th key={m.key} scope="col">{m.label}</th>
                ))}
                <th scope="col">Radiation</th>
                <th scope="col">Status</th>
                {onDelete && (
                  <th scope="col">
                    <span className="history-sr">Actions</span>
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {rows.map(({ log, index, key }) => {
                const dayWarnings = warningsByDay.get(key) ?? [];
                const watch = [...METRICS, RADIATION].some(
                  (m) => hasValue(log[m.key]) && m.isOutside(Number(log[m.key])),
                );
                return (
                  <tr key={`${key}-${index}`}>
                    <th scope="row" data-label="Date">
                      <span className="history-date">{formatLong(key)}</span>
                      <span className="history-weekday">{formatWeekday(key)}</span>
                    </th>
                    {METRICS.map((m) => (
                      <td key={m.key} data-label={m.label}>
                        <ValueChip metric={m} value={log[m.key]} />
                      </td>
                    ))}
                    <td data-label="Radiation">
                      <ValueChip metric={RADIATION} value={log.radiationDose} />
                    </td>
                    <td data-label="Status">
                      <StatusChip count={dayWarnings.length} watch={watch} />
                    </td>
                    {onDelete && (
                      <td data-label="Actions">
                        <button
                          type="button"
                          className="history-delete"
                          onClick={() => onDelete(log.date)}
                          aria-label={`Delete log for ${formatLong(key)}`}
                        >
                          Delete
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <p className="history-note">
          <span className="history-note__ring" aria-hidden="true" />
          Outlined values cross a warning threshold. Warnings are counted on
          the day the rule is met.
        </p>
      </section>

      {/* ---------- This week ---------- */}
      <aside className="history-card history-week" aria-labelledby="week-title">
        <h2 id="week-title" className="history-card__title">This week</h2>

        <div className="week-stats">
          <div className="week-stat week-stat--accent">
            <strong>{daysLogged}/7</strong>
            <span>days logged</span>
          </div>
          <div className="week-stat week-stat--accent">
            <strong>{streak}</strong>
            <span>day streak</span>
          </div>
          <div className={`week-stat${weekWarnings.length ? " week-stat--alert" : ""}`}>
            <strong>{weekWarnings.length}</strong>
            <span>warning{weekWarnings.length === 1 ? "" : "s"}</span>
          </div>
        </div>

        <p className="week-eyebrow">7-day averages</p>
        <ul className="week-averages">
          {averages.map((m) => (
            <li key={m.key} style={{ "--metric": m.color }}>
              <span className="week-averages__dot" aria-hidden="true" />
              <span className="week-averages__label">{m.label}</span>
              <span className="week-averages__value">
                {m.avg === null ? "—" : m.formatAvg(m.avg)}
              </span>
            </li>
          ))}
        </ul>

        <div className="week-flagged">
          <p className="week-flagged__title">Most flagged day</p>
          {mostFlagged && mostFlagged.items.length > 0 ? (
            <>
              <p className="week-flagged__day">{formatLong(mostFlagged.key)}</p>
              <ul className="week-flagged__list">
                {mostFlagged.items.map((w, i) => (
                  <li key={`${w.type}-${i}`}>
                    {w.message}
                    {w.hazard && <span> · {w.hazard}</span>}
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="week-flagged__day">No warnings in the last 7 days.</p>
          )}
        </div>
      </aside>
    </div>
  );
}

export default History;