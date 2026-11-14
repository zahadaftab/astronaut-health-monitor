// Display helpers: treat "YYYY-MM-DD" as a local calendar date, never UTC,
// so dates don't shift by one day in time zones behind UTC (the Americas).

export function parseLocalDate(key) {
  const [year, month, day] = String(key).split("-").map(Number);
  return new Date(year, (month || 1) - 1, day || 1);
}

export function toDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function todayKey() {
  return toDateKey(new Date());
}

export function addDays(key, amount) {
  const date = parseLocalDate(key);
  date.setDate(date.getDate() + amount);
  return toDateKey(date);
}

export function formatShort(key) {
  return parseLocalDate(key).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function weekdayInitial(key) {
  return parseLocalDate(key).toLocaleDateString("en-US", { weekday: "narrow" });
}