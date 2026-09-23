import type { Metadata } from "next";
import { Download, ExternalLink } from "lucide-react";
import PageHeader from "@/components/the-college/PageHeader";
import BrochureViewerSection from "@/components/academic-sessions/BrochureViewerSection";
import sessionsData from "@/data/upcomingSessions.json";
// ---------------------------------------------------------------------------
// Sessions film (reuse when AAS 2027 promo video is ready)
// ---------------------------------------------------------------------------
// 1. Uncomment the import below.
// 2. Uncomment <SessionsVideoSection ... /> in the page body (see marker).
// 3. On the home hero CTA, restore the sessionStorage autoplay flag
//    (see HeroSection.tsx — search SESSIONS_VIDEO_AUTOPLAY_KEY).
// 4. Update sources/poster in src/lib/sessionsVideo.ts for the new assets.
//
// import SessionsVideoSection from "@/components/academic-sessions/SessionsVideoSection";

type UpcomingSessions = {
  meta: {
    organization: string;
    title: string;
    subtitle: string;
    tagline: string;
    brochureUrl: string;
    brochureKey?: string;
  };
};

const data = sessionsData as unknown as UpcomingSessions;

export const metadata: Metadata = {
  title: `${data.meta.title} | Sri Lanka College of Radiologists`,
  description: `${data.meta.subtitle} — ${data.meta.tagline}. Download the official brochure.`,
};

export default function UpcomingSessionsPage() {
  const { meta } = data;

  return (
    <>
      <PageHeader
        title={meta.title}
        eyebrow="Academic Sessions"
        subtitle={meta.tagline}
        tone="dark"
      />

      {/* Brochure actions */}
      <section className="bg-navy-dark border-t border-navy-light/40">
        <div className="max-w-7xl 2xl:max-w-screen-2xl mx-auto px-5 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
            <p className="text-sm sm:text-base text-white/75 max-w-xl">
              View the official brochure below, or download a copy for offline
              reading.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href={meta.brochureUrl}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold bg-gold text-navy rounded-lg hover:bg-gold-light transition-colors"
              >
                <Download className="w-4 h-4" />
                Download Brochure
              </a>
              <a
                href={meta.brochureUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-white border border-white/30 rounded-lg hover:border-white/60 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Open in new tab
              </a>
            </div>
          </div>
        </div>
      </section>

      {/*
        =====================================================================
        SESSIONS FILM — commented out until AAS 2027 video assets are ready
        =====================================================================
        Restore by uncommenting the import at the top of this file and the
        block below. Component: SessionsVideoSection.tsx
        Assets:    src/lib/sessionsVideo.ts + public/videos/
        Autoplay:  home CTA sets SESSIONS_VIDEO_AUTOPLAY_KEY in sessionStorage

        <SessionsVideoSection
          title={meta.title}
          subtitle={`${meta.subtitle} · ${meta.tagline}`}
        />
        =====================================================================
      */}

      {/* In-site brochure viewer — scroll-only, no browser PDF chrome */}
      <section className="py-10 sm:py-12 lg:py-14 bg-surface">
        <div className="max-w-7xl 2xl:max-w-screen-2xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="mb-5">
            <p className="text-[11px] sm:text-xs font-semibold tracking-[0.2em] uppercase text-navy/50">
              Brochure
            </p>
            <h2 className="mt-2 font-heading text-2xl sm:text-3xl text-navy font-extrabold tracking-tight">
              Annual Academic Sessions 2027
            </h2>
            <div className="mt-3 w-12 h-0.5 bg-gold" />
          </div>

          <BrochureViewerSection
            url={meta.brochureUrl}
            title="AAS 2027 brochure"
          />
        </div>
      </section>
    </>
  );
}
