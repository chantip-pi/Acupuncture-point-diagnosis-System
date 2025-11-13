import { isBrowser } from "./storageUtils";

const CURRENT_STAFF_KEY = "currentStaff";

export function setSelectedStaffUsername(username: string): void {
  if (!isBrowser()) return;
  window.sessionStorage.setItem(CURRENT_STAFF_KEY, username);
}

export function getSelectedStaffUsername(): string | null {
  if (!isBrowser()) return null;
  return window.sessionStorage.getItem(CURRENT_STAFF_KEY);
}

export function clearSelectedStaffUsername(): void {
  if (!isBrowser()) return;
  window.sessionStorage.removeItem(CURRENT_STAFF_KEY);
}
