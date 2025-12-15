import { useNavigate } from "@remix-run/react";
import React, { useMemo } from "react";
import SideNavBar from "./_SNB";
import {
  Button,
  Card,
  InfoList,
  SectionHeading,
} from "~/presentation/designSystem";
import { useGetPatientById } from "~/presentation/hooks/patient/useGetPatientById";
import { Patient } from "~/domain/entities/Patient";
import { DateTimeHelper } from "~/domain/value-objects/DateOfBirth";

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
    <div className="flex min-h-screen bg-surface-muted">
  
      <main className="flex-1 p-8">
        <Card>
          <div className="flex items-center justify-between">
            <SectionHeading title="Patient Detail" />
            <div className="flex items-center gap-3">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleEdit(patientData.patientId)}
              >
                Edit Patient
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  sessionStorage.setItem(
                    "currentPatientID",
                    JSON.stringify(patientData.patientId)
                  );
                  navigate("/medicalRecord");
                }}
              >
                Medical History
              </Button>
            </div>
          </div>

          <div className="mt-4">
            <InfoList
              items={[
                { label: "Full Name", value: patientData.nameSurname || "N/A" },
                { label: "Patient ID", value: String(patientData.patientId || "N/A") },
                {
                  label: "Upcoming Appointment Date",
                  value: formatDate(new Date().getDate())
                    
                },
                
                { label: "Gender", value: patientData.gender || "N/A" },
                {
                  label: "Age",
                  value: patientData
                    ? DateTimeHelper.calculateAge(patientData.birthday)
                    : "N/A",
                },
                { label: "Tel", value: patientData.phoneNumber || "N/A" },
                {
                  label: "Course Count",
                  value: String(patientData.remainingCourse || "0"),
                },
              ]}
            />
          </div>

          <div className="mt-6 flex justify-end">
            <Button
              variant="primary"
              onClick={() => handleTreatmentSelect(patientData.patientId)}
            >
              Select Treatment
            </Button>
          </div>
        </Card>
      </main>
    </div>
  );
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
