import type { ReactNode } from "react";
import Navbar from "@/components/layout/Navbar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar transparentOnTop={false} />
      <main className="flex-1 flex flex-col">{children}</main>
    </div>
  );
}
