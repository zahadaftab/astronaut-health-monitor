import { useRef, useState } from "react";
import Icon from "../components/ui/Icon";
import {
  hazards,
  HAZARD_METRICS,
  STATUS,
  evaluateHazard,
} from "../components/SpaceContext.jsx";
import "../styles/hazards.css";

/* Hazards screen (new UI). All rules and statuses come from SpaceContext.jsx;
   this file only adds display text, icons and layout. */

const HAZARD_DETAILS = {
  radiation: {
    name: "Space Radiation",
    icon: "radiation",
    short: "Solar particle events and cosmic rays",
    description:
      "Beyond Earth's protective magnetic field, crews are exposed to solar particle events and galactic cosmic rays.",
  },
  isolation: {
    name: "Isolation & Confinement",
    icon: "user",
    short: "Small crews, confined habitats, little contact",
    description:
      "Long missions mean small crews, confined habitats and limited contact with Earth. Over time this can affect mood, sleep, cognition and teamwork.",
  },
  distance: {
    name: "Distance from Earth",
    icon: "globe",
    short: "Comm delays and no quick return home",
    description:
      "Far from Earth, communication can be delayed by up to 20 minutes one way and there is no quick return, so crews must handle health decisions on their own.",
  },
  gravity: {
    name: "Gravity Fields",
    icon: "gravity",
    short: "Weightlessness and partial gravity",
    description:
      "Crews move between weightlessness, partial gravity and Earth gravity. Each transition affects bones, muscles, the heart, balance and coordination.",
  },
  environment: {
    name: "Hostile & Closed Environments",
    icon: "wind",
    short: "Cabin air, noise, light and temperature",
    description:
      "Cabin air, noise, light, temperature and living space all have to mimic Earth to keep the crew healthy and productive.",
  },
};

const METRIC_LABELS = {
  radiationDose: { label: "Radiation dose", icon: "radiation" },
  mood: { label: "Mood", icon: "smile" },
  sleep: { label: "Sleep", icon: "moon" },
  exercise: { label: "Exercise", icon: "activity" },
  heartRate: { label: "Heart rate", icon: "heart" },
};

// Card tint per hazard (display only; status colors stay on the chip)
const HAZARD_THEME = {
  radiation: "#2dd4bf",
  isolation: "#c4b5fd",
  distance: "#93c5fd",
  gravity: "#f9a8d4",
  environment: "#fdba74",
};

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* 3D tilt card. The pointer only updates CSS variables on the element,
   so moving the mouse never re-renders React. */
function HazardCard({ hazard, info, level, isActive, onSelect }) {
  const ref = useRef(null);

  const handleMove = (e) => {
    if (e.pointerType !== "mouse") return;
    const el = ref.current;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.setProperty("--rx", `${((0.5 - py) * 14).toFixed(2)}deg`);
    el.style.setProperty("--ry", `${((px - 0.5) * 14).toFixed(2)}deg`);
    el.style.setProperty("--mx", `${(px * 100).toFixed(1)}%`);
    el.style.setProperty("--my", `${(py * 100).toFixed(1)}%`);
  };

  const handleLeave = () => {
    const el = ref.current;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  };

  return (
    <button
      ref={ref}
      type="button"
      className={`hazard-card${isActive ? " is-active" : ""}`}
      style={{ "--theme": HAZARD_THEME[hazard.id] }}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      onClick={() => onSelect(hazard.id)}
      aria-pressed={isActive}
    >
      <svg className="hazard-card__dots" viewBox="0 0 100 100" aria-hidden="true">
        <defs>
          <pattern id={`dots-${hazard.id}`} width="14" height="14" patternUnits="userSpaceOnUse">
            <circle cx="7" cy="7" r="1.2" fill="currentColor" />
          </pattern>
        </defs>
        <rect width="100" height="100" fill={`url(#dots-${hazard.id})`} />
      </svg>
      <svg className="hazard-card__square" viewBox="0 0 100 100" aria-hidden="true">
        <rect x="20" y="20" width="60" height="60" rx="8" />
        <rect x="35" y="35" width="30" height="30" rx="4" />
      </svg>

      <span className="hazard-card__top">
        <span className="hazard-card__icon" aria-hidden="true">
          <Icon name={info.icon} size={22} />
        </span>
        <span className={`status-chip status-chip--${level}`}>
          <span className="status-chip__dot" aria-hidden="true" />
          {STATUS[level].label}
        </span>
      </span>

      <span className="hazard-card__body">
        <span className="hazard-card__name">{hazard.label}</span>
        <span className="hazard-card__short">{info.short}</span>
        <span className="hazard-card__more" aria-hidden="true">
          <span className="hazard-card__line" />
          {isActive ? "Showing details" : "View details"}
        </span>
      </span>
    </button>
  );
}

// Reads the team's HAZARD_METRICS map. Distance is driven by logging consistency.
function trackedItems(id) {
  if (id === "distance") {
    return [{ label: "Logging consistency", icon: "calendar" }];
  }
  const items = HAZARD_METRICS[id].map((key) => METRIC_LABELS[key]).filter(Boolean);
  return items.length > 0
    ? items
    : [{ label: "Not tracked by daily logs", icon: "info" }];
}

function Hazards({ logs = [], onStartLog }) {
  const [activeId, setActiveId] = useState(hazards[0].id);
    const detailRef = useRef(null);

  // On phones the detail panel sits below the cards, so bring it into view.
  const selectHazard = (id) => {
    setActiveId(id);
    if (window.matchMedia("(max-width: 899px)").matches) {
      detailRef.current?.scrollIntoView({
        behavior: prefersReducedMotion() ? "auto" : "smooth",
        block: "start",
      });
    }
  };
  const active = hazards.find((h) => h.id === activeId);

  // Oldest to newest so "recent" always means the latest entries
  const sortedLogs = [...logs].sort(
    (a, b) => new Date(a.date) - new Date(b.date),
  );

  const statuses = {};
  hazards.forEach((h) => {
    statuses[h.id] = evaluateHazard(h.id, sortedLogs);
  });

  const activeStatus = statuses[active.id];
  const activeStyle = STATUS[activeStatus.level];
  const details = HAZARD_DETAILS[active.id];

  return (
    <div className="hazards">
            <div className="hazard-tiles" role="group" aria-label="Five hazards of spaceflight">
        {hazards.map((hazard) => (
          <HazardCard
            key={hazard.id}
            hazard={hazard}
            info={HAZARD_DETAILS[hazard.id]}
            level={statuses[hazard.id].level}
            isActive={hazard.id === activeId}
            onSelect={selectHazard}
          />
        ))}
      </div>
      {/*}
      <div className="hazard-tiles" role="group" aria-label="Five hazards of spaceflight">
        {hazards.map((hazard) => {
          const isActive = hazard.id === activeId;
          const level = statuses[hazard.id].level;
          const info = HAZARD_DETAILS[hazard.id];
          return (
            <button
              key={hazard.id}
              type="button"
              className={`hazard-tile${isActive ? " is-active" : ""}`}
              onClick={() => setActiveId(hazard.id)}
              aria-pressed={isActive}
            >
              <span className="hazard-tile__icon" aria-hidden="true">
                <Icon name={info.icon} size={20} />
              </span>
              <span className="hazard-tile__name">{hazard.label}</span>
              <span className="hazard-tile__short">{info.short}</span>
              <span className={`status-chip status-chip--${level}`}>
                <span className="status-chip__dot" aria-hidden="true" />
                {STATUS[level].label}
              </span>
            </button>
          );
        })}
      </div>
      */}

      <div className="hazards__row">
        <section ref={detailRef} className="hazard-detail" aria-labelledby="hazard-title" aria-live="polite">
          <div className="hazard-detail__head">
            <span className="hazard-detail__icon" aria-hidden="true">
              <Icon name={details.icon} size={30} />
            </span>
            <div className="hazard-detail__titles">
              <p className="hazard-eyebrow hazard-eyebrow--accent">Active hazard</p>
              <h2 id="hazard-title" className="hazard-detail__title">{details.name}</h2>
            </div>
            <span className={`status-chip status-chip--${activeStatus.level} status-chip--lg`}>
              <span className="status-chip__dot" aria-hidden="true" />
              {activeStyle.label}
            </span>
          </div>

          <p className="hazard-detail__description">{details.description}</p>

          <div className="hazard-section">
            <p className="hazard-eyebrow">What to watch</p>
            <ul className="hazard-bullets">
              {active.points.map((point, index) => (
                <li key={index}>{point}</li>
              ))}
            </ul>
          </div>

          <div className="hazard-section">
            <p className="hazard-eyebrow">Your recent data</p>
            <ul className="hazard-notes">
              {activeStatus.notes.map((note, index) => (
                <li key={index}>{note}</li>
              ))}
            </ul>
          </div>

          <div className="hazard-section">
            <p className="hazard-eyebrow">Tracked in your daily log</p>
            <ul className="hazard-chips">
              {trackedItems(active.id).map((item) => (
                <li key={item.label} className="hazard-chip">
                  <Icon name={item.icon} size={16} />
                  {item.label}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <aside className="hazards__side">
          {onStartLog && (
            <section className="hazard-cta" aria-labelledby="cta-title">
              <h2 id="cta-title" className="hazard-cta__title">Ready for today&apos;s check-in?</h2>
              <p className="hazard-cta__text">
                Log sleep, mood, exercise and heart rate. It takes less than a minute.
              </p>
              <button type="button" className="hazard-cta__button" onClick={onStartLog}>
                Start daily log
              </button>
            </section>
          )}

          <section className="hazard-list" aria-labelledby="all-hazards-title">
            <h2 id="all-hazards-title" className="hazard-list__title">All five hazards</h2>
            <ul className="hazard-list__items">
              {hazards.map((hazard) => {
                const info = HAZARD_DETAILS[hazard.id];
                const level = statuses[hazard.id].level;
                const isActive = hazard.id === activeId;
                return (
                  <li key={hazard.id}>
                    <button
                      type="button"
                      className={`hazard-row${isActive ? " is-active" : ""}`}
                      onClick={() => setActiveId(hazard.id)}
                      aria-pressed={isActive}
                    >
                      <span className="hazard-row__icon" aria-hidden="true">
                        <Icon name={info.icon} size={16} />
                      </span>
                      <span className="hazard-row__text">
                        <span className="hazard-row__name">{info.name}</span>
                        <span className="hazard-row__tracked">
                          {trackedItems(hazard.id).map((t) => t.label).join(" · ")}
                        </span>
                      </span>
                      <span className={`status-chip status-chip--${level} status-chip--dot-only`} title={STATUS[level].label}>
                        <span className="status-chip__dot" aria-hidden="true" />
                        <span className="visually-hidden">{STATUS[level].label}</span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
            <p className="hazard-list__source">
              Source: NASA Human Research Program — Five Hazards of Human Spaceflight.
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
}

export default Hazards;
