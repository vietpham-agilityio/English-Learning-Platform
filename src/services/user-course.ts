import { cache } from "react";

import { API_BASE, API_VERSION } from "@/src/constants/endpoint";
import type { UserCourse } from "@/src/types";

const userCoursesUrl = `${API_BASE}/${API_VERSION}/users/me/courses`;

/**
 * Returns the list of courses the signed-in user has been granted access to.
 * Cached per render so multiple server components on the same page share the result.
 * `GET /api/v1/users/me/courses`
 */
export const getUserCourses = cache(
  async (token: string | null): Promise<readonly UserCourse[]> => {
    if (!token) return [];

    const res = await fetch(userCoursesUrl, {
      cache: "no-store",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) return [];

    const data: unknown = await res.json();
    return Array.isArray(data) ? (data as UserCourse[]) : [];
  },
);

/**
 * Build a Set of purchased courseIds as strings for O(1) lookup against
 * `Course.id` (which the frontend models as a string).
 */
export function purchasedCourseIdSet(
  userCourses: readonly UserCourse[],
): ReadonlySet<string> {
  return new Set(userCourses.map((uc) => String(uc.courseId)));
}
