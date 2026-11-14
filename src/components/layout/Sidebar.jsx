import Icon from "../ui/Icon";
import { NAV_ITEMS } from "./navItems";

function Sidebar({ screen, onNavigate, demoMode, onToggleDemo }) {
  return (
    <aside className="side-nav">
      <div className="sidebar__brand">
        <span className="sidebar__logo" aria-hidden="true">
          <Icon name="rocket" size={18} />
        </span>
        <p className="sidebar__name">
          CrewCheck
          <span>Health monitor</span>
        </p>
      </div>

      <nav aria-label="Main">
        <ul className="sidebar__nav">
          {NAV_ITEMS.map((item) => {
            const isActive = screen === item.id;

            if (item.primary) {
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    className={`nav-cta${isActive ? " is-active" : ""}`}
                    onClick={() => onNavigate(item.id)}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <Icon name={item.icon} size={18} strokeWidth={2.5} />
                    {item.label}
                  </button>
                </li>
              );
            }

            return (
              <li key={item.id}>
                <button
                  type="button"
                  className={`nav-link${isActive ? " is-active" : ""}`}
                  onClick={() => onNavigate(item.id)}
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon name={item.icon} size={20} />
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Blina's demo toggle (PR #13), same markup and classes */}
      <div className="sidebar-demo">
        <button type="button" className="demo-btn" onClick={onToggleDemo} aria-pressed={demoMode}>
          {demoMode ? "🧪 Exit demo mode" : "🧪 Start demo mode"}
        </button>
        <small>
          {demoMode
            ? "Showing simulated data. Your own logs are not changed."
            : "Preview the app with simulated mission data."}
        </small>
      </div>
      <p className="sidebar__footer">
        Prototype thresholds, not medical diagnosis.
      </p>
    </aside>
  );
}

export default Sidebar;