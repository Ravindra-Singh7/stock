export function formatCurrency(value, currency = "INR") {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return "N/A";
  return new Intl.NumberFormat(currency === "INR" ? "en-IN" : "en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2
  }).format(value);
}

export function formatCompactNumber(value) {
  if (value === null || value === undefined) return "N/A";
  return new Intl.NumberFormat("en-IN", {
    notation: "compact",
    maximumFractionDigits: 2
  }).format(value);
}

export function formatPercent(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return "N/A";
  return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
}
