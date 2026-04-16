import { COURSE_STATUS, USER_ROLE } from '../constants/enum';

export interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  isFree: boolean;
  status: COURSE_STATUS;
  createdAt: string;
  updatedAt: string;
}

/** Body for `POST /courses` (matches backend `createCourseSchema`). */
export type CreateCourseInput = {
  title: string;
  description: string;
  price: number;
  isFree: boolean;
  status: COURSE_STATUS;
};

/** Body for `PUT /courses/:id` — at least one field required by the API. */
export type UpdateCourseInput = Partial<CreateCourseInput>;

/** User shape returned by the API (`/users`, `/users/me`, `/users/:id`). */
export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: USER_ROLE;
}

/** Lesson returned by `GET /courses/:courseId/lessons` or `/:lessonId`. */
export interface Lesson {
  id: number;
  title: string;
  content: string;
  order: number;
  courseId: number;
  createdAt: string;
  updatedAt: string;
}

/** Body for `POST /courses/:courseId/lessons`. */
export type CreateLessonInput = {
  readonly title: string;
  readonly content: string;
  readonly order: number;
};

/** Body for `PUT /courses/:courseId/lessons/:lessonId` — at least one field. */
export type UpdateLessonInput = Partial<CreateLessonInput>;

/**
 * Question returned by `GET /lessons/:lessonId/questions` or `/:questionId`.
 * `correctAnswer` is omitted for non-admin callers.
 */
export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer?: string;
  lessonId: number;
  createdAt: string;
  updatedAt: string;
}

/** Single user answer returned inside `ExerciseWithAnswers`. */
export interface UserAnswer {
  id: string;
  exerciseId: number;
  questionId: number;
  selectedAnswer: string;
  isCorrect: boolean;
  createdAt: string;
  updatedAt: string;
}

/** Exercise record returned by `POST /exercises` or `GET /exercises/:id`. */
export interface Exercise {
  id: number;
  userId: string;
  lessonId: number;
  score: number;
  totalQuestions: number;
  startedAt: string;
  completedAt: string | null;
}

/** Exercise with all user answers — returned by submit endpoint. */
export interface ExerciseWithAnswers extends Exercise {
  userAnswers: UserAnswer[];
}

/** Body for `POST /exercises`. */
export type CreateExerciseInput = { readonly lessonId: number };

/** Body for `POST /exercises/:exerciseId/answers`. */
export type SubmitAnswersInput = ReadonlyArray<{
  readonly questionId: number;
  readonly selectedAnswer: string;
}>;

/** Body for `POST /lessons/:lessonId/questions`. */
export type CreateQuestionInput = {
  readonly question: string;
  readonly options: readonly string[];
  readonly correctAnswer: string;
};

/** Body for `PUT /lessons/:lessonId/questions/:questionId` — at least one field. */
export type UpdateQuestionInput = Partial<CreateQuestionInput>;

/** Row from `GET /users/me/courses` — course the user has been granted access to. */
export interface UserCourse {
  readonly id: number;
  readonly userId: string;
  /** Stored as a number in the DB but the frontend compares to `Course.id` (string). */
  readonly courseId: number | string;
  readonly stripeSessionId: string | null;
  readonly grantedAt: string;
}

/** Row from `GET /users/me/progress` or `POST /lessons/:id/complete`. */
export interface UserLessonProgress {
  readonly id: string;
  readonly userId: string;
  readonly lessonId: number;
  readonly isCompleted: boolean;
  readonly completedAt: string | null;
  readonly createdAt: string;
  readonly updatedAt: string;
}
