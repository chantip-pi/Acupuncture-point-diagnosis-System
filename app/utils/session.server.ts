import { createCookieSessionStorage } from "@remix-run/node";
import type { UserSession } from "~/presentation/session/userSession";

const sessionSecret = process.env.SESSION_SECRET || "dev-secret";

if (!sessionSecret) {
  throw new Error("SESSION_SECRET must be set");
}

export const sessionStorage = createCookieSessionStorage<UserSession>({
  cookie: {
    name: "__session",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: [sessionSecret],
    secure: process.env.NODE_ENV === "production",
  },
});

export const { getSession, commitSession, destroySession } = sessionStorage;



