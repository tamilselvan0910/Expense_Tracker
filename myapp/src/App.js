import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";         // Import the Login component
import Registration from "./components/Registration"; // Import the Registration component
import AddExpenses from "./components/Addexpenses";  // Import the AddExpenses component

const App = () => {
  return (
    <Router>
      <div>
        <h1>Expense Tracker</h1>
        <Routes>
          {/* Define the routes for Login, Registration, and AddExpenses */}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/add-expenses" element={<AddExpenses />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
