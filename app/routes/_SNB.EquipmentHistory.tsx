import { useState, useEffect } from "react";
import { format } from "date-fns";
import Equipment from "./Equipment";

interface EquipmentRequisition {
  requisition_id: number;
  requisition_date: string;
  equipment_id: number;
  use_amount: number;
  staff_id: number;
}

interface EquipmentStock {
  stock_in_id: number;
  stock_in_date: string;
  equipment_id: number;
  amount: number;
  staff_id: number;
}

function EquipmentHistory() {
  const [activeTab, setActiveTab] = useState("Use Equipment");
  const [requisitionList, setRequisitionList] = useState<
    EquipmentRequisition[]
  >([]);
  const [stockList, setStockList] = useState<EquipmentStock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const requisitionResponse = await fetch(
          "https://dinosaur.prakasitj.com/requisition/getRequisition"
        );
        const stockResponse = await fetch(
          "https://dinosaur.prakasitj.com/stockinrecord/getStockInRecord"
        );

        if (!requisitionResponse.ok || !stockResponse.ok) {
          throw new Error("Failed to fetch data");
        }

        const requisitionData: EquipmentRequisition[] =
          await requisitionResponse.json();
        const stockData: EquipmentStock[] = await stockResponse.json();

        setRequisitionList(requisitionData);
        setStockList(stockData);
      } catch (err) {
        setError("Failed to load data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredRequisition = requisitionList.filter((requisition)=>
    requisition.requisition_id.toString().includes(searchTerm) ||
    requisition.equipment_id.toString().includes(searchTerm)
  );

  const filteredStock = stockList.filter((stock)=>
    stock.stock_in_id.toString().includes(searchTerm) ||
    stock.equipment_id.toString().includes(searchTerm)
  );

  const renderTableData = () => {
    if (loading)
      return (
        <tr>
          <td>Loading...</td>
        </tr>
      );
    if (error)
      return (
        <tr>
          <td>{error}</td>
        </tr>
      );

    const data = activeTab === "Use Equipment" ? filteredRequisition : filteredStock;

    return data.map((record) => (
      <tr
        key={
          activeTab === "Use Equipment"
            ? (record as EquipmentRequisition).requisition_id
            : (record as EquipmentStock).stock_in_id
        }
        className="border-b"
      >
        <td
          className="pl-[5rem] py-2"
          style={{ borderBottom: "1px solid white" }}
        >
          {activeTab === "Use Equipment"
            ? (record as EquipmentRequisition).requisition_id
            : (record as EquipmentStock).stock_in_id}
        </td>
        <td className="pl-16 py-2" style={{ borderBottom: "1px solid white" }}>
          {activeTab === "Use Equipment"
            ? (record as EquipmentRequisition).requisition_id
            : (record as EquipmentStock).equipment_id}
        </td>
        <td className="pl-7 py-2" style={{ borderBottom: "1px solid white" }}>
          {activeTab === "Use Equipment"
            ? format(
                new Date((record as EquipmentRequisition).requisition_date),
                "dd/MM/yyyy"
              )
            : format(
                new Date((record as EquipmentStock).stock_in_date),
                "dd/MM/yyyy"
              )}
        </td>

        <td className="pl-6 py-2" style={{ borderBottom: "1px solid white" }}>
          {activeTab === "Use Equipment" ? "Use Equipment" : "Import Equipment"}
        </td>
        <td className="pl-8 py-2" style={{ borderBottom: "1px solid white" }}>
          {activeTab === "Use Equipment"
            ? (record as EquipmentRequisition).use_amount
            : (record as EquipmentStock).amount}
        </td>
        <td
          className="pl-[4rem] py-2"
          style={{ borderBottom: "1px solid white" }}
        >
          {record.staff_id}
        </td>
      </tr>
    ));
  };

  return (
    <div className="flex flex-row bg-[#DCE8E9] overflow-hidden">
      <div className="flex flex-col flex-grow bg-white mr-[40px] ml-[100px] mt-[25px] mb-[25px] rounded-[60px] border border-gray-300 h-[calc(svh-10px)] w-[65svw] shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">
        <div className="flex justify-between items-center p-16">
          <h1 className="text-[#2F919C] text-2xl">Equipment History</h1>
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              onChange={handleSearch}
              className="border-2 border-gray-300 rounded-full py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>

        <div className="flex flex-row justify-center gap-[400px] text-xl ">
          <h2
            className={`cursor-pointer ${
              activeTab === "Use Equipment" ? "text-black" : "text-gray-400"
            }`}
            onClick={() => setActiveTab("Use Equipment")}
          >
            Use Equipment
          </h2>
          <h2
            className={`cursor-pointer ${
              activeTab === "Import Equipment" ? "text-black" : "text-gray-400"
            }`}
            onClick={() => setActiveTab("Import Equipment")}
          >
            Import Equipment
          </h2>
        </div>

        <div className="flex flex-col flex-grow bg-[#DCE8E9] mx-auto mt-[50px] mb-[25px] w-[60svw] rounded-3xl border border-gray-300 overflow-y-auto">
          <table>
            <thead>
              <tr>
                <th className="pl-2 py-2">Equipment Record ID</th>
                <th className="pl-4 py-2">Equipment ID</th>
                <th className="py-2">Record Date</th>
                <th className="py-2">Type</th>
                <th className="py-2">Amount</th>
                <th className="px-8 py-2">Staff ID</th>
              </tr>
            </thead>
            <tbody>{renderTableData()}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default EquipmentHistory;
