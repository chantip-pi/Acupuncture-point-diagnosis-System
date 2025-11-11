import { useState, useEffect } from "react";
import { getPatientsByAppointmentDateUseCase } from "~/infrastructure/di/container";
import { Patient } from "~/domain/entities/Patient";

export function useGetPatientsByAppointmentDate(date: Date | null) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!date) {
      setPatients([]);
      return;
    }

    const fetchPatients = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getPatientsByAppointmentDateUseCase.execute(date);
        setPatients(data);
      } catch (err) {
        setError("Failed to load patient data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, [date]);

  return { patients, loading, error };
}

