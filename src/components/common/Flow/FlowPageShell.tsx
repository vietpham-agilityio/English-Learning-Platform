import type { ReactElement, ReactNode } from "react";

/**
 * Full-viewport shell for marketing-style pages (checkout success, 404, etc.).
 * Shared animations live in `globals.css` (`flow-*` utilities).
 */
export function FlowPageShell({
  children,
}: {
  readonly children: ReactNode;
}): ReactElement {
  return <div className="min-h-screen bg-stone-50">{children}</div>;
}
