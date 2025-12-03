// ~/routes/components/ErrorPage.tsx
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle, faRotateRight } from "@fortawesome/free-solid-svg-icons";

interface ErrorPageProps {
  message?: string;
  onRetry?: () => void;
}

const ErrorPage: React.FC<ErrorPageProps> = ({ 
  message = "Something went wrong. Please try again.", 
  onRetry 
}) => {
  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  return (
    <div style={containerStyle}>
      <div style={errorBoxStyle}>
        <div style={iconWrapperStyle}>
          <FontAwesomeIcon 
            icon={faExclamationTriangle} 
            style={{ fontSize: "64px", color: "#f44336" }} 
          />
        </div>
        
        <h2 style={titleStyle}>Oops!</h2>
        
        <p style={messageStyle}>{message}</p>
        
        <button onClick={handleRetry} style={retryButtonStyle}>
          <FontAwesomeIcon icon={faRotateRight} style={{ marginRight: "10px" }} />
          Try Again
        </button>
      </div>
    </div>
  );
};

// Styles
const containerStyle: React.CSSProperties = {
  width: "1116px",
  height: "968px",
  padding: "20px",
  backgroundColor: "#ffffff",
  borderRadius: "50px 5px 5px 50px",
  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
  margin: "auto",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const errorBoxStyle: React.CSSProperties = {
  textAlign: "center",
  maxWidth: "500px",
  padding: "40px",
};

const iconWrapperStyle: React.CSSProperties = {
  marginBottom: "24px",
};

const titleStyle: React.CSSProperties = {
  fontSize: "32px",
  fontWeight: "bold",
  color: "#333",
  marginBottom: "16px",
};

const messageStyle: React.CSSProperties = {
  fontSize: "18px",
  color: "#666",
  marginBottom: "32px",
  lineHeight: "1.6",
};

const retryButtonStyle: React.CSSProperties = {
  padding: "12px 32px",
  fontSize: "16px",
  fontWeight: "600",
  color: "#fff",
  backgroundColor: "#2F919C",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  transition: "background-color 0.3s ease",
};

export default ErrorPage;