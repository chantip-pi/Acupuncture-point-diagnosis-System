import React, { useEffect, useState } from 'react';
import needleImage from '/images/needle.png';
import cottonImage from '/images/cotton.png';
import { Link } from '@remix-run/react';
import SideNavBar from 'app/routes/_SNB';
import { useNavigate } from "@remix-run/react";

interface EquipmentItem {
  equipment_id: number;
  equipment_name: string;
  amount: number;
}

const Equipment: React.FC = () => {
  const navigate = useNavigate();
  const [equipmentItems, setEquipmentItems] = useState<EquipmentItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isManager, setIsManager] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<string>("Guest");

  const handleHistoryClick = () => {
    navigate("/equimentHistory");
  };

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const response = await fetch("https://dinosaur.prakasitj.com/equipment/getEquipmentNameAmount");
        if (!response.ok) throw new Error("Failed to fetch equipment data");

        const data: EquipmentItem[] = await response.json();
        setEquipmentItems(data);
      } catch (err) {
        setError("Failed to load data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEquipment();
  }, []);

  useEffect(() => {
    const fetchStaffData = async () => {
      const currentUser = sessionStorage.getItem("currentUser");
      const currentStaffValue = currentUser ? currentUser.replace(/^"|"$/g, '').toLowerCase() : "guest";
      setCurrentUser(currentStaffValue);

        const response = await fetch(
          `https://dinosaur.prakasitj.com/staff/searchbyUsername/${currentUser}`
        );
        const data = await response.json();

        if (Array.isArray(data) && data.length > 0 ) {
          console.log(data[0].role);
        } else {
          console.error("No staff found.");
        }
        
        if (data[0].role.replace(/^"|"$/g, '').toLowerCase() === "manager") {
          setIsManager(true);
        }
    };
    fetchStaffData();
  }, [currentUser]);

  const handleEditEquipment = () => {
    if (isManager) {
      navigate("/edit-equipment");
    }
    else {
      alert("You don't have access to edit.")
    }
  };
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="flex">
  
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.header}>
            <h2 style={styles.title}>Equipment</h2>
            <div style={styles.buttons}>
              <button style={styles.historyButton} onClick={handleHistoryClick}>
                <div style={styles.icon}></div>Equipment history
              </button>
              <button style={styles.editButton} onClick={handleEditEquipment}>
                  <div style={styles.icon}></div>Edit Equipment
                </button>
            </div>
          </div>
          <div style={styles.equipmentCard}>
            {equipmentItems.map((item) => (
              <div key={item.equipment_id} style={styles.equipmentItem}>
                <div style={styles.imageContainer}>
                  <img
                    src={getImageForEquipment(item.equipment_name)}
                    alt={item.equipment_name}
                    style={styles.itemImage}
                  />
                </div>
                <div style={styles.details}>
                  <h3 style={styles.itemName}>{item.equipment_name}</h3>
                  <div style={styles.remainingWrapper}>
                    <p style={styles.remainingText}>Remaining: {item.amount}</p>
                  </div>
                </div>
                <Link to="/EditEquipment">
                  <button style={styles.addButton}>+</button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const getImageForEquipment = (name: string) => {
  const imagePath = (() => {
    switch (name.toLowerCase()) {
      case 'needle size 1':
      case 'needle size 2':
        return needleImage;
      case 'cotton':
        return cottonImage;
      default:
        return ''; 
    }
  })();
  console.log(`Image path for ${name}:`, imagePath);
  return imagePath;
};



const styles = {
  container: {
    width: '100%', 
    backgroundColor: '#F2F8F7',
    display: 'flex',
    padding: '40px',
    alignItems: 'center',
    flexDirection: 'column' as const,
  } as React.CSSProperties,
  card: {
    width: '1061px',
    height: 'auto', 
    backgroundColor: '#FFFFFF',
    borderRadius: '15px',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
    padding: '40px',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
  } as React.CSSProperties,
  header: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
  } as React.CSSProperties,
  title: {
    color: '#2F919C',
    fontSize: '32px',
  } as React.CSSProperties,
  buttons: {
    display: 'flex',
    gap: '20px',
  } as React.CSSProperties,
  historyButton: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'transparent',
    color: '#000000',
    border: 'none',
    cursor: 'pointer',
    fontSize: '18px',
    position: 'relative' as 'relative',
  } as React.CSSProperties,
  editButton: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'transparent',
    color: '#000000',
    border: 'none',
    cursor: 'pointer',
    fontSize: '18px',
    position: 'relative' as 'relative',
  } as React.CSSProperties,
  icon: {
    width: '20px',
    height: '20px',
    borderRadius: '10px',
    backgroundColor: '#FFD700',
    marginRight: '10px',
  } as React.CSSProperties,
  equipmentCard: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '20px',
    width: '100%',
  } as React.CSSProperties,
  equipmentItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#DCE8E9',
    borderRadius: '40px',
    padding: '20px',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    width: '100%',
  } as React.CSSProperties,
  imageContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: '40px',
    width: '148px',
    height: '120px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  } as React.CSSProperties,
  itemImage: {
    width: '60px',
    height: '60px',
    objectFit: 'cover' as const,
  } as React.CSSProperties,
  details: {
    flex: 1,
    marginLeft: '20px',
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'center',
  } as React.CSSProperties,
  itemName: {
    color: '#2F919C',
    fontSize: '22px',
    marginBottom: '5px',
  } as React.CSSProperties,
  remainingWrapper: {
    display: 'flex',
    alignItems: 'center',
  } as React.CSSProperties,
  remainingText: {
    fontSize: '18px',
    color: '#6B7B7E',
    backgroundColor: '#FFFFFF',
    padding: '10px',
    borderRadius: '20px',
    width: '510px',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
  } as React.CSSProperties,
  addButton: {
    backgroundColor: '#3E747A',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '10px',
    width: '40px',
    height: '40px',
    cursor: 'pointer',
    fontSize: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
  } as React.CSSProperties,
};

export default Equipment;