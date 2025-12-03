import { useNavigate } from "@remix-run/react";
import React, { useEffect, useState, FormEvent } from "react";
import { useGetStaffByUsername } from "~/presentation/hooks/staff/useGetStaffByUsername";
import ErrorPage from "./components/common/ErrorPage";
import LoadingPage from "./components/common/LoadingPage";
import ConfirmDialog from "./components/common/ConfirmDialog";
import { useUpdateStaff } from "~/presentation/hooks/staff/useUpdateStaff";
import { useDeleteStaff } from "~/presentation/hooks/staff/useDeleteStaff";

import { Staff } from "~/domain/entities/Staff";
import { getSelectedStaffUsername } from "~/presentation/session/staffSelectionSession";
import { getStaffByUsernameUseCase } from "~/infrastructure/di/container";

function EditStaff() {
  const navigate = useNavigate();

  // Load selected username on the client after hydration to avoid SSR/CSR mismatch
  const [selectedUsername, setSelectedUsername] = useState<string | null>(null);
  const [isSessionLoaded, setIsSessionLoaded] = useState(false);

  useEffect(() => {
    const username = getSelectedStaffUsername();
    setSelectedUsername(username);
    setIsSessionLoaded(true);
  }, []);

  const { staff, loading, error } = useGetStaffByUsername(selectedUsername);
  const { updateStaff, loading: updateLoading, error: updateError } =
    useUpdateStaff();
  const { deleteStaff, loading: deleteLoading, error: deleteError } =
    useDeleteStaff();

  const [formError, setFormError] = useState<string | null>(null);
  const [showDialog, setShowDialog] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    nameSurname: "",
    phoneNumber: "",
    birthday: "",
    gender: "",
    role: "",
    email: "",
  });

  // When staff data is loaded, populate the form
  useEffect(() => {
    if (staff && staff.staffId) {
      const formattedBirthday = staff.birthday.split("T")[0];

      setFormData({
        username: staff.username,
        nameSurname: staff.nameSurname,
        phoneNumber: staff.phoneNumber,
        birthday: formattedBirthday,
        gender: staff.gender,
        role: staff.role,
        email: staff.email,
      });
    }
  }, [staff]);

  // While we haven't loaded the session on the client yet, keep UI consistent
  if (!isSessionLoaded) {
    return <LoadingPage />;
  }

  // If no staff is selected or user has no permission, block access
  if (!selectedUsername || selectedUsername.toLowerCase() === "guest") {
    return <ErrorPage message="No staff selected or no permission." />;
  }

  if (loading) {
    return <LoadingPage />;
  }

  if (error) {
    return (
      <ErrorPage message={error} onRetry={() => window.location.reload()} />
    );
  }

  if (!staff) {
    return <ErrorPage message="No staff selected or staff not found." />;
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const formattedValue =
      name === "gender"
        ? value.charAt(0).toUpperCase() + value.slice(1)
        : value;

    setFormData((prevData) => ({
      ...prevData,
      [name]: formattedValue,
    }));
  };

  const checkUsernameAvailability = async () => {
    try {
      // If username hasn't changed, it's always valid
      if (formData.username === staff.username) {
        return true;
      }

      // Check if another staff member already uses this username
      try {
        const existingStaff: Staff | null =
          await getStaffByUsernameUseCase.execute(formData.username);

        if (existingStaff && existingStaff.staffId !== staff.staffId) {
          setFormError(
            "Username already taken. Please choose another username.",
          );
          return false;
        }

        return true;
      } catch {
        // If lookup fails (e.g. user not found), treat as available
        return true;
      }
    } catch (error) {
      setFormError("Error checking username availability. Please try again.");
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
      // Prepare DTO for update
      const dto = {
        staffId: staff.staffId,
        password: staff.password,
        ...formData,
      };
      const result = await updateStaff(dto);
      if (result.success) {
        console.log("Data successfully saved");
        navigate("/staffListView");
      } else {
        setFormError(result.error || "Failed to save staff data.");
      }
    } catch (err) {
      setFormError("Error submitting data. Please try again.");
      console.error("Request error:", err);
    }
  };

  const validateForm = () => {
    const { phoneNumber, birthday, email } = formData;
    const telRegex = /^\d{10}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setFormError("Your email is not the right pattern.");
      return false;
    }

    if (!telRegex.test(phoneNumber)) {
      setFormError("Telephone number must be 10 digits.");
      return false;
    }

    const birthDate = new Date(birthday);
    const today = new Date();
    if (birthDate > today) {
      setFormError("Birthday cannot be in the future.");
      return false;
    }

    return true;
  };

  const handleDeleteUser = async () => {
    try {
      await deleteStaff(staff.staffId);
      navigate("/staffListView");
    } catch (err) {
      setFormError("Error deleting staff. Please try again.");
    }
  };


  return (
    <div className="flex flex-col w-[70svw] bg-[#DCE8E9] min-h-screen">
      <div className="flex justify-center items-center pt-12 pb-12">
        <div className="p-6 border border-gray-300 rounded-3xl bg-white shadow-lg w-[50svw] flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-[#1FA1AF] text-2xl">Edit Staff</h1>
            <span className="text-[#1FA1AF] text-2xl">
              {formData.nameSurname}
            </span>
            <div className="flex justify-center">
              <button
                type="button"
                className="py-2 px-4 bg-[#FF0000] text-white rounded-3xl hover:bg-red-700"
                disabled={updateLoading || deleteLoading}
                onClick={() => setShowDialog(true)}
              >
                Delete
              </button>
            </div>
          </div>

          <ConfirmDialog
            isOpen={showDialog}
         title={`Delete ${formData.nameSurname}`}
            message="Do you really want to delete this user?"
            cancelText="Cancel"
            isLoading={updateLoading}
            onConfirm={handleDeleteUser}
            onCancel={() => setShowDialog(false)}
          />


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
              <label htmlFor="nameSurname" className="block mb-1">
                Name:
              </label>
              <input
                type="text"
                id="nameSurname"
                name="nameSurname"
                value={formData.nameSurname}
                onChange={handleChange}
                className="w-full py-2 px-3 bg-gray-300 text-sm rounded-3xl"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="phoneNumber" className="block mb-1">
                Telephone:
              </label>
              <input
                type="string"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
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

            {(formError || updateError) && <p className="text-red-500 mb-4">{formError || updateError}</p>}

            <div className="flex justify-center mt-auto">
              <button
                type="submit"
                className="w-1/2 py-2 px-4 bg-[#1FA1AF] text-white rounded-3xl"
                disabled={updateLoading}
              >
                {updateLoading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditStaff;
