import { cache } from "react";

import { API_BASE, API_VERSION } from "@/src/constants/endpoint";
import type { UserLessonProgress } from "@/src/types";

const progressListUrl = `${API_BASE}/${API_VERSION}/users/me/progress`;

/**
 * Index progress rows by lessonId.
 * Returns a plain Record (serializable across Next.js server → client boundary).
 */
export function progressByLessonId(
  list: readonly UserLessonProgress[],
): Record<number, UserLessonProgress> {
  const map: Record<number, UserLessonProgress> = {};
  for (const row of list) {
    map[row.lessonId] = row;
  }
  return map;
}

export const getUserProgress = cache(
  async (token: string | null): Promise<readonly UserLessonProgress[]> => {
    if (!token) {
      return [];
    }

    const res = await fetch(progressListUrl, {
      cache: "no-store",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      return [];
    }

    const data: unknown = await res.json();
    return Array.isArray(data) ? (data as UserLessonProgress[]) : [];
  },
);

export async function markLessonComplete(
  token: string,
  lessonId: number,
): Promise<UserLessonProgress> {
  const res = await fetch(
    `${API_BASE}/${API_VERSION}/lessons/${lessonId}/complete`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    },
  );

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return res.json() as Promise<UserLessonProgress>;
}
