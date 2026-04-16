import type { Metadata } from "next";
import type { ReactElement } from "react";

import NotFoundClient from "../ui/NotFound";

export const metadata: Metadata = {
  title: "Page not found — EnglishFlow",
  description: "We could not find that page. Return home or browse categories.",
};

export default function NotFound(): ReactElement {
  return <NotFoundClient />;
}
