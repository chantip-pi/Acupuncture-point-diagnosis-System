import { useNavigate } from "@remix-run/react";
import React, { useEffect, useState } from "react";

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

function StaffPage() {
  const navigate = useNavigate();
  const [staffData, setStaffData] = useState<Staff | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<string>("Guest");
  const [currentStaff, setCurrentStaff] = useState<string>("Guest");

  useEffect(() => {
    const fetchData = async () => {
      const storedStaff = sessionStorage.getItem("currentStaff");
      const currentStaffValue = storedStaff ? storedStaff.replace(/^"|"$/g, '').toLowerCase() : "guest";
      setCurrentStaff(currentStaffValue);

      if (currentStaffValue === "Guest") {
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
        console.log(data);
        if (data.length > 0) {
          setStaffData(data[0]);
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
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>{error}</p>
          ) : (
            <>
              <OutputBox title="Username:" output={staffData?.username || ""} />
              <OutputBox title="Name Surname:" output={staffData?.staff_name || ""} />
              <OutputBox title="Phone Number:" output={staffData?.staff_phone_number || ""} />
              <OutputBox title="Age:" output={staffData ? calculateAge(staffData.birthday) : ""} />
              <OutputBox title="Gender:" output={staffData?.gender || ""} />
              <OutputBox title="Role:" output={staffData?.role || ""} />
              <OutputBox title="Email:" output={staffData?.email || ""} />
            </>
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
  const ageDifMs = Date.now() - birthDate.getTime();
  const ageDate = new Date(ageDifMs);
  return String(Math.abs(ageDate.getUTCFullYear() - 1970));
}

export default StaffPage;
