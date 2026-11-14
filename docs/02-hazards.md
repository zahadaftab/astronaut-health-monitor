# Hazards screen

The Hazards screen explains NASA's **Five Hazards of Human Spaceflight** and shows, for each one, how the astronaut is doing based on their own logs. It opens automatically on the first visit (no logs yet) as a short briefing, and links to the daily log.

> **Scope of this redesign:** UI only. The hazard content and the status rules are the team's existing code in `SpaceContext.jsx`. Only the component's JSX (what is drawn) was replaced. The data, the standards and the evaluation functions above the `Component` section were not modified.

## Files

| File | Purpose |
|---|---|
| `src/components/SpaceContext.jsx` | Hazard content, status rules and the screen itself. |
| `src/styles/hazards.css` | Styles for the Hazards screen. |
| `src/styles/tokens.css` | Design tokens shared by every screen. |
| `src/components/ui/Icon.jsx` | Inline SVG icons (radiation, user, globe, gravity, wind, and metric icons). |

`App.jsx` renders it with the saved logs and a callback to open the daily log:

```jsx
<SpaceContext logs={savedLogs} onStartLog={() => navigate("log")} />
```

`onStartLog` is optional: without it, the "Ready for today's check-in?" card is not shown.

## What comes from where

| Part of the screen | Source | Changed? |
|---|---|---|
| The five hazards and their "What to watch" points | `hazards` array | No |
| Which log fields feed each hazard | `HAZARD_METRICS` | No |
| Standards per metric | `METRICS` | No |
| Status labels (On track, Watch, Action needed, No data) | `STATUS` | No |
| Status of each hazard and the "Your recent data" notes | `evaluateHazard()` | No |
| Full names, icons, short and long descriptions | `HAZARD_DETAILS` | **New, display only** |
| Labels and icons for tracked metrics | `METRIC_LABELS`, `trackedItems()` | **New, display only** |

The long descriptions are written from the NASA Human Research Program hazard pages (see the team's research notes). They contain no rules and no numbers used by the app, except the communication delay ("up to 20 minutes one way"), which is informational.

## Sections

### 1. Hazard tiles

Five selectable tiles: Radiation, Isolation, Distance, Gravity, Environment. Each shows its icon, a one-line description and its **current status** from `evaluateHazard()`, with a colored dot and a text label. Status is never shown by color alone. The selected tile is highlighted in teal.

### 2. Hazard detail

For the selected hazard:

- **Name and status** (e.g. *Gravity Fields · Action needed*).
- **Description** (display text).
- **What to watch:** the two guidance points from the team's `hazards` array.
- **Your recent data:** the notes returned by `evaluateHazard()`, e.g. *"Exercise: below standard (60m or more) for the last 3 logs"*.
- **Tracked in your daily log:** chips built from `HAZARD_METRICS`.

### 3. Side column

- **Ready for today's check-in?** A call to action that opens the daily log.
- **All five hazards:** a compact list with each hazard's full name, the metrics it tracks and a status dot. Rows are clickable and select the hazard.
- **Source:** *NASA Human Research Program — Five Hazards of Human Spaceflight.*

## Hazard ↔ metric map (team's `HAZARD_METRICS`)

| Hazard | Tracked by |
|---|---|
| Space Radiation | Radiation dose (`radiationDose`) |
| Isolation & Confinement | Mood |
| Distance from Earth | Logging consistency (days since the last log) |
| Gravity Fields | Exercise, Heart rate |
| Hostile & Closed Environments | Sleep |

## How status is calculated (existing logic, documented as is)

For each metric of a hazard, `evaluateMetric()` looks at the logged values, oldest to newest:

| Result | Condition |
|---|---|
| **No data** | No valid values for that metric. |
| **Action needed** | The latest value is critical on its own, **or** the last 3 values are all outside the standard. |
| **Watch** | At least one of the last 3 values is outside the standard, **or** the average of the last 3 is at least 10% worse than the 3 before. |
| **On track** | Otherwise. |

Distance uses `evaluateLogging()` instead: last log today or yesterday → On track; 2 days ago → Watch; older → Action needed.

The hazard takes the **worst** status of its metrics.

### Standards used by this screen (`METRICS` in `SpaceContext.jsx`)

| Metric | Standard | Critical |
|---|---|---|
| Sleep | 7 h or more | below 4 h |
| Mood | 3 or higher | — |
| Exercise | 60 min or more | — |
| Heart rate | 50–90 bpm | below 40 or above 110 bpm |
| Radiation dose | 0.6 mSv/day or less | above 1.3 mSv/day |

## Responsive behavior

| Width | Layout |
|---|---|
| 1280 px and up | Five tiles in a row; detail card + 380 px side column. |
| 1100–1279 px | Tiles in 3 columns. |
| Below 1100 px | Side column moves below the detail card. |
| Below 900 px | Mobile layout with the bottom navigation bar. |
| Below 600 px | Tiles in 2 columns, smaller detail title. |

## Accessibility

- Tiles and list rows are `<button>` elements with `aria-pressed` for the selected hazard.
- The detail card uses `aria-live="polite"`, so screen readers announce the new hazard when the selection changes.
- Status dots in the side list include a visually hidden text label.
- Decorative icons use `aria-hidden`.

## Known limitations (logic, not UI)

Documented so the team can decide on them separately:

1. **Two rule sets disagree.** This screen's standards differ from the warning engine in `thresholds.js` (used by Home and the health score):

   | Metric | Hazards screen | Warning engine |
   |---|---|---|
   | Exercise | Watch below 60 min | Warning below 20 min for 3 days |
   | Heart rate | Watch outside 50–90 bpm | Warning above 100 bpm |
   | Mood | Watch below 3 | Warning at 2 or below |

   With 45 min of exercise, Home shows *Within* while Gravity shows *Watch*. Unifying both into `thresholds.js` is recommended.
2. **Sleep is mapped differently:** here it feeds *Environment*; in `hazards.js` and `metricTags.js` it maps to *Isolation & Confinement*.
3. **Radiation limits** (0.6 and 1.3 mSv/day) need a cited source before the demo.
4. **Duplicate logs on the same date** count as separate values in "the last 3 logs".

## How to test

```bash
npm run dev
```

1. With no logs, the app opens on Hazards and every hazard shows **No data**, except Distance.
2. Log three days with exercise below 60 min: Gravity becomes **Action needed** and its notes explain why.
3. Leave the radiation field empty: Radiation stays **No data**. Enter a dose above 0.6 to see **Watch**.
4. Click a tile and a row in "All five hazards": both change the detail card.
5. "Start daily log" opens the daily log.
6. Check 375 px in device mode.
7. Validate before committing:

```bash
npm run build && npm run lint
```

---

*Prototype monitoring thresholds, not medical diagnosis.*
## Update — new file and 3D cards

- The redesigned screen moved from `SpaceContext.jsx` to **`src/screens/Hazards.jsx`**. `SpaceContext.jsx` is back to the team's version (thresholds from `thresholds.js`, sleep in Isolation, Environment "Not tracked by daily logs") plus one export line. All statuses and notes still come from `evaluateHazard()`.
- `trackedItems()` shows "Not tracked by daily logs" when a hazard has no log fields (Environment).
- **3D cards** replace the flat tiles (style inspired by an "animated 3D card" component, rebuilt in plain React + CSS, no new dependencies):
  - Tilt follows the mouse (±7°). The pointer only updates CSS variables (`--rx`, `--ry`, `--mx`, `--my`), so there are no React re-renders.
  - A soft light follows the pointer; decorative dots and a rotating square.
  - Tint per hazard: radiation teal, isolation violet, distance blue, gravity pink, environment orange. Status colors stay on the chip, so a card tint never reads as a warning.
  - "View details" appears on hover; the active card shows "Showing details" and a colored border.
  - Click behaves as before: it updates the detail panel. On screens under 900px the page scrolls to the panel.
- Tilt only with a real mouse (`hover: hover`) and when motion is allowed. Touch screens always show the hint. The enter animation uses `translate`, so it never overrides the tilt.
- The old `.hazard-tile*` classes in `hazards.css` are no longer used.

## Update — new file and 3D cards

- The redesigned screen moved from `SpaceContext.jsx` to **`src/screens/Hazards.jsx`**. `SpaceContext.jsx` is back to the team's version (thresholds from `thresholds.js`, sleep in Isolation, Environment "Not tracked by daily logs") plus one export line. All statuses and notes still come from `evaluateHazard()`.
- `trackedItems()` shows "Not tracked by daily logs" when a hazard has no log fields (Environment).
- **3D cards** replace the flat tiles (style inspired by an "animated 3D card" component, rebuilt in plain React + CSS, no new dependencies):
  - Tilt follows the mouse (±7°). The pointer only updates CSS variables (`--rx`, `--ry`, `--mx`, `--my`), so there are no React re-renders.
  - A soft light follows the pointer; decorative dots and a rotating square.
  - Tint per hazard: radiation teal, isolation violet, distance blue, gravity pink, environment orange. Status colors stay on the chip, so a card tint never reads as a warning.
  - "View details" appears on hover; the active card shows "Showing details" and a colored border.
  - Click behaves as before: it updates the detail panel. On screens under 900px the page scrolls to the panel.
- Tilt only with a real mouse (`hover: hover`) and when motion is allowed. Touch screens always show the hint. The enter animation uses `translate`, so it never overrides the tilt.
- The old `.hazard-tile*` classes in `hazards.css` are no longer used.
