import React, { useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "@remix-run/react";
import { useAddPatient } from "~/presentation/hooks/useAddPatient";

function AddNewPatient() {
  const [formData, setFormData] = useState({
    name_surname: "",
    phone_number: "",
    birthday: "",
    gender: "",
    appointment_date: "",
    course_count: 0,
    first_visit_date: new Date().toISOString().slice(0, 10),
  });
  const { addPatient, loading, error: hookError } = useAddPatient();
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === "course_count" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!formData.appointment_date) {
      setError("You need to provide an appointment date.");
      return;
    }

    const result = await addPatient({
      name_surname: formData.name_surname,
      phone_number: formData.phone_number,
      birthday: formData.birthday,
      gender: formData.gender,
      appointment_date: new Date(formData.appointment_date).toISOString(),
      course_count: formData.course_count,
      first_visit_date: formData.first_visit_date,
    });

    if (result.success) {
      navigate("/listViewPatient");
    } else {
      setError(result.error || "Failed to add patient");
    }
  };

  return (
    <div className="flex flex-row w-[78svw]">
      <div className="flex flex-row justify-center items-start w-[75svw] h-screen pt-10 pb-7 ">
        <div className="p-6 border border-gray-300 h-[90svh] rounded-3xl bg-white shadow-lg w-[40svw]">
          <div className="flex flex-row justify-between mb-6">
            <h1 className="text-[#1FA1AF] text-2xl">Add New Patient</h1>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name_surname" className="block mb-1">
                Name Surname:
              </label>
              <input
                type="text"
                id="name_surname"
                name="name_surname"
                value={formData.name_surname}
                onChange={handleChange}
                className="w-full py-2 px-3 bg-gray-300 text-sm rounded-3xl"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="phone_number" className="block mb-1">
                Telephone:
              </label>
              <input
                type="tel"
                id="phone_number"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                className="w-full py-2 px-3 bg-gray-300 text-sm rounded-3xl"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="birthday" className="block mb-1">
                Birthday:
              </label>
              <input
                type="date"
                id="birthday"
                name="birthday"
                value={formData.birthday}
                onChange={handleChange}
                className="w-full py-2 px-3 bg-gray-300 text-sm rounded-3xl"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="gender" className="block mb-1">
                Gender:
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full py-2 px-3 bg-gray-300 text-sm rounded-3xl"
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <div className="mb-4">
              <label htmlFor="appointment_date" className="block mb-1">
                Appointment Date & Time:
              </label>
              <input
                type="datetime-local"
                id="appointment_date"
                name="appointment_date"
                value={formData.appointment_date}
                onChange={handleChange}
                className="w-full py-2 px-3 bg-gray-300 text-sm rounded-3xl"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="course_count" className="block mb-1">
                Course Count:
              </label>
              <input
                type="number"
                id="course_count"
                name="course_count"
                value={formData.course_count}
                onChange={handleChange}
                className="w-full py-2 px-3 bg-gray-300 text-sm rounded-3xl"
                required
              />
            </div>

            {(error || hookError) && <p className="text-red-500">{error || hookError}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-36 py-2 bg-[#1FA1AF] text-white font-bold rounded-lg disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddNewPatient;
