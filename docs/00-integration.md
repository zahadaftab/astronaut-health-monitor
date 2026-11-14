# 00 — How the new UI plugs into the app

The step 20 redesign lives in its own files and plugs into `App.jsx` without changing its logic. The goal: teammates can make changes to the logic and their own JSX without merge conflicts with the UI.

## Structure

| File | Owner | Role |
|---|---|---|
| `src/App.jsx` | Team | State, handlers, demo mode, original layout. **Unchanged** except for the block below |
| `src/CrewCheckApp.jsx` | UI | New shell: sidebar, bottom nav, header, screens. Presentation only |
| `src/screens/*` | UI | Home, Hazards, Daily Log, Trends, History |
| `src/components/layout/*`, `src/components/ui/Icon.jsx` | UI | Navigation and icons |
| `src/components/TrendCharts.jsx` | UI | Restyled charts used by Trends (`MetricsCharts.jsx` stays as the team left it) |
| `src/styles/*.css` | UI | Design tokens, layout and one stylesheet per screen |
| `src/utils/dates.js` | UI | Local-date helpers for display |
| `src/assets/astronaut.svg` | UI | Body Status illustration |

## What was added to team files (additions only)

- **`App.jsx`:** an import, `const USE_NEW_UI = true;`, and an `if (USE_NEW_UI) return <CrewCheckApp … />` block **before** the original `return`. It passes the team's own values: `logs`, `savedLogs`, `warnings`, `formData`, `handleChange`, `handleSubmit`, the same delete logic (`saveLogs(savedLogs.filter(...))`), `demoMode` and `DEMO_LABEL`.
- **`SpaceContext.jsx`:** one line at the end that exports `hazards`, `HAZARD_METRICS`, `METRICS`, `STATUS` and `evaluateHazard`, so the Hazards screen reuses the same rules.
- **`index.html`:** one font link (Inter, Space Grotesk, and Orbitron for the App.css theme) and the page title.

## Switching layouts

Set `USE_NEW_UI = false` in `App.jsx` to see the original sidebar layout (PR #15) with exactly the same data. Useful to compare, or if a new feature lands in the original JSX before it has a new-UI version.

## Adding a feature

- **Logic** (rules, storage, new handlers): change `App.jsx` / `utils` / `data` as usual, then pass the new value or handler to `<CrewCheckApp>` if the new UI should show it.
- **UI**: change the screen in `src/screens/` and its stylesheet in `src/styles/`.

## CSS notes

- `App.css` (PR #17) is kept. The new sidebar uses the class `.side-nav` so it never collides with `.sidebar` from App.css.
- `App.css` sets global styles on `h1`, `h2`, `label` and inputs. Screen styles use class selectors, which win. `layout.css` removes the `h1` glow inside `.app-shell`.
- Demo mode reuses Blina's classes: `.demo-btn`, `.demo-banner`, `.sidebar-demo`.
