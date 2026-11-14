# Home screen (Overview)

The Home screen is the first thing an astronaut sees after logging. It answers one question at a glance: **"How am I doing, and why?"** It shows the current health status, what caused it, the latest value of each metric, recent warnings and logging consistency.

> **Scope of this redesign:** UI only. All health logic is reused as is: `checkHealthWarnings()`, `getHealthScore()` and `HEALTH_THRESHOLDS`. No rule, threshold or storage behavior was changed.

## Files

| File | Purpose |
|---|---|
| `src/screens/Home.jsx` | The Home screen and its sections (status hero, body status, metric cards, warnings, consistency). |
| `src/styles/home.css` | Styles for the Home screen. |
| `src/styles/tokens.css` | Design tokens: colors, typography, spacing, radius, motion. Every value in the UI comes from here. |
| `src/styles/layout.css` | App shell: sidebar (desktop), bottom bar (mobile), page header. |
| `src/utils/dates.js` | Display helpers that read `"YYYY-MM-DD"` as a **local** date, so dates never shift by one day in time zones behind UTC. |
| `src/components/ui/Icon.jsx` | Inline SVG icons (paths adapted from Lucide, ISC License). No new dependencies. |
| `src/components/layout/` | `Sidebar.jsx`, `BottomNav.jsx` and `navItems.js` (single source for navigation). |

`App.jsx` still owns the data: `savedLogs` (from `localStorage["astronautLogs"]`) and `warnings` (from `checkHealthWarnings(savedLogs)`). Home receives them as props:

```jsx
<Home logs={savedLogs} warnings={warnings} onNavigate={navigate} />
```

## Sections

### 1. Current status (hero)

The main element of the page.

- **Status label** (`Healthy`, `Caution`, `Critical`, `No data yet`) comes from `getHealthScore(warnings, logs)`. Same calculation the old `HealthScoreCard` used.
- **Summary sentence** is built from the warnings inside the 7-day window, e.g. *"4 warnings, all on Nov 11."*
- **Recovery line** appears when there were warnings and later logs have none: *"No new warnings in the last 3 logged days."*
- **Cause chips** show one chip per warning type (Sleep, Exercise, Mood, Resting HR) with a short explanation, e.g. *"Under 7 h for 3 nights (Nov 9–11)"* or *"104 bpm on Nov 11"*. Numbers come from the logs and `HEALTH_THRESHOLDS`.
- **Actions:** `View trends` and `Hazard guide`. With no data, a single `Log today` button.

Color follows the status: red for Critical, amber for Caution, teal for Healthy.

### 2. Body status (astronaut)

An original SVG astronaut with four hotspots:

| Hotspot | Metrics | Hazard |
|---|---|---|
| Head | Mood, Sleep | Isolation & Confinement |
| Chest | Heart rate | Altered Gravity |
| Legs | Exercise | Altered Gravity |
| Aura | Radiation dose | Space Radiation |

Each hotspot shows **Within limit** (solid teal), **Past warning** (dashed violet, a warning in the last 7 days) or **No data**. The radiation hotspot shows the latest `radiationDose` in mSv when it exists.

### 3. Metric cards

One card per metric: Sleep, Mood, Exercise, Heart rate.

- **Value:** latest log.
- **Tag:** `Within` or `Outside`, compared against the single-day limit in `HEALTH_THRESHOLDS`.
- **Sparkline:** values of the last 7 days, with the limit as a dashed line.
- **Caption:** 7-day average and the limit, e.g. *"Avg 6.9 h · limit < 7 h"*.

Limits are read from `thresholds.js`, so the UI never disagrees with the warning engine.

### 4. Warnings

Warnings from `checkHealthWarnings()` inside the same 7-day window used by the score, in two columns, each with its hazard. The title shows the date when all warnings are on the same day (*"Warnings · Nov 11"*). The full warning history is still available, unchanged, on the **History** screen.

### 5. Consistency

- **Streak:** consecutive logged days ending today (or yesterday, if today has no log yet).
- **Week strip:** the last 7 calendar days, with a check for each logged day and today highlighted.

## The 7-day window

The status, summary, chips, body status and warnings all use the same window as `getHealthScore()`: **the 7 days ending on the most recent log date**, not on today. That keeps every section consistent with the score, and it also works with demo data from past dates.

## Responsive behavior

| Width | Layout |
|---|---|
| 1280 px and up | Hero (8 cols) + Body status (4 cols); 4 metric cards in a row; Warnings (8) + Consistency (4). |
| 900–1279 px | Every section full width; metric cards in a 2 × 2 grid. |
| Below 900 px | Mobile layout: sidebar hidden, bottom navigation bar with a floating `+` button. |
| Below 600 px | Smaller hero, sparklines below the values, warnings in one column. |

## Design system

- **Fonts:** Space Grotesk for titles and numbers, Inter for text (Google Fonts, loaded in `index.html`).
- **Colors:** background `#05070f`, accent teal `#2dd4bf` (actions and active states only), critical `#ff6b6b`, one color per metric. Status is never shown by color alone: there is always text too.
- **Minimum text size:** 12 px.
- Design source: Figma, *Astronaut Health Monitor Desktop Version* (Overview frame).

## Accessibility

- Each section is a `<section>` with a heading linked through `aria-labelledby`.
- The astronaut SVG has `role="img"` and a descriptive `aria-label`.
- Navigation uses `aria-current="page"` and visible keyboard focus (teal ring).
- Decorative icons use `aria-hidden`.
- Animations respect `prefers-reduced-motion`.

## Known limitations (logic, not UI)

These come from the existing logic and are documented so the team can decide on them separately:

1. **Duplicate logs on the same date** are allowed, so a day can appear twice and generate duplicate warnings.
2. **Two rule sets disagree:** the warning engine (`thresholds.js`) and the hazard status in `SpaceContext.jsx` use different limits (for example, exercise below 20 min vs. below 60 min).
3. **The form's default date uses UTC** (`toISOString()`), so near midnight it can differ from the local date.
4. **Radiation limits** in `SpaceContext.jsx` (0.6 and 1.3 mSv/day) still need a cited source.

## How to test

```bash
npm run dev
```

1. With no saved logs, Home shows **No data yet** and a `Log today` button.
2. Log three consecutive days with sleep below 7 h and exercise below 20 min: the status becomes **Critical** or **Caution**, the chips explain why and the matching hotspots turn to **Past warning**.
3. Add a normal day after that: the recovery line appears.
4. Resize the window (or use device mode at 375 px) to check the tablet and mobile layouts.
5. Validate before committing:

```bash
npm run build && npm run lint
```

---

*Prototype monitoring thresholds, not medical diagnosis.*

## Update — vector astronaut (Body Status)

- The hand-drawn SVG figure was replaced by `src/assets/astronaut.svg`, a vector trace of the astronaut image bundled with the "space-login" component (the original was a 346 px PNG; tracing keeps it sharp at any size). **Check that component's license before a public release and add credit if required.**
- Placed with `<image href={astronautUrl} x="69" y="10" width="221.6" height="260" />`. The SVG `viewBox` is now `-30 0 420 280` so labels fit on both sides.
- New spot positions: head (138, 62), chest (169, 109), knee (208, 212), radiation (232, 40). `spotState()` is unchanged.
- The figure and spots float together (`.body-status__float`, ±3 px, 7 s), so spots never drift off the body. Disabled with `prefers-reduced-motion`.
- Spot cores get a dark outline so they stay visible over the light figure.
- The old `.suit*` classes in `home.css` are no longer used.
