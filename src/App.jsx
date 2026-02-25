import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import PersonalTransactions from "./pages/PersonalTransactions";
import Group from "./pages/Group";
import GroupPage from "./pages/GroupPage";
import Profile from "./pages/Profile";
import SetBudget from "./pages/SetBudget";
import MonthlySummary from "./pages/MonthlySummary";
import NavbarLayout from "./layout/NavbarLayout";
import SplashScreen from "./components/SplashScreen";

function App() {
  const isAuthenticated = useSelector(
    state => state.auth?.isAuthenticated ?? false
  );

  const [showSplash, setShowSplash] = useState(true);

  return (
    <Router>
      {showSplash ? (
        <SplashScreen onFinish={() => setShowSplash(false)} />
      ) : (
        <Routes>
          <Route
            path="/login"
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Login />
              )
            }
          />

          <Route
            path="/signup"
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Signup />
              )
            }
          />

          {isAuthenticated && (
            <Route element={<NavbarLayout />}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route
                path="/personal-transactoions"
                element={<PersonalTransactions />}
              />
              <Route path="/group" element={<Group />} />
              <Route path="/group/:groupId" element={<GroupPage />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/set-budget" element={<SetBudget />} />
              <Route path="/monthly-summary" element={<MonthlySummary />} />
            </Route>
          )}

          {!isAuthenticated && (
            <Route path="*" element={<Navigate to="/login" replace />} />
          )}
        </Routes>
      )}
    </Router>
  );
}

export default App;