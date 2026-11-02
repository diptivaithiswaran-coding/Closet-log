export function money(value: number | null | undefined) {
  if (value === null || value === undefined) return "—";
  return `$${Number(value).toFixed(2)}`;
}

export function niceDate(value: string | null | undefined) {
  if (!value) return "—";
  // Dates come back as YYYY-MM-DD. Add a time so the day doesn't shift with time zones.
  const d = new Date(`${value.slice(0, 10)}T12:00:00`);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
