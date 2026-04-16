import Link from "next/link";

import type { Course } from "@/src/types";
import { FlowPageShell } from "@/src/components/common/Flow/FlowPageShell";

type Props = {
  readonly course: Course;
};

/**
 * Shown when a signed-in user tries to access a paid course they have not
 * purchased yet. Keeps them on the course detail route but blocks lesson access.
 */
export const CoursePaywall = ({ course }: Props): React.ReactElement => (
  <FlowPageShell>
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 py-20 text-center">
      <div className="max-w-md mx-auto">
        <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 border border-amber-200">
          <span className="text-3xl">🔒</span>
        </div>
        <h1 className="text-2xl font-black tracking-tight text-stone-900 mb-2">
          {course.title}
        </h1>
        <p className="text-stone-500 text-sm leading-relaxed mb-8">
          This is a paid course. Purchase it to unlock all lessons and exercises.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/courses"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 transition-colors"
          >
            Browse courses
          </Link>
          <Link
            href="/courses"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-stone-200 bg-white px-6 py-3 text-sm font-semibold text-stone-700 shadow-sm hover:border-emerald-300 hover:text-emerald-700 transition-colors"
          >
            ← Back to catalog
          </Link>
        </div>
      </div>
    </div>
  </FlowPageShell>
);
