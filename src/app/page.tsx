import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BackToTop from "@/components/layout/BackToTop";
import HeroSection from "@/components/home/HeroSection";
import LatestStories from "@/components/home/LatestStories";
import OurCollege from "@/components/home/OurCollege";
import PresidentMessage from "@/components/home/PresidentMessage";
import QuickLinksFloat from "@/components/home/QuickLinksFloat";

export default function Home() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <LatestStories />
      <OurCollege />
      <PresidentMessage />
      <Footer />
      <BackToTop />
      <QuickLinksFloat />
    </main>
  );
}
