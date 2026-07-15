const PLACEHOLDER = "/images/Profile-Placeholder.png";

/** Legacy thumbnail paths in MongoDB → canonical files under past-presidents/. */
const IMAGE_ALIASES: Record<string, string> = {
  "/images/prof_harsha_dissanayake-300x300.jpg":
    "/images/past-presidents/prof_harsha_dissanayake.jpg",
  "/images/shantha_hettiarachchi-138x150.jpg":
    "/images/past-presidents/shantha_hettiarachchi.jpg",
  "/images/Dr-Pandula-Hettiarachchi-150x150.jpg":
    "/images/past-presidents/Dr-Pandula-Hettiarachchi_pp.jpg",
  "/images/Dr.-Prasad-De-Silva-1-768x1024-1-138x150.jpg":
    "/images/past-presidents/Dr.-Prasad-De-Silva-1-768x1024-1.jpg",
  "/images/DrASPallewatte-138x150.jpg":
    "/images/past-presidents/DrASPallewatte.jpg",
  "/images/Dr-Shanthini-Rosairo-138x150.jpg":
    "/images/past-presidents/Dr-Shanthini-Rosairo.jpg",
  "/images/Dr.-D.J.-Wickramarathna-138x150.jpg":
    "/images/past-presidents/Dr.-D.J.-Wickramarathna.jpg",
  "/images/Dr_m_u_j_fernando.jpg":
    "/images/past-presidents/dr_jerrad_fernando.jpg",
};

const CACHE_VERSION =
  process.env.NEXT_PUBLIC_STATIC_IMAGE_VERSION ?? "2";

/** Resolve legacy DB paths and bust Next/browser cache for local static files. */
export function resolvePresidentImage(
  path: string | null | undefined
): string {
  if (!path?.trim()) return PLACEHOLDER;
  const resolved = IMAGE_ALIASES[path] ?? path;
  if (resolved.startsWith("http://") || resolved.startsWith("https://")) {
    return resolved;
  }
  const sep = resolved.includes("?") ? "&" : "?";
  return `${resolved}${sep}v=${CACHE_VERSION}`;
}

export function isLocalStaticImage(path: string): boolean {
  const base = path.split("?")[0];
  return base.startsWith("/images/");
}
