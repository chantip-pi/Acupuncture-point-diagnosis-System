import { useState } from "react";
import { updatePatientUseCase } from "~/infrastructure/di/container";
import { UpdatePatientDTO } from "~/application/dtos/PatientDTO";

export function useUpdatePatient() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updatePatient = async (dto: UpdatePatientDTO) => {
    setLoading(true);
    setError(null);

    try {
      await updatePatientUseCase.execute(dto);
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update patient";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return { updatePatient, loading, error };
}

