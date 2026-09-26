import type { ReactNode } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BackToTop from "@/components/layout/BackToTop";
import PageShell from "@/components/layout/PageShell";

export default function EducationsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <PageShell>
      <Navbar transparentOnTop={false} />
      {children}
      <Footer />
      <BackToTop />
    </PageShell>
  );
}
