import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BackToTop from "@/components/layout/BackToTop";
import HeroSection from "@/components/home/HeroSection";
import LatestStories from "@/components/home/LatestStories";
import OurCollege from "@/components/home/OurCollege";
import PresidentMessage from "@/components/home/PresidentMessage";
import QuickLinksFloat from "@/components/home/QuickLinksFloat";
import { getNewsEvents } from "@/lib/data/newsEvents";

export default async function Home() {
  const newsItems = await getNewsEvents()
    .then((items) => items.slice(0, 4))
    .catch(() => []);

  return (
    <main>
      <Navbar />
      <HeroSection />
      <LatestStories newsItems={newsItems} />
      <OurCollege />
      <PresidentMessage />
      <Footer />
      <BackToTop />
      <QuickLinksFloat />
    </main>
  );
}
