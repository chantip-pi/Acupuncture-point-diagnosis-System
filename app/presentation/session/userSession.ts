import { Staff } from "~/domain/entities/Staff";
import { isBrowser } from "./storageUtils";

export type UserSession = Omit<Staff, "password">;

export const USER_SESSION_KEY = "userSession";

export function setUserSession(staff: Staff): void {
  if (!isBrowser()) return;
  const { password, ...sessionData } = staff;
  window.sessionStorage.setItem(USER_SESSION_KEY, JSON.stringify(sessionData));
}

export function getUserSession(): UserSession | null {
  if (!isBrowser()) return null;
  const raw = window.sessionStorage.getItem(USER_SESSION_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as UserSession;
  } catch (error) {
    console.warn("Failed to parse user session. Clearing session.", error);
    clearUserSession();
    return null;
  }
}

export function clearUserSession(): void {
  if (!isBrowser()) return;
  window.sessionStorage.removeItem(USER_SESSION_KEY);
}

export function updateUserSession(partial: Partial<UserSession>): void {
  if (!isBrowser()) return;
  const current = getUserSession();
  if (!current) return;
  const nextSession = { ...current, ...partial };
  window.sessionStorage.setItem(USER_SESSION_KEY, JSON.stringify(nextSession));
}
