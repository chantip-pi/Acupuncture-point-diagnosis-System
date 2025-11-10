import { useNavigate } from "@remix-run/react";
import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";

function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    staff_name: "",
    staff_phone_number: "",
    birthday: "",
    gender: "",
    role: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const checkUsernameAvailability = async () => {
    try {
      const response = await fetch(`https://dinosaur.prakasitj.com/staff/searchbyUsername/${formData.username}`);
      if (!response.ok) {
        throw new Error("Error checking username availability");
      }

      const data = await response.json();
      if (data.length > 0) {
        setError("Username already taken. Please choose another username.");
        return false;
      }

      setError(null); 
      return true;
    } catch (error) {
      setError("Error checking username availability. Please try again.");
      console.error(error);
      return false;
    }
  };

  const validateForm = () => {
    const { staff_phone_number, birthday, email, password, confirmPassword } = formData;
    const telRegex = /^\d{10}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setError("Your email is not in the correct format.");
      return false;
    }

    if (!telRegex.test(staff_phone_number)) {
      setError("Telephone number must be 10 digits.");
      return false;
    }

    const birthDate = new Date(birthday);
    const today = new Date();
    if (birthDate > today) {
      setError("Birthday cannot be in the future.");
      return false;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please try again.");
      return false;
    }

    setError(null); 
    return true;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    const isUsernameAvailable = await checkUsernameAvailability();
    if (!isUsernameAvailable) return;

    const formattedGender = formData.gender.charAt(0).toUpperCase() + formData.gender.slice(1);

    const dataToSubmit = {
      ...formData,
      gender: formattedGender,
    };

    await submitToApi(dataToSubmit); 
  };

  const submitToApi = async (data: typeof formData) => {
    try {
      const response = await fetch("https://dinosaur.prakasitj.com/staff/addStaff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Full error response:", errorData);
        setError(errorData.message || "Failed to add staff data.");
        return;
      }

      navigate("/staffListView");
    } catch (err) {
      setError("Error submitting data. Please try again.");
      console.error("Request error:", err);
    }
  };

  return (
    <div className="flex flex-row w-[78svw]">
      <div className="flex flex-row justify-center items-start w-[75svw] pt-10 pb-7">
        <div className="p-6 border border-gray-300 h-[125svh] rounded-3xl bg-white shadow-lg w-[40svw]">
          <div className="flex flex-row justify-between mb-6">
            <h1 className="text-[#1FA1AF] text-2xl">Sign up new staff</h1>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="username" className="block mb-1">
                Username:
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full py-2 px-3 bg-gray-300 text-sm rounded-3xl"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="staff_name" className="block mb-1">
                Name:
              </label>
              <input
                type="text"
                id="staff_name"
                name="staff_name"
                value={formData.staff_name}
                onChange={handleChange}
                className="w-full py-2 px-3 bg-gray-300 text-sm rounded-3xl"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="staff_phone_number" className="block mb-1">
                Telephone:
              </label>
              <input
                type="tel"
                id="staff_phone_number"
                name="staff_phone_number"
                value={formData.staff_phone_number}
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
              <label htmlFor="role" className="block mb-1">
                Role:
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full py-2 px-3 bg-gray-300 text-sm rounded-3xl"
                required
              >
                <option value="">Select Role</option>
                <option value="Staff">Staff</option>
                <option value="Doctor">Doctor</option>
              </select>
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block mb-1">
                Email:
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full py-2 px-3 bg-gray-300 text-sm rounded-3xl"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="block mb-1">
                Password:
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full py-2 px-3 bg-gray-300 text-sm rounded-3xl"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="confirmPassword" className="block mb-1">
                Confirm Password:
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full py-2 px-3 bg-gray-300 text-sm rounded-3xl"
                required
              />
            </div>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            <div className="flex justify-center mt-auto">
              <button
                type="submit"
                className="w-1/2 py-2 px-4 bg-[#1FA1AF] text-white rounded-3xl"
              >
                Sign Up
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
