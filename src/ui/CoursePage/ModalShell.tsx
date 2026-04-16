"use client";

import {
  useEffect,
  type ReactElement,
  type ReactNode,
} from "react";

export type ModalShellProps = {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly title: string;
  readonly titleId: string;
  /** Optional line under the title (muted). */
  readonly description?: string;
  readonly describedById?: string;
  readonly children: ReactNode;
  readonly footer?: ReactNode;
  /** Blocks backdrop click, Escape, and sets busy UI on overlay. */
  readonly isBusy?: boolean;
  readonly panelClassName?: string;
};

/**
 * Shared modal chrome: animated backdrop, centered panel, scroll lock, Escape to close.
 */
export function ModalShell({
  open,
  onClose,
  title,
  titleId,
  description,
  describedById,
  children,
  footer,
  isBusy = false,
  panelClassName = "max-w-lg",
}: ModalShellProps): ReactElement | null {
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent): void => {
      if (e.key === "Escape" && !isBusy) {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, isBusy, onClose]);

  if (!open) {
    return null;
  }

  const handleBackdropClick = (): void => {
    if (!isBusy) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-4 sm:p-6"
      role="presentation"
    >
      <button
        type="button"
        className="absolute inset-0 bg-stone-900/55 admin-modal-backdrop-in cursor-default"
        aria-label="Close dialog"
        onClick={handleBackdropClick}
        disabled={isBusy}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? describedById : undefined}
        className={`relative z-10 flex max-h-[min(90vh,720px)] w-full flex-col overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-2xl shadow-stone-900/15 admin-modal-panel-in ${panelClassName}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b border-stone-100 bg-linear-to-b from-stone-50/80 to-white px-6 py-4">
          <h2
            id={titleId}
            className="text-lg font-bold tracking-tight text-stone-900"
          >
            {title}
          </h2>
          {description ? (
            <p
              id={describedById}
              className="mt-1 text-sm text-stone-500 leading-snug"
            >
              {description}
            </p>
          ) : null}
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">{children}</div>

        {footer ? (
          <div className="flex shrink-0 flex-wrap items-center justify-end gap-2 border-t border-stone-100 bg-stone-50/50 px-6 py-4">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}
