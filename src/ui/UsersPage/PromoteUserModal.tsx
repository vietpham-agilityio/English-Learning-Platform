"use client";

import type { ReactElement } from "react";

import { ModalShell } from "@/src/ui/CoursePage/ModalShell";

type Props = {
  readonly open: boolean;
  readonly userName: string;
  readonly onClose: () => void;
  readonly onConfirm: () => void;
  readonly promoting: boolean;
  readonly error: string | null;
};

/**
 * Confirms promoting a user to admin — reuses the same ModalShell as other
 * destructive/mutating actions for consistent chrome, swaps the confirm button
 * to emerald to signal a positive (non-destructive) action.
 */
export function PromoteUserModal({
  open,
  userName,
  onClose,
  onConfirm,
  promoting,
  error,
}: Props): ReactElement | null {
  if (!open) return null;

  return (
    <ModalShell
      open
      onClose={onClose}
      isBusy={promoting}
      titleId="promote-user-modal-title"
      title="Promote to Admin?"
      description="This grants full administrative access to the platform."
      describedById="promote-user-modal-desc"
      panelClassName="max-w-md"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            disabled={promoting}
            className="rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm font-medium text-stone-700 shadow-sm transition hover:bg-stone-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={promoting}
            className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-500 active:bg-emerald-700 disabled:opacity-60"
          >
            {promoting ? "Promoting…" : "Promote"}
          </button>
        </>
      }
    >
      <div className="space-y-3">
        <p className="text-sm text-stone-600 leading-relaxed">
          You are about to promote{" "}
          <span className="font-semibold text-stone-900">&quot;{userName}&quot;</span> to
          admin. They will gain full platform access immediately.
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
