/** URL-safe slug from a title. */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

/** Ensure slug is unique by appending -2, -3, … */
export async function uniqueSlug(
  base: string,
  exists: (slug: string) => Promise<boolean>
): Promise<string> {
  const root = slugify(base) || "post";
  if (!(await exists(root))) return root;
  let n = 2;
  while (await exists(`${root}-${n}`)) n += 1;
  return `${root}-${n}`;
}
