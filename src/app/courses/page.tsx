import { auth } from "@clerk/nextjs/server";

// Constants
import { USER_ROLE } from "@/src/constants/enum";
import { DEFAULT_CURRENCY } from "@/src/constants/currency";
import { COURSE_META, FALLBACK_COURSE_META } from "@/src/constants/content";

// Services
import { getCourses, getCoursesForAdmin } from "@/src/services/course";
import { getUserProfile } from "@/src/services/users";
import { getUserCourses, purchasedCourseIdSet } from "@/src/services/user-course";

// UI
import { CoursePageView } from "@/src/ui/CoursePage";

const CoursesPage = async () => {
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

  const [catalogCourses, adminCourses, userCourses] = await Promise.all([
    getCourses(token),
    isAdmin && token ? getCoursesForAdmin(token) : Promise.resolve([]),
    token ? getUserCourses(token) : Promise.resolve([]),
  ]);

  const purchasedIds = purchasedCourseIdSet(userCourses);

  const rows = catalogCourses.map((course) => ({
    course,
    meta: COURSE_META[course.title] ?? FALLBACK_COURSE_META,
  }));

  return (
    <CoursePageView
      isAdmin={isAdmin}
      adminCourses={adminCourses}
      rows={rows}
      defaultCurrency={DEFAULT_CURRENCY}
      purchasedCourseIds={purchasedIds}
    />
  );
};

export default CoursesPage;
