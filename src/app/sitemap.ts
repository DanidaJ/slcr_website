import type { MetadataRoute } from "next";

const SITE_URL = "https://www.radiologist.lk";

/** Public marketing/content routes for search engines (excludes admin & portal). */
const STATIC_ROUTES = [
  "/",
  "/contact-us",
  "/privacy-policy",
  "/terms-of-use",
  "/the-college/history-of-the-college",
  "/the-college/president-message",
  "/the-college/president-and-council",
  "/the-college/past-presidents",
  "/the-college/past-presidents-message",
  "/the-college/past-councils",
  "/the-college/committees-and-subcommittees",
  "/academic-sessions/upcoming-sessions",
  "/academic-sessions/past-sessions",
  "/membership/description",
  "/membership/fellowship",
  "/membership/register",
  "/membership/member-login",
  "/news-and-events",
  "/publications/journals",
  "/publications/newsletters",
  "/educations",
  "/educations/cpd",
  "/educations/workshops",
  "/educations/young-radiologist-forum",
  "/educations/gold-medalists",
  "/educations/orators",
  "/educations/fellowship-holders",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return STATIC_ROUTES.map((path) => ({
    url: `${SITE_URL}${path === "/" ? "" : path}`,
    lastModified,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.7,
  }));
}
