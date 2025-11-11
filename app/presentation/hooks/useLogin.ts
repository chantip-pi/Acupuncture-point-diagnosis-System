import { useState } from "react";
import { loginUseCase } from "~/infrastructure/di/container";
import { LoginDTO } from "~/application/dtos/StaffDTO";
import { Staff } from "~/domain/entities/Staff";

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (dto: LoginDTO): Promise<Staff | null> => {
    setLoading(true);
    setError(null);

    try {
      const staff = await loginUseCase.execute(dto);
      if (!staff) {
        setError("Invalid username or password.");
        return null;
      }
      return staff;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to login. Please try again.";
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
}

