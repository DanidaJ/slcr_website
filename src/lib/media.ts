/** Public Cloudflare R2 base for static site assets. */
export const R2_PUBLIC_BASE =
  process.env.NEXT_PUBLIC_R2_PUBLIC_BASE_URL ??
  "https://pub-1f63d7069b2c4b658a5586f25ed04bb5.r2.dev";

export const COLLEGE_BUILDING_IMAGE = `${R2_PUBLIC_BASE}/images/the-college/history-of-the-college/college-building.jpg`;

export const QUICK_LINK_LOGOS = {
  gov: `${R2_PUBLIC_BASE}/images/home/quick-links-logos/gov-logo.png`,
  slaerc: `${R2_PUBLIC_BASE}/images/home/quick-links-logos/slaerc-logo.png`,
  pgim: `${R2_PUBLIC_BASE}/images/home/quick-links-logos/pgim-logo.png`,
} as const;
