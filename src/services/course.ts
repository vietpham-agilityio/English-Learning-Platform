import { cache } from 'react';

import { COURSES_ENDPOINT } from '../constants/endpoint';
import type { Course, CreateCourseInput, UpdateCourseInput } from '../types';

/** Matches backend `IDEMPOTENCY_KEY_HEADER`. */
const IDEMPOTENCY_KEY_HEADER = 'idempotency-key';

type GetCoursesOptions = {
  readonly term?: string;
};

async function readErrorMessage(res: Response): Promise<string> {
  try {
    const data = (await res.json()) as { message?: string };
    return typeof data.message === 'string' && data.message.length > 0
      ? data.message
      : `Request failed (${res.status})`;
  } catch {
    return `Request failed (${res.status})`;
  }
}

/**
 * Lists published courses from the Express API (`GET /api/:version/courses`).
 * Optional `term` maps to `?term=` for search (see `CourseController.list`).
 */
export const getCourses = cache(
  async (
    token: string | null,
    options?: GetCoursesOptions,
  ): Promise<Course[]> => {
    const url = new URL(COURSES_ENDPOINT);
    const term = options?.term?.trim();
    if (term) {
      url.searchParams.set('term', term);
    }

    const res = await fetch(url.toString(), {
      cache: 'no-store',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    if (!res.ok) {
      throw new Error(await readErrorMessage(res));
    }

    return res.json() as Promise<Course[]>;
  },
);

/**
 * Admin: lists every course (`GET /courses/all`), including unpublished.
 * Requires a valid Bearer token with admin role.
 */
export const getCoursesForAdmin = cache(async (token: string): Promise<Course[]> => {
  const res = await fetch(`${COURSES_ENDPOINT}/all`, {
    cache: 'no-store',
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    throw new Error(await readErrorMessage(res));
  }

  return res.json() as Promise<Course[]>;
});

/** Single course (`GET /courses/:id`) — published only for anonymous catalog. */
export const getCourseById = cache(
  async (token: string | null, id: string): Promise<Course> => {
    const res = await fetch(`${COURSES_ENDPOINT}/${encodeURIComponent(id)}`, {
      cache: 'no-store',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    if (!res.ok) {
      throw new Error(await readErrorMessage(res));
    }

    return res.json() as Promise<Course>;
  },
);

/**
 * Admin: create course (`POST /courses`).
 * `Idempotency-Key` is required by the API; a new UUID is generated when omitted.
 */
export const createCourse = async (
  token: string,
  body: CreateCourseInput,
  idempotencyKey?: string,
): Promise<Course> => {
  const res = await fetch(COURSES_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      [IDEMPOTENCY_KEY_HEADER]: idempotencyKey ?? crypto.randomUUID(),
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(await readErrorMessage(res));
  }

  return res.json() as Promise<Course>;
};

/** Admin: update course (`PUT /courses/:id`). */
export const updateCourse = async (
  token: string,
  id: string,
  body: UpdateCourseInput,
): Promise<Course> => {
  const res = await fetch(`${COURSES_ENDPOINT}/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(await readErrorMessage(res));
  }

  return res.json() as Promise<Course>;
};

/** Admin: delete course (`DELETE /courses/:id`). */
export const deleteCourse = async (
  token: string,
  id: string,
): Promise<void> => {
  const res = await fetch(`${COURSES_ENDPOINT}/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    throw new Error(await readErrorMessage(res));
  }
};
