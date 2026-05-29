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
      ...(r2Pattern ? [r2Pattern] : []),
    ],
  },
};

export default nextConfig;
