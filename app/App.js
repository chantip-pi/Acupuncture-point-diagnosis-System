import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LogIn from './routes/LogIn'; // Adjust this path if necessary

function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect from root path to login page */}
        <Route path="/" element={LogIn} />
        <Route path="/login" element={<LogIn />} />
        {/* You can add more routes here in the future */}
      </Routes>
    </Router>
  );
}

export default App;
