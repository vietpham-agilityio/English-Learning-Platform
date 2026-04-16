import { auth } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";

import { getCourseById } from "@/src/services/course";
import { getLessonById } from "@/src/services/lesson";
import { getQuestions } from "@/src/services/question";
import { getUserProgress, progressByLessonId } from "@/src/services/progress";
import { getUserCourses, purchasedCourseIdSet } from "@/src/services/user-course";
import { ExerciseView } from "@/src/ui/ExercisePage";

type Props = {
  params: Promise<{ courseId: string; lessonId: string }>;
};

const ExercisePage = async ({ params }: Props) => {
  const { courseId, lessonId } = await params;
  const { userId, getToken } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const token = await getToken();

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

  // Gate paid course access
  if (!course.isFree) {
    const userCourses = await getUserCourses(token);
    const purchasedIds = purchasedCourseIdSet(userCourses);
    if (!purchasedIds.has(course.id)) {
      redirect(`/courses/${encodeURIComponent(courseId)}`);
    }
  }

  const questions = await getQuestions(token, lessonId).catch(() => []);

  const progressList = await getUserProgress(token);
  const progressMap = progressByLessonId(progressList);
  if (progressMap[Number(lessonId)]?.isCompleted) {
    redirect(
      `/courses/${encodeURIComponent(courseId)}/lessons/${encodeURIComponent(lessonId)}`,
    );
  }

  return (
    <ExerciseView
      course={course}
      lesson={lesson}
      questions={questions}
      courseId={courseId}
      lessonId={Number(lessonId)}
    />
  );
};

export default ExercisePage;
