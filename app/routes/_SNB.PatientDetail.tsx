import { useNavigate } from "@remix-run/react";
import React, { useEffect, useMemo } from "react";
import { useGetPatientById } from "~/presentation/hooks/useGetPatientById";
import { Patient } from "~/domain/entities/Patient";

function PatientDetail() {
  const navigate = useNavigate();
  const patientId = useMemo(() => {
    const storedPatientID = sessionStorage.getItem("currentPatientID");
    if (!storedPatientID) return null;
    const id = storedPatientID.replace(/^"|"$/g, "");
    return id === "Guest" ? null : parseInt(id, 10);
  }, []);

  const { patient: patientData, loading, error } = useGetPatientById(patientId);

  const handleEdit = (patientId: number) => {
    sessionStorage.setItem("currentPatientID", JSON.stringify(patientId));
    navigate("/editPatient");
  };

  const handleTreatmentSelect = (patientId: number) => {
    sessionStorage.setItem("currentPatientID", JSON.stringify(patientId));
    navigate("/select-treatment");
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!patientData) return <p>No patient data found</p>;

  return (
    <div className="flex h-[140svh] bg-[#DCE8E9] w-[170svh] bottom-[200]">
      <div className="flex flex-col flex-grow bg-white mx-5 my-5 rounded-3xl border border-gray-300 h-[calc(100svh-50px)] shadow-md">
        <div className="flex items-center justify-between p-10">
          <h1 className="text-[#2F919C] text-2xl">Patient Detail</h1>
          <div className="flex space-x-8">
            <div
              className="flex items-center cursor-pointer"
              onClick={() => handleEdit(patientData.patientId)}
            >
              <div className="h-5 w-5 bg-yellow-500 rounded-full mr-2"></div>
              <h1 className="text-lg hover:text-[#2F919C]">Edit Patient</h1>
            </div>
            <div
              className="flex items-center cursor-pointer"
              onClick={() => {
                sessionStorage.setItem(
                  "currentPatientID",
                  JSON.stringify(patientData.patientId)
                );
                navigate("/medicalRecord");
              }}
            >
              <div className="h-5 w-5 bg-yellow-500 rounded-full mr-2"></div>
              <h1 className="text-lg hover:text-[#2F919C]">Medical History</h1>
            </div>
          </div>
        </div>

        <div className="bg-[#DCE8E9] p-5 rounded-xl mx-10 w-[1000px] h-[280px] overflow-auto">
          <div className="grid grid-cols-2 gap-10">
            <div className="space-y-4">
              <OutputBox
                title="Full Name:"
                output={patientData?.nameSurname || "N/A"}
              />
              <OutputBox
                title="Patient ID:"
                output={String(patientData?.patientId || "N/A")}
              />
              <OutputBox
                title="Appointment Date:"
                output={patientData.appointmentDate ? formatDate(new Date(patientData.appointmentDate).getTime()) : "N/A"}
              />
              <OutputBox
                title="First Visit Date:"
                output={formatDate(new Date(patientData.firstVistDate).getTime())}
              />
            </div>
            <div className="space-y-4">
              <OutputBox
                title="Gender:"
                output={patientData?.gender || "N/A"}
              />
              <OutputBox
                title="Age:"
                output={patientData ? calculateAge(patientData.birthday) : "N/A"}
              />
              <OutputBox
                title="Tel:"
                output={patientData?.phoneNumber || "N/A"}
              />
              <OutputBox
                title="Course Count:"
                output={String(patientData?.courseCount || "0")}
              />
            </div>
          </div>
        </div>

        <button className="bg-[rgb(47,145,156)] text-white px-5 py-2 rounded-md ml-auto mr-10 mt-6 hover:bg-[#1F7074] transition-colors duration-300"
        onClick={() => handleTreatmentSelect(patientData.patientId)}>
          Select Treatment
        </button>
      </div>
    </div>
  );
}

// OutputBox Component
interface OutputBoxProps {
  title: string;
  output: string;
}

function OutputBox({ title, output }: OutputBoxProps) {
  return (
    <div className="grid grid-cols-3 items-center">
      <label className="font-semibold">{title}</label>
      <div className="bg-white rounded-lg h-10 w-[250px] flex items-center pl-2 border border-gray-300">
        <span>{output}</span>
      </div>
    </div>
  );
}


function calculateAge(birthday: string): string {
  if (!birthday) return "N/A";

  const birthDate = new Date(birthday);
  const today = new Date();

  if (isNaN(birthDate.getTime())) {
    return "Invalid Date";
  }

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();
  const dayDifference = today.getDate() - birthDate.getDate();

  if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
    age--;
  }

  return String(age);
}

const formatDate = (timestamp: number | undefined): string => {
  if (!timestamp) return "N/A";
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} (${hours}:${minutes}:${seconds})`;
};

export default PatientDetail;
