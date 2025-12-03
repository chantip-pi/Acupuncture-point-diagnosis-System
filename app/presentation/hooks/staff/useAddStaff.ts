import { useState } from "react";
import { addStaffUseCase } from "~/infrastructure/di/container";
import { CreateStaffDTO } from "~/application/dtos/StaffDTO";

export function useAddStaff() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addStaff = async (dto: CreateStaffDTO) => {
    setLoading(true);
    setError(null);

    try {
      await addStaffUseCase.execute(dto);
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to add Staff";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return { addStaff, loading, error };
}

