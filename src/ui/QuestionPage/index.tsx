"use client";

import Link from "next/link";
import {
  useEffect,
  useState,
  type CSSProperties,
  type ReactElement,
} from "react";

import { FlowPageShell } from "@/src/components/common/Flow/FlowPageShell";
import { FLOW_HERO_ITALIC_CLASS, FLOW_LIST_ROW_CLASS } from "@/src/constants/styles";
import { ROUTES } from "@/src/constants/route";
import { scoreBadgeShell } from "@/src/utils/scoreStyles";
import type { Course, Lesson, Question } from "@/src/types";
import { QuestionAdminPanel } from "@/src/ui/QuestionPage/QuestionAdminPanel";

type Props = {
  readonly course: Course;
  readonly lesson: Lesson;
  readonly questions: readonly Question[];
  readonly isAdmin: boolean;
  /** When true, the exercise CTA is disabled (lesson already marked complete). */
  readonly exerciseLocked?: boolean;
  /** Server-computed exercise score (0-100) when lesson is completed. */
  readonly exerciseScorePercent?: number;
};

export function QuestionPageView({
  course,
  lesson,
  questions,
  isAdmin,
  exerciseLocked = false,
  exerciseScorePercent,
}: Props): ReactElement {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  const count = questions.length;

  return (
    <FlowPageShell>
      {/* Hero */}
      <div className="bg-linear-to-br from-emerald-950 via-stone-900 to-emerald-900 px-6 py-16 lg:py-20">
        <div className="max-w-4xl mx-auto">
          <Link
            href={`${ROUTES.COURSES}/${encodeURIComponent(course.id)}`}
            className={`inline-flex items-center gap-1.5 text-xs font-medium text-emerald-400 hover:text-emerald-300 transition-colors mb-6 ${
              mounted ? "animate-flow-hero-in" : "opacity-0"
            }`}
          >
             Back to lessons
          </Link>

          <p
            className={`text-xs tracking-[0.25em] uppercase text-emerald-400 font-semibold mb-4 ${
              mounted ? "animate-flow-fade-up-1" : "opacity-0"
            }`}
          >
            {isAdmin ? "Admin · Lesson questions" : "Lesson"}
          </p>

          <h1
            className={`text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight mb-4 ${
              mounted ? "animate-flow-fade-up-1" : "opacity-0"
            }`}
          >
            {lesson.title}
            <span className={FLOW_HERO_ITALIC_CLASS}>questions</span>
          </h1>

          <p
            className={`text-stone-400 text-base max-w-xl leading-relaxed ${
              mounted ? "animate-flow-fade-up-2" : "opacity-0"
            }`}
          >
            {lesson.content}
          </p>

          <div
            className={`flex flex-wrap gap-3 mt-8 ${
              mounted ? "animate-flow-fade-up-3" : "opacity-0"
            }`}
          >
            <span className="inline-block bg-white/10 border border-white/10 text-stone-300 text-xs font-medium px-3 py-1.5 rounded-full">
              {count} {count === 1 ? "question" : "questions"}
            </span>
            {exerciseLocked && (
              <span className="inline-block bg-emerald-900/40 border border-emerald-600/60 text-emerald-300 text-xs font-semibold px-3 py-1.5 rounded-full">
                Lesson completed
              </span>
            )}
            {exerciseLocked && exerciseScorePercent !== undefined && (
              <span
                className={`inline-block rounded-full px-3 py-1.5 text-xs font-bold tabular-nums ${scoreBadgeShell(exerciseScorePercent)}`}
              >
                Score: {exerciseScorePercent}%
              </span>
            )}
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
          <QuestionAdminPanel
            lessonId={lesson.id}
            initialQuestions={questions}
          />
        ) : count === 0 ? (
          <div
            className={`text-center py-24 text-stone-400 ${
              mounted ? "animate-flow-fade-up-4" : "opacity-0"
            }`}
          >
            <span className="text-5xl block mb-4">❓</span>
            <p className="text-lg font-semibold text-stone-600">No questions yet.</p>
            <p className="text-sm mt-1">
              Check back soon — exercises will be available shortly.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <ul className="space-y-3">
              {questions.map((q, index) => (
                <li
                  key={q.id}
                  className={mounted ? "flow-row-in" : "opacity-0"}
                  style={
                    mounted
                      ? ({ animationDelay: `${0.07 * index}s` } as CSSProperties)
                      : undefined
                  }
                >
                  <div
                    className={`${FLOW_LIST_ROW_CLASS} flex items-center gap-4 sm:gap-5`}
                  >
                    <span className="hidden sm:flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-stone-100 text-xs font-bold text-stone-400 transition-colors group-hover:bg-emerald-50 group-hover:text-emerald-600">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <p className="min-w-0 flex-1 text-base font-bold text-stone-900 transition-colors group-hover:text-emerald-700">
                      {q.question}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <div
              className={`flex flex-col items-center gap-3 pt-4 ${
                mounted ? "animate-flow-fade-up-5" : "opacity-0"
              }`}
            >
              {exerciseLocked ? (
                <div className="flex flex-col items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
                        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <p className="text-sm font-medium text-stone-600">
                      This lesson has been completed
                    </p>
                  </div>
                  {exerciseScorePercent !== undefined && (
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold tabular-nums ${scoreBadgeShell(exerciseScorePercent)}`}
                    >
                      Your score: {exerciseScorePercent}%
                    </span>
                  )}
                </div>
              ) : (
                <Link
                  href={`${ROUTES.COURSES}/${encodeURIComponent(course.id)}/lessons/${encodeURIComponent(lesson.id)}/exercise`}
                  className="flow-shimmer-btn inline-flex items-center gap-2 rounded-xl px-8 py-3 text-sm font-semibold text-white shadow-md transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-900/20"
                >
                  Start exercise
                </Link>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="max-w-4xl mx-auto px-6 pb-20">
        <p
          className={`text-xs text-stone-400 tracking-wide text-center ${
            mounted ? "animate-flow-fade-up-5" : "opacity-0"
          }`}
        >
          {isAdmin
            ? `${count} ${count === 1 ? "question" : "questions"} in this lesson · Manage from the panel above`
            : `${count} ${count === 1 ? "question" : "questions"} available`}
        </p>
      </div>
    </FlowPageShell>
  );
}
