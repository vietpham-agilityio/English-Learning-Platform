"use client";

import ErrorView from "@/src/ui/Error";

type Props = {
  error: unknown;
  reset: () => void;
};

export default function ErrorPage({ error, reset }: Props) {
  return <ErrorView error={error} onRetry={reset} />;
}

