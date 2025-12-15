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
import ErrorPage from "./components/common/ErrorPage";
import LoadingPage from "./components/common/LoadingPage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons/faPenToSquare";

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

  if (loading) {
    return <LoadingPage />;
  }

  if (error) {
    return (
      <ErrorPage message={error} onRetry={() => window.location.reload()} />
    );
  }
  if (!patientData) {
    return (
      <ErrorPage message={"No patient data found"} onRetry={() => window.location.reload()} />
    );
  };

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
                 <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-amber-800">
                  <FontAwesomeIcon icon={faPenToSquare} />
                </span>
                Edit
              </Button>
            </div>
          </div>

          <div className="mt-4">
            <InfoList
              items={[
                { label: "Full Name", value: patientData.nameSurname || "N/A" },
                { label: "Patient ID", value: String(patientData.patientId || "N/A") },
                {
                  label: "Upcoming Appointment",
                  value: DateTimeHelper.formatDateTime(patientData.birthday)

                },

                { label: "Gender", value: patientData.gender || "N/A" },
                {
                  label: "Age",
                  value: patientData
                    ? DateTimeHelper.calculateAge(patientData.birthday)
                    : "N/A",
                },
                { label: "Phone Number", value: patientData.phoneNumber || "N/A" },
                {
                  label: "Remaining Course",
                  value: String(patientData.remainingCourse || "0"),
                },
              ]}
            />
          </div>
        </Card>
      </main>
    </div>
  );
}




export default PatientDetail;
