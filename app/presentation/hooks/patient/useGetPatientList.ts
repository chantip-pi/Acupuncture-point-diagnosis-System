import { useState, useEffect } from "react";
import { getPatientListUseCase } from "~/infrastructure/di/container";
import { Patient } from "~/domain/entities/Patient";

export function useGetPatientList() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatients = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getPatientListUseCase.execute();
        setPatients(data);
      } catch (err) {
        setError("Failed to load patient data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  return { patients, loading, error };
}

