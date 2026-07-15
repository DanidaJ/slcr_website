const LAST_USERNAME_KEY = "slcr_last_username";

export function getLastLoginUsername(): string {
  if (typeof window === "undefined") return "";
  try {
    return localStorage.getItem(LAST_USERNAME_KEY) ?? "";
  } catch {
    return "";
  }
}

export function saveLastLoginUsername(username: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LAST_USERNAME_KEY, username.trim().toLowerCase());
  } catch {
    // ignore quota / private mode
  }
}
