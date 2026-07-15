import type { NextConfig } from "next";

function r2RemotePattern() {
  const base = process.env.R2_PUBLIC_BASE_URL;
  if (!base) return null;
  try {
    const { hostname } = new URL(base);
    return { protocol: "https" as const, hostname };
  } catch {
    return null;
  }
}

const r2Pattern = r2RemotePattern();

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      // Always allow the public R2 bucket (hardcoded assets + env override).
      {
        protocol: "https",
        hostname: "pub-1f63d7069b2c4b658a5586f25ed04bb5.r2.dev",
      },
      ...(r2Pattern &&
      r2Pattern.hostname !== "pub-1f63d7069b2c4b658a5586f25ed04bb5.r2.dev"
        ? [r2Pattern]
        : []),
    ],
  },
};

export default nextConfig;
