import { CiUser } from "react-icons/ci";
import { useNavigate } from "@remix-run/react";
import React, { useMemo } from "react";
import { format } from "date-fns";
import { Card, SectionHeading, Table } from "~/presentation/designSystem";
import SideNavBar from "./_SNB";
import { useGetPatientsByAppointmentDate } from "~/presentation/hooks/patient/useGetPatientsByAppointmentDate";
import { Patient } from "~/domain/entities/Patient";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const today = useMemo(() => new Date(), []);
  const { patients: patientList, loading, error } =
    useGetPatientsByAppointmentDate(today);

  const handlePatientDetail = (patientId: number) => {
    sessionStorage.setItem("currentPatientID", JSON.stringify(patientId));
    navigate("/patientDetail");
  };

  const handleSeeAllClick = () => {
    navigate("/patientList");
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="flex min-h-screen bg-surface-muted">
      <main className="flex-1 p-8">
        <Card>
          <div className="flex items-center justify-between">
            <SectionHeading title="Today's Patient List" />
            <button
              className="flex items-center gap-2 text-brand hover:text-brand-strong"
              onClick={handleSeeAllClick}
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-muted">
                <CiUser size={20} />
              </span>
              <span className="text-md font-semibold">See all patients</span>
            </button>
          </div>

          <div className="mt-4">
            {patientList.length === 0 ? (
              /* ✅ Empty state */
              <div className="flex h-40 items-center justify-center">
                <p className="text-md text-slate-500 font-medium">
                  No patient appointment
                </p>
              </div>
            ) : (
              /* ✅ Table */
              <Table
                headers={[
                  "Patient ID",
                  "Name",
                  "Phone Number",
                  "Birth Day",
                  "Gender",
                  "Appointment Date",
                  "Course",
                ]}
              >
                {patientList.map((patient: Patient) => (
                  <tr
                    key={patient.patientId}
                    className="cursor-pointer hover:bg-slate-50"
                    onClick={() => handlePatientDetail(patient.patientId)}
                  >
                    <td className="px-4 py-3 text-md text-slate-900">
                      {patient.patientId}
                    </td>
                    <td className="px-4 py-3 text-md text-slate-900">
                      {patient.nameSurname}
                    </td>
                    <td className="px-4 py-3 text-md text-slate-900">
                      {patient.phoneNumber}
                    </td>
                    <td className="px-4 py-3 text-md text-slate-900">
                      {format(patient.birthday, "dd-MM-yyyy")}
                    </td>
                    <td className="px-4 py-3 text-md text-slate-900">
                      {patient.gender}
                    </td>
                    <td className="px-4 py-3 text-md text-slate-900">
                      {patient.appointmentDate
                        ? format(
                            new Date(patient.appointmentDate),
                            "dd-MM-yyyy kk:mm"
                          )
                        : "N/A"}
                    </td>
                    <td className="px-4 py-3 text-md text-slate-900">
                      {patient.remainingCourse}
                    </td>
                  </tr>
                ))}
              </Table>
            )}
          </div>
        </Card>
      </main>
    </div>
  );
};

export default Home;
