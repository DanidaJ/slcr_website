import type { ReactNode } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BackToTop from "@/components/layout/BackToTop";

export default function PublicationsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <main>
      <Navbar transparentOnTop={false} />
      {children}
      <Footer />
      <BackToTop />
    </main>
  );
}
