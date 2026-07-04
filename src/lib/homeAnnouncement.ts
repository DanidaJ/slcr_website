/** Whether an announcement is still visible on the given calendar day. */
export function isHomeAnnouncementActive(
  expiresAt: string,
  now = new Date()
): boolean {
  const today = now.toISOString().slice(0, 10);
  return today <= expiresAt.slice(0, 10);
}
