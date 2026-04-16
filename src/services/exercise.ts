import { cache } from 'react';

import { API_BASE, API_VERSION, EXERCISES_ENDPOINT } from '../constants/endpoint';
import type {
  Exercise,
  ExerciseWithAnswers,
  SubmitAnswersInput,
} from '../types';

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
 * Creates a new exercise for the given lesson.
 * `POST /exercises` — body: { lessonId }
 * `userId` is derived from the JWT on the server; never sent from the client.
 */
export const createExercise = async (
  token: string,
  lessonId: number,
): Promise<Exercise> => {
  const res = await fetch(EXERCISES_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ lessonId }),
  });

  if (!res.ok) {
    throw new Error(await readErrorMessage(res));
  }

  return res.json() as Promise<Exercise>;
};

/**
 * Bulk-submits answers for an exercise.
 * `POST /exercises/:exerciseId/answers`
 * Returns the full exercise with answers and computed score.
 */
export const submitExerciseAnswers = async (
  token: string,
  exerciseId: number,
  answers: SubmitAnswersInput,
): Promise<ExerciseWithAnswers> => {
  const res = await fetch(`${EXERCISES_ENDPOINT}/${exerciseId}/answers`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(answers),
  });

  if (!res.ok) {
    throw new Error(await readErrorMessage(res));
  }

  return res.json() as Promise<ExerciseWithAnswers>;
};

/**
 * Retries an exercise attempt by clearing completedAt so the user can abandon this attempt.
 * `POST /exercises/:exerciseId/retry`
 */
export const retryExerciseAttempt = async (
  token: string,
  exerciseId: number,
): Promise<Exercise> => {
  const res = await fetch(`${EXERCISES_ENDPOINT}/${exerciseId}/retry`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error(await readErrorMessage(res));
  }

  return res.json() as Promise<Exercise>;
};

/**
 * Fetch exercises for a specific lesson (server-side).
 * `GET /exercises?lessonId=X`
 */
export const getExercisesByLessonId = cache(
  async (
    token: string | null,
    lessonId: number,
  ): Promise<readonly Exercise[]> => {
    if (!token) return [];

    const url = `${API_BASE}/${API_VERSION}/exercises?lessonId=${lessonId}`;
    const res = await fetch(url, {
      cache: 'no-store',
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) return [];

    const data: unknown = await res.json();
    return Array.isArray(data) ? (data as Exercise[]) : [];
  },
);
