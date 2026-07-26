"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Play } from "lucide-react";
import VideoPlayerModal from "./VideoPlayerModal";
import {
  SESSIONS_VIDEO_AUTOPLAY_KEY,
  SESSIONS_VIDEO_POSTER,
  SESSIONS_VIDEO_SOURCES,
} from "@/lib/sessionsVideo";

type SessionsVideoSectionProps = {
  title: string;
  subtitle: string;
};

export default function SessionsVideoSection({
  title,
  subtitle,
}: SessionsVideoSectionProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fromHomeCta =
      sessionStorage.getItem(SESSIONS_VIDEO_AUTOPLAY_KEY) === "1";
    const fromLink =
      new URLSearchParams(window.location.search).get("video") === "1";
    if (!fromHomeCta && !fromLink) return;

    sessionStorage.removeItem(SESSIONS_VIDEO_AUTOPLAY_KEY);
    if (fromLink) {
      window.history.replaceState(null, "", window.location.pathname);
    }
    setOpen(true);
  }, []);

  return (
    <>
      <section className="bg-surface pt-12 sm:pt-14 lg:pt-16">
        <div className="max-w-7xl 2xl:max-w-screen-2xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="grid items-center gap-8 lg:grid-cols-[1fr_1.15fr] lg:gap-12">
            <div>
              <p className="text-[11px] sm:text-xs font-semibold tracking-[0.2em] uppercase text-navy/50">
                Sessions Film
              </p>
              <h2 className="mt-2 font-heading text-2xl sm:text-3xl text-navy font-extrabold tracking-tight">
                Watch the story of our Academic Sessions
              </h2>
              <div className="mt-3 w-12 h-0.5 bg-gold" />
              <p className="mt-4 text-[15px] leading-relaxed text-navy/60">
                {subtitle}
              </p>
              <button
                onClick={() => setOpen(true)}
                className="mt-6 inline-flex items-center gap-2.5 rounded-lg bg-gold px-6 py-3 text-sm font-semibold text-navy transition-colors hover:bg-gold-light"
              >
                <Play className="h-4 w-4" fill="currentColor" />
                Play video
              </button>
            </div>

            <button
              onClick={() => setOpen(true)}
              aria-label={`Play the ${title} video`}
              className="group relative block w-full overflow-hidden rounded-2xl border border-navy/10 bg-navy shadow-sm"
            >
              <div className="relative aspect-video w-full">
                <Image
                  src={SESSIONS_VIDEO_POSTER}
                  alt={`Opening frame of the ${title} film`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-navy-dark/25 transition-colors duration-300 group-hover:bg-navy-dark/10" />
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gold/90 text-navy shadow-xl transition-transform duration-300 group-hover:scale-110 sm:h-20 sm:w-20">
                    <Play className="ml-1 h-7 w-7 sm:h-8 sm:w-8" fill="currentColor" />
                  </span>
                </span>
                <span className="absolute bottom-3 right-3 rounded-md bg-navy-dark/75 px-2 py-1 text-[11px] font-semibold text-white/85">
                  0:58
                </span>
              </div>
            </button>
          </div>
        </div>
      </section>

      <VideoPlayerModal
        open={open}
        sources={SESSIONS_VIDEO_SOURCES}
        poster={SESSIONS_VIDEO_POSTER}
        title={title}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
