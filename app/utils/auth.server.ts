import { Authenticator } from "remix-auth";
import { FormStrategy } from "remix-auth-form";
import type { UserSession } from "~/presentation/session/userSession";
import { loginUseCase } from "~/infrastructure/di/container";
import { sessionStorage } from "./session.server";

// Wire authenticator to Remix cookie session storage
export const authenticator = new Authenticator<UserSession>(sessionStorage);

const formStrategy: any = new (FormStrategy as any)(
  async ({ form }: { form: FormData }) => {
    const usernameRaw = form.get("username");
    const passwordRaw = form.get("password");

    if (typeof usernameRaw !== "string" || typeof passwordRaw !== "string") {
      throw new Error("Username and password are required");
    }

    const username = usernameRaw.trim();
    const password = passwordRaw.trim();

    console.log("[FormStrategy] credentials received", {
      username,
      passwordLength: password.length,
    });

    const staff = await loginUseCase.execute({ username, password });

    console.log("[FormStrategy] result from loginUseCase", {
      hasStaff: !!staff,
    });

    if (!staff) {
      throw new Error("Invalid username or password.");
    }

    const { password: _pw, ...sessionUser } = staff;
    return sessionUser;
  }
);

authenticator.use(formStrategy, "user-pass");
