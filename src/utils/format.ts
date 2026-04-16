export const formatMoney = (cents: number, currency: string) => {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(cents / 100);
  } catch {
    return `${(cents / 100).toFixed(2)} ${currency.toUpperCase()}`;
  }
};

/** Major units (dollars), e.g. `498.77` → `$498.77`. */
export const formatUsdDollars = (amount: number): string => {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `$${amount.toFixed(2)}`;
  }
};

/**
 * Keeps digits and at most one `.` with up to 2 decimal places (admin price field).
 */
export const sanitizeUsdPriceInput = (raw: string): string => {
  let s = raw.replace(/[^\d.]/g, "");
  const firstDot = s.indexOf(".");
  if (firstDot !== -1) {
    const intPart = s.slice(0, firstDot);
    let frac = s.slice(firstDot + 1).replace(/\./g, "");
    frac = frac.slice(0, 2);
    s = frac.length > 0 ? `${intPart}.${frac}` : `${intPart}.`;
  }
  return s;
};
