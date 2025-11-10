import React, { useState, useEffect, ChangeEvent } from "react";
import needleImage from "/images/needle.png";
import cottonImage from "/images/cotton.png";
import { useNavigate } from "@remix-run/react";


interface Equipment {
  equipment_id: number;
  equipment_name: string;
  price: number;
  amount: number;
}

interface EquipmentProps {
  setEquipment: React.Dispatch<React.SetStateAction<{ [key: string]: number }>>;
  setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
}


export default function EditEquipment({
  setEquipment,
  setEditMode,
}: EquipmentProps) {
  const [counts, setCounts] = useState<{ [key: string]: number }>({
    needlesize1: 0,
    cotton: 0,
    needlesize2: 0,
  });
  const navigate = useNavigate();
  const [prices, setPrices] = useState<{ [key: string]: number }>({});
  const [totalCost, setTotalCost] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  useEffect(() => {
    const fetchCurrentUserId = async () => {
      const currentStaffValue = sessionStorage.getItem("currentUser");
      if (currentStaffValue) {
        try {
          const response = await fetch(
            `https://dinosaur.prakasitj.com/staff/searchbyUsername/${currentStaffValue}`
          );
          const data = await response.json();
          setCurrentUserId(data[0]?.staff_id || data.staff_id);
        } catch (error) {
          console.error("Error fetching current user:", error);
          setError("Failed to retrieve user ID. Check console for details.");
        }
      } else {
        setError("No current user found. Please log in again.");
      }
    };

    fetchCurrentUserId();
  }, []);

  useEffect(() => {
    const fetchEquipmentData = async () => {
      try {
        const response = await fetch(
          "https://dinosaur.prakasitj.com/equipment/getEquipment"
        );
        const equipmentData: Equipment[] = await response.json();
        const initialPrices: { [key: string]: number } = {};
        equipmentData.forEach((item) => {
          if (item.equipment_name === "Needle Size 1")
            initialPrices.needlesize1 = item.price;
          else if (item.equipment_name === "Cotton")
            initialPrices.cotton = item.price;
          else if (item.equipment_name === "Needle Size 2")
            initialPrices.needlesize2 = item.price;
        });
        setPrices(initialPrices);
      } catch (error) {
        console.error("Error fetching equipment data:", error);
        setError("Failed to load equipment data.");
      }
    };

    fetchEquipmentData();
  }, []);

  useEffect(() => {
    const calculateTotalCost = () => {
      const needleCost = counts.needlesize1 * (prices.needlesize1 || 0);
      const cottonCost = counts.cotton * (prices.cotton || 0);
      const needle2Cost = counts.needlesize2 * (prices.needlesize2 || 0);
      setTotalCost(needleCost + cottonCost + needle2Cost);
    };

    calculateTotalCost();
  }, [counts, prices]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement>,
    item: keyof typeof counts
  ) => {
    const value = Math.max(
      0,
      parseInt(e.target.value.replace(/^0+/, ""), 10) || 0
    );
    setCounts({
      ...counts,
      [item]: value,
    });
  };

  const handleSave = async () => {
    if (currentUserId) {
      if (totalCost === 0) {
        console.warn("Total cost is zero. Skipping financial record addition.");
      } else {
        const financialRecord = {
          record_date: new Date().toISOString(),
          income_and_expenses: "expenses",
          cost: totalCost,
          staff_id: currentUserId,
        };
  
        try {
          const response = await fetch(
            "https://dinosaur.prakasitj.com/financialrecords/addRecord",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(financialRecord),
            }
          );
  
          if (!response.ok) {
            console.error(
              "Failed to add financial record:",
              response.status,
              await response.text()
            );
            setError("Failed to add financial record. Please try again.");
            return;
          }
  
          console.log("Financial record added successfully.");
        } catch (error) {
          console.error("Error adding financial record:", error);
          setError("An error occurred while adding the financial record. Please try again.");
        }
      }
  
      const equipmentList: Equipment[] = [
        { equipment_id: 1, equipment_name: "Cotton", price: prices.cotton, amount: counts.cotton },
        { equipment_id: 2, equipment_name: "Needle Size 1", price: prices.needlesize1, amount: counts.needlesize1 },
        { equipment_id: 3, equipment_name: "Needle Size 2", price: prices.needlesize2, amount: counts.needlesize2 },
      ];
  
      for (const equipment of equipmentList) {
        const amountToUpdate = counts[equipment.equipment_name.toLowerCase().replace(/ /g, "")];
  
        await updateEquipmentAmount({ ...equipment, amount: amountToUpdate }, amountToUpdate);
  
        if (amountToUpdate > 0) {
          await addStockInRecord({
            stock_in_date: new Date().toISOString(),
            equipment_id: equipment.equipment_id,
            amount: amountToUpdate,
            staff_id: currentUserId,
          });
        }
      }
  
      setCounts({ needlesize1: 0, cotton: 0, needlesize2: 0 });
      navigate('/equipment');
    } else {
      setError("Unable to retrieve user ID. Please log in again.");
    }
  };
  
  
  const addStockInRecord = async (record: { stock_in_date: string; equipment_id: number; amount: number; staff_id: number; }) => {
    try {
      const response = await fetch(
        "https://dinosaur.prakasitj.com/stockinrecord/addRecord",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(record),
        }
      );
  
      if (!response.ok) {
        console.error("Error adding stock in record:", await response.text());
        setError("Failed to add stock in record. Please try again.");
      } else {
        console.log("Stock in record added successfully.");
      }
    } catch (error) {
      console.error("Error adding stock in record:", error);
      setError("An error occurred while adding stock in record.");
    }
  };
  

const updateEquipmentAmount = async (
  equipment: Equipment,
  amount: number
) => {
  try {
    const response = await fetch(
      "https://dinosaur.prakasitj.com/equipment/editEquipment",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          equipment_id: equipment.equipment_id,
          equipment_name: equipment.equipment_name,
          price: equipment.price,
          amount: amount,
        }),
      }
    );

    if (!response.ok) {
      console.error(
        "Error updating equipment amount:",
        await response.text()
      );
      setError("Failed to update equipment amount. Please try again.");
    } else {
      console.log("Equipment updated successfully.");
    }
  } catch (error) {
    console.error("Error updating equipment:", error);
    setError("An error occurred while updating equipment.");
  }
};

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Edit Equipment</h2>
        <div style={styles.equipmentCard}>
          {(Object.keys(counts) as Array<keyof typeof counts>).map((item) => (
            <div key={item} style={styles.equipmentItem}>
              <div style={styles.imageContainer}>
                <img
                  src={
                    item === "needle"
                      ? needleImage
                      : item === "cotton"
                      ? cottonImage
                      : needleImage
                  }
                  alt={item as string}
                  style={styles.itemImage}
                />
              </div>
              <div style={styles.details}>
                <h3 style={styles.itemName}>
                  {(item as string).charAt(0).toUpperCase() +
                    (item as string).slice(1)}
                </h3>
                <label style={styles.label}>Add count</label>
                <input
                  type="number"
                  value={String(counts[item])}
                  onChange={(e) => handleInputChange(e, item)}
                  style={styles.input}
                />
                <label style={styles.label}>Cost</label>
                <input
                  type="text"
                  value={(counts[item] || 0) * (prices[item] || 0)}
                  readOnly
                  style={styles.input}
                />
                <button
                  onClick={() =>
                    updateEquipmentAmount(
                      {
                        equipment_id: 1,
                        equipment_name: item as string, 
                        price: prices[item],
                        amount: counts[item],
                      },
                      counts[item]
                    )
                  }
                >
                </button>
              </div>
            </div>
          ))}
        </div>

        <div style={styles.totalCostContainer}>
          <label style={styles.totalCostLabel}>Total Cost:</label>
          <div style={styles.totalCostBar}>{totalCost}</div>
        </div>

        <button onClick={handleSave} style={styles.saveButton}>
          Save
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    width: "100%",
    backgroundColor: "#F2F8F7",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column" as const,
  },
  card: {
    width: "1061px",
    backgroundColor: "#FFFFFF",
    borderRadius: "15px",
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
    padding: "40px",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
  },
  title: {
    color: "#2F919C",
    fontSize: "32px",
  },
  equipmentCard: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "20px",
    width: "100%",
  },
  equipmentItem: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#DCE8E9",
    borderRadius: "40px",
    padding: "20px",
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
    width: "100%",
  },
  imageContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: "40px",
    width: "148px",
    height: "120px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  itemImage: {
    width: "60px",
    height: "60px",
    objectFit: "cover" as const,
  },
  details: {
    flex: 1,
    marginLeft: "20px",
    display: "flex",
    flexDirection: "column" as const,
    justifyContent: "space-between",
  },
  itemName: {
    color: "#2F919C",
    fontSize: "24px",
    marginBottom: "10px",
  },
  label: {
    color: "#2F919C",
    fontSize: "18px",
    marginBottom: "10px",
  },
  input: {
    padding: "10px",
    border: "1px solid #2F919C",
    borderRadius: "10px",
    fontSize: "18px",
  },
  totalCostContainer: {
    display: "flex",
    color: "#2F919C",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "20px",
    width: "100%",
  },
  totalCostLabel: {
    color: "#2F919C",
    fontSize: "24px",
  },
  totalCostBar: {
    backgroundColor: "#00796B",
    width: "300px",
    height: "30px",
    borderRadius: "10px",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  saveButton: {
    padding: "15px 30px",
    backgroundColor: "#FFD700",
    color: "#FFFFFF",
    fontSize: "18px",
    fontWeight: "bold" as const,
    borderRadius: "40px",
    border: "none",
    cursor: "pointer",
    marginTop: "20px",
  },
};
