/** Text color for numeric score (matches exercise result hero). */
export function scoreColor(pct: number): string {
  if (pct >= 80) return "text-emerald-600";
  if (pct >= 60) return "text-amber-600";
  return "text-red-600";
}

/** Background + border for large score panels. */
export function scoreBg(pct: number): string {
  if (pct >= 80) return "bg-emerald-50 border-emerald-200";
  if (pct >= 60) return "bg-amber-50 border-amber-200";
  return "bg-red-50 border-red-200";
}

/**
 * Compact badge: border + ring + shadow for a triple-outline look (emerald / amber / red tiers).
 */
export function scoreBadgeShell(pct: number): string {
  if (pct >= 80) {
    return [
      "border-2 border-emerald-600 bg-emerald-50",
      scoreColor(pct),
      "ring-2 ring-emerald-400/55 ring-offset-2 ring-offset-white",
      "shadow-[inset_0_0_0_1px_rgba(16,185,129,0.2)]",
    ].join(" ");
  }
  if (pct >= 60) {
    return [
      "border-2 border-amber-600 bg-amber-50",
      scoreColor(pct),
      "ring-2 ring-amber-400/55 ring-offset-2 ring-offset-white",
      "shadow-[inset_0_0_0_1px_rgba(217,119,6,0.2)]",
    ].join(" ");
  }
  return [
    "border-2 border-red-600 bg-red-50",
    scoreColor(pct),
    "ring-2 ring-red-400/55 ring-offset-2 ring-offset-white",
    "shadow-[inset_0_0_0_1px_rgba(220,38,38,0.2)]",
  ].join(" ");
}

/**
 * Lesson list row: background + border when the lesson is completed (tiered by score).
 */
export function completedLessonRowShell(scorePercent: number | undefined): string {
  if (scorePercent === undefined) {
    return [
      "bg-emerald-50/90 border-emerald-300/80",
      "hover:border-emerald-400 hover:shadow-md hover:shadow-emerald-900/10",
    ].join(" ");
  }
  if (scorePercent >= 80) {
    return [
      "bg-emerald-50/95 border-emerald-300",
      "hover:border-emerald-400 hover:shadow-md hover:shadow-emerald-900/10",
    ].join(" ");
  }
  if (scorePercent >= 60) {
    return [
      "bg-amber-50/95 border-amber-300",
      "hover:border-amber-400 hover:shadow-md hover:shadow-amber-900/10",
    ].join(" ");
  }
  return [
    "bg-red-50/95 border-red-300",
    "hover:border-red-400 hover:shadow-md hover:shadow-red-900/10",
  ].join(" ");
}

/** Saturated ribbon strip (45° corner) — high contrast on tinted row. */
export function scoreRibbonShell(scorePercent: number | undefined): string {
  if (scorePercent === undefined) {
    return "bg-emerald-600 text-white shadow-md shadow-emerald-900/25";
  }
  if (scorePercent >= 80) {
    return "bg-emerald-600 text-white shadow-md shadow-emerald-900/25";
  }
  if (scorePercent >= 60) {
    return "bg-amber-500 text-white shadow-md shadow-amber-900/25";
  }
  return "bg-red-600 text-white shadow-md shadow-red-900/25";
}
