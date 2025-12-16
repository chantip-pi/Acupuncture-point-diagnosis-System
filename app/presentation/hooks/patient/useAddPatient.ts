import { useState } from "react";
import { addPatientUseCase } from "~/infrastructure/di/container";
import { CreatePatientDTO } from "~/application/dtos/PatientDTO";

export function useAddPatient() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addPatient = async (dto: CreatePatientDTO) => {
    setLoading(true);
    setError(null);

    try {
      await addPatientUseCase.execute(dto);
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to add patient";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return { addPatient, loading, error };
}

