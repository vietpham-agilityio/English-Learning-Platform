import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";

import { USER_ROLE } from "@/src/constants/enum";
import { getCourseById } from "@/src/services/course";
import { getExercisesByLessonId } from "@/src/services/exercise";
import { getLessonById } from "@/src/services/lesson";
import { getQuestions } from "@/src/services/question";
import { getUserProgress, progressByLessonId } from "@/src/services/progress";
import { getUserProfile } from "@/src/services/users";
import { QuestionPageView } from "@/src/ui/QuestionPage";

type Props = {
  params: Promise<{ courseId: string; lessonId: string }>;
};

const LessonQuestionsPage = async ({ params }: Props) => {
  const { courseId, lessonId } = await params;
  const { userId, getToken } = await auth();
  const token = await getToken();

  let isAdmin = false;
  if (userId && token) {
    try {
      const profile = await getUserProfile(token);
      isAdmin = profile.role === USER_ROLE.ADMIN;
    } catch {
      isAdmin = false;
    }
  }

  let lesson;
  try {
    lesson = await getLessonById(token, courseId, lessonId);
  } catch {
    notFound();
  }

  let course;
  try {
    course = await getCourseById(token, courseId);
  } catch {
    notFound();
  }

  const questions = await getQuestions(token, lessonId).catch(() => []);

  const progressList = userId ? await getUserProgress(token) : [];
  const progressMap = progressByLessonId(progressList);
  const lessonProgress = progressMap[Number(lessonId)];
  const exerciseLocked =
    !isAdmin && (lessonProgress?.isCompleted ?? false);

  let exerciseScorePercent: number | undefined;
  if (exerciseLocked) {
    const exercises = await getExercisesByLessonId(token, Number(lessonId));
    const completed = exercises.find((e) => e.completedAt !== null);
    if (completed && completed.totalQuestions > 0) {
      exerciseScorePercent = Math.round(
        (completed.score / completed.totalQuestions) * 100,
      );
    }
  }

  return (
    <QuestionPageView
      course={course}
      lesson={lesson}
      questions={questions}
      isAdmin={isAdmin}
      exerciseLocked={exerciseLocked}
      exerciseScorePercent={exerciseScorePercent}
    />
  );
};

export default LessonQuestionsPage;
