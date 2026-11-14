# 04 — Daily Log screen

Redesign of the Daily Log form based on Figma frame `10:530` (file `0WPOWfju8Ppf28T07e03mj`).

**This is a UI-only change.** The form state (`formData`), `handleChange` and `handleSubmit` still live in `App.jsx` and are unchanged, except that a successful submit now navigates back to Home. Input `name`s, types and constraints are the same as the original form, so the saved log shape in `localStorage` (`astronautLogs`) is identical.

## Files

| File | Status | What it does |
|---|---|---|
| `src/screens/DailyLog.jsx` | New | Form card + "Why we track these" side panel |
| `src/styles/log.css` | New | Form layout, fields, mood slider, side panel, responsive rules |
| `src/App.jsx` | Edited | `{screen === "log" && <DailyLog formData={formData} onChange={handleChange} onSubmit={handleSubmit} />}`; `handleSubmit` ends with `navigate("home")` |
| `src/components/HazardTag.jsx` | Kept | No longer rendered in the form. Import commented in `App.jsx`, file not deleted |

Props: `DailyLog({ formData, onChange, onSubmit })`. The component holds no state of its own.

## Layout

**Form card, "Daily Log Entry"**, with a pen badge and the note "All fields required".

| Row | Field | `name` | Input | Unit / extra |
|---|---|---|---|---|
| 1 | Date | `date` | date | Calendar icon |
| 1 | Sleep Hours | `sleep` | number | "hours" |
| 2 | Mood | `mood` | range 1–5 | Value shown as "N / 5", ticks 1–5, "Very low" / "Great" end labels, filled track via `--fill` |
| 3 | Exercise | `exercise` | number | "min" |
| 3 | Heart Rate | `heartRate` | number | "bpm", hint "Measured at rest. …" |
| 4 | Radiation | `radiationDose` | number, `min 0`, `step 0.01` | "mSv", optional, keeps the teammate's helper text |

Then a full-width pill button, "Save Daily Log".

**Field hints** come from `METRIC_TAGS` (the same data `HazardTag` used), shown as `${text} (${hazard})`. The hazard link is kept as text instead of a separate tag component.

**Side panel, "Why we track these"**: four tinted items (sleep, mood, exercise, heart rate). Each one states the rule using the values from `HEALTH_THRESHOLDS`, so the panel can't drift from the warning engine. It ends with the note "Prototype monitoring thresholds, not medical diagnosis."

## Responsive behavior

- Desktop: form card on the left, side panel on the right.
- Tablet / phone: the side panel moves below the form; two-field rows become one field per row.
- On phones the bottom nav FAB opens this screen.

## Accessibility

- Every input has a visible `<label>` tied with `htmlFor` / `id`.
- Units and hints sit next to their input as text, not only as placeholders.
- The mood value is shown as text ("3 / 5"), not just by the slider position.
- Native inputs keep keyboard support: arrow keys move the mood slider, and Enter submits.
- Visible focus ring from `--focus-ring`. Touch targets are at least 44px.
- Icons are decorative (`aria-hidden`).

## How to test

1. `npm run build && npm run lint`: 0 errors, 0 warnings.
2. From the sidebar ("New log") or the mobile FAB, open the form.
3. Fill every field and save. The app returns to Home, the header pill shows "Today's log saved", and the new values appear in Home and Trends.
4. Leave a required field empty and try to save: the browser's native validation stops the submit.
5. Leave Radiation empty: the log saves without it.
6. Drag the mood slider and use the arrow keys: the "N / 5" value and the track fill update.
7. Open DevTools → Application → Local Storage → `astronautLogs`: the saved object has the same keys as before the redesign.
8. Resize to 375px: the fields stack, and the button stays visible above the bottom nav.

## Known limitations (logic, not changed in this PR)

- **Confirmation uses `alert()`** in `handleSubmit`. A toast would fit the design better, but that changes App logic, so it's left for later.
- **Several logs can be saved for the same date.** There is no one-log-per-day rule yet, so the side panel doesn't claim there is.
- **Default date uses UTC** (`toISOString`). In UTC−3, a log saved after 21:00 defaults to the next day.
- **No upper bounds** on numbers (for example sleep 30 h is accepted), because the original inputs had none.
- **Radiation has no agreed threshold or source** yet, so the panel gives no rule for it.
- **Two rule sets exist**: this panel uses `thresholds.js`, while Hazards (`SpaceContext.jsx`) uses its own `METRICS`. The team should agree on one set.