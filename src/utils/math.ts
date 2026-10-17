/**
 * Financial Precision and Arithmetic Helpers
 * Ensures deterministic decimal handling and prevents IEEE-754 floating-point errors.
 */

export function round2(num: number): number {
  return Math.round((num + Number.EPSILON) * 100) / 100;
}

export function round4(num: number): number {
  return Math.round((num + Number.EPSILON) * 10000) / 10000;
}

export function toPence(pounds: number): number {
  return Math.round((pounds + Number.EPSILON) * 100);
}

export function fromPence(pence: number): number {
  return pence / 100;
}

export function formatGBP(amount: number, showSign = false): string {
  const isNegative = amount < -0.00001;
  const absVal = Math.abs(amount);
  const formatted = absVal.toLocaleString('en-GB', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  if (isNegative) {
    return `-£${formatted}`;
  }
  if (showSign && amount > 0.00001) {
    return `+£${formatted}`;
  }
  return `£${formatted}`;
}

export function formatPercent(percent: number, decimals = 2): string {
  return `${percent.toFixed(decimals)}%`;
}

export function clamp(val: number, min: number, max: number): number {
  if (isNaN(val)) return min;
  return Math.min(Math.max(val, min), max);
}
