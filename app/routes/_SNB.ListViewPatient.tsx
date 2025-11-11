import React, { useState, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "@remix-run/react";
import { format } from "date-fns";
import { useGetPatientList } from "~/presentation/hooks/useGetPatientList";
import { Patient } from "~/domain/entities/Patient";

const ListViewPatient: React.FC = () => {
  const navigate = useNavigate();
  const { patients: patientList, loading, error } = useGetPatientList();
  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handlePatientDetail = (patientId: number) => {
    sessionStorage.setItem("currentPatientID", JSON.stringify(patientId));
    navigate("/PatientDetail");
  };

  const handleSelectTreatment = () => {
    navigate("/treatmentSelect");
  };

  const handleAddNewPatient = () => {
    navigate("/AddNewPatient");
  };

  const filteredPatients = useMemo(() => {
    return patientList.filter((patient) =>
      patient.name_surname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone_number.includes(searchTerm) ||
      patient.patient_id.toString().includes(searchTerm)
    );
  }, [patientList, searchTerm]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div
      className="page-background"
      style={{
        backgroundColor: "#DCE8E9",
        width: "100%",
        minHeight: "100vh",
        padding: "50px",
        boxSizing: "border-box",
      }}
    >
      <div
        className="patient-list-view-container"
        style={{
          width: "1120px",
          height: "850px",
          padding: "30px",
          backgroundColor: "#ffffff",
          borderRadius: "50px 5px 5px 50px",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
          margin: "auto",
        }}
      >
        <div
          className="header"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h2 style={{ fontSize: "28px", color: "#2F919C" }}>
            List View Patient
          </h2>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
            }}
            onClick={handleAddNewPatient}
          >
            <span
              style={{
                padding: "8px",
                backgroundColor: "#f0c040",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginRight: "10px",
              }}
            >
              <FontAwesomeIcon icon={faUserPlus} style={{ color: "#000000" }} />
            </span>
            <span
              style={{
                color: "#000000",
                textDecoration: "underline",
                cursor: "pointer",
              }}
            >
              Add new Patient
            </span>
          </div>
        </div>

        <div
          className="search-bar"
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: "20px",
          }}
        >
          <input
            type="text"
            placeholder="searching..."
            value={searchTerm}
            onChange={handleSearch}
            style={{
              width: "300px",
              padding: "10px",
              borderRadius: "20px",
              border: "1px solid #ccc",
              fontSize: "16px",
            }}
          />
        </div>

        <div
          className="patient-list"
          style={{
            backgroundColor: "#DCE8E9",
            borderRadius: "10px",
            padding: "20px",
            maxHeight: "650px",
            overflowY: "auto",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={thTdStyle}>Patient ID</th>
                <th style={thTdStyle}>Name Surname</th>
                <th style={thTdStyle}>Phone Number</th>
                <th style={thTdStyle}>Birthday</th>
                <th style={thTdStyle}>Gender</th>
                <th style={thTdStyle}>Appointment Date</th>
                <th style={thTdStyle}>Course</th>
                <th style={thTdStyle}></th>
              </tr>
            </thead>
            
            <tbody>
              {filteredPatients.map((patient: Patient) => (
                <tr
                  key={patient.patient_id}
                  style={{ borderBottom: "1px solid white", cursor: "pointer" }}
                  onClick={() => handlePatientDetail(patient.patient_id)}
                >
                  <td style={thTdStyle}>{patient.patient_id}</td>
                  <td style={thTdStyle}>{patient.name_surname}</td>
                  <td style={thTdStyle}>{patient.phone_number}</td>
                  <td style={thTdStyle}>
                    {format(new Date(patient.birthday), 'dd/MM/yyyy')}
                  </td>
                  <td style={thTdStyle}>{patient.gender}</td>
                  <td style={thTdStyle}>
                    {patient.appointment_date
                      ? format(new Date(patient.appointment_date), 'dd/MM/yyyy kk:mm')
                      : 'N/A'}
                  </td>
                  <td style={thTdStyle}>{patient.course_count}</td>
                  <td style={thTdStyle}>
                    <button
                      style={{
                        ...buttonStyle,
                        backgroundColor: "#2F919C",
                        color: "white",
                      }}
                      onClick={handleSelectTreatment}
                    >
                      Select Treatment
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const buttonStyle: React.CSSProperties = {
  backgroundColor: "#f0c040",
  border: "none",
  padding: "10px 20px",
  borderRadius: "20px",
  cursor: "pointer",
  fontWeight: "bold",
  transition: "background-color 0.3s ease",
};

const thTdStyle: React.CSSProperties = {
  padding: "12px",
  textAlign: "left",
};

export default ListViewPatient;
