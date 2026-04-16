import { cache } from 'react';

import { questionsEndpoint } from '../constants/endpoint';
import type { CreateQuestionInput, Question, UpdateQuestionInput } from '../types';

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
 * Lists all questions for a lesson (`GET /lessons/:lessonId/questions`).
 */
export const getQuestions = cache(
  async (
    token: string | null,
    lessonId: string | number,
  ): Promise<Question[]> => {
    const res = await fetch(questionsEndpoint(lessonId), {
      cache: 'no-store',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    if (!res.ok) {
      throw new Error(await readErrorMessage(res));
    }

    return res.json() as Promise<Question[]>;
  },
);

/** Single question (`GET /lessons/:lessonId/questions/:questionId`). */
export const getQuestionById = cache(
  async (
    token: string | null,
    lessonId: string | number,
    questionId: string,
  ): Promise<Question> => {
    const res = await fetch(
      `${questionsEndpoint(lessonId)}/${encodeURIComponent(questionId)}`,
      {
        cache: 'no-store',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      },
    );

    if (!res.ok) {
      throw new Error(await readErrorMessage(res));
    }

    return res.json() as Promise<Question>;
  },
);

/**
 * Admin: create question (`POST /lessons/:lessonId/questions`).
 * `Idempotency-Key` is required by the API; a new UUID is generated when omitted.
 */
export const createQuestion = async (
  token: string,
  lessonId: string | number,
  body: CreateQuestionInput,
  idempotencyKey?: string,
): Promise<Question> => {
  const res = await fetch(questionsEndpoint(lessonId), {
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

  return res.json() as Promise<Question>;
};

/** Admin: update question (`PUT /lessons/:lessonId/questions/:questionId`). */
export const updateQuestion = async (
  token: string,
  lessonId: string | number,
  questionId: string,
  body: UpdateQuestionInput,
): Promise<Question> => {
  const res = await fetch(
    `${questionsEndpoint(lessonId)}/${encodeURIComponent(questionId)}`,
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

  return res.json() as Promise<Question>;
};

/** Admin: delete question (`DELETE /lessons/:lessonId/questions/:questionId`). */
export const deleteQuestion = async (
  token: string,
  lessonId: string | number,
  questionId: string,
): Promise<void> => {
  const res = await fetch(
    `${questionsEndpoint(lessonId)}/${encodeURIComponent(questionId)}`,
    {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  if (!res.ok) {
    throw new Error(await readErrorMessage(res));
  }
};
