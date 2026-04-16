"use client";

import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { useState } from "react";

// Utils
import { formatMoney } from "@/src/utils/format";

// Types
import type { Course } from "@/src/types";

// Constants
import { DEFAULT_PRICE_CENTS } from "@/src/constants/currency";

// Services
import { requestCourseCheckout } from "@/src/services/checkout";

type Meta = { icon: string; desc: string };

type Props = {
  course: Course;
  meta: Meta;
  index: number;
  defaultCurrency: string;
  /** True when the signed-in user has already purchased this course. */
  isPurchased?: boolean;
};

export const CourseCheckoutRow = ({
  course,
  meta,
  index,
  defaultCurrency,
  isPurchased = false,
}: Props) => {
  const { isLoaded, getToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currency = defaultCurrency.toUpperCase();
  const priceCents = course.isFree
    ? 0
    : Math.max(
      0,
      Math.round(
        typeof course.price === "number" && !Number.isNaN(course.price)
          ? course.price * 100
          : DEFAULT_PRICE_CENTS,
      ),
    );

  const onPurchase = async () => {
    setError(null);
    setLoading(true);
    try {
      const url = await requestCourseCheckout(course.id, getToken);
      window.location.href = url;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Checkout failed");
      setLoading(false);
    }
  };

  const rowClass =
    "group flex w-full text-left items-center justify-between bg-white border border-stone-200 hover:border-emerald-300 hover:shadow-md rounded-2xl px-6 py-5 transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0";

  const inner = (
    <div className="flex w-full items-center justify-between gap-4">
      <div className="flex min-w-0 items-center gap-5">
        <span className="hidden sm:flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-stone-100 text-xs font-bold text-stone-400 transition-colors group-hover:bg-emerald-50 group-hover:text-emerald-600">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="shrink-0 text-2xl">{meta.icon}</span>
        <div className="min-w-0">
          <p className="truncate text-base font-bold text-stone-900 transition-colors group-hover:text-emerald-700">
            {course.title}
          </p>
          <p className="mt-0.5 text-sm text-stone-400 line-clamp-2">{meta.desc}</p>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        {isPurchased ? (
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1.5 text-xs font-semibold text-emerald-700">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Enrolled
            </span>
          </div>
        ) : (
          <div className="text-right">
            <p className="text-sm font-bold tabular-nums text-emerald-800">
              {course.isFree ? "Free" : formatMoney(priceCents, currency)}
            </p>
            <p className="text-[11px] font-medium uppercase tracking-wide text-stone-400">
              {course.isFree ? "—" : currency}
            </p>
          </div>
        )}
        <span className="text-lg text-stone-300 transition-all duration-200 group-hover:translate-x-1 group-hover:text-emerald-500">
          →
        </span>
      </div>
    </div>
  );

  if (course.isFree || isPurchased) {
    return (
      <Link
        href={`/courses/${encodeURIComponent(course.id)}`}
        className={rowClass}
      >
        {inner}
      </Link>
    );
  }

  if (!isLoaded) {
    return <div className={`${rowClass} cursor-wait`}>{inner}</div>;
  }

  return (
    <div>
      <button
        type="button"
        onClick={onPurchase}
        disabled={loading}
        aria-busy={loading}
        aria-disabled={loading}
        className={`${rowClass} relative`}
      >
        {inner}
        {loading && (
          <div className="absolute inset-0 z-10 rounded-2xl bg-white/60 backdrop-blur-sm flex items-center justify-center pointer-events-none">
            <div className="flex items-center gap-2 text-stone-700">
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-stone-300 border-t-stone-700" />
              <span className="text-sm font-semibold">Opening Stripe…</span>
            </div>
          </div>
        )}
      </button>
      {error && (
        <p className="text-xs text-red-600 mt-1 px-1" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};
