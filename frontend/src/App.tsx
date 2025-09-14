import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import { useState } from "react";



function App() {
  const [triggerRefresh, setTriggerRefresh] = useState<number | null>(null);
  const token = localStorage.getItem("token");

  let authenticated = false;

  if (token) {
    authenticated = true;
  }

  if (!authenticated) {
    return (
      <>
        <Routes>
          <Route path="*" element={<Navigate to="/login" />} />
          <Route path="/login/*" element={<Navigate to="/login" />} />
          <Route path='/login' element={<Login setTriggerRefresh={setTriggerRefresh} />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </>
    )
  }
  if (authenticated) {
    return (
      <Routes>
        <Route path="*" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Navigate to="/dashboard" replace />} />
        <Route path="/forgotpassword" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    )
  }
}

export default App
