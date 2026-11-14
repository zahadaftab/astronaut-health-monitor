# 03 — Trends screen

Redesign of the Trends screen based on Figma frame `11:2` (file `0WPOWfju8Ppf28T07e03mj`), with a visual style inspired by an "analytics bento" dashboard: smooth gradient curves, large animated numbers, a dark tooltip and a segmented range control.

**This is a UI-only change.** The data preparation in `MetricChart` (sorting by date, filtering empty values, the `limit` prop) is the team's code and is unchanged. The warning rules and thresholds are unchanged.

## Files

| File | Status | What it does |
|---|---|---|
| `src/screens/Trends.jsx` | New | Screen wrapper: legend hint + range selector, renders `MetricsCharts` |
| `src/components/MetricsCharts.jsx` | Restyled | `MetricChart` card + the 5-chart grid. Data helpers marked *(team, unchanged)* |
| `src/styles/trends.css` | New | Bento grid, card, segmented control, tags, responsive rules |
| `src/App.jsx` | Edited | `{screen === "trends" && <Trends logs={savedLogs} />}` |
| `src/components/SleepTrendChart.jsx` | Kept | No longer rendered on Trends. Import commented in `App.jsx`, file not deleted |
| `src/components/TrendChart.jsx` | Kept | No longer rendered. File not deleted |

No new dependencies. Charts still use Chart.js 4 + react-chartjs-2 (`Filler` is now registered for the gradient fill).

## What the screen shows

A 12-column bento grid with five cards:

| Card | Field | Color | Span | Limit line | Day flagged when |
|---|---|---|---|---|---|
| Sleep | `sleep` | `#a9b4f5` | 7 | `T.sleep.belowHours` | value < limit |
| Mood | `mood` | `#c4b5fd` | 5 | `T.mood.atOrBelow` | value ≤ limit |
| Exercise | `exercise` | `#5eead4` | 5 | `T.exercise.belowMinutes` | value < limit |
| Heart rate | `heartRate` | `#ff6b6b` | 7 | `T.hr.aboveBpm` | value > limit |
| Radiation dose | `radiationDose` | `#2dd4bf` | 12 | none | never (no agreed threshold yet) |

`T` is `HEALTH_THRESHOLDS` from `src/data/thresholds.js`, the same source Home and the warning engine use.

Each card has:

- **Label** with a color swatch.
- **Big number**: the latest value in the selected range, animated with `CountUp`.
- **Meta line**: subtitle + average of the visible range.
- **Tag**: "N days outside" (amber) or "All within limit" (teal).
- **Chart**: line with gradient fill, tension 0.4. Only the last point and flagged points are drawn; flagged points are amber (`#e8c77a`). A dashed gray dataset draws the limit.
- **Rule caption**: plain-language rule built from the threshold values, so the text never drifts from `thresholds.js`.

## Range selector

`RANGES` in `Trends.jsx`: 7 days, 14 days, 30 days, All. The value is passed to `MetricChart` as the team's existing `limit` prop, which does `points.slice(-limit)`. "All" passes `undefined`, which keeps every point.

## Responsive behavior

| Width | Layout |
|---|---|
| ≥ 1100px | Bento: Sleep 7 + Mood 5, Exercise 5 + Heart rate 7, Radiation full width |
| < 1100px | Every card full width |
| < 600px | Smaller padding, 32px numbers, 190px chart height, segmented control full width |

## Accessibility

- Each card is a `<section>` with `aria-label` set to the metric name.
- The range selector uses `role="tablist"` / `role="tab"` with `aria-selected`.
- Status is never shown by color alone: the tag text says how many days are outside the limit, and the caption explains the rule.
- `prefers-reduced-motion`: card enter animation is disabled in CSS, Chart.js animation is turned off, and `CountUp` shows the final value directly. The hook listens for changes while the page is open.
- Minimum text size is 12px (axis ticks, tags).
- Swatches, legend marks and rings are `aria-hidden`.

## How to test

1. `npm run build && npm run lint`: 0 errors, 0 warnings.
2. Open Trends with several saved logs. The big numbers count up to the latest value.
3. Hover a chart: the tooltip shows the date, the value with its unit, and the limit.
4. Save a log with a value outside a limit (for example heart rate 110): that point turns amber and the tag counts it.
5. Switch between 7 / 14 / 30 / All: all five charts update together.
6. Empty state: with no logs, each card shows "No data available." and no tag.
7. Resize to 375px: cards stack, nothing overflows horizontally.
8. Turn on Reduce motion in macOS (System Settings → Accessibility → Display): no animations.

## Known limitations (logic, not changed in this PR)

- **The range counts logs, not calendar days.** "7 days" means the last 7 saved logs. If days are skipped, the chart covers more than a week. Kept as is because it is the behavior of the team's `limit` prop.
- **Duplicate logs on the same date** appear as two points with the same label.
- **Per-day flags vs. the warning rule.** Sleep and exercise warnings need consecutive days below the limit, but the chart flags every single day below it. The caption states the real rule so the two are not confused.
- **Two rule sets exist.** These charts use `thresholds.js`. The Hazards screen (`SpaceContext.jsx`) has its own `METRICS` with different limits (for example exercise < 60, heart rate 50–90). The team should agree on one set.
- **Radiation has no limit line** until the team agrees on a sourced threshold.
- **Form date uses UTC** (`toISOString`), so a log saved late in the evening in UTC−3 can be stored as the next day. The chart displays whatever date was saved.