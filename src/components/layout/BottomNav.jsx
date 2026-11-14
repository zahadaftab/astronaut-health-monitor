import Icon from "../ui/Icon";
import { NAV_ITEMS } from "./navItems";

function BottomNav({ screen, onNavigate }) {
  return (
    <nav className="bottom-nav" aria-label="Main">
      <ul className="bottom-nav__list">
        {NAV_ITEMS.map((item) => {
          const isActive = screen === item.id;

          if (item.primary) {
            return (
              <li key={item.id} className="bottom-nav__fab-slot">
                <button
                  type="button"
                  className={`bottom-nav__fab${isActive ? " is-active" : ""}`}
                  onClick={() => onNavigate(item.id)}
                  aria-label={item.label}
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon name={item.icon} size={26} strokeWidth={2.5} />
                </button>
              </li>
            );
          }

          return (
            <li key={item.id}>
              <button
                type="button"
                className={`bottom-nav__item${isActive ? " is-active" : ""}`}
                onClick={() => onNavigate(item.id)}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon name={item.icon} size={22} />
                <span>{item.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default BottomNav;