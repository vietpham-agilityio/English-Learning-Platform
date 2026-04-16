"use client";

import {
  useEffect,
  useState,
  type CSSProperties,
  type ReactElement,
} from "react";

import { CourseCheckoutRow } from "@/src/ui/CourseCheckout";
import { CourseAdminPanel } from "@/src/ui/CoursePage/CourseAdminPanel";
import { FlowPageShell } from "@/src/components/common/Flow/FlowPageShell";
import { FLOW_HERO_ITALIC_CLASS } from "@/src/constants/styles";
import type { Course } from "@/src/types";

type Meta = { icon: string; desc: string };

export type CoursePageRow = {
  course: Course;
  meta: Meta;
};

type Props = {
  readonly isAdmin: boolean;
  /** Full catalog for admin (includes unpublished); ignored when `isAdmin` is false. */
  readonly adminCourses: readonly Course[];
  /** Rows for learners (published catalog + display meta). */
  readonly rows: readonly CoursePageRow[];
  readonly defaultCurrency: string;
  /** courseIds the current user has purchased/been granted access to. */
  readonly purchasedCourseIds?: ReadonlySet<string>;
};

export const CoursePageView = ({
  isAdmin,
  adminCourses,
  rows,
  defaultCurrency,
  purchasedCourseIds,
}: Props): ReactElement => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  const count = isAdmin ? adminCourses.length : rows.length;

  return (
    <FlowPageShell>
      <div className="bg-linear-to-br from-emerald-950 via-stone-900 to-emerald-900 px-6 py-16 lg:py-20">
        <div className="max-w-4xl mx-auto">
          <p
            className={`text-xs tracking-[0.25em] uppercase text-emerald-400 font-semibold mb-4 ${
              mounted ? "animate-flow-hero-in" : "opacity-0"
            }`}
          >
            {isAdmin ? "Admin" : "Catalog"}
          </p>
          <h1
            className={`text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight mb-4 ${
              mounted ? "animate-flow-fade-up-1" : "opacity-0"
            }`}
          >
            {isAdmin ? (
              <>
                Manage
                <span className={FLOW_HERO_ITALIC_CLASS}>courses</span>
              </>
            ) : (
              <>
                What will you
                <span className={FLOW_HERO_ITALIC_CLASS}>learn next?</span>
              </>
            )}
          </h1>
          <p
            className={`text-stone-400 text-base max-w-md leading-relaxed ${
              mounted ? "animate-flow-fade-up-2" : "opacity-0"
            }`}
          >
            {isAdmin
              ? "Create, edit, or remove courses. Checkout is disabled here — use the public catalog as a learner to purchase paid courses."
              : "Browse published courses. Pick a path and pay at checkout when a course has a price."}
          </p>

          <div
            className={`flex flex-wrap gap-3 mt-8 ${
              mounted ? "animate-flow-fade-up-3" : "opacity-0"
            }`}
          >
            <span className="animate-flow-pill-1 inline-block bg-white/10 border border-white/10 text-stone-300 text-xs font-medium px-3 py-1.5 rounded-full">
              {count} {count === 1 ? "course" : "courses"}
            </span>
            <span className="animate-flow-pill-2 inline-block bg-white/10 border border-white/10 text-stone-300 text-xs font-medium px-3 py-1.5 rounded-full">
              {isAdmin ? "⚙️ Full catalog access" : "🔥 Updated weekly"}
            </span>
            <span className="animate-flow-pill-3 inline-block bg-white/10 border border-white/10 text-stone-300 text-xs font-medium px-3 py-1.5 rounded-full">
              {isAdmin ? "✦ No payment in admin" : "✦ All levels welcome"}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {isAdmin ? (
          <CourseAdminPanel initialCourses={adminCourses} />
        ) : count === 0 ? (
          <div
            className={`text-center py-24 text-stone-400 ${
              mounted ? "animate-flow-fade-up-4" : "opacity-0"
            }`}
          >
            <span className="text-5xl block mb-4">🌾</span>
            <p className="text-lg font-semibold text-stone-600">No courses yet.</p>
            <p className="text-sm mt-1">Check back soon — new lessons are on the way.</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {rows.map(({ course, meta }, index) => (
              <li
                key={course.id}
                className={mounted ? "flow-row-in" : "opacity-0"}
                style={
                  mounted
                    ? ({ animationDelay: `${0.08 * index}s` } as CSSProperties)
                    : undefined
                }
              >
                <CourseCheckoutRow
                  course={course}
                  meta={meta}
                  index={index}
                  defaultCurrency={defaultCurrency}
                  isPurchased={purchasedCourseIds?.has(course.id) ?? false}
                />
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="max-w-4xl mx-auto px-6 pb-20">
        <p
          className={`text-xs text-stone-400 tracking-wide text-center ${
            mounted ? "animate-flow-fade-up-5" : "opacity-0"
          }`}
        >
          {isAdmin
            ? `${count} ${count === 1 ? "course" : "courses"} in the system · Learners only see published items in the storefront`
            : `${count} ${count === 1 ? "course" : "courses"} listed · More coming soon 🌱`}
        </p>
      </div>
    </FlowPageShell>
  );
};
