"use client";

import type { ReactElement } from "react";

import { scoreRibbonShell } from "@/src/utils/scoreStyles";
import type { UserLessonProgress } from "@/src/types";

type Props = {
  readonly entry: UserLessonProgress | undefined;
  /** Server-computed score from the completed Exercise record (0-100). */
  readonly exerciseScorePercent: number | undefined;
};

/**
 * Corner ribbon (45°) on a completed lesson row.
 * Score comes from the Exercise table (server-computed), never from the FE.
 */
export function LessonProgressBadge({
  entry,
  exerciseScorePercent,
}: Props): ReactElement | null {
  if (!entry?.isCompleted) {
    return null;
  }

  const hasScore =
    exerciseScorePercent !== undefined && exerciseScorePercent !== null;
  const label = hasScore ? `${exerciseScorePercent}%` : "Done";
  const ribbonClass = scoreRibbonShell(
    hasScore ? exerciseScorePercent : undefined,
  );

  return (
    <div
      className="pointer-events-none absolute right-0 top-0 z-10 h-20 w-20 overflow-hidden sm:h-24 sm:w-24"
      aria-hidden
    >
      <span
        className={`absolute left-1/2 top-4 w-[max(140%,8.5rem)] -translate-x-1/2 rotate-45 py-1.5 text-center text-[10px] font-bold uppercase tracking-wide tabular-nums sm:top-5 sm:text-[11px] ${ribbonClass}`}
      >
        {label}
      </span>
    </div>
  );
}
