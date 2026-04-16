"use client";

import Link from "next/link";
import {
  useEffect,
  useState,
  type CSSProperties,
  type ReactElement,
} from "react";

import { FlowPageShell } from "@/src/components/common/Flow/FlowPageShell";
import { FLOW_HERO_ITALIC_CLASS } from "@/src/constants/styles";
import { ROUTES } from "@/src/constants/route";
import { formatUsdDollars } from "@/src/utils/format";
import { completedLessonRowShell } from "@/src/utils/scoreStyles";
import type { Course, Lesson, UserLessonProgress } from "@/src/types";
import { LessonAdminPanel } from "@/src/ui/LessonPage/LessonAdminPanel";
import { LessonProgressBadge } from "@/src/ui/LessonPage/LessonProgressBadge";
import { useRouter } from "next/navigation";

type Props = {
  readonly course: Course;
  readonly lessons: readonly Lesson[];
  readonly isAdmin: boolean;
  /** Plain record keyed by lessonId (serializable across server → client). */
  readonly progressByLessonId?: Record<number, UserLessonProgress>;
  /** Exercise score (0-100) by lessonId — derived from completed Exercise records on the server. */
  readonly exerciseScoreByLessonId?: Record<number, number>;
};

export function LessonPageView({
  course,
  lessons,
  isAdmin,
  progressByLessonId,
  exerciseScoreByLessonId,
}: Props): ReactElement {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  const sortedLessons = [...lessons].sort((a, b) => a.order - b.order);
  const count = sortedLessons.length;

  return (
    <FlowPageShell>
      {/* Hero */}
      <div className="bg-linear-to-br from-emerald-950 via-stone-900 to-emerald-900 px-6 py-16 lg:py-20">
        <div className="max-w-4xl mx-auto">
          <Link
            href={ROUTES.COURSES}
            className={`inline-flex items-center gap-1.5 text-xs font-medium text-emerald-400 hover:text-emerald-300 transition-colors mb-6 ${
              mounted ? "animate-flow-hero-in" : "opacity-0"
            }`}
          >
             Back to courses
          </Link>

          <p
            className={`text-xs tracking-[0.25em] uppercase text-emerald-400 font-semibold mb-4 ${
              mounted ? "animate-flow-fade-up-1" : "opacity-0"
            }`}
          >
            {isAdmin ? "Admin · Course lessons" : "Course"}
          </p>

          <h1
            className={`text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight mb-4 ${
              mounted ? "animate-flow-fade-up-1" : "opacity-0"
            }`}
          >
            {course.title}
            <span className={FLOW_HERO_ITALIC_CLASS}>lessons</span>
          </h1>

          <p
            className={`text-stone-400 text-base max-w-xl leading-relaxed ${
              mounted ? "animate-flow-fade-up-2" : "opacity-0"
            }`}
          >
            {course.description}
          </p>

          <div
            className={`flex flex-wrap gap-3 mt-8 ${
              mounted ? "animate-flow-fade-up-3" : "opacity-0"
            }`}
          >
            <span className="inline-block bg-white/10 border border-white/10 text-stone-300 text-xs font-medium px-3 py-1.5 rounded-full">
              {count} {count === 1 ? "lesson" : "lessons"}
            </span>
            <span
              className={`inline-block border text-xs font-semibold px-3 py-1.5 rounded-full ${
                course.isFree
                  ? "bg-emerald-900/40 border-emerald-700/40 text-emerald-400"
                  : "bg-white/10 border-white/10 text-stone-300"
              }`}
            >
              {course.isFree ? "Free" : formatUsdDollars(course.price)}
            </span>
            {isAdmin && (
              <span className="inline-block bg-white/10 border border-white/10 text-stone-300 text-xs font-medium px-3 py-1.5 rounded-full">
                ⚙️ Admin view
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {isAdmin ? (
          <LessonAdminPanel
            courseId={course.id}
            initialLessons={sortedLessons}
          />
        ) : count === 0 ? (
          <div
            className={`text-center py-24 text-stone-400 ${
              mounted ? "animate-flow-fade-up-4" : "opacity-0"
            }`}
          >
            <span className="text-5xl block mb-4">📚</span>
            <p className="text-lg font-semibold text-stone-600">No lessons yet.</p>
            <p className="text-sm mt-1">
              Check back soon — new content is on the way.
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {sortedLessons.map((lesson, index) => {
              const progressEntry = progressByLessonId?.[lesson.id];
              const scorePct = exerciseScoreByLessonId?.[lesson.id];
              const isCompleted = Boolean(progressEntry?.isCompleted);
              const rowSurface = isCompleted
                ? completedLessonRowShell(scorePct)
                : `bg-white border-stone-200 hover:border-emerald-300 hover:shadow-md`;

              return (
              <li
                key={lesson.id}
                className={mounted ? "flow-row-in" : "opacity-0"}
                style={
                  mounted
                    ? ({ animationDelay: `${0.07 * index}s` } as CSSProperties)
                    : undefined
                }
              >
                <div
                  onClick={() => isCompleted ? null : router.push(`/courses/${encodeURIComponent(course.id)}/lessons/${encodeURIComponent(lesson.id)}`)}
                  className={`block rounded-2xl ${isCompleted ? "cursor-default" : "cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"}`}
                >
                  <div
                    className={`group relative w-full overflow-hidden rounded-2xl border px-6 py-5 text-left transition-all duration-200 hover:-translate-y-0.5 flex flex-col gap-2 pr-12 sm:flex-row sm:items-start sm:gap-5 sm:pr-16 ${rowSurface}`}
                  >
                    <LessonProgressBadge
                      entry={progressEntry}
                      exerciseScorePercent={scorePct}
                    />
                    <span className={`hidden sm:flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-stone-100 text-xs font-bold text-stone-400 mt-0.5 transition-colors ${!isCompleted && "group-hover:bg-emerald-50 group-hover:text-emerald-600"}`}>
                      {String(lesson.order).padStart(2, "0")}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className={`text-base font-bold text-stone-900 transition-colors ${!isCompleted && "group-hover:text-emerald-700"}`}>
                        {lesson.title}
                      </p>
                      <p className={`mt-1.5 text-sm text-stone-500 leading-relaxed line-clamp-4 whitespace-pre-line ${!isCompleted && "group-hover:text-emerald-700"}`}>
                        {lesson.content}
                      </p>
                    </div>
                    {!isCompleted && (
                      <span className="hidden sm:flex shrink-0 items-center self-center text-stone-400 transition-colors group-hover:text-emerald-600">
                        →
                      </span>
                    )}
                  </div>
                </div>
              </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="max-w-4xl mx-auto px-6 pb-20">
        <p
          className={`text-xs text-stone-400 tracking-wide text-center ${
            mounted ? "animate-flow-fade-up-5" : "opacity-0"
          }`}
        >
          {isAdmin
            ? `${count} ${count === 1 ? "lesson" : "lessons"} in this course · Manage from the panel above`
            : `${count} ${count === 1 ? "lesson" : "lessons"} available`}
        </p>
      </div>
    </FlowPageShell>
  );
}
