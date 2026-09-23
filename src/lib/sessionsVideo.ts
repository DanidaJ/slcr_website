/**
 * Sessions film helpers — used by SessionsVideoSection.
 *
 * Currently unused on the upcoming-sessions page (section commented out until
 * AAS 2027 video assets are ready). To restore:
 * 1. Uncomment SessionsVideoSection on upcoming-sessions/page.tsx
 * 2. Uncomment the hero CTA autoplay onClick in HeroSection.tsx
 * 3. Point SESSIONS_VIDEO_SOURCES / POSTER at the new year assets
 */

/** Set by the home page CTA so the sessions page greets visitors with the video. */
export const SESSIONS_VIDEO_AUTOPLAY_KEY = "slcr:sessions-video-autoplay";

export const SESSIONS_VIDEO_SOURCES = [
  { src: "/videos/academic-sessions-2026.mp4", type: "video/mp4" },
];

export const SESSIONS_VIDEO_POSTER = "/videos/academic-sessions-2026-poster.jpg";
