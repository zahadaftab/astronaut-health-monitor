import { useState } from "react";
import Sidebar from "./components/layout/Sidebar";
import BottomNav from "./components/layout/BottomNav";
import { NAV_ITEMS } from "./components/layout/navItems";
import Home from "./screens/Home";
import Hazards from "./screens/Hazards";
import DailyLog from "./screens/DailyLog";
import Trends from "./screens/Trends";
import History from "./screens/History";
import { todayKey } from "./utils/dates.js";

/* New UI shell (step 20). Presentation only:
   every piece of data and every handler comes from App.jsx, unchanged. */

const TODAY_LABEL = new Date().toLocaleDateString("en-US", {
  weekday: "long",
  month: "short",
  day: "numeric",
  year: "numeric",
});

function CrewCheckApp({
  logs,
  savedLogs,
  warnings,
  formData,
  onChange,
  onSubmit,
  onDelete,
  demoMode,
  demoLabel,
  onToggleDemo,
}) {
  // First visit opens the hazards briefing; after that, the overview.
  const [screen, setScreen] = useState(() =>
    savedLogs.length > 0 ? "home" : "hazards",
  );

  const loggedToday = savedLogs.some((log) => log.date === todayKey());

  const navigate = (nextScreen) => {
    setScreen(nextScreen);
    window.scrollTo({ top: 0 });
  };

  // App's handleSubmit does the saving; the UI only moves back to the overview.
  const handleSubmit = (e) => {
    onSubmit(e);
    navigate("home");
  };

  const pageTitle = NAV_ITEMS.find((item) => item.id === screen)?.title;

  return (
    <div className="app-shell">
      <div className="app-frame">
        <Sidebar
          screen={screen}
          onNavigate={navigate}
          demoMode={demoMode}
          onToggleDemo={onToggleDemo}
        />

        <main className="app-main">
          {demoMode && (
            <div className="demo-banner" role="status">
              🧪 {demoLabel}
            </div>
          )}

          <header className="page-header">
            <div>
              <p className="page-header__eyebrow">{pageTitle}</p>
              <div className="page-header__row">
                <h1 className="page-header__title">{pageTitle}</h1>
                <p className="page-header__subtitle">CrewCheck · {TODAY_LABEL}</p>
              </div>
            </div>
            <div className="page-header__actions">
              <button
                type="button"
                className="demo-btn demo-btn--mobile"
                onClick={onToggleDemo}
                aria-pressed={demoMode}
              >
                {demoMode ? "🧪 Exit demo" : "🧪 Demo"}
              </button>
              {loggedToday ? (
                <span className="status-pill">
                  <span className="status-pill__dot" aria-hidden="true" />
                  Today&apos;s log saved
                </span>
              ) : (
                <button
                  type="button"
                  className="status-pill"
                  onClick={() => navigate("log")}
                >
                  Log today
                </button>
              )}
            </div>
          </header>

          <div className="page-content">
            {screen === "home" && (
              <Home logs={logs} warnings={warnings} onNavigate={navigate} />
            )}

            {screen === "hazards" && (
              <Hazards logs={logs} onStartLog={() => navigate("log")} />
            )}

            {screen === "log" &&
              (demoMode ? (
                // Same notice as the Log section in App.jsx (demo mode, PR #13)
                <div className="card">
                  <h2>Demo mode is on</h2>
                  <p>
                    Logging is turned off while simulated data is shown. Exit demo
                    mode to add your own log.
                  </p>
                </div>
              ) : (
                <DailyLog
                  formData={formData}
                  onChange={onChange}
                  onSubmit={handleSubmit}
                />
              ))}

            {screen === "trends" && <Trends logs={logs} />}

            {screen === "history" && (
              <>
                <History
                  logs={logs}
                  warnings={warnings}
                  onDelete={demoMode ? undefined : onDelete}
                />

                {/* Same markup as the Alerts section in App.jsx (PR #15) */}
                <div className="card">
                  <h2>Health Warnings</h2>
                  {warnings.length === 0 ? (
                    <p>No health warnings detected.</p>
                  ) : (
                    <ul>
                      {warnings.map((warning, index) => (
                        <li key={index}>
                          <strong>{warning.type.toUpperCase()}</strong> —{" "}
                          {warning.message} ({warning.date})
                          <br />
                          <small>
                            ⚠️ Hazard: {warning.hazard} — {warning.risk}
                          </small>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </>
            )}
          </div>
        </main>
      </div>

      <BottomNav screen={screen} onNavigate={navigate} />
    </div>
  );
}

export default CrewCheckApp;
