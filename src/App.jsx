// App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import NavbarLayout from './layout/NavbarLayout'
import Group from "./pages/Group";
import GroupPage from "./pages/GroupPage";
import Profile from "./pages/Profile";
import SetBudget from "./pages/SetBudget";
import PersonalTransactions from "./pages/PersonalTransactions";
import MonthlySummary from "./pages/MonthlySummary";

function App() {
  const isAuthenticated = useSelector(state => state.auth?.isAuthenticated ?? false);
  

  // Inline protected route wrapper
  const Protected = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/login" replace />;
  };

  return (
    <Router>
      <Routes>

        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Private Routes with Layout */}
       <Route
          path="/"
          element={
            <Protected>
              <NavbarLayout>
                <Outlet />
              </NavbarLayout>
            </Protected>
          }
        > 
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="personal-transactoions" element={<PersonalTransactions />} />
           <Route path="group" element={<Group />} />
           <Route path="group/:groupId" element={<GroupPage />} />
           <Route path="profile" element={<Profile />} />
            <Route path="set-budget" element={<SetBudget />} />
              <Route path="monthly-summary" element={<MonthlySummary />} />
            

       </Route> 

        {/* Catch-all: redirect unknown routes to root */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
