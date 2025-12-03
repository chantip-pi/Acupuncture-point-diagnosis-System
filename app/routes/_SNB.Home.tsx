import { CiUser } from "react-icons/ci";
import { useNavigate } from "@remix-run/react";
import React, { useMemo } from "react";
import { format } from "date-fns";
import { useGetPatientsByAppointmentDate } from "~/presentation/hooks/patient/useGetPatientsByAppointmentDate";
import { Patient } from "~/domain/entities/Patient";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const today = useMemo(() => new Date(), []);
  const { patients: patientList, loading, error } = useGetPatientsByAppointmentDate(today);

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
    <div className="flex flex-row w-[78svw]">
      <div className="flex flex-row justify-center items-start h-full pt-10 pb-7">
        <div className="p-6 border border-gray-300 h-full rounded-3xl bg-white shadow-lg w-[70svw] ml-20">
          <div className="flex flex-row">
            <div className="flex justify-between items-center mb-4 ml-2 mt-2">
              <h1 className="text-[#1FA1AF] text-2xl">Today's Patient List</h1>
            </div>
            <div
              className="flex flexrow"
              onClick={handleSeeAllClick}
              style={{ cursor: "pointer" }}
            >
              <div className="bg-[#DCE8E9] w-7 h-7 ml-[43svw] mt-2 rounded-full">
                <CiUser className="ml-1 mt-1 text-[#1FA1AF]" size={20} />
              </div>
              <h1
                className="text-[#1FA1AF] ml-2 mt-2"
                onClick={handleSeeAllClick}
                style={{ cursor: "pointer" }}
              >
                See All Patient
              </h1>
            </div>
          </div>

          <div
            className="mt-4 bg-[#DCE8E9] rounded-2xl h-[120lvh]"
            style={{ overflowY: "auto" }}
          >
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={thTdStyle}>Patient ID</th>
                  <th style={thTdStyle}>Name Surname</th>
                  <th style={thTdStyle}>Phone Number</th>
                  <th style={thTdStyle}>Birth Day</th>
                  <th style={thTdStyle}>Gender</th>
                  <th style={thTdStyle}>Appointment Date</th>
                  <th style={thTdStyle}>Course</th>
                  <th style={thTdStyle}></th>
                </tr>
              </thead>
              <tbody>
                {patientList.map((patient: Patient, index: number) => (
                  <tr
                    key={index}
                    style={{
                      borderBottom: "1px solid white",
                      cursor: "pointer",
                    }}
                  >
                    <td style={thTdStyle} onClick={() => handlePatientDetail(patient.patientId)}>{patient.patientId}</td>
                    <td style={thTdStyle} onClick={() => handlePatientDetail(patient.patientId)}>{patient.nameSurname}</td>
                    <td style={thTdStyle} onClick={() => handlePatientDetail(patient.patientId)}>{patient.phoneNumber}</td>
                    <td style={thTdStyle} onClick={() => handlePatientDetail(patient.patientId)}>
                      {format(patient.birthday, "dd-MM-yyyy")}
                    </td>
                    <td style={thTdStyle} onClick={() => handlePatientDetail(patient.patientId)}>{patient.gender}</td>
                    <td style={thTdStyle} onClick={() => handlePatientDetail(patient.patientId)}>
                      {patient.appointmentDate
                        ? format(
                            new Date(patient.appointmentDate),
                            "dd-MM-yyyy kk:mm"
                          )
                        : "N/A"}
                    </td>
                    <td style={thTdStyle} onClick={() => handlePatientDetail(patient.patientId)}>{patient.courseCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const thTdStyle: React.CSSProperties = {
  padding: "12px",
  textAlign: "left",
};

export default Home;
