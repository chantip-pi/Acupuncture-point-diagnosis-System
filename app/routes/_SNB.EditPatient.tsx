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
    const newValue = name === "courseCount" ? parseInt(value, 10) : value;

    if (name === "appointmentDate") {
      const dateValue = value ? new Date(value).toISOString() : null;
      setFormData((prev) => ({ ...prev, [name]: dateValue }));
      setLocalError(null);
    } else {
      setFormData((prev) => ({ ...prev, [name]: newValue }));
    }
  };

  const handleSave = async () => {
    if (!formData.appointmentDate) {
      setLocalError("Please select an appointment date.");
      return;
    }

    setLocalError(null);

    const result = await updatePatient({
      patientId: formData.patientId || 0,
      nameSurname: formData.nameSurname || "",
      phoneNumber: formData.phoneNumber || "",
      birthday: formData.birthday || "",
      gender: formData.gender || "",
      appointmentDate: formData.appointmentDate || null,
      courseCount: formData.courseCount || 0,
      firstVistDate: formData.firstVistDate || "",
    });

    if (result.success) {
      navigate("/patientDetail");
    } else {
      setLocalError(result.error || "Failed to save data.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!patientData) return <p>No patient data found</p>;

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
            <FormField label="Patient ID">
              <Input
                type="text"
                id="patientId"
                name="patientId"
                value={formData.patientId || ""}
                onChange={handleChange}
                readOnly
              />
            </FormField>

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

            <FormField label="Telephone">
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

            <FormField label="Appointment Date & Time" message={localError || updateError || undefined}>
              <Input
                type="datetime-local"
                id="appointmentDate"
                name="appointmentDate"
                value={
                  formData.appointmentDate
                    ? new Date(formData.appointmentDate).toISOString().slice(0, 16)
                    : ""
                }
                onChange={handleChange}
              />
            </FormField>

            <FormField label="Course Count">
              <Input
                type="number"
                id="courseCount"
                name="courseCount"
                value={formData.courseCount || ""}
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
