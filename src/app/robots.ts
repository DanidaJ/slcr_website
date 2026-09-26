import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/member-portal/", "/api/"],
    },
    sitemap: "https://www.radiologist.lk/sitemap.xml",
    host: "https://www.radiologist.lk",
  };
}
