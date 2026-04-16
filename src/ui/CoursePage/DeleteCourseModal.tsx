"use client";

import type { ReactElement } from "react";

import { ModalShell } from "@/src/ui/CoursePage/ModalShell";

type Props = {
  readonly open: boolean;
  readonly courseTitle: string;
  readonly onClose: () => void;
  readonly onConfirm: () => void;
  readonly deleting: boolean;
  readonly error: string | null;
};

/**
 * Confirms permanent course deletion — same modal shell as create/edit for consistent UX.
 */
export function DeleteCourseModal({
  open,
  courseTitle,
  onClose,
  onConfirm,
  deleting,
  error,
}: Props): ReactElement | null {
  if (!open) {
    return null;
  }

  return (
    <ModalShell
      open
      onClose={onClose}
      isBusy={deleting}
      titleId="delete-course-modal-title"
      title="Delete course?"
      description="This cannot be undone. Learners will lose access if it was purchased."
      describedById="delete-course-modal-desc"
      panelClassName="max-w-md"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            disabled={deleting}
            className="rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm font-medium text-stone-700 shadow-sm transition hover:bg-stone-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={deleting}
            className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-500 disabled:opacity-60"
          >
            {deleting ? "Deleting…" : "Delete"}
          </button>
        </>
      }
    >
      <div className="space-y-3">
        <p className="text-sm text-stone-600 leading-relaxed">
          You are about to remove{" "}
          <span className="font-semibold text-stone-900">“{courseTitle}”</span>{" "}
          from the catalog.
        </p>
        {error ? (
          <p
            className="rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-700"
            role="alert"
          >
            {error}
          </p>
        ) : null}
      </div>
    </ModalShell>
  );
}
