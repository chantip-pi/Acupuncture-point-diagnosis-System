import { useState, useEffect } from "react";
import { getStaffListUseCase } from "~/infrastructure/di/container";
import { Staff } from "~/domain/entities/Staff";

export function useGetStaffList() {
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStaff = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getStaffListUseCase.execute();
        setStaffList(data);
      } catch (err) {
        setError("Failed to load staff data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, []);

  return { staffList, loading, error };
}

