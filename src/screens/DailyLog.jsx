import Icon from "../components/ui/Icon";
import { HEALTH_THRESHOLDS as T } from "../data/thresholds.js";
import { METRIC_TAGS } from "../data/metricTags.js";
import "../styles/log.css";

// Hazard hints come from metricTags.js (same text HazardTag shows),
// warning rules come from thresholds.js (same values the engine uses).
const hint = (key) =>
  METRIC_TAGS[key] ? `${METRIC_TAGS[key].text} (${METRIC_TAGS[key].hazard})` : "";

const WHY_ITEMS = [
  {
    key: "sleep",
    name: "Sleep",
    icon: "moon",
    color: "var(--color-sleep)",
    rule: `Warning: below ${T.sleep.belowHours} h for ${T.sleep.consecutiveDays} consecutive days`,
  },
  {
    key: "mood",
    name: "Mood",
    icon: "smile",
    color: "var(--color-mood)",
    rule: `Warning: ${T.mood.atOrBelow} or below on any day`,
  },
  {
    key: "exercise",
    name: "Exercise",
    icon: "activity",
    color: "var(--color-exercise)",
    rule: `Warning: below ${T.exercise.belowMinutes} min for ${T.exercise.consecutiveDays} consecutive days`,
  },
  {
    key: "heartRate",
    name: "Heart Rate",
    icon: "heart",
    color: "var(--color-heart)",
    rule: `Warning: above ${T.hr.aboveBpm} bpm at rest`,
  },
];

function NumberField({ id, label, name, value, onChange, unit, hint, step, min, placeholder, required = true }) {
  return (
    <div className="log-field">
      <label htmlFor={id} className="log-field__label">{label}</label>
      <div className="log-input">
        <input
          id={id}
          type="number"
          name={name}
          value={value}
          onChange={onChange}
          step={step}
          min={min}
          placeholder={placeholder}
          required={required}
        />
        {unit && <span className="log-input__unit">{unit}</span>}
      </div>
      {hint && <p className="log-field__hint">{hint}</p>}
    </div>
  );
}

function DailyLog({ formData, onChange, onSubmit }) {
  const mood = Number(formData.mood) || 3;
  const moodFill = `${((mood - 1) / 4) * 100}%`;

  return (
    <div className="log-layout">
      <form className="log-card" onSubmit={onSubmit} aria-labelledby="log-title">
        <div className="log-card__head">
          <div className="log-card__title-group">
            <span className="log-badge" aria-hidden="true">
              <Icon name="pen" size={20} />
            </span>
            <h2 id="log-title" className="log-card__title">Daily Log Entry</h2>
          </div>
          <p className="log-card__required">All fields required except radiation</p>
        </div>

        <div className="log-row">
          <div className="log-field">
            <label htmlFor="log-date" className="log-field__label">Date</label>
            <div className="log-input">
              <input
                id="log-date"
                type="date"
                name="date"
                value={formData.date}
                onChange={onChange}
                required
              />
              <span className="log-input__icon" aria-hidden="true">
                <Icon name="calendar" size={18} />
              </span>
            </div>
            <p className="log-field__hint">Defaults to today (local time).</p>
          </div>

          <NumberField
            id="log-sleep"
            label="Sleep Hours"
            name="sleep"
            step="0.1"
            value={formData.sleep}
            onChange={onChange}
            unit="hours"
            hint={hint("sleep")}
          />
        </div>

        <div className="log-field log-mood">
          <div className="log-mood__head">
            <label htmlFor="log-mood" className="log-field__label">Mood</label>
            <span className="log-mood__value">{mood} / 5</span>
          </div>
          <input
            id="log-mood"
            className="log-mood__range"
            type="range"
            min="1"
            max="5"
            name="mood"
            value={formData.mood}
            onChange={onChange}
            style={{ "--fill": moodFill }}
          />
          <div className="log-mood__ticks" aria-hidden="true">
            {[1, 2, 3, 4, 5].map((n) => (
              <span key={n} className={`log-mood__tick${n === mood ? " is-current" : ""}`}>
                <strong>{n}</strong>
                {n === 1 && <span>Very low</span>}
                {n === 5 && <span>Great</span>}
              </span>
            ))}
          </div>
          <p className="log-field__hint">{hint("mood")}</p>
        </div>

        <div className="log-row">
          <NumberField
            id="log-exercise"
            label="Exercise (Minutes)"
            name="exercise"
            value={formData.exercise}
            onChange={onChange}
            unit="min"
            hint={hint("exercise")}
          />
          <NumberField
            id="log-hr"
            label="Heart Rate (BPM)"
            name="heartRate"
            value={formData.heartRate}
            onChange={onChange}
            unit="bpm"
            hint={`Measured at rest. ${hint("heartRate")}`}
          />
        </div>

        <NumberField
          id="log-radiation"
          label="Daily Radiation Dose (mSv) · Optional"
          name="radiationDose"
          step="0.01"
          min="0"
          value={formData.radiationDose}
          onChange={onChange}
          unit="mSv"
          placeholder="Enter radiation dose (optional)"
          required={false}
          hint="Records daily radiation exposure for monitoring purposes. Values are recorded in millisieverts (mSv)."
        />

        <div className="log-card__spacer" />

        <button type="submit" className="log-submit">Save Daily Log</button>
      </form>

      <div className="log-side">
        <section className="log-why" aria-labelledby="why-title">
          <h2 id="why-title" className="log-why__title">Why we track these</h2>
          {WHY_ITEMS.map((item) => (
            <div key={item.key} className="log-why__item" style={{ "--metric": item.color }}>
              <span className="log-why__icon" aria-hidden="true">
                <Icon name={item.icon} size={19} />
              </span>
              <div>
                <p className="log-why__name">{item.name}</p>
                <p className="log-why__hazard">{METRIC_TAGS[item.key]?.hazard}</p>
                <p className="log-why__rule">{item.rule}</p>
              </div>
            </div>
          ))}
        </section>

        <p className="log-note">
          <Icon name="info" size={18} />
          Prototype monitoring thresholds, not medical diagnosis.
        </p>
      </div>
    </div>
  );
}

export default DailyLog;