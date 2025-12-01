import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "@remix-run/react";
import { useGetPatientById } from "~/presentation/hooks/useGetPatientById";
import { useUpdatePatient } from "~/presentation/hooks/useUpdatePatient";
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
    <div className="flex flex-row h-[100svh] bg-[#DCE8E9] ml-20">
      <div
        className="flex flex-col flex-grow bg-white 
                      w-[100svh] ml-[55px] mt-[90px] h-[calc(100svh-10px)]
                      rounded-[37px] border border-gray-300
                      shadow-[0px_4px_4px_rgba(0,0,0,0.25)] p-12"
      >
        <div className="flex justify-between items-center h-auto w-[70svw] mb-6">
          <h1 className="text-[#2F919C] text-3xl">Edit Patient</h1>
        </div>

        <form className="flex flex-col gap-2.5" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
          <div>
            <label htmlFor="patientId" className="block mb-1 text-lg">
              Patient ID:
            </label>
            <input
              type="text"
              id="patientId"
              name="patientId"
              value={formData.patientId || ""}
              onChange={handleChange}
              className="w-[70svh] py-2 px-3 bg-gray-300 text-sm rounded-full"
              readOnly
            />
          </div>

          <div>
            <label htmlFor="nameSurname" className="block mb-1 text-lg">
              Name:
            </label>
            <input
              type="text"
              id="nameSurname"
              name="nameSurname"
              value={formData.nameSurname || ""}
              onChange={handleChange}
              className="w-[70svh] py-2 px-3 bg-gray-300 text-sm rounded-full"
              required
            />
          </div>

          <div>
            <label htmlFor="phoneNumber" className="block mb-1 text-lg">
              Telephone:
            </label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber || ""}
              onChange={handleChange}
              className="w-[70svh] py-2 px-3 bg-gray-300 text-sm rounded-full"
              required
            />
          </div>

          <div>
            <label htmlFor="birthday" className="block mb-1 text-lg">
              Birthday:
            </label>
            <input
              type="date"
              id="birthday"
              name="birthday"
              value={
                formData.birthday
                  ? new Date(formData.birthday).toISOString().split("T")[0]
                  : ""
              }
              onChange={handleChange}
              className="w-[70svh] py-2 px-3 bg-gray-300 text-sm rounded-full"
              required
            />
          </div>

          <div>
            <label htmlFor="gender" className="block mb-1 text-lg">
              Gender:
            </label>
            <select
              id="gender"
              name="gender"
              value={formData.gender || ""}
              onChange={handleChange}
              className="w-[70svh] py-2 pl-3 bg-gray-300 text-sm rounded-full"
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div>
            <label htmlFor="appointmentDate" className="block mb-1 text-lg">
              Appointment Date & Time:
            </label>
            <input
              type="datetime-local"
              id="appointmentDate"
              name="appointmentDate"
              value={
                formData.appointmentDate
                  ? new Date(formData.appointmentDate).toISOString().slice(0, 16)
                  : ""
              }
              onChange={handleChange}
              className="w-[70svh] py-2 px-3 bg-gray-300 text-sm rounded-full"
            />
         {(localError || updateError) && <p className="text-red-500">{localError || updateError}</p>} 
          </div>

          <div>
            <label htmlFor="courseCount" className="block mb-1 text-lg">
              Course Count:
            </label>
            <input
              type="number"
              id="courseCount"
              name="courseCount"
              value={formData.courseCount || ""}
              onChange={handleChange}
              className="w-[70svh] py-2 px-3 bg-gray-300 text-sm rounded-full"
              required
            />
          </div>

          <button
            onClick={handleSave}
            type="button"
            disabled={updating}
            className="bg-[#2F919C] text-white font-semibold py-2 px-6
                h-[50px] w-[14svh] rounded-lg shadow-[0px_4px_4px_rgba(0,0,0,0.25)]
                hover:bg-[#236971] transition-all text-xl ml-[35svw]"
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditPatient;
