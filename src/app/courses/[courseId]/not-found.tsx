import type { Metadata } from "next";
import type { ReactElement } from "react";

import NotFoundClient from "@/src/ui/NotFound";

export const metadata: Metadata = {
  title: "Course not found — EnglishFlow",
  description: "We could not find that course. Return home or browse categories.",
};

export default function NotFound(): ReactElement {
  return <NotFoundClient description="The course you are looking for is unpublished. You should update status to published before creating lessons." />;
}
