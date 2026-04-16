export const API_BASE = process.env.NEXT_PUBLIC_API_URL!;

/** Must match the backend `API_VERSION` (e.g. `v1`). */
export const API_VERSION =
  process.env.NEXT_PUBLIC_API_VERSION?.trim() ?? "v1";

/** Public course catalog: `GET` matches `createCourseRouter` list handler. */
export const COURSES_ENDPOINT = `${API_BASE}/${API_VERSION}/courses`;

export const courseCheckoutUrl = (courseId: string): string =>
  `${COURSES_ENDPOINT}/${encodeURIComponent(courseId)}/checkout`;

/** Nested lessons collection: `GET|POST /courses/:courseId/lessons`. */
export const lessonsEndpoint = (courseId: string): string =>
  `${COURSES_ENDPOINT}/${encodeURIComponent(courseId)}/lessons`;

/** Nested questions collection: `GET|POST /lessons/:lessonId/questions`. */
export const questionsEndpoint = (lessonId: string | number): string =>
  `${API_BASE}/${API_VERSION}/lessons/${encodeURIComponent(String(lessonId))}/questions`;

/** Exercises collection: `GET|POST /exercises`. */
export const EXERCISES_ENDPOINT = `${API_BASE}/${API_VERSION}/exercises`;
