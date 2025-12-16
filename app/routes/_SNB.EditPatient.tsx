import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "@remix-run/react";
import SideNavBar from "./_SNB";
import {
  Button,
  Card,
  FormField,
  Input,
  SectionHeading,
  Select,
} from "~/presentation/designSystem";
import { useGetPatientById } from "~/presentation/hooks/patient/useGetPatientById";
import { useUpdatePatient } from "~/presentation/hooks/patient/useUpdatePatient";
import { Patient } from "~/domain/entities/Patient";
import ErrorPage from "./components/common/ErrorPage";
import LoadingPage from "./components/common/LoadingPage";



function EditPatient() {
  const navigate = useNavigate();
  const patientId = useMemo(() => {
    const storedPatientID = sessionStorage.getItem("currentPatientID");
    if (!storedPatientID) return null;
    const id = storedPatientID.replace(/^"|"$/g, "");
    return id === "Guest" ? null : parseInt(id, 10);
  }, []);

  const { patient: patientData, loading, error } = useGetPatientById(patientId);
  const { updatePatient, loading: updating, error: updateError } = useUpdatePatient();
  const [formData, setFormData] = useState<Partial<Patient>>({});
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
  if (patientData) {
    setFormData(patientData);
  }
}, [patientData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const newValue = name === "remainingCourse" ? parseInt(value, 10) : value;

    
  };

  const handleSave = async () => {
    setLocalError(null);

    const result = await updatePatient({
      patientId: formData.patientId || 0,
      nameSurname: formData.nameSurname || "",
      phoneNumber: formData.phoneNumber || "",
      birthday: formData.birthday || "",
      gender: formData.gender || "",
      remainingCourse: formData.remainingCourse || 0,
    });

    if (result.success) {
      navigate("/patientDetail");
    } else {
      setLocalError(result.error || "Failed to save data.");
    }
  };

  if (loading) {
    return <LoadingPage />;
  }

  if (error) {
    return (
      <ErrorPage message={error} onRetry={() => window.location.reload()} />
    );
  }
  if (!patientData) {
    return (
      <ErrorPage message={"No patient data found"} onRetry={() => window.location.reload()} />
    );
  };

  return (
    <div className="flex min-h-screen bg-surface-muted">
  
      <main className="flex-1 p-8">
        <Card className="max-w-3xl">
          <SectionHeading title="Edit Patient" />

          <form
            className="grid grid-cols-1 gap-4 sm:grid-cols-2"
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
          >

            <FormField label="Name">
              <Input
                type="text"
                id="nameSurname"
                name="nameSurname"
                value={formData.nameSurname || ""}
                onChange={handleChange}
                required
              />
            </FormField>

            <FormField label="Phone Number">
              <Input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber || ""}
                onChange={handleChange}
                required
              />
            </FormField>

            <FormField label="Birthday">
              <Input
                type="date"
                id="birthday"
                name="birthday"
                value={
                  formData.birthday
                    ? new Date(formData.birthday).toISOString().split("T")[0]
                    : ""
                }
                onChange={handleChange}
                required
              />
            </FormField>

            <FormField label="Gender">
              <Select
                id="gender"
                name="gender"
                value={formData.gender || ""}
                onChange={handleChange}
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </Select>
            </FormField>

            <FormField label="Remaining Course">
              <Input
                type="number"
                id="remainingCourse"
                name="remainingCourse"
                value={formData.remainingCourse || ""}
                onChange={handleChange}
                required
              />
            </FormField>

            <div className="sm:col-span-2 flex justify-end">
              <Button
                onClick={handleSave}
                type="button"
                disabled={updating}
                variant="primary"
              >
                Save
              </Button>
            </div>
          </form>
        </Card>
      </main>
    </div>
  );
}

export default EditPatient;
