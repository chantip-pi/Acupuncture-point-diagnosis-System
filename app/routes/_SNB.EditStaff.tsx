import { useNavigate } from "@remix-run/react";
import React, { useEffect, useState, FormEvent } from "react";
import { getSelectedStaffUsername } from "~/presentation/session/staffSelectionSession";

interface Staff {
  staff_id: number;
  username: string;
  staff_name: string;
  staff_phone_number: string;
  birthday: string;
  gender: string;
  role: string;
  email: string;
}

function EditStaff() {
  const navigate = useNavigate();
  const [staffData, setStaffData] = useState<Staff | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<string>("Guest");
  const [currentStaff, setCurrentStaff] = useState<string>("Guest");

  const [formData, setFormData] = useState({
    staff_id: "",
    username: "",
    staff_name: "", 
    staff_phone_number: "",
    birthday: "",
    gender: "",
    role: "",
    email: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      const storedStaff = getSelectedStaffUsername();
      const currentStaffValue = storedStaff ? storedStaff.toLowerCase() : "guest";
      setCurrentStaff(currentStaffValue);
  
      if (currentStaffValue === "guest") {
        setError("No username found in session.");
        setLoading(false);
        return;
      }
  
      try {
        const response = await fetch(`https://dinosaur.prakasitj.com/staff/searchbyUsername/${currentStaffValue}`);
        if (!response.ok) {
          throw new Error("Failed to fetch staff data");
        }
  
        const data = await response.json();
        if (data.length > 0) {
          setStaffData(data[0]);
  
          const formattedBirthday = data[0].birthday.split("T")[0];
  
          setFormData({
            staff_id: data[0].staff_id,
            username: data[0].username,
            staff_name: data[0].staff_name,
            staff_phone_number: data[0].staff_phone_number,
            birthday: formattedBirthday,
            gender: data[0].gender,
            role: data[0].role,
            email: data[0].email,
          });
        } else {
          setError("No data found for this username.");
        }
      } catch (err) {
        setError("Failed to load data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);
   
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const formattedValue = name === 'gender' ? value.charAt(0).toUpperCase() + value.slice(1) : value;

    setFormData((prevData) => ({
      ...prevData,
      [name]: formattedValue,
    }));
  };

  const checkUsernameAvailability = async () => {
    try {
      if (formData.username === staffData?.username) {
        return true;
      }
  
      const response = await fetch(`https://dinosaur.prakasitj.com/staff/searchbyUsername/${formData.username}`);
      if (!response.ok) {
        throw new Error("Error checking username availability");
      }
  
      const data = await response.json();
      if (data.length > 0) {
        setError("Username already taken. Please choose another username.");
        return false;
      }
  
      return true;
    } catch (error) {
      setError("Error checking username availability. Please try again.");
      console.error(error);
      return false;
    }
  };
  
  

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    if (!validateForm()) return;

    const isUsernameAvailable = await checkUsernameAvailability();
    if (!isUsernameAvailable) return;

    console.log("Form data being submitted:", formData); 
  
    submitToApi();
  };  

  const submitToApi = async () => {
    try {
      const response = await fetch("https://dinosaur.prakasitj.com/staff/editStaff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Full error response:", errorData);
        setError(errorData.message || "Failed to save staff data.");
        return;
      }
  
      console.log("Data successfully saved");
      navigate("/staffListView");
    } catch (err) {
      setError("Error submitting data. Please try again.");
      console.error("Request error:", err);
    }
  };
  
  const validateForm = () => {
    const { staff_phone_number, birthday, email } = formData;
    const telRegex = /^\d{10}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 

    if (!emailRegex.test(email)) {
      setError("Your email is not the right pattern.");
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

    return true;
  };

  return (
    <div className="flex flex-col w-[70svw] bg-[#DCE8E9] min-h-screen">
      <div className="flex justify-center items-center pt-12 pb-12">
        <div className="p-6 border border-gray-300 rounded-3xl bg-white shadow-lg w-[50svw] flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-[#1FA1AF] text-2xl">Edit Staff</h1>
            <span className="text-[#1FA1AF] text-2xl">{formData.staff_name}</span>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col flex-grow">
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
                type="string"
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

            {error && <p className="text-red-500 mb-4">{error}</p>}

            <div className="flex justify-center mt-auto">
              <button
                type="submit"
                className="w-1/2 py-2 px-4 bg-[#1FA1AF] text-white rounded-3xl"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditStaff;
