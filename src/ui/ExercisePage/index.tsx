"use client";

import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactElement,
} from "react";

import { FlowPageShell } from "@/src/components/common/Flow/FlowPageShell";
import { FLOW_HERO_ITALIC_CLASS } from "@/src/constants/styles";
import { createExercise, submitExerciseAnswers, retryExerciseAttempt } from "@/src/services/exercise";
import { markLessonComplete } from "@/src/services/progress";
import { scoreBg, scoreColor } from "@/src/utils/scoreStyles";
import type {
  Course,
  ExerciseWithAnswers,
  Lesson,
  Question,
  UserAnswer,
} from "@/src/types";

type Phase = "creating" | "in-progress" | "submitting" | "result" | "error";

type Props = {
  readonly course: Course;
  readonly lesson: Lesson;
  readonly questions: readonly Question[];
  readonly courseId: string;
  readonly lessonId: number;
};

function formatTime(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function ExerciseView({
  lesson,
  questions,
  courseId,
  lessonId,
}: Props): ReactElement {
  const { getToken } = useAuth();
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [phase, setPhase] = useState<Phase>("creating");
  const [exerciseId, setExerciseId] = useState<number | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, string>
  >({});
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [result, setResult] = useState<ExerciseWithAnswers | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [markCompletePhase, setMarkCompletePhase] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");
  const [resetPhase, setResetPhase] = useState<
    "idle" | "resetting" | "done"
  >("idle");

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  // Create exercise on mount
  useEffect(() => {
    let cancelled = false;

    const init = async (): Promise<void> => {
      try {
        const token = await getToken();
        if (!token) {
          setError("You must be signed in to start an exercise.");
          setPhase("error");
          return;
        }

        const exercise = await createExercise(token, lessonId);

        if (cancelled) return;
        setExerciseId(exercise.id);
        setPhase("in-progress");
      } catch (err) {
        if (cancelled) return;
        setError(
          err instanceof Error ? err.message : "Failed to start exercise.",
        );
        setPhase("error");
      }
    };

    void init();
    return () => {
      cancelled = true;
    };
  }, [getToken, lessonId]);

  // Timer — runs only during in-progress phase
  useEffect(() => {
    if (phase !== "in-progress") return;

    timerRef.current = setInterval(() => {
      setElapsedSeconds((s) => s + 1);
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase]);

  const selectAnswer = useCallback((questionId: string, option: string): void => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: option }));
  }, []);

  const allAnswered =
    questions.length > 0 &&
    questions.every((q) => selectedAnswers[q.id] !== undefined);

  const handleSubmit = async (): Promise<void> => {
    if (!allAnswered || exerciseId === null) return;

    setPhase("submitting");
    if (timerRef.current) clearInterval(timerRef.current);

    try {
      const token = await getToken();
      if (!token) throw new Error("You must be signed in.");

      const answers = questions.map((q) => ({
        questionId: Number(q.id),
        selectedAnswer: selectedAnswers[q.id],
      }));

      const data = await submitExerciseAnswers(token, exerciseId, answers);
      setResult(data);
      setPhase("result");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed.");
      setPhase("error");
    }
  };

  const answeredCount = Object.keys(selectedAnswers).length;
  const lessonUrl = `/courses/${encodeURIComponent(courseId)}`;

  // ─── Result phase ────────────────────────────────────────────────────────
  if (phase === "result" && result !== null) {
    const pct = result.totalQuestions > 0
      ? Math.round((result.score / result.totalQuestions) * 100)
      : 0;

    const handleMarkLessonComplete = async (): Promise<void> => {
      if (markCompletePhase === "saving" || markCompletePhase === "saved") {
        return;
      }
      setMarkCompletePhase("saving");
      try {
        const token = await getToken();
        if (!token) {
          throw new Error("You must be signed in.");
        }
        await markLessonComplete(token, lessonId);
        setMarkCompletePhase("saved");
        router.push(`/courses/${encodeURIComponent(courseId)}`);
      } catch {
        setMarkCompletePhase("error");
      }
    };

    const handleBackToLesson = async (): Promise<void> => {
      if (exerciseId === null || resetPhase !== "idle") return;
      setResetPhase("resetting");
      try {
        const token = await getToken();
        if (token) {
          await retryExerciseAttempt(token, exerciseId);
        }
      } catch {
        // Best-effort; navigate regardless.
      }
      setResetPhase("done");
      router.push(lessonUrl);
    };

    const elapsedMs =
      result.completedAt
        ? new Date(result.completedAt).getTime() -
          new Date(result.startedAt).getTime()
        : 0;
    const elapsedSec = Math.floor(elapsedMs / 1000);

    const answerMap = new Map<number, UserAnswer>(
      result.userAnswers.map((a) => [a.questionId, a]),
    );

    return (
      <FlowPageShell>
        {/* Hero */}
        <div className="bg-linear-to-br from-emerald-950 via-stone-900 to-emerald-900 px-6 py-16 lg:py-20">
          <div className="max-w-4xl mx-auto">
            <Link
              href={lessonUrl}
              className={`inline-flex items-center gap-1.5 text-xs font-medium text-emerald-400 hover:text-emerald-300 transition-colors mb-6 ${mounted ? "animate-flow-hero-in" : "opacity-0"}`}
            >
               Back to lesson
            </Link>

            <p className={`text-xs tracking-[0.25em] uppercase text-emerald-400 font-semibold mb-4 ${mounted ? "animate-flow-fade-up-1" : "opacity-0"}`}>
              Exercise complete
            </p>

            <h1 className={`text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight mb-4 ${mounted ? "animate-flow-fade-up-1" : "opacity-0"}`}>
              {lesson.title}
              <span className={FLOW_HERO_ITALIC_CLASS}>results</span>
            </h1>

            {/* Summary pills */}
            <div className={`flex flex-wrap gap-3 mt-8 ${mounted ? "animate-flow-fade-up-3" : "opacity-0"}`}>
              <span className={`inline-block border text-xs font-bold px-3 py-1.5 rounded-full ${
                pct >= 80
                  ? "bg-emerald-900/40 border-emerald-600/60 text-emerald-300"
                  : pct >= 60
                  ? "bg-amber-900/40 border-amber-600/60 text-amber-300"
                  : "bg-red-900/40 border-red-600/60 text-red-300"
              }`}>
                {pct}%
              </span>
              <span className="inline-block bg-white/10 border border-white/10 text-stone-300 text-xs font-medium px-3 py-1.5 rounded-full">
                {result.score} / {result.totalQuestions} correct
              </span>
              <span className="inline-block bg-white/10 border border-white/10 text-stone-300 text-xs font-medium px-3 py-1.5 rounded-full">
                ⏱ {formatTime(elapsedSec)}
              </span>
            </div>
          </div>
        </div>

        {/* Score card */}
        <div className="max-w-4xl mx-auto px-6 pt-10">
          <div
            className={`rounded-2xl border p-6 mb-8 ${scoreBg(pct)} ${mounted ? "animate-flow-fade-up-4" : "opacity-0"}`}
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className={`text-5xl font-black tabular-nums ${scoreColor(pct)}`}>
                  {pct}%
                </p>
                <p className="mt-1 text-sm font-medium text-stone-600">
                  {result.score} correct out of {result.totalQuestions} questions
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-stone-700 tabular-nums">
                  {formatTime(elapsedSec)}
                </p>
                <p className="mt-0.5 text-xs text-stone-500 uppercase tracking-wide">Time used</p>
              </div>
            </div>
          </div>
        </div>

        {/* Per-question results */}
        <div className="max-w-4xl mx-auto px-6 pb-10">
          <p className={`text-xs font-semibold uppercase tracking-wide text-stone-500 mb-4 ${mounted ? "animate-flow-fade-up-4" : "opacity-0"}`}>
            Answer breakdown
          </p>
          <ul className="space-y-3">
            {questions.map((q, index) => {
              const answer = answerMap.get(Number(q.id));
              const isCorrect = answer?.isCorrect ?? false;
              const selected = answer?.selectedAnswer ?? "—";

              return (
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
                    className={`group w-full text-left border rounded-2xl px-6 py-5 transition-all duration-200 ${
                      isCorrect
                        ? "bg-emerald-50 border-emerald-200"
                        : "bg-red-50 border-red-200"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <span className={`hidden sm:flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                        isCorrect
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-red-100 text-red-700"
                      }`}>
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-base font-bold text-stone-900">
                          {q.question}
                        </p>
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                              isCorrect
                                ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                                : "bg-red-100 text-red-800 border border-red-300"
                            }`}
                          >
                            {isCorrect ? "✓" : "✗"} {selected}
                          </span>
                        </div>
                      </div>
                      <span
                        className={`shrink-0 text-xs font-bold px-2.5 py-1 rounded-full ${
                          isCorrect
                            ? "bg-emerald-600 text-white"
                            : "bg-red-600 text-white"
                        }`}
                      >
                        {isCorrect ? "Correct" : "Wrong"}
                      </span>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <div
          className={`max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-3 px-6 pb-20 ${
            mounted ? "animate-flow-fade-up-5" : "opacity-0"
          }`}
        >
          <button
            type="button"
            onClick={() => void handleBackToLesson()}
            disabled={resetPhase !== "idle" || markCompletePhase === "saved"}
            className="rounded-xl border border-stone-200 bg-white px-6 py-3 text-sm font-semibold text-stone-700 shadow-sm transition hover:bg-stone-50 disabled:opacity-60"
          >
            {resetPhase === "resetting" ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 rounded-full border-2 border-stone-400/40 border-t-stone-500 animate-spin" />
                Going back…
              </span>
            ) : (
              "Back to lesson"
            )}
          </button>
          <button
            type="button"
            onClick={() => void handleMarkLessonComplete()}
            disabled={markCompletePhase === "saving" || markCompletePhase === "saved"}
            className={`relative overflow-hidden rounded-xl px-6 py-3 text-sm font-semibold text-white shadow-md transition-all duration-300 ${
              markCompletePhase === "saved"
                ? "cursor-default border border-emerald-200 bg-emerald-600/90"
                : markCompletePhase === "error"
                  ? "border border-red-200 bg-red-600 hover:-translate-y-0.5"
                  : "flow-shimmer-btn hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-900/20"
            } disabled:opacity-70`}
          >
            {markCompletePhase === "saving" ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                Saving…
              </span>
            ) : markCompletePhase === "saved" ? (
              "Lesson marked complete"
            ) : markCompletePhase === "error" ? (
              "Try again"
            ) : (
              "Mark lesson complete"
            )}
          </button>
        </div>
      </FlowPageShell>
    );
  }

  // ─── Error phase ──────────────────────────────────────────────────────────
  if (phase === "error") {
    return (
      <FlowPageShell>
        <div className="max-w-4xl mx-auto px-6 py-24 text-center">
          <span className="text-5xl block mb-4">⚠️</span>
          <p className="text-lg font-semibold text-stone-700">{error}</p>
          <Link
            href={lessonUrl}
            className="mt-6 inline-block rounded-xl border border-stone-200 bg-white px-5 py-2.5 text-sm font-medium text-stone-700 transition hover:bg-stone-50"
          >
            Back to lesson
          </Link>
        </div>
      </FlowPageShell>
    );
  }

  // ─── In-progress / creating / submitting phase ───────────────────────────
  const isLoading = phase === "creating";
  const isSubmitting = phase === "submitting";

  return (
    <FlowPageShell>
      {/* Full viewport: header stays visible; questions + submit scroll */}
      <div className="flex h-dvh max-h-dvh flex-col overflow-hidden">
        {/* Hero — fixed height band at top */}
        <header className="shrink-0 bg-linear-to-br from-emerald-950 via-stone-900 to-emerald-900 px-6 py-12 lg:py-16 shadow-lg shadow-black/20">
          <div className="max-w-4xl mx-auto">
            <Link
              href={lessonUrl}
              className={`inline-flex items-center gap-1.5 text-xs font-medium text-emerald-400 hover:text-emerald-300 transition-colors mb-6 ${mounted ? "animate-flow-hero-in" : "opacity-0"}`}
            >
               Back to lesson
            </Link>

            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className={`text-xs tracking-[0.25em] uppercase text-emerald-400 font-semibold mb-3 ${mounted ? "animate-flow-fade-up-1" : "opacity-0"}`}>
                  Exercise
                </p>
                <h1 className={`text-3xl lg:text-4xl font-black tracking-tight text-white leading-tight ${mounted ? "animate-flow-fade-up-1" : "opacity-0"}`}>
                  {lesson.title}
                  <span className={FLOW_HERO_ITALIC_CLASS}>exercise</span>
                </h1>
              </div>

              {/* Timer */}
              <div className={`shrink-0 ${mounted ? "animate-flow-fade-up-2" : "opacity-0"}`}>
                <div className="flex flex-col items-end gap-0.5">
                  <span className="text-3xl font-black tabular-nums text-white tracking-tight">
                    {formatTime(elapsedSeconds)}
                  </span>
                  <span className="text-xs text-emerald-400 uppercase tracking-widest">
                    Time elapsed
                  </span>
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div className={`mt-6 ${mounted ? "animate-flow-fade-up-3" : "opacity-0"}`}>
              <div className="flex items-center justify-between text-xs text-stone-400 mb-2">
                <span>{answeredCount} / {questions.length} answered</span>
                {allAnswered && (
                  <span className="text-emerald-400 font-semibold animate-flow-fade-up-1">
                    All answered — ready to submit!
                  </span>
                )}
              </div>
              <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full bg-emerald-400 transition-all duration-500"
                  style={{
                    width: questions.length > 0
                      ? `${(answeredCount / questions.length) * 100}%`
                      : "0%",
                  }}
                />
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable content */}
        <div className="min-h-0 flex-1 overflow-y-auto bg-stone-50">
          {/* Questions */}
          <div className="max-w-4xl mx-auto px-6 py-10">
            {isLoading ? (
              <div className="text-center py-20 text-stone-400">
                <div className="inline-block h-8 w-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin mb-4" />
                <p className="text-sm">Starting your exercise…</p>
              </div>
            ) : (
              <ul className="space-y-6">
                {questions.map((q, index) => {
                  const selected = selectedAnswers[q.id];

                  return (
                    <li
                      key={q.id}
                      className={mounted ? "flow-row-in" : "opacity-0"}
                      style={
                        mounted
                          ? ({ animationDelay: `${0.06 * index}s` } as CSSProperties)
                          : undefined
                      }
                    >
                      <div className="bg-white border border-stone-200 rounded-2xl px-6 py-5 shadow-sm">
                        {/* Question header */}
                        <div className="flex items-start gap-4 mb-4">
                          <span className="hidden sm:flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-stone-100 text-xs font-bold text-stone-400">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <p className="text-base font-bold text-stone-900 leading-snug">
                            {q.question}
                          </p>
                        </div>

                        {/* Options */}
                        <div className="flex flex-col gap-2 sm:pl-12">
                          {q.options.map((opt) => {
                            const isSelected = selected === opt;
                            return (
                              <button
                                key={opt}
                                type="button"
                                onClick={() => !isSubmitting && selectAnswer(q.id, opt)}
                                disabled={isSubmitting}
                                className={`flex items-center gap-3 w-full rounded-xl border px-4 py-3 text-left transition-all duration-150 ${
                                  isSelected
                                    ? "border-emerald-400 bg-emerald-50 shadow-sm"
                                    : "border-stone-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/40"
                                } disabled:pointer-events-none`}
                              >
                                {/* Custom radio indicator */}
                                <span
                                  className={`h-4 w-4 shrink-0 rounded-full border-2 flex items-center justify-center transition-colors ${
                                    isSelected
                                      ? "border-emerald-600 bg-emerald-600"
                                      : "border-stone-300"
                                  }`}
                                >
                                  {isSelected && (
                                    <span className="h-1.5 w-1.5 rounded-full bg-white" />
                                  )}
                                </span>
                                <span
                                  className={`text-sm transition-colors ${
                                    isSelected
                                      ? "font-semibold text-emerald-800"
                                      : "text-stone-700"
                                  }`}
                                >
                                  {opt}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Submit bar */}
          {!isLoading && (
            <div
              className={`max-w-4xl mx-auto px-6 pb-20 ${mounted ? "animate-flow-fade-up-5" : "opacity-0"}`}
            >
              <div className="flex flex-col items-center gap-3">
                <button
                  type="button"
                  onClick={() => void handleSubmit()}
                  disabled={!allAnswered || isSubmitting}
                  className={`relative overflow-hidden rounded-xl px-10 py-3.5 text-sm font-semibold text-white shadow-md transition-all duration-300 ${
                    allAnswered && !isSubmitting
                      ? "flow-shimmer-btn hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-900/20 cursor-pointer"
                      : "bg-stone-300 cursor-not-allowed opacity-60"
                  }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                      Submitting…
                    </span>
                  ) : (
                    "Submit exercise"
                  )}
                </button>

                {!allAnswered && !isSubmitting && (
                  <p className="text-xs text-stone-400">
                    Answer all {questions.length} questions to submit
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </FlowPageShell>
  );
}
