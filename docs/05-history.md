# 05 — History screen

Redesign of the History screen based on Figma frame `10:1601` (file `0WPOWfju8Ppf28T07e03mj`).

**This is a UI-only change.** The screen reads `savedLogs` and the `warnings` array that `App.jsx` already gets from `checkHealthWarnings()`. The warning engine, thresholds and storage are unchanged. Nothing is saved or modified from this screen.

## Files

| File | Status | What it does |
|---|---|---|
| `src/screens/History.jsx` | New | Mission History table + "This week" summary |
| `src/styles/history.css` | New | Table, chips, status tags, summary panel, responsive rules |
| `src/App.jsx` | Edited | Renders `<History logs={savedLogs} warnings={warnings} />` |

What happened to the existing History content in `App.jsx`:

- **Original Mission History list:** commented out, not deleted, with a note pointing to `History.jsx`. The new table shows the same fields (date, sleep, mood, exercise, heart rate, radiation).
- **Health Warnings card (teammate's):** unchanged, still rendered below the new screen.

## Mission History table

All saved logs, newest first. Logs on the same date keep their save order.

| Column | Source | Display |
|---|---|---|
| Date | `log.date` | "Nov 14, 2026" + weekday, parsed as a **local** date |
| Sleep | `log.sleep` | Chip, "7.5 h" |
| Mood | `log.mood` | Chip, "4 / 5" |
| Exercise | `log.exercise` | Chip, "45 min" |
| Heart rate | `log.heartRate` | Chip, "68 bpm" |
| Radiation | `log.radiationDose` | Plain text "0.12 mSv", or "—" when not recorded. Not in the Figma frame; added so the field from the original list is not lost |
| Status | warnings for that date | See below |

**Outlined chips.** A chip gets an amber border when that single value crosses its limit in `thresholds.js`:

| Metric | Outlined when |
|---|---|
| Sleep | `< T.sleep.belowHours` |
| Mood | `<= T.mood.atOrBelow` |
| Exercise | `< T.exercise.belowMinutes` |
| Heart rate | `> T.hr.aboveBpm` |

**Status.** Warnings from `checkHealthWarnings()` are grouped by their `date`:

| Status | When |
|---|---|
| **N warnings** (red) | The engine produced N warnings dated that day |
| **Watch** (amber) | No warning that day, but at least one value is outlined |
| **Normal** (teal) | Neither |

"Watch" exists because sleep and exercise warnings are only raised on the **third** consecutive low day (that's how the engine dates them). Days one and two are below the limit but have no warning yet.

## "This week" panel

The window is the 7 calendar days ending on the **latest log date**, the same window Home uses.

- **Days logged:** distinct dates with a log in the window, out of 7.
- **Day streak:** consecutive calendar days with a log, counting back from the latest log date.
- **Warnings:** engine warnings dated inside the window.
- **7-day averages:** mean of sleep, mood, exercise and heart rate for logs in the window. Empty values are skipped.
- **Most flagged day:** the day in the window with the most warnings, listing each warning's `message` and `hazard` from the engine. If there are no warnings, it says so.

## Responsive behavior

| Width | Layout |
|---|---|
| ≥ 1280px | Table on the left, 360px summary on the right (sticky while scrolling) |
| < 1280px | Summary moves below the table |
| < 700px | Each table row becomes a card; the column name is shown next to each value (`data-label`) |

The table is wrapped in a horizontally scrollable container, so nothing breaks between breakpoints.

## Accessibility

- A real `<table>` with a hidden `<caption>`, `scope="col"` headers and a `scope="row"` date cell.
- Outlined chips also include hidden text "(outside limit)", so the warning is not color-only for screen readers.
- Status is always written out ("Normal", "Watch", "2 warnings").
- On phones, the visual header is hidden but kept for assistive tech, and each value shows its label.
- Section landmarks: the table is a `<section>` and the summary an `<aside>`, both labelled by their headings.

## How to test

1. `npm run build && npm run lint`: 0 errors, 0 warnings.
2. Save a log dated today: History shows today's date, not yesterday's. Compare with Home.
3. Save a log with heart rate 110: the chip is outlined and Status reads "1 warning".
4. Save three consecutive days with sleep below the limit: days 1–2 show "Watch", and day 3 shows a warning.
5. Leave Radiation empty on a log: the cell shows "—".
6. Check "This week": days logged, streak and averages match the saved data.
7. Check the Health Warnings card below: it lists the same warnings as before the redesign.
8. With no logs: the screen shows "No logs saved yet…".
9. Resize to 375px: rows become cards and the page doesn't scroll sideways.

## Known limitations (logic, not changed in this PR)

- **Duplicate logs on the same date** both show that day's warnings, because warnings are dated, not linked to a specific log.
- **The engine uses `new Date(log.date)`**, which parses `YYYY-MM-DD` as UTC. This screen only fixes the *display*. Consecutive-day checks still run in UTC, which works for same-format dates but should be reviewed when the date handling is unified.
- **Heart rate has no low limit** in `thresholds.js`, while Hazards (`SpaceContext.jsx`) uses 50–90 bpm. The team should agree on one set of rules.
- **Radiation has no threshold**, so it's never outlined.
- **The Health Warnings card** still uses the original `.card` styles and shows the raw stored date. Restyling it is left for later so the teammate's markup stays as written.
## Update — delete, radiation and demo mode

- **Delete** button per row (from PR #14). It calls the same logic as the original list: `saveLogs(savedLogs.filter((l) => l.date !== date))`. Hidden in demo mode, because demo data is read-only.
- **Radiation** is now a chip, outlined when above `T.radiation.aboveMsv`, and it counts toward "Watch". Radiation warnings from the engine show in Status and "Most flagged day".
- **One log per date** is now enforced by `handleSubmit` (PR #14), so the duplicate-date limitation no longer applies to new logs.
- In demo mode the table shows `DEMO_LOGS`; your saved logs are untouched.

## Update — delete, radiation and demo mode

- **Delete** button per row (from PR #14). It calls the same logic as the original list: `saveLogs(savedLogs.filter((l) => l.date !== date))`. Hidden in demo mode, because demo data is read-only.
- **Radiation** is now a chip, outlined when above `T.radiation.aboveMsv`, and it counts toward "Watch". Radiation warnings from the engine show in Status and "Most flagged day".
- **One log per date** is now enforced by `handleSubmit` (PR #14), so the duplicate-date limitation no longer applies to new logs.
- In demo mode the table shows `DEMO_LOGS`; your saved logs are untouched.
