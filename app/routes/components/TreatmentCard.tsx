import { useEffect, useState } from "react";

interface TreatmentCardProps {
  treatment: {
    treatment_id: number;
    cost: number;
    treatment_name: string;
  };
  item1: string;
  item2: string;
  item3: string;
  onTreatmentSelect: (treatment: Treatment, isSelected: boolean) => void; // Callback to parent
}

interface Staff {
  staffId: number;
  username: string;
  staff_name: string;
  phoneNumber: string;
  birthday: string;
  gender: string;
  role: string;
  email: string;
}

interface Treatment {
  treatment_id: number;
  cost: number;
  treatment_name: string;
  item1: number;
  item2: number;
  item3: number;
  doctor: number;
}

export default function TreatmentCard({ treatment, item1, item2, item3, onTreatmentSelect }: TreatmentCardProps) {
  const [checked, setChecked] = useState(false);
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [doctor, setDoctor] = useState<number | null>(null);
  const [item1Count, setItem1Count] = useState<number>(0);
  const [item2Count, setItem2Count] = useState<number>(0);
  const [item3Count, setItem3Count] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://dinosaur.prakasitj.com/staff/getStaffList");

        if (!response.ok) {
          throw new Error("Failed to fetch staff data");
        }

        const data = await response.json();
        setStaffList(data);
      } catch (err) {
        setError("Failed to load data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCheckboxChange = () => {
    setChecked((prev) => !prev);
    const selectedTreatment = {
      treatment_id: treatment.treatment_id,
      cost: treatment.cost,
      treatment_name: treatment.treatment_name,
      item1: item1Count,
      item2: item2Count,
      item3: item3Count,
      doctor: doctor || 0, // Default to 0 if no doctor selected
    };
    onTreatmentSelect(selectedTreatment, !checked); // Send selected status back to parent
  };

  const handleDoctorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedDoctorId = parseInt(e.target.value, 10);
    setDoctor(selectedDoctorId);

    // Retrieve the existing doctor list from sessionStorage, or start with an empty array if none
    const storedDoctors = JSON.parse(sessionStorage.getItem("chosenDoctors") || "[]");

    // Add the selected doctor if not already in the list
    if (!storedDoctors.includes(selectedDoctorId)) {
        storedDoctors.push(selectedDoctorId);
    }

    if (storedDoctors.length > 1) {
        storedDoctors.shift(); // Remove the oldest doctor
    }

    // Save the updated doctor list to sessionStorage
    sessionStorage.setItem("chosenDoctors", JSON.stringify(storedDoctors));
};


  const handleItem1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value);
    setItem1Count(newValue);
    sessionStorage.setItem("item1Stored", JSON.stringify(newValue));
};

const handleItem2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value);
    setItem2Count(newValue);
    sessionStorage.setItem("item2Stored", JSON.stringify(newValue));
};

const handleItem3Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value);
    setItem3Count(newValue);
    sessionStorage.setItem("item3Stored", JSON.stringify(newValue));
};


  // Filter staff list to include only those with the role "Doctor"
  const doctorList = staffList.filter((staff) => staff.role === "Doctor");

  return (
    <div className="flex flex-row pt-5 pl-5 pr-5 pb-6 bg-[#DCE8E9] rounded-3xl items-center gap-6">
      <div
        className="w-[7.5rem] h-24 rounded-3xl"
        style={{ filter: "drop-shadow(0 0.25rem 0.125rem #AAB4B5)" }}
      >
        <img
          className="object-cover w-full h-full rounded-3xl"
          src={"https://media.istockphoto.com/id/1319031310/th/%E0%B8%A3%E0%B8%B9%E0%B8%9B%E0%B8%96%E0%B9%88%E0%B8%B2%E0%B8%A2/%E0%B9%81%E0%B8%9E%E0%B8%97%E0%B8%A2%E0%B9%8C%E0%B9%80%E0%B8%82%E0%B8%B5%E0%B8%A2%E0%B8%99%E0%B9%83%E0%B8%9A%E0%B8%AA%E0%B8%B1%E0%B9%88%E0%B8%87%E0%B8%A2%E0%B8%B2.jpg?s=1024x1024&w=is&k=20&c=sMJ1Y2oVo5wkwQ0nqp63svGD8MVSyb2s0FNDiXBCMrg="}
          alt="Treatment"
        />
      </div>

      <div className="flex flex-col self-start gap-2 ">
        <h1 className="text-2xl text-[#1FA1AF] pb-1">{treatment.treatment_name}</h1>
        <InputRow text="Use" item={item1} onChange={handleItem1Change} />
        <InputRow text="Use" item={item2} onChange={handleItem2Change} />
        <InputRow text="Use" item={item3} onChange={handleItem3Change} />

        <div className="flex flex-row gap-3 pt-2">
          <h1>Choose Doctor:</h1>
          <select className="w-[19.09rem] rounded-3xl text-center" onChange={handleDoctorChange}>
            <option value="">-- Select Doctor --</option>
            {doctorList.map((doctor) => (
              <option key={doctor.staffId} value={doctor.staffId}>
                {doctor.staff_name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-row justify-center items-center gap-2">
        <div className="grid">
          <input
            type="checkbox"
            checked={checked}
            onChange={handleCheckboxChange}
            className="w-4 h-4 appearance-none border-2 border-white rounded-[0.2rem] checked:bg-white checked:border-transparent focus:outline-none shadow-inner col-start-1 row-start-1"
          />
          <svg
            className={`col-start-1 row-start-1 ml-[0.1rem] ${checked ? "visible" : "invisible"}`}
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            width="13"
            height="15"
            viewBox="0 0 30 30"
            style={{ pointerEvents: "none" }}
          >
            <path d="M 26.980469 5.9902344 A 1.0001 1.0001 0 0 0 26.292969 6.2929688 L 11 21.585938 L 4.7070312 15.292969 A 1.0001 1.0001 0 1 0 3.2929688 16.707031 L 10.292969 23.707031 A 1.0001 1.0001 0 0 0 11.707031 23.707031 L 27.707031 7.7070312 A 1.0001 1.0001 0 0 0 26.980469 5.9902344 z"></path>
          </svg>
        </div>
        <h1 className="pb-1">Select</h1>
      </div>
    </div>
  );
}

interface InputRowProps {
  text: string;
  item: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function InputRow({ text, item, onChange }: InputRowProps) {
  return (
    <div className="flex flex-row gap-2">
      {text !== "" ? <h1>{text}</h1> : <div className="mr-[1.6352rem]"></div>}

      <div className="flex flex-row bg-white rounded-3xl w-[12rem] justify-center">
        <h1>{item}</h1>
      </div>
      <input className="rounded-3xl w-[12rem]" type="number" onChange={onChange} />
    </div>
  );
}
