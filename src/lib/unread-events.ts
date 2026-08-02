/** Cross-component signal so the navbar can refresh unread badges immediately. */

export const UNREAD_CHANGED_EVENT = "slcr:unread-changed";

export function notifyUnreadChanged() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(UNREAD_CHANGED_EVENT));
}

export function onUnreadChanged(handler: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(UNREAD_CHANGED_EVENT, handler);
  return () => window.removeEventListener(UNREAD_CHANGED_EVENT, handler);
}
