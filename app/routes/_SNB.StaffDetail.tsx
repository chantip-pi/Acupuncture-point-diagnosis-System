import React, { useEffect, useMemo, useState } from "react";
import SideNavBar from "./_SNB";
import {
  Card,
  InfoList,
  SectionHeading,
} from "~/presentation/designSystem";
import { useGetStaffByUsername } from "~/presentation/hooks/staff/useGetStaffByUsername";
import { getUserSession } from "~/presentation/session/userSession";
import { getSelectedStaffUsername } from "~/presentation/session/staffSelectionSession";
import ErrorPage from "./components/common/ErrorPage";
import LoadingPage from "./components/common/LoadingPage";

function StaffDetail() {
  const [username, setUsername] = useState<string | null>(null);
  const [sessionError, setSessionError] = useState<string | null>(null);
  const [isSessionLoaded, setIsSessionLoaded] = useState<boolean>(false);
  const [isManager, setIsManager] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const session = getUserSession();
    if (!session) {
      setIsLoggedIn(false);
      setIsManager(false);
      setIsSessionLoaded(true);
      setSessionError("No user information found. Please log in again.");
      return;
    }

    setIsLoggedIn(true);
    setIsManager(session.role?.toLowerCase() === "manager");

    const selectedUsername = getSelectedStaffUsername();
    if (selectedUsername) {
      setUsername(selectedUsername);
    } else {
      setUsername(session.username);
    }
    
    setIsSessionLoaded(true);
  }, []);

  const { staff, loading, error } = useGetStaffByUsername(username);
  const errorMessage = useMemo(() => sessionError ?? error, [sessionError, error]);

  const age = useMemo(() => {
    if (!staff) return "";
    return calculateAge(staff.birthday);
  }, [staff]);

  // While we haven't loaded the session on the client yet, keep UI consistent
  if (!isSessionLoaded) {
    return <LoadingPage />;
  }

  // If user is not logged in, show access denied page without sidebar
  if (!isLoggedIn) {
    const handleGoBack = () => {
      window.history.back();
    };

    return (
      <div className="page-background" style={{ backgroundColor: "#DCE8E9", width: "100%", minHeight: "100vh", padding: "50px", boxSizing: "border-box", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <ErrorPage
          message="You don't have access to this page."
          onRetry={handleGoBack}
        />
      </div>
    );
  }

  // If user is not a manager, block access with error page without sidebar
  if (!isManager) {
    const handleGoBack = () => {
      window.history.back();
    };

    return (
      <div className="page-background" style={{ backgroundColor: "#DCE8E9", width: "100%", minHeight: "100vh", padding: "50px", boxSizing: "border-box", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <ErrorPage
          message="You don't have access to this page."
          onRetry={handleGoBack}
        />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-surface-muted">
  
      <main className="flex-1 p-8">
        <Card className="max-w-3xl">
          <SectionHeading title="Staff Details" />
          <div className="mt-4">
            {loading && !errorMessage ? (
              <p>Loading...</p>
            ) : errorMessage ? (
              <p>{errorMessage}</p>
            ) : staff ? (
              <InfoList
                items={[
                  { label: "Username", value: staff.username },
                  { label: "Name Surname", value: staff.nameSurname },
                  { label: "Phone Number", value: staff.phoneNumber },
                  { label: "Age", value: age },
                  { label: "Gender", value: staff.gender },
                  { label: "Role", value: staff.role },
                  { label: "Email", value: staff.email },
                ]}
              />
            ) : (
              <p>No staff data available.</p>
            )}
          </div>
        </Card>
      </main>
    </div>
  );
}

// Utility function to calculate age from birthday
function calculateAge(birthday: string): string {
  const birthDate = new Date(birthday);
  if (Number.isNaN(birthDate.getTime())) {
    return "";
  }

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();
  const dayDifference = today.getDate() - birthDate.getDate();

  if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
    age--;
  }

  return String(age);
}

export default StaffDetail;
