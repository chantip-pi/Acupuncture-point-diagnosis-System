import { useState, useEffect } from "react";
import { useNavigate } from "@remix-run/react";
import SideNavBar from "./_SNB";
import React from "react";
import PatientHeader from "./components/PatientHeader";
import { format } from "date-fns";

interface MedicalRecordList {
  record_id: number;
  cost: string;
  appointment_date: string;
  doctorid: number;
  patientid: number;
  staffid: number;
  treatment_id: number;
}

function MedicalRecord() {
  const [activeTab, setActiveTab] = useState("Income");
  const [medicalData, setMedicalData] = useState<MedicalRecordList[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://dinosaur.prakasitj.com/medicalrecords/getMedicalRecordsList"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch medical record data");
        }

        const data: MedicalRecordList[] = await response.json();
        setMedicalData(data);
      } catch (err) {
        setError("Failed to load data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array to fetch data on mount

  const [searchTerm, setSearchTerm] = React.useState<string>("");

  const filteredRecord = medicalData.filter((medical)=>
    medical.cost.toString().includes(searchTerm) ||
    medical.record_id.toString().includes(searchTerm)
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="flex flex-row h-[svh] bg-[#DCE8E9] overflow-hidden">
      <SideNavBar />
      <div
        className="flex flex-col flex-grow bg-white 
                    mr-[40px] ml-[100px] mt-[25px] mb-[25px]
                    rounded-[60px] border border-gray-300 h-[calc(svh-10px)] w-[65svw]
                    shadow-[0px_4px_4px_rgba(0,0,0,0.25)]"
      >
        <div className="flex justify-between items-center px-16 pt-16">
          <h1 className="text-[#2F919C] text-2xl">Medical History</h1>
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="border-2 border-gray-300 rounded-full py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-400"
              onChange={handleSearch}
            />
          </div>
        </div>

        <div
          className="flex flex-col flex-grow bg-[#DCE8E9] 
                                mx-auto mt-[50px] mb-[25px] w-[60svw]
                                rounded-3xl border border-gray-300  overflowY: auto"
        >
          <table>
            <th className="pl-2 py-2">Record ID</th>
            <th className="pl-1 py-2">Appointment Date</th>
            <th className="px-8 py-2">Cost</th>
            <th className="px-8 py-2">Patient ID</th>
            <th className="px-8 py-2">Doctor ID</th>
            <th className="px-8 py-2">Staff ID</th>
            <th className="px-8 py-2">Treatment ID</th>

            <tbody>
              {filteredRecord.map((record: MedicalRecordList, index: number) => (
                <tr key={record.record_id} className="border-b">
                  <td
                    className="pl-8 py-2"
                    style={{ borderBottom: "1px solid white" }}
                  >
                    {record.record_id}
                  </td>
                  <td
                    className="pl-8 py-2"
                    style={{ borderBottom: "1px solid white" }}
                  >
                    {format(new Date(record.appointment_date), 'dd/MM/yyyy')}
                  </td>
                  <td
                    className="pl-[2rem] py-2"
                    style={{ borderBottom: "1px solid white" }}
                  >
                    ${record.cost}
                  </td>
                  <td
                    className="pl-[3.5rem] py-2"
                    style={{ borderBottom: "1px solid white" }}
                  >
                    {record.patientid}
                  </td>
                  <td
                    className="pl-[3.5rem] py-2"
                    style={{ borderBottom: "1px solid white" }}
                  >
                    {record.doctorid}
                  </td>
                  <td
                    className="pl-[3rem] py-2"
                    style={{ borderBottom: "1px solid white" }}
                  >
                    {record.staffid}
                  </td>
                  <td
                    className="pl-[4.5rem] py-2"
                    style={{ borderBottom: "1px solid white" }}
                  >
                    {record.treatment_id}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default MedicalRecord;
