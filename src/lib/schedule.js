import { JAKARTA } from "./api";

// Monday-first week, matching getOpeningHours()
export const WEEK = [1, 2, 3, 4, 5, 6, 0];
export const DAY_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export const DAY_LONG = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function todayDow() {
  const short = new Date().toLocaleDateString("en-US", { weekday: "short", timeZone: JAKARTA });
  return DAY_SHORT.indexOf(short);
}

export const hhmm = (t) => t.slice(0, 5);

export function timeRange(start, end) {
  return `${hhmm(start)} – ${hhmm(end)}`;
}

// "Mon – Fri" for consecutive days, "Mon, Wed, Fri" otherwise
function dayList(days) {
  const idx = days.map((d) => WEEK.indexOf(d)).sort((a, b) => a - b);
  const runs = [];
  for (const i of idx) {
    const run = runs.at(-1);
    if (run && i === run.at(-1) + 1) run.push(i);
    else runs.push([i]);
  }
  return runs
    .map((r) =>
      r.length > 2
        ? `${DAY_SHORT[WEEK[r[0]]]} – ${DAY_SHORT[WEEK[r.at(-1)]]}`
        : r.map((i) => DAY_SHORT[WEEK[i]]).join(", "),
    )
    .join(", ");
}

// Groups a doctor's weekly availability into lines like { days: "Mon – Fri", hours: "09:00 – 16:00" }
export function practiceDays(availability = []) {
  const byRange = new Map();
  for (const a of availability) {
    const key = timeRange(a.start_time, a.end_time);
    byRange.set(key, [...(byRange.get(key) ?? []), a.day_of_week]);
  }
  return [...byRange]
    .map(([hours, days]) => ({ days: dayList(days), hours, first: Math.min(...days.map((d) => WEEK.indexOf(d))) }))
    .sort((a, b) => a.first - b.first);
}

// Doctor x day grid: for each weekday, that doctor's time ranges
export function weeklyGrid(availability = []) {
  return WEEK.map((dow) =>
    availability
      .filter((a) => a.day_of_week === dow)
      .sort((a, b) => a.start_time.localeCompare(b.start_time))
      .map((a) => timeRange(a.start_time, a.end_time)),
  );
}

// "Monday to Saturday" when the open days are consecutive, otherwise a list
export function openDaysPhrase(hours = []) {
  const open = hours.filter((h) => h.hours).map((h) => h.day);
  if (open.length === 0) return "";
  const idx = open.map((d) => WEEK.indexOf(DAY_LONG.indexOf(d)));
  const consecutive = idx.every((v, i) => i === 0 || v === idx[i - 1] + 1);
  if (consecutive && open.length > 2) return `${open[0]} to ${open.at(-1)}`;
  return open.join(", ");
}

// "dr. Andi Pratama" -> { title: "dr.", short: "dr. Andi", initials: "AP" }
export function doctorName(name) {
  const parts = name.split(/\s+/);
  const hasTitle = /\.$/.test(parts[0]);
  const rest = hasTitle ? parts.slice(1) : parts;
  return {
    short: hasTitle ? `${parts[0]} ${rest[0]}` : rest[0],
    initials: rest
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase())
      .join(""),
  };
}

export function telHref(phone) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}
