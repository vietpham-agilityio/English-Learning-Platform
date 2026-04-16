import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";

import { USER_ROLE } from "@/src/constants/enum";
import { getCourseById } from "@/src/services/course";
import { getExercisesByLessonId } from "@/src/services/exercise";
import { getLessons } from "@/src/services/lesson";
import { getUserProgress, progressByLessonId } from "@/src/services/progress";
import { getUserProfile } from "@/src/services/users";
import { getUserCourses, purchasedCourseIdSet } from "@/src/services/user-course";
import { LessonPageView } from "@/src/ui/LessonPage";
import { CoursePaywall } from "@/src/ui/CoursePage/CoursePaywall";

type Props = {
  params: Promise<{ courseId: string }>;
};

const CourseLessonsPage = async ({ params }: Props) => {
  const { courseId } = await params;
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

  let course;

  try {
    course = await getCourseById(token, courseId);
  } catch {
    notFound();
  }

  // Gate access for paid courses
  if (!isAdmin && !course.isFree) {
    const userCourses = await getUserCourses(token);
    const purchasedIds = purchasedCourseIdSet(userCourses);
    if (!purchasedIds.has(course.id)) {
      return <CoursePaywall course={course} />;
    }
  }

  const lessons = await getLessons(token, courseId).catch(() => []);

  const progressList = userId ? await getUserProgress(token) : [];
  const progressMap = progressByLessonId(progressList);

  const completedLessonIds = progressList
    .filter((p) => p.isCompleted)
    .map((p) => p.lessonId);

  const exerciseScoreMap: Record<number, number> = {};

  if (!isAdmin && completedLessonIds.length > 0) {
    const exerciseResults = await Promise.all(
      completedLessonIds.map(async (lid) => {
        const exercises = await getExercisesByLessonId(token, lid);
        const completed = exercises.find((e) => e.completedAt !== null);
        if (completed && completed.totalQuestions > 0) {
          return {
            lessonId: lid,
            scorePercent: Math.round(
              (completed.score / completed.totalQuestions) * 100,
            ),
          };
        }
        return null;
      }),
    );

    for (const item of exerciseResults) {
      if (item) {
        exerciseScoreMap[item.lessonId] = item.scorePercent;
      }
    }
  }

  return (
    <LessonPageView
      course={course}
      lessons={lessons}
      isAdmin={isAdmin}
      progressByLessonId={isAdmin ? undefined : progressMap}
      exerciseScoreByLessonId={isAdmin ? undefined : exerciseScoreMap}
    />
  );
};

export default CourseLessonsPage;
