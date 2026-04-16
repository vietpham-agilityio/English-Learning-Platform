"use client";

import {
  type Dispatch,
  type SubmitEvent,
  type ReactElement,
  type SetStateAction,
} from "react";

import type { Lesson } from "@/src/types";
import { ModalShell } from "@/src/ui/CoursePage/ModalShell";

export type LessonFormMode = "create" | "edit";

export type LessonFormState = {
  title: string;
  content: string;
  order: string;
};

export const emptyLessonForm = (nextOrder = 1): LessonFormState => ({
  title: "",
  content: "",
  order: String(nextOrder),
});

export const lessonToFormState = (l: Lesson): LessonFormState => ({
  title: l.title,
  content: l.content,
  order: String(l.order),
});

type Props = {
  readonly open: boolean;
  readonly onCloseAction: () => void;
  readonly mode: LessonFormMode;
  readonly form: LessonFormState;
  readonly setFormAction: Dispatch<SetStateAction<LessonFormState>>;
  readonly onSubmitAction: (e: SubmitEvent) => void | Promise<void>;
  readonly saving: boolean;
  readonly error: string | null;
};

export function LessonFormModal({
  open,
  onCloseAction,
  mode,
  form,
  setFormAction,
  onSubmitAction,
  saving,
  error,
}: Props): ReactElement | null {
  if (!open) {
    return null;
  }

  return (
    <ModalShell
      open
      onClose={onCloseAction}
      isBusy={saving}
      titleId="lesson-form-modal-title"
      title={mode === "create" ? "New lesson" : "Edit lesson"}
      description={
        mode === "create"
          ? "Add a title, content, and display order."
          : "Update lesson details and save changes."
      }
      describedById="lesson-form-modal-desc"
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
            form="lesson-admin-form"
            disabled={saving}
            className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-500 disabled:opacity-60"
          >
            {saving ? "Saving…" : mode === "create" ? "Create" : "Save"}
          </button>
        </>
      }
    >
      <form id="lesson-admin-form" onSubmit={onSubmitAction} className="space-y-5">
        <div>
          <label
            htmlFor="lesson-title"
            className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-stone-500"
          >
            Title
          </label>
          <input
            id="lesson-title"
            value={form.title}
            onChange={(e) =>
              setFormAction((f) => ({ ...f, title: e.target.value }))
            }
            required
            maxLength={80}
            placeholder="e.g. Introduction to Vocabulary"
            className="w-full rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 text-stone-900 shadow-sm outline-none ring-emerald-500/0 transition focus:border-emerald-400 focus:ring-2"
          />
        </div>

        <div>
          <label
            htmlFor="lesson-content"
            className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-stone-500"
          >
            Content
          </label>
          <textarea
            id="lesson-content"
            value={form.content}
            onChange={(e) =>
              setFormAction((f) => ({ ...f, content: e.target.value }))
            }
            required
            rows={8}
            placeholder="Write the lesson content here…"
            className="w-full resize-y rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 text-stone-900 shadow-sm outline-none ring-emerald-500/0 transition focus:border-emerald-400 focus:ring-2"
          />
        </div>

        <div className="max-w-50">
          <label
            htmlFor="lesson-order"
            className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-stone-500"
          >
            Order
          </label>
          <input
            id="lesson-order"
            type="number"
            min={1}
            step={1}
            value={form.order}
            onChange={(e) =>
              setFormAction((f) => ({ ...f, order: e.target.value }))
            }
            required
            className="w-20 rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 text-stone-900 shadow-sm outline-none ring-emerald-500/0 transition focus:border-emerald-400 focus:ring-2"
          />
          <p className="mt-1.5 text-xs text-stone-400">
            Display position in the lesson list.
          </p>
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
