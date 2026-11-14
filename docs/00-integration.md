# 00 — How the new UI plugs into the app

The step 20 redesign is now **the only UI**. `App.jsx` holds the data and handlers; everything you see lives in `CrewCheckApp.jsx`, `src/screens/` and `src/styles/`. The old layout (`USE_NEW_UI` switch, `App.css`, `MetricsCharts`, `HealthScoreCard`, `HazardTag`) was removed after PR #20.

## Structure

| File | Owner | Role |
|---|---|---|
| `src/App.jsx` | Team | State, handlers, demo mode. Renders `<CrewCheckApp>` and nothing else |
| `src/CrewCheckApp.jsx` | UI | New shell: sidebar, bottom nav, header, screens. Presentation only |
| `src/screens/*` | UI | Home, Hazards, Daily Log, Trends, History |
| `src/components/layout/*`, `src/components/ui/Icon.jsx` | UI | Navigation and icons |
| `src/components/TrendCharts.jsx` | UI | Charts used by Trends |
| `src/styles/*.css` | UI | Design tokens, layout and one stylesheet per screen |
| `src/utils/dates.js` | UI | Local-date helpers for display |
| `src/assets/astronaut.svg` | UI | Body Status illustration |

## How App.jsx connects

`App.jsx` passes its own values to `<CrewCheckApp>`: `logs`, `savedLogs`, `warnings`, `formData`, `handleChange`, `handleSubmit`, a delete handler (`saveLogs(savedLogs.filter(...))`), `demoMode` and `DEMO_LABEL`.

`SpaceContext.jsx` exports `hazards`, `HAZARD_METRICS`, `METRICS`, `STATUS` and `evaluateHazard`, so the Hazards screen reuses the same rules.

## Adding a feature

- **Logic** (rules, storage, new handlers): change `App.jsx` / `utils` / `data` as usual, then pass the new value or handler to `<CrewCheckApp>` if the new UI should show it.
- **UI**: change the screen in `src/screens/` and its stylesheet in `src/styles/`.

## CSS notes

- `App.css` was removed. Base styles (`*`, `body`), the small `.card` notice and the demo-mode classes (`.demo-btn`, `.demo-banner`, `.sidebar-demo`) now live in `layout.css`.
- Each screen has its own stylesheet in `src/styles/`, using the tokens in `tokens.css`.
