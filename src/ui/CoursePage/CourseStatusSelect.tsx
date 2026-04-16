"use client";

import { useEffect, useId, useRef, useState, type ReactElement } from "react";

import { COURSE_STATUS } from "@/src/constants/enum";

type Option = {
  readonly value: COURSE_STATUS;
  readonly label: string;
  readonly description: string;
  readonly icon: string;
};

const OPTIONS: readonly Option[] = [
  {
    value: COURSE_STATUS.PUBLISHED,
    label: "Published",
    description: "Visible in the learner catalog and checkout.",
    icon: "🌿",
  },
  {
    value: COURSE_STATUS.UNPUBLISHED,
    label: "Unpublished",
    description: "Hidden from the storefront; admins still see it here.",
    icon: "📝",
  },
] as const;

type Props = {
  readonly id: string;
  readonly value: COURSE_STATUS;
  readonly onChange: (next: COURSE_STATUS) => void;
  readonly disabled?: boolean;
};

/**
 * Custom listbox-style control with rich option rows (icon + subtitle).
 */
export function CourseStatusSelect({
  id,
  value,
  onChange,
  disabled = false,
}: Props): ReactElement {
  const listId = useId();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const selected = OPTIONS.find((o) => o.value === value) ?? OPTIONS[0];

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent): void => {
      if (!rootRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const selectOption = (v: COURSE_STATUS): void => {
    onChange(v);
    setOpen(false);
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        id={id}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => !disabled && setOpen((o) => !o)}
        className={`flex w-full items-center justify-between gap-3 rounded-xl border px-3.5 py-2.5 text-left shadow-sm outline-none transition focus:ring-2 ${
          disabled
            ? "cursor-not-allowed border-stone-100 bg-stone-100/80 text-stone-500"
            : "border-emerald-200/80 bg-white text-stone-900 ring-emerald-500/0 hover:border-emerald-300 focus:border-emerald-400 focus:ring-emerald-400/30"
        }`}
      >
        <span className="flex min-w-0 items-center gap-2.5">
          <span className="text-lg leading-none" aria-hidden>
            {selected.icon}
          </span>
          <span className="min-w-0">
            <span className="block truncate font-medium">{selected.label}</span>
            <span className="block truncate text-xs text-stone-500">
              {selected.description}
            </span>
          </span>
        </span>
        <span
          className={`shrink-0 text-stone-400 transition-transform ${
            open ? "rotate-180" : ""
          }`}
          aria-hidden
        >
          <ChevronIcon />
        </span>
      </button>

      {open ? (
        <ul
          id={listId}
          role="listbox"
          aria-labelledby={id}
          className="absolute left-0 right-0 top-[calc(100%+6px)] z-20 rounded-xl border border-stone-200/90 bg-white py-2 shadow-lg shadow-stone-900/10 ring-1 ring-stone-900/5"
        >
          {OPTIONS.map((opt) => {
            const isActive = opt.value === value;
            return (
              <li key={opt.value} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={isActive}
                  onClick={() => selectOption(opt.value)}
                  className={`flex w-full items-start gap-3 px-3 py-2.5 text-left transition ${
                    isActive
                      ? "bg-emerald-50/90"
                      : "hover:bg-stone-50 active:bg-stone-100/80"
                  }`}
                >
                  <span className="text-lg leading-none pt-0.5" aria-hidden>
                    {opt.icon}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="font-medium text-stone-900">
                        {opt.label}
                      </span>
                      {isActive ? (
                        <span className="rounded-full bg-emerald-600/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-800">
                          Current
                        </span>
                      ) : null}
                    </span>
                    <span className="mt-0.5 block text-xs leading-snug text-stone-500">
                      {opt.description}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}

function ChevronIcon(): ReactElement {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6 9l6 6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
