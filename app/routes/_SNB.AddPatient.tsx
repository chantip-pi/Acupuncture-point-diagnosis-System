import React, { useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "@remix-run/react";
import {
  Button,
  Card,
  FormField,
  Input,
  SectionHeading,
  Select,
} from "~/presentation/designSystem";
import { useAddPatient } from "~/presentation/hooks/patient/useAddPatient";

function AddPatient() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nameSurname: "",
    phoneNumber: "",
    birthday: "",
    gender: "",
    appointmentDate: "",
    remainingCourse: 0,
    congenitalDisease: "",
    surgeryHistory: "",
  });

  const { addPatient, loading, error: hookError } = useAddPatient();
  const [error, setError] = useState<string>("");

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "remainingCourse" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!formData.appointmentDate) {
      setError("You need to provide an appointment date.");
      return;
    }

    const result = await addPatient({
      nameSurname: formData.nameSurname,
      phoneNumber: formData.phoneNumber,
      birthday: formData.birthday,
      gender: formData.gender,
      appointmentDate: new Date(formData.appointmentDate).toISOString(),
      remainingCourse: formData.remainingCourse,
      congenitalDisease: formData.congenitalDisease,
      surgeryHistory: formData.surgeryHistory,
    });

    if (result.success) {
      navigate("/patientList");
    } else {
      setError(result.error || "Failed to add patient");
    }
  };

  return (
    <div className="flex min-h-screen bg-surface-muted">
      <main className="flex-1 p-8">
        <Card className="max-w-3xl">
          <SectionHeading title="Add New Patient" />

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2"
          >
            <FormField label="Name Surname">
              <Input
                type="text"
                id="nameSurname"
                name="nameSurname"
                value={formData.nameSurname}
                onChange={handleChange}
                required
              />
            </FormField>

            <FormField label="Phone Number">
              <Input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
              />
            </FormField>

            <FormField label="Birthday">
              <Input
                type="date"
                id="birthday"
                name="birthday"
                value={formData.birthday}
                onChange={handleChange}
                required
              />
            </FormField>

            <FormField label="Gender">
              <Select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </Select>
            </FormField>

            <FormField label="Congenital Disease">
              <Input
                type="text"
                id="congenitalDisease"
                name="congenitalDisease"
                value={formData.congenitalDisease}
                onChange={handleChange}
                required
              />
            </FormField>

            <FormField label="Surgery History">
              <Input
                type="text"
                id="surgeryHistory"
                name="surgeryHistory"
                value={formData.surgeryHistory}
                onChange={handleChange}
                required
              />
            </FormField>

            <FormField label="Appointment Date & Time">
              <Input
                type="datetime-local"
                id="appointmentDate"
                name="appointmentDate"
                value={formData.appointmentDate}
                onChange={handleChange}
              />
            </FormField>

            <FormField label="Course Count">
              <Input
                type="number"
                id="remainingCourse"
                name="remainingCourse"
                value={formData.remainingCourse}
                onChange={handleChange}
                min={0}
                required
              />
            </FormField>

            {(error || hookError) && (
              <p className="text-md text-red-600 sm:col-span-2">
                {error || hookError}
              </p>
            )}

            <div className="sm:col-span-2 flex justify-end">
              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </Card>
      </main>
    </div>
  );
}

export default AddPatient;
