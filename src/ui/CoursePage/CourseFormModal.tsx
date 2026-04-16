"use client";

import {
  type Dispatch,
  type FormEvent,
  type ReactElement,
  type SetStateAction,
} from "react";

import { COURSE_STATUS } from "@/src/constants/enum";
import type { Course } from "@/src/types";
import { formatUsdDollars, sanitizeUsdPriceInput } from "@/src/utils/format";
import { CourseStatusSelect } from "@/src/ui/CoursePage/CourseStatusSelect";
import { ModalShell } from "@/src/ui/CoursePage/ModalShell";

export type CourseFormMode = "create" | "edit";

export type CourseFormState = {
  title: string;
  description: string;
  price: string;
  isFree: boolean;
  status: COURSE_STATUS;
};

export const emptyCourseForm = (): CourseFormState => ({
  title: "",
  description: "",
  price: "0",
  isFree: false,
  status: COURSE_STATUS.UNPUBLISHED,
});

export const courseToFormState = (c: Course): CourseFormState => ({
  title: c.title,
  description: c.description,
  price: String(c.price),
  isFree: c.isFree,
  status: c.status,
});

type Props = {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly mode: CourseFormMode;
  readonly form: CourseFormState;
  readonly setForm: Dispatch<SetStateAction<CourseFormState>>;
  readonly onSubmit: (e: FormEvent) => void | Promise<void>;
  readonly saving: boolean;
  readonly error: string | null;
};

/**
 * Create / edit course fields. Price row keeps fixed height when toggling “Free course” to avoid modal layout shift.
 */
export function CourseFormModal({
  open,
  onClose,
  mode,
  form,
  setForm,
  onSubmit,
  saving,
  error,
}: Props): ReactElement | null {
  if (!open) {
    return null;
  }

  const trimmedPrice = form.price.trim();
  const priceNum =
    trimmedPrice === "" ? Number.NaN : Number.parseFloat(trimmedPrice);
  const pricePreview =
    !form.isFree &&
    trimmedPrice !== "" &&
    Number.isFinite(priceNum) &&
    !Number.isNaN(priceNum)
      ? formatUsdDollars(priceNum)
      : null;

  return (
    <ModalShell
      open
      onClose={onClose}
      isBusy={saving}
      titleId="course-form-modal-title"
      title={mode === "create" ? "New course" : "Edit course"}
      description={
        mode === "create"
          ? "Add a title, description, pricing, and visibility."
          : "Update details and save changes."
      }
      describedById="course-form-modal-desc"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm font-medium text-stone-700 shadow-sm transition hover:bg-stone-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="course-admin-form"
            disabled={saving}
            className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-500 disabled:opacity-60"
          >
            {saving ? "Saving…" : mode === "create" ? "Create" : "Save"}
          </button>
        </>
      }
    >
      <form id="course-admin-form" onSubmit={onSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="course-title"
            className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-stone-500"
          >
            Title
          </label>
          <input
            id="course-title"
            value={form.title}
            onChange={(e) =>
              setForm((f) => ({ ...f, title: e.target.value }))
            }
            required
            className="w-full rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 text-stone-900 shadow-sm outline-none ring-emerald-500/0 transition focus:border-emerald-400 focus:ring-2"
          />
        </div>

        <div>
          <label
            htmlFor="course-desc"
            className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-stone-500"
          >
            Description
          </label>
          <textarea
            id="course-desc"
            value={form.description}
            onChange={(e) =>
              setForm((f) => ({ ...f, description: e.target.value }))
            }
            required
            rows={4}
            className="w-full resize-y rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 text-stone-900 shadow-sm outline-none ring-emerald-500/0 transition focus:border-emerald-400 focus:ring-2"
          />
        </div>

        <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-stone-100 bg-stone-50/80 px-4 py-3">
          <input
            type="checkbox"
            className="size-4 rounded border-stone-300 text-emerald-600 focus:ring-emerald-500"
            checked={form.isFree}
            onChange={(e) =>
              setForm((f) => ({ ...f, isFree: e.target.checked }))
            }
          />
          <span className="text-sm font-medium text-stone-800">Free course</span>
        </label>

        {/* Fixed block height: no layout shift when toggling isFree */}
        <div className="min-h-22">
          <label
            htmlFor="course-price"
            className={`mb-1.5 block text-xs font-semibold uppercase tracking-wide ${
              form.isFree ? "text-stone-400" : "text-stone-500"
            }`}
          >
            Price (USD)
          </label>
          <div
            className={`relative flex rounded-xl border shadow-sm transition focus-within:ring-2 ${
              form.isFree
                ? "cursor-not-allowed border-stone-100 bg-stone-100/80 ring-emerald-500/0"
                : "border-stone-200 bg-white ring-emerald-500/0 focus-within:border-emerald-400 focus-within:ring-emerald-400/25"
            }`}
          >
            <span
              className={`pointer-events-none flex shrink-0 items-center pl-3.5 text-sm font-semibold tabular-nums ${
                form.isFree ? "text-stone-400" : "text-stone-500"
              }`}
              aria-hidden
            >
              $
            </span>
            <input
              id="course-price"
              type="text"
              inputMode="decimal"
              autoComplete="off"
              placeholder="0.00"
              value={form.price}
              onChange={(e) => {
                const next = sanitizeUsdPriceInput(e.target.value);
                setForm((f) => ({ ...f, price: next }));
              }}
              disabled={form.isFree}
              required={!form.isFree}
              aria-disabled={form.isFree}
              className={`min-w-0 flex-1 rounded-r-xl border-0 bg-transparent py-2.5 pr-3.5 text-right text-base font-semibold tabular-nums text-stone-900 outline-none placeholder:text-stone-300 ${
                form.isFree ? "cursor-not-allowed text-stone-500" : ""
              }`}
            />
          </div>
          {pricePreview ? (
            <p className="mt-1.5 text-xs font-medium tabular-nums text-emerald-800/90">
              Preview: {pricePreview}
            </p>
          ) : null}
          <p
            className={`mt-1.5 text-xs leading-relaxed ${
              form.isFree ? "text-emerald-700/90" : "text-stone-400"
            }`}
          >
            {form.isFree
              && "Learners are not charged. Price is stored as 0." }
          </p>
        </div>

        <div>
          <label
            htmlFor="course-status"
            className="mb-4 block text-xs font-semibold uppercase tracking-wide text-stone-500"
          >
            Status
          </label>
          <CourseStatusSelect
            id="course-status"
            value={form.status}
            onChange={(next) =>
              setForm((f) => ({ ...f, status: next }))
            }
          />
        </div>

        {error ? (
          <p className="rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
            {error}
          </p>
        ) : null}
      </form>
    </ModalShell>
  );
}
