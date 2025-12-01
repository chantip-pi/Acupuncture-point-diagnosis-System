import React, { useEffect, useMemo, useState } from "react";
import { useGetStaffByUsername } from "~/presentation/hooks/useGetStaffByUsername";
import { getUserSession } from "~/presentation/session/userSession";
import { getSelectedStaffUsername } from "~/presentation/session/staffSelectionSession";

function StaffDetail() {
  const [username, setUsername] = useState<string | null>(null);
  const [sessionError, setSessionError] = useState<string | null>(null);

  useEffect(() => {
    const selectedUsername = getSelectedStaffUsername();
    if (selectedUsername) {
      setUsername(selectedUsername);
      return;
    }

    const session = getUserSession();
    if (!session) {
      setSessionError("No user information found. Please log in again.");
      return;
    }

    setUsername(session.username);
  }, []);

  const { staff, loading, error } = useGetStaffByUsername(username);
  const errorMessage = useMemo(() => sessionError ?? error, [sessionError, error]);

  const age = useMemo(() => {
    if (!staff) return "";
    return calculateAge(staff.birthday);
  }, [staff]);

  return (
    <div className="flex flex-row justify-center items-start w-[60svw] pt-10 pb-7">
      <div className="p-6 border border-gray-300 rounded-3xl bg-white shadow-lg w-[43svw]">
        <div className="flex flex-row items-center mb-6 mt-7 ml-5">
          <div
            className="w-[0.625rem] h-[4.25rem] bg-[#2F919C] rounded-3xl"
            style={{ filter: "drop-shadow(0 0.25rem 0.125rem #C3C3C3)" }}
          ></div>
          <h1 className="text-black text-2xl ml-3">Staff Details</h1>
        </div>

        <div className="flex flex-col w-[30svw] h-[60svh] bg-[#DCE8E9] rounded-3xl gap-3 mb-5 mt-8 ml-5 pt-3">
          {loading && !errorMessage ? (
            <p>Loading...</p>
          ) : errorMessage ? (
            <p>{errorMessage}</p>
          ) : staff ? (
            <>
              <OutputBox title="Username:" output={staff.username} />
              <OutputBox title="Name Surname:" output={staff.nameSurname} />
              <OutputBox title="Phone Number:" output={staff.phoneNumber} />
              <OutputBox title="Age:" output={age} />
              <OutputBox title="Gender:" output={staff.gender} />
              <OutputBox title="Role:" output={staff.role} />
              <OutputBox title="Email:" output={staff.email} />
            </>
          ) : (
            <p>No staff data available.</p>
          )}
        </div>
      </div>
    </div>
  );
}

interface OutputBoxProps {
  title: string;
  output: string;
}

function OutputBox({ title, output }: OutputBoxProps) {
  return (
    <div className="flex flex-row mt-5 ml-8">
      <h1 className="font-semibold mr-3">{title}</h1>
      <div className="bg-white rounded-3xl h-5 w-[15svw] mt-1 flex items-center pl-2">
        <span>{output}</span>
      </div>
    </div>
  );
}

// Utility function to calculate age from birthday
function calculateAge(birthday: string): string {
  const birthDate = new Date(birthday);
  if (Number.isNaN(birthDate.getTime())) {
    return "";
  }

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();
  const dayDifference = today.getDate() - birthDate.getDate();

  if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
    age--;
  }

  return String(age);
}

export default StaffDetail;
