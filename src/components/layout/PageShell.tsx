import type { ReactNode } from "react";

/**
 * Public page chrome wrapper. Keeps the footer pinned to the viewport bottom
 * when content is short, without adding extra scroll on taller pages/mobile.
 */
export default function PageShell({ children }: { children: ReactNode }) {
  return <main className="min-h-dvh flex flex-col">{children}</main>;
}
