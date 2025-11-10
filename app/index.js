import React from 'react';
import ReactDOM from 'react-dom/client'; 
import './index.css'; // Import your global CSS
import App from './App'; // Import your main App component
import { BrowserRouter } from 'react-router-dom'; // Wrap App with BrowserRouter for routing

const root = ReactDOM.createRoot(document.getElementById('root')); // Ensure 'root' matches your HTML element ID in index.html

// root.render(
//   <React.StrictMode>
//     <BrowserRouter>
//       <App />
//     </BrowserRouter>
//   </React.StrictMode>
// );

root.render(<h1>hello</h1>)
