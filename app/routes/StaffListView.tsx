import React, { useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import SideNavBar from "app/routes/_SNB";
import { useNavigate } from "@remix-run/react";
import { format } from "date-fns";
import { useGetStaffList } from "~/presentation/hooks/useGetStaffList";
import { Staff } from "~/domain/entities/Staff";
import { getUserSession } from "~/presentation/session/userSession";
import { setSelectedStaffUsername } from "~/presentation/session/staffSelectionSession";

const StaffListView: React.FC = () => {
  const { staffList, loading, error } = useGetStaffList();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isManager, setIsManager] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<string>("Guest");

  const navigate = useNavigate();

  useEffect(() => {
    const session = getUserSession();
    if (!session) {
      setCurrentUser("Guest");
      setIsManager(false);
      return;
    }

    setCurrentUser(session.username);
    setIsManager(session.role?.toLowerCase() === "manager");
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const getStaffName = (staff: Staff): string => {
    return staff.nameSurname || (staff as unknown as { staff_name?: string }).staff_name || "";
  };

  const filteredStaff = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return staffList;

    return staffList.filter((staff) => {
      const name = getStaffName(staff).toLowerCase();
      const phoneMatch = staff.phoneNumber.includes(searchTerm);
      const idMatch = staff.staffId.toString().includes(searchTerm);
      const usernameMatch = staff.username.toLowerCase().includes(term);
      return name.includes(term) || phoneMatch || idMatch || usernameMatch;
    });
  }, [staffList, searchTerm]);

  const ensureManager = (action: () => void) => {
    if (!isManager) {
      alert("You don't have access to this action.");
      return;
    }

    action();
  };

  const handleEditStaff = (username: string) => {
    ensureManager(() => {
      setSelectedStaffUsername(username);
      navigate("/editStaff");
    });
  };

  const handleAddNewStaff = () => {
    ensureManager(() => {
      navigate("/addStaff");
    });
  };

  const handleClickList = (username: string) => {
    setSelectedStaffUsername(username);
    navigate("/staffDetail");
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="flex">
      <SideNavBar />
      <div className="page-background" style={mainContentStyle}>
        <div className="staffListView-view-container" style={staffListViewContainerStyle}>
          <div className="header" style={headerStyle}>
            <h2 style={{ fontSize: "28px", color: "#2F919C" }}>Staff List View</h2>
            <div style={addNewStaffButtonStyle} onClick={handleAddNewStaff}>
              <div style={iconContainerStyle}>
                <FontAwesomeIcon icon={faUserPlus} style={{ color: "#000" }} />
              </div>
              <span style={{ color: "#000000", fontSize: "16px" }}>Add new Staff</span>
            </div>
          </div>

          <div className="search-bar" style={searchBarStyle}>
            <input
              type="text"
              placeholder="searching..."
              value={searchTerm}
              onChange={handleSearch}
              style={searchInputStyle}
            />
          </div>

          <div className="staffListView" style={staffListStyle}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={thTdStyle}>Username</th>
                  <th style={thTdStyle}>Name</th>
                  <th style={thTdStyle}>Tel</th>
                  <th style={thTdStyle}>Birth Day</th>
                  <th style={thTdStyle}>Gender</th>
                  <th style={thTdStyle}>Role</th>
                  <th style={thTdStyle}>Email</th>
                  <th style={thTdStyle}></th>
                </tr>
              </thead>
              <tbody>
                {filteredStaff.map((staff) => (
                  <tr key={staff.staffId} style={{ borderBottom: "1px solid white", cursor: "pointer" }}>
                    <td style={thTdStyle} onClick={() => handleClickList(staff.username)}>{staff.username}</td>
                    <td style={thTdStyle} onClick={() => handleClickList(staff.username)}>{getStaffName(staff)}</td>
                    <td style={thTdStyle} onClick={() => handleClickList(staff.username)}>{staff.phoneNumber}</td>
                    <td style={thTdStyle} onClick={() => handleClickList(staff.username)}>{format(new Date(staff.birthday), "dd/MM/yyyy")}</td>
                    <td style={thTdStyle} onClick={() => handleClickList(staff.username)}>{staff.gender}</td>
                    <td style={thTdStyle} onClick={() => handleClickList(staff.username)}>{staff.role}</td>
                    <td style={thTdStyle} onClick={() => handleClickList(staff.username)}>{staff.email}</td>
                    <td style={thTdStyle}>
                      <a
                        onClick={() => handleEditStaff(staff.username)}
                        style={{
                          color: "#2F919C",
                          cursor: "pointer",
                          textDecoration: "underline",
                        }}
                      >
                        Edit
                      </a>
                    </td>
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

// Component styles
const mainContentStyle: React.CSSProperties = {
  backgroundColor: "#DCE8E9",
  width: "100%",
  minHeight: "100vh",
  padding: "50px",
  boxSizing: "border-box",
};

const staffListViewContainerStyle: React.CSSProperties = {
  width: "1116px",
  height: "968px",
  padding: "20px",
  backgroundColor: "#ffffff",
  borderRadius: "50px 5px 5px 50px",
  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
  margin: "auto",
};

const headerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "20px",
};

const addNewStaffButtonStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  cursor: "pointer",
};

const iconContainerStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  padding: "10px",
  borderRadius: "50%",
  backgroundColor: "#f0c040",
};

const searchBarStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "flex-end",
  marginBottom: "20px",
};

const searchInputStyle: React.CSSProperties = {
  width: "300px",
  padding: "10px",
  borderRadius: "20px",
  border: "1px solid #ccc",
  fontSize: "16px",
};

const staffListStyle: React.CSSProperties = {
  backgroundColor: "#DCE8E9",
  borderRadius: "10px",
  padding: "20px",
  height: "731px",
};

const thTdStyle: React.CSSProperties = {
  padding: "12px",
  textAlign: "left",
};

export default StaffListView;
