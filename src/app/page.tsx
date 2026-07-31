import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BackToTop from "@/components/layout/BackToTop";
import HeroSection from "@/components/home/HeroSection";
import LatestStories from "@/components/home/LatestStories";
import OurCollege from "@/components/home/OurCollege";
import PresidentMessage from "@/components/home/PresidentMessage";
import QuickLinksFloat from "@/components/home/QuickLinksFloat";
import XrayGameFloat from "@/components/game/XrayGameFloat";
import { getNewsEvents } from "@/lib/data/newsEvents";
import { getActiveHomeAnnouncement } from "@/lib/data/homeAnnouncement";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [newsItems, announcement] = await Promise.all([
    getNewsEvents()
      .then((items) => items.slice(0, 4))
      .catch(() => []),
    getActiveHomeAnnouncement().catch(() => null),
  ]);

  return (
    <main>
      <Navbar />
      <HeroSection
        announcement={
          announcement
            ? {
                message: announcement.message,
                expiresAt: announcement.expiresAt,
              }
            : null
        }
      />
      <LatestStories newsItems={newsItems} />
      <OurCollege />
      <PresidentMessage />
      <Footer />
      <BackToTop />
      <QuickLinksFloat />
      <XrayGameFloat />
    </main>
  );
}
