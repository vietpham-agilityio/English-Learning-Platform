"use client";

import {
  type Dispatch,
  type ReactElement,
  type SetStateAction,
  type SubmitEvent,
} from "react";

import type { Question } from "@/src/types";
import { ModalShell } from "@/src/ui/CoursePage/ModalShell";

export type QuestionFormMode = "create" | "edit";

export type QuestionFormState = {
  question: string;
  options: string[];
  correctAnswer: string;
};

export const emptyQuestionForm = (): QuestionFormState => ({
  question: "",
  options: ["", ""],
  correctAnswer: "",
});

export const questionToFormState = (q: Question): QuestionFormState => ({
  question: q.question,
  options: [...q.options],
  correctAnswer: q.correctAnswer ?? "",
});

type Props = {
  readonly open: boolean;
  readonly onCloseAction: () => void;
  readonly mode: QuestionFormMode;
  readonly form: QuestionFormState;
  readonly setFormAction: Dispatch<SetStateAction<QuestionFormState>>;
  readonly onSubmitAction: (e: SubmitEvent) => void | Promise<void>;
  readonly saving: boolean;
  readonly error: string | null;
};

export function QuestionFormModal({
  open,
  onCloseAction,
  mode,
  form,
  setFormAction,
  onSubmitAction,
  saving,
  error,
}: Props): ReactElement | null {
  if (!open) return null;

  const updateOption = (index: number, value: string): void => {
    setFormAction((prev) => {
      const next = [...prev.options];
      const wasCorrect = prev.options[index] === prev.correctAnswer;
      next[index] = value;
      return {
        ...prev,
        options: next,
        correctAnswer: wasCorrect ? value : prev.correctAnswer,
      };
    });
  };

  const addOption = (): void => {
    setFormAction((prev) => ({ ...prev, options: [...prev.options, ""] }));
  };

  const removeOption = (index: number): void => {
    setFormAction((prev) => {
      if (prev.options.length <= 2) return prev;
      const next = prev.options.filter((_, i) => i !== index);
      const removedValue = prev.options[index];
      return {
        ...prev,
        options: next,
        correctAnswer:
          prev.correctAnswer === removedValue ? "" : prev.correctAnswer,
      };
    });
  };

  const selectCorrect = (value: string): void => {
    setFormAction((prev) => ({ ...prev, correctAnswer: value }));
  };

  return (
    <ModalShell
      open
      onClose={onCloseAction}
      isBusy={saving}
      titleId="question-form-modal-title"
      title={mode === "create" ? "New question" : "Edit question"}
      description={
        mode === "create"
          ? "Add a question, options, and mark the correct answer."
          : "Update the question details and save changes."
      }
      describedById="question-form-modal-desc"
      panelClassName="max-w-2xl"
      footer={
        <>
          <button
            type="button"
            onClick={onCloseAction}
            disabled={saving}
            className="rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm font-medium text-stone-700 shadow-sm transition hover:bg-stone-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="question-admin-form"
            disabled={saving}
            className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-500 disabled:opacity-60"
          >
            {saving ? "Saving…" : mode === "create" ? "Create" : "Save"}
          </button>
        </>
      }
    >
      <form id="question-admin-form" onSubmit={onSubmitAction} className="space-y-6">
        {/* Question text */}
        <div>
          <label
            htmlFor="q-question"
            className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-stone-500"
          >
            Question
          </label>
          <input
            id="q-question"
            value={form.question}
            onChange={(e) =>
              setFormAction((f) => ({ ...f, question: e.target.value }))
            }
            required
            maxLength={200}
            placeholder="e.g. Which of the following is a formal greeting?"
            className="w-full rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 text-stone-900 shadow-sm outline-none ring-emerald-500/0 transition focus:border-emerald-400 focus:ring-2"
          />
        </div>

        {/* Options */}
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-stone-500">
            Options
            <span className="ml-1.5 normal-case font-normal text-stone-400">
              — select the radio button to mark the correct answer
            </span>
          </p>

          <div className="space-y-2">
            {form.options.map((opt, i) => {
              const isCorrect = opt !== "" && opt === form.correctAnswer;
              return (
                <div
                  key={i}
                  className={`flex items-center gap-3 rounded-xl border px-3.5 py-2.5 transition-colors ${
                    isCorrect
                      ? "border-emerald-400 bg-emerald-50"
                      : "border-stone-200 bg-white"
                  }`}
                >
                  <input
                    type="radio"
                    name="correct-answer"
                    id={`q-opt-radio-${i}`}
                    checked={isCorrect}
                    onChange={() => {
                      if (opt.trim()) selectCorrect(opt);
                    }}
                    className="h-4 w-4 shrink-0 accent-emerald-600 cursor-pointer"
                    title="Mark as correct answer"
                  />
                  <input
                    type="text"
                    id={`q-opt-${i}`}
                    value={opt}
                    onChange={(e) => updateOption(i, e.target.value)}
                    required
                    maxLength={150}
                    placeholder={`Option ${i + 1}`}
                    className="min-w-0 flex-1 bg-transparent text-sm text-stone-900 outline-none placeholder:text-stone-400"
                  />
                  <button
                    type="button"
                    onClick={() => removeOption(i)}
                    disabled={form.options.length <= 2}
                    title="Remove option"
                    className="shrink-0 rounded-lg p-1 text-stone-400 transition-colors hover:bg-red-50 hover:text-red-500 disabled:pointer-events-none disabled:opacity-30"
                  >
                    ✕
                  </button>
                </div>
              );
            })}
          </div>

          <button
            type="button"
            onClick={addOption}
            className="mt-3 flex items-center gap-1.5 rounded-lg border border-dashed border-stone-300 px-3 py-2 text-xs font-medium text-stone-500 transition-colors hover:border-emerald-400 hover:text-emerald-600"
          >
            + Add option
          </button>

          {form.correctAnswer === "" && (
            <p className="mt-2 text-xs text-amber-600">
              Select a radio button to mark the correct answer.
            </p>
          )}
        </div>

        {error ? (
          <p
            className="rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-700"
            role="alert"
          >
            {error}
          </p>
        ) : null}
      </form>
    </ModalShell>
  );
}
