import { useEffect } from "react";
import { useNavigate, useLocation } from "@remix-run/react";
import { getUserSession } from "~/presentation/session/userSession";

/**
 * Hook that redirects to `/logIn` when there is no user session.
 * Intended to be called from layout components (e.g. `_SNB.tsx`) so
 * you don't have to repeat the session check in every page.
 */
export function useRequireAuth() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Only run on client
    try {
      const session = getUserSession();
      // If not logged in and not already on login page, redirect
      const isLoginPath = location.pathname === "/logIn";
      if (!session && !isLoginPath) {
        navigate("/logIn");
      }
    } catch (err) {
      // On any error, go to login to be safe
      if (location.pathname !== "/logIn") navigate("/logIn");
    }
  }, [navigate, location]);
}
