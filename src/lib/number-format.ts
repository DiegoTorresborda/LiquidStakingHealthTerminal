function formatWithTrimmedDecimals(value: number, digits: number): string {
  return value.toFixed(digits).replace(/\.0+$/, "").replace(/(\.\d*?[1-9])0+$/, "$1");
}

export function formatUsdCompactStable(value: number): string {
  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";

  if (abs >= 1_000_000_000_000) {
    return `${sign}$${formatWithTrimmedDecimals(value / 1_000_000_000_000, 1)}T`;
  }

  if (abs >= 1_000_000_000) {
    return `${sign}$${formatWithTrimmedDecimals(value / 1_000_000_000, 1)}B`;
  }

  if (abs >= 1_000_000) {
    return `${sign}$${formatWithTrimmedDecimals(value / 1_000_000, 1)}M`;
  }

  if (abs >= 1_000) {
    return `${sign}$${formatWithTrimmedDecimals(value / 1_000, 1)}K`;
  }

  return `${sign}$${Math.round(abs)}`;
}
