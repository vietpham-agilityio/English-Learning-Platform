import { cache } from 'react';

import { lessonsEndpoint } from '../constants/endpoint';
import type { CreateLessonInput, Lesson, UpdateLessonInput } from '../types';

const IDEMPOTENCY_KEY_HEADER = 'idempotency-key';

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
 * Lists all lessons for a course (`GET /courses/:courseId/lessons`).
 * Results are sorted by `order` ascending.
 */
export const getLessons = cache(
  async (token: string | null, courseId: string): Promise<Lesson[]> => {
    const res = await fetch(lessonsEndpoint(courseId), {
      cache: 'no-store',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    if (!res.ok) {
      throw new Error(await readErrorMessage(res));
    }

    return res.json() as Promise<Lesson[]>;
  },
);

/** Single lesson (`GET /courses/:courseId/lessons/:lessonId`). */
export const getLessonById = cache(
  async (
    token: string | null,
    courseId: string,
    lessonId: string,
  ): Promise<Lesson> => {
    const res = await fetch(
      `${lessonsEndpoint(courseId)}/${encodeURIComponent(lessonId)}`,
      {
        cache: 'no-store',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      },
    );

    if (!res.ok) {
      throw new Error(await readErrorMessage(res));
    }

    return res.json() as Promise<Lesson>;
  },
);

/**
 * Admin: create lesson (`POST /courses/:courseId/lessons`).
 * `Idempotency-Key` is required by the API; a new UUID is generated when omitted.
 */
export const createLesson = async (
  token: string,
  courseId: string,
  body: CreateLessonInput,
  idempotencyKey?: string,
): Promise<Lesson> => {
  const res = await fetch(lessonsEndpoint(courseId), {
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

  return res.json() as Promise<Lesson>;
};

/** Admin: update lesson (`PUT /courses/:courseId/lessons/:lessonId`). */
export const updateLesson = async (
  token: string,
  courseId: string,
  lessonId: string,
  body: UpdateLessonInput,
): Promise<Lesson> => {
  const res = await fetch(
    `${lessonsEndpoint(courseId)}/${encodeURIComponent(lessonId)}`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        [IDEMPOTENCY_KEY_HEADER]: crypto.randomUUID(),
      },
      body: JSON.stringify(body),
    },
  );

  if (!res.ok) {
    throw new Error(await readErrorMessage(res));
  }

  return res.json() as Promise<Lesson>;
};

/** Admin: delete lesson (`DELETE /courses/:courseId/lessons/:lessonId`). */
export const deleteLesson = async (
  token: string,
  courseId: string,
  lessonId: string,
): Promise<void> => {
  const res = await fetch(
    `${lessonsEndpoint(courseId)}/${encodeURIComponent(lessonId)}`,
    {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  if (!res.ok) {
    throw new Error(await readErrorMessage(res));
  }
};
