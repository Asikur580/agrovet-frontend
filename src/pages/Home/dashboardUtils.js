import dayjs from "dayjs";

//=>>> Shared number formatting for every dashboard widget
export const formatNumber = (val) => Number(val || 0).toLocaleString("en-IN");

export const formatCurrency = (val) =>
  "Tk " +
  Number(val || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

// Compact South-Asian notation: 1.25 Cr, 12.46 L, 45.3 K
export const formatCompactCurrency = (val) => {
  const num = Number(val || 0);
  const abs = Math.abs(num);
  const trim = (n) => Number(n.toFixed(2)).toString();
  if (abs >= 1e7) return `Tk ${trim(num / 1e7)} Cr`;
  if (abs >= 1e5) return `Tk ${trim(num / 1e5)} L`;
  if (abs >= 1e4) return `Tk ${trim(num / 1e3)} K`;
  return formatCurrency(num);
};

//=>>> Global dashboard date presets
export const DATE_PRESETS = [
  { key: "today", label: "Today" },
  { key: "7d", label: "Last 7 days" },
  { key: "month", label: "This month" },
  { key: "year", label: "This year" },
];

export const DEFAULT_PRESET = "month";

export const getPresetRange = (key) => {
  const today = dayjs();
  const fmt = (d) => d.format("YYYY-MM-DD");
  switch (key) {
    case "today":
      return { startDate: fmt(today), endDate: fmt(today) };
    case "7d":
      return { startDate: fmt(today.subtract(6, "day")), endDate: fmt(today) };
    case "year":
      return { startDate: fmt(today.startOf("year")), endDate: fmt(today) };
    case "month":
    default:
      return { startDate: fmt(today.startOf("month")), endDate: fmt(today) };
  }
};

//=>>> Read cached widget data safely (returns null when missing or corrupt)
export const readCache = (key) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};
