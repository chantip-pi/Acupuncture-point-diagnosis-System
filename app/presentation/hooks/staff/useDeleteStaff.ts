import { useState } from "react";
import { deleteStaffUsecase } from "~/infrastructure/di/container";

export function useDeleteStaff() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteStaff = async (staffId: number) => {
    setLoading(true);
    setError(null);

    try {
      await deleteStaffUsecase.execute(staffId);
      return { success: true };
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to delete staff";
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  return { deleteStaff, loading, error };
}

