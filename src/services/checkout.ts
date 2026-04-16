import { courseCheckoutUrl } from "../constants/endpoint";

/**
 * Course purchase — requires a matching `POST .../courses/:courseId/checkout` route on the API.
 * (Category checkout uses `/api/categories/:id/checkout`; wire courses the same way when ready.)
 */
export const requestCourseCheckout = async (
  courseId: string,
  getToken: () => Promise<string | null>,
): Promise<string> => {
  const token = await getToken();
  if (!token) {
    throw new Error("Not signed in");
  }

  const res = await fetch(courseCheckoutUrl(courseId), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  });

  const data = (await res.json()) as { url?: string; message?: string };

  if (!res.ok) {
    throw new Error(data.message ?? `Checkout failed (${res.status})`);
  }

  if (!data.url) {
    throw new Error("Missing checkout URL from API");
  }

  return data.url;
};
