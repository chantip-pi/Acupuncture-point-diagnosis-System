import PatientHeader from "./components/PatientHeader";
import React, { ChangeEvent, useEffect, useState } from "react";
import { useNavigate } from "@remix-run/react";

interface OutputRowProps {
  treatment: Finance;
}

interface Finance {
  treatment_id: number;
  cost: number;
  treatment_name: string;
}

interface Equipment {
  equipment_id: number;
  equipment_name: string;
  price: number;
  amount: number;
}

interface Patient {
  patientId: number;
  nameSurname: string;
  phoneNumber: string;
  birthday: string;
  gender: string;
  courseCount: number;
  appointmentDate: string | null;
  firstVistDate: string;
}

const TotalCost: React.FC = () => {
  const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);
  const [financeList, setFinanceList] = useState<Finance[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [course, setCourse] = useState<number>(0);
  const [baseTotalCost, setBaseTotalCost] = useState<number>(0);
  const [extraCost, setExtraCost] = useState<number>(0);
  const [currentPatientName, setCurrentPatientName] = useState<string>("Guest");
  const [currentPatient, setCurrentPatient] = useState<string>("Guest");
  const [currentStaffId, setCurrentStaffId] = useState<string>("");
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [selectedTreatments, setSelectedTreatments] = useState<Finance[]>([]);
  const [patientData, setPatientData] = useState<Patient | null>(null);
  const [formData, setFormData] = useState<Partial<Patient>>({});
  const [error, setError] = useState<string | null>(null);
  const [appointmentDate, setAppointmentDate] = useState<string | null>(null);
  const [newAppointmentDate, setNewAppointmentDate] = useState<string>("");

  const navigate = useNavigate();

  useEffect(() => {
    const user = sessionStorage.getItem("currentUser");
    const treatments = JSON.parse(
      sessionStorage.getItem("selectedTreatments") || "[]"
    );
    setCurrentUser(user);
    setSelectedTreatments(treatments);
  }, []);


  useEffect(() => {
    if (error) {
       console.log("Error message updated:", error);
    }
 }, [error]);
 
  useEffect(() => {
    const fetchStaffData = async () => {
      if (currentPatient !== "Guest" && currentUser) {
        const response = await fetch(
          `https://dinosaur.prakasitj.com/staff/searchbyUsername/${currentUser}`
        );
        const data = await response.json();

        if (Array.isArray(data) && data.length > 0) {
          setCurrentStaffId(data[0].staffId);
        } else {
          console.error("No staff found.");
        }
      }
    };
    fetchStaffData();
  }, [currentPatient, currentUser]);

  useEffect(() => {
    const fetchData = async () => {
      if (selectedTreatments.length === 0) return;

      try {
        const requests = selectedTreatments.map((treatment) =>
          fetch(
            `https://dinosaur.prakasitj.com/treatmenttype/searchbyName/${treatment.treatment_name
              .toLowerCase()
              .replace(/ /g, "")}`
          ).then((response) => response.json())
        );

        const results = await Promise.all(requests);
        const mergedData = results.flat();
        setFinanceList(mergedData);

        const calculatedBaseTotalCost = mergedData.reduce(
          (acc, item) => acc + item.cost,
          0
        );
        setBaseTotalCost(calculatedBaseTotalCost);

        const storedPatientID = sessionStorage.getItem("currentPatientID");
        setCurrentPatient(
          storedPatientID ? storedPatientID.replace(/^"|"$/g, "") : "Guest"
        );
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedTreatments]);

  useEffect(() => {
    const fetchPatientData = async () => {
      if (currentPatient !== "Guest") {
        const response = await fetch(
          `https://dinosaur.prakasitj.com/patient/getNamebyID/${currentPatient}`
        );
        const data = await response.json();

        if (Array.isArray(data) && data.length > 0) {
          setCurrentPatientName(data[0].nameSurname);
        } else {
          console.error("No patient found.");
          setCurrentPatientName("Guest");
        }
      }
    };
    fetchPatientData();
  }, [currentPatient]);

  useEffect(() => {
    const fetchCourseData = async () => {
      if (currentPatient !== "Guest") {
        const response = await fetch(
          `https://dinosaur.prakasitj.com/patient/searchbyID/${currentPatient}`
        );
        const data = await response.json();

        if (Array.isArray(data) && data.length > 0) {
          setCourse(data[0].courseCount);
        } else {
          console.error("No course data found.");
          setCourse(0);
        }
      }
    };
    fetchCourseData();
  }, [currentPatient]);

  useEffect(() => {
    const storedEquipmentData = JSON.parse(
      sessionStorage.getItem("equipmentData") || "[]"
    );

    const initialEquipmentList: Equipment[] = storedEquipmentData.map(
      (item: any) => ({
        equipment_id: item.equipment_id,
        equipment_name: item.equipment_name,
        price: item.price,
        amount: item.amount,
      })
    );

    setEquipmentList(initialEquipmentList);
  }, []);

  const handleAddCourseFee = () => {
    setCourse(course + 9);
    setBaseTotalCost(5500);
  };

  const handleUseCourse = () => {
    if (course > 0) {
      setCourse(course - 1);
      setBaseTotalCost(0);
    }
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "appointmentDate") {
      setNewAppointmentDate(value);
    }
    console.log("New Appointment Date:", newAppointmentDate);
  };

  const checkAppointmentDateAvailability = async (appointmentDate: string) => {
    try {
      const response = await fetch(
        `https://dinosaur.prakasitj.com/patient/searchbyAppointmentDate/${appointmentDate}`
      );

      if (!response.ok) {
        const errorDetails = await response.text();
        throw new Error(`Failed to check appointment date: ${errorDetails}`);
      }

      const result = await response.json();
      console.log("Response from searchbyAppointmentDate:", result);

      return result.length > 0;
    } catch (error) {
      console.error("Error in checkAppointmentDateAvailability:", error);
      setError(
        "Error checking appointment date availability. Please try again."
      );
      return false;
    }
  };

  const totalCost = baseTotalCost;

  const handleDone = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to complete this action?"
    );
    if (confirmed) {
      const finalAppointmentDate = newAppointmentDate
        ? new Date(newAppointmentDate).toISOString()
        : new Date().toISOString();

      const isAvailable = await checkAppointmentDateAvailability(
        finalAppointmentDate
      );

      if (isAvailable) {
        setError("The selected appointment date is already taken. Please choose a different date.");
        return;
     }
     

      try {
        const financeFormData = {
          record_date: new Date().toISOString(),
          income_and_expenses: "income",
          cost: totalCost,
          staffId: currentStaffId,
        };

        const responseFinance = await fetch(
          "https://dinosaur.prakasitj.com/financialrecords/addRecord",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(financeFormData),
          }
        );

        if (!responseFinance.ok) {
          const errorData = await responseFinance.json();
          console.error("Failed to submit financial record:", errorData);
          return;
        }

        console.log("Financial record submitted successfully.");

        for (const treatment of selectedTreatments) {
          const chosenDoctors = JSON.parse(
            sessionStorage.getItem("chosenDoctors") || "[]"
          );
          const doctorId =
            Array.isArray(chosenDoctors) && chosenDoctors.length > 0
              ? chosenDoctors[0]
              : 0;

          const medicalRecordData = {
            cost: treatment.cost,
            appointmentDate: appointmentDate
              ? new Date(appointmentDate).toISOString()
              : new Date().toISOString(),
            doctorid: doctorId,
            patientid: parseInt(
              sessionStorage.getItem("currentPatientID") || "0",
              10
            ),
            staffid: parseInt(currentStaffId, 10),
            treatment_id: treatment.treatment_id,
          };

          const responseMedical = await fetch(
            "https://dinosaur.prakasitj.com/medicalrecords/addRecord",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(medicalRecordData),
            }
          );

          if (!responseMedical.ok) {
            const errorData = await responseMedical.json();
            console.error("Failed to submit medical record:", errorData);
            return;
          }

          console.log("Medical record submitted successfully.");
        }

        const equipmentList = [
          {
            itemName: "Needle Size 1",
            itemKey: "item1Stored",
            equipment_id: 2,
          },
          {
            itemName: "Needle Size 2",
            itemKey: "item2Stored",
            equipment_id: 3,
          },
          { itemName: "Cotton", itemKey: "item3Stored", equipment_id: 1 },
        ];

        for (const equipment of equipmentList) {
          const storedAmount = parseInt(
            sessionStorage.getItem(equipment.itemKey) || "0",
            10
          );

          if (storedAmount > 0) {
            const requisitionData = {
              use_amount: storedAmount,
              requisition_date: new Date().toISOString(),
              equipment_id: equipment.equipment_id,
              staffId: parseInt(currentStaffId, 10),
            };

            const responseRequisition = await fetch(
              "https://dinosaur.prakasitj.com/requisition/addRecord",
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requisitionData),
              }
            );

            if (!responseRequisition.ok) {
              const errorData = await responseRequisition.json();
              console.error("Failed to add requisition record:", errorData);
            } else {
              console.log("Requisition record added successfully.");
            }
          }

          const responseEquipment = await fetch(
            `https://dinosaur.prakasitj.com/equipment/searchbyID/${equipment.equipment_id}`
          );

          if (!responseEquipment.ok) {
            const errorData = await responseEquipment.json();
            console.error(
              `Failed to fetch equipment data for ${equipment.itemName}:`,
              errorData
            );
            continue;
          }

          const equipmentData = await responseEquipment.json();
          const equipmentDetails = equipmentData[0];
          const currentAmount = equipmentDetails.amount;
          const price = equipmentDetails.price;

          console.log(
            `Fetched equipment data for ${equipment.itemName}:`,
            equipmentDetails
          );
          console.log(`Price for ${equipment.itemName}:`, price);

          const decreaseEquipmentData = {
            equipment_id: equipment.equipment_id,
            equipment_name: equipment.itemName,
            amount: storedAmount,
            price: price,
          };

          const responseDecreaseEquipment = await fetch(
            "https://dinosaur.prakasitj.com/equipment/decreaseEquipment",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(decreaseEquipmentData),
            }
          );

          if (!responseDecreaseEquipment.ok) {
            const errorData = await responseDecreaseEquipment.json();
            console.error("Failed to decrease equipment:", errorData);
          } else {
            console.log("Equipment amount decreased successfully.");
          }
        }

        if (currentPatient !== "Guest") {
          const response = await fetch(
            `https://dinosaur.prakasitj.com/patient/searchbyID/${currentPatient}`
          );
          const data = await response.json();
          const patientUpdateData = {
            patientId: parseInt(
              sessionStorage.getItem("currentPatientID") || "0",
              10
            ),
            nameSurname: data[0].nameSurname,
            phoneNumber: data[0].phoneNumber,
            birthday: data[0].birthday,
            gender: data[0].gender,
            appointmentDate: newAppointmentDate
              ? new Date(newAppointmentDate).toISOString()
              : data[0].appointmentDate,
            courseCount: course,
            firstVistDate: data[0].firstVistDate,
          };

          try {
            const responsePatientUpdate = await fetch(
              "https://dinosaur.prakasitj.com/patient/editPatient",
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(patientUpdateData),
              }
            );

            if (!responsePatientUpdate.ok) {
              const errorData = await responsePatientUpdate.json();
              console.error("Failed to update patient data:", errorData);
            } else {
              console.log("Patient data updated successfully.");
            }
          } catch (error) {
            console.error("Network or server error:", error);
          }
        }

        sessionStorage.setItem("item1Stored", "0");
        sessionStorage.setItem("item2Stored", "0");
        sessionStorage.setItem("item3Stored", "0");

        navigate("/patientList");
      } catch (error) {
        console.error("Failed to submit records:", error);
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-row justify-center items-start w-[80svw] pt-10 pb-7">
      <div className="p-6 border border-gray-300 rounded-l-3xl bg-white shadow-lg w-[53svw]">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-[#1FA1AF] text-2xl">Total Cost</h1>
        </div>

        <PatientHeader
          patientName={currentPatientName}
          patientID={currentPatient}
        />

        <div className="flex flex-row mt-5">
          <div className="flex flex-col gap-4">
            <h1>Treatment Selected:</h1>
            {selectedTreatments.map((treatment, index) => (
              <OutputRow key={index} treatment={treatment} />
            ))}
          </div>
          <div className="flex flex-col justify-center items-center pl-12 text-lg">
            <h1>Apply for a course</h1>
            <div className="bg-[#1FA1AF] rounded-3xl justify-center items-center text-center p-4 w-[15svw] text-base">
              <div className="w-[13svw]">
                <h1 className="text-white font-normal">
                  The course fee will be included in the total cost
                </h1>
              </div>
              <button
                type="submit"
                className="self-end w-32 py-1 mt-3 bg-white text-[#1FA1AF] rounded-lg"
                style={{ filter: "drop-shadow(0 0.25rem 0.125rem #246D76)" }}
                onClick={handleAddCourseFee}
              >
                Add
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-row mt-5">
          <div className="flex flex-col gap-3">
            <h1>Choose a treatment appointment date:</h1>
            <div className="flex flex-col w-[30svw] bg-[#DCE8E9] rounded-3xl text-start h-36">
              <input
                type="datetime-local"
                className="w-[20svw] my-5 mx-5 rounded-md"
                value={newAppointmentDate}
                onChange={(e) => {
                  setNewAppointmentDate(e.target.value);
                  handleChange(e);
                }}
                style={{ filter: "drop-shadow(0 0.25rem 0.125rem #A6AFB0)" }}
              />
              <h1 className="ml-5">Date of treatment</h1>
              <div
                className="bg-white rounded-md w-[20svw] ml-5 mt-1"
                style={{ filter: "drop-shadow(0 0.25rem 0.125rem #A6AFB0)" }}
              >
                <h1>{new Date().toISOString().slice(0, 10)}</h1>
                {error && <p className="text-red-500">{error}</p>}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center ml-12">
            <h1>Course:</h1>
            <div className="flex flex-col w-[15svw] bg-[#DCE8E9] rounded-3xl text-start h-36 justify-center items-center">
              <div className="bg-white rounded-3xl w-[13svw] h-28 items-center text-center">
                <h1 className="font-semibold pt-1 text-base">Remain</h1>
                <h1 className="font-semibold text-[#1FA1AF] text-xl">
                  {course}/10
                </h1>
                <button
                  type="submit"
                  className="self-end w-32 py-1 mt-2 bg-[#FFCD6D] text-white rounded-lg font-semibold"
                  style={{ filter: "drop-shadow(0 0.25rem 0.125rem #A6AFB0)" }}
                  onClick={handleUseCourse}
                >
                  Use
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-row mt-8">
          <div className="flex flex-col mt-8">
            <h1 className="text-[#1FA1AF] font-semibold">Total Cost:</h1>
            <div className="bg-[#1FA1AF] w-[18svw] rounded-3xl h-8 text-white flex items-center justify-center">
              ${loading ? "Calculating..." : totalCost}{" "}
              {/* Displays updated total */}
            </div>
          </div>

          <button
            type="submit"
            className="self-end w-28 py-2 bg-[#1FA1AF] text-white font-bold rounded-lg ml-[23svw] mb-2"
            style={{ filter: "drop-shadow(0 0.25rem 0.125rem #A6AFB0)" }}
            onClick={handleDone}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

function OutputRow({ treatment }: OutputRowProps) {
  return (
    <div className="bg-[#D6D6D6] rounded-3xl h-8 text-center w-[30svw] mb-2">
      <h1>
        {treatment.treatment_name}: ${treatment.cost}
      </h1>
    </div>
  );
}
export default TotalCost;