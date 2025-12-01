import React, { useEffect, useState } from 'react';
import { useNavigate } from '@remix-run/react';
import TreatmentCard from "./components/TreatmentCard";
import PatientHeader from "./components/PatientHeader";

interface Treatment {
  treatment_id: number;
  cost: number;
  treatment_name: string;
  item1: number;
  item2: number;
  item3: number;
  doctor: number;
}

const TreatmentSelect: React.FC = () => {
  const [selectedTreatments, setSelectedTreatments] = useState<Treatment[]>([]);
  const [treatmentList, setTreatmentList] = useState<{ treatment_id: number; cost: number; treatment_name: string; }[]>([]);
  const navigate = useNavigate();
  const [currentPatient, setCurrentPatient] = useState<string>("Guest");
  const [currentPatientName, setCurrentPatientName] = useState<string>("Guest");

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        `https://dinosaur.prakasitj.com/treatmenttype/getTreatmentList`
      );
      const data = await response.json();
      setTreatmentList(data);

      const storedPatientID = sessionStorage.getItem("currentPatientID");
      const currentPatientIDValue = storedPatientID
        ? storedPatientID.replace(/^"|"$/g, "")
        : "Guest";

      setCurrentPatient(currentPatientIDValue);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchPatientData = async () => {
      if (currentPatient !== "Guest") {
        const patientResponse = await fetch(`https://dinosaur.prakasitj.com/patient/getNamebyID/${currentPatient}`);
        const patientData = await patientResponse.json();
        
        // Check if patientData is an array and has at least one element
        if (Array.isArray(patientData) && patientData.length > 0) {
          setCurrentPatientName(patientData[0].nameSurname); // Access the first object in the array
        } else {
          setCurrentPatientName("Guest");
        }
      }
    };
    fetchPatientData();
  }, [currentPatient]);
  

  const handleTreatmentSelect = (treatment: Treatment, isSelected: boolean) => {
    setSelectedTreatments((prev) =>
      isSelected
        ? [...prev, treatment] // Add treatment if selected
        : prev.filter((t) => t.treatment_id !== treatment.treatment_id) // Remove treatment if deselected
    );
  };

  const handleNextPage = () => {
    sessionStorage.setItem("selectedTreatments", JSON.stringify(selectedTreatments));
    if (selectedTreatments.length != 0) {
      navigate("/totalCost");
    }
    else {
      navigate('/select-treatment');
    }
  };

  return (
    <div className="flex flex-row justify-center items-start w-[80svw] pt-10 pb-7">
      <div className="p-6 border border-gray-300 rounded-l-3xl bg-white shadow-lg w-[53svw]">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-[#1FA1AF] text-2xl">Treatment Select</h1>
        </div>

        <PatientHeader patientName={currentPatientName} patientID={currentPatient} />

        <div className="flex flex-col gap-[0.65rem] mt-5">
          {treatmentList.map((treatment) => (
            <TreatmentCard
              key={treatment.treatment_id}
              treatment={treatment}
              item1="Needle size 1"
              item2="Needle size 2"
              item3="Cotton"
              onTreatmentSelect={handleTreatmentSelect} // Pass callback
            />
          ))}
        </div>

        <div className="flex flex-row items-end justify-end pt-5">
          <button
            type="submit"
            className="self-end w-28 py-2 bg-[#1FA1AF] text-white font-bold rounded-lg"
            onClick={handleNextPage}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default TreatmentSelect;
