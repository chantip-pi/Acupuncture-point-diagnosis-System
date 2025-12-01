import { useState, useEffect } from "react";
import { format } from 'date-fns';
import React from "react";

interface FinancialRecord {
  financial_record_id: number;
  record_date: string;
  income_and_expenses: string;
  cost: string;
  staffId: number;
}

function IncomeExpenses() {
  const [activeTab, setActiveTab] = useState("Income");
  const [incomeData, setIncomeData] = useState<FinancialRecord[]>([]);
  const [expensesData, setExpensesData] = useState<FinancialRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = React.useState<string>("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredIncome = incomeData.filter((income)=>
    income.cost.toString().includes(searchTerm) ||
    income.record_date.toString().includes(searchTerm)
  );

  const filteredExpense = expensesData.filter((expenses)=>
    expenses.cost.toString().includes(searchTerm) ||
    expenses.record_date.toString().includes(searchTerm)
  );

  const fetchFinancialRecords = async (tab: string) => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://dinosaur.prakasitj.com/financialrecords/getFinancialRecords"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch financial records");
      }
      const data: FinancialRecord[] = await response.json();

      // Split records based on income or expense
      if (tab === "Income") {
        const income = data.filter(
          (record) => record.income_and_expenses === "income"
        );
        setIncomeData(income);
      } else {
        const expenses = data.filter(
          (record) => record.income_and_expenses === "expenses"
        );
        setExpensesData(expenses);
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch data initially and when the activeTab changes
  useEffect(() => {
    fetchFinancialRecords(activeTab);
  }, [activeTab]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="flex flex-row bg-[#DCE8E9] overflow-hidden">
      <div
        className="flex flex-col flex-grow bg-white 
                    mr-[40px] ml-[100px] mt-[25px] mb-[25px]
                    rounded-[60px] border border-gray-300 h-[calc(svh-10px)] w-[65svw]
                    shadow-[0px_4px_4px_rgba(0,0,0,0.25)]"
      >
        <div className="flex justify-between items-center p-16">
          <h1 className="text-[#2F919C] text-2xl">Income & Expenses</h1>
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="border-2 border-gray-300 rounded-full py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-400"
              onChange={handleSearch}
            />
          </div>
        </div>

        <div className="flex flex-row justify-center gap-[400px] text-xl ">
          <h2
            className={`cursor-pointer ${
              activeTab === "Income" ? "text-black" : "text-gray-400"
            }`}
            onClick={() => setActiveTab("Income")}
          >
            Income
          </h2>
          <h2
            className={`cursor-pointer ${
              activeTab === "Expenses" ? "text-black" : "text-gray-400"
            }`}
            onClick={() => setActiveTab("Expenses")}
          >
            Expenses
          </h2>
        </div>

        <div
          className="flex flex-col flex-grow bg-[#DCE8E9] 
                                mx-auto mt-[50px] mb-[25px] w-[60svw]
                                rounded-3xl border border-gray-300  overflowY: auto"
        >
          <table>
            <th className="pl-2 py-2">Financial Record ID</th>
            <th className="pl-1 py-2">Record Date</th>
            <th className="px-8 py-2">Type</th>
            <th className="px-8 py-2">Cost</th>
            <th className="px-8 py-2">Staff ID</th>
            
            <tbody>
              {(activeTab === "Income" ? filteredIncome : filteredExpense).map(
                (record) => (
                  <tr key={record.financial_record_id} className="border-b">
                    <td className="pl-24 py-2" style={{ borderBottom: "1px solid white" }}>{record.financial_record_id}</td>
                    <td className="pl-[4.5rem] py-2" style={{ borderBottom: "1px solid white" }}>{format(record.record_date, 'dd/MM/yyyy')}</td>
                    <td className="pl-12 py-2" style={{ borderBottom: "1px solid white" }}>{record.income_and_expenses}</td>
                    <td className="pl-[3.4rem] py-2" style={{ borderBottom: "1px solid white" }}>${record.cost}</td>
                    <td className="pl-[5rem] py-2" style={{ borderBottom: "1px solid white" }}>{record.staffId}</td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default IncomeExpenses;
